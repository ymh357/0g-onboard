import Link from "next/link";
import { getAllBridgeChapters } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function BridgeTutorialIndexPage() {
  const chapters = await getAllBridgeChapters();

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">跨链桥技术专题</h1>
        <p className="text-lg text-muted-foreground">
          从 Chainlink CCIP 到 Wormhole 深度解析，全面掌握跨链桥的设计模式、安全挑战与 0G 生态集成。
        </p>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <Card key={chapter.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{chapter.title}</CardTitle>
                    <CardDescription className="mt-1">
                      第 {index + 1} 章
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={chapter.path}>
                <Button className="w-full" variant="outline">
                  开始学习
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5" />
          学习建议
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 1-3 章</strong>：夯实基础，理解跨链桥为什么存在、如何运作以及面临的致命安全挑战。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 4 章 (重点)</strong>：深入学习 0G 的官方标准 <strong>Chainlink CCIP</strong>，这是理解 0G 资产清算的核心。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 5-6 章</strong>：拆解 Wormhole 协议及其产品矩阵，它是 0G 生态扩展性的重要补丁。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 7-8 章</strong>：通过 Monad Bridge 和 Mayan Finance 案例，学习工业级的双引擎架构与拍卖结算机制。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 9-10 章</strong>：回归 0G，分析差距并制定你的 0G Bridge MVP 构建蓝图。
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
