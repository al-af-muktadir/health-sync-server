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
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const pick_1 = require("../../../shared/pick");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = require("../../../utils/sendResponse");
const User_constant_1 = require("./User.constant");
const User_service_1 = require("./User.service");
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
    const result = yield User_service_1.UserServices.createAdminIntoDb(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Admin Created Successfully",
        data: result,
    });
}));
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const result = yield User_service_1.UserServices.createDoctorIntoDb(req);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Doctor Created Successfully",
        data: result,
    });
}));
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("incpm", req.body);
    const result = yield User_service_1.UserServices.createPatientIntoDb(req);
    // console.log(result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Patient Created Successfully",
        data: result,
    });
}));
const getAllAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterThings = (0, pick_1.pick)(req.query, User_constant_1.QueriesFields);
    const OtherOptions = (0, pick_1.pick)(req.query, [
        "sortBy",
        "sortOrder",
        "page",
        "limit",
    ]);
    const result = yield User_service_1.UserServices.getAllAdminFromDb(filterThings, OtherOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Admins Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const userSoftDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_service_1.UserServices.deleteUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        data: result,
        message: "User Deleted Succesfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_service_1.UserServices.getUser(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        data: result,
        message: "User Retrieved Succesfully",
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterThings = (0, pick_1.pick)(req.query, User_constant_1.UserFilterableFields);
    const OtherOptions = (0, pick_1.pick)(req.query, [
        "sortBy",
        "sortOrder",
        "page",
        "limit",
    ]);
    const result = yield User_service_1.UserServices.getAllUserFromDb(filterThings, OtherOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updateStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.params, req.body);
    const result = yield User_service_1.UserServices.updateStatus(req.params, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "All Users Retrieved Successfully",
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(req.params, req.body);
    const result = yield User_service_1.UserServices.updateMyProfile(user, req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: "Profile Updated Successfully",
        data: result,
    });
}));
exports.UserController = {
    createAdmin,
    getAllAdmin,
    userSoftDelete,
    updateMyProfile,
    createDoctor,
    getUser,
    createPatient,
    getAllUser,
    updateStatus,
};
