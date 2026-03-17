import { getAllBridgeChapters } from "@/lib/content";
import { Sidebar } from "@/components/tutorial/Sidebar";

export default async function BridgeChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getAllBridgeChapters();

  return (
    <>
      <Sidebar chapters={chapters} isBridge={true} />
      <main className="flex-1">{children}</main>
    </>
  );
}
