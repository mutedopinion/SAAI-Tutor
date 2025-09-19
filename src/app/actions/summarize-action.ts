"use server";

import { summarizeDocument as summarizeDocumentFlow, type SummarizeDocumentInput, type SummarizeDocumentOutput } from "@/ai/flows/summarize-documents";

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  try {
    console.log("Starting summarization flow for text:", input.documentText.substring(0, 100));
    const result = await summarizeDocumentFlow(input);
    console.log("Summarization result:", result);
    return result;
  } catch (error) {
    console.error("Summarization error in action:", error);
    let errorMessage = "Could not generate a summary at this time.";
    if (error instanceof Error) {
      errorMessage = `Could not generate summary: ${error.message}`;
    }
    return { summary: errorMessage };
  }
}
