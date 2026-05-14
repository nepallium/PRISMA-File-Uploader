import { Router } from "express";
import * as controller from "../controllers/folderController.js";

const folderRouter = new Router();

folderRouter.get(
  "/:folderName",
  controller.loadNavFolders,
  controller.showOneFolder,
);

export default folderRouter;
