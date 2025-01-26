const express = require("express");
const {
  getAccount,
  addAccount,
  updateAccount,
} = require("../Controller/accountControl");

const route = express.Router();
route.get("/", getAccount);
route.post("/add", addAccount);
route.post("/update", updateAccount);
module.exports = route;
