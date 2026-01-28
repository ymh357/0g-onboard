import Link from "next/link";
import { getAllChapters } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function TutorialIndexPage() {
  const chapters = await getAllChapters();

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">教程目录</h1>
        <p className="text-lg text-muted-foreground">
          基于《AI x Crypto Primer》构建的交互式教程，帮助你深入理解 AI 与加密/区块链的交叉领域。
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
              <strong>第 1 章</strong>：了解教程目标和学习路线
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 2 章</strong>：重点学习核心框架，这是判断项目价值的关键工具
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 3 章</strong>：理解宏观叙事和趋势驱动力
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              <strong>第 4-5 章</strong>：探索具体机会和补充基础知识
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
