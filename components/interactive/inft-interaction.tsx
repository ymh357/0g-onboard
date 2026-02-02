"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Zap, Image as ImageIcon } from "lucide-react";

interface INFT {
  id: number;
  name: string;
  type: "avatar" | "companion" | "artwork";
  properties: {
    personality: string;
    mood: string;
    level: number;
  };
  capabilities: string[];
}

export function INFTInteraction() {
  const [selectedNFT, setSelectedNFT] = useState<INFT | null>(null);
  const [interactionLog, setInteractionLog] = useState<string[]>([]);

  const nfts: INFT[] = [
    {
      id: 1,
      name: "智能助手 Alice",
      type: "companion",
      properties: {
        personality: "友善、专业",
        mood: "愉快",
        level: 5,
      },
      capabilities: ["对话", "学习", "记忆", "情感反应"],
    },
    {
      id: 2,
      name: "创意画家 Bob",
      type: "artwork",
      properties: {
        personality: "艺术、创新",
        mood: "专注",
        level: 3,
      },
      capabilities: ["生成图像", "风格演化", "互动创作"],
    },
    {
      id: 3,
      name: "游戏角色 Charlie",
      type: "avatar",
      properties: {
        personality: "勇敢、冒险",
        mood: "兴奋",
        level: 7,
      },
      capabilities: ["战斗", "升级", "社交", "学习技能"],
    },
  ];

  const interact = (action: string) => {
    if (!selectedNFT) return;

    const responses = {
      talk: [
        `${selectedNFT.name}: "你好！我现在心情${selectedNFT.properties.mood}，有什么可以帮助你的吗？"`,
        `${selectedNFT.name} 的情绪状态更新为：平静`,
      ],
      learn: [
        `${selectedNFT.name} 正在学习新知识...`,
        `等级提升：Lv.${selectedNFT.properties.level} → Lv.${selectedNFT.properties.level + 1}`,
      ],
      evolve: [
        `${selectedNFT.name} 正在进化...`,
        `获得新能力：${["高级推理", "情感识别", "创意生成"][Math.floor(Math.random() * 3)]}`,
      ],
    };

    const newLogs = responses[action as keyof typeof responses] || ["互动成功！"];
    setInteractionLog([...newLogs, ...interactionLog]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>INFT (ERC-7857) 互动演示</CardTitle>
        <CardDescription>
          体验智能 NFT 的多模态交互和动态演化
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* NFT selection */}
        <div>
          <h4 className="font-semibold text-sm mb-3">选择你的 INFT</h4>
          <div className="grid grid-cols-3 gap-3">
            {nfts.map((nft) => (
              <button
                key={nft.id}
                onClick={() => setSelectedNFT(nft)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedNFT?.id === nft.id
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-muted bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {nft.type === "companion" && <MessageSquare className="h-4 w-4" />}
                  {nft.type === "artwork" && <ImageIcon className="h-4 w-4" />}
                  {nft.type === "avatar" && <Sparkles className="h-4 w-4" />}
                  <span className="font-semibold text-sm">{nft.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Lv.{nft.properties.level}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* NFT details and interactions */}
        {selectedNFT && (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3">NFT 属性</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">性格:</span>
                  <span className="ml-2 font-medium">
                    {selectedNFT.properties.personality}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">情绪:</span>
                  <span className="ml-2 font-medium">
                    {selectedNFT.properties.mood}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">等级:</span>
                  <span className="ml-2 font-medium">
                    Lv.{selectedNFT.properties.level}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">类型:</span>
                  <span className="ml-2 font-medium capitalize">
                    {selectedNFT.type}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">能力</h4>
              <div className="flex flex-wrap gap-2">
                {selectedNFT.capabilities.map((cap, i) => (
                  <Badge key={i} variant="secondary">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => interact("talk")} size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                对话
              </Button>
              <Button onClick={() => interact("learn")} size="sm" variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                学习
              </Button>
              <Button onClick={() => interact("evolve")} size="sm" variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                进化
              </Button>
            </div>
          </div>
        )}

        {/* Interaction log */}
        {interactionLog.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">互动记录</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {interactionLog.slice(0, 10).map((log, i) => (
                <div
                  key={i}
                  className="p-3 bg-muted/50 rounded text-sm"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERC-7857 features */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">ERC-7857 核心特性</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• <strong>多模态</strong>: 支持文本、图像、音频、3D 等多种模态</li>
            <li>• <strong>生成性</strong>: AI 模型驱动，可以生成新内容</li>
            <li>• <strong>互动性</strong>: 可与用户和其他 INFT 交互</li>
            <li>• <strong>动态属性</strong>: 链上状态会根据互动动态变化</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
