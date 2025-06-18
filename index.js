const express = require("express");
const cors = require("cors");
const app = express();
const Authrouter = require("./router/AuthRouter.js");
const Userrouter = require("./router/UserRouter.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
  cors({
    origin: "https://ecofront.onrender.com", // your frontend URL
    credentials: true, // allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/Auth", Authrouter);
app.use("/api/User", Userrouter);

async function main() {
  try {
    await mongoose
      .connect(process.env.MONGO_DB)
      .then(() => console.log("database Connected"));

    app.listen("5000", () => {
      console.log("server has been started !!");
    });
  } catch (error) {
    console.log("there is an error in the connection !! ");
  }
}
main();

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "somthing went wrong!!";
  res.status(status).json({
    statuscode: status,
    error: message,
  });
});
