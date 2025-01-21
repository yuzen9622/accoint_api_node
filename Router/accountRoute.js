const express = require("express");
const { getAccount, addAccount } = require("../Controller/accountControl");

const route = express.Router();
route.get("/", getAccount);
route.post("/add", addAccount);
module.exports = route;
