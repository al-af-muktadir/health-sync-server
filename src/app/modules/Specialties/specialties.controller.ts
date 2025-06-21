import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { specialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req, res) => {
  const result = await specialtiesService.createSpecialtiesIntoDb(req);
  sendResponse(res, {
    message: "Specialties Created Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const getSpecialties = catchAsync(async (req, res) => {
  const result = await specialtiesService.getSpecialtiesFromDb();
  sendResponse(res, {
    message: "Specialties Retrieved Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const deleteSpecialties = catchAsync(async (req, res) => {
  const result = await specialtiesService.deleteSpecialtiesFromDb(req.params);
  sendResponse(res, {
    message: " Specialties Deleted Successfully",
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const specialtiresController = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
