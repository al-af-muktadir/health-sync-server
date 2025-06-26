import express from "express";
import { patientController } from "./patient.controller";
const router = express.Router();
router.get("/", patientController.getAllPatient);
router.get("/:id", patientController.getById);
router.patch("/:id", patientController.updateIntoDb);
router.patch("/:id", patientController.deletePatient);

export const PatientRoute = router;
