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
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const config_1 = __importDefault(require("../config"));
//
// 1) Memory‑only storage ── nothing touches the filesystem
//
const storage = multer_1.default.memoryStorage();
//
// 2) Multer middleware: single file ≤ 4 MB named “profilePhoto”
//    (raise/lower the limit or field name as you like)
//
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
}).single("file");
//
// 3) Cloudinary credentials
//
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloud_name,
    api_key: config_1.default.api_key,
    api_secret: config_1.default.api_secret,
});
//
// 4) Stream buffer → Cloudinary (no tmp file)
//
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const publicId = `${Date.now()}-${file.originalname.split(".")[0]}`;
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ public_id: publicId, resource_type: "image" }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        // push the in‑memory buffer straight into Cloudinary
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
});
exports.fileUploader = {
    storage,
    upload,
    uploadToCloudinary,
};
