import * as db from "../db/queries.js";
import { Prisma } from "../generated/prisma/index.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

// === FILES
export const uploadFile = [
  upload.single("uploadedFile"),
  async function (req, res, next) {
    res.redirect("/");
  },
];

// === FOLDERS
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
