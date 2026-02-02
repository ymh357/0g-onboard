"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, RotateCcw } from "lucide-react";

export function PoRAMiningFlow() {
  const [minerPower, setMinerPower] = useState(100);
  const [storageSize, setStorageSize] = useState(1000);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [miningResult, setMiningResult] = useState<{
    challenge: string;
    scratchpad: string;
    hash: string;
    reward: number;
  } | null>(null);

  const steps = [
    { step: 1, name: "VRF 计算", desc: "使用私钥计算随机数" },
    { step: 2, name: "挑战生成", desc: "基于 VRF 生成挑战值" },
    { step: 3, name: "Scratchpad 访问", desc: "随机访问存储区域" },
    { step: 4, name: "Recall 证明", desc: "生成访问证明" },
    { step: 5, name: "Sealing", desc: "混合挑战和存储数据" },
    { step: 6, name: "提交证明", desc: "链上验证并获得奖励" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= steps.length) {
            // 到达最后一步后再多一步，显示全部完成
            const challenge = `0x${Math.random().toString(16).slice(2, 10)}`;
            const scratchpad = `Chunk ${Math.floor(Math.random() * storageSize)}`;
            const hash = `0x${Math.random().toString(16).slice(2, 18)}`;
            const reward = (minerPower * storageSize) / 10000;
            setMiningResult({ challenge, scratchpad, hash, reward });
            setIsAnimating(false);
            return steps.length; // 返回 steps.length 表示全部完成
          }
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnimating, currentStep, steps.length, minerPower, storageSize]);

  const simulateMining = () => {
    setCurrentStep(0);
    setIsAnimating(true);
    setMiningResult(null);
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setIsAnimating(false);
    setMiningResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PoRA 挖矿流程模拟</CardTitle>
        <CardDescription>
          体验 Proof of Random Access 的六步挖矿流程
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="power">矿工算力 (H/s)</Label>
            <Input
              id="power"
              type="number"
              value={minerPower}
              onChange={(e) => setMinerPower(Number(e.target.value))}
              min={1}
              max={1000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage">存储大小 (GB)</Label>
            <Input
              id="storage"
              type="number"
              value={storageSize}
              onChange={(e) => setStorageSize(Number(e.target.value))}
              min={100}
              max={8000}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={simulateMining}
            disabled={isAnimating}
            className="flex-1"
          >
            {isAnimating ? "挖矿中..." : "开始挖矿模拟"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isAnimating || currentStep === -1}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Mining steps visualization */}
        <div className="space-y-3">
          {steps.map((item, index) => {
            const isActive = index === currentStep && currentStep < steps.length;
            const isCompleted = index < currentStep || currentStep >= steps.length;
            const isPending = currentStep === -1 || (index > currentStep && currentStep < steps.length);

            return (
              <div
                key={item.step}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  isActive
                    ? "bg-primary/10 border-2 border-primary scale-105"
                    : isCompleted
                    ? "bg-green-500/10 border-2 border-green-500"
                    : "bg-muted/50 border-2 border-transparent"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : item.step}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${isActive ? "text-primary" : ""}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                {isActive && (
                  <div className="text-xs font-medium text-primary">
                    执行中...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mining result */}
        {miningResult && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
            <h4 className="font-semibold text-sm">挖矿结果</h4>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">挑战值: </span>
                <span className="text-primary">{miningResult.challenge}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Scratchpad: </span>
                <span>{miningResult.scratchpad}</span>
              </div>
              <div>
                <span className="text-muted-foreground">哈希: </span>
                <span className="break-all">{miningResult.hash}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-muted-foreground">预计奖励: </span>
                <span className="text-green-500 font-bold">
                  {miningResult.reward.toFixed(4)} A0GI
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Key constraints */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">关键约束</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• <strong>Scratchpad 限制</strong>: 最多 8TB，防止过度资本化</li>
            <li>• <strong>随机访问</strong>: VRF 保证挑战不可预测</li>
            <li>• <strong>Sealing 机制</strong>: 防止矿工只存储部分数据</li>
            <li>• <strong>链上验证</strong>: 所有证明都需要链上验证</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
