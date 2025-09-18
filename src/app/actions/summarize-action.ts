"use server";

import { summarizeDocument as summarizeDocumentFlow, type SummarizeDocumentInput, type SummarizeDocumentOutput } from "@/ai/flows/summarize-documents";

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  try {
    const result = await summarizeDocumentFlow(input);
    return result;
  } catch (error) {
    console.error("Summarization error:", error);
    return { summary: "Could not generate a summary at this time." };
  }
}
