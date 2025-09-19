"use server";

import { z } from "zod";
import { InferenceEngine } from "@/lib/inference";

const SummarizeDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe("The complete text content of the document to be summarized."),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the input document."),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(
  input: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput> {
  const engine = await InferenceEngine.getInstance();
  const summary = await engine.summarize(input.documentText);

  return { summary };
}
