import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import refreshToken from "../models/refreshToken.model";
import sendResponse from "../helpers";
import { sendResetEmail, sendVerificationEmail } from "../utils/email";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.JWT_SECRET || "";

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
    const verificationToken = jwt.sign({ email }, secret_key, {
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

    const token = jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: "2m",
    });

    // #TODO: create a new collection for refresh tokens in the db with userId and refreshToken

    const refreshtoken = jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: "7d",
    });

    await refreshToken.create({ userId: user._id, refreshToken: refreshtoken });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, {
      success: true,
      successMessage: "Sign in successfull",
      data: { token, user },
    });
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

export const refresh_Token = async (req: Request, res: Response) => {
  try {
    const { refreshtoken } = req.cookies;
    console.log(refreshtoken);
    if (!refreshtoken) {
      return sendResponse(res, 401, {
        success: false,
        errorMessage: "Refresh Token is required",
      });
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(refreshtoken, secret_key) as JwtPayload;
    } catch (error) {
      return sendResponse(res, 403, {
        success: false,
        errorMessage: "Invalid or expired Refresh Token",
      });
    }

    const storedToken = await refreshToken.findOne({
      userId: decoded.userId,
      refreshToken: refreshtoken,
    });

    if (!storedToken) {
      return sendResponse(res, 403, {
        success: false,
        errorMessage: "Invalid Refresh Token",
      });
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, secret_key, {
      expiresIn: "1h",
    });

    return sendResponse(res, 200, {
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        errorMessage: "User not found",
      });
    }

    const resetToken = jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: "4m",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    return sendResponse(res, 200, {
      success: true,
      successMessage: "Password reset link sent to your email",
    });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "Token and new password are required",
      });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, secret_key) as JwtPayload;
    } catch (error) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "Invalid or expired token",
      });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return sendResponse(res, 200, {
      success: true,
      successMessage: "Password reset successfully!",
    });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal Server Error",
    });
  }
};

export const user = async (req: Request, res: Response) => {
  try {
    const token = req.cookies;
    console.log(token, "token coming from cookies");
    const { userId } = req.body.user;
    const userInfo = await User.findById({ _id: userId });
    if (!user) {
      return sendResponse(res, 400, {
        success: false,
        errorMessage: "You are not Authorized",
      });
    }
    return sendResponse(res, 200, {
      success: true,
      data: userInfo,
    });
  } catch (error) {
    return sendResponse(res, 500, {
      success: false,
      errorMessage: "Internal server error",
    });
  }
};
