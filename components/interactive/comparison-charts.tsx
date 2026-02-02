"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComparisonMetric {
  name: string;
  zg: { value: string; score: number };
  competitors: { name: string; value: string; score: number }[];
}

export function ComparisonCharts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("storage");

  const comparisons = {
    storage: {
      title: "存储层对比",
      competitors: ["Filecoin", "Arweave"],
      metrics: [
        {
          name: "吞吐量",
          zg: { value: "50 GB/s", score: 10 },
          competitors: [
            { name: "Filecoin", value: "~1 GB/s", score: 3 },
            { name: "Arweave", value: "~100 MB/s", score: 2 },
          ],
        },
        {
          name: "存储成本",
          zg: { value: "$0.1/GB/月", score: 9 },
          competitors: [
            { name: "Filecoin", value: "$0.2/GB/月", score: 7 },
            { name: "Arweave", value: "$5/GB (一次)", score: 5 },
          ],
        },
        {
          name: "数据可用性",
          zg: { value: "PoRA + EC", score: 10 },
          competitors: [
            { name: "Filecoin", value: "PoRep + PoSt", score: 8 },
            { name: "Arweave", value: "PoA", score: 7 },
          ],
        },
        {
          name: "可编程性",
          zg: { value: "KV + Transaction", score: 10 },
          competitors: [
            { name: "Filecoin", value: "FVM 支持", score: 7 },
            { name: "Arweave", value: "SmartWeave", score: 6 },
          ],
        },
      ],
    },
    da: {
      title: "DA 层对比",
      competitors: ["Celestia", "EigenDA"],
      metrics: [
        {
          name: "吞吐量",
          zg: { value: "100 MB/s", score: 10 },
          competitors: [
            { name: "Celestia", value: "~10 MB/s", score: 6 },
            { name: "EigenDA", value: "~50 MB/s", score: 8 },
          ],
        },
        {
          name: "成本效率",
          zg: { value: "$0.01/MB", score: 9 },
          competitors: [
            { name: "Celestia", value: "$0.02/MB", score: 7 },
            { name: "EigenDA", value: "$0.015/MB", score: 8 },
          ],
        },
        {
          name: "验证机制",
          zg: { value: "DAS + BLS", score: 10 },
          competitors: [
            { name: "Celestia", value: "DAS", score: 8 },
            { name: "EigenDA", value: "KZG + DAS", score: 9 },
          ],
        },
        {
          name: "集成难度",
          zg: { value: "低 (模块化)", score: 9 },
          competitors: [
            { name: "Celestia", value: "中", score: 7 },
            { name: "EigenDA", value: "中", score: 7 },
          ],
        },
      ],
    },
    compute: {
      title: "计算层对比",
      competitors: ["Akash", "Render"],
      metrics: [
        {
          name: "AI 优化",
          zg: { value: "专为 AI 设计", score: 10 },
          competitors: [
            { name: "Akash", value: "通用计算", score: 6 },
            { name: "Render", value: "渲染专用", score: 7 },
          ],
        },
        {
          name: "可信执行",
          zg: { value: "TEE (SGX/SEV)", score: 10 },
          competitors: [
            { name: "Akash", value: "无 TEE", score: 3 },
            { name: "Render", value: "部分支持", score: 5 },
          ],
        },
        {
          name: "微调支持",
          zg: { value: "原生支持", score: 10 },
          competitors: [
            { name: "Akash", value: "手动部署", score: 5 },
            { name: "Render", value: "不支持", score: 2 },
          ],
        },
        {
          name: "模型市场",
          zg: { value: "集成市场", score: 9 },
          competitors: [
            { name: "Akash", value: "无", score: 3 },
            { name: "Render", value: "无", score: 3 },
          ],
        },
      ],
    },
    chain: {
      title: "L1 对比",
      competitors: ["Ethereum", "Solana"],
      metrics: [
        {
          name: "TPS",
          zg: { value: "11,000+", score: 9 },
          competitors: [
            { name: "Ethereum", value: "~30", score: 3 },
            { name: "Solana", value: "~65,000", score: 10 },
          ],
        },
        {
          name: "最终性",
          zg: { value: "1 区块 (~1s)", score: 10 },
          competitors: [
            { name: "Ethereum", value: "~15 分钟", score: 5 },
            { name: "Solana", value: "~13s", score: 7 },
          ],
        },
        {
          name: "AI 集成",
          zg: { value: "原生支持", score: 10 },
          competitors: [
            { name: "Ethereum", value: "需第三方", score: 4 },
            { name: "Solana", value: "需第三方", score: 4 },
          ],
        },
        {
          name: "存储成本",
          zg: { value: "链外存储", score: 10 },
          competitors: [
            { name: "Ethereum", value: "极高", score: 2 },
            { name: "Solana", value: "高", score: 4 },
          ],
        },
      ],
    },
  };

  const currentComparison = comparisons[selectedCategory as keyof typeof comparisons];

  const getScoreIcon = (zgScore: number, competitorScore: number) => {
    if (zgScore > competitorScore) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (zgScore < competitorScore) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>0G vs 竞品对比</CardTitle>
        <CardDescription>
          多维度对比分析 0G 与主流项目的差异
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="storage">存储层</TabsTrigger>
            <TabsTrigger value="da">DA 层</TabsTrigger>
            <TabsTrigger value="compute">计算层</TabsTrigger>
            <TabsTrigger value="chain">L1 链</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold">{currentComparison.title}</h3>
              <p className="text-sm text-muted-foreground">
                对比项目: {currentComparison.competitors.join(", ")}
              </p>
            </div>

            {/* Comparison metrics */}
            <div className="space-y-4">
              {currentComparison.metrics.map((metric, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                  <div className="font-semibold mb-3">{metric.name}</div>

                  {/* 0G row */}
                  <div className="flex items-center justify-between mb-2 p-3 bg-primary/10 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        0G
                      </Badge>
                      <span className="text-sm">{metric.zg.value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${metric.zg.score * 10}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {metric.zg.score}/10
                      </span>
                    </div>
                  </div>

                  {/* Competitor rows */}
                  {metric.competitors.map((comp, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between mb-2 p-3 bg-muted/50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {comp.name}
                        </Badge>
                        <span className="text-sm">{comp.value}</span>
                        {getScoreIcon(metric.zg.score, comp.score)}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-muted-foreground h-2 rounded-full transition-all"
                            style={{ width: `${comp.score * 10}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {comp.score}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">0G 核心优势</h4>
              <p className="text-xs text-muted-foreground">
                {selectedCategory === "storage" &&
                  "超高吞吐量、三层架构、PoRA 激励机制、完整可编程性"}
                {selectedCategory === "da" &&
                  "Quorum 架构、BLS 聚合签名、高吞吐低成本、与 Storage 无缝集成"}
                {selectedCategory === "compute" &&
                  "TEE 可信执行、AI 原生设计、微调支持、与 Storage 深度集成"}
                {selectedCategory === "chain" &&
                  "1 区块最终性、11K+ TPS、原生 AI 支持、模块化设计"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
