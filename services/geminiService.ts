
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getArticleSummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following article in 3-4 concise bullet points:\n\n${content}`,
      config: {
        systemInstruction: "You are a professional editor. Provide a clear, insightful summary of the provided text.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Unable to generate summary at this time.";
  }
};

export const suggestTopics = async (draft: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this draft, suggest 5 catchy and SEO-friendly titles:\n\n${draft}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      }
    });
    const data = JSON.parse(response.text || '{"suggestions": []}');
    return data.suggestions;
  } catch (error) {
    console.error("Gemini topic suggestion error:", error);
    return [];
  }
};

export const improveWriting = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite this paragraph to be more engaging and polished while maintaining the original meaning:\n\n${text}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini improvement error:", error);
    return text;
  }
};
