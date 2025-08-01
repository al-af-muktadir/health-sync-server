"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiseaseService = exports.createDisease = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDisease = (payloads) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating multiple diseases...");
    const result = yield Promise.all(payloads.map((payload) => prisma.disease.create({
        data: payload,
    })));
    return result;
});
exports.createDisease = createDisease;
const getDoctorsByDiseaseName = (diseaseName) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching disease by name:", diseaseName);
    const disease = yield prisma.disease.findMany({
        where: { name: diseaseName },
        select: { specialtyId: true },
    });
    console.log("Disease found:", disease);
    if (!disease || disease.length === 0) {
        throw new Error("Disease not found");
    }
    // Find doctors with that specialtyId
    const specialtyId = disease[0].specialtyId;
    const doctors = yield prisma.doctor.findMany({
        where: { specialtyId: specialtyId, isDeleted: false },
        select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
            profilePhoto: true,
            qualification: true,
            designation: true,
            currentWorkingPlace: true,
            experience: true,
            gender: true,
            appointmentFee: true,
            registrationNumber: true,
        },
    });
    return doctors;
});
exports.DiseaseService = {
    createDisease: exports.createDisease,
    getDoctorsByDiseaseName,
};
