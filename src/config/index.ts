import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,

  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.EXPIRES_IN,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  base_url: process.env.BASE_URL,
  email_sender_gmail: process.env.EMAIL_SENDER_GMAIL,
  email_sender_password: process.env.EMAIL_SENDER_PASSWORD,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
