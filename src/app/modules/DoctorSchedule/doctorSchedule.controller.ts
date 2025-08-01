import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";
import { pick } from "../../../shared/pick";

const insertIntoDb = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.insertIntoDb(req.user, req.body);
  sendResponse(res, {
    message: "Doctor Schdule Created Successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const getMySchedule = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await doctorScheduleService.getMyScheduleFromDb(
    filters,
    options,
    req.user
  );
  sendResponse(res, {
    message: "Retreied  Successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});
const deleteFromDB = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.deleteFromDb(
    req.user,
    req.params.id
  );
  sendResponse(res, {
    message: "My SChedule Deleted  Successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});

const getAllFromDb = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDate", "endDate"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await doctorScheduleService.getAllFromDB(filters, options);
  sendResponse(res, {
    message: "All Schedule Retrieved  Successfully",
    data: result,
    statusCode: StatusCodes.OK,
  });
});
export const docScheduleController = {
  insertIntoDb,
  getMySchedule,
  deleteFromDB,
  getAllFromDb,
};
