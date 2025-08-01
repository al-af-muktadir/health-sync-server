import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.email_sender_gmail,
      pass: config.email_sender_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Health Sync" <al.afmuktadir.28@gmail.com>',
    to: email,
    subject: "RESET PASSWORD",

    html: html,
  });

  // console.log("Message sent:", info.messageId);
};
export default emailSender;
