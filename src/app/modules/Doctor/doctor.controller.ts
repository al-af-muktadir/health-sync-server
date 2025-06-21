import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { docServices } from "./doctor.service";
import { pick } from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";

const deleteDoctor = catchAsync(async (req, res) => {
  const result = await docServices.deleteDoctor(req.params.id);
  sendResponse(res, {
    data: result,
    message: "User Deleted Succesfully",
    statusCode: StatusCodes.OK,
  });
});
const getDoctorById = catchAsync(async (req, res) => {
  const result = await docServices.getDoctorById(req.params.id);
  sendResponse(res, {
    data: result,
    message: "User Deleted Succesfully",
    statusCode: StatusCodes.OK,
  });
});

const getAllDoctor = catchAsync(async (req, res) => {
  const filterThings = pick(req.query, doctorFilterableFields);
  const OtherOptions = pick(req.query, [
    "sortBy",
    "sortOrder",
    "page",
    "limit",
  ]);
  const result = await docServices.getAllDoctorFromDb(
    filterThings,
    OtherOptions
  );
  sendResponse(res, {
    statusCode: 200,
    message: "All Doctors Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});
const updatedoctor = catchAsync(async (req, res) => {
  const result = await docServices.updatedoctor(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    message: "Updated Successfully",
    data: result,
  });
});

export const docController = {
  deleteDoctor,
  getDoctorById,
  getAllDoctor,
  updatedoctor,
};
