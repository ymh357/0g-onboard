import { getAllChapters } from "@/lib/content";
import { Sidebar } from "@/components/tutorial/Sidebar";

export default async function AICryptoChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getAllChapters();

  return (
    <>
      <Sidebar chapters={chapters} />
      <main className="flex-1">{children}</main>
    </>
  );
}
