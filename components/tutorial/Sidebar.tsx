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
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function Sidebar({ chapters, currentChapterId, is0G = false }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      {/* 移动端菜单按钮 */}
      <div className="lg:hidden fixed top-14 left-0 right-0 z-40 border-b bg-background px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="gap-2"
        >
          <Menu className="h-4 w-4" />
          <span>{is0G ? "0G 教程目录" : "教程目录"}</span>
        </Button>
      </div>

      {/* 移动端侧边栏覆盖层 */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 border-r bg-background lg:hidden"
            >
              <div className="h-full overflow-y-auto p-4">
                <nav className="space-y-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {is0G ? "0G 教程章节" : "章节导航"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  {chapters.map((chapter) => {
                    const isActive = pathname === chapter.path || chapter.id === currentChapterId;
                    return (
                      <Link
                        key={chapter.id}
                        href={chapter.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="flex-shrink-0">
                          {isActive ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </span>
                        <span>{chapter.title}</span>
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
        className="hidden border-r bg-muted/40 lg:block"
      >
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* 收起/展开按钮 */}
          <div className="flex items-center justify-between border-b p-2">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {is0G ? "0G 教程章节" : "章节导航"}
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="h-8 w-8 p-0"
              title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 章节列表 */}
          <nav className="p-4 space-y-1">
            {chapters.map((chapter) => {
              const isActive = pathname === chapter.path || chapter.id === currentChapterId;
              return (
                <Link
                  key={chapter.id}
                  href={chapter.path}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={isCollapsed ? chapter.title : undefined}
                >
                  <span className="flex-shrink-0">
                    {isActive ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </span>
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate"
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
