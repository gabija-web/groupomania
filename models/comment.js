const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true},
  comment: { type: String, required: true }
});

module.exports = mongoose.model("Comment", CommentSchema);