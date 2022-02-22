const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  ownerName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '', required: true },
  likes: { type: Number, default: 0, required: true },
  public: { type: Boolean, default: false, required: true },
  code: {
    type: [String],
    default: [
      // Main
      `void mainImage(out vec4 FragColor) {
        float color = (1.0 + sin(iTime)) / 2.0;
        FragColor = vec4(color, 1.0 - color, cos(color), 1.0);
      }`,
      // Buffer A
      `void mainImage(out vec4 FragColor){
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Buffer B
      `void mainImage(out vec4 FragColor){
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Buffer C
      `void mainImage(out vec4 FragColor){
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Buffer D
      `void mainImage(out vec4 FragColor){
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Common
      `vec2 sampleFunction( vec2 input1, float input2 ){
        return input1 * input2;
      }`,
    ],
    required: true,
  },
  channelUniforms: {
    type: [[String]],
    default: [
      [null, null, null, null], // Main
      [null, null, null, null], // Buffer A
      [null, null, null, null], // Buffer B
      [null, null, null, null], // Buffer C
      [null, null, null, null], // Buffer D
    ],
    required: true,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
