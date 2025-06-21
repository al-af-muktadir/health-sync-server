import { Prisma } from "@prisma/client";
import { pagination } from "../../../utils/Paginator";
import prisma from "../../../shared/Prisma";
import { patientSearchableFields } from "./patient.constant";

const getAllPatientFromDb = async (params: any, options: any) => {
  const { searchTerm, ...restData } = params;
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  console.log("params", restData);
  const andCondition: Prisma.PatientWhereInput[] = [];

  const searchFields = patientSearchableFields;
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

  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };
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
  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
    include: {
      patient_health_data: true,
      medical_report: true,
    },
  });

  const total = await prisma.patient.count({
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
const getById = async (id: any) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  return result;
};

const updateIntoDb = async (id: any, data: any) => {
  const result = await prisma.patient.update({
    where: {
      id,
    },
    data: data,
  });
  return result;
};
export const patientService = {
  getAllPatientFromDb,
  getById,
  updateIntoDb,
};
