"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: true,
        message: data.message,
        data: data.data,
        meta: data === null || data === void 0 ? void 0 : data.meta,
    });
};
exports.sendResponse = sendResponse;
