"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.createDoctor = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
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
        profilePhoto: zod_1.z.string().optional(),
        registrationNumber: zod_1.z.string({
            required_error: "Registration number is required",
        }),
        experience: zod_1.z.number().int().nonnegative().optional(),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE], {
            required_error: "Gender is required",
        }),
        appointmentFee: zod_1.z.number({ required_error: "Appointment fee is required" }),
        qualification: zod_1.z.string({ required_error: "Qualification is required" }),
        currentWorkingPlace: zod_1.z.string({
            required_error: "Current working place is required",
        }),
        designation: zod_1.z.string({ required_error: "Designation is required" }),
        specialtyId: zod_1.z.string({ required_error: "Specialty ID is required" }), // ✅ ADDED
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
