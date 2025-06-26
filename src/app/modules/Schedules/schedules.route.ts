import express from "express";
import { scheduleController } from "./schedules.controller";

const router = express.Router();
router.post("/", scheduleController.insertIntoDb);
router.get("/", scheduleController.getAllFromDb);
// router.get("/:id", scheduleController.getById);
// router.patch("/:id", scheduleController.updateIntoDb);
// router.patch("/:id", scheduleController.deletePatient);

export const ScheduleRoute = router;
