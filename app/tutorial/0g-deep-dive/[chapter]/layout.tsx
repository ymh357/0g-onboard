import { getAll0GDeepDiveChapters } from "@/lib/content";
import { Sidebar } from "@/components/tutorial/Sidebar";

export default async function ZeroGDeepDiveChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getAll0GDeepDiveChapters();

  return (
    <>
      <Sidebar chapters={chapters} is0G={true} />
      <main className="flex-1">{children}</main>
    </>
  );
}
