const data = window.portfolioData;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderStats() {
  const grid = $("#statsGrid");
  grid.innerHTML = data.stats
    .map((item) => `
      <article class="stat-card">
        <strong>${item.number}</strong>
        <span>${item.label}</span>
      </article>
    `)
    .join("");
}

function renderServices() {
  const grid = $("#serviceGrid");
  grid.innerHTML = data.services
    .map((service) => `
      <article class="service-card">
        <span class="service-icon">${service.icon}</span>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </article>
    `)
    .join("");
}

function renderTimelineCarousel() {
  const track = $("#timelineTrack");
  track.innerHTML = data.timeline
    .map((item) => `
      <article class="timeline-card">
        <span class="year">${item.year}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </article>
    `)
    .join("");
}

function renderExperience() {
  const timeline = $("#experienceTimeline");
  timeline.innerHTML = data.experience
    .map((item) => `
      <article class="experience-item">
        <span>${item.period}</span>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </article>
    `)
    .join("");
}

function renderSkills() {
  const list = $("#skillList");
  list.innerHTML = data.skills
    .map((group) => `
      <section class="skill-group">
        <h4>${group.group}</h4>
        <div class="skill-tags">
          ${group.items.map((item) => `<span class="chip">${item}</span>`).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderActivities() {
  const list = $("#activitiesList");
  list.innerHTML = data.activities.map((item) => `<span class="chip">${item}</span>`).join("");
}

function getTypeLabel(type) {
  const labels = {
    journal: "Journal paper",
    conference: "Conference",
    book: "Book chapter"
  };
  return labels[type] || type;
}

function renderPublications(filter = "all", search = "") {
  const list = $("#papersList");
  const normalized = search.trim().toLowerCase();

  const filtered = data.publications.filter((paper) => {
    const matchesType = filter === "all" || paper.type === filter;
    const searchable = `${paper.title} ${paper.venue} ${paper.year} ${paper.tags.join(" ")}`.toLowerCase();
    const matchesSearch = !normalized || searchable.includes(normalized);
    return matchesType && matchesSearch;
  });

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state">No publications found for this filter.</div>`;
    return;
  }

  list.innerHTML = filtered
    .map((paper) => `
      <article class="paper-card">
        <div class="paper-meta">
          <span>${getTypeLabel(paper.type)}</span>
          <span>${paper.year}</span>
        </div>
        <h3>${paper.title}</h3>
        <p>${paper.venue}</p>
        <div class="card-tags" aria-label="Publication tags">
          ${paper.tags.map((tag) => `<span class="card-tag">${tag}</span>`).join("")}
        </div>
        ${paper.url && paper.url !== "#" ? `<a class="paper-link" href="${paper.url}" target="_blank" rel="noreferrer">Open DOI ↗</a>` : ""}
      </article>
    `)
    .join("");
}

function renderProjects(filter = "all") {
  const grid = $("#projectGrid");
  const filtered = data.projects.filter((project) => filter === "all" || project.category.includes(filter));

  grid.innerHTML = filtered
    .map((project) => `
      <article class="project-card">
        <span class="project-topline">${project.status}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="card-tags" aria-label="Project tags">
          ${project.tags.map((tag) => `<span class="card-tag">${tag}</span>`).join("")}
        </div>
        <div class="project-links">
          ${project.url && project.url !== "#" ? `<a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">View repository ↗</a>` : ""}
          ${project.streamlit_url ? `<a class="project-link project-link-app" href="${project.streamlit_url}" target="_blank" rel="noreferrer">Open app ↗</a>` : ""}
        </div>
      </article>
    `)
    .join("");
}

function setupNavigation() {
  const navLinks = $$(".nav-link");
  const pages = $$(".page");

  function activatePage(target) {
    navLinks.forEach((link) => link.classList.toggle("active", link.dataset.target === target));
    pages.forEach((page) => page.classList.toggle("active", page.dataset.page === target));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => activatePage(link.dataset.target));
  });

  $$('[data-target-shortcut]').forEach((button) => {
    button.addEventListener("click", () => activatePage(button.dataset.targetShortcut));
  });
}

function setupTimelineControls() {
  const track = $("#timelineTrack");
  const prev = $("#timelinePrev");
  const next = $("#timelineNext");
  const distance = () => Math.min(track.clientWidth * 0.86, 410);

  prev.addEventListener("click", () => track.scrollBy({ left: -distance(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: distance(), behavior: "smooth" }));
}

function setupPublicationFilters() {
  let currentFilter = "all";
  const search = $("#paperSearch");

  $$("#paperFilters .filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      $$("#paperFilters .filter-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderPublications(currentFilter, search.value);
    });
  });

  search.addEventListener("input", () => renderPublications(currentFilter, search.value));
}

function setupProjectFilters() {
  $$("#projectFilters .filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      $$("#projectFilters .filter-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderProjects(button.dataset.filter);
    });
  });
}

function init() {
  renderStats();
  renderServices();
  renderTimelineCarousel();
  renderExperience();
  renderSkills();
  renderActivities();
  renderPublications();
  renderProjects();
  setupNavigation();
  setupTimelineControls();
  setupPublicationFilters();
  setupProjectFilters();
}

document.addEventListener("DOMContentLoaded", init);
