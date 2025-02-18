const express = require("express");
const {
  loginUser,
  registerUser,
  getToken,
  registerSetting,
  updateUser,
  destoryUser,
  updateTheme,
  googleLoginUser,
} = require("../Controller/userControl");

const route = express.Router();

route.post("/login", loginUser);
route.post("/register", registerUser);
route.get("/token", getToken);
route.get("/setting/:_id", registerSetting);
route.post("/update", updateUser);
route.post("/destory", destoryUser);
route.post("/theme", updateTheme);
route.post("/auth/google", googleLoginUser);
module.exports = route;
