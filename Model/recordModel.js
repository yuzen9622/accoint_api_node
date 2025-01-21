const mongoose = require("mongoose");
const { Schema } = mongoose;
const recordSchema = new Schema(
  {
    userId: String,
    categoryId: String,
    accountId: String,
    amount: { type: Number },
    description: String,
    source: String,
    date: Date,
  },
  {
    timestamps: true,
  }
);
const RecordModel = mongoose.model("Record", recordSchema);
module.exports = RecordModel;
