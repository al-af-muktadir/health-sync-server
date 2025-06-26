import express, { Router } from "express";
import { UserRoute } from "../modules/User/User.route";
import { authRoute } from "../modules/Auth/auth.route";
import { docRoute } from "../modules/Doctor/doctor.route";
import { PatientRoute } from "../modules/Patient/patient.route";
import { ScheduleRoute } from "../modules/Schedules/schedules.route";
import { doctorScheduleRoute } from "../modules/DoctorSchedule/doctorSchedule.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/specialties",
    route: authRoute,
  },
  {
    path: "/doctor",
    route: docRoute,
  },
  {
    path: "/patient",
    route: PatientRoute,
  },
  {
    path: "/schedules",
    route: ScheduleRoute,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
