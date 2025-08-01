import prisma from "../../../shared/Prisma";
import { v4 as uuidv4 } from "uuid";
import { pagination } from "../../../utils/Paginator";
import { Prisma } from "@prisma/client";
const makeAppointment = async (user: any, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const doctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId = uuidv4();
  const result = await prisma.$transaction(async (transactionClient) => {
    const appointmentData = await transactionClient.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: doctorScheduleData.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });
    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    const today = new Date();
    const transactionId =
      "HealthSync-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDate() +
      "-" +
      today.getMinutes() +
      "-" +
      uuidv4();
    await transactionClient.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });
    return appointmentData;
  });
  return result;
};

const getmyappointment = async (user: any, filters: any, options: any) => {
  const { ...restData } = filters;
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  // console.log("params", restData);
  const andCondition: Prisma.AppointmentWhereInput[] = [];
  if (Object.keys(restData).length > 0) {
    andCondition.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  if (user.role === "PATIENT") {
    andCondition.push({
      patient: {
        email: {
          equals: user.email,
        },
      },
    });
  } else if (user.role === "DOCTOR") {
    andCondition.push({
      doctor: {
        email: {
          equals: user.email,
        },
      },
    });
  }
  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };
  console.log(whereCondition);

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    include:
      user.role === "PATIENT"
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: {
                medical_report: true,
                patient_health_data: true,
              },
            },
            schedule: true,
          },
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.appointment.count({
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
const getAllAppointments = async (filters: any, options: any) => {
  const { ...restData } = filters;
  const { page, limit, sortBy, sortOrder, skip } = pagination(options);
  // console.log("params", restData);
  const andCondition: Prisma.AppointmentWhereInput[] = [];
  if (Object.keys(restData).length > 0) {
    andCondition.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: {
          equals: restData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };
  console.log(whereCondition);

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    include: {
      patient: true,
      doctor: true,
      schedule: true,
    },
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.appointment.count({
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

export const appointmentService = {
  makeAppointment,
  getmyappointment,
  getAllAppointments,
};
