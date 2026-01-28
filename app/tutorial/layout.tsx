import { getAllChapters } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/tutorial/Sidebar";

export default async function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getAllChapters();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar chapters={chapters} />
        <main className="flex-1 lg:pt-0 pt-14">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
