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
exports.docServices = void 0;
const client_1 = require("@prisma/client");
const Prisma_1 = __importDefault(require("../../../shared/Prisma"));
const doctor_constant_1 = require("./doctor.constant");
const Paginator_1 = require("../../../utils/Paginator");
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updateDoctor = yield transactionClient.doctor.update({
            where: {
                id: id,
            },
            data: {
                isDeleted: true,
            },
        });
        const updateUser = yield transactionClient.user.update({
            where: {
                email: updateDoctor.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
    }));
    return result;
});
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
});
const getAllDoctorFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, specialties } = params, restData = __rest(params, ["searchTerm", "specialties"]);
    const { page, limit, sortBy, sortOrder, skip } = (0, Paginator_1.pagination)(options);
    console.log("params", restData);
    const andCondition = [];
    const searchFields = doctor_constant_1.doctorSearchableFields;
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
    if (specialties && specialties.length > 0) {
        andCondition.push({
            doctorspecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    } //doctor-doctorSP-sp
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
    const result = yield Prisma_1.default.doctor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield Prisma_1.default.doctor.count({
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
const updatedoctor = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialties } = data, restData = __rest(data, ["specialties"]);
    const doctorData = yield Prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    yield Prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updateDoctor = yield transactionClient.doctor.update({
            where: {
                id: doctorData.id,
            },
            data: restData,
        });
        if (specialties && specialties.length > 0) {
            const deletedSpecialties = specialties.filter((sp) => sp.isDeleted === true);
            if (deletedSpecialties) {
                for (const sp of deletedSpecialties) {
                    yield transactionClient.doctorSpecialties.deleteMany({
                        where: {
                            doctorId: doctorData.id,
                            specialitiesId: sp.spId,
                        },
                    });
                }
            }
            const addedSpecialties = specialties.filter((sp) => sp.isDeleted === false);
            if (addedSpecialties) {
                for (const sp of addedSpecialties) {
                    yield transactionClient.doctorSpecialties.create({
                        data: {
                            doctorId: doctorData.id,
                            specialitiesId: sp.spId,
                        },
                    });
                }
            }
        }
    }));
    const result = yield Prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: doctorData.id,
        },
    });
    return result;
});
exports.docServices = {
    deleteDoctor,
    getDoctorById,
    getAllDoctorFromDb,
    updatedoctor,
};
