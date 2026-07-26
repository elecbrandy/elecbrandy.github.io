import type { Post } from "./build.ts";

export interface TocItem {
  level: number;
  id: string;
  text: string;
}

const SITE_TITLE = "elecbrandy";
const GA_ID = "G-ZL1NP5K5CJ";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function layoutPage(opts: { title: string; content: string; math?: boolean }): string {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}${opts.title === SITE_TITLE ? "" : ` · ${SITE_TITLE}`}</title>
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="/assets/style.css">
${opts.math ? `<link rel="stylesheet" href="/assets/katex/katex.min.css">` : ""}
<script>(function(){var t=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;})();</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}");</script>
</head>
<body>
<header class="site-header">
  <a class="site-title" href="/">${SITE_TITLE}</a>
  <nav>
    <a href="/">posts</a>
    <a href="/tags/">tags</a>
    <a href="/about/">about</a>
    <button id="theme-toggle" aria-label="테마 전환">
      <svg class="sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      <svg class="moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </nav>
</header>
<main>
${opts.content}
</main>
<footer class="site-footer">© ${new Date().getFullYear()} ${SITE_TITLE}</footer>
<button id="to-top" aria-label="맨 위로"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<script>
document.getElementById("theme-toggle").addEventListener("click",function(){var h=document.documentElement;var t=h.dataset.theme==="dark"?"light":"dark";h.dataset.theme=t;localStorage.setItem("theme",t);});
(function(){
  var btn=document.getElementById("to-top");
  btn.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});
  var toc=document.querySelector(".toc");
  var links=toc?Array.prototype.slice.call(toc.querySelectorAll(".toc-list a")):[];
  var bars=toc?Array.prototype.slice.call(toc.querySelectorAll(".toc-bars span")):[];
  var heads=links.map(function(a){return document.getElementById(a.dataset.id);});
  function onScroll(){
    btn.classList.toggle("show",window.scrollY>400);
    if(!toc)return;
    var cur=-1;
    for(var i=0;i<heads.length;i++){if(heads[i]&&heads[i].getBoundingClientRect().top<=90)cur=i;}
    for(var j=0;j<links.length;j++){
      links[j].classList.toggle("active",j===cur);
      if(bars[j])bars[j].classList.toggle("active",j===cur);
    }
  }
  window.addEventListener("scroll",onScroll,{passive:true});
  onScroll();
})();
</script>
</body>
</html>
`;
}

export function postListHtml(posts: Post[]): string {
  let out = `<ul class="post-list">`;
  for (const p of posts) {
    const tags = p.tags
      .map((t) => `<a class="chip" href="/tags/${encodeURIComponent(t.toLowerCase())}/">${esc(t)}</a>`)
      .join("");
    out += `<li class="post-item"><time>${fmtDate(p.date)}</time><a href="${p.url}">${esc(p.title)}</a><span class="tags">${tags}</span></li>`;
  }
  return out + `</ul>`;
}

export function postPageHtml(p: Post): string {
  const tags = p.tags
    .map((t) => `<a class="chip" href="/tags/${encodeURIComponent(t.toLowerCase())}/">${esc(t)}</a>`)
    .join("");
  return `<article class="post">
<h1 class="post-title">${esc(p.title)}</h1>
<div class="post-meta"><time>${fmtDate(p.date)}</time>${tags}</div>
${p.html}
</article>`;
}

export function tagIndexHtml(tags: [string, Post[]][]): string {
  const items = tags
    .map(
      ([tag, posts]) =>
        `<a class="tag-cloud-item" href="/tags/${encodeURIComponent(tag)}/">#${esc(tag)}<span>${posts.length}</span></a>`,
    )
    .join("");
  return `<h3 class="page-title">tags</h3><div class="tag-cloud">${items}</div>`;
}

export function tocHtml(items: TocItem[]): string {
  if (items.length < 2) return "";
  const min = Math.min(...items.map((i) => i.level));
  const bars = items.map((i) => `<span class="lv${i.level - min}"></span>`).join("");
  const links = items
    .map((i) => `<a class="lv${i.level - min}" href="#${encodeURIComponent(i.id)}" data-id="${i.id}">${i.text}</a>`)
    .join("");
  return `<nav class="toc" aria-label="목차"><div class="toc-bars">${bars}</div><div class="toc-list">${links}</div></nav>`;
}

export function seriesBoxHtml(title: string, members: Post[], currentUrl: string): string {
  const items = members
    .map((m) => {
      const current = m.url === currentUrl;
      return `<li${current ? ` class="current"` : ""}>${
        current ? esc(m.title) : `<a href="${m.url}">${esc(m.title)}</a>`
      }<time>${fmtDate(m.date)}</time></li>`;
    })
    .join("");
  return `<div class="series"><details open><summary>${esc(title)}</summary><ol>${items}</ol></details></div>`;
}
