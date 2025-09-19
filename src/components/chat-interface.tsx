"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import { Paperclip, SendHorizonal, BrainCircuit, Book, X } from "lucide-react";
import Image from "next/image";

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
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(getAiResponse, null);

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
    if (!userInput.trim() && !attachedFile) return;

    let content = userInput;
    if (attachedFile) {
        content = `File attached: ${attachedFile.name}\n${userInput}`;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content,
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Topic change detection
    if (userInput.toLowerCase().startsWith("new topic:")) {
      setSocraticState(initialSocraticState);
      formData.set("newTopic", "true");
    }

    formData.set("socraticAttempts", String(socraticState.attempts));
    
    formAction(formData);
    setSocraticState(prev => ({...prev, attempts: prev.attempts + 1}));
    
    formRef.current?.reset();
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
    setAttachedFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      textAreaRef.current?.focus();
    }
  };
  
  const clearAttachment = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

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
          <div className="relative flex-1">
            <Textarea
                ref={textAreaRef}
                name="message"
                placeholder="Ask SAAI anything... or start with 'New topic: ' to reset."
                rows={1}
                className="flex-1 resize-none pr-12"
                onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                }
                }}
                disabled={isPending}
            />
             <Input 
                ref={fileInputRef}
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={isPending}
                accept="image/*,application/pdf,.txt,.md"
            />
            <Label htmlFor="file-upload" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button type="button" variant="ghost" size="icon" disabled={isPending} className="h-8 w-8">
                    <Paperclip className="w-5 h-5" />
                </Button>
            </Label>
            {filePreview && (
                <div className="absolute bottom-full left-0 mb-2 w-24 h-24 rounded-md border overflow-hidden bg-muted">
                    <Image src={filePreview} alt="File preview" layout="fill" objectFit="cover" />
                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 bg-black/50 hover:bg-black/75" onClick={clearAttachment}>
                        <X className="w-4 h-4 text-white" />
                    </Button>
                </div>
            )}
             {attachedFile && !filePreview && (
                 <div className="absolute bottom-full left-0 mb-2 p-2 rounded-md border bg-muted text-sm">
                    <span>{attachedFile.name}</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={clearAttachment}>
                        <X className="w-4 h-4" />
                    </Button>
                 </div>
             )}
          </div>
          <Button type="submit" size="icon" disabled={isPending}>
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
