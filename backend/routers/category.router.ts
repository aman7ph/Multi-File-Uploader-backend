import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = express.Router();

router.post("/createcategory", createCategory);

router.get("/getallcategories", getAllCategories);

router.get("/getacategory/:id", getCategoryById);

router.put("/updatecategory/:id", updateCategory);

router.delete("/deletecategory/:id", deleteCategory);

export default router;
