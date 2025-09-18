"use client";

import { useState } from "react";
import { ModelCard } from "@/components/model-hub/model-card";
import type { Model } from "@/components/model-hub/model-card";

const models: Model[] = [
  {
    id: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
    name: "Qwen 2.5 0.5B",
    family: "Qwen",
    size: "0.5B",
    contextWindow: "32k",
    format: "GGUF",
    license: "Tongyi Qianwen LICENSE",
  },
  {
    id: 'google/gemma-2b-it-gguf',
    name: "Gemma 2B IT",
    family: "Gemma",
    size: "2B",
    contextWindow: "8k",
    format: "GGUF",
    license: "Gemma Terms of Use",
  },
  {
    id: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF',
    name: "TinyLlama 1.1B",
    family: "Llama",
    size: "1.1B",
    contextWindow: "2k",
    format: "GGUF",
    license: "Apache 2.0",
  },
  {
    id: 'microsoft/Phi-3-mini-4k-instruct-gguf',
    name: "Phi-3 Mini 4k",
    family: "Phi",
    size: "3.8B",
    contextWindow: "4k",
    format: "GGUF",
    license: "MIT",
  },
];

export default function ModelHubPage() {
    const [activeModel, setActiveModel] = useState<string>(models[0].id);

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline">Model Hub</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Models</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {models.map(model => (
                    <ModelCard 
                        key={model.id}
                        model={model}
                        isActive={activeModel === model.id}
                        onActivate={() => setActiveModel(model.id)}
                    />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
