const express = require("express");
const {
  getAccount,
  addAccount,
  updateAccount,
  deleteAccount,
} = require("../Controller/accountControl");

const route = express.Router();
route.get("/", getAccount);
route.post("/add", addAccount);
route.post("/update", updateAccount);
route.get("/delete/:_id", deleteAccount);
module.exports = route;
