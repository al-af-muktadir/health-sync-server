import { UserStatus } from "../../../generated/prisma";
import { jwtEncoded } from "../../../shared/jwtEncoder";
import { prisma } from "../../../shared/Prisma";
import bcrypt from "bcrypt";
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
  const isCorrectPassword = bcrypt.compare(
    userInfo.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password Is Incorrect");
  }
  const accessToken = jwtEncoded.generateToken(
    userData,
    process.env.JWT_SECRET as string,
    "365d"
  );
  const refreshToken = jwtEncoded.generateToken(
    userData,
    process.env.JWT_SECRET as string,
    "365d"
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
  const accessToken = jwtEncoded.generateToken(
    { email: userData.email, role: userData.role },
    "abcdefg",
    "5m"
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
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
};
export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
};
