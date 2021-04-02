const mongoose = require("mongoose");

const { Schema } = mongoose;

const CourseSchema = new Schema({
  courseNameFull: String
});

module.exports = mongoose.model("CourseSchema", CourseSchema);
