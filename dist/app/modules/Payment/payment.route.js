"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/init-payment/:appointmentId", (0, auth_1.auth)(client_1.UserRole.PATIENT), payment_controller_1.paymentController.initPayment);
router.get("/ipn", payment_controller_1.paymentController.validatePayment);
exports.PaymentRouter = router;
