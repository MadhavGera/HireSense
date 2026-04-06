const { evaluateAnswer } = require("../services/aiService");
const { transcribeAudio } = require("../services/transcriptionService");
const Evaluation = require("../models/Evaluation");

exports.processEvaluation = async (req, res) => {
  try {
    let transcription = "";

    // 1 & 2. Process Transcription or Text Answer
    if (req.file) {
      transcription = await transcribeAudio(req.file.buffer, req.file.originalname);
      console.log("🎤 Transcribed Text:", transcription);
    } else if (req.body.textAnswer) {
      transcription = req.body.textAnswer;
      console.log("💬 Typed Answer Provided:", transcription);
    } else {
      return res.status(400).json({ success: false, message: "No audio file or text answer provided" });
    }

    // In a real app, the question is provided by the frontend payload
    const question = req.body.question || "Explain the Virtual DOM and why React uses it.";

    // 3. Call our AI Service with the transcribed text
    const evaluationResult = await evaluateAnswer(question, transcription);
    console.log("Returned evaluationResult:", evaluationResult);

    const safeScore = evaluationResult?.overallScore || evaluationResult?.score || 5;
    const safeStrengths = Array.isArray(evaluationResult?.strengths) ? evaluationResult.strengths.join(", ") : (evaluationResult?.strengths || "Adequate baseline response.");
    const safeImprovements = Array.isArray(evaluationResult?.weaknesses) ? evaluationResult.weaknesses.join(", ") : (evaluationResult?.weaknesses || evaluationResult?.improvements || "Expand upon your technical reasoning.");
    const safePitch = evaluationResult?.improvedAnswer || evaluationResult?.improvedPitch || "Consider detailing the underlying mechanics completely.";

    // 3. Save the result to MongoDB 
    const newRecord = new Evaluation({
      candidateName: req.body.candidateName || "Alex Rivera",
      sessionTitle: req.body.sessionTitle || "Frontend Engineering - Medium",
      score: safeScore,
      strengths: safeStrengths,
      improvements: safeImprovements,
      improvedPitch: safePitch,
      audioFilePath: "memory-buffer", // Mock path as we're not saving the file
    });

    const savedRecord = await newRecord.save();

    // 4. Return the evaluation payload back to the frontend
    res.status(200).json({
      success: true,
      data: savedRecord,
    });
  } catch (error) {
    console.error("FATAL Evaluation Error:", error.message);
    console.error("STACK TRACE:", error.stack);
    res.status(500).json({ success: false, message: "Server error during evaluation: " + error.message });
  }
};
