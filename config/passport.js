import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local"
import bcrypt from "bcrypt";
import prisma from "./prisma.js";

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {email: username}
    })

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
  console.log("user id,", user.userId)
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {userId}
    })

    done(null, user);
  } catch (error) {
    done(error);
  }
});
