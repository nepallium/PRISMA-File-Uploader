import { Router } from "express";
import * as controller from "../controllers/folderController.js";

const folderRouter = new Router();

folderRouter.get("/", (req, res) => {
  res.redirect("/");
});

folderRouter.get(
  "/:folderName",
  controller.loadNavFolders,
  controller.showOneFolder,
);

folderRouter.post("/create", controller.createFolder);
folderRouter.post("/delete/:folderId", controller.deleteFolder);
folderRouter.post("/update/:folderId", controller.updateFolder);

export default folderRouter;
