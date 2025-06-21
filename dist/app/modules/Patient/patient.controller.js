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
exports.patientController = void 0;
const pick_1 = require("../../../shared/pick");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const patient_constant_1 = require("./patient.constant");
const patient_service_1 = require("./patient.service");
const getAllPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterThings = (0, pick_1.pick)(req.query, patient_constant_1.patientFilterableFields);
    const OtherOptions = (0, pick_1.pick)(req.query, [
        "sortBy",
        "sortOrder",
        "page",
        "limit",
    ]);
    const result = yield patient_service_1.patientService.getAllPatientFromDb(filterThings, OtherOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Patient Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield patient_service_1.patientService.getById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: " Patient Retrieved Successfully",
        data: result,
    });
}));
const updateIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield patient_service_1.patientService.updateIntoDb(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: " Patient Updated Successfully",
        data: result,
    });
}));
exports.patientController = {
    getAllPatient,
    updateIntoDb,
    getById,
};
