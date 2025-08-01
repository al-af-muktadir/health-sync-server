import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { scheduleService } from "./schedule.service";
import { pick } from "../../../shared/pick";

const insertIntoDb = catchAsync(async (req, res) => {
  const result = await scheduleService.insertIntoDb(req.body);
  sendResponse(res, {
    data: result.length > 0 ? result : [],
    message:
      result.length > 0
        ? "Schedule Created Succesfully"
        : "Schedule Already Exists",
    statusCode: StatusCodes.OK,
  });
});
const getAllFromDB = catchAsync(async (req, res) => {
  // ("console.logreq.query", req.user);
  const filters = pick(req.query, ["startDate", "endDate"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const user = req.user;
  const result = await scheduleService.getAllFromDb(filters, options, user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,

    message: "Schedule fetched successfully!",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await scheduleService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,

    message: "Schedule retrieval successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await scheduleService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,

    message: "Schedule deleted successfully",
    data: result,
  });
});
export const scheduleController = {
  insertIntoDb,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};
