const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String
});

module.exports = mongoose.model("UserSchema", UserSchema);