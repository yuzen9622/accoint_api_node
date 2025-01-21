const express = require("express");
const { getCategory, addCategory } = require("../Controller/categoryControl");

const route = express.Router();

route.get("/", getCategory);
route.post("/add", addCategory);

module.exports = route;
