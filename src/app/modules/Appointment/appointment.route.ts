import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { appointmentController } from "./appointment.controller";
const router = express.Router();
router.post("/", auth(UserRole.PATIENT), appointmentController.makeAppointment);
router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  appointmentController.getmyAppointment
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  appointmentController.getAllAppointments
);
export const appointmentRouter = router;
