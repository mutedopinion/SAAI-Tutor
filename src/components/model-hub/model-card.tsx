"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download } from "lucide-react";

export interface Model {
  id: string;
  name: string;
  family: string;
  size: string;
  contextWindow: string;
  format: string;
  license: string;
}

interface ModelCardProps {
  model: Model;
  isActive: boolean;
  onActivate: () => void;
}

export function ModelCard({ model, isActive, onActivate }: ModelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{model.name}</span>
          {isActive && <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Family:</strong> {model.family}</p>
            <p><strong>Size:</strong> ~{model.size} params</p>
            <p><strong>Context:</strong> {model.contextWindow} tokens</p>
            <p><strong>Format:</strong> <Badge variant="outline">{model.format}</Badge></p>
            <p><strong>License:</strong> {model.license}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onActivate} disabled={isActive} className="w-full">
            {isActive ? (
                <>
                    <CheckCircle className="mr-2" /> Activated
                </>
            ) : (
                <>
                    <Download className="mr-2" /> Download & Activate
                </>
            )}
        </Button>
      </CardFooter>
    </Card>
  );
}
