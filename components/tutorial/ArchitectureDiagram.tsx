"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Network, Database, CheckCircle2 } from "lucide-react";

interface LayerInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function ArchitectureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [showMultiConsensus, setShowMultiConsensus] = useState(false);

  const layers: LayerInfo[] = [
    {
      id: "consensus",
      name: "0G 共识网络",
      description: "记录数据承诺和顺序，验证 PoRA 证明，分配奖励",
      icon: <Network className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      id: "storage",
      name: "0G 存储网络",
      description: "实际存储数据块，参与挖矿，服务用户查询",
      icon: <Database className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      id: "kv",
      name: "Key-Value 层",
      description: "管理可变数据，提供访问控制，支持结构化数据",
      icon: <Layers className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      id: "transaction",
      name: "事务处理层",
      description: "乐观并发控制，冲突检测，ACID 特性",
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "bg-orange-500",
    },
  ];

  const selectedLayerInfo = layers.find((l) => l.id === selectedLayer);

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">0G 系统架构</h3>
        <p className="text-muted-foreground">
          点击不同层级查看详细说明，切换视图查看多共识网络设计
        </p>
      </div>

      {/* 单共识网络视图 */}
      {!showMultiConsensus && (
        <div className="relative w-full max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="space-y-4">
              {/* 用户层 */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                  <span className="font-medium">用户 / Layer 2 / AI 平台</span>
                </div>
              </div>

              {/* 数据流箭头 */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-2xl"
                >
                  ↓
                </motion.div>
              </div>

              {/* 0G DA 层 */}
              <div className="border-2 border-dashed rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                <div className="text-center font-semibold mb-2">0G Data Availability (DA)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="cursor-pointer p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-blue-500 hover:border-blue-700 transition-colors"
                    onClick={() => setSelectedLayer("consensus")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">共识网络</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      记录承诺、验证证明、分配奖励
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border">
                    <div className="text-sm font-medium mb-1">数据可用性采样</div>
                    <p className="text-xs text-muted-foreground">
                      验证者独立采样，多数达成共识
                    </p>
                  </div>
                </div>
              </div>

              {/* 数据流箭头 */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="text-2xl"
                >
                  ↓
                </motion.div>
              </div>

              {/* 0G Storage 层 */}
              <div className="border-2 border-dashed rounded-lg p-4 bg-green-50 dark:bg-green-950">
                <div className="text-center font-semibold mb-2">0G Storage</div>
                <div className="space-y-3">
                  {/* 事务处理层 */}
                  <div
                    className="cursor-pointer p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-orange-500 hover:border-orange-700 transition-colors"
                    onClick={() => setSelectedLayer("transaction")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">事务处理层</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      并发控制、冲突检测、ACID
                    </p>
                  </div>

                  {/* Key-Value 层 */}
                  <div
                    className="cursor-pointer p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-purple-500 hover:border-purple-700 transition-colors"
                    onClick={() => setSelectedLayer("kv")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Key-Value 层</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      可变数据、访问控制、结构化
                    </p>
                  </div>

                  {/* Log 层 */}
                  <div
                    className="cursor-pointer p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-green-500 hover:border-green-700 transition-colors"
                    onClick={() => setSelectedLayer("storage")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Log 层（存储网络）</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      永久存储、追加写入、挖矿
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 多共识网络视图 */}
      {showMultiConsensus && (
        <div className="relative w-full max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="space-y-4">
              {/* 存储网络 */}
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="font-semibold mb-2">0G Storage Network（分区存储）</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-2 rounded bg-white dark:bg-gray-900 border text-sm">
                      分区 {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* 多个共识网络 */}
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border-2 rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                    <div className="font-semibold mb-2 text-center">0G Chain {i}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>代币:</span>
                        <Badge variant="outline">$0G{i}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>验证者:</span>
                        <span className="text-xs">V{i} (0x5124...1c34)</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          共享质押: T0 (ERC20)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 共享质押 */}
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                <div className="font-semibold mb-2">共享质押状态 (Ethereum)</div>
                <div className="text-sm text-muted-foreground">
                  所有共识网络共享相同的验证者集合和质押状态
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 切换按钮 */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowMultiConsensus(false)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            !showMultiConsensus
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-muted"
          }`}
        >
          单共识网络视图
        </button>
        <button
          onClick={() => setShowMultiConsensus(true)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            showMultiConsensus
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-muted"
          }`}
        >
          多共识网络视图
        </button>
      </div>

      {/* 选中层级详情 */}
      <AnimatePresence>
        {selectedLayerInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedLayerInfo.color} text-white`}>
                    {selectedLayerInfo.icon}
                  </div>
                  <div>
                    <CardTitle>{selectedLayerInfo.name}</CardTitle>
                    <CardDescription>{selectedLayerInfo.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => setSelectedLayer(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  关闭详情
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
