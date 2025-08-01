import express from "express";
import { docScheduleController } from "./doctorSchedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.post("/", auth(UserRole.DOCTOR), docScheduleController.insertIntoDb);
router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  docScheduleController.getMySchedule
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  docScheduleController.deleteFromDB
);
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  docScheduleController.getAllFromDb
);

export const doctorScheduleRoute = router;
