import prisma from "../../../shared/Prisma";

const insertIntoDb = async (user: any, payload: any) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  //   const
  const doctorScheduleData = payload.scheduleIds.map((sid: any) => ({
    doctorId: user.id,
    scheduleId: sid,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
  return result;
};

export const doctorScheduleService = {
  insertIntoDb,
};
