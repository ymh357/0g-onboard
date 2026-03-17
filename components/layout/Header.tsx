"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Header() {
  const navItems = [
    { href: "/tutorial", label: "AI × Crypto" },
    { href: "/tutorial/0g", label: "0G 基础" },
    { href: "/tutorial/0g-deep-dive", label: "0G 深度解析" },
    { href: "/tutorial/bridge", label: "跨链桥" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span className="font-bold">0G Onboard</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
