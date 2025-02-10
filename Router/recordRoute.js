const express = require("express");
const {
  addRecord,
  getRecord,
  deleteRecord,
  updateRecord,
} = require("../Controller/recordControl");

const route = express.Router();

route.post("/add", addRecord);
route.get("/", getRecord);
route.post("/update", updateRecord);
route.get("/delete/:recordId", deleteRecord);
module.exports = route;
