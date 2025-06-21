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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesService = void 0;
const fileUploader_1 = require("../../../shared/fileUploader");
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const createSpecialtiesIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary.secure_url;
    }
    const result = yield Prisma_1.default.specialties.create({
        data: req.body,
    });
    return result;
});
const getSpecialtiesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.specialties.findMany();
    return result;
});
const deleteSpecialtiesFromDb = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.specialties.delete({
        where: {
            id: params,
        },
    });
    return result;
});
exports.specialtiesService = {
    createSpecialtiesIntoDb,
    getSpecialtiesFromDb,
    deleteSpecialtiesFromDb,
};
