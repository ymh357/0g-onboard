"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ConsensusStep {
  phase: string;
  description: string;
  validators: number[];
  status: "idle" | "active" | "completed";
}

export function CometBFTConsensusFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: ConsensusStep[] = [
    {
      phase: "Propose",
      description: "提议者（Proposer）广播新区块提案",
      validators: [1, 2, 3, 4],
      status: "idle",
    },
    {
      phase: "Prevote",
      description: "验证者对提案进行预投票（Prevote）",
      validators: [1, 2, 3, 4],
      status: "idle",
    },
    {
      phase: "Precommit",
      description: "收到 2/3+ Prevote 后，验证者发送预提交（Precommit）",
      validators: [1, 2, 3],
      status: "idle",
    },
    {
      phase: "Commit",
      description: "收到 2/3+ Precommit 后，区块最终确认并提交",
      validators: [1, 2, 3, 4],
      status: "idle",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next > steps.length) {
            setIsPlaying(false);
            return steps.length; // 让 currentStep 到达 steps.length，表示全部完成
          }
          return next;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const handlePlay = () => {
    if (currentStep >= steps.length) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CometBFT 共识流程可视化</CardTitle>
        <CardDescription>
          观察 CometBFT 三阶段共识的完整过程（1 区块最终性）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handlePlay}
            disabled={isPlaying}
            size="sm"
            variant="outline"
          >
            <Play className="h-4 w-4 mr-2" />
            {currentStep >= steps.length ? "重新开始" : "播放"}
          </Button>
          <Button
            onClick={() => setIsPlaying(false)}
            disabled={!isPlaying}
            size="sm"
            variant="outline"
          >
            <Pause className="h-4 w-4 mr-2" />
            暂停
          </Button>
          <Button onClick={handleReset} size="sm" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>

        {/* Consensus visualization */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep && currentStep < steps.length;
            const isCompleted = index < currentStep || currentStep >= steps.length;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 scale-105"
                    : isCompleted
                    ? "border-green-500 bg-green-500/5"
                    : "border-muted"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">
                      阶段 {index + 1}: {step.phase}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? "进行中" : isCompleted ? "已完成" : "待执行"}
                  </div>
                </div>

                {/* Validators visualization */}
                <div className="flex gap-2 mt-3">
                  {[1, 2, 3, 4].map((v) => (
                    <div
                      key={v}
                      className={`flex-1 h-12 rounded flex items-center justify-center text-sm font-medium transition-all ${
                        isActive && step.validators.includes(v)
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : isCompleted && step.validators.includes(v)
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      验证者 {v}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">关键特性</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>1 区块最终性</strong>：区块一旦提交即不可逆</li>
            <li>• <strong>BFT 容错</strong>：容忍最多 1/3 的恶意节点</li>
            <li>• <strong>即时确认</strong>：不需要等待多个区块确认</li>
            <li>• <strong>三阶段共识</strong>：Propose → Prevote → Precommit → Commit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
