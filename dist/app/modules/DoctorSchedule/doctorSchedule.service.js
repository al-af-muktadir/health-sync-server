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
exports.doctorScheduleService = void 0;
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const Paginator_1 = require("../../../utils/Paginator");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const insertIntoDb = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("payload", payload);
    const doctorData = yield Prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    //   const
    const doctorScheduleData = payload.scheduleIds.map((sid) => ({
        doctorId: doctorData.id,
        scheduleId: sid,
    }));
    const result = yield Prisma_1.default.doctorSchedules.createMany({
        data: doctorScheduleData,
    });
    return result;
});
const getMyScheduleFromDb = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = params, restData = __rest(params, ["startDate", "endDate"]);
    // console.log("adasd", startDateTime, endDataTime, restData);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    //("params", restData);
    const andCondition = [];
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
        }
        else if (restData.isBooked === "string" &&
            restData.isBooked === "false") {
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
    const whereCondition = {
        AND: andCondition,
    };
    const result = yield Prisma_1.default.doctorSchedules.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {},
    });
    const total = yield Prisma_1.default.doctorSchedules.count({
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
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = (0, Paginator_1.pagination)(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
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
        if (typeof filterData.isBooked === "string" &&
            filterData.isBooked === "true") {
            filterData.isBooked = true;
        }
        else if (typeof filterData.isBooked === "string" &&
            filterData.isBooked === "false") {
            filterData.isBooked = false;
        }
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield Prisma_1.default.doctorSchedules.findMany({
        include: {
            doctor: true,
            schedule: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {},
    });
    const total = yield Prisma_1.default.doctorSchedules.count({
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
});
const deleteFromDb = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = yield Prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isBooked = yield Prisma_1.default.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: id,
            isBooked: true,
        },
    });
    if (isBooked) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You Cannot Delete The Booked Schedule");
    }
    const result = yield Prisma_1.default.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: id,
            },
        },
    });
});
exports.doctorScheduleService = {
    insertIntoDb,
    getMyScheduleFromDb,
    deleteFromDb,
    getAllFromDB,
};
