import express from "express";
import { docController } from "./doctor.controller";
const router = express.Router();
router.get("/", docController.getAllDoctor);
router.get("/:id", docController.getDoctorById);
// router.patch("/", docController.updatedoctor);
router.patch("/soft/:id", docController.deleteDoctor);
export const docRoute = router;
