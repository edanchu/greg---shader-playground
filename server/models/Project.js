const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '', required: true },
  likes: { type: Number, default: 0, required: true },
  public: { type: Boolean, default: false, required: true },
  code: {
    type: [String],
    default: [
      // Main
      `void mainImage( out vec4 FragColor, in vec4 FragCoord ) 
      {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = FragCoord.xy/iResolution.xy;

        // Time varying pixel color
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

        // Output to screen
        FragColor = vec4(col,1.0);
      }`,
      // Buffer A
      `void mainImage( out vec4 FragColor, in vec4 FragCoord )
      {
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Buffer B
      `void mainImage( out vec4 FragColor, in vec4 FragCoord )
      {
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Buffer C
      `void mainImage( out vec4 FragColor, in vec4 FragCoord )
      {
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Buffer D
      `void mainImage( out vec4 FragColor, in vec4 FragCoord )
      {
        FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }`,
      // Common
      `void someFunction( vec4 a, float b )
      {
        return a+b;
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
