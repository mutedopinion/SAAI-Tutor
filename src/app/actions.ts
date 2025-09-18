"use server";

import { generateVisualAid } from "@/ai/flows/generate-visual-aids";
import { fetchRelevantFacts } from "@/ai/flows/fetch-relevant-facts";
import { summarizeDocument } from "@/ai/flows/summarize-documents";
import type { ChatMessage } from "@/lib/types";

const fullAnswerKeywords = ["full answer", "explain", "i want answers", "i don’t know", "show solution"];

function getSocraticHint(topic: string, attempt: number): string {
    const baseHints = [
        `What are your initial thoughts on "${topic}"?`,
        `How would you break down the topic "${topic}" into smaller pieces?`,
        `Is there a specific part of "${topic}" that you're stuck on?`,
        `Can you relate "${topic}" to something you already know?`,
        `What if you tried to explain "${topic}" to a friend? What would you say first?`
    ];
    return baseHints[attempt % baseHints.length] || baseHints[0];
}


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
      const hint = getSocraticHint(userInput, socraticAttempts);
      response = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: hint,
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
