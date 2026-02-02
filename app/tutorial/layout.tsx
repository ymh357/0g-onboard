import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
