const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    candidateName: { type: String, default: "Anonymous Candidate" },
    sessionTitle: { type: String, default: "Frontend Engineering - Medium" },
    question: { type: String },
    transcription: { type: String },
    evaluationJSON: { type: Object },
    score: { type: Number, required: true },
    strengths: { type: String, default: "No specific strengths identified." },
    improvements: { type: String, default: "Expand upon your technical reasoning." },
    improvedPitch: { type: String, default: "Consider elaborating further." },
    // A placeholder if we decide to store the actual file path or S3 URL
    audioFilePath: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
