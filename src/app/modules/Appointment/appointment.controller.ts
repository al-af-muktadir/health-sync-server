import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { appointmentService } from "./appointment.service";
import { pick } from "../../../shared/pick";

const makeAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.makeAppointment(req.user, req.body);
  sendResponse(res, {
    message: "Appointment made successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const getmyAppointment = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortOrder"]);
  const result = await appointmentService.getmyappointment(
    req.user,
    filters,
    options
  );
  sendResponse(res, {
    message: "Appointment Retrieved successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const getAllAppointments = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "sortOrder"]);
  const result = await appointmentService.getAllAppointments(filters, options);
  sendResponse(res, {
    message: "Appointment Retrieved successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});

export const appointmentController = {
  makeAppointment,
  getmyAppointment,
  getAllAppointments,
};
