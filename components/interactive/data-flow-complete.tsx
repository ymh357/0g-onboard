"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Cpu, Network, Zap } from "lucide-react";

export function DataFlowComplete() {
  const [selectedScenario, setSelectedScenario] = useState<string>("ai-training");

  const scenarios = {
    "ai-training": {
      name: "AI 训练数据集上传",
      steps: [
        {
          stage: "客户端",
          icon: <Cpu className="h-4 w-4" />,
          action: "准备 10GB 训练数据",
          detail: "数据预处理和分块",
        },
        {
          stage: "0G Storage Log",
          icon: <Database className="h-4 w-4" />,
          action: "Erasure Coding 编码",
          detail: "1.5x 冗余，生成 Merkle 树",
        },
        {
          stage: "矿工网络",
          icon: <Network className="h-4 w-4" />,
          action: "分布式存储",
          detail: "PoRA 激励确保数据可用性",
        },
        {
          stage: "0G Compute",
          icon: <Zap className="h-4 w-4" />,
          action: "训练任务调度",
          detail: "TEE 环境执行训练",
        },
      ],
      throughput: "50 MB/s",
      latency: "200ms",
      cost: "$0.1/GB/月",
    },
    "rollup-da": {
      name: "Rollup 使用 DA 层",
      steps: [
        {
          stage: "Rollup Sequencer",
          icon: <Cpu className="h-4 w-4" />,
          action: "打包交易批次",
          detail: "生成状态根和交易数据",
        },
        {
          stage: "0G DA Quorum",
          icon: <Network className="h-4 w-4" />,
          action: "数据分区提交",
          detail: "BLS 聚合签名验证",
        },
        {
          stage: "0G Storage",
          icon: <Database className="h-4 w-4" />,
          action: "长期归档",
          detail: "Log 层不可变存储",
        },
        {
          stage: "验证者",
          icon: <Zap className="h-4 w-4" />,
          action: "DAS 采样验证",
          detail: "确保数据可用性",
        },
      ],
      throughput: "100 MB/s",
      latency: "50ms",
      cost: "$0.01/MB",
    },
    "social-network": {
      name: "社交网络内容发布",
      steps: [
        {
          stage: "用户客户端",
          icon: <Cpu className="h-4 w-4" />,
          action: "发布帖子+图片",
          detail: "内容加密和签名",
        },
        {
          stage: "0G Storage KV",
          icon: <Database className="h-4 w-4" />,
          action: "索引构建",
          detail: "快速查询用户时间线",
        },
        {
          stage: "0G Storage Log",
          icon: <Database className="h-4 w-4" />,
          action: "不可变归档",
          detail: "永久存储历史记录",
        },
        {
          stage: "其他用户",
          icon: <Network className="h-4 w-4" />,
          action: "实时订阅",
          detail: "低延迟内容分发",
        },
      ],
      throughput: "10 MB/s",
      latency: "100ms",
      cost: "$0.05/GB/月",
    },
    "ai-agent": {
      name: "AI Agent 自主交易",
      steps: [
        {
          stage: "AI Agent",
          icon: <Zap className="h-4 w-4" />,
          action: "决策并发起交易",
          detail: "0G Compute 推理服务",
        },
        {
          stage: "0G Chain",
          icon: <Network className="h-4 w-4" />,
          action: "交易执行",
          detail: "CometBFT 共识确认",
        },
        {
          stage: "0G Storage",
          icon: <Database className="h-4 w-4" />,
          action: "决策日志存储",
          detail: "审计和回溯分析",
        },
        {
          stage: "INFT 更新",
          icon: <Cpu className="h-4 w-4" />,
          action: "链上状态演化",
          detail: "ERC-7857 动态属性更新",
        },
      ],
      throughput: "1000 TPS",
      latency: "1s (finality)",
      cost: "$0.001/tx",
    },
  };

  const currentScenario = scenarios[selectedScenario as keyof typeof scenarios];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>完整数据流分析</CardTitle>
        <CardDescription>
          探索不同场景下的端到端数据流动
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="ai-training">AI 训练</TabsTrigger>
            <TabsTrigger value="rollup-da">Rollup DA</TabsTrigger>
            <TabsTrigger value="social-network">社交网络</TabsTrigger>
            <TabsTrigger value="ai-agent">AI Agent</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedScenario} className="space-y-4 mt-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">{currentScenario.name}</h3>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">吞吐量: </span>
                  <Badge variant="outline">{currentScenario.throughput}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">延迟: </span>
                  <Badge variant="outline">{currentScenario.latency}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">成本: </span>
                  <Badge variant="outline">{currentScenario.cost}</Badge>
                </div>
              </div>
            </div>

            {/* Flow visualization */}
            <div className="space-y-3">
              {currentScenario.steps.map((step, index) => (
                <div key={index}>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            步骤 {index + 1}
                          </Badge>
                          <span className="font-semibold text-sm">{step.stage}</span>
                        </div>
                        <div className="text-sm mb-1">{step.action}</div>
                        <div className="text-xs text-muted-foreground">{step.detail}</div>
                      </div>
                    </div>
                  </div>

                  {index < currentScenario.steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Key insights */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">数据流关键点</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• <strong>模块化设计</strong>: Chain/Storage/DA/Compute 各司其职</li>
            <li>• <strong>灵活组合</strong>: 应用可以选择需要的模块组合</li>
            <li>• <strong>数据一致性</strong>: 跨层数据通过 Merkle 树验证</li>
            <li>• <strong>性能优化</strong>: 并行处理和分层缓存提升效率</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
