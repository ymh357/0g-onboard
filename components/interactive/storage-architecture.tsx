"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function StorageArchitecture() {
  const [selectedLayer, setSelectedLayer] = useState<"log" | "kv" | "transaction">("log");

  const layers = {
    log: {
      name: "Log 层",
      description: "不可变追加式日志存储，支持大文件和流式数据",
      features: [
        "Sector/Chunk 物理存储单元（256B Chunk）",
        "Merkle 树索引和验证",
        "Erasure Coding 数据冗余（Reed-Solomon）",
        "PoRA 激励矿工存储",
      ],
      useCase: "AI 训练数据集、视频流、区块链历史数据",
    },
    kv: {
      name: "KV 层",
      description: "键值存储，支持快速查询和更新",
      features: [
        "基于 Log 层构建索引",
        "流式更新和版本管理",
        "乐观并发控制（OCC）",
        "支持复杂查询操作",
      ],
      useCase: "智能合约状态、用户配置、应用数据库",
    },
    transaction: {
      name: "Transaction 层",
      description: "事务性存储，支持 ACID 保证",
      features: [
        "基于 KV 层实现",
        "MVCC 多版本控制",
        "乐观锁机制",
        "原子性操作保证",
      ],
      useCase: "去中心化数据库、DeFi 应用、复杂业务逻辑",
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>0G Storage 三层架构</CardTitle>
        <CardDescription>
          从底层到应用层的完整存储架构设计
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedLayer} onValueChange={(v) => setSelectedLayer(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="log">Log 层</TabsTrigger>
            <TabsTrigger value="kv">KV 层</TabsTrigger>
            <TabsTrigger value="transaction">Transaction 层</TabsTrigger>
          </TabsList>

          {(["log", "kv", "transaction"] as const).map((layer) => (
            <TabsContent key={layer} value={layer} className="space-y-4 mt-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold mb-2">{layers[layer].name}</h3>
                <p className="text-sm text-muted-foreground">
                  {layers[layer].description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">核心特性</h4>
                <div className="space-y-2">
                  {layers[layer].features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-muted/50 rounded"
                    >
                      <Badge variant="outline" className="mt-0.5">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">典型应用场景</h4>
                <p className="text-sm text-muted-foreground">
                  {layers[layer].useCase}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Architecture diagram */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg font-mono text-xs">
          <pre className="text-center">
{`┌─────────────────────────────────────────┐
│        Transaction 层 (ACID)            │
│    • MVCC 多版本控制                     │
│    • 原子性事务                          │
└─────────────────────────────────────────┘
                  ↓ 基于
┌─────────────────────────────────────────┐
│           KV 层 (索引)                  │
│    • 快速查询                            │
│    • 乐观并发控制                        │
└─────────────────────────────────────────┘
                  ↓ 基于
┌─────────────────────────────────────────┐
│      Log 层 (不可变存储)                │
│    • Merkle 树验证                      │
│    • Erasure Coding                     │
│    • PoRA 激励                          │
└─────────────────────────────────────────┘`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
