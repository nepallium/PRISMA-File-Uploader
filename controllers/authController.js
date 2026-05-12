import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { body, validationResult, matchedData } from "express-validator";
import * as db from "../db/queries.js";
import passport from "passport";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 16 characters";

const validateUser = [
  body("first_name")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 16 })
    .withMessage(`First name ${lengthErr}`),
  body("last_name")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 16 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be valid")
    .custom(db.isEmailAvailable)
    .withMessage("A user already exists with this email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must have more than 2 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
];

export const createUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("signup", { errors: errors.array(), prevUser: req.body });
    }

    try {
      const formData = matchedData(req);
      const hashedPw = await bcrypt.hash(formData.password, 10);
      formData.password = hashedPw;

      // db returns new user obj
      const newUser = await db.createUser(formData);
      // manually log user in
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    } catch (error) {
      // if (error.code === "23505") {
      //   return res.status(400).render("signup", {
      //     errors: [{ msg: "A user already exists with this email address" }],
      //     prevUser: req.body,
      //   });
      // }

      next(error);
    }
  },
];

export async function showSignup(req, res) {
  res.render("signup");
}

export async function showLogin(req, res) {
  const errors = req.flash("error").map((msg) => ({ msg }));
  res.render("login", { errors });
}

export function loginUser(req, res, next) {
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
}

export async function logoutUser(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
