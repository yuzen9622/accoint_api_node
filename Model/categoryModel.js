const mongoose = require("mongoose");

const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    userId: { type: String, default: null },
    categoriesType: String,
    source: String,
    usage: { type: Number, default: 0 },
    index: { type: Number },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
