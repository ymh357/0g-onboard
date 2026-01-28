"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "数据上传",
    description: "用户上传数据块到 0G DA",
    icon: "📤",
  },
  {
    id: 2,
    title: "擦除编码",
    description: "数据被擦除编码，分割成多个连续的数据块（chunks）",
    icon: "🔀",
  },
  {
    id: 3,
    title: "提交承诺",
    description: "编码数据的 Merkle root 作为承诺提交到共识层，记录数据顺序",
    icon: "📝",
  },
  {
    id: 4,
    title: "分散存储",
    description: "数据块分散到 0G Storage 网络的不同存储节点",
    icon: "📦",
  },
  {
  id: 5,
    title: "数据复制",
    description: "根据用户支付的存储费用，数据可能进一步复制到其他节点",
    icon: "🔄",
  },
  {
    id: 6,
    title: "挖矿证明",
    description: "存储节点定期参与挖矿，提交 PoRA 证明，获得奖励",
    icon: "⛏️",
  },
];

export function DataFlowAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  const handlePlay = () => {
    if (isPlaying) {
      // 暂停
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
      setIsPlaying(false);
    } else {
      // 播放
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
      setAutoPlayInterval(interval);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">数据流：从上传到存储</h3>
        <p className="text-muted-foreground">
          了解数据如何在 0G 系统中流动和处理
        </p>
      </div>

      {/* 进度指示 */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div
                className={`flex-1 h-1 ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index <= currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? "✓" : step.id}
              </div>
              <div
                className={`flex-1 h-1 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
            <div className="mt-2 text-xs text-center max-w-[100px]">
              {step.title}
            </div>
          </div>
        ))}
      </div>

      {/* 当前步骤详情 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{steps[currentStep].icon}</span>
                <div>
                  <CardTitle>
                    步骤 {steps[currentStep].id}: {steps[currentStep].title}
                  </CardTitle>
                  <CardDescription>{steps[currentStep].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentStep === 1 && (
                  <div className="text-sm text-muted-foreground">
                    <p>• 擦除编码将数据分割成多个块，即使部分块丢失也能恢复</p>
                    <p>• 0G 提供 GPU 加速的擦除编码，显著提高处理速度</p>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="text-sm text-muted-foreground">
                    <p>• Merkle root 是数据的密码学承诺，用于验证数据完整性</p>
                    <p>• 共识层只记录小数据（承诺），不存储大数据（实际数据）</p>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="text-sm text-muted-foreground">
                    <p>• 数据块分散到不同存储节点，提高可用性和容错性</p>
                    <p>• 存储节点可以选择存储哪些数据</p>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="text-sm text-muted-foreground">
                    <p>• 用户支付更高的存储费用可以获得更多副本</p>
                    <p>• 更多副本 = 更高的数据可用性和可靠性</p>
                  </div>
                )}
                {currentStep === 5 && (
                  <div className="text-sm text-muted-foreground">
                    <p>• 存储节点通过 PoRA（随机访问证明）证明数据存储</p>
                    <p>• 获得基础奖励和存储奖励</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
          上一步
        </Button>
        <Button variant="outline" size="sm" onClick={handlePlay}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentStep === steps.length - 1}>
          下一步
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* 步骤指示 */}
      <div className="text-center text-sm text-muted-foreground">
        步骤 {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
}
