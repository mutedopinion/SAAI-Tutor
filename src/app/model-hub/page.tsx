"use client";

import { useState } from "react";
import { ModelCard } from "@/components/model-hub/model-card";
import type { Model } from "@/components/model-hub/model-card";
import { useDownloader } from "@/hooks/use-downloader";

const models: Model[] = [
  {
    id: 'Qwen/Qwen2.5-0.5B-Instruct-GGUF',
    name: "Qwen 2.5 0.5B",
    family: "Qwen",
    size: "0.5B",
    contextWindow: "32k",
    format: "GGUF",
    license: "Tongyi Qianwen LICENSE",
    url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0_5b-instruct-q4_k_m.gguf"
  },
  {
    id: 'google/gemma-2b-it-gguf',
    name: "Gemma 2B IT",
    family: "Gemma",
    size: "2B",
    contextWindow: "8k",
    format: "GGUF",
    license: "Gemma Terms of Use",
    url: "https://huggingface.co/google/gemma-2b-it-gguf/resolve/main/gemma-2b-it.gguf"
  },
  {
    id: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF',
    name: "TinyLlama 1.1B",
    family: "Llama",
    size: "1.1B",
    contextWindow: "2k",
    format: "GGUF",
    license: "Apache 2.0",
    url: "https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q2_K.gguf"
  },
  {
    id: 'microsoft/Phi-3-mini-4k-instruct-gguf',
    name: "Phi-3 Mini 4k",
    family: "Phi",
    size: "3.8B",
    contextWindow: "4k",
    format: "GGUF",
    license: "MIT",
    url: "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf"
  },
];

export default function ModelHubPage() {
    const [activeModel, setActiveModel] = useState<string>(models[0].id);
    const { startDownload, getDownloadState } = useDownloader(models.map(m => ({id: m.id, url: m.url, name: m.name})));

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
                        onDownload={() => startDownload(model.id)}
                        downloadState={getDownloadState(model.id)}
                    />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
