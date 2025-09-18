"use server";

import { z } from "zod";

const GenerateVisualAidInputSchema = z.object({
  topic: z.string().describe("The topic for which to generate a visual aid."),
  visualAidType: z
    .enum(["mindmap", "mermaid"])
    .describe("The type of visual aid to generate: mindmap or mermaid diagram."),
});
export type GenerateVisualAidInput = z.infer<typeof GenerateVisualAidInputSchema>;

const GenerateVisualAidOutputSchema = z.object({
  visualAid: z.string().describe("The generated visual aid in text or Mermaid format."),
  visualAidType: z.enum(['mindmap', 'mermaid']),
  progress: z.string().describe("A short summary of the generated visual aid."),
});
export type GenerateVisualAidOutput = z.infer<typeof GenerateVisualAidOutputSchema>;

export async function generateVisualAid(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  let visualAid: string;

  if (input.visualAidType === "mindmap") {
    visualAid = `
- ${input.topic}
  - Branch 1
    - Sub-branch 1.1
    - Sub-branch 1.2
  - Branch 2
    - Sub-branch 2.1
  - Branch 3
    `;
  } else {
    visualAid = `graph TD\n  A([${input.topic}]) --> B[Branch 1]\n  A --> C[Branch 2]`;
  }

  return {
    visualAid: visualAid,
    visualAidType: input.visualAidType,
    progress: `Generated a ${input.visualAidType} for the topic: ${input.topic}.`,
  };
}
