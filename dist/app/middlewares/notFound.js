"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const http_status_codes_1 = require("http-status-codes");
const notFound = (req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({
        success: false,
        message: "API NOT FOUND",
        error: {
            path: req.originalUrl,
            message: "Your Requested path is not found",
        },
    });
};
exports.notFound = notFound;
