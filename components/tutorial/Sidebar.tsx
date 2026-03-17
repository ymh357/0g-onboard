"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@/lib/content";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId?: string;
  is0G?: boolean;
  isBridge?: boolean;
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function Sidebar({ chapters, currentChapterId, is0G = false, isBridge = false }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarTitle = is0G ? "0G 教程章节" : isBridge ? "跨链桥专题章节" : "章节导航";

  // 从 localStorage 读取用户偏好
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // 保存用户偏好
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState));
  };

  return (
    <>
      {/* 移动端浮动按钮 */}
      <Button
        variant="default"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        aria-label="打开章节目录"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* 移动端侧边栏覆盖层 */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 border-r bg-background shadow-2xl lg:hidden"
            >
              <div className="h-full overflow-y-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm font-bold">
                    {sidebarTitle}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileOpen(false)}
                    className="h-8 w-8 p-0"
                    aria-label="关闭菜单"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="space-y-2">
                  {chapters.map((chapter) => {
                    const isActive = pathname === chapter.path || chapter.id === currentChapterId;
                    return (
                      <Link
                        key={chapter.id}
                        href={chapter.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium shadow-sm"
                            : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="flex-shrink-0">
                          {isActive ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4 opacity-50" />
                          )}
                        </span>
                        <span className="leading-snug">{chapter.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 桌面端侧边栏 */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "4rem" : "16rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden border-r bg-muted/30 lg:block"
      >
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* 收起/展开按钮 */}
          <div className={cn(
            "flex items-center border-b p-3",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {sidebarTitle}
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="h-8 w-8 p-0 hover:bg-accent"
              title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
              aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 章节列表 */}
          <nav className={cn(
            "p-3 space-y-1.5",
            isCollapsed && "flex flex-col items-center"
          )}>
            {chapters.map((chapter) => {
              const isActive = pathname === chapter.path || chapter.id === currentChapterId;
              return (
                <Link
                  key={chapter.id}
                  href={chapter.path}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm transition-all",
                    isCollapsed ? "justify-center w-10 h-10" : "gap-3",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={isCollapsed ? chapter.title : undefined}
                >
                  <span className="flex-shrink-0">
                    {isActive ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4 opacity-50" />
                    )}
                  </span>
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden leading-snug"
                      >
                        {chapter.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
