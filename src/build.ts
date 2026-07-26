/**
 * 초경량 정적 블로그 빌더
 *
 * posts/<category>/**\/*.md + about.md + home.md → dist/
 *
 * 프론트매터는 선택사항:
 *  - title: 프론트매터 → 첫 `# 제목` → 파일명
 *  - date:  프론트매터 → git 최초 커밋일 → 파일 수정일
 *  - tags:  프론트매터 → [카테고리(폴더명)]
 *  - draft: 프론트매터 draft=true 또는 파일명이 `_`로 시작하면 제외
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import toml from "toml";
import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
// @ts-expect-error 타입 선언 없음
import texmath from "markdown-it-texmath";
import katex from "katex";
import { layoutPage, postListHtml, postPageHtml, tagIndexHtml, seriesBoxHtml, tocHtml } from "./template.ts";
import type { TocItem } from "./template.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "posts");
const DIST = path.join(ROOT, "dist");

export interface Post {
  srcPath: string; // 절대 경로
  relPath: string; // posts/ 기준 상대 경로 (java/gradle.md)
  url: string; // /posts/java/gradle/
  category: string;
  title: string;
  date: Date;
  tags: string[];
  body: string; // 프론트매터 제거된 마크다운
  series: string[]; // 이 글이 속한 시리즈 id들
  html?: string;
}

/* ---------- 프론트매터 (선택사항) ---------- */

function parseFrontmatter(src: string): { data: Record<string, unknown>; content: string } {
  try {
    if (src.startsWith("+++")) {
      const fm = matter(src, {
        language: "toml",
        delimiters: "+++",
        engines: { toml: (s: string) => toml.parse(s) },
      });
      return { data: fm.data, content: fm.content };
    }
    if (src.startsWith("---")) {
      const fm = matter(src);
      return { data: fm.data, content: fm.content };
    }
  } catch (e) {
    console.warn(`  ! 프론트매터 파싱 실패, 본문으로 처리: ${(e as Error).message}`);
  }
  return { data: {}, content: src };
}

const gitDateCache = new Map<string, Date | null>(); // --serve 재빌드 시 git 재호출 방지

function gitFirstCommitDate(absPath: string): Date | null {
  if (gitDateCache.has(absPath)) return gitDateCache.get(absPath)!;
  const date = gitFirstCommitDateUncached(absPath);
  gitDateCache.set(absPath, date);
  return date;
}

function gitFirstCommitDateUncached(absPath: string): Date | null {
  try {
    const out = execFileSync(
      "git",
      ["log", "--follow", "--diff-filter=A", "--format=%aI", "--", absPath],
      { cwd: ROOT, encoding: "utf8" },
    ).trim();
    const lines = out.split("\n").filter(Boolean);
    const first = lines[lines.length - 1];
    return first ? new Date(first) : null;
  } catch {
    return null;
  }
}

function toDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === "string") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

/* ---------- 글 수집 ---------- */

function walkMd(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(p));
    else if (entry.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const SERIES_RE = /\{\{<\s*series\s+title="([^"]*)"\s+series="([^"]*)"\s*>\}\}/g;

function loadPost(absPath: string): Post | null {
  const relPath = path.relative(POSTS_DIR, absPath);
  const fileName = path.basename(absPath, ".md");
  if (fileName.startsWith("_")) return null; // `_`로 시작하는 파일은 초안

  const raw = fs.readFileSync(absPath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  if (data.draft === true) return null;

  let body = content;

  // 제목: 프론트매터 → 첫 H1 → 파일명
  let title = typeof data.title === "string" ? data.title : "";
  if (!title) {
    const h1 = body.match(/^#\s+(.+)$/m);
    if (h1) {
      title = h1[1].trim();
      body = body.replace(h1[0], ""); // 템플릿에서 제목을 그리므로 본문에서 제거
    } else {
      title = fileName;
    }
  }

  const date = toDate(data.date) ?? gitFirstCommitDate(absPath) ?? fs.statSync(absPath).mtime;

  const category = relPath.includes(path.sep) ? relPath.split(path.sep)[0] : "etc";

  let tags: string[] = [];
  if (Array.isArray(data.tags)) tags = data.tags.map(String);
  else if (typeof data.tags === "string") tags = [data.tags];
  if (tags.length === 0) tags = [category.replace(/^_/, "")];

  // 글 하나가 같은 숏코드를 상/하단에 중복 포함하므로 시리즈 id는 중복 제거
  const series = [...new Set([...body.matchAll(SERIES_RE)].map((m) => m[2]))];

  const url = "/posts/" + relPath.replace(/\.md$/, "").split(path.sep).join("/") + "/";

  return { srcPath: absPath, relPath, url, category, title, date, tags, body, series };
}

/* ---------- 숏코드 → HTML ---------- */

function preprocess(body: string, post: Post, seriesMap: Map<string, Post[]>, md: MarkdownIt): string {
  // 코드펜스(```) 안은 건드리지 않도록 분리해서 처리
  return body
    .split(/(```[\s\S]*?```)/g)
    .map((seg, i) => {
      if (i % 2 === 1) {
        // 코드펜스: 언어 표기만 소문자화 (```C → ```c)
        return seg.replace(/^```([A-Za-z0-9_+-]+)/, (_m, lang: string) => "```" + lang.toLowerCase());
      }
      let out = seg;
      // 주석 처리된 숏코드 제거: {{</* ... */>}}
      out = out.replace(/\{\{<\/\*[\s\S]*?\*\/>\}\}/g, "");
      // 시리즈 박스
      out = out.replace(SERIES_RE, (_m, boxTitle: string, id: string) => {
        const members = seriesMap.get(id) ?? [];
        return "\n" + seriesBoxHtml(boxTitle, members, post.url) + "\n";
      });
      // 유튜브
      out = out.replace(
        /\{\{<\s*youtube\s+(\S+?)\s*>\}\}/g,
        (_m, id: string) =>
          `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" allowfullscreen loading="lazy" title="YouTube video"></iframe></div>`,
      );
      // 알림 박스
      out = out.replace(/\{\{<\s*alert\s*>\}\}/g, `<div class="callout">💡<div>`);
      out = out.replace(/\{\{<\s*\/alert\s*>\}\}/g, `</div></div>`);
      // 노션식 토글: `>! 제목` + 이어지는 `>` 줄들 → <details> 아코디언 (빈 줄이 나오면 종료)
      out = out.replace(/^>![ \t]*(.*)\r?\n((?:^>.*(?:\r?\n|$))*)/gm, (_m, title: string, quoted: string) => {
        const inner = quoted.replace(/^> ?/gm, "");
        return `<details class="toggle"><summary>${md.renderInline(title.trim())}</summary>\n\n${inner}\n</details>\n\n`;
      });
      // 공백 낀 인라인 수식 정규화: `$ x $` → `$x$` (안 하면 $ 짝이 밀려 본문이 수식으로 렌더링됨)
      out = out.replace(/\$ +([^$\n]+?) +\$/g, (_m, expr: string) => `$${"" + expr}$`);
      return out;
    })
    .join("");
}

/* ---------- 제목 앵커 id + 목차 ---------- */

function headingIds(md: MarkdownIt) {
  md.core.ruler.push("heading_ids", (state) => {
    const used = new Set<string>();
    for (let i = 0; i < state.tokens.length; i++) {
      const tok = state.tokens[i];
      if (tok.type !== "heading_open") continue;
      const text = (state.tokens[i + 1].children ?? [])
        .filter((t) => t.type === "text" || t.type === "code_inline")
        .map((t) => t.content)
        .join("");
      const base =
        text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-") || "section";
      let slug = base;
      for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
      used.add(slug);
      tok.attrSet("id", slug);
    }
  });
}

const TOC_RE = /<h([1-3]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

function extractToc(html: string): TocItem[] {
  // 접힌 <details> 안의 제목은 클릭해도 보이지 않으므로 목차에서 제외
  html = html.replace(/<details[\s\S]*?<\/details>/g, "");
  return [...html.matchAll(TOC_RE)].map((m) => ({
    level: Number(m[1]),
    id: m[2],
    text: m[3].replace(/<[^>]*>/g, "").trim(),
  }));
}

/* ---------- 메인 ---------- */

let buildVersion = String(Date.now()); // --serve 라이브 리로드용

async function main() {
  const md = MarkdownIt({ html: true, linkify: true });
  md.use(
    await Shiki({
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: "light",
      fallbackLanguage: "text",
    }),
  );
  md.use(texmath, { engine: katex, delimiters: "dollars" });
  md.use(headingIds);

  runBuild(md);

  if (process.argv.includes("--serve")) {
    serve();
    watchAndRebuild(md);
  }
}

function runBuild(md: MarkdownIt) {
  const t0 = Date.now();

  // 1) 글 수집
  const posts = walkMd(POSTS_DIR)
    .map(loadPost)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const seriesMap = new Map<string, Post[]>();
  for (const p of posts) {
    for (const id of p.series) {
      if (!seriesMap.has(id)) seriesMap.set(id, []);
      seriesMap.get(id)!.push(p);
    }
  }
  for (const members of seriesMap.values()) {
    members.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  const tagMap = new Map<string, Post[]>();
  for (const p of posts) {
    for (const t of p.tags) {
      const key = t.toLowerCase();
      if (!tagMap.has(key)) tagMap.set(key, []);
      tagMap.get(key)!.push(p);
    }
  }

  // 2) 렌더링
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const write = (urlPath: string, html: string) => {
    const dir = path.join(DIST, urlPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  };

  let usesMath = false;
  for (const p of posts) {
    const html = md.render(preprocess(p.body, p, seriesMap, md));
    p.html = html;
    const math = html.includes("katex");
    usesMath ||= math;
    write(p.url, layoutPage({ title: p.title, math, content: postPageHtml(p) + tocHtml(extractToc(html)) }));
  }

  // 홈 (선택: 루트 home.md를 소개문으로)
  const homeMdPath = path.join(ROOT, "home.md");
  const intro = fs.existsSync(homeMdPath) ? md.render(fs.readFileSync(homeMdPath, "utf8")) : "";
  fs.writeFileSync(
    path.join(DIST, "index.html"),
    layoutPage({ title: "elecbrandy", content: intro + postListHtml(posts.slice(0, 20)) }),
  );

  // About (선택: 루트 about.md)
  const aboutPath = path.join(ROOT, "about.md");
  if (fs.existsSync(aboutPath)) {
    const { content } = parseFrontmatter(fs.readFileSync(aboutPath, "utf8"));
    const aboutHtml = md.render(content);
    write(
      "/about",
      layoutPage({
        title: "about",
        content: `<article class="post"><h3 class="page-title">about</h3>${aboutHtml}</article>` + tocHtml(extractToc(aboutHtml)),
      }),
    );
  }

  // 태그 페이지
  const sortedTags = [...tagMap.entries()].sort((a, b) => b[1].length - a[1].length);
  write("/tags", layoutPage({ title: "tags", content: tagIndexHtml(sortedTags) }));
  for (const [tag, members] of sortedTags) {
    write(
      `/tags/${tag}`,
      layoutPage({ title: `#${tag}`, content: `<h3 class="page-title">#${tag}</h3>` + postListHtml(members) }),
    );
  }

  // 3) 정적 파일
  const staticDir = path.join(ROOT, "static");
  if (fs.existsSync(staticDir)) fs.cpSync(staticDir, DIST, { recursive: true });
  fs.mkdirSync(path.join(DIST, "assets"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "src", "style.css"), path.join(DIST, "assets", "style.css"));
  if (usesMath) {
    const katexDist = path.join(ROOT, "node_modules", "katex", "dist");
    fs.mkdirSync(path.join(DIST, "assets", "katex"), { recursive: true });
    fs.copyFileSync(path.join(katexDist, "katex.min.css"), path.join(DIST, "assets", "katex", "katex.min.css"));
    fs.cpSync(path.join(katexDist, "fonts"), path.join(DIST, "assets", "katex", "fonts"), { recursive: true });
  }
  fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

  buildVersion = String(Date.now());
  console.log(`✓ ${posts.length}개 글, ${tagMap.size}개 태그 — ${Date.now() - t0}ms`);
}

/* ---------- 개발 서버 (--serve): 파일 감시 + 라이브 리로드 ---------- */

function watchAndRebuild(md: MarkdownIt) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const trigger = (name: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`↻ ${name} 변경 감지`);
      try {
        runBuild(md);
      } catch (e) {
        console.error("빌드 실패:", (e as Error).message);
      }
    }, 300);
  };
  fs.watch(POSTS_DIR, { recursive: true }, (_e, fn) => fn?.endsWith(".md") && trigger(fn));
  fs.watch(ROOT, (_e, fn) => (fn === "about.md" || fn === "home.md") && trigger(fn));
  fs.watch(path.join(ROOT, "src"), (_e, fn) => fn === "style.css" && trigger(fn!));
  console.log("… posts/, about.md, home.md, src/style.css 감시 중 (저장하면 자동 반영)");
}

// 서빙되는 HTML에만 주입 (dist 파일은 그대로): 1초마다 빌드 버전을 확인해 바뀌면 새로고침
const LIVERELOAD =
  `<script>(function(){var v=null;setInterval(function(){fetch("/__version").then(function(r){return r.text()}).then(function(t){if(v===null)v=t;else if(t!==v)location.reload()}).catch(function(){})},1000)})();</script>`;

function serve(port = 4321) {
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
    ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
    ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".txt": "text/plain",
  };
  http
    .createServer((req, res) => {
      const p = decodeURIComponent((req.url ?? "/").split("?")[0]);
      if (p === "/__version") {
        res.writeHead(200, { "content-type": "text/plain" }).end(buildVersion);
        return;
      }
      let file = path.join(DIST, p);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file)) {
        res.writeHead(404).end("404");
        return;
      }
      if (file.endsWith(".html")) {
        const html = fs.readFileSync(file, "utf8").replace("</body>", LIVERELOAD + "</body>");
        res.writeHead(200, { "content-type": types[".html"] }).end(html);
        return;
      }
      res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
      res.end(fs.readFileSync(file));
    })
    .listen(port, () => console.log(`→ http://localhost:${port}`));
}

main();
