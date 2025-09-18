'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching relevant facts from Wikipedia.
 *
 * - fetchRelevantFacts - A function that orchestrates the fact-fetching process.
 * - FetchRelevantFactsInput - The input type for the fetchRelevantFacts function.
 * - FetchRelevantFactsOutput - The return type for the fetchRelevantFacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchRelevantFactsInputSchema = z.object({
  topic: z.string().describe('The topic to fetch information about from Wikipedia.'),
});
export type FetchRelevantFactsInput = z.infer<typeof FetchRelevantFactsInputSchema>;

const FetchRelevantFactsOutputSchema = z.object({
  title: z.string().describe('The title of the Wikipedia article.'),
  summary: z.string().describe('A summary of the Wikipedia article.'),
  dateAccessed: z.string().describe('The date the Wikipedia article was accessed.'),
});
export type FetchRelevantFactsOutput = z.infer<typeof FetchRelevantFactsOutputSchema>;

export async function fetchRelevantFacts(input: FetchRelevantFactsInput): Promise<FetchRelevantFactsOutput> {
  return fetchRelevantFactsFlow(input);
}

const fetchRelevantFactsPrompt = ai.definePrompt({
  name: 'fetchRelevantFactsPrompt',
  input: {schema: FetchRelevantFactsInputSchema},
  output: {schema: FetchRelevantFactsOutputSchema},
  prompt: `You are an AI assistant designed to fetch information from Wikipedia.
  Your task is to find a relevant Wikipedia article for the given topic and provide a summary.

  Topic: {{{topic}}}

  Output the title, summary, and the current date.
  `,
});

const fetchRelevantFactsFlow = ai.defineFlow(
  {
    name: 'fetchRelevantFactsFlow',
    inputSchema: FetchRelevantFactsInputSchema,
    outputSchema: FetchRelevantFactsOutputSchema,
  },
  async input => {
    const {output} = await fetchRelevantFactsPrompt(input);
    // Ensure dateAccessed is properly populated with the current date
    return {
      ...output!,
      dateAccessed: new Date().toISOString().split('T')[0],
    };
  }
);
