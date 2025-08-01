import express, { Router } from "express";
import { UserRoute } from "../modules/User/User.route";
import { authRoute } from "../modules/Auth/auth.route";
import { docRoute } from "../modules/Doctor/doctor.route";
import { PatientRoute } from "../modules/Patient/patient.route";
import { ScheduleRoute } from "../modules/Schedules/schedules.route";
import { doctorScheduleRoute } from "../modules/DoctorSchedule/doctorSchedule.route";
import { appointmentRouter } from "../modules/Appointment/appointment.route";
import { SpecialtiesRouter } from "../modules/Specialties/specialties.route";
import { DiseaseRoutes } from "../modules/Diagnosis/diagnosis.route";
import { PaymentRouter } from "../modules/Payment/payment.route";
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
    route: SpecialtiesRouter,
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
  {
    path: "/appointment",
    route: appointmentRouter,
  },
  {
    path: "/diagnosis",
    route: DiseaseRoutes,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
