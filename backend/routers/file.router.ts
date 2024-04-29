import express from "express";
import { uploadFilesx } from "../controllers/file.controller";

import { uploadFiles, saveFiles } from "../middlewares/multipleFileHandler";

const router = express.Router();

router.post("/upload", uploadFiles, saveFiles, uploadFilesx);

export default router;
