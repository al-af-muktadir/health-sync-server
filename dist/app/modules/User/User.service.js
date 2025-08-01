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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_constant_1 = require("./User.constant");
const Paginator_1 = require("../../../utils/Paginator");
const fileUploader_1 = require("../../../shared/fileUploader");
const client_1 = require("@prisma/client");
// import { uploadToCloudinary } from "../../../shared/fileUploader";
const prisma = new client_1.PrismaClient();
const createDoctorIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    console.log("req.body in service", req.body.doctor);
    if (file) {
        const uploadToCloudinary = (yield fileUploader_1.fileUploader.uploadToCloudinary(file));
        req.body.doctor.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    console.log("hashedPassword", hashedPassword);
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: client_1.UserRole.DOCTOR,
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createUserData = yield transactionClient.user.create({
            data: userData,
        });
        const createDoctorData = yield transactionClient.doctor.create({
            data: req.body.doctor,
        });
        return createDoctorData;
    }));
    console.log("result", result);
    return result;
});
const createPatientIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log("req.file", file);
    if (file) {
        const uploadToCloudinary = (yield fileUploader_1.fileUploader.uploadToCloudinary(file));
        req.body.patient.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: client_1.UserRole.PATIENT,
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createUserData = yield transactionClient.user.create({
            data: userData,
        });
        const createPatientData = yield transactionClient.patient.create({
            data: req.body.patient,
        });
        // console.log("createPatientData", createPatientData);
        return createPatientData;
    }));
    // ("console.logresult", result);
    return result;
});
const createAdminIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // if (file) {
    //   const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    //   req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
    // }
    if (file) {
        const uploadToCloudinary = (yield fileUploader_1.fileUploader.uploadToCloudinary(file));
        req.body.admin.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN,
    };
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createUserData = yield transactionClient.user.create({
            data: userData,
        });
        const createAdminData = yield transactionClient.admin.create({
            data: req.body.admin,
        });
        return createAdminData;
    }));
    return result;
});
const getAllAdminFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, restData = __rest(params, ["searchTerm"]);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    // console.log("params", restData);
    const andCondition = [];
    const searchFields = User_constant_1.searchableFields;
    if (params.searchTerm) {
        andCondition.push({
            OR: searchFields.map((field) => ({
                //where:{or:[{name:{contains,mode}},{},{}]}//snp
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
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
    andCondition.push({
        isDeleted: false,
    });
    // console.log(andCondition);
    const whereCondition = { AND: andCondition };
    console.log(whereCondition);
    //  {
    //   AND: [
    //     {
    //       OR: [
    //         { name: { contains: "john", mode: "insensitive" } },
    //         { email: { contains: "john", mode: "insensitive" } }
    //       ]
    //     },
    //     {
    //       AND: [
    //         { isActive: { equals: true } },
    //         { department: { equals: "sales" } }
    //       ]
    //     }
    //   ]
    // }
    const result = yield prisma.admin.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma.admin.count({
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
const getAllUserFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, restData = __rest(params, ["searchTerm"]);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    console.log("params", restData);
    const andCondition = [];
    const searchFields = User_constant_1.UserSearchableFields;
    if (params.searchTerm) {
        andCondition.push({
            OR: searchFields.map((field) => ({
                //where:{or:[{name:{contains,mode}},{},{}]}//snp
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
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
    // console.log(andCondition);
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    // console.log(wconsole.loghereCondition);
    //  {
    //   AND: [
    //     {
    //       OR: [
    //         { name: { contains: "john", mode: "insensitive" } },
    //         { email: { contains: "john", mode: "insensitive" } }
    //       ]
    //     },
    //     {
    //       AND: [
    //         { isActive: { equals: true } },
    //         { department: { equals: "sales" } }
    //       ]
    //     }
    //   ]
    // }
    const result = yield prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma.user.count({
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
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDelete = yield transactionClient.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        const userDelete = yield transactionClient.user.update({
            where: {
                email: adminDelete.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return adminDelete;
    }));
    return result;
});
const getUser = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let UserInformation;
    if (params.role === "ADMIN") {
        UserInformation = yield prisma.admin.findUniqueOrThrow({
            where: {
                email: params.email,
            },
        });
        return UserInformation;
    }
    else if (params.role === "DOCTOR") {
        UserInformation = yield prisma.doctor.findUniqueOrThrow({
            where: {
                email: params.email,
            },
        });
        return UserInformation;
    }
    else if (params.role === "PATIENT") {
        console.log("i am user");
        UserInformation = yield prisma.patient.findUniqueOrThrow({
            where: {
                email: params.email,
            },
        });
        return UserInformation;
    }
});
const updateStatus = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.findUniqueOrThrow({
        where: {
            email: email,
        },
    });
    const updateStatus = yield prisma.user.update({
        where: {
            email: email,
        },
        data: Object.assign({}, data),
    });
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        if (req && req.body) {
            req.body.profilePhoto = uploadToCloudinary.secure_url;
        }
    }
    let updateInfo;
    if (user.role === client_1.UserRole.SUPER_ADMIN) {
        updateInfo = yield prisma.admin.update({
            where: {
                email: user.email,
            },
            data: req.body,
        });
    }
    else if (user.role === client_1.UserRole.ADMIN) {
        updateInfo = yield prisma.admin.update({
            where: {
                email: user.email,
            },
            data: req.body,
        });
    }
    else if (user.role === client_1.UserRole.DOCTOR) {
        updateInfo = yield prisma.doctor.update({
            where: {
                email: user.email,
            },
            data: req.body,
        });
    }
    else if (user.role === client_1.UserRole.PATIENT) {
        updateInfo = yield prisma.patient.update({
            where: {
                email: user.email,
            },
            data: req.body,
        });
    }
    return updateInfo;
});
exports.UserServices = {
    createAdminIntoDb,
    getAllAdminFromDb,
    deleteUser,
    getUser,
    updateStatus,
    getAllUserFromDb,
    createDoctorIntoDb,
    createPatientIntoDb,
    updateMyProfile,
};
