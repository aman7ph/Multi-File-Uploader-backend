import express from "express";
import {
  uploadFile,
  getFiles,
  getFilesByRandomString,
  updateFile,
  deleteFile,
} from "../controllers/file.controller";
import { uploadFiles, saveFiles } from "../middlewares/multipleFileHandler";
const router = express.Router();

router.post("/upload", uploadFiles, saveFiles, uploadFile);
router.get("/getallfiles", getFiles);
router.get("/getsimilarfiles/:randomString", getFilesByRandomString);
router.put("/updatefiles", uploadFiles, saveFiles, updateFile);
router.delete("/deletefiles", deleteFile);

export default router;
