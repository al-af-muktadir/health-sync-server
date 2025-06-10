import { Router } from "express";
import { UserController } from "./User.controller";

const router = Router();
router.post("/register", UserController.createUser);
router.get("/", UserController.getAllUser);
router.patch("/", UserController.userSoftDelete);

export const UserRoute = router;
