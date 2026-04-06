const { evaluateAnswer } = require("../services/aiService");
const { transcribeAudio } = require("../services/transcriptionService");
const Evaluation = require("../models/Evaluation");

exports.processEvaluation = async (req, res) => {
  try {
    let transcription = "";

    if (req.file) {
      transcription = await transcribeAudio(req.file.buffer, req.file.originalname);
      console.log("🎤 Transcribed Text:", transcription);
    } else if (req.body.textAnswer) {
      transcription = req.body.textAnswer;
      console.log("💬 Typed Answer Provided:", transcription);
    } else {
      return res.status(400).json({ success: false, message: "No audio file or text answer provided" });
    }

    const question = req.body.question || "Explain the Virtual DOM and why React uses it.";
    const evaluationResult = await evaluateAnswer(question, transcription);
    console.log("Returned evaluationResult:", evaluationResult);

    const safeScore = evaluationResult?.overallScore || evaluationResult?.score || 5;
    const safeStrengths = Array.isArray(evaluationResult?.strengths)
      ? evaluationResult.strengths.join(", ")
      : (evaluationResult?.strengths || "Adequate baseline response.");
    const safeImprovements = Array.isArray(evaluationResult?.weaknesses)
      ? evaluationResult.weaknesses.join(", ")
      : (evaluationResult?.weaknesses || evaluationResult?.improvements || "Expand upon your technical reasoning.");
    const safePitch = evaluationResult?.improvedAnswer || evaluationResult?.improvedPitch || "Consider detailing the underlying mechanics completely.";

    const newRecord = new Evaluation({
      candidateName: req.body.candidateName || "Alex Rivera",
      sessionTitle: req.body.sessionTitle || "Frontend Engineering - Medium",
      score: safeScore,
      strengths: safeStrengths,
      improvements: safeImprovements,
      improvedPitch: safePitch,
      audioFilePath: "memory-buffer",
    });

    // ✅ Non-fatal DB save
    let savedRecord = null;
    try {
      savedRecord = await newRecord.save();
    } catch (dbErr) {
      console.warn("⚠️ DB save failed (non-fatal):", dbErr.message);
    }

    const payload = savedRecord ? savedRecord.toObject() : { ...evaluationResult, candidateName: req.body.candidateName };
    // Mix in the things that Mongoose didn't save so the dashboard can render them natively
    return res.status(200).json({
      success: true,
      data: {
        ...payload,
        metrics: evaluationResult.metrics || { technicalDepth: 8, communication: 7, confidence: 8 },
        actionableSuggestions: evaluationResult.actionableSuggestions || [],
        transcription: transcription || req.body.textAnswer,
        question: question
      },
    });

  } catch (error) {
    console.error("FATAL Evaluation Error:", error.message);
    console.error("STACK TRACE:", error.stack);
    return res.status(500).json({ success: false, message: "Server error during evaluation: " + error.message });
  }
};