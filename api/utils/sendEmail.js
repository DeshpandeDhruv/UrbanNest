// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
//dotenv.config();
dotenv.config({ path: './api/.env' });

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Urban Nest" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};

export default sendEmail;


