import express, { Request, Response } from "express";
import {
  forgotPassword,
  logoutUser,
  refresh_Token,
  resetPassword,
  signin,
  signup,
  user,
  verifyEmail,
} from "../controllers/auth.controller";
import { authMiddleware, validate } from "../middlewares";
import { signinSchema, signupSchema } from "../validations/user.validation";

const router = express.Router();

router.post("/sign-up", validate(signupSchema), signup);
router.post("/sign-in", validate(signinSchema), signin);
router.post("/refresh-token", refresh_Token);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, user);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/verify-email", verifyEmail);

export default router;
