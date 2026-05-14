import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import * as folderController from "../controllers/folderController.js";

const router = new Router();

router.get("/", async (req, res) => {
  req.params.folderName = "/";
  folderController.loadNavFolders(req, res);
  folderController.showOneFolder(req, res);
});

router.post("/uploadFile", fileController.uploadFile);

router.post("/createFolder", fileController.createFolder);

export default router;
