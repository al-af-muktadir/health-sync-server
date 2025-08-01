import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";
import { paymentService } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const result = await paymentService.initPayment(req.params.appointmentId);
  sendResponse(res, {
    message: "Payment Initiate successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const validatePayment = catchAsync(async (req, res) => {
  const result = await paymentService.validatePayment(req.query);
  sendResponse(res, {
    message: "Payment Validate successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});

export const paymentController = {
  initPayment,
  validatePayment,
};
