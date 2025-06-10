import express, { Router } from "express";
import { UserRoute } from "../modules/User/User.route";
import { authRoute } from "../modules/Auth/auth.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
