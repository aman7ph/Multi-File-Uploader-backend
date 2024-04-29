import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const uploadFilesx = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.files);
  }
);
export { uploadFilesx };
