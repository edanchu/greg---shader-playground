const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '', required: true },
  code: { type: String, default: '', required: true },
  likes: { type: Number, default: 0, required: true },
  public: { type: Boolean, default: false, required: true },
  textures: { type: [String], required: true },
});

module.exports = mongoose.model('Project', ProjectSchema);
