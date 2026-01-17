
import { GoogleGenAI } from "@google/genai";

// Image skinning service using Gemini 3 Pro Image Preview for high-fidelity 4K output
export const editKitchenImage = async (base64Image: string, prompt: string, mimeType: string) => {
  // Create a new instance right before the call to ensure the latest API key from the selection dialog is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Apply a high-fidelity 2D vector art style to this kitchen image based on the following instruction: ${prompt}. Maintain the spatial layout of a cooking game kitchen but change colors, lighting, and textures to match the cyberpunk or gourmet theme requested. Output ONLY the image.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "4K"
        }
      }
    });

    // The output may contain both text and image parts; we must iterate to find the image
    const candidates = response.candidates || [];
    if (candidates.length === 0) return null;

    const parts = candidates[0].content?.parts || [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      // InlineData contains the generated image in base64 format
      if (p.inlineData && p.inlineData.data) {
        return `data:image/png;base64,${p.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    // If the API key is invalid or lacks billing, throw a specific error to trigger re-selection in the UI
    if (error?.message && error.message.includes("Requested entity was not found.")) {
      throw new Error("API_KEY_INVALID");
    }
    return null;
  }
};
