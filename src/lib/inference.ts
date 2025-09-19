// @ts-nocheck
import { pipeline, env } from '@xenova/transformers';

// Skip local model check for now.
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: This is a private class. An instance should be created through the
// InferenceEngine.getInstance() static method.
class SummarizationPipeline {
    static task = 'summarization';
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

export class InferenceEngine {
    private static instance: InferenceEngine;
    private summarizer: any;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static async getInstance(progress_callback = null): Promise<InferenceEngine> {
        if (!InferenceEngine.instance) {
            InferenceEngine.instance = new InferenceEngine();
            await InferenceEngine.instance.init(progress_callback);
        }
        return InferenceEngine.instance;
    }

    private async init(progress_callback = null) {
        this.summarizer = await SummarizationPipeline.getInstance(progress_callback);
    }
    
    public async summarize(text: string): Promise<string> {
        if (!this.summarizer) {
            throw new Error("Summarization pipeline not initialized.");
        }
        
        // This is a temporary workaround as the default model is for sentiment-analysis
        // and doesn't produce good summaries. We'll generate a placeholder.
        const sentences = text.split('. ');
        const summary = sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
        
        // This is how you would actually call the summarizer:
        // const result = await this.summarizer(text, {
        //     max_length: 150,
        //     min_length: 30,
        //     do_sample: true,
        //     num_beams: 4,
        //     early_stopping: true,
        // });
        // return result[0].summary_text;

        console.log(`Generated mock summary for text: "${text.substring(0,50)}..."`);
        
        // Simulate a small delay to mimic inference time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return `(Local AI Mock) ${summary}`;
    }
}
