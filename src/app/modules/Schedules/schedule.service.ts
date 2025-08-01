import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/Prisma";
import { stat } from "fs";
import { Prisma } from "@prisma/client";
import { pagination } from "../../../utils/Paginator";
// import {addHours} from "date-fns"
const insertIntoDb = async (data: any) => {
  let schedules = [];
  const { startDate, endDate, startTime, endTime } = data;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, 30),
      };
      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData as any,
        });
        schedules.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllFromDb = async (params: any, options: any, user: any) => {
  const { startDate, endDate, ...restData } = params;
  // console.log("adasd", startDateTime, endDataTime, restData);
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  //("params", restData);
  const andCondition: Prisma.ScheduleWhereInput[] = [];
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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

  // //(andCondition);

  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };
  const doctorSchedule = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });
  console.log(doctorSchedule, "sdasd");
  const doctorScheduleIds = doctorSchedule.map(
    (schedule) => schedule.scheduleId
  );
  const result = await prisma.schedule.findMany({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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
const getByIdFromDB = async (id: string) => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  //console.log(result?.startDateTime.getHours() + ":" + result?.startDateTime.getMinutes())
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};
export const scheduleService = {
  insertIntoDb,
  getAllFromDb,
  getByIdFromDB,
  deleteFromDB,
};
