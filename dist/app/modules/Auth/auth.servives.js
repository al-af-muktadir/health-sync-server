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
exports.authServices = void 0;
const client_1 = require("../../../generated/prisma/client");
const jwtEncoder_1 = require("../../../shared/jwtEncoder");
const Prisma_1 = require("../../../shared/Prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const loginUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // const result=await prisma.
    const userInfo = yield Prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: userData.email,
        },
    });
    // console.log("user", userInfo);
    const isCorrectPassword = bcrypt_1.default.compare(userInfo.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password Is Incorrect");
    }
    let data = {};
    if (userInfo.role === client_1.UserRole.ADMIN) {
        data = yield Prisma_1.prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        data = yield Prisma_1.prisma.doctor.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.PATIENT) {
        data = yield Prisma_1.prisma.patient.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    const modifiedData = {
        email: userInfo.email,
        password: userInfo.password,
        profilePhoto: data === null || data === void 0 ? void 0 : data.profilePhoto,
        name: data === null || data === void 0 ? void 0 : data.name,
    };
    console.log(modifiedData);
    const accessToken = jwtEncoder_1.jwtEncoded.generateToken(modifiedData, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    const refreshToken = jwtEncoder_1.jwtEncoded.generateToken(modifiedData, config_1.default.refresh_secret, config_1.default.refresh_expires_in);
    return {
        refreshToken,
        accessToken,
        needPassWordChange: userInfo.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtEncoder_1.jwtEncoded.verifyToken(token, "saasdsadasd");
    }
    catch (err) {
        throw new Error("You are not Authorized");
    }
    const userData = yield Prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    let data = {};
    if (userData.role === client_1.UserRole.ADMIN) {
        data = yield Prisma_1.prisma.admin.findUniqueOrThrow({
            where: {
                email: userData.email,
            },
        });
    }
    else if (userData.role === client_1.UserRole.DOCTOR) {
        data = yield Prisma_1.prisma.doctor.findUniqueOrThrow({
            where: {
                email: userData.email,
            },
        });
    }
    else if (userData.role === client_1.UserRole.PATIENT) {
        data = yield Prisma_1.prisma.patient.findUniqueOrThrow({
            where: {
                email: userData.email,
            },
        });
    }
    const modifiedData = {
        email: userData.email,
        password: userData.password,
        profilePhoto: data === null || data === void 0 ? void 0 : data.profilePhoto,
        name: data === null || data === void 0 ? void 0 : data.name,
    };
    const accessToken = jwtEncoder_1.jwtEncoded.generateToken(modifiedData, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    return { accessToken, needPasswordChange: userData.needPasswordChange };
});
const changePassword = (userData, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isPasswordMatched = bcrypt_1.default.compare(data.oldPassword, user.password);
    if (!isPasswordMatched) {
        throw new Error("Password Doesnot Matched");
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.newPassword, 12);
    yield Prisma_1.prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password Changed Succesfully",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("payload", payload);
    const userData = yield Prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const forgotPasswordToken = jwtEncoder_1.jwtEncoded.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    const emailLink = config_1.default.base_url + `?id=${userData.id}&token=${forgotPasswordToken}`;
    yield (0, emailSender_1.default)(userData.email, `
      <div>
       <p> Dear User, </P>
       <p> You Password Reset Link is here
       <a href="${emailLink}"><button> Reset Password</button></a>
       </p> 
       
       </div>`);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield Prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const verifiedUser = jwtEncoder_1.jwtEncoded.verifyToken(token, config_1.default.jwt_secret);
    if (!verifiedUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not Authorized");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    const resetPassword = yield Prisma_1.prisma.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password: hashedPassword,
        },
    });
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
