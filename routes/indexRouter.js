import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import * as folderController from "../controllers/folderController.js";

const router = new Router();

router.get(
  "/",
  // set root folder name then run the folder middlewares
  (req, res, next) => {
    req.params.folderName = "/";
    next();
  },
  folderController.loadNavFolders,
  folderController.showOneFolder,
);

router.post("/uploadFile", fileController.uploadFile);
export default router;
