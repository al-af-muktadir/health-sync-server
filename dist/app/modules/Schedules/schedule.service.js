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
exports.scheduleService = void 0;
const date_fns_1 = require("date-fns");
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const Paginator_1 = require("../../../utils/Paginator");
// import {addHours} from "date-fns"
const insertIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let schedules = [];
    const { startDate, endDate, startTime, endTime } = data;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    while (currentDate <= lastDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: (0, date_fns_1.addMinutes)(startDateTime, 30),
            };
            const existingSchedule = yield Prisma_1.default.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime,
                },
            });
            if (!existingSchedule) {
                const result = yield Prisma_1.default.schedule.create({
                    data: scheduleData,
                });
                schedules.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + 30);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
});
const getAllFromDb = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = params, restData = __rest(params, ["startDate", "endDate"]);
    // console.log("adasd", startDateTime, endDataTime, restData);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    //("params", restData);
    const andCondition = [];
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
    const whereCondition = { AND: andCondition };
    const doctorSchedule = yield Prisma_1.default.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email,
            },
        },
    });
    console.log(doctorSchedule, "sdasd");
    const doctorScheduleIds = doctorSchedule.map((schedule) => schedule.scheduleId);
    const result = yield Prisma_1.default.schedule.findMany({
        where: Object.assign(Object.assign({}, whereCondition), { id: {
                notIn: doctorScheduleIds,
            } }),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield Prisma_1.default.schedule.count({
        where: Object.assign(Object.assign({}, whereCondition), { id: {
                notIn: doctorScheduleIds,
            } }),
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
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.schedule.findUnique({
        where: {
            id,
        },
    });
    //console.log(result?.startDateTime.getHours() + ":" + result?.startDateTime.getMinutes())
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.schedule.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.scheduleService = {
    insertIntoDb,
    getAllFromDb,
    getByIdFromDB,
    deleteFromDB,
};
