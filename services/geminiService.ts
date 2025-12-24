
import { GoogleGenAI } from "@google/genai";
import { VerificationResult, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: 'AIzaSyA75v0NSVwCBh1KijtXOo-HWdc8paSDimw' || '' });

export async function verifyContent(
  text: string, 
  imageUri?: string
): Promise<VerificationResult> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a world-class investigative journalist and fact-checker. 
    Your goal is to evaluate the truthfulness of the content provided (text or image).
    
    CRITICAL INSTRUCTIONS:
    1. Use Google Search to find current and credible sources.
    2. Provide a "Trust Score" from 0 to 100 where 100 is indisputable truth and 0 is complete fabrication.
    3. Categorize the content as: Reliable, Partially True, Misleading, Fake, or Unknown.
    4. Provide a concise summary of the verification.
    5. List detailed findings explaining WHY the content is true or false.
    
    Your response should follow this structure (Markdown):
    # TRUST_SCORE: [Number]
    # VERDICT: [Category]
    # SUMMARY: [One-sentence summary]
    # FINDINGS: [Bullet points of detailed analysis]
  `;

  const contents: any[] = [{ text }];
  
  if (imageUri) {
    const base64Data = imageUri.split(',')[1];
    const mimeType = imageUri.split(';')[0].split(':')[1];
    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const textOutput = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Parse the structured text output
    const scoreMatch = textOutput.match(/TRUST_SCORE:\s*(\d+)/i);
    const verdictMatch = textOutput.match(/VERDICT:\s*(\w+)/i);
    const summaryMatch = textOutput.match(/SUMMARY:\s*([^\n#]+)/i);
    const findingsMatch = textOutput.match(/FINDINGS:\s*([\s\S]*)/i);

    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "External Source",
        uri: chunk.web.uri
      }));

    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
      verdict: (verdictMatch ? verdictMatch[1] : 'Unknown') as any,
      summary: summaryMatch ? summaryMatch[1].trim() : "Analysis complete.",
      details: findingsMatch ? findingsMatch[1].trim() : "Detailed analysis not provided.",
      sources,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Verification error:", error);
    throw new Error("Failed to analyze content. Please try again.");
  }
}
