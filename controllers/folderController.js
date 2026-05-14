import * as db from "../db/queries.js";

export async function showOneFolder(req, res) {
  const folderName = req.params.folderName;
  const ownerId = req.user.userId;
  const folder = await db.getOneFolder({ ownerId, folderName });

  res.render("index", { selectedFolder: folderName, files: folder.files });
}

export async function loadNavFolders(req, res) {
  const allFolders = await db.getAllFolders();
  res.locals.folders = allFolders;
}
