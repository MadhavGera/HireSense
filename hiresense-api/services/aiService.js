const axios = require("axios");

// Centralized Model Config for OpenRouter
const DEFAULT_MODEL = "openai/gpt-4o-mini";

const EVALUATION_SYSTEM_PROMPT = `You are an expert Senior Engineering Manager conducting a mock interview. Your task is to evaluate the candidate's answer honestly, even if the answer is completely wrong, irrelevant, or nonsensical. 

IMPORTANT RULES:
- You MUST always return a valid JSON evaluation, even for terrible answers.
- If the answer is completely wrong, give low scores (1-3 range).
- If the answer is off-topic or gibberish, give scores of 1 and explain why in weaknesses.
- Never refuse to evaluate. Every answer deserves feedback.

Return your evaluation STRICTLY as a JSON object with this exact structure:
{ "overallScore": Number (1-10), "metrics": { "technicalDepth": Number (1-10), "communication": Number (1-10), "confidence": Number (1-10) }, "strengths": ["..."], "weaknesses": ["..."], "actionableSuggestions": ["..."], "improvedAnswer": "..." }

Do not include markdown formatting like \`\`\`json, return raw JSON only.`;

/**
 * Evaluate Interview Answer using OpenRouter
 */
exports.evaluateAnswer = async (question, transcription) => {
  const userPrompt = `Question: ${question}\nCandidate's Answer: ${transcription}`;

  try {
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is missing");

    const modelInfo = process.env.OPENROUTER_DEFAULT_MODEL || DEFAULT_MODEL;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: modelInfo,
        messages: [
          { role: "system", content: EVALUATION_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "HireSense Dashboard",
          "Content-Type": "application/json"
        }
      }
    );

    let rawJsonResponse = response.data.choices[0].message.content;

    // Clean markdown manual wrappings from open source models
    rawJsonResponse = rawJsonResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Try to extract JSON from the response even if there's extra text around it
    const jsonMatch = rawJsonResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawJsonResponse = jsonMatch[0];
    }

    const parsed = JSON.parse(rawJsonResponse);
    
    // Validate that critical fields exist and are numbers
    if (typeof parsed.overallScore !== 'number' || isNaN(parsed.overallScore)) {
      parsed.overallScore = 2; // Default low score for unparseable results
    }
    if (!parsed.metrics || typeof parsed.metrics !== 'object') {
      parsed.metrics = { technicalDepth: 2, communication: 2, confidence: 2 };
    }
    if (!Array.isArray(parsed.strengths)) parsed.strengths = ["No notable strengths identified."];
    if (!Array.isArray(parsed.weaknesses)) parsed.weaknesses = ["Answer needs significant improvement."];
    if (!Array.isArray(parsed.actionableSuggestions)) parsed.actionableSuggestions = ["Study the fundamentals of the topic."];
    if (!parsed.improvedAnswer) parsed.improvedAnswer = "A better answer would directly address the question with relevant technical details.";

    return parsed;

  } catch (error) {
    console.error(`❌ Evaluation Error (OpenRouter):`, error?.response?.data || error.message);
    
    // Fallback — always returns a valid evaluation so the record still saves
    return {
      overallScore: 2.0,
      metrics: { technicalDepth: 2, communication: 2, confidence: 2 },
      strengths: ["The candidate attempted to answer the question."],
      weaknesses: ["The answer could not be properly evaluated by the AI.", "The response may have been off-topic or unclear."],
      actionableSuggestions: ["Review the core concepts for this topic.", "Practice structuring answers using the STAR method."],
      improvedAnswer: "A strong answer would directly address the question with specific technical details and examples."
    };
  }
};

/**
 * Generate Dynamic Interview Question using OpenRouter
 */
exports.generateDynamicQuestion = async (role, topic, difficulty) => {
  const systemPrompt = `You are an expert technical hiring manager. Generate a single, highly specific interview question for a candidate applying for a ${difficulty} ${role} role, focusing specifically on ${topic}. Do NOT provide the answer, hints, or any introductory text. Return ONLY the raw question string.`;

  try {
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is missing");

    const modelInfo = process.env.OPENROUTER_DEFAULT_MODEL || DEFAULT_MODEL;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: modelInfo,
        messages: [
          { role: "system", content: systemPrompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "HireSense Dashboard",
          "Content-Type": "application/json"
        }
      }
    );

    let generatedQuestion = response.data.choices[0].message.content.trim();
    return generatedQuestion;

  } catch (error) {
    console.error(`❌ Question Generation Error (OpenRouter):`, error?.response?.data || error.message);
    return `Can you explain a complex problem you solved recently related to ${topic}?`;
  }
};
