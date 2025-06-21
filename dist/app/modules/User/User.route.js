"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const User_controller_1 = require("./User.controller");
const fileUploader_1 = require("../../../shared/fileUploader");
const user_validation_1 = require("./user.validation");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/all-admin", User_controller_1.UserController.getAllAdmin);
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), User_controller_1.UserController.getAllUser);
router.get("/get-user", User_controller_1.UserController.getUser);
router.patch("/", User_controller_1.UserController.userSoftDelete);
router.post("/create-admin", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload, (req, res, next) => {
    req.body = user_validation_1.userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return User_controller_1.UserController.createAdmin(req, res, next);
});
router.post("/create-doctor", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload, (req, res, next) => {
    req.body = user_validation_1.userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return User_controller_1.UserController.createDoctor(req, res, next);
});
router.post("/create-patient", fileUploader_1.fileUploader.upload, (req, res, next) => {
    req.body = user_validation_1.userValidation.createPatient.parse(JSON.parse(req.body.data));
    return User_controller_1.UserController.createPatient(req, res, next);
});
router.patch("/update-status/:email", 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
User_controller_1.UserController.updateStatus);
router.patch("/update-my-profile", fileUploader_1.fileUploader.upload, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return User_controller_1.UserController.updateMyProfile(req, res, next);
});
exports.UserRoute = router;
