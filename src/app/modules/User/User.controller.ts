import { StatusCodes } from "http-status-codes";
import { pick } from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { QueriesFields, UserFilterableFields } from "./User.constant";
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

const getAllAdmin = catchAsync(async (req, res) => {
  const filterThings = pick(req.query, QueriesFields);
  const OtherOptions = pick(req.query, [
    "sortBy",
    "sortOrder",
    "page",
    "limit",
  ]);
  const result = await UserServices.getAllAdminFromDb(
    filterThings,
    OtherOptions
  );
  sendResponse(res, {
    statusCode: 200,
    message: "All Admins Retrieved Successfully",
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
  const result = await UserServices.getUser(req.user);
  sendResponse(res, {
    data: result,
    message: "User Retrieved Succesfully",
    statusCode: StatusCodes.OK,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filterThings = pick(req.query, UserFilterableFields);
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

const updateStatus = catchAsync(async (req, res) => {
  // console.log(req.params, req.body);
  const result = await UserServices.updateStatus(req.params, req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "All Users Retrieved Successfully",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  // console.log(req.params, req.body);
  const result = await UserServices.updateMyProfile(user, req);

  sendResponse(res, {
    statusCode: 200,
    message: "Profile Updated Successfully",
    data: result,
  });
});
export const UserController = {
  createAdmin,
  getAllAdmin,
  userSoftDelete,
  updateMyProfile,
  createDoctor,
  getUser,
  createPatient,
  getAllUser,
  updateStatus,
};
