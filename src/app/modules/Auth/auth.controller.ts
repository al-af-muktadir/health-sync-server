import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { authServices } from "./auth.servives";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });
  sendResponse(res, {
    message: "Logged in Successfully",
    statusCode: StatusCodes.OK,
    data: {
      accessToken: result.accessToken,
      refreshToken: refreshToken,
      needPasswordChange: result.needPassWordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    data: result,
    message: "Logged in Successfully",
  });
});
const changePassword = catchAsync(async (req, res) => {
  const result = await authServices.changePassword(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    data: result.message,
    message: "Password Changed Successfully",
  });
});
const forgotPassword = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await authServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    data: result,
    message: "Check your email for reset password link",
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";
  console.log(req.body);
  const result = await authServices.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    data: result,
    message: "Password Changed Successfully",
  });
});
export const authController = {
  loginUser,
  refreshToken,
  resetPassword,
  changePassword,
  forgotPassword,
};
