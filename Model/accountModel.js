const mongoose = require("mongoose");

const { Schema } = mongoose;
const accountSchema = new Schema(
  {
    userId: { type: String, default: null },
    accountsType: String,
  },
  {
    timestamps: true,
  }
);
const AccountModel = mongoose.model("Account", accountSchema);
module.exports = AccountModel;
