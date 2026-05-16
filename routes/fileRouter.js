import { Router } from "express";
import * as controller from "../controllers/fileController.js";

const fileRouter = new Router();

fileRouter.post("/upload", controller.uploadFile);
fileRouter.post("/download/:fileId", controller.downloadFile);

export default fileRouter;
