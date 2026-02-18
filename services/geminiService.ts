import { GoogleGenAI } from "@google/genai";
import { WardrobeItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the Chief Investment Officer for "Wardrobe Capital". 
Your role is to treat the user's wardrobe as a financial portfolio.
Analyze items based on "Cost Per Wear" (CPW), "Resale Value", and "Utility".
Use financial terminology (e.g., ROI, depreciation, asset class, diversification, liquidity).
Be concise, professional, but stylish.
Always format your response in Markdown.`;

export const getPortfolioAdvice = async (items: WardrobeItem[], question: string): Promise<string> => {
  const portfolioSummary = items.map(item => 
    `- ${item.brand} ${item.name} (${item.category}): Bought for €${item.price}, Worn ${item.wearsPerYear}x/year.`
  ).join('\n');

  const prompt = `
Portfolio Data:
${portfolioSummary}

User Query: ${question}

Analyze the portfolio or answer the question with a focus on maximizing value and sustainability.
If the portfolio is empty, give general advice on how to start building a wardrobe investment portfolio.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 1024 },
        maxOutputTokens: 2048,
      },
    });

    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating advice: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const estimateResale = async (brand: string, category: string, price: number): Promise<string> => {
    const prompt = `Estimate the resale value retention (%) after 5 years for a ${brand} ${category} purchased for €${price}. Return a JSON object with 'retentionPercentage' (number) and 'reasoning' (string).`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        return response.text || "{}";
    } catch (e) {
        return "{}";
    }
}