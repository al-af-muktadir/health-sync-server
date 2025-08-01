"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleRoute = void 0;
const express_1 = __importDefault(require("express"));
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.docScheduleController.insertIntoDb);
router.get("/my-schedule", (0, auth_1.auth)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.docScheduleController.getMySchedule);
router.delete("/:id", (0, auth_1.auth)(client_1.UserRole.DOCTOR), doctorSchedule_controller_1.docScheduleController.deleteFromDB);
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), doctorSchedule_controller_1.docScheduleController.getAllFromDb);
exports.doctorScheduleRoute = router;
