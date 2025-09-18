import type { GenerateVisualAidOutput } from "@/ai/flows/generate-visual-aids";
import type { FetchRelevantFactsOutput } from "@/ai/flows/fetch-relevant-facts";

export type MessageRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  socraticAttempt?: number;
  unlocked?: boolean;
  visualAid?: GenerateVisualAidOutput;
  wikiData?: FetchRelevantFactsOutput;
};
