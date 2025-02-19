import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model";
import sendResponse from "../helpers";
import { sendVerificationEmail } from "../utils/email";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, "sagdjhsgdaj", {
      expiresIn: "1h",
    });

    const newUser = new User({
      name,
      password: hashedPassword,
      email,
      verificationToken,
    });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    return sendResponse(res, 201, {
      success: true,
      successMessage:
        "Signup successful! Check your email to verify your account",
    });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return sendResponse(res, 403, {
        success: false,
        errorMessage: "Please verify your email before signing in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, "sagdjhsgdaj", {
      expiresIn: "1h",
    });

    // #TODO: create a new collection for refresh tokens in the db with userId and refreshToken

    return sendResponse(res, 200, { success: true, data: { token, user } });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    const verificationToken = user?.verificationToken

    // #TODO: check validity of token, if expired send Error response

    if (!user) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    sendResponse(res, 200, {
      success: true,
      successMessage: "Email verified successfully!",
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal server error",
    });
  }
};
