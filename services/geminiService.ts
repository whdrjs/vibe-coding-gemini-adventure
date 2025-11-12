import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { StoryTurn, GeminiResponse } from '../types';

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: 'en' | 'ko'): string => {
    const langSpecificInstructions = language === 'ko'
    ? `You MUST write the 'story', 'choices', 'inventory', and 'quest' fields in Korean.
The 'imagePrompt' field MUST remain in English for the image model.`
    : `All fields ('story', 'choices', 'inventory', 'quest', 'imagePrompt') must be in English.`

    return `You are a master storyteller for an interactive text-based adventure game.
Your goal is to create a branching narrative where the user's choices matter.
You must respond in a specific JSON format.

Here are the rules:
1.  **Story:** Write the next part of the story. It should be engaging, descriptive, and move the plot forward based on the user's last choice. The story should be a single paragraph of 3-5 sentences.
2.  **Choices:** Provide 2-4 distinct and meaningful choices for the player to make. Each choice should start with a relevant emoji and lead to a different path in the story.
3.  **Inventory:** Keep track of the player's inventory. You can add or remove items based on the story. The inventory should be a list of strings.
4.  **Quest:** Maintain a simple quest for the player to follow. Update it as they make progress.
5.  **ImagePrompt:** Create a descriptive, vivid, and artistic prompt in English for an image generation model that captures the current scene. E.g., "A lone adventurer stands at the edge of a glowing, ethereal forest, a mystical sword in hand, digital art."
6.  **Language:** ${langSpecificInstructions}

Always respond with a valid JSON object matching the specified schema. Do not include any text outside of the JSON object.
`;
}


// Define the JSON schema for the model's response to ensure consistent output
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "The next part of the story. A single paragraph of 3-5 sentences."
    },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-4 distinct choices for the player, each starting with an emoji."
    },
    inventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The player's current inventory."
    },
    quest: {
      type: Type.STRING,
      description: "The current quest objective."
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A descriptive prompt in English for an image generation model."
    }
  },
  required: ['story', 'choices', 'inventory', 'quest', 'imagePrompt']
};

/**
 * Generates the next part of the story using the Gemini API.
 * @param history The history of the conversation.
 * @param choice The player's latest choice.
 * @param language The language for the response ('en' or 'ko').
 * @param storyModel The story generation model to use.
 * @returns A promise that resolves to the parsed Gemini response.
 */
export const getNextStoryPart = async (
    history: StoryTurn[],
    choice: string,
    language: 'en' | 'ko',
    storyModel: 'gemini-2.5-flash' | 'gemini-2.5-pro'
): Promise<GeminiResponse> => {
  const userTurn: StoryTurn = {
    role: 'user',
    parts: [{ text: choice }],
  };

  const contents = [...history, userTurn];
  const systemInstruction = getSystemInstruction(language);

  // Call the Gemini API to generate content with a specific JSON structure
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: storyModel, // Using a faster model for better responsiveness
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.9,
    },
  });

  const jsonText = response.text.trim();
  try {
    // Parse the JSON string from the response
    const parsedResponse = JSON.parse(jsonText);
    return parsedResponse as GeminiResponse;
  } catch (error) {
    console.error("Failed to parse JSON response:", jsonText, error);
    
    const fallbackStory = language === 'ko' 
        ? "운명의 바람이 울부짖고 있지만, 길은 불분명합니다. 에테르와의 연결이 약합니다. 다시 한번 선택해 주세요."
        : "The winds of fate are howling, but the path is unclear. The connection to the aether is weak. Please try making a choice again.";
    const fallbackChoices = language === 'ko'
        ? ["다시 바람의 소리에 귀 기울여 본다.", "다른 길을 찾아본다."]
        : ["Try to listen to the winds again.", "Look for a different path."];
    const fallbackQuest = language === 'ko'
        ? "운명과 다시 연결하세요."
        : "Reconnect with your destiny.";

    // Provide a fallback response in case of a parsing error
    return {
      story: fallbackStory,
      choices: fallbackChoices,
      inventory: [],
      quest: fallbackQuest,
      imagePrompt: "Static noise on a television screen, digital art.",
    };
  }
};

/**
 * Generates an image using the selected image generation API.
 * @param prompt The prompt for image generation.
 * @param imageModel The image generation model to use.
 * @returns A promise that resolves to a base64 encoded image data URL.
 */
export const generateImage = async (
    prompt: string,
    imageModel: 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image'
): Promise<string> => {
    if (imageModel === 'imagen-4.0-generate-001') {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else { // 'gemini-2.5-flash-image'
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("Image generation with gemini-2.5-flash-image failed.");
    }
};