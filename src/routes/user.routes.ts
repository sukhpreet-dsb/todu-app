import express, { Request, Response } from "express";
import {
  forgotPassword,
  refresh_Token,
  resetPassword,
  signin,
  signup,
  user,
  verifyEmail,
} from "../controllers/auth.controller";
import { authMiddleware, validate } from "../middlewares";
import { signinSchema, signupSchema } from "../validations/user.validation";
import sendResponse from "../helpers";

const router = express.Router();

router.post("/sign-up", validate(signupSchema), signup);
router.post("/sign-in", validate(signinSchema), signin);
router.post("/refresh-token", refresh_Token);
router.get("/me", authMiddleware, user);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/verify-email", verifyEmail);

// router.get("/protected", authMiddleware, (req: Request, res: Response) => {
//   const user = req.body.user;
//   return sendResponse(res, 200, {
//     success: true,
//     data: "Welcome to the protected route!",
//   });
// });

export default router;
