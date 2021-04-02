const mongoose = require("mongoose");

const { Schema } = mongoose;

const BookmarkSchema = new Schema({
  user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "UserSchema"
  },
  room : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "CourseSchema"
},
});

module.exports = mongoose.model("BookmarkSchema", BookmarkSchema);