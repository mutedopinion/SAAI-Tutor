"use client";

import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import type { FetchRelevantFactsOutput } from "@/ai/flows/fetch-relevant-facts";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface WikipediaCardProps {
  wikiData: FetchRelevantFactsOutput;
}

export function WikipediaCard({ wikiData }: WikipediaCardProps) {
    const placeholderImage = PlaceHolderImages.find(p => p.id === "wiki-diagram-1");

  return (
    <Card className="bg-background/50">
      <CardHeader>
        <CardTitle className="text-base font-bold">{wikiData.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {placeholderImage && (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                <Image
                    src={placeholderImage.imageUrl}
                    alt={placeholderImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={placeholderImage.imageHint}
                />
            </div>
        )}
        <p className="text-sm">{wikiData.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Accessed on {wikiData.dateAccessed} (via Wikipedia)</span>
        <div className="flex gap-2">
            <Button variant="ghost" size="sm">
                <Download className="mr-2 h-3 w-3" />
                Download PNG
            </Button>
            <Button variant="ghost" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                Source
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
