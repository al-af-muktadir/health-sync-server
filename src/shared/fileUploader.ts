import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import config from "../config";

//
// 1) Memory‑only storage ── nothing touches the filesystem
//
const storage = multer.memoryStorage();

//
// 2) Multer middleware: single file ≤ 4 MB named “profilePhoto”
//    (raise/lower the limit or field name as you like)
//
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
}).single("file");

//
// 3) Cloudinary credentials
//
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

//
// 4) Stream buffer → Cloudinary (no tmp file)
//
const uploadToCloudinary = async (file: Express.Multer.File) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const publicId = `${Date.now()}-${file.originalname.split(".")[0]}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as any);
      }
    );

    // push the in‑memory buffer straight into Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const fileUploader = {
  storage,
  upload,
  uploadToCloudinary,
};
