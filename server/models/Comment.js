const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  content: { type: String, required: true, default: "" },
  likes: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Comment", CommentSchema);
