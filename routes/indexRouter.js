import { Router } from "express";
import * as controller from "../controllers/fileController.js"

const router = new Router()

router.get("/", (req, res) => {
    res.render("index")
})

router.post("/uploadFile", controller.uploadFile)

export default router