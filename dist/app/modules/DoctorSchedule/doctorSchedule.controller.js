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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docScheduleController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const pick_1 = require("../../../shared/pick");
const insertIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctorSchedule_service_1.doctorScheduleService.insertIntoDb(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Doctor Schdule Created Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getMySchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ["startDate", "endDate", "isBooked"]);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield doctorSchedule_service_1.doctorScheduleService.getMyScheduleFromDb(filters, options, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Retreied  Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctorSchedule_service_1.doctorScheduleService.deleteFromDb(req.user, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        message: "My SChedule Deleted  Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getAllFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ["startDate", "endDate"]);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield doctorSchedule_service_1.doctorScheduleService.getAllFromDB(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        message: "All Schedule Retrieved  Successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
exports.docScheduleController = {
    insertIntoDb,
    getMySchedule,
    deleteFromDB,
    getAllFromDb,
};
