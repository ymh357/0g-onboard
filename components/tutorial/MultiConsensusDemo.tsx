"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, ArrowRight, ArrowDown, Coins } from "lucide-react";

export function MultiConsensusDemo() {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [showFlow, setShowFlow] = useState(false);

  const chains = [
    { id: 0, name: "0G Chain 0", token: "$0G0", validator: "V0", isMain: true },
    { id: 1, name: "0G Chain 1", token: "$0G1", validator: "V'0" },
    { id: 2, name: "0G Chain 2", token: "$0G2", validator: "V''0" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">多共识网络与共享质押</h3>
        <p className="text-muted-foreground">
          了解 0G 如何通过多共识网络实现无限扩展，同时保持高安全性
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>共享质押机制</CardTitle>
          <CardDescription>
            所有共识网络共享相同的验证者集合和质押状态
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 存储网络 */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border-2 border-green-500">
            <div className="font-semibold mb-2 text-center">0G Storage Network（分区存储）</div>
            <div className="grid grid-cols-3 gap-2">
              {["分区 A", "分区 B", "分区 C"].map((partition, i) => (
                <div key={i} className="p-2 rounded bg-white dark:bg-gray-900 border text-sm text-center">
                  {partition}
                </div>
              ))}
            </div>
          </div>

          {/* 箭头 */}
          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* 多个共识网络 */}
          <div className="grid md:grid-cols-3 gap-4">
            {chains.map((chain) => (
              <motion.div
                key={chain.id}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedChain === chain.id
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setSelectedChain(selectedChain === chain.id ? null : chain.id)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Network className="h-5 w-5" />
                  <div className="font-semibold">{chain.name}</div>
                  {chain.isMain && (
                    <Badge variant="secondary" className="text-xs">
                      主链
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">代币:</span>
                    <Badge variant="outline">{chain.token}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">验证者:</span>
                    <span className="text-xs font-mono">{chain.validator}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      共享质押: <strong>T0 (ERC20)</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 箭头 */}
          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* 共享质押状态 */}
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border-2 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="h-6 w-6 text-purple-500" />
              <div className="font-semibold">共享质押状态 (Ethereum / Chain 0)</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">质押代币:</span>
                <Badge>T0 (ERC20) 或 ETH/BTC (通过 EigenLayer/Babylon)</Badge>
              </div>
              <div className="text-muted-foreground">
                <p>• 所有共识网络使用相同的质押状态</p>
                <p>• 验证者在任何网络上的投票权 = 在 Chain 0 上的质押量</p>
                <p>• 所有网络共享相同级别的 POS 安全性</p>
              </div>
            </div>
          </div>

          {/* 代币映射流程 */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFlow(!showFlow)}
          >
            {showFlow ? "隐藏" : "显示"}代币映射流程
          </Button>

          {showFlow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 p-4 rounded-lg bg-muted"
            >
              <div className="text-sm font-semibold mb-2">代币映射流程（以 Chain 1 为例）:</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    1
                  </div>
                  <span>Chain 1 通过激励产生代币 $0G1</span>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  <span>通过安全跨链桥：在 Chain 1 上销毁 $0G1</span>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    3
                  </div>
                  <span>在 Chain 0 上铸造对应的 T0</span>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span>所有网络使用 T0 作为质押，共享安全性</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 优势说明 */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-500">
            <div className="text-sm font-semibold mb-2">无限扩展性的关键：</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 可以添加任意数量的共识网络（Chain 3, 4, 5...）</li>
              <li>• 每个网络独立处理数据，互不阻塞</li>
              <li>• 所有网络共享相同的安全级别（通过共享质押）</li>
              <li>• 存储网络可以分区，连接到不同的共识网络</li>
              <li>• 吞吐量 = 单网络吞吐量 × 网络数量（理论上无限）</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
