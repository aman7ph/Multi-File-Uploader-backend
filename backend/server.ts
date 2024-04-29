import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import log from "./routers/file.router";

dotenv.config();
const app: express.Application = express();
app.use(cors());
app.use(express.json());

interface MyError extends Error {
  statusCode?: number;
  status?: string;
}

app.use("/api/v1/file", log);

app.use((err: MyError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(5050, () => console.log("listening on port 5050"));
