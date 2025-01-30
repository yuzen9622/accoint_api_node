const express = require("express");
const {
  loginUser,
  registerUser,
  getToken,
  registerSetting,
  updateUser,
  destoryUser,
} = require("../Controller/userControl");

const route = express.Router();

route.post("/login", loginUser);
route.post("/register", registerUser);
route.get("/token", getToken);
route.get("/setting/:_id", registerSetting);
route.post("/update", updateUser);
route.post("/destory", destoryUser);
module.exports = route;
