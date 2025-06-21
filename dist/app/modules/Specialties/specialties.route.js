"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesRouter = void 0;
const express_1 = __importDefault(require("express"));
const specialties_controller_1 = require("./specialties.controller");
const fileUploader_1 = require("../../../shared/fileUploader");
const specialties_validation_1 = require("./specialties.validation");
const router = express_1.default.Router();
router.post("/", fileUploader_1.fileUploader.upload, (req, res, next) => {
    req.body = specialties_validation_1.SpecialtiesValidation.createSp.parse(JSON.parse(req.body.data));
    return specialties_controller_1.specialtiresController.createSpecialties(req, res, next);
});
router.get("/", specialties_controller_1.specialtiresController.getSpecialties);
router.delete("/:id", specialties_controller_1.specialtiresController.deleteSpecialties);
exports.SpecialtiesRouter = router;
