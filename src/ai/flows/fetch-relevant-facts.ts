"use server";

import { z } from "zod";

const FetchRelevantFactsInputSchema = z.object({
  topic: z.string().describe("The topic to fetch information about from Wikipedia."),
});
export type FetchRelevantFactsInput = z.infer<typeof FetchRelevantFactsInputSchema>;

const FetchRelevantFactsOutputSchema = z.object({
  title: z.string().describe("The title of the Wikipedia article."),
  summary: z.string().describe("A summary of the Wikipedia article."),
  dateAccessed: z.string().describe("The date the Wikipedia article was accessed."),
});
export type FetchRelevantFactsOutput = z.infer<typeof FetchRelevantFactsOutputSchema>;

export async function fetchRelevantFacts(
  input: FetchRelevantFactsInput
): Promise<FetchRelevantFactsOutput> {
  // This is a mock implementation that simulates fetching from Wikipedia.
  // In a real scenario, this would call a Wikipedia API.
  const title = `Facts about ${input.topic}`;
  const summary = `This is a summary about ${input.topic}. SAAI Tutor's local AI has provided this information by searching its knowledge base.`;

  return {
    title,
    summary,
    dateAccessed: new Date().toISOString().split("T")[0],
  };
}
