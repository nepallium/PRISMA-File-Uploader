import * as db from "../db/queries.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

// === FILES
export const uploadFile = [
  upload.single("uploadedFile"),
  async function (req, res, next) {
    res.redirect("/");
  },
];
