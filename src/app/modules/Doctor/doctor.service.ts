import { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/Prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { pagination } from "../../../utils/Paginator";
import { title } from "process";

const deleteDoctor = async (id: any) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const updateDoctor = await transactionClient.doctor.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });
    const updateUser = await transactionClient.user.update({
      where: {
        email: updateDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  });
  return result;
};

const getDoctorById = async (id: any) => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  return result;
};

const getAllDoctorFromDb = async (params: any, options: any) => {
  const { searchTerm, specialties, ...restData } = params;
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  console.log("params", restData);
  const andCondition: Prisma.DoctorWhereInput[] = [];

  const searchFields = doctorSearchableFields;
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
  if (specialties && specialties.length > 0) {
    andCondition.push({
      doctorspecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  } //doctor-doctorSP-sp
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

  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };
  // console.log(whereCondition);
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
  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include: {
      specialty: true,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.doctor.count({
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
const updatedoctor = async (id: any, data: any) => {
  const { specialties, ...restData } = data;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  await prisma.$transaction(async (transactionClient) => {
    const updateDoctor = await transactionClient.doctor.update({
      where: {
        id: doctorData.id,
      },
      data: restData,
    });

    if (specialties && specialties.length > 0) {
      const deletedSpecialties = specialties.filter(
        (sp: any) => sp.isDeleted === true
      );
      if (deletedSpecialties) {
        for (const sp of deletedSpecialties) {
          await transactionClient.doctorSpecialties.deleteMany({
            where: {
              doctorId: doctorData.id,
              specialitiesId: sp.spId,
            },
          });
        }
      }
      const addedSpecialties = specialties.filter(
        (sp: any) => sp.isDeleted === false
      );
      if (addedSpecialties) {
        for (const sp of addedSpecialties) {
          await transactionClient.doctorSpecialties.create({
            data: {
              doctorId: doctorData.id,
              specialitiesId: sp.spId,
            },
          });
        }
      }
    }
  });

  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorData.id,
    },
  });
  return result;
};
export const docServices = {
  deleteDoctor,
  getDoctorById,
  getAllDoctorFromDb,
  updatedoctor,
};
