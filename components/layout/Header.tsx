import Link from "next/link";
import { BookOpen, Database } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span className="font-bold">交互式教程</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/tutorial"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            AI × Crypto
          </Link>
          <Link
            href="/tutorial/0g"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            0G 数据可用性
          </Link>
        </nav>
      </div>
    </header>
  );
}
