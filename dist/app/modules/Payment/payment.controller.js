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
exports.paymentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = require("../../../utils/sendResponse");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.initPayment(req.params.appointmentId);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Payment Initiate successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
const validatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.validatePayment(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Payment Validate successfully",
        data: result,
        statusCode: http_status_codes_1.StatusCodes.OK,
    });
}));
exports.paymentController = {
    initPayment,
    validatePayment,
};
