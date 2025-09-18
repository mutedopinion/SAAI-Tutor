"use server";

import { generateVisualAid } from "@/ai/flows/generate-visual-aids";
import { fetchRelevantFacts } from "@/ai/flows/fetch-relevant-facts";
import { summarizeDocument } from "@/ai/flows/summarize-documents";
import type { ChatMessage } from "@/lib/types";

const fullAnswerKeywords = ["full answer", "explain", "i want answers", "i don’t know", "show solution"];

export async function getAiResponse(
  prevState: any,
  formData: FormData
): Promise<{ response: ChatMessage | null; error: string | null }> {
  const userInput = formData.get("message") as string;
  const wantsUnlock = formData.get("unlock") === "true";
  const isNewTopic = formData.get("newTopic") === "true";
  const socraticAttempts = parseInt(
    formData.get("socraticAttempts") as string,
    10
  );

  const wantsFullAnswer =
    wantsUnlock || fullAnswerKeywords.some((keyword) => userInput.toLowerCase().includes(keyword));

  try {
    let response: ChatMessage;

    if (userInput.toLowerCase().match(/\b(draw|diagram|sketch|mindmap)\b/)) {
      const visualAidType = userInput.includes("mindmap") ? "mindmap" : "mermaid";
      const result = await generateVisualAid({
        topic: userInput,
        visualAidType,
      });
      response = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.progress,
        visualAid: result,
      };
    } else if (userInput.toLowerCase().match(/\b(wiki|facts about|what is)\b/)) {
        const result = await fetchRelevantFacts({ topic: userInput });
        response = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `Here is some information about ${result.title}.`,
            wikiData: result,
        }
    } else if (isNewTopic || socraticAttempts < 3 && !wantsFullAnswer) {
      const hints = [
        "What do you already know about this? Which part feels tricky?",
        "Let's try focusing on the core idea. What happens if you look at it from another angle?",
        "Let's break it into steps. Can you outline the first step?",
      ];
      response = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: hints[socraticAttempts] || hints[2],
        socraticAttempt: socraticAttempts + 1,
      };
    } else {
        // Full answer mode
        const result = await summarizeDocument({documentText: `Explain in detail: ${userInput}`});
        response = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `Here is a detailed explanation:\n\n${result.summary}`,
            unlocked: true,
        };
    }

    return { response, error: null };
  } catch (error) {
    console.error(error);
    return {
      response: null,
      error: "An error occurred while getting a response from the AI.",
    };
  }
}
