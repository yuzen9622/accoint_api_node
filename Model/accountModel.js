const mongoose = require("mongoose");

const { Schema } = mongoose;
const accountSchema = new Schema(
  {
    userId: { type: String, default: null },
    accountsType: String,
    amount: { type: Number, default: 0 },
    initalAmount: { type: Number, default: 0 },
    toAccountId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);
const AccountModel = mongoose.model("Account", accountSchema);
module.exports = AccountModel;
