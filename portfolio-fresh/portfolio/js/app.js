// js/app.js — Portfolio index page logic

document.addEventListener("DOMContentLoaded", () => {
  injectSEO();
  initTheme();
  initNav();
  initTyping();
  renderSkills();
  renderProjects();
  renderExperience();
  renderEducation();
  initScrollReveal();
  initContactForm();
  initMobileMenu();
});

// ─── SEO ─────────────────────────────────────────────────────────────────────
function injectSEO() {
  const C = window.CONFIG;
  const S = C.seo;

  document.title = `${C.name} — ${C.tagline}`;

  const setMeta = (sel, attr, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  };

  setMeta('meta[name="description"]', "content", S.description);
  setMeta('meta[name="keywords"]', "content", S.keywords);
  setMeta('meta[name="author"]', "content", C.name);

  // Open Graph
  setMeta('meta[property="og:title"]', "content", `${C.name} — ${C.tagline}`);
  setMeta('meta[property="og:description"]', "content", S.description);
  setMeta('meta[property="og:image"]', "content", S.ogImage);
  setMeta('meta[property="og:url"]', "content", S.siteUrl);
  setMeta('meta[property="og:type"]', "content", "website");
  setMeta('meta[property="og:locale"]', "content", S.locale);

  // Twitter Card
  setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
  setMeta('meta[name="twitter:title"]', "content", `${C.name} — ${C.tagline}`);
  setMeta('meta[name="twitter:description"]', "content", S.description);
  setMeta('meta[name="twitter:image"]', "content", S.ogImage);
  setMeta('meta[name="twitter:site"]', "content", S.twitterHandle);

  // Canonical
  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
  canon.href = S.siteUrl;

  // JSON-LD Person schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: C.name,
    email: C.email,
    telephone: C.phone,
    url: S.siteUrl,
    jobTitle: C.typingRoles[0],
    address: { "@type": "PostalAddress", addressLocality: C.location },
    sameAs: [C.linkedin, C.github].filter(Boolean),
    description: S.description,
  };
  let jsonLd = document.querySelector("#schema-jsonld");
  if (!jsonLd) { jsonLd = document.createElement("script"); jsonLd.id = "schema-jsonld"; jsonLd.type = "application/ld+json"; document.head.appendChild(jsonLd); }
  jsonLd.textContent = JSON.stringify(schema, null, 2);

  // Inject config values into DOM
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (key === "name") el.textContent = C.name;
    if (key === "tagline") el.textContent = C.tagline;
    if (key === "email") { el.textContent = C.email; el.href = `mailto:${C.email}`; }
    if (key === "phone") { el.textContent = C.phone; el.href = `tel:${C.phone}`; }
    if (key === "location") el.textContent = C.location;
    if (key === "linkedin") el.href = C.linkedin;
    if (key === "github") el.href = C.github;
  });

  document.querySelector(".hero-name").textContent = C.name;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function initNav() {
  const navbar = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);

    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === `#${current}`);
    });
  });
}

// ─── Mobile Menu ─────────────────────────────────────────────────────────────
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

// ─── Typing Effect ────────────────────────────────────────────────────────────
function initTyping() {
  const el = document.getElementById("typing-text");
  const roles = CONFIG.typingRoles;
  let ri = 0, ci = 0, deleting = false;
  const SPEED = 80, DELETE_SPEED = 45, PAUSE = 1800;

  function tick() {
    const word = roles[ri];
    if (deleting) {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 350); return; }
      setTimeout(tick, DELETE_SPEED);
    } else {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(tick, PAUSE); return; }
      setTimeout(tick, SPEED);
    }
  }
  tick();
}

// ─── Skills ──────────────────────────────────────────────────────────────────
function renderSkills() {
  const container = document.getElementById("skills-grid");
  if (!container) return;

  CONFIG.skillCategories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "skill-card reveal";
    card.innerHTML = `
      <div class="skill-card-header">
        <span class="skill-icon">${cat.icon}</span>
        <h3>${cat.category}</h3>
      </div>
      <div class="skill-list">
        ${cat.skills.map((s) => `
          <div class="skill-item">
            <div class="skill-label">
              <span>${s.name}</span>
              <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-bar"><div class="skill-fill" data-width="${s.level}" style="width:0%"></div></div>
          </div>`).join("")}
      </div>`;
    container.appendChild(card);
  });

  // Animate bars on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".skill-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".skill-card").forEach((c) => observer.observe(c));
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  CONFIG.projects.forEach((p) => {
    const card = document.createElement("div");
    card.className = `project-card reveal${p.featured ? " featured" : ""}`;
    card.innerHTML = `
      ${p.featured ? '<div class="featured-badge">Featured</div>' : ""}
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.description}</p>
      <div class="project-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      ${p.link && p.link !== "#" ? `<a href="${p.link}" class="project-link" target="_blank" rel="noopener">View Work ↗</a>` : ""}`;
    container.appendChild(card);
  });
}

// ─── Experience ───────────────────────────────────────────────────────────────
function renderExperience() {
  const container = document.getElementById("timeline");
  if (!container) return;

  CONFIG.experience.forEach((exp, i) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal";
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <h3>${exp.role}</h3>
          <span class="timeline-type">${exp.type}</span>
        </div>
        <div class="timeline-meta">
          <span class="timeline-company">${exp.company}</span>
          <span class="timeline-period">${exp.period}</span>
        </div>
        <ul class="timeline-bullets">
          ${exp.bullets.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>`;
    container.appendChild(item);
  });
}

// ─── Education ────────────────────────────────────────────────────────────────
function renderEducation() {
  const container = document.getElementById("education-grid");
  if (!container) return;

  CONFIG.education.forEach((edu) => {
    const card = document.createElement("div");
    card.className = "edu-card reveal";
    card.innerHTML = `
      <div class="edu-icon">${edu.icon}</div>
      <div class="edu-info">
        <h3>${edu.degree}</h3>
        <p>${edu.institution}</p>
        <span class="edu-year">${edu.year}</span>
      </div>`;
    container.appendChild(card);
  });
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const subject = form.querySelector('[name="subject"]').value;
    const message = form.querySelector('[name="message"]').value;
    const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject || "Portfolio Enquiry")}&body=${encodeURIComponent(`Hi ${CONFIG.name},\n\nI'm ${name}.\n\n${message}`)}`;
    window.location.href = mailto;
  });
}
