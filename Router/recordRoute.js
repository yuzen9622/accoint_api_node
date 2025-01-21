const express = require("express");
const {
  addRecord,
  getRecord,
  deleteRecord,
} = require("../Controller/recordControl");

const route = express.Router();

route.post("/add", addRecord);
route.get("/", getRecord);
route.get("/delete/:recordId", deleteRecord);
module.exports = route;
