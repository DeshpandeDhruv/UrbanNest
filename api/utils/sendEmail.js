// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dhruv.deshpande4@gmail.com', // Your Gmail
        pass: 'obzcufxyfsselysc',            // Your App Password (from Gmail)
      },
    });

    await transporter.sendMail({
      from: '"Urban Nest" <dhruv.deshpande4@gmail.com>',
      to,
      subject,
      text,
    });

    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};

export default sendEmail;
