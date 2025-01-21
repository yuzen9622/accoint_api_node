const mongoose = require("mongoose");

const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    userId: { type: String, default: null },
    categoriesType: String,
    source: String,
  },
  {
    timestamps: true,
  }
);
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
