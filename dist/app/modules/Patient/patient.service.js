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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientService = void 0;
const Paginator_1 = require("../../../utils/Paginator");
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const patient_constant_1 = require("./patient.constant");
const getAllPatientFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, restData = __rest(params, ["searchTerm"]);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    console.log("params", restData);
    const andCondition = [];
    const searchFields = patient_constant_1.patientSearchableFields;
    if (params.searchTerm) {
        andCondition.push({
            OR: searchFields.map((field) => ({
                //where:{or:[{name:{contains,mode}},{},{}]}//snp
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(restData).length > 0) {
        andCondition.push({
            AND: Object.keys(restData).map((key) => ({
                [key]: {
                    equals: restData[key],
                },
            })),
        });
    }
    andCondition.push({
        isDeleted: false,
    });
    // console.log(andCondition);
    const whereCondition = { AND: andCondition };
    console.log(whereCondition);
    //  {
    //   AND: [
    //     {
    //       OR: [
    //         { name: { contains: "john", mode: "insensitive" } },
    //         { email: { contains: "john", mode: "insensitive" } }
    //       ]
    //     },
    //     {
    //       AND: [
    //         { isActive: { equals: true } },
    //         { department: { equals: "sales" } }
    //       ]
    //     }
    //   ]
    // }
    const result = yield Prisma_1.default.patient.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
        include: {
            patient_health_data: true,
            medical_report: true,
        },
    });
    const total = yield Prisma_1.default.patient.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    return result;
});
const updateIntoDb = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.patient.update({
        where: {
            id,
        },
        data: data,
    });
    return result;
});
exports.patientService = {
    getAllPatientFromDb,
    getById,
    updateIntoDb,
};
