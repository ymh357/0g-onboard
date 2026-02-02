"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

export function QuorumVisualization() {
  const [quorumSize, setQuorumSize] = useState(4);
  const [dataPartitions, setDataPartitions] = useState(8);
  const [selectedNodes, setSelectedNodes] = useState<Set<number>>(new Set());

  const totalNodes = 16;
  const requiredQuorum = Math.ceil(quorumSize * 0.67); // 2/3 threshold

  const toggleNode = (nodeId: number) => {
    const newSelected = new Set(selectedNodes);
    if (newSelected.has(nodeId)) {
      newSelected.delete(nodeId);
    } else {
      newSelected.add(nodeId);
    }
    setSelectedNodes(newSelected);
  };

  const isQuorumReached = selectedNodes.size >= requiredQuorum;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quorum 架构可视化</CardTitle>
        <CardDescription>
          理解 0G DA 的 Quorum 机制和数据分区
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Quorum 大小</Label>
              <span className="text-sm text-muted-foreground">{quorumSize} 个节点</span>
            </div>
            <Slider
              value={[quorumSize]}
              onValueChange={(v) => {
                setQuorumSize(v[0]);
                setSelectedNodes(new Set());
              }}
              min={2}
              max={8}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>数据分区数</Label>
              <span className="text-sm text-muted-foreground">{dataPartitions} 个分区</span>
            </div>
            <Slider
              value={[dataPartitions]}
              onValueChange={(v) => setDataPartitions(v[0])}
              min={4}
              max={16}
              step={4}
            />
          </div>
        </div>

        {/* Quorum status */}
        <div
          className={`p-4 rounded-lg border-2 ${
            isQuorumReached
              ? "bg-green-500/10 border-green-500"
              : "bg-yellow-500/10 border-yellow-500"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isQuorumReached ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="font-semibold">
              {isQuorumReached ? "Quorum 已达成" : "Quorum 未达成"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            已选择 <strong>{selectedNodes.size}</strong> / {requiredQuorum} 个节点
            （需要 2/3+ 确认）
          </p>
        </div>

        {/* Node grid */}
        <div>
          <Label className="mb-3 block">点击节点参与 Quorum 签名</Label>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: quorumSize }).map((_, i) => {
              const nodeId = i + 1;
              const isSelected = selectedNodes.has(nodeId);

              return (
                <button
                  key={nodeId}
                  onClick={() => toggleNode(nodeId)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary scale-105"
                      : "bg-muted hover:bg-muted/70 border-muted"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">节点 {nodeId}</div>
                  <div className="text-xs opacity-70">
                    {isSelected ? "✓ 已签名" : "未签名"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data partitions visualization */}
        <div className="space-y-3">
          <Label>数据分区分布</Label>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: dataPartitions }).map((_, i) => (
              <div
                key={i}
                className="p-3 bg-muted rounded text-center"
              >
                <div className="text-xs font-mono">分区 {i + 1}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.floor(Math.random() * 100)}KB
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key features */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Quorum 核心特性</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• <strong>2/3 阈值</strong>: 需要超过 2/3 的节点签名才能达成共识</li>
            <li>• <strong>BLS 聚合签名</strong>: 多个签名聚合为一个，节省空间</li>
            <li>• <strong>数据分区</strong>: 将大数据分割到多个 Quorum 并行处理</li>
            <li>• <strong>灵活配置</strong>: Quorum 大小可以根据需求动态调整</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
