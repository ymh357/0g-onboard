import { notFound } from "next/navigation";
import { getChapterById, getChapterNavigation, getAll0GDeepDiveChapters } from "@/lib/content";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Interactive components for deep-dive chapters
import { CometBFTConsensusFlow } from "@/components/interactive/cometbft-consensus-flow";
import { StorageArchitecture } from "@/components/interactive/storage-architecture";
import { PoRAMiningFlow } from "@/components/interactive/pora-mining-flow";
import { QuorumVisualization } from "@/components/interactive/quorum-visualization";
import { ComputeNetworkDemo } from "@/components/interactive/compute-network-demo";
import { INFTInteraction } from "@/components/interactive/inft-interaction";
import { SharedStakingDiagram } from "@/components/interactive/shared-staking-diagram";
import { DataFlowComplete } from "@/components/interactive/data-flow-complete";
import { ComparisonCharts } from "@/components/interactive/comparison-charts";
import { PracticePlayground } from "@/components/interactive/practice-playground";

interface PageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  const chapters = await getAll0GDeepDiveChapters();
  return chapters.map((chapter) => ({
    chapter: chapter.id,
  }));
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter: chapterId } = await params;
  const chapterContent = await getChapterById(chapterId, '0g-deep-dive');

  if (!chapterContent) {
    notFound();
  }

  const navigation = await getChapterNavigation(chapterId, '0g-deep-dive');

  // Determine which interactive components to show based on chapter
  const showCometBFT = chapterId === "0g-deep-01-chain";
  const showStorage = chapterId === "0g-deep-02-storage";
  const showPoRA = chapterId === "0g-deep-03-pora";
  const showQuorum = chapterId === "0g-deep-04-da";
  const showCompute = chapterId === "0g-deep-05-compute";
  const showINFT = chapterId === "0g-deep-06-inft";
  const showSharedStaking = chapterId === "0g-deep-07-consensus";
  const showDataFlow = chapterId === "0g-deep-08-dataflow";
  const showComparison = chapterId === "0g-deep-09-comparison";
  const showPractice = chapterId === "0g-deep-10-practice";

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1>{chapterContent.title}</h1>

        {/* Interactive Components */}
        {showCometBFT && (
          <div className="my-8 not-prose">
            <CometBFTConsensusFlow />
          </div>
        )}

        {showStorage && (
          <div className="my-8 not-prose">
            <StorageArchitecture />
          </div>
        )}

        {showPoRA && (
          <div className="my-8 not-prose">
            <PoRAMiningFlow />
          </div>
        )}

        {showQuorum && (
          <div className="my-8 not-prose">
            <QuorumVisualization />
          </div>
        )}

        {showCompute && (
          <div className="my-8 not-prose">
            <ComputeNetworkDemo />
          </div>
        )}

        {showINFT && (
          <div className="my-8 not-prose">
            <INFTInteraction />
          </div>
        )}

        {showSharedStaking && (
          <div className="my-8 not-prose">
            <SharedStakingDiagram />
          </div>
        )}

        {showDataFlow && (
          <div className="my-8 not-prose">
            <DataFlowComplete />
          </div>
        )}

        {showComparison && (
          <div className="my-8 not-prose">
            <ComparisonCharts />
          </div>
        )}

        {showPractice && (
          <div className="my-8 not-prose">
            <PracticePlayground />
          </div>
        )}

        <div dangerouslySetInnerHTML={{ __html: chapterContent.html }} />
      </article>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        <div>
          {navigation.prev && (
            <Link href={`/tutorial/0g-deep-dive/${navigation.prev.id}`}>
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                上一章: {navigation.prev.title}
              </Button>
            </Link>
          )}
        </div>
        <div>
          {navigation.next && (
            <Link href={`/tutorial/0g-deep-dive/${navigation.next.id}`}>
              <Button variant="outline" className="gap-2">
                下一章: {navigation.next.title}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
