const User = require("../model/User.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
const CustomError = require("../utils/customError.js");
const JWT = require("jsonwebtoken");

const signupFunc = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const SET_USER = await new User({
      ...req.body,
      password: hashPassword,
    });
    await SET_USER.save();
    res.status(200).json({ msg: "user has been created successfully" });
  } catch (error) {
    next(error);
  }
};

const signinFunc = async (req, res, next) => {
  try {
    const body = req.body;
    const { email, password } = body;
    const validateEmail = await User.findOne({ email: email });
    if (!validateEmail) {
      return next(CustomError(404, "email not found !!"));
    }
    const isMatch = await bcrypt.compare(password, validateEmail.password);
    if (!isMatch) {
      return next(CustomError(401, "invalid credential"));
    }
    const { password: pass, ...rest } = validateEmail._doc;
    const TOKEN = JWT.sign({ id: rest._id }, process.env.TOKEN_SECURITY);
    res
      .cookie(process.env.TOKEN_NAME, TOKEN, {
        httpOnly: true,
        secure: true, // Requires HTTPS
        sameSite: "none", // Crucial for cross-site cookies
        domain: "ecofront.onrender.com", // Note the leading dot
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({ msg: "loged in successfully!!", data: rest });
  } catch (error) {
    next(error);
  }
};

const signinGoogleFunc = async (req, res, next) => {
  try {
    const { username, email, avatar } = req.body;
    const validateEmail = await User.findOne({ email });
    if (validateEmail) {
      const { password: pass, ...rest } = validateEmail._doc;
      const TOKEN = JWT.sign({ id: rest._id }, process.env.TOKEN_SECURITY);
      res
        .cookie(process.env.TOKEN_NAME, TOKEN, {
          httpOnly: true,
          secure: true, // Requires HTTPS
          sameSite: "none", // Crucial for cross-site cookies
          domain: "ecofront.onrender.com", // Note the leading dot
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .status(200)
        .json({ msg: "loged in successfully!!", data: rest });
    } else {
      const password = Math.random().toString(36).slice(-8);
      const hashPassword = bcrypt.hashSync(password, 10);
      const SET_DATA = await new User({
        email,
        username,
        avatar,
        password: hashPassword,
      });
      await SET_DATA.save();
      const { password: pass, ...rest } = SET_DATA._doc;
      const TOKEN = JWT.sign({ id: rest._id }, process.env.TOKEN_SECURITY);
      res
        .cookie(process.env.TOKEN_NAME, TOKEN, {
          httpOnly: true,
          secure: true, // Requires HTTPS
          sameSite: "none", // Crucial for cross-site cookies
          domain: "ecofront.onrender.com", // Note the leading dot
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .status(200)
        .json({ msg: "loged in successfully!!", data: rest });
    }
  } catch (error) {
    next(error);
  }
};

const signOutFunc = (_req, res, next) => {
  try {
    res
      .clearCookie(process.env.TOKEN_NAME)
      .status(200)
      .json({ msg: "logged out successfullt !! " });
  } catch (error) {
    next(error);
  }
};

module.exports = { signupFunc, signinFunc, signinGoogleFunc, signOutFunc };
