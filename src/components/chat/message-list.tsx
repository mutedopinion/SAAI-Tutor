"use client";

import type { Dispatch, SetStateAction } from "react";
import { BrainCircuit } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { Message } from "@/components/chat/message";

interface MessageListProps {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function MessageList({ messages, setMessages }: MessageListProps) {
  const handleInsertIntoInput = (text: string) => {
    const input = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
    if (input) {
      input.value = text;
      input.focus();
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
            <BrainCircuit className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-headline">Welcome to SAAI Tutor</h2>
        <p className="text-muted-foreground max-w-md mt-2">
          Your personal AI-powered study assistant. Start a conversation below to begin your learning journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg, index) => (
        <Message
          key={msg.id}
          message={msg}
          onInsertIntoInput={handleInsertIntoInput}
        />
      ))}
    </div>
  );
}
