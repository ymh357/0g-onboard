import { notFound } from "next/navigation";
import Link from "next/link";
import { getChapterById, getChapterNavigation, getAllChapters } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/tutorial/ProgressBar";
import { InteractiveMatrix } from "@/components/tutorial/InteractiveMatrix";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface ChapterPageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  const chapters = await getAllChapters();
  return chapters.map((chapter) => ({
    chapter: chapter.id,
  }));
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapter: chapterId } = await params;
  const chapter = await getChapterById(chapterId);
  const navigation = await getChapterNavigation(chapterId);
  const allChapters = await getAllChapters();
  const currentIndex = allChapters.findIndex((c) => c.id === chapterId);

  if (!chapter) {
    notFound();
  }

  // 判断是否需要在特定位置嵌入交互组件
  const showInteractiveMatrix = chapterId === "02-core-frameworks";

  return (
    <div className="container mx-auto max-w-4xl px-6 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/tutorial">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回目录
          </Button>
        </Link>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <ProgressBar
          chapterId={chapterId}
          totalChapters={allChapters.length}
          currentIndex={currentIndex}
        />
      </div>

      {/* 章节内容 */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">{chapter.title}</h1>
        
        {/* 在核心框架章节中嵌入交互矩阵 */}
        {showInteractiveMatrix && (
          <div className="my-12">
            <InteractiveMatrix />
          </div>
        )}
        
        <div
          className="space-y-6"
          dangerouslySetInnerHTML={{ __html: chapter.html }}
        />
      </article>

      {/* 章节导航 */}
      <div className="mt-12 flex items-center justify-between border-t pt-8">
        <div>
          {navigation.prev ? (
            <Link href={navigation.prev.path}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一章: {navigation.prev.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
        <div>
          {navigation.next ? (
            <Link href={navigation.next.path}>
              <Button variant="outline" size="sm">
                下一章: {navigation.next.title}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
