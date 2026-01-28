import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Database } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-3 text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight">
            交互式教程平台
          </h1>
          <p className="text-pretty text-base text-muted-foreground">
            深入浅出的技术教程，配有交互式组件、动画和实际案例
          </p>
        </div>

        {/* 教程选择 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI x Crypto 教程 */}
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>AI × Crypto 教程</CardTitle>
                  <CardDescription>基于《AI x Crypto Primer》</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                学习如何判断 AI × Crypto 项目的价值，理解核心框架、大想法和实际机会。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/tutorial">
                  <Button>开始学习</Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>包含：</strong>交互式分类矩阵、案例研究、测验系统
              </div>
            </CardContent>
          </Card>

          {/* 0G 教程 */}
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500 text-white">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>0G 数据可用性教程</CardTitle>
                  <CardDescription>基于《ZeroGravity 白皮书》</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                深入理解 0G 如何实现无限可扩展的数据可用性系统，学习 PoRA 机制和分层存储设计。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/tutorial/0g">
                  <Button>开始学习</Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>包含：</strong>系统架构图、数据流动画、PoRA 可视化、激励机制计算器
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快速导航 */}
        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">快速导航</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-2">AI × Crypto 教程</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 核心框架：项目判别方法</li>
                <li>• 大想法：宏观叙事与趋势</li>
                <li>• 机会：给构建者的方向</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">0G 数据可用性教程</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 核心设计：无限可扩展架构</li>
                <li>• 存储系统：分层设计</li>
                <li>• 激励机制：PoRA 与挖矿</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
