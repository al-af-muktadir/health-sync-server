"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docRoute = void 0;
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("./doctor.controller");
const router = express_1.default.Router();
router.get("/", doctor_controller_1.docController.getAllDoctor);
router.get("/:id", doctor_controller_1.docController.getDoctorById);
// router.patch("/", docController.updatedoctor);
router.patch("/soft/:id", doctor_controller_1.docController.deleteDoctor);
exports.docRoute = router;
