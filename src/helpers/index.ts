import { Response } from "express";
import { RespType } from "../types";
const sendResponse = (
  res: Response,
  statusCode: number,
  response: RespType
) => {
  return res.status(statusCode).json(response);
};

export default sendResponse;
