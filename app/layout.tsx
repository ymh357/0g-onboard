import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI × Crypto 教程",
  description: "基于《AI x Crypto Primer》构建的交互式教程（Next.js App Router）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
