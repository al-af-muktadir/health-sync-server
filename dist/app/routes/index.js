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
const schedules_route_1 = require("../modules/Schedules/schedules.route");
const doctorSchedule_route_1 = require("../modules/DoctorSchedule/doctorSchedule.route");
const appointment_route_1 = require("../modules/Appointment/appointment.route");
const specialties_route_1 = require("../modules/Specialties/specialties.route");
const diagnosis_route_1 = require("../modules/Diagnosis/diagnosis.route");
const payment_route_1 = require("../modules/Payment/payment.route");
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
        route: specialties_route_1.SpecialtiesRouter,
    },
    {
        path: "/doctor",
        route: doctor_route_1.docRoute,
    },
    {
        path: "/patient",
        route: patient_route_1.PatientRoute,
    },
    {
        path: "/schedules",
        route: schedules_route_1.ScheduleRoute,
    },
    {
        path: "/doctor-schedule",
        route: doctorSchedule_route_1.doctorScheduleRoute,
    },
    {
        path: "/appointment",
        route: appointment_route_1.appointmentRouter,
    },
    {
        path: "/diagnosis",
        route: diagnosis_route_1.DiseaseRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
