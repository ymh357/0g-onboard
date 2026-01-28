"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import caseStudiesData from "@/content/data/case-studies.json";

interface Project {
  id: string;
  name: string;
  category: "CryptoHelpingAI" | "AIHelpingCrypto" | "NotAIXCrypto" | "Hybrid";
  support: "Internal" | "External" | "Hybrid" | "N/A";
  keywords: string[];
  summary: string;
  why_it_matters: string;
}

const projects: Project[] = (caseStudiesData as Project[]).filter(
  (p) => p.category !== "NotAIXCrypto"
);

type Quadrant = "top-left" | "top-right" | "bottom-left" | "bottom-right" | null;

export function InteractiveMatrix() {
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const getQuadrantProjects = (quadrant: Quadrant): Project[] => {
    if (!quadrant) return [];
    
    const isCryptoHelpingAI = quadrant === "top-left" || quadrant === "bottom-left";
    const isInternal = quadrant === "top-left" || quadrant === "top-right";
    
    return projects.filter((p) => {
      if (p.category === "Hybrid") {
        // Hybrid 项目可能出现在多个象限，根据 support 判断
        if (p.support === "Hybrid") {
          // 可以根据具体项目逻辑调整
          return isInternal; // 简化处理：Hybrid 主要算内部
        }
        return false;
      }
      
      const categoryMatch = isCryptoHelpingAI 
        ? p.category === "CryptoHelpingAI"
        : p.category === "AIHelpingCrypto";
      
      const supportMatch = isInternal
        ? p.support === "Internal" || p.support === "Hybrid"
        : p.support === "External";
      
      return categoryMatch && supportMatch;
    });
  };

  const selectedProjects = selectedQuadrant ? getQuadrantProjects(selectedQuadrant) : [];

  const getQuadrantLabel = (quadrant: Quadrant): { title: string; description: string } => {
    switch (quadrant) {
      case "top-left":
        return {
          title: "Crypto → AI（内部支持）",
          description: "密码学技术嵌入 AI 技术栈，带来新能力",
        };
      case "top-right":
        return {
          title: "AI → Crypto（内部支持）",
          description: "AI 技术嵌入 Crypto 技术栈，带来新能力",
        };
      case "bottom-left":
        return {
          title: "Crypto → AI（外部支持）",
          description: "Crypto 在 AI 技术栈外部提供支持，提升效率",
        };
      case "bottom-right":
        return {
          title: "AI → Crypto（外部支持）",
          description: "AI 在 Crypto 技术栈外部提供支持，提升效率",
        };
      default:
        return { title: "", description: "" };
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">AI × Crypto 项目分类矩阵</h3>
        <p className="text-muted-foreground">
          点击象限查看该类别项目，悬停查看详情
        </p>
      </div>

      <div className="relative w-full aspect-square max-w-2xl mx-auto">
        {/* 坐标轴标签 */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">外部支持</span>
            <div className="w-16 h-0.5 bg-border" />
            <span className="text-muted-foreground">内部支持</span>
          </div>
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Crypto → AI</span>
            <div className="w-16 h-0.5 bg-border rotate-90" />
            <span className="text-muted-foreground">AI → Crypto</span>
          </div>
        </div>

        {/* 矩阵网格 */}
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* 背景网格 */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="2" className="text-border" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="2" className="text-border" />

          {/* 四个象限 */}
          {[
            { x: 0, y: 0, w: 200, h: 200, quadrant: "top-left" as Quadrant },
            { x: 200, y: 0, w: 200, h: 200, quadrant: "top-right" as Quadrant },
            { x: 0, y: 200, w: 200, h: 200, quadrant: "bottom-left" as Quadrant },
            { x: 200, y: 200, w: 200, h: 200, quadrant: "bottom-right" as Quadrant },
          ].map((q) => (
            <motion.rect
              key={q.quadrant}
              x={q.x}
              y={q.y}
              width={q.w}
              height={q.h}
              fill={selectedQuadrant === q.quadrant ? "hsl(var(--primary) / 0.1)" : "transparent"}
              stroke={selectedQuadrant === q.quadrant ? "hsl(var(--primary))" : "transparent"}
              strokeWidth="2"
              className="cursor-pointer"
              whileHover={{ fill: "hsl(var(--primary) / 0.05)" }}
              onClick={() => setSelectedQuadrant(selectedQuadrant === q.quadrant ? null : q.quadrant)}
            />
          ))}

          {/* 象限标签 */}
          <text x="100" y="100" textAnchor="middle" className="text-sm font-medium fill-foreground">
            Crypto → AI
          </text>
          <text x="100" y="120" textAnchor="middle" className="text-xs fill-muted-foreground">
            （内部）
          </text>
          <text x="300" y="100" textAnchor="middle" className="text-sm font-medium fill-foreground">
            AI → Crypto
          </text>
          <text x="300" y="120" textAnchor="middle" className="text-xs fill-muted-foreground">
            （内部）
          </text>
          <text x="100" y="300" textAnchor="middle" className="text-sm font-medium fill-foreground">
            Crypto → AI
          </text>
          <text x="100" y="320" textAnchor="middle" className="text-xs fill-muted-foreground">
            （外部）
          </text>
          <text x="300" y="300" textAnchor="middle" className="text-sm font-medium fill-foreground">
            AI → Crypto
          </text>
          <text x="300" y="320" textAnchor="middle" className="text-xs fill-muted-foreground">
            （外部）
          </text>

          {/* 项目点 */}
          {projects.map((project, index) => {
            const isCryptoHelpingAI = project.category === "CryptoHelpingAI";
            const isInternal = project.support === "Internal" || project.support === "Hybrid";
            const x = isCryptoHelpingAI ? 100 : 300;
            const y = isInternal ? 100 : 300;
            const offsetX = (index % 3 - 1) * 30;
            const offsetY = Math.floor(index / 3) * 30;

            return (
              <motion.circle
                key={project.id}
                cx={x + offsetX}
                cy={y + offsetY}
                r="6"
                fill="hsl(var(--primary))"
                className="cursor-pointer"
                whileHover={{ r: 8, fill: "hsl(var(--primary) / 0.8)" }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            );
          })}
        </svg>
      </div>

      {/* 悬停显示项目详情 */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {projects.find((p) => p.id === hoveredProject)?.name}
                </CardTitle>
                <CardDescription>
                  {projects.find((p) => p.id === hoveredProject)?.summary}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 选中象限的项目列表 */}
      <AnimatePresence>
        {selectedQuadrant && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{getQuadrantLabel(selectedQuadrant).title}</CardTitle>
                <CardDescription>{getQuadrantLabel(selectedQuadrant).description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedProjects.length > 0 ? (
                    selectedProjects.map((project) => (
                      <div key={project.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{project.name}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline">{project.category}</Badge>
                            <Badge variant="secondary">{project.support}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.summary}</p>
                        <p className="text-xs text-muted-foreground italic">
                          {project.why_it_matters}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.keywords.map((keyword) => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      该象限暂无项目示例（可在后续版本中添加更多项目）
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
