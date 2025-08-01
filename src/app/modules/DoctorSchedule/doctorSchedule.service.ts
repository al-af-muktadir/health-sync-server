import { Prisma } from "@prisma/client";
import prisma from "../../../shared/Prisma";
import { pagination } from "../../../utils/Paginator";
import APiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const insertIntoDb = async (user: any, payload: any) => {
  console.log("payload", payload);
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  //   const
  const doctorScheduleData = payload.scheduleIds.map((sid: any) => ({
    doctorId: doctorData.id,
    scheduleId: sid,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
  return result;
};

const getMyScheduleFromDb = async (params: any, options: any, user: any) => {
  const { startDate, endDate, ...restData } = params;
  // console.log("adasd", startDateTime, endDataTime, restData);
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  //("params", restData);
  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];
  andCondition.push({
    doctor: {
      email: user.email,
    },
  });
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(restData).length > 0) {
    if (restData.isBooked === "string" && restData.isBooked === "true") {
      restData.isBooked = true;
    } else if (
      restData.isBooked === "string" &&
      restData.isBooked === "false"
    ) {
      restData.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  // //(andCondition);

  const whereCondition: Prisma.DoctorSchedulesWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
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
const getAllFromDB = async (filters: any, options: any) => {
  const { limit, page, skip } = pagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctorSchedules.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteFromDb = async (user: any, id: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isBooked = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: id,

      isBooked: true,
    },
  });

  if (isBooked) {
    throw new APiError(
      StatusCodes.BAD_REQUEST,
      "You Cannot Delete The Booked Schedule"
    );
  }
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: id,
      },
    },
  });
};
export const doctorScheduleService = {
  insertIntoDb,
  getMyScheduleFromDb,
  deleteFromDb,
  getAllFromDB,
};
