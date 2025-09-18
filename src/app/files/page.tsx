"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { summarizeDocument } from "@/app/actions/summarize-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Loader2, Sparkles } from "lucide-react";

export default function FilesPage() {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSummarize = async () => {
    startTransition(async () => {
        if (!fileContent) return;
        const result = await summarizeDocument({ documentText: fileContent });
        if (result.summary) {
            setSummary(result.summary);
        } else {
            setSummary("Failed to generate summary.");
        }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline">File Upload & Summary</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>Upload a TXT, PDF, or image file for parsing and summarization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input id="file-upload" type="file" onChange={handleFileChange} accept=".txt,.pdf,.png,.jpg" />
                </div>
                <Textarea 
                    placeholder="File content will appear here..." 
                    value={fileContent} 
                    readOnly 
                    className="h-64 font-code text-xs"
                />
            </CardContent>
            <CardFooter>
                <Button onClick={handleSummarize} disabled={isPending || !fileContent}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Summarize Content
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Generated Summary</CardTitle>
                <CardDescription>AI-generated summary of the uploaded document.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea 
                    placeholder="Summary will appear here..." 
                    value={summary} 
                    readOnly 
                    className="h-80"
                />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
