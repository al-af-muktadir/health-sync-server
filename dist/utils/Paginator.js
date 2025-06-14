"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (options) => {
    const page = options.page || 1;
    const limit = options.page || 10;
    const skip = Number(page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
    return {
        skip,
        limit,
        sortBy,
        sortOrder,
        page,
    };
};
exports.pagination = pagination;
