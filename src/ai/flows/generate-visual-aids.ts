// src/ai/flows/generate-visual-aids.ts
'use server';

/**
 * @fileOverview A flow for generating visual aids like mindmaps or diagrams from text.
 *
 * - generateVisualAid - A function that generates visual aids from text.
 * - GenerateVisualAidInput - The input type for the generateVisualAid function.
 * - GenerateVisualAidOutput - The return type for the generateVisualAid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualAidInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a visual aid.'),
  visualAidType: z
    .enum(['mindmap', 'mermaid'])
    .describe('The type of visual aid to generate: mindmap or mermaid diagram.'),
});
export type GenerateVisualAidInput = z.infer<typeof GenerateVisualAidInputSchema>;

const GenerateVisualAidOutputSchema = z.object({
  visualAid: z.string().describe('The generated visual aid in text or Mermaid format.'),
  progress: z.string().describe('A short summary of the generated visual aid.'),
});
export type GenerateVisualAidOutput = z.infer<typeof GenerateVisualAidOutputSchema>;

export async function generateVisualAid(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  return generateVisualAidFlow(input);
}

const mindmapPrompt = ai.definePrompt({
  name: 'mindmapPrompt',
  input: {schema: GenerateVisualAidInputSchema},
  output: {schema: z.string()},
  prompt: `Create a text mindmap for {{topic}}, 3 levels deep, bullets only.`,
});

const mermaidPrompt = ai.definePrompt({
  name: 'mermaidPrompt',
  input: {schema: GenerateVisualAidInputSchema},
  output: {schema: z.string()},
  prompt: `Output a Mermaid graph for {{topic}}, no extra text:\ngraph TD\n  A([{{topic}}]) --> B[Branch 1]\n  A --> C[Branch 2]`, // Ensure newlines are included in the prompt
});

const generateVisualAidFlow = ai.defineFlow(
  {
    name: 'generateVisualAidFlow',
    inputSchema: GenerateVisualAidInputSchema,
    outputSchema: GenerateVisualAidOutputSchema,
  },
  async input => {
    let visualAid: string;

    if (input.visualAidType === 'mindmap') {
      const {output} = await mindmapPrompt(input);
      visualAid = output!;
    } else {
      const {output} = await mermaidPrompt(input);
      visualAid = output!;
    }

    return {
      visualAid: visualAid,
      progress: `Generated a ${input.visualAidType} for the topic: ${input.topic}.`,
    };
  }
);
