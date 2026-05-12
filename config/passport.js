import pool from "../db/pool.js";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local"
import bcrypt from "bcrypt";

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    const user = rows[0];

    if (!user) {
      return done(null, false, {
        message: "This email isn't linked with an account",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // password dont match
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId],
    );

    const user = rows[0];

    done(null, user);
  } catch (error) {
    done(error);
  }
});
