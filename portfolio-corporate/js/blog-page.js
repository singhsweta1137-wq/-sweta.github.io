// js/blog-page.js — Blog listing with search & tag filters

document.addEventListener("DOMContentLoaded", () => {
  injectBlogSEO();
  initTheme();
  initNav();
  initMobileMenu();
  renderBlogPosts();
  initSearch();
  initScrollReveal();
});

function injectBlogSEO() {
  const C = window.CONFIG;
  const S = C.seo;
  document.title = `Blog — ${C.name}`;
  const setMeta = (sel, attr, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  setMeta('meta[name="description"]', "content", `Writing on textile heritage, content strategy, and digital workflows by ${C.name}.`);
  setMeta('meta[property="og:title"]', "content", `Blog — ${C.name}`);
  setMeta('meta[property="og:url"]', "content", `${S.siteUrl}/blog.html`);

  document.querySelectorAll("[data-config]").forEach((el) => {
    const k = el.dataset.config;
    if (k === "name") el.textContent = C.name;
  });
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
}

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

// ─── Collect all tags ─────────────────────────────────────────────────────────
let activeTag = "all";
let searchQuery = "";

function getAllTags() {
  const tags = new Set();
  CONFIG.blogPosts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return ["all", ...tags];
}

function renderTagFilters() {
  const container = document.getElementById("tag-filters");
  if (!container) return;
  getAllTags().forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = `tag-btn${tag === "all" ? " active" : ""}`;
    btn.textContent = tag === "all" ? "All Posts" : tag;
    btn.dataset.tag = tag;
    btn.addEventListener("click", () => {
      activeTag = tag;
      document.querySelectorAll(".tag-btn").forEach((b) => b.classList.toggle("active", b.dataset.tag === tag));
      renderBlogPosts();
    });
    container.appendChild(btn);
  });
}

// ─── Render posts ─────────────────────────────────────────────────────────────
function renderBlogPosts() {
  const grid = document.getElementById("posts-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const filtered = CONFIG.blogPosts.filter((p) => {
    const matchTag = activeTag === "all" || p.tags.includes(activeTag);
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery) || p.excerpt.toLowerCase().includes(searchQuery) || p.tags.some((t) => t.toLowerCase().includes(searchQuery));
    return matchTag && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results"><p>No posts found. Try a different search or tag.</p></div>`;
    return;
  }

  filtered.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card reveal";
    const date = new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
    card.innerHTML = `
      <div class="post-card-meta">
        <time datetime="${post.date}">${date}</time>
        <span class="reading-time">${post.readingTime} read</span>
      </div>
      <h2 class="post-card-title">
        <a href="post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a>
      </h2>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <div class="post-card-tags">${post.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="post-read-more">Read Article →</a>`;
    grid.appendChild(card);
  });

  // Re-observe reveal elements
  initScrollReveal();
}

// ─── Search ───────────────────────────────────────────────────────────────────
function initSearch() {
  renderTagFilters();
  const input = document.getElementById("search-input");
  if (!input) return;
  input.addEventListener("input", () => {
    searchQuery = input.value.toLowerCase().trim();
    renderBlogPosts();
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => observer.observe(el));
}
