import { config } from 'dotenv';
config();

import '@/ai/flows/generate-visual-aids.ts';
import '@/ai/flows/fetch-relevant-facts.ts';
import '@/ai/flows/summarize-documents.ts';