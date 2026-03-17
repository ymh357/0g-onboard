import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");

export interface Chapter {
  id: string;
  title: string;
  path: string;
  file: string;
}

export interface ChapterContent {
  id: string;
  title: string;
  content: string;
  html: string;
}

// 加载所有章节元数据（AI x Crypto 教程）
export async function getAllChapters(): Promise<Chapter[]> {
  const chaptersPath = path.join(contentDirectory, "data", "chapters.json");
  const fileContents = fs.readFileSync(chaptersPath, "utf8");
  return JSON.parse(fileContents) as Chapter[];
}

// 加载 0G 教程章节
export async function getAll0GChapters(): Promise<Chapter[]> {
  const chaptersPath = path.join(contentDirectory, "data", "0g-chapters.json");
  const fileContents = fs.readFileSync(chaptersPath, "utf8");
  return JSON.parse(fileContents) as Chapter[];
}

// 加载 0G 深度解析教程章节
export async function getAll0GDeepDiveChapters(): Promise<Chapter[]> {
  const chaptersPath = path.join(contentDirectory, "data", "0g-deep-dive-chapters.json");
  const fileContents = fs.readFileSync(chaptersPath, "utf8");
  return JSON.parse(fileContents) as Chapter[];
}

// 加载 Bridge 跨链桥教程章节
export async function getAllBridgeChapters(): Promise<Chapter[]> {
  const chaptersPath = path.join(contentDirectory, "data", "bridge-chapters.json");
  const fileContents = fs.readFileSync(chaptersPath, "utf8");
  return JSON.parse(fileContents) as Chapter[];
}

// 加载单个章节内容（支持四种教程）
export async function getChapterById(
  id: string,
  tutorialType: 'ai-crypto' | '0g' | '0g-deep-dive' | 'bridge' = 'ai-crypto'
): Promise<ChapterContent | null> {
  let chapters: Chapter[];

  switch (tutorialType) {
    case '0g-deep-dive':
      chapters = await getAll0GDeepDiveChapters();
      break;
    case '0g':
      chapters = await getAll0GChapters();
      break;
    case 'bridge':
      chapters = await getAllBridgeChapters();
      break;
    default:
      chapters = await getAllChapters();
  }

  const chapter = chapters.find((c) => c.id === id);

  if (!chapter) {
    return null;
  }

  const fullPath = path.join(process.cwd(), chapter.file);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(fileContents);

  // 处理 Markdown 为 HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  const html = processedContent.toString();

  return {
    id: chapter.id,
    title: data.title || chapter.title,
    content,
    html,
  };
}

// 获取章节导航（上一章/下一章）
export async function getChapterNavigation(
  currentId: string,
  tutorialType: 'ai-crypto' | '0g' | '0g-deep-dive' | 'bridge' = 'ai-crypto'
): Promise<{ prev: Chapter | null; next: Chapter | null }> {
  let chapters: Chapter[];

  switch (tutorialType) {
    case '0g-deep-dive':
      chapters = await getAll0GDeepDiveChapters();
      break;
    case '0g':
      chapters = await getAll0GChapters();
      break;
    case 'bridge':
      chapters = await getAllBridgeChapters();
      break;
    default:
      chapters = await getAllChapters();
  }

  const currentIndex = chapters.findIndex((c) => c.id === currentId);

  return {
    prev: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
  };
}
