import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `http://localhost:4000/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<h2>Welcome! Click the link below to verify your email:</h2>
           <a href="${verificationLink}" target="_blank">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendResetEmail = async (email: string, resetLink: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
