
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateInvoiceDescription = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return "API Key not configured. Please set the API_KEY environment variable.";
    }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are an assistant who writes professional, concise, and clear descriptions for invoice line items based on user input. Output only the description text, without any preamble or extra formatting.",
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 50,
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Error generating description.";
  }
};
