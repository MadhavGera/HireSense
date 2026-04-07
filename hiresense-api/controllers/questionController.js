const { generateDynamicQuestion } = require("../services/aiService");

exports.generateQuestion = async (req, res) => {
  try {
    const { role, topic, difficulty, customContext } = req.body;

    if (!role || !topic || !difficulty) {
      return res.status(400).json({ success: false, message: "Missing required fields (role, topic, difficulty)" });
    }

    const question = await generateDynamicQuestion(role, topic, difficulty, customContext);

    return res.status(200).json({
      success: true,
      data: { question }
    });
  } catch (error) {
    console.error("FATAL Question Generation Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during question generation: " + error.message });
  }
};
