const express = require("express");
const {
  loginUser,
  registerUser,
  getToken,
  registerSetting,
} = require("../Controller/userControl");

const route = express.Router();

route.post("/login", loginUser);
route.post("/register", registerUser);
route.get("/token", getToken);
route.get("/setting/:_id", registerSetting);
module.exports = route;
