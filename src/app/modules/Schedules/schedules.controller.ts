import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { scheduleService } from "./schedule.service";
import { pick } from "../../../shared/pick";

const insertIntoDb = catchAsync(async (req, res) => {
  const result = await scheduleService.insertIntoDb(req.body);
  sendResponse(res, {
    data: result,
    message: "Schedule Created Succesfully",
    statusCode: StatusCodes.OK,
  });
});
const getAllFromDb = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await scheduleService.getAllFromDb(filters, options);
  sendResponse(res, {
    data: result,
    message: "Schedule Retrieved Succesfully",
    statusCode: StatusCodes.OK,
  });
});

export const scheduleController = {
  insertIntoDb,
  getAllFromDb,
};
