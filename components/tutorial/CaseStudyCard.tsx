"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlipHorizontal } from "lucide-react";

interface CaseStudy {
  id: string;
  name: string;
  category: string;
  support: string;
  keywords: string[];
  summary: string;
  why_it_matters: string;
}

interface CaseStudyCardProps {
  study: CaseStudy;
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "CryptoHelpingAI":
        return "Crypto → AI";
      case "AIHelpingCrypto":
        return "AI → Crypto";
      case "Hybrid":
        return "混合";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CryptoHelpingAI":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "AIHelpingCrypto":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Hybrid":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="h-64 [perspective:1000px]">
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 正面 */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Card className="h-full cursor-pointer" onClick={() => setIsFlipped(true)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{study.name}</CardTitle>
                <FlipHorizontal className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className={getCategoryColor(study.category)}>
                  {getCategoryLabel(study.category)}
                </Badge>
                <Badge variant="outline">{study.support}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-4">
                {study.summary}
              </CardDescription>
              <div className="flex flex-wrap gap-1 mt-4">
                {study.keywords.slice(0, 3).map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {study.keywords.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{study.keywords.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 背面 */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <Card className="h-full cursor-pointer" onClick={() => setIsFlipped(false)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">为什么重要？</CardTitle>
                <FlipHorizontal className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {study.why_it_matters}
              </p>
              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-xs font-semibold mb-1">技术关键词</p>
                  <div className="flex flex-wrap gap-1">
                    {study.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
