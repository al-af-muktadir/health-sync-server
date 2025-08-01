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
exports.DiseaseController = exports.createDisease = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const diagnosis_service_1 = require("./diagnosis.service");
// import catchAsync from "../utils/catchAsync";
// import { DiseaseService } from "../services/disease.service";
// import sendResponse from "../utils/sendResponse";
// import { createDiseaseZodSchema } from "../validations/disease.validation";
exports.createDisease = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("disease controller", req.body);
    const result = yield diagnosis_service_1.DiseaseService.createDisease(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: "Disease created successfully",
        data: result,
    });
}));
const getDoctorsByDiseaseName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const diseaseName = req.params.diseaseName;
    console.log("diseaseName", diseaseName);
    const doctors = yield diagnosis_service_1.DiseaseService.getDoctorsByDiseaseName(diseaseName);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: `Doctors fetched for disease: ${diseaseName}`,
        data: doctors,
    });
}));
exports.DiseaseController = {
    createDisease: exports.createDisease,
    getDoctorsByDiseaseName,
};
