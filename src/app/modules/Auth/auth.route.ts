import express from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
const router = express.Router();
router.post("/login", authController.loginUser);

router.post("/refreshToken", authController.refreshToken);
router.post(
  "/changePassword",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authController.changePassword
);
router.post(
  "/forgotPassword",

  authController.forgotPassword
);

router.post("/resetPassword", authController.resetPassword);

export const authRoute = router;
