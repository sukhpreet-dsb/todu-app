import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import ErrorResponse from "./interfaces/ErrorResponse";
import sendResponse from "./helpers";
import jwt from "jsonwebtoken";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  if (err instanceof ZodError) {
    console.dir(err, {
      depth: Infinity,
    });
    const errorMsg = err.issues
      .map((issue) => issue.path.join(" ") + " " + issue.message)
      .join("\n");
    return sendResponse(res, statusCode, {
      success: false,
      errorMessage: errorMsg,
    });
  } else {
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  }
}

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      throw error;
    }
  };
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) {
    return sendResponse(res, 401, {
      success: false,
      errorMessage: "Access Denied",
    });
  }

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), "sagdjhsgdaj");
    req.body.user = verified;
    next();
  } catch (error) {
    return sendResponse(res, 400, {
      success: false,
      errorMessage: "Invalid Token",
    });
  }
};
