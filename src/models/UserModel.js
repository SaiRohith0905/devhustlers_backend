const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
