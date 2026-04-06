const axios = require("axios");

// Centralized Model Config for OpenRouter
const DEFAULT_MODEL = "openai/gpt-4o-mini";

const EVALUATION_SYSTEM_PROMPT = `You are an expert Senior Engineering Manager conducting a mock interview. Your task is to evaluate the candidate's answer. Evaluate based on: 1. Relevance & Correctness. 2. Technical Depth. 3. Communication & Structure. Return your evaluation STRICTLY as a JSON object with this structure: { "overallScore": Number, "metrics": { "technicalDepth": Number, "communication": Number, "confidence": Number }, "strengths": ["..."], "weaknesses": ["..."], "actionableSuggestions": ["..."], "improvedAnswer": "..." } Do not include markdown formatting like \`\`\`json, return raw JSON.`;

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
        // Note: Some OpenRouter models support structured outputs visually, 
        // but not the strict response_format object payload natively.
        // We instruct strict JSON in the prompt.
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

    return JSON.parse(rawJsonResponse);

  } catch (error) {
    console.error(`❌ Evaluation Error (OpenRouter):`, error?.response?.data || error.message);
    
    // Fallback Mock JSON to prevent frontend crash
    return {
      overallScore: 7.0,
      metrics: { technicalDepth: 7, communication: 7, confidence: 7 },
      strengths: ["API Error occurred, returned dummy response", "Fall-back triggered due to missing credentials or OpenRouter limits"],
      weaknesses: ["Unable to verify due to AI limits"],
      actionableSuggestions: ["Check the backend keys and configure OPENROUTER_API_KEY"],
      improvedAnswer: "Ensure OPENROUTER_API_KEY is correctly configured in .env."
    };
  }
};

/**
 * Generate Dynamic Interview Question using OpenRouter
 */
exports.generateDynamicQuestion = async (role, topic, difficulty) => {
  const systemPrompt = `You are an expert technical interviewer. Generate one realistic, non-generic interview question based on:
Role: ${role}
Topic: ${topic}
Difficulty: ${difficulty}
Return only the question.`;

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
