const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema({
  text: String,
  user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "UserSchema"
  },
  room : {
    type : String,
    required : true
},
}, {timestamps : true});

module.exports = mongoose.model("MessageSchema", MessageSchema);