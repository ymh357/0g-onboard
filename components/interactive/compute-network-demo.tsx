"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Cpu, Shield, Zap, CheckCircle2 } from "lucide-react";

interface ComputeTask {
  id: string;
  type: "inference" | "finetuning";
  model: string;
  status: "pending" | "running" | "completed";
  tee: boolean;
  cost: number;
}

export function ComputeNetworkDemo() {
  const [taskType, setTaskType] = useState<"inference" | "finetuning">("inference");
  const [selectedModel, setSelectedModel] = useState("llama-3");
  const [tasks, setTasks] = useState<ComputeTask[]>([]);

  const models = {
    inference: [
      { value: "llama-3", label: "Llama 3 (7B)", cost: 0.1 },
      { value: "gpt-neo", label: "GPT-Neo (2.7B)", cost: 0.05 },
      { value: "stable-diffusion", label: "Stable Diffusion", cost: 0.15 },
    ],
    finetuning: [
      { value: "llama-3-ft", label: "Llama 3 Fine-tuning", cost: 1.5 },
      { value: "bert-ft", label: "BERT Fine-tuning", cost: 0.8 },
    ],
  };

  const submitTask = () => {
    const modelInfo = models[taskType].find((m) => m.value === selectedModel);
    if (!modelInfo) return;

    const newTask: ComputeTask = {
      id: `task-${Date.now()}`,
      type: taskType,
      model: modelInfo.label,
      status: "pending",
      tee: Math.random() > 0.5,
      cost: modelInfo.cost,
    };

    setTasks([newTask, ...tasks]);

    // Simulate task execution
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? { ...t, status: "running" } : t))
      );
    }, 1000);

    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? { ...t, status: "completed" } : t))
      );
    }, 4000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>0G Compute Network 演示</CardTitle>
        <CardDescription>
          体验去中心化 AI 推理和微调服务
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task submission */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">任务类型</label>
            <Select value={taskType} onValueChange={(v) => {
              const newType = v as "inference" | "finetuning";
              setTaskType(newType);
              setSelectedModel(models[newType][0].value);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inference">推理 (Inference)</SelectItem>
                <SelectItem value="finetuning">微调 (Fine-tuning)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">选择模型</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models[taskType].map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label} - ${model.cost}/次
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={submitTask} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            提交计算任务
          </Button>
        </div>

        {/* Task list */}
        {tasks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">任务队列</h4>
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="p-4 bg-background border rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">{task.model}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {task.type === "inference" ? "推理" : "微调"}
                      </Badge>
                      {task.tee && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          TEE 验证
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={
                      task.status === "completed"
                        ? "default"
                        : task.status === "running"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {task.status === "pending" && "等待中"}
                    {task.status === "running" && "执行中"}
                    {task.status === "completed" && "已完成"}
                  </Badge>
                </div>

                {task.status === "completed" && (
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    消耗: ${task.cost.toFixed(2)} | 验证: ✓ 通过
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Network features */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
          <h4 className="font-semibold text-sm">网络特性</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">TEE 可信执行</span>
              </div>
              <p className="text-xs text-muted-foreground">
                使用 Intel SGX/AMD SEV 保证计算正确性
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">灵活 Provider</span>
              </div>
              <p className="text-xs text-muted-foreground">
                任何人都可以运营 AI Provider
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">Serving Broker</span>
              </div>
              <p className="text-xs text-muted-foreground">
                智能路由和负载均衡
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">链上验证</span>
              </div>
              <p className="text-xs text-muted-foreground">
                所有计算结果可验证
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
