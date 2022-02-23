const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "", required: true },
<<<<<<< Updated upstream
  code: { type: String, default: "", required: true },
=======
>>>>>>> Stashed changes
  likes: { type: Number, default: 0, required: true },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
  },
  public: { type: Boolean, default: false, required: true },
  //textures: { type: [String], required: true },
  textures: { type: [String], required: false },
});

module.exports = mongoose.model("Project", ProjectSchema);
