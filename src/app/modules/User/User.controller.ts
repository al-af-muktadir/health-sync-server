import { StatusCodes } from "http-status-codes";
import { pick } from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { QueriesFields } from "./User.constant";
import { UserServices } from "./User.service";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminIntoDb(req);
  sendResponse(res, {
    statusCode: 200,
    message: "User Created Successfully",
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

export const UserController = {
  createAdmin,
  getAllUser,
  userSoftDelete,
};
