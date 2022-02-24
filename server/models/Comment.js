const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  content: { type: String, required: true, default: '' },
  likes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
