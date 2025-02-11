const mongoose = require("mongoose");

const { Schema } = mongoose;
const accountSchema = new Schema(
  {
    userId: { type: String, default: null },
    accountsType: String,
    amount: { type: Number },
    initialAmount: { type: Number },
    toAccountId: { type: String, default: null },
    autoDebit: { type: Boolean, default: false },
    autoDebitDay: { type: Number, min: 1, max: 31, default: null },
  },
  {
    timestamps: true,
  }
);
const AccountModel = mongoose.model("Account", accountSchema);
module.exports = AccountModel;
