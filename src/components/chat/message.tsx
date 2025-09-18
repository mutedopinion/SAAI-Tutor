"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageActions } from "@/components/chat/message-actions";
import { MermaidCard } from "@/components/chat/mermaid-card";
import { WikipediaCard } from "@/components/chat/wikipedia-card";

interface MessageProps {
  message: ChatMessage;
  onInsertIntoInput: (text: string) => void;
}

export function Message({ message, onInsertIntoInput }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-4 group",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      <Avatar>
        <AvatarImage />
        <AvatarFallback>
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <Card
          className={cn(
            "rounded-2xl",
            isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card rounded-bl-none"
          )}
        >
          <CardContent className="p-3">
            {message.visualAid ? (
              <MermaidCard visualAid={message.visualAid} />
            ) : message.wikiData ? (
              <WikipediaCard wikiData={message.wikiData} />
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </CardContent>
        </Card>
        <div className="flex items-center gap-2">
            {!isUser && message.socraticAttempt && (
                <span className="text-xs text-muted-foreground">Hint #{message.socraticAttempt}</span>
            )}
            <MessageActions
                message={message}
                onInsertIntoInput={onInsertIntoInput}
            />
        </div>
      </div>
    </div>
  );
}
