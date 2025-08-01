"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiseaseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const diagnosis_controller_1 = require("./diagnosis.controller");
const router = express_1.default.Router();
router.post("/", diagnosis_controller_1.DiseaseController.createDisease);
router.get("/:diseaseName/doctors", diagnosis_controller_1.DiseaseController.getDoctorsByDiseaseName);
exports.DiseaseRoutes = router;
