import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import FileMetadata from "../models/fileMetadata";
import Category from "../models/category";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";
import path from "path";

const uploadFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.files);
    const { description, categoryId } = req.body;
    const randomString: string = generateRandomString(12);
    if (!req.body.files || req.body.files.length === 0) {
      return next(new AppError("You need to attach a file.", 400));
    }

    for (let fileData of req.body.files) {
      const { filetype, filename, originalFileName } = fileData;

      await FileMetadata.create({
        randomString,
        description,
        filetype,
        filename,
        originalFileName,
        categoryId,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Uploaded successfully",
    });
  }
);

const getFiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = await FileMetadata.findAll({
      include: Category,
    });

    res.status(200).json({
      status: "success",
      data: {
        files,
      },
    });
  }
);

export const getFilesByRandomString = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { randomString } = req.params;

    const files = await FileMetadata.findAll({
      where: {
        randomString: randomString,
      },
      include: Category,
    });

    if (!files || files.length === 0) {
      return next(
        new AppError("No files found with the provided random string.", 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        files,
      },
    });
  }
);

const updateFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { description, categoryId, id } = req.body;
    console.log(id.length);
    try {
      if (!id || id.length === 0) {
        return next(new AppError("To update, you have to select a file", 400));
      }

      for (let i = 0; i < id.length; i++) {
        const fileId = id[i];
        console.log(fileId);
        const file = await FileMetadata.findByPk(fileId);

        if (!file) {
          return next(new AppError("File not found.", 404));
        }
        deleteFileFromSystem(file.filename);
        await file.update({
          description,
          categoryId,
          filename: req.body.files[i].filename,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

const deleteFile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;

    if (!id || id.length === 0) {
      return next(new AppError("To delete, you have to select a file", 400));
    }

    try {
      for (let fileId of id) {
        const file = await FileMetadata.findByPk(fileId);
        if (!file) {
          return next(new AppError("File not found.", 404));
        }

        const filename = file.filename;

        await file.destroy();

        deleteFileFromSystem(filename);
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

function generateRandomString(length: number): string {
  const uuid: string = uuidv4();
  return uuid.substring(0, length);
}
const deleteFileFromSystem = async (filename: string) => {
  const filePath = path.join("./backend/public/files", filename);
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file from system:", error);
  }
};
export { uploadFile, getFiles, updateFile, deleteFile };
