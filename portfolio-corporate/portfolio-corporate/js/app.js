// js/app.js — Corporate Portfolio

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

function injectSEO() {
  const C = window.CONFIG;
  const S = C.seo;
  document.title = `${C.name} — ${C.typingRoles[0]}`;
  const setMeta = (sel, attr, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  setMeta('meta[name="description"]', "content", S.description);
  setMeta('meta[property="og:title"]', "content", `${C.name} — ${C.tagline}`);
  setMeta('meta[property="og:description"]', "content", S.description);
  setMeta('meta[property="og:url"]', "content", S.siteUrl);
  setMeta('meta[name="twitter:card"]', "content", "summary_large_image");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: C.name,
    email: C.email,
    telephone: C.phone,
    url: S.siteUrl,
    jobTitle: C.typingRoles[0],
    address: { "@type": "PostalAddress", addressLocality: C.location },
    sameAs: [C.linkedin].filter(Boolean),
  };
  let jsonLd = document.querySelector("#schema-jsonld");
  if (!jsonLd) { jsonLd = document.createElement("script"); jsonLd.id = "schema-jsonld"; jsonLd.type = "application/ld+json"; document.head.appendChild(jsonLd); }
  jsonLd.textContent = JSON.stringify(schema);

  document.querySelectorAll("[data-config]").forEach((el) => {
    const k = el.dataset.config;
    if (k === "name") el.textContent = C.name;
    if (k === "email") { el.textContent = C.email; if (el.tagName === "A") el.href = `mailto:${C.email}`; }
    if (k === "phone") { el.textContent = C.phone; if (el.tagName === "A") el.href = `tel:${C.phone}`; }
    if (k === "location") el.textContent = C.location;
    if (k === "linkedin") { el.href = C.linkedin; }
    if (k === "tagline") el.textContent = C.tagline;
  });

  document.querySelector(".hero-name").textContent = C.name;
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}
function applyTheme(t) { document.documentElement.dataset.theme = t; }

function initNav() {
  const navbar = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    let current = "";
    sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
  });
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }));
}

function initTyping() {
  const el = document.getElementById("typing-text");
  const roles = CONFIG.typingRoles;
  let ri = 0, ci = 0, deleting = false;
  function tick() {
    const word = roles[ri];
    if (deleting) {
      el.textContent = word.slice(0, ci - 1); ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 350); return; }
      setTimeout(tick, 45);
    } else {
      el.textContent = word.slice(0, ci + 1); ci++;
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 80);
    }
  }
  tick();
}

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
            <div class="skill-label"><span>${s.name}</span><span class="skill-pct">${s.level}%</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="${s.level}" style="width:0%"></div></div>
          </div>`).join("")}
      </div>`;
    container.appendChild(card);
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".skill-fill").forEach((bar) => { bar.style.width = bar.dataset.width + "%"; });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".skill-card").forEach((c) => observer.observe(c));
}

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
      ${p.link && p.link !== "#" ? `<a href="${p.link}" class="project-link" target="_blank" rel="noopener">View Work →</a>` : ""}`;
    container.appendChild(card);
  });
}

function renderExperience() {
  const container = document.getElementById("timeline");
  if (!container) return;
  CONFIG.experience.forEach((exp) => {
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

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const subject = form.querySelector('[name="subject"]').value;
    const message = form.querySelector('[name="message"]').value;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject || "Portfolio Enquiry")}&body=${encodeURIComponent(`Hi ${CONFIG.name},\n\nI'm ${name}.\n\n${message}`)}`;
  });
}
