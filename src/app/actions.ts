"use server";

import { generateVisualAid } from "@/ai/flows/generate-visual-aids";
import { fetchRelevantFacts } from "@/ai/flows/fetch-relevant-facts";
import { summarizeDocument } from "@/ai/flows/summarize-documents";
import type { ChatMessage } from "@/lib/types";

const fullAnswerKeywords = ["full answer", "explain", "i want answers", "i don’t know", "show solution"];

function getSocraticHint(topic: string, attempt: number): string {
    // More dynamic hint generation
    const cleanTopic = topic.replace(/^(new topic:|what is|facts about|draw|diagram|sketch|mindmap)\s*/i, '').trim();

    const baseHints = [
        `What are your initial thoughts on "${cleanTopic}"?`,
        `How would you break down the topic "${cleanTopic}" into smaller pieces?`,
        `Is there a specific part of "${cleanTopic}" that you're stuck on?`,
        `Can you relate "${cleanTopic}" to something you already know?`,
        `What if you tried to explain "${cleanTopic}" to a friend? What would you say first?`
    ];

    const advancedHints = [
        `Let's dig deeper into "${cleanTopic}". What are its core components?`,
        `Can you think of a real-world example related to "${cleanTopic}"?`,
        `What are the potential challenges or controversies surrounding "${cleanTopic}"?`
    ];
    
    if (attempt < baseHints.length) {
        return baseHints[attempt];
    }
    return advancedHints[(attempt - baseHints.length) % advancedHints.length];
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
