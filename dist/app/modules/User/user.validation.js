"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.createDoctor = void 0;
const zod_1 = require("zod");
const client_1 = require("../../../generated/prisma/client");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    admin: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid email format"),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required" }),
    }),
});
exports.createDoctor = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    doctor: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid email format"),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required" }),
        address: zod_1.z.string({ required_error: "Address is required" }),
        profilePhoto: zod_1.z.string().optional(), // Optional in Prisma
        registrationNumber: zod_1.z.string({
            required_error: "Registration number is required",
        }),
        experience: zod_1.z.number().int().nonnegative().optional(), // Matches Int in Prisma
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]),
        appointmentFee: zod_1.z.number({ required_error: "Appointment fee is required" }),
        qualification: zod_1.z.string({ required_error: "Qualification is required" }),
        currentWorkingPlace: zod_1.z.string({
            required_error: "Current working place is required",
        }),
        designation: zod_1.z.string({ required_error: "Designation is required" }),
    }),
});
const createPatient = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    patient: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Invalid email format"),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required" }),
        address: zod_1.z.string({ required_error: "Address is required" }),
        profilePhoto: zod_1.z.string().optional(),
    }),
});
exports.userValidation = {
    createAdmin,
    createDoctor: exports.createDoctor,
    createPatient,
};
