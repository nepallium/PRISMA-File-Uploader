import express from "express";
import "dotenv/config";
import path from "path";

import expressSession from "express-session";
import prisma from "./config/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import passport from "passport";
import flash from "connect-flash";
// import pgSimple from "connect-pg-simple";
// const pgSession = pgSimple(expressSession);

// ### general setup
const app = express();
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  expressSession({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);
app.use(flash()); // for req.flash()

// ### passport authentication
import "./config/passport.js"; // need to import passport config so app.js knows abt it

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// });

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// routes
import indexRouter from "./routes/indexRouter.js";
import authRouter from "./routes/authRouter.js";
import folderRouter from "./routes/folderRouter.js";
app.use(indexRouter);
app.use(authRouter);
app.use(folderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port", PORT);
});
