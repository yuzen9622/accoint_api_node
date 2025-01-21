const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,

      unique: true,
    },
    password: {
      type: String,

      minlength: 7,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
