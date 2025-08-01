import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { DiseaseService } from "./diagnosis.service";
// import catchAsync from "../utils/catchAsync";
// import { DiseaseService } from "../services/disease.service";
// import sendResponse from "../utils/sendResponse";
// import { createDiseaseZodSchema } from "../validations/disease.validation";

export const createDisease = catchAsync(async (req: Request, res: Response) => {
  console.log("disease controller", req.body);
  const result = await DiseaseService.createDisease(req.body);
  sendResponse(res, {
    statusCode: 201,

    message: "Disease created successfully",
    data: result,
  });
});

const getDoctorsByDiseaseName = catchAsync(
  async (req: Request, res: Response) => {
    const diseaseName = req.params.diseaseName;
    console.log("diseaseName", diseaseName);
    const doctors = await DiseaseService.getDoctorsByDiseaseName(diseaseName);
    sendResponse(res, {
      statusCode: 200,

      message: `Doctors fetched for disease: ${diseaseName}`,
      data: doctors,
    });
  }
);
export const DiseaseController = {
  createDisease,
  getDoctorsByDiseaseName,
};
