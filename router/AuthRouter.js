const express = require("express");
const Authrouter = express.Router();
const {
  signupFunc,
  signinFunc,
  signinGoogleFunc,
  signOutFunc,
} = require("../controllers/AuthFunc.js");

Authrouter.post("/signup", signupFunc);
Authrouter.post("/signin", signinFunc);
Authrouter.post("/signout", signOutFunc);
Authrouter.post("/googleOauth", signinGoogleFunc);

module.exports = Authrouter;
