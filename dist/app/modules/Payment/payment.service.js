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
exports.paymentService = void 0;
const config_1 = __importDefault(require("../../../config"));
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const initPayment = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentData = yield Prisma_1.default.payment.findFirstOrThrow({
        where: {
            appointmentId: appointmentId,
        },
        include: {
            appointment: {
                include: {
                    patient: true,
                },
            },
        },
    });
    try {
        const data = {
            store_id: config_1.default.ssl.storeId,
            store_passwd: config_1.default.ssl.storePass,
            total_amount: paymentData.amount,
            currency: "BDT",
            tran_id: paymentData.transactionId, // use unique tran_id for each api call
            success_url: config_1.default.ssl.successUrl,
            fail_url: config_1.default.ssl.failedUrl,
            cancel_url: config_1.default.ssl.cancelUrl,
            ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Appointment",
            product_category: "Service",
            product_profile: "general",
            cus_name: paymentData.appointment.patient.name,
            cus_email: paymentData.appointment.patient.email,
            cus_add1: paymentData.appointment.patient.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: paymentData.appointment.patient.contactNumber,
            cus_fax: "01711111111",
            ship_name: "Customer Name",
            ship_add1: "Dhaka",
            ship_add2: "Dhaka",
            ship_city: "Dhaka",
            ship_state: "Dhaka",
            ship_postcode: 1000,
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: config_1.default.ssl.ssl_payment_api,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const gatewayUrl = response.data.GatewayPageURL;
        return {
            paymentUrl: gatewayUrl,
        };
    }
    catch (err) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment Error Occured");
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Payment validation function called");
    if (!payload || !payload.status || !(payload.status === "VALID")) {
        return {
            message: "Invalid Payment",
        };
    }
    let validationResponse;
    try {
        validationResponse = yield (0, axios_1.default)({
            method: "GET",
            url: `${config_1.default.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config_1.default.ssl.storeId}&store_passwd=${config_1.default.ssl.storePass}&format=json`,
        });
        if (validationResponse.data.status !== "VALID") {
            return {
                message: "Payment Validation Failed",
            };
        }
    }
    catch (err) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment Validation Error");
    }
    const result = yield Prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const paymentData = yield tx.payment.update({
            where: {
                transactionId: payload.tran_id,
            },
            data: {
                status: client_1.PaymentStatus.PAID,
                paymentGatewayData: validationResponse.data,
            },
        });
        yield tx.appointment.update({
            where: {
                id: paymentData.appointmentId,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        });
        return {
            message: "Payment Succussfully",
        };
    }));
});
exports.paymentService = {
    initPayment,
    validatePayment,
};
