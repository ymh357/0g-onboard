import { getAll0GChapters } from "@/lib/content";
import { Sidebar } from "@/components/tutorial/Sidebar";

export default async function ZeroGChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getAll0GChapters();

  return (
    <>
      <Sidebar chapters={chapters} is0G={true} />
      <main className="flex-1">{children}</main>
    </>
  );
}
