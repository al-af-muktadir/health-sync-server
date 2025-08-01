"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const appointment_controller_1 = require("./appointment.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)(client_1.UserRole.PATIENT), appointment_controller_1.appointmentController.makeAppointment);
router.get("/my-appointment", (0, auth_1.auth)(client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), appointment_controller_1.appointmentController.getmyAppointment);
router.get("/", (0, auth_1.auth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), appointment_controller_1.appointmentController.getAllAppointments);
exports.appointmentRouter = router;
