import express, { NextFunction, Request, Response } from "express";
import { specialtiresController } from "./specialties.controller";
import { fileUploader } from "../../../shared/fileUploader";
import { SpecialtiesValidation } from "./specialties.validation";
const router = express.Router();
router.post(
  "/",
  fileUploader.upload,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createSp.parse(JSON.parse(req.body.data));
    return specialtiresController.createSpecialties(req, res, next);
  }
);

router.get("/", specialtiresController.getSpecialties);
router.delete("/:id", specialtiresController.deleteSpecialties);
export const SpecialtiesRouter = router;
