import { Router } from "express";
import * as controller from "../controllers/authController.js"

const authRouter = new Router()

authRouter.get("/signup", controller.showSignup)
authRouter.get("/login", controller.showLogin)

authRouter.post("/login", controller.loginUser)
authRouter.post("/signup", controller.createUser)
authRouter.post("/logout", controller.logoutUser)

export default authRouter