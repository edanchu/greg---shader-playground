const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerAvatar: { type: String, required: true },
  content: { type: String, required: true, default: "" },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Comment", CommentSchema);
