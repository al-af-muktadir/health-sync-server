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
exports.docController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const doctor_service_1 = require("./doctor.service");
const pick_1 = require("../../../shared/pick");
const doctor_constant_1 = require("./doctor.constant");
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.docServices.deleteDoctor(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        data: result,
        message: "User Deleted Succesfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getDoctorById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.docServices.getDoctorById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        data: result,
        message: "User Deleted Succesfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getAllDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterThings = (0, pick_1.pick)(req.query, doctor_constant_1.doctorFilterableFields);
    const OtherOptions = (0, pick_1.pick)(req.query, [
        "sortBy",
        "sortOrder",
        "page",
        "limit",
    ]);
    const result = yield doctor_service_1.docServices.getAllDoctorFromDb(filterThings, OtherOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Doctors Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updatedoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.docServices.updatedoctor(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Updated Successfully",
        data: result,
    });
}));
exports.docController = {
    deleteDoctor,
    getDoctorById,
    getAllDoctor,
    updatedoctor,
};
