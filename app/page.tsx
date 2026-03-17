import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Database, Microscope, Workflow } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-12">
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
          <Card className="transition-shadow hover:shadow-lg border-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white shadow-md">
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
                  <Button variant="default">开始学习</Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>包含：</strong>交互式分类矩阵、案例研究、测验系统
              </div>
            </CardContent>
          </Card>

          {/* 跨链桥专题教程 */}
          <Card className="transition-shadow hover:shadow-lg border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500 text-white shadow-md">
                  <Workflow className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>跨链桥专题</CardTitle>
                  <CardDescription>技术架构与 Wormhole 深度解析</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                从基础原理到 Wormhole 深度解析，掌握跨链桥的设计模式、安全挑战与 0G 生态集成。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/tutorial/bridge">
                  <Button variant="default" className="bg-orange-600 hover:bg-orange-700">开始学习</Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>包含：</strong>"锁烧换"模式、安全分析、Wormhole 架构、0G Bridge 现状
              </div>
            </CardContent>
          </Card>

          {/* 0G 基础教程 */}
          <Card className="transition-shadow hover:shadow-lg border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500 text-white shadow-md">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>0G 基础教程</CardTitle>
                  <CardDescription>入门 0G 生态系统</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                快速了解 0G 的核心概念和基本架构，学习 PoRA 机制和分层存储设计。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/tutorial/0g">
                  <Button variant="default">开始学习</Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>包含：</strong>系统架构图、数据流动画、PoRA 可视化、激励机制计算器
              </div>
            </CardContent>
          </Card>

          {/* 0G 深度解析教程 */}
          <Card className="transition-shadow hover:shadow-lg border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500 text-white shadow-md">
                  <Microscope className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>0G 深度解析</CardTitle>
                  <CardDescription>架构设计与技术原理</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                深入探索 0G 的技术原理和架构设计，从底层机制到实践应用的完整解析。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/tutorial/0g-deep-dive">
                  <Button variant="default">开始学习</Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>包含：</strong>共识流程、Quorum 可视化、INFT 交互、对比分析、实战代码
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快速导航 */}
        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-center">快速导航</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm font-medium mb-2 border-b pb-1">AI × Crypto 教程</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 核心框架：项目判别方法</li>
                <li>• 大想法：宏观叙事与趋势</li>
                <li>• 机会：给构建者的方向</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium mb-2 border-b pb-1">跨链桥专题</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 技术原理：三种模式分析</li>
                <li>• 安全案例：Ronin/Wormhole</li>
                <li>• 实战拆解：Monad Bridge</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium mb-2 border-b pb-1">0G 基础教程</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 核心设计：无限可扩展架构</li>
                <li>• 存储系统：分层设计</li>
                <li>• 激励机制：PoRA 与挖矿</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium mb-2 border-b pb-1">0G 深度解析</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 技术原理：共识、数据流</li>
                <li>• 分片：Chain/Storage/Compute</li>
                <li>• 实战：节点部署与监控</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
