import { GoogleGenAI } from "@google/genai";
import { WardrobeItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the Chief Investment Officer for "Wardrobe Capital". 
Your role is to treat the user's wardrobe as a financial portfolio.
Analyze items based on "Cost Per Wear" (CPW), "Resale Value", and "Utility".
Use financial terminology (e.g., ROI, depreciation, asset class, diversification, liquidity).
Be concise, professional, but stylish.
Always format your response in Markdown.`;

export const analyzeImage = async (base64Image: string): Promise<any> => {
    const prompt = `Analyze this clothing item. Return a JSON object with the following fields:
    - name: a short descriptive name
    - brand: brand name if visible, or "Unknown"
    - category: one of "Tops", "Bottoms", "Outerwear", "Shoes", "Bags", "Accessories"
    - price: estimated original retail price in EUR as a number
    - material: primary material
    - color: primary color
    
    Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: prompt }
                ]
            }
        });
        
        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Image analysis failed:", error);
        return null;
    }
}

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