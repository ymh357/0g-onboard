import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { getAll0GDeepDiveChapters } from "@/lib/content";

export default async function ZeroGDeepDivePage() {
  const chapters = await getAll0GDeepDiveChapters();

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">0G 深度解析教程</h1>
        <p className="text-lg text-muted-foreground">
          深入探索 0G 的架构设计与技术原理，从底层机制到实践应用。
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
              <Link href={`/tutorial/0g-deep-dive/${chapter.id}`}>
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
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>第 1-2 章</strong>：理解 0G Chain 和 Storage 系统的核心架构
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>第 3-4 章</strong>：掌握 PoRA 和 DA 的工作机制
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>第 5-6 章</strong>：探索 Compute 和 INFT 的创新设计
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>第 7-8 章</strong>：了解多网络共识和完整数据流
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            <span>
              <strong>第 9-10 章</strong>：对比分析与实战项目
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
