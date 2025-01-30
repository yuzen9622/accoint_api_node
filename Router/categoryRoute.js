const express = require("express");
const {
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} = require("../Controller/categoryControl");

const route = express.Router();

route.get("/", getCategory);
route.post("/add", addCategory);
route.get("/delete/:_id", deleteCategory);
route.post("/update", updateCategory);
module.exports = route;
