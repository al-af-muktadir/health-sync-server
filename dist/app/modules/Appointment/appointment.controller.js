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
exports.appointmentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const appointment_service_1 = require("./appointment.service");
const pick_1 = require("../../../shared/pick");
const makeAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_service_1.appointmentService.makeAppointment(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Appointment made successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getmyAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ["status", "paymentStatus"]);
    const options = (0, pick_1.pick)(req.query, ["sortBy", "limit", "page", "sortOrder"]);
    const result = yield appointment_service_1.appointmentService.getmyappointment(req.user, filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Appointment Retrieved successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getAllAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ["status", "paymentStatus"]);
    const options = (0, pick_1.pick)(req.query, ["sortBy", "limit", "page", "sortOrder"]);
    const result = yield appointment_service_1.appointmentService.getAllAppointments(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Appointment Retrieved successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
exports.appointmentController = {
    makeAppointment,
    getmyAppointment,
    getAllAppointments,
};
