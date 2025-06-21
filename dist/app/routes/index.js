"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_route_1 = require("../modules/User/User.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const doctor_route_1 = require("../modules/Doctor/doctor.route");
const patient_route_1 = require("../modules/Patient/patient.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: User_route_1.UserRoute,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoute,
    },
    {
        path: "/specialties",
        route: auth_route_1.authRoute,
    },
    {
        path: "/doctor",
        route: doctor_route_1.docRoute,
    },
    {
        path: "/patient",
        route: patient_route_1.PatientRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
