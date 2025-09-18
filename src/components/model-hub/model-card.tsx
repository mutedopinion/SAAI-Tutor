"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Loader2, Pause, Play } from "lucide-react";
import type { DownloadState } from "@/hooks/use-downloader";
import { Progress } from "@/components/ui/progress";

export interface Model {
  id: string;
  name: string;
  family: string;
  size: string;
  fileSize: string;
  contextWindow: string;
  format: string;
  license: string;
  url: string;
}

interface ModelCardProps {
  model: Model;
  isActive: boolean;
  onActivate: () => void;
  onDownload: () => void;
  downloadState: DownloadState;
}

export function ModelCard({ model, isActive, onActivate, onDownload, downloadState }: ModelCardProps) {

  const renderDownloadButton = () => {
    switch (downloadState.status) {
      case 'idle':
        return <Button onClick={onDownload} className="w-full"><Download className="mr-2" /> Download</Button>;
      case 'downloading':
        return <Button variant="outline" className="w-full"><Loader2 className="mr-2 animate-spin" /> Downloading</Button>;
      case 'paused':
        return <Button onClick={onDownload} className="w-full"><Play className="mr-2" /> Resume</Button>;
      case 'completed':
        return <Button onClick={onActivate} disabled={isActive} className="w-full">{isActive ? <><CheckCircle className="mr-2" /> Activated</> : 'Activate'}</Button>;
      default:
        return null;
    }
  }

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
            <p><strong>Size:</strong> {model.fileSize} (~{model.size} params)</p>
            <p><strong>Context:</strong> {model.contextWindow} tokens</p>
            <p><strong>Format:</strong> <Badge variant="outline">{model.format}</Badge></p>
            <p><strong>License:</strong> {model.license}</p>
        </div>
        {downloadState.status === 'downloading' && (
            <div className="space-y-1">
                <Progress value={downloadState.progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">{downloadState.progress}%</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        {renderDownloadButton()}
      </CardFooter>
    </Card>
  );
}
