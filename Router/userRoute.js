const express = require("express");
const {
  loginUser,
  registerUser,
  getToken,
} = require("../Controller/userControl");

const route = express.Router();

route.post("/login", loginUser);
route.post("/register", registerUser);
route.get("/token", getToken);
module.exports = route;
