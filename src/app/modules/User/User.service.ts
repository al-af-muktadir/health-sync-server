// import {
//   Prisma,
//   PrismaClient,
//   UserRole,
//   UserStatus,
// } from "../../../generated/prisma/client";
import bcrypt from "bcrypt";
import { searchableFields } from "./User.constant";
import { pagination } from "../../../utils/Paginator";
// import { prisma } from "../../../shared/Prisma";
import { fileUploader } from "../../../shared/fileUploader";
import {
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
} from "../../../generated/prisma";
const prisma = new PrismaClient();
const createDoctorIntoDb = async (req: any) => {
  const file = req.file;
  console.log("req.body", req.body);

  if (file) {
    const uploadToCloudinary = (await fileUploader.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
    });

    const createDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    console.log("createDoctorData", createDoctorData);
    return createDoctorData;
  });
  console.log("result", result);
  return result;
};
const createPatientIntoDb = async (req: any) => {
  const file = req.file;
  console.log("req.body", req.body);

  if (file) {
    const uploadToCloudinary = (await fileUploader.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
    });

    const createPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });
    console.log("createPatientData", createPatientData);
    return createPatientData;
  });
  console.log("result", result);
  return result;
};
const createAdminIntoDb = async (req: any) => {
  const file = req.file;
  // if (file) {
  //   const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
  //   req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  // }
  if (file) {
    const uploadToCloudinary = (await fileUploader.uploadToCloudinary(
      file
    )) as { secure_url?: string };
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createAdminData;
  });

  return result;
};

const getAllUserFromDb = async (params: any, options: any) => {
  const { searchTerm, ...restData } = params;
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  console.log("params", restData);
  const andCondition: Prisma.AdminWhereInput[] = [];

  const searchFields = searchableFields;
  if (params.searchTerm) {
    andCondition.push({
      OR: searchFields.map((field: string) => ({
        //where:{or:[{name:{contains,mode}},{},{}]}//snp
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(restData).length > 0) {
    andCondition.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });
  // console.log(andCondition);

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  console.log(whereCondition);
  //  {
  //   AND: [
  //     {
  //       OR: [
  //         { name: { contains: "john", mode: "insensitive" } },
  //         { email: { contains: "john", mode: "insensitive" } }
  //       ]
  //     },
  //     {
  //       AND: [
  //         { isActive: { equals: true } },
  //         { department: { equals: "sales" } }
  //       ]
  //     }
  //   ]
  // }
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteUser = async (id: any) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDelete = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userDelete = await transactionClient.user.update({
      where: {
        email: adminDelete.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDelete;
  });

  return result;
};

const getUser = async (params: any) => {
  let UserInformation;
  if ((params.role = UserRole.ADMIN)) {
    UserInformation = await prisma.admin.findUniqueOrThrow({
      where: {
        email: params.email,
      },
    });
    return UserInformation;
  } else if ((params.role = UserRole.DOCTOR)) {
    UserInformation = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: params.email,
      },
    });
    return UserInformation;
  } else if ((params.role = UserRole.PATIENT)) {
    UserInformation = await prisma.patient.findUniqueOrThrow({
      where: {
        email: params.email,
      },
    });
    return UserInformation;
  }
};
export const UserServices = {
  createAdminIntoDb,
  getAllUserFromDb,
  deleteUser,
  getUser,
  createDoctorIntoDb,
  createPatientIntoDb,
};
