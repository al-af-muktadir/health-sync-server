import express from "express";
import { scheduleController } from "./schedules.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  scheduleController.getByIdFromDB
);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleController.insertIntoDb
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleController.deleteFromDB
);

router.get("/", auth(UserRole.DOCTOR), scheduleController.getAllFromDB);
// router.get("/:id", scheduleController.getById);
// router.patch("/:id", scheduleController.updateIntoDb);
// router.patch("/:id", scheduleController.deletePatient);

export const ScheduleRoute = router;
