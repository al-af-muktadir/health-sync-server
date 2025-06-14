import { StatusCodes } from "http-status-codes";
import { pick } from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { QueriesFields } from "./User.constant";
import { UserServices } from "./User.service";

const createAdmin = catchAsync(async (req, res) => {
  console.log(req.file);
  const result = await UserServices.createAdminIntoDb(req);
  sendResponse(res, {
    statusCode: 200,
    message: "Admin Created Successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await UserServices.createDoctorIntoDb(req);
  // console.log(result);
  sendResponse(res, {
    statusCode: 200,
    message: "Doctor Created Successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req, res) => {
  console.log("incpm", req.body);
  const result = await UserServices.createPatientIntoDb(req);
  // console.log(result);
  sendResponse(res, {
    statusCode: 200,
    message: "Patient Created Successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filterThings = pick(req.query, QueriesFields);
  const OtherOptions = pick(req.query, [
    "sortBy",
    "sortOrder",
    "page",
    "limit",
  ]);
  const result = await UserServices.getAllUserFromDb(
    filterThings,
    OtherOptions
  );
  sendResponse(res, {
    statusCode: 200,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const userSoftDelete = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUser(req.params.id);
  sendResponse(res, {
    data: result,
    message: "User Deleted Succesfully",
    statusCode: StatusCodes.OK,
  });
});

const getUser = catchAsync(async (req, res) => {
  const result = await UserServices.getUser(req.params);
  sendResponse(res, {
    data: result,
    message: "User Retrieved Succesfully",
    statusCode: StatusCodes.OK,
  });
});

export const UserController = {
  createAdmin,
  getAllUser,
  userSoftDelete,
  createDoctor,
  getUser,
  createPatient,
};
