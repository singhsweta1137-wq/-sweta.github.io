// js/post-page.js — Blog post reader

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initMobileMenu();
  loadPost();
});

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}
function applyTheme(t) { document.documentElement.dataset.theme = t; }

function initNav() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 50));
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", false);
    })
  );
}

// ─── Load & render post ───────────────────────────────────────────────────────
async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) { showError("No post specified."); return; }

  const postMeta = CONFIG.blogPosts.find((p) => p.slug === slug);
  if (!postMeta) { showError("Post not found."); return; }

  try {
    const res = await fetch(`blog/posts/${slug}.md`);
    if (!res.ok) throw new Error("Not found");
    const raw = await res.text();
    const { meta, content } = MDParser.parseFrontmatter(raw);
    renderPost(postMeta, meta, content, slug);
  } catch (err) {
    showError("Could not load this post. " + err.message);
  }
}

function renderPost(postMeta, fmMeta, content, slug) {
  const C = window.CONFIG;
  const S = C.seo;

  // Merge frontmatter with config meta
  const title = fmMeta.title || postMeta.title;
  const date = fmMeta.date || postMeta.date;
  const tags = Array.isArray(fmMeta.tags) ? fmMeta.tags : postMeta.tags;
  const excerpt = fmMeta.excerpt || postMeta.excerpt;
  const readingTime = postMeta.readingTime;

  // SEO
  document.title = `${title} — ${C.name}`;
  const setMeta = (sel, attr, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  setMeta('meta[name="description"]', "content", excerpt);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", excerpt);
  setMeta('meta[property="og:url"]', "content", `${S.siteUrl}/post.html?slug=${slug}`);
  setMeta('meta[property="og:type"]', "content", "article");
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", excerpt);

  // JSON-LD Article
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    author: { "@type": "Person", name: C.name, url: S.siteUrl },
    url: `${S.siteUrl}/post.html?slug=${slug}`,
  };
  let jsonLd = document.querySelector("#schema-jsonld");
  if (!jsonLd) { jsonLd = document.createElement("script"); jsonLd.id = "schema-jsonld"; jsonLd.type = "application/ld+json"; document.head.appendChild(jsonLd); }
  jsonLd.textContent = JSON.stringify(schema);

  // Nav brand
  document.querySelectorAll("[data-config='name']").forEach((el) => (el.textContent = C.name));

  // Render post header
  const header = document.getElementById("post-header");
  const fmtDate = new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  header.innerHTML = `
    <div class="post-breadcrumb"><a href="blog.html">← Blog</a></div>
    <h1 class="post-title">${title}</h1>
    <div class="post-meta-row">
      <time datetime="${date}">${fmtDate}</time>
      <span class="dot">·</span>
      <span>${readingTime} read</span>
    </div>
    <div class="post-tags">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;

  // Render content
  const body = document.getElementById("post-body");
  body.innerHTML = MDParser.parse(content);

  // Add copy buttons to code blocks
  body.querySelectorAll("pre code").forEach((block) => {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(block.textContent).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 2000);
      });
    });
    block.parentElement.style.position = "relative";
    block.parentElement.appendChild(btn);
  });

  // Prev / Next navigation
  renderPrevNext(slug);

  // Share buttons
  renderShare(title, slug);
}

function renderPrevNext(currentSlug) {
  const posts = CONFIG.blogPosts;
  const idx = posts.findIndex((p) => p.slug === currentSlug);
  const prev = posts[idx + 1];
  const next = posts[idx - 1];
  const container = document.getElementById("post-nav");
  if (!container) return;

  container.innerHTML = `
    <div class="post-nav-inner">
      ${prev ? `<a class="post-nav-link prev" href="post.html?slug=${prev.slug}">
        <span class="nav-dir">← Previous</span>
        <span class="nav-title">${prev.title}</span>
      </a>` : "<div></div>"}
      ${next ? `<a class="post-nav-link next" href="post.html?slug=${next.slug}">
        <span class="nav-dir">Next →</span>
        <span class="nav-title">${next.title}</span>
      </a>` : "<div></div>"}
    </div>`;
}

function renderShare(title, slug) {
  const container = document.getElementById("share-buttons");
  if (!container) return;
  const url = encodeURIComponent(`${CONFIG.seo.siteUrl}/post.html?slug=${slug}`);
  const text = encodeURIComponent(title);

  container.innerHTML = `
    <p class="share-label">Share this post:</p>
    <div class="share-row">
      <a href="https://twitter.com/intent/tweet?text=${text}&url=${url}" class="share-btn twitter" target="_blank" rel="noopener">𝕏 Twitter</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" class="share-btn linkedin" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://wa.me/?text=${text}%20${url}" class="share-btn whatsapp" target="_blank" rel="noopener">WhatsApp</a>
      <button class="share-btn copy-link" onclick="copyLink('${decodeURIComponent(url)}')">Copy Link</button>
    </div>`;
}

function copyLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.querySelector(".copy-link");
    if (btn) { btn.textContent = "Copied!"; setTimeout(() => (btn.textContent = "Copy Link"), 2000); }
  });
}

function showError(msg) {
  const body = document.getElementById("post-body");
  if (body) body.innerHTML = `<div class="error-state"><h2>Oops!</h2><p>${msg}</p><a href="blog.html">← Back to Blog</a></div>`;
  document.title = "Post Not Found";
}
