"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Hash, CheckCircle2, XCircle, Play } from "lucide-react";

export function PoRADiagram() {
  const [currentPhase, setCurrentPhase] = useState<"idle" | "computing" | "loading" | "hashing" | "success">("idle");
  const [showComparison, setShowComparison] = useState(false);

  const handleStart = () => {
    setCurrentPhase("computing");
    setTimeout(() => setCurrentPhase("loading"), 1500);
    setTimeout(() => setCurrentPhase("hashing"), 3000);
    setTimeout(() => setCurrentPhase("success"), 4500);
  };

  const handleReset = () => {
    setCurrentPhase("idle");
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">PoRA（随机访问证明）机制</h3>
        <p className="text-muted-foreground">
          了解矿工如何证明他们真的存储了数据
        </p>
      </div>

      {/* PoRA 流程可视化 */}
      <Card>
        <CardHeader>
          <CardTitle>PoRA 挖矿流程</CardTitle>
          <CardDescription>点击"开始演示"查看完整流程</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 阶段 1: 计算阶段 */}
          <div className="relative">
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                currentPhase === "computing" || currentPhase === "loading" || currentPhase === "hashing" || currentPhase === "success"
                  ? "border-primary bg-primary/10"
                  : "border-muted"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  1
                </div>
                <div className="font-semibold">计算阶段（Computing Stage）</div>
                {currentPhase !== "idle" && currentPhase !== "computing" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                )}
              </div>
              <div className="ml-11 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span>选择随机 nonce（32 字节）</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>从主链读取挖矿状态</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>计算随机召回位置（recall position）</span>
                </div>
                {currentPhase === "computing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground italic"
                  >
                    计算中...
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* 箭头 */}
          <div className="flex justify-center">
            <motion.div
              animate={{
                opacity: currentPhase === "loading" || currentPhase === "hashing" || currentPhase === "success" ? 1 : 0.3,
              }}
              className="text-2xl"
            >
              ↓
            </motion.div>
          </div>

          {/* 阶段 2: 加载阶段 */}
          <div className="relative">
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                currentPhase === "loading" || currentPhase === "hashing" || currentPhase === "success"
                  ? "border-primary bg-primary/10"
                  : "border-muted"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  2
                </div>
                <div className="font-semibold">加载阶段（Loading Stage）</div>
                {currentPhase !== "idle" && currentPhase !== "computing" && currentPhase !== "loading" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                )}
              </div>
              <div className="ml-11 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>从存储加载 256 KB 数据块（sealed data chunk）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>数据块与 scratchpad 进行 XOR 操作</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>分成 64 个 4 KB 块</span>
                </div>
                {currentPhase === "loading" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground italic"
                  >
                    从 SSD 加载中... (可达 7 GB/s)
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* 箭头 */}
          <div className="flex justify-center">
            <motion.div
              animate={{
                opacity: currentPhase === "hashing" || currentPhase === "success" ? 1 : 0.3,
              }}
              className="text-2xl"
            >
              ↓
            </motion.div>
          </div>

          {/* 阶段 3: 哈希计算 */}
          <div className="relative">
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                currentPhase === "hashing" || currentPhase === "success"
                  ? "border-primary bg-primary/10"
                  : "border-muted"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  3
                </div>
                <div className="font-semibold">哈希计算</div>
                {currentPhase === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                )}
              </div>
              <div className="ml-11 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span>对每个 4 KB 块计算 Blake2b 哈希</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>输入: (miner id, nonce, context digest, start position, mine length, data chunk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>检查哈希是否满足目标难度（足够的前导零）</span>
                </div>
                {currentPhase === "hashing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground italic"
                  >
                    计算哈希中...
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* 成功/失败 */}
          {currentPhase === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border-2 border-green-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-semibold">找到有效 PoRA 解决方案！</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                提交 4 KB 数据块和证明到 0G Storage 合约，获得挖矿奖励
              </div>
            </motion.div>
          )}

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-4">
            <Button onClick={handleStart} disabled={currentPhase !== "idle"}>
              <Play className="h-4 w-4 mr-2" />
              开始演示
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 对比：存储 vs 外包 */}
      <Card>
        <CardHeader>
          <CardTitle>防止存储外包：数据密封机制</CardTitle>
          <CardDescription>为什么矿工倾向于真正存储数据而不是外包？</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                存储数据（推荐）
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 一次性成本：购买磁盘 + 同步数据</li>
                <li>• 挖矿时：直接读取（7 GB/s）</li>
                <li>• 成本：低（一次性）</li>
                <li>• 效率：高</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                外包存储（不推荐）
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 每次挖矿都需要查询外部数据</li>
                <li>• 挖矿时：必须密封数据（重任务）</li>
                <li>• 成本：高（每次挖矿）</li>
                <li>• 效率：低（密封是瓶颈）</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
            <strong>结论：</strong>只要密封成本超过存储成本，矿工就会倾向于真正存储数据。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
