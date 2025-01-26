const express = require("express");
const {
  getCategory,
  addCategory,
  deleteCategory,
} = require("../Controller/categoryControl");

const route = express.Router();

route.get("/", getCategory);
route.post("/add", addCategory);
route.get("/delete/:_id", deleteCategory);

module.exports = route;
