import express from "express";
import { DiseaseController } from "./diagnosis.controller";

const router = express.Router();

router.post("/", DiseaseController.createDisease);
router.get("/:diseaseName/doctors", DiseaseController.getDoctorsByDiseaseName);

export const DiseaseRoutes = router;
