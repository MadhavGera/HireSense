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
      userId: req.body.userId || "anonymous",
      candidateName: req.body.candidateName || "Alex Rivera",
      sessionTitle: req.body.sessionTitle || "Frontend Engineering - Medium",
      question: question,
      transcription: transcription || req.body.textAnswer,
      evaluationJSON: evaluationResult,
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

exports.generateReport = async (req, res) => {
  try {
    const { evaluations } = req.body;
    
    // Default metrics mapped from raw evaluations.
    let avgTechnical = 8.0, avgComm = 7.5, avgConfidence = 8.0;
    
    if (evaluations && evaluations.length > 0) {
      /* Calculate true averages from the OpenRouter json payload. */
      const validScores = evaluations.filter(e => e.evaluation && typeof e.evaluation.score === "number").map(e => e.evaluation.score);
      const averageEvalScore = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length) : 7.5;
      
      const firstEvalData = evaluations[0]?.evaluation || {};
      const generatedAiPitch = firstEvalData.improvedPitch || firstEvalData.improvedAnswer || "We recommend expanding on your structural foundations logically.";
      
      const rawMetrics = firstEvalData.metrics || {};
      const suggestions = firstEvalData.actionableSuggestions || ["Refine structural definitions.", "Enhance confident delivery."];
      
      const dashboardData = {
        candidateName: "Alex Rivera",
        hireabilityScore: Number(averageEvalScore.toFixed(1)),
        percentile: "top 2%",
        metrics: [
          { label: "Technical Depth", score: rawMetrics.technicalDepth || 8, icon: "Terminal", barHeights: [2,4,3,6,7], barOpacities: [20,40,60,80,100] },
          { label: "Communication", score: rawMetrics.communication || 7.5, icon: "AudioLines", barHeights: [4,5,2,3,4], barOpacities: [20,40,60,80,40] },
          { label: "Confidence", score: rawMetrics.confidence || 8, icon: "Zap", barHeights: [2,3,6,5,8], barOpacities: [20,40,60,80,100] }
        ],
        skillBreakdown: [
          { subject: "Architecture", score: (rawMetrics.technicalDepth || 8) * 10, fullMark: 100 },
          { subject: "DSA", score: (rawMetrics.problemSolving || 7.2) * 10, fullMark: 100 },
          { subject: "React", score: (rawMetrics.technicalDepth || 8) * 10, fullMark: 100 },
          { subject: "Soft Skills", score: (rawMetrics.communication || 7) * 10, fullMark: 100 },
          { subject: "Security", score: 65, fullMark: 100 }
        ],
        questionBreakdown: {
          currentQuestion: evaluations.length,
          totalQuestions: evaluations.length,
          questionText: evaluations[0]?.question || "No question string provided?",
          transcript: firstEvalData.transcription || firstEvalData.textAnswer || "Transcript mapping missing",
          strengths: Array.isArray(firstEvalData.strengths) ? firstEvalData.strengths.join(", ") : (firstEvalData.strengths || "Adequate."),
          improvements: Array.isArray(firstEvalData.improvements) ? firstEvalData.improvements.join(", ") : (firstEvalData.improvements || firstEvalData.weaknesses || "Expand upon your technical reasoning.")
        },
        aiPitch: generatedAiPitch,
        nextSteps: suggestions.map((s, idx) => ({
          icon: idx % 3 === 0 ? "GraduationCap" : idx % 3 === 1 ? "Mic" : "Users",
          title: `Focus Point ${idx+1}`,
          description: s
        }))
      };

      return res.status(200).json({
        success: true,
        data: { dashboardData }
      });
    }

    return res.status(400).json({ success: false, message: "No evaluations provided" });
  } catch (err) {
    console.error("Report gen error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Evaluation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Get History Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error fetching history: " + error.message });
  }
};