"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleRoute = void 0;
const express_1 = __importDefault(require("express"));
const schedules_controller_1 = require("./schedules.controller");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR), schedules_controller_1.scheduleController.getByIdFromDB);
router.post("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), schedules_controller_1.scheduleController.insertIntoDb);
router.delete("/:id", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), schedules_controller_1.scheduleController.deleteFromDB);
router.get("/", (0, auth_1.auth)(client_1.UserRole.DOCTOR), schedules_controller_1.scheduleController.getAllFromDB);
// router.get("/:id", scheduleController.getById);
// router.patch("/:id", scheduleController.updateIntoDb);
// router.patch("/:id", scheduleController.deletePatient);
exports.ScheduleRoute = router;
