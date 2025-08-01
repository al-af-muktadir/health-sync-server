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
exports.auth = void 0;
const jwtEncoder_1 = require("../../shared/jwtEncoder");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            // console.log("Token:", token);
            if (!token) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not Authorized");
                // console.log("No token provided");
            }
            const verifiedUser = jwtEncoder_1.jwtEncoded.verifyToken(token, config_1.default.jwt_secret);
            req.user = verifiedUser;
            // console.log("User:", verifiedUser);
            // console.log("Verified User:", verifiedUser);
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are Unauthorized");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.auth = auth;
