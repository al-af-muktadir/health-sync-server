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
      const result = await prisma.schedule.create({
        data: scheduleData as any,
      });
      schedules.push(result);
      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllFromDb = async (params: any, options: any) => {
  const { startDate, endDate, ...restData } = params;
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  console.log("params", restData);
  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (Object.keys(restData).length > 0) {
    andCondition.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };
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
  const result = await prisma.schedule.findMany({
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

  const total = await prisma.schedule.count({
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

export const scheduleService = {
  insertIntoDb,
  getAllFromDb,
};
