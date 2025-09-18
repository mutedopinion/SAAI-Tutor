"use client";

import { useEffect, useId } from "react";
import mermaid from "mermaid";
import type { GenerateVisualAidOutput } from "@/ai/flows/generate-visual-aids";
import { Skeleton } from "@/components/ui/skeleton";

interface MermaidCardProps {
  visualAid: GenerateVisualAidOutput;
}

export function MermaidCard({ visualAid }: MermaidCardProps) {
  const id = useId();
  const diagramId = `mermaid-diagram-${id}`;
  const isMindmap = visualAid.visualAidType === "mindmap";

  useEffect(() => {
    if (!isMindmap) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
            background: "#ffffff",
            primaryColor: "#E8EAF6",
            primaryTextColor: "#3F51B5",
            primaryBorderColor: "#3F51B5",
            lineColor: "#3F51B5",
            textColor: "#333",
        }
      });
      mermaid.run({
        nodes: [document.getElementById(diagramId)!],
      });
    }
  }, [diagramId, visualAid.visualAid, isMindmap]);

  if (isMindmap) {
    return <pre className="font-code text-sm bg-muted p-3 rounded-md">{visualAid.visualAid}</pre>;
  }

  return (
    <div>
      <div id={diagramId} className="mermaid" key={visualAid.visualAid}>
        {visualAid.visualAid}
      </div>
      <noscript>
        <p>This diagram requires JavaScript to render.</p>
        <pre>{visualAid.visualAid}</pre>
      </noscript>
      <style jsx>{`
        .mermaid {
          line-height: initial;
        }
      `}</style>
    </div>
  );
}
