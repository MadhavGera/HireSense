const fs = require("fs");
const os = require("os");
const path = require("path");

/**
 * Mock Transcription Service (OpenAI disabled)
 */
exports.transcribeAudio = async (fileBuffer, originalFilename) => {
  console.log("Mock transcription requested. Returning simulated transcription.");
  
  // Simulate delay to mimic actual audio processing
  await new Promise(res => setTimeout(res, 1200));
  
  return "This is a simulated transcription. The OpenAI SDK was formally removed as part of the OpenRouter ecosystem migration. My core engineering strengths lie in rapid prototyping and ensuring seamless pipeline operations!";
};
