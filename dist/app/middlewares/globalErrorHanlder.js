"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const globalErrorHandler = (err, req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
        succuess: false,
        message: err.name || "Something Went Wrong",
        error: err,
    });
};
exports.globalErrorHandler = globalErrorHandler;
