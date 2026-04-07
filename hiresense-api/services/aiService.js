const axios = require("axios");

// Centralized Model Config for OpenRouter
const DEFAULT_MODEL = "openai/gpt-4o-mini";

const EVALUATION_SYSTEM_PROMPT = `You are an expert Senior Engineering Manager conducting a mock interview. Your task is to evaluate the candidate's answer honestly, even if the answer is completely wrong, irrelevant, or nonsensical. 

IMPORTANT RULES:
- You MUST always return a valid JSON evaluation, even for terrible answers.
- If the answer is completely wrong, give low scores (1-3 range).
- If the answer is off-topic or gibberish, give scores of 1 and explain why in weaknesses.
- Never refuse to evaluate. Every answer deserves feedback.

CRITICAL INSTRUCTION: Even if the user's answer is complete gibberish (e.g., "asdfasdf"), entirely off-topic, a single word, or too short to evaluate, you MUST STILL return the exact requested JSON structure. Do NOT output plain text, apologies, or disclaimers — only JSON. In these cases, set overallScore to 1, all metric scores to 1, leave the "strengths" array empty [], state that the input was unreadable or irrelevant in the "weaknesses" array, and provide a generic "improvedAnswer" for the question.

Return your evaluation STRICTLY as a JSON object with this exact structure:
{ "overallScore": Number (1-10), "metrics": { "technicalDepth": Number (1-10), "communication": Number (1-10), "confidence": Number (1-10) }, "strengths": ["..."], "weaknesses": ["..."], "actionableSuggestions": ["..."], "improvedAnswer": "..." }

Do not include markdown formatting like \`\`\`json, return raw JSON only.`;

/**
 * Evaluate Interview Answer using OpenRouter
 */
exports.evaluateAnswer = async (question, transcription, customContext = "") => {
  let userPrompt = `Question: ${question}\nCandidate's Answer: ${transcription}`;

  if (customContext) {
    userPrompt += `\n\nCRITICAL: You have been provided with the candidate's background or target job description below. You MUST cross-reference their spoken answer with this context. In the 'weaknesses' or 'improvedAnswer' section, explicitly suggest a specific project, skill, or metric from this context that they SHOULD have mentioned to make their answer stronger.\n\nCandidate Context:\n${customContext}`;
  }

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
        timeout: 30000, // 30s — prevent hanging on slow/failed responses
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

    let parsed;
    try {
      parsed = JSON.parse(rawJsonResponse);
    } catch (parseErr) {
      console.warn("⚠️ JSON.parse failed on AI response — returning fallback evaluation.");
      console.warn("   Raw response was:", rawJsonResponse.substring(0, 300));
      return {
        overallScore: 1,
        metrics: { technicalDepth: 1, communication: 1, confidence: 1 },
        strengths: [],
        weaknesses: ["System could not process the provided answer. Input may have been gibberish or too short."],
        actionableSuggestions: ["Provide a clear, relevant answer that addresses the question directly."],
        improvedAnswer: "Please provide a clear and relevant answer to the question next time."
      };
    }
    
    // Validate that critical fields exist and are numbers
    if (typeof parsed.overallScore !== 'number' || isNaN(parsed.overallScore)) {
      parsed.overallScore = 1;
    }
    if (!parsed.metrics || typeof parsed.metrics !== 'object') {
      parsed.metrics = { technicalDepth: 1, communication: 1, confidence: 1 };
    }
    if (!Array.isArray(parsed.strengths)) parsed.strengths = [];
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
exports.generateDynamicQuestion = async (role, topic, difficulty, customContext = "") => {
  let systemPrompt = `You are an expert technical hiring manager. Generate a single, highly specific interview question for a candidate applying for a ${difficulty} ${role} role, focusing specifically on ${topic}. Do NOT provide the answer, hints, or any introductory text. Return ONLY the raw question string.`;

  if (customContext) {
    systemPrompt += `\n\nUse the following resume or job description context to make the question hyper-personalized to their specific experience or the specific job requirements:\n${customContext}`;
  }

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
