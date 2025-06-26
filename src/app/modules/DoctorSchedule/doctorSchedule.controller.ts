import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";

const insertIntoDb = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.insertIntoDb(req.user, req.body);
  sendResponse(res, {
    message: "Doctor Schdule Created Successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});

export const docScheduleController = {
  insertIntoDb,
};
