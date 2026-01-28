"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CodeExampleProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
}

export function CodeExample({ code, language = "typescript", title, description }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");

  useEffect(() => {
    // 简单的代码高亮（可以后续集成 shiki）
    const highlighted = code
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-green-600 dark:text-green-400">$&</span>')
      .replace(/\/\/.*$/gm, '<span class="text-green-600 dark:text-green-400">$&</span>')
      .replace(/\b(function|const|let|var|return|if|else|for|while|class|interface|type|export|import)\b/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="text-orange-600 dark:text-orange-400">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="text-orange-600 dark:text-orange-400">\'$1\'</span>');
    setHtml(highlighted);
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="my-6">
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code dangerouslySetInnerHTML={{ __html: html || code }} />
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
