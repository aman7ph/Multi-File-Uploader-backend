import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Category from "../models/category";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name) {
      return next(new AppError("Name is required", 400));
    }

    const category = await Category.create({ name });

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
    });
  }
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.findAll();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  }
);

const getCategoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    await category.update(req.body);

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }
    await category.destroy();

    res.status(204).json({
      status: "success",
      message: "Category deleted successfully",
    });
  }
);

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
