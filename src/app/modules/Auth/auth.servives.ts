import { Secret } from "jsonwebtoken";

import { jwtEncoded } from "../../../shared/jwtEncoder";
import prisma from "../../../shared/Prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import emailSender from "./emailSender";
import APiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { UserRole, UserStatus } from "@prisma/client";
type TUser = {
  email: string;
  password: string;
};
const loginUser = async (userData: TUser) => {
  // const result=await prisma.
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
    },
  });
  // console.log("user", userInfo);
  const isCorrectPassword = bcrypt.compare(
    userInfo.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password Is Incorrect");
  }
  let data = {};

  if (userInfo.role === UserRole.ADMIN) {
    data = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    data = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    data = await prisma.patient.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }
  const modifiedData = {
    email: userInfo.email,
    password: userInfo.password,
    profilePhoto: (data as any)?.profilePhoto,
    name: (data as any)?.name,
  };
  console.log(modifiedData);
  const accessToken = jwtEncoded.generateToken(
    modifiedData,
    config.jwt_secret as string,
    config.jwt_expires_in as string
  );
  const refreshToken = jwtEncoded.generateToken(
    modifiedData,
    config.refresh_secret as string,
    config.refresh_expires_in as string
  );

  return {
    refreshToken,
    accessToken,
    needPassWordChange: userInfo.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtEncoded.verifyToken(token, "saasdsadasd");
  } catch (err) {
    throw new Error("You are not Authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  let data = {};

  if (userData.role === UserRole.ADMIN) {
    data = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userData.email,
      },
    });
  } else if (userData.role === UserRole.DOCTOR) {
    data = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: userData.email,
      },
    });
  } else if (userData.role === UserRole.PATIENT) {
    data = await prisma.patient.findUniqueOrThrow({
      where: {
        email: userData.email,
      },
    });
  }
  const modifiedData = {
    email: userData.email,
    password: userData.password,
    profilePhoto: (data as any)?.profilePhoto,
    name: (data as any)?.name,
  };
  const accessToken = jwtEncoded.generateToken(
    modifiedData,
    config.jwt_secret as Secret,
    config.jwt_expires_in as string
  );
  return { accessToken, needPasswordChange: userData.needPasswordChange };
};

const changePassword = async (
  userData: any,
  data: { newPassword: string; oldPassword: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isPasswordMatched = bcrypt.compare(data.oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password Doesnot Matched");
  }
  const hashedPassword = await bcrypt.hash(data.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password Changed Succesfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  console.log("payload", payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const forgotPasswordToken = jwtEncoded.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string
  );

  const emailLink =
    config.base_url + `?id=${userData.id}&token=${forgotPasswordToken}`;
  await emailSender(
    userData.email,
    `
      <div>
       <p> Dear User, </P>
       <p> You Password Reset Link is here
       <a href="${emailLink}"><button> Reset Password</button></a>
       </p> 
       
       </div>`
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  const verifiedUser = jwtEncoded.verifyToken(
    token,
    config.jwt_secret as Secret
  );
  if (!verifiedUser) {
    throw new APiError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const resetPassword = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};
export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
