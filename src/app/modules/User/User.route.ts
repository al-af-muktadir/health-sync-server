import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./User.controller";

import { fileUploader } from "../../../shared/fileUploader";
import config from "../../../config";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return UserController.createAdmin(req, res, next);
  }
);
router.get("/", UserController.getAllUser);
router.patch("/", UserController.userSoftDelete);

export const UserRoute = router;
