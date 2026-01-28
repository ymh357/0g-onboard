"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Layers, CheckCircle2, ArrowDown } from "lucide-react";

interface Layer {
  id: string;
  name: string;
  description: string;
  features: string[];
  useCases: string[];
  icon: React.ReactNode;
  color: string;
}

const storageLayers: Layer[] = [
  {
    id: "log",
    name: "Log 层（基础层）",
    description: "永久存储、追加写入、归档系统",
    features: [
      "追加写入（Append-Only）",
      "永久存储",
      "不可篡改",
      "基于挖矿的激励机制",
    ],
    useCases: [
      "数据归档",
      "历史记录",
      "审计日志",
      "永久存储需求",
    ],
    icon: <Database className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    id: "kv",
    name: "Key-Value 层",
    description: "可变数据、访问控制、结构化数据管理",
    features: [
      "Put() / Get() API",
      "数据可变性",
      "访问控制（所有权）",
      "状态同步",
    ],
    useCases: [
      "去中心化社交网络",
      "文件系统",
      "配置管理",
      "需要更新的应用",
    ],
    icon: <Layers className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  {
    id: "transaction",
    name: "事务处理层",
    description: "并发控制、冲突检测、ACID 特性",
    features: [
      "乐观并发控制",
      "冲突检测",
      "ACID 特性",
      "事务提交/中止",
    ],
    useCases: [
      "协作编辑（Google Docs）",
      "数据库工作负载",
      "需要事务的应用",
      "并发更新场景",
    ],
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: "bg-orange-500",
  },
];

export function StorageLayers() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  const selectedLayerInfo = storageLayers.find((l) => l.id === selectedLayer);

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">0G Storage 分层架构</h3>
        <p className="text-muted-foreground">
          点击不同层级查看详细说明，了解每层的功能和应用场景
        </p>
      </div>

      {/* 分层可视化 */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="space-y-4">
          {/* 事务处理层 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer transition-all ${
              selectedLayer === "transaction" ? "ring-2 ring-orange-500" : ""
            }`}
            onClick={() => setSelectedLayer(selectedLayer === "transaction" ? null : "transaction")}
            onMouseEnter={() => setHoveredLayer("transaction")}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <Card className="border-2 border-orange-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500 text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>事务处理层</CardTitle>
                    <CardDescription>ACID、并发控制、协作编辑</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Key-Value 层 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer transition-all ${
              selectedLayer === "kv" ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => setSelectedLayer(selectedLayer === "kv" ? null : "kv")}
            onMouseEnter={() => setHoveredLayer("kv")}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <Card className="border-2 border-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500 text-white">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Key-Value 层</CardTitle>
                    <CardDescription>
                      可变数据、访问控制、去中心化社交网络
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Log 层 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer transition-all ${
              selectedLayer === "log" ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() => setSelectedLayer(selectedLayer === "log" ? null : "log")}
            onMouseEnter={() => setHoveredLayer("log")}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <Card className="border-2 border-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500 text-white">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Log 层（基础层）</CardTitle>
                    <CardDescription>
                      永久存储、追加写入、归档系统
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
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
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold mb-2">核心特性：</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLayerInfo.features.map((feature, i) => (
                      <Badge key={i} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">应用场景：</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedLayerInfo.useCases.map((useCase, i) => (
                      <li key={i}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 数据流说明 */}
      <Card>
        <CardHeader>
          <CardTitle>数据如何在层级间流动？</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong>Log 层</strong>：所有数据首先写入 Log 层，形成永久记录
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong>Key-Value 层</strong>：通过"播放"Log 条目构建 Key-Value 状态，支持更新操作
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong>事务处理层</strong>：基于 Key-Value 层，提供事务语义和并发控制
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
              <strong>关键点：</strong>所有更新最终都写入 Log 层，保证数据的永久性和可追溯性。
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
