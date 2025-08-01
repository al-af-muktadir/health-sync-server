import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { paymentController } from "./payment.controller";

const router = express.Router();
router.post(
  "/init-payment/:appointmentId",
  auth(UserRole.PATIENT),
  paymentController.initPayment
);

router.get("/ipn", paymentController.validatePayment);

export const PaymentRouter = router;
