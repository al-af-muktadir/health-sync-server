"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesValidation = void 0;
const zod_1 = require("zod");
const createSp = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Title is Required" }),
});
exports.SpecialtiesValidation = {
    createSp,
};
