"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  chapterId: string;
  totalChapters: number;
  currentIndex: number;
}

export function ProgressBar({
  chapterId,
  totalChapters,
  currentIndex,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 从 localStorage 读取进度
    const savedProgress = localStorage.getItem(`progress-${chapterId}`);
    if (savedProgress) {
      setProgress(parseFloat(savedProgress));
    } else {
      // 计算当前章节进度（基于章节索引）
      const chapterProgress = ((currentIndex + 1) / totalChapters) * 100;
      setProgress(chapterProgress);
    }
  }, [chapterId, currentIndex, totalChapters]);

  // 保存阅读进度
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      const newProgress = Math.min(100, Math.max(progress, scrolled));
      setProgress(newProgress);
      localStorage.setItem(`progress-${chapterId}`, newProgress.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapterId, progress]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>学习进度</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
