import prisma from "../config/prisma.js";
import crypto from "node:crypto";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import supabase from "../config/supabase.js";
const filesBucket = supabase.storage.from("files");

// === FILES
export const uploadFile = [
  upload.single("uploadedFile"),
  async function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "login required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "no file uploaded" });
    }

    const { folderId, folderName } = req.body;
    if (!folderId) {
      return res.status(400).json({ error: "missing folder" });
    }

    try {
      const fileId = crypto.randomUUID();
      const { error: uploadError } = await filesBucket.upload(
        fileId,
        req.file.buffer,
        {
          contentType: req.file.mimetype,
          upsert: false,
        },
      );

      if (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }

      try {
        await prisma.file.create({
          data: {
            fileId,
            folderId,
            ownerId: req.user.userId,
            fileName: req.file.originalname,
          },
        });
      } catch (dbError) {
        await filesBucket.remove([fileId]);
        return next(dbError);
      }

      if (!folderName || folderName === "/") {
        return res.redirect("/");
      }

      return res.redirect(`/folder/${folderName}`);
    } catch (error) {
      next(error);
    }
  },
];

export async function downloadFile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "login required" });
  }

  const { fileId } = req.params;

  try {
    const file = await prisma.file.findFirst({
      where: {
        fileId,
        ownerId: req.user.userId,
      },
    });

    if (!file) {
      return res.status(404).json({ error: "file not found" });
    }

    const { data, error } = await filesBucket.download(fileId);
    if (error || !data) {
      return res
        .status(400)
        .json({ error: error?.message ?? "download failed" });
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = data.type || "application/octet-stream";
    const safeName = (file.fileName || "download").replace(/"/g, "'");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ error: "download failed" });
  }
}
