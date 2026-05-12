import express from "express";
import "dotenv/config";
import path from "path";
import pool from "./db/pool.js";

import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import pgSimple from "connect-pg-simple";
const pgSession = pgSimple(session);

import authRouter from "./routes/authRouter.js";
import msgRouter from "./routes/messageRouter.js";
import memberRouter from "./routes/memberRouter.js";

// ### general setup
const app = express();
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ### session setup
const sessionStore = new pgSession({ pool });

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
app.use(authRouter);
app.use(msgRouter);
app.use("/member", memberRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port", PORT);
});
