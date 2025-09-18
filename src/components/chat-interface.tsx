"use client";

import { useState, useRef, useEffect, useTransition, useActionState } from "react";
import { Paperclip, SendHorizonal, BrainCircuit, Book, ThumbsDown, ThumbsUp } from "lucide-react";

import type { ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageList } from "@/components/chat/message-list";
import { getAiResponse } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialSocraticState = {
  attempts: 0,
  topicId: `topic-${Date.now()}`,
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socraticState, setSocraticState] = useState(initialSocraticState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [state, formAction] = useActionState(getAiResponse, null);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
      // remove the last optimistic message
      setMessages((prev) => prev.slice(0, -1));
    } else if (state?.response) {
      setMessages((prev) => [...prev, state.response!]);
    }
  }, [state, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleFormSubmit = async (formData: FormData) => {
    const userInput = formData.get("message") as string;
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userInput,
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Topic change detection
    if (userInput.toLowerCase().startsWith("new topic:")) {
      setSocraticState(initialSocraticState);
      formData.set("newTopic", "true");
    }

    formData.set("socraticAttempts", String(socraticState.attempts));
    
    startTransition(() => {
      formAction(formData);
      setSocraticState(prev => ({...prev, attempts: prev.attempts + 1}));
    });
    
    formRef.current?.reset();
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && textAreaRef.current) {
      textAreaRef.current.value = `File attached: ${file.name}`;
      textAreaRef.current.focus();
    }
  };

  const showSocraticUnlock = socraticState.attempts >= 3;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <MessageList messages={messages} setMessages={setMessages} />
      </ScrollArea>
      <div className="p-4 border-t bg-card">
        {showSocraticUnlock && (
            <Card className="mb-2 border-accent bg-accent/10">
                <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-primary" />Socratic Mode</h3>
                            <p className="text-sm text-muted-foreground">You've made {socraticState.attempts} attempts. You can now request the full answer.</p>
                        </div>
                        <form action={handleFormSubmit}>
                            <input type="hidden" name="message" value="Please give me the full answer." />
                            <input type="hidden" name="unlock" value="true" />
                            <Button size="sm">
                                <Book className="mr-2" />
                                Get Full Answer
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        )}
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex items-start gap-4"
        >
          <Textarea
            ref={textAreaRef}
            name="message"
            placeholder="Ask SAAI anything... or start with 'New topic: ' to reset."
            rows={1}
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            disabled={isPending}
          />
          <Input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={isPending}
          />
          <Label htmlFor="file-upload" asChild>
            <Button asChild type="button" variant="outline" size="icon" disabled={isPending}>
              <span className="cursor-pointer">
                <Paperclip className="w-5 h-5" />
              </span>
            </Button>
          </Label>
          <Button type="submit" size="icon" disabled={isPending}>
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
