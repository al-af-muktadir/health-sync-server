import express from "express";
import { docScheduleController } from "./doctorSchedule.controller";

const router = express.Router();
router.post("/", docScheduleController.insertIntoDb);

export const doctorScheduleRoute = router;
