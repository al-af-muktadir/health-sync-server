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
exports.specialtiresController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const specialties_service_1 = require("./specialties.service");
const createSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.specialtiesService.createSpecialtiesIntoDb(req);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Specialties Created Successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const getSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.specialtiesService.getSpecialtiesFromDb();
    (0, sendResponse_1.sendResponse)(res, {
        message: "Specialties Retrieved Successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const deleteSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.specialtiesService.deleteSpecialtiesFromDb(req.params);
    (0, sendResponse_1.sendResponse)(res, {
        message: " Specialties Deleted Successfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
exports.specialtiresController = {
    createSpecialties,
    getSpecialties,
    deleteSpecialties,
};
