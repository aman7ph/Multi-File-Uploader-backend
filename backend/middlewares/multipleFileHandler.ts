import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import AppError from "../utils/appError";

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadFiles = upload.array("files", 5);

export const saveFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError("You need to attach a file.", 500);
    }
    req.body.files = [];
    const maxSize = 10 * 1024 * 1024;

    await Promise.all(
      (req.files as Express.Multer.File[]).map(async (file, i) => {
        try {
          if (file.size > maxSize) {
            throw new AppError(
              `File ${file.originalname} exceeds 10MB size limit.`,
              500
            );
          }
          const filename = `${file.originalname}-${uuidv4()}-${
            i + 1
          }.${file.originalname.split(".").pop()}`;

          const filePath = path.join("./backend/public/files", filename);

          fs.mkdirSync(path.dirname(filePath), { recursive: true });

          await fs.promises.writeFile(filePath, file.buffer);

          req.body.files.push({
            filename,
            originalFileName: file.originalname,
            filetype: file.originalname.split(".").pop(),
          });
        } catch (error) {
          next(error);
        }
      })
    );
    next();
  } catch (error) {
    next(error);
  }
};
