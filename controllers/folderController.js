import * as db from "../db/queries.js";
import { Prisma } from "../generated/prisma/index.js";
import { formatDate } from "../utils/formatDate.js";

export async function showOneFolder(req, res) {
  if (!req.user) {
    return res.render("index");
  }

  const folderName = req.params.folderName;
  const ownerId = req.user.userId;
  const folder = await db.getOneFolder({ ownerId, folderName });

  if (!folder) {
    return res.redirect("/");
  }

  const files = (folder.files ?? []).map((file) => ({
    ...file,
    uploadedAt: formatDate(file.uploadedAt),
  }));
  res.render("index", { selectedFolder: folder, files });
}

export async function loadNavFolders(req, res, next) {
  const allFolders = await db.getAllFolders();
  res.locals.folders = allFolders;
  next();
}

export const createFolder = async (req, res) => {
  try {
    await db.createFolder({
      folderName: req.body.folderName,
      ownerId: req.user.userId,
    });
    res.status(200).json({ message: "Folder created" });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return res.status(400).json({ error: "Folder name already exists" });
    }
    res.status(500).json({ error: "server error while creating folder" });
  }
};

export async function deleteFolder(req, res) {
  await db.deleteFolder(req.params.folderId);
  res.redirect("/");
}

export async function updateFolder(req, res) {
  try {
    await db.updateFolder(req.params.folderId, req.body.folderName);
    res.status(200).json({ message: "Folder name updated" });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return res.status(400).json({ error: "Folder name already exists" });
    }
    res.status(500).json({ error: "server error while updating folder" });
  }
}
