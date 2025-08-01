import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./User.controller";

import { fileUploader } from "../../../shared/fileUploader";
import config from "../../../config";
import { userValidation } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();
router.get("/all-admin", UserController.getAllAdmin);
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllUser
);
router.get(
  "/get-user",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getUser
);
router.patch("/", UserController.userSoftDelete);

router.post(
  "/create-admin",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return UserController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    console.log("req.body", req.body);
    return UserController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    console.log(req.body);
    return UserController.createPatient(req, res, next);
  }
);

router.patch(
  "/update-status/:email",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.updateStatus
);

router.patch(
  "/update-my-profile",
  fileUploader.upload,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfile(req, res, next);
  }
);

export const UserRoute = router;
