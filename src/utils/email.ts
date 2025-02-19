import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sus774114@gmail.com",
    pass: "bdnr qsxj liny dgim",
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `http://localhost:4000/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: "sus774114@gmail.com",
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
