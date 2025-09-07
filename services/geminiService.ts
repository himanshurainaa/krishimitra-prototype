import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Message, WeatherForecast } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


export const getChatResponse = async (history: Message[], newMessage: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            config: {
                systemInstruction: "You are 'Krishi Mitra AI', a friendly and knowledgeable agricultural expert for Indian farmers. Provide advice in simple, clear language. If the user asks in a specific Indian language, respond in that language. Address topics like crop selection, soil health, pest control, and market prices.",
            }
        });
        const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
};

export const analyzeCropImage = async (imageFile: File): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = {
            text: `Analyze this image of a crop. Identify any visible pests or diseases. Provide a detailed analysis including:
1.  **Identification**: What is the likely disease or pest?
2.  **Symptoms**: Describe the symptoms visible in the image.
3.  **Recommendations**: Suggest both organic and chemical treatment options suitable for small-scale farming in India.
Present the information in a clear, easy-to-understand format. If the image is not clear or not a crop, state that.`
        };
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error analyzing crop image:", error);
        throw new Error("Failed to analyze the image.");
    }
};

export const getLiveAdvisorResponseStream = async (imageBases64: string[], textPrompt: string) => {
    try {
        const imageParts = imageBases64.map(base64Data => ({
            inlineData: { data: base64Data, mimeType: 'image/jpeg' },
        }));

        const textPart = {
            text: `Question: "${textPrompt}"`
        };
        
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: { parts: [...imageParts, textPart] },
            config: {
                systemInstruction: `You are 'Krishi Mitra AI', a live video assistant for an Indian farmer. The farmer is showing you a live video of their crop and asking a question. You are receiving a sequence of frames from the video.
- Analyze the sequence of video frames and the farmer's question to understand the context.
- First, IDENTIFY the language the user is speaking.
- Provide a concise, helpful, and conversational answer based on the visual information and the question.
- **CRITICAL**: Your entire response MUST be in the SAME language the user spoke.
- **CRITICAL**: Before your main response, you MUST prefix it with the BCP-47 language code for the detected language inside square brackets. For example: '[hi-IN]' for Hindi, '[en-IN]' for Indian English, '[ta-IN]' for Tamil.
- Example response for a question in Hindi: '[hi-IN] नमस्ते! मैं आपकी मदद कैसे कर सकता हूँ?'
- The response will be spoken aloud, so keep it short and easy to understand.`
            }
        });
        
        return response;
    } catch (error) {
        console.error("Error getting live advisor response:", error);
        throw new Error("Failed to get live advisor response.");
    }
};


export const fetchWeatherAdvice = async (): Promise<WeatherForecast[]> => {
    try {
        const prompt = "Provide a 5-day weather forecast and practical agricultural advice for a generic central Indian location. For each day, provide the day name, temperature range (Celsius), a single dominant weather condition (Sunny, Cloudy, Partly Cloudy, Rainy, or Stormy), and a concise, actionable tip for farmers related to that day's weather.";
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING },
                            temp: { type: Type.STRING },
                            condition: { type: Type.STRING },
                            advice: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error fetching weather advice:", error);
        throw new Error("Failed to fetch weather advice.");
    }
};

export const fetchMarketPrices = async (): Promise<string> => {
    try {
        const prompt = "Provide a summary of today's typical market prices (Mandi Bhav) for major crops like wheat, rice, tomatoes, and onions in a generic North Indian agricultural market. Present it in a simple table format. State that prices are indicative and may vary.";
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching market prices:", error);
        throw new Error("Failed to fetch market prices.");
    }
};

export const fetchSoilAdvice = async (soilType: string, cropName: string): Promise<string> => {
    try {
        const prompt = `As 'Krishi Mitra AI', provide detailed soil health advice for a small farmer in India growing '${cropName}' in '${soilType}' soil. The advice should be practical and easy to follow. Include these sections:
1.  **Soil Preparation**: Tips for preparing this soil type for this specific crop.
2.  **Fertilizer Recommendations (Organic)**: Suggest organic manures and composts, including application methods and timing.
3.  **Fertilizer Recommendations (Chemical)**: Suggest key NPK fertilizers and micronutrients, with recommended dosages (e.g., in kg/hectare) and application schedules.
4.  **Long-term Soil Enrichment**: Provide tips for improving soil health over multiple seasons for this soil type.

Format the response clearly with headings.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching soil advice:", error);
        throw new Error("Failed to fetch soil advice.");
    }
};