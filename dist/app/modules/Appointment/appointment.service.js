"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentService = void 0;
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const uuid_1 = require("uuid");
const Paginator_1 = require("../../../utils/Paginator");
const makeAppointment = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patientData = yield Prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const doctorData = yield Prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
        },
    });
    const doctorScheduleData = yield Prisma_1.default.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });
    const videoCallingId = (0, uuid_1.v4)();
    const result = yield Prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const appointmentData = yield transactionClient.appointment.create({
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
        yield transactionClient.doctorSchedules.update({
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
        const transactionId = "HealthSync-" +
            today.getFullYear() +
            "-" +
            today.getMonth() +
            "-" +
            today.getDate() +
            "-" +
            today.getMinutes() +
            "-" +
            (0, uuid_1.v4)();
        yield transactionClient.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            },
        });
        return appointmentData;
    }));
    return result;
});
const getmyappointment = (user, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const restData = __rest(filters, []);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    // console.log("params", restData);
    const andCondition = [];
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
    }
    else if (user.role === "DOCTOR") {
        andCondition.push({
            doctor: {
                email: {
                    equals: user.email,
                },
            },
        });
    }
    const whereCondition = { AND: andCondition };
    console.log(whereCondition);
    const result = yield Prisma_1.default.appointment.findMany({
        where: whereCondition,
        skip,
        include: user.role === "PATIENT"
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
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield Prisma_1.default.appointment.count({
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
});
const getAllAppointments = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const restData = __rest(filters, []);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    // console.log("params", restData);
    const andCondition = [];
    if (Object.keys(restData).length > 0) {
        andCondition.push({
            AND: Object.keys(restData).map((key) => ({
                [key]: {
                    equals: restData[key],
                },
            })),
        });
    }
    const whereCondition = { AND: andCondition };
    console.log(whereCondition);
    const result = yield Prisma_1.default.appointment.findMany({
        where: whereCondition,
        skip,
        include: {
            patient: true,
            doctor: true,
            schedule: true,
        },
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield Prisma_1.default.appointment.count({
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
});
exports.appointmentService = {
    makeAppointment,
    getmyappointment,
    getAllAppointments,
};
