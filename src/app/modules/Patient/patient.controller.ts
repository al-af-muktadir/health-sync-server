import { pick } from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { patientService } from "./patient.service";

const getAllPatient = catchAsync(async (req, res) => {
  const filterThings = pick(req.query, patientFilterableFields);
  const OtherOptions = pick(req.query, [
    "sortBy",
    "sortOrder",
    "page",
    "limit",
  ]);
  const result = await patientService.getAllPatientFromDb(
    filterThings,
    OtherOptions
  );
  sendResponse(res, {
    statusCode: 200,
    message: "All Patient Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getById = catchAsync(async (req, res) => {
  const result = await patientService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    message: " Patient Retrieved Successfully",
    data: result,
  });
});

const updateIntoDb = catchAsync(async (req, res) => {
  const result = await patientService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    message: " Patient Updated Successfully",
    data: result,
  });
});
export const patientController = {
  getAllPatient,
  updateIntoDb,
  getById,
};
