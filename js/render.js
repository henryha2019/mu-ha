async function loadContent() {
  const res = await fetch("data/content.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load content.json");
  return await res.json();
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  return node;
}

function renderMeta(meta) {
  const nameNodes = ["navName", "footerName"].map((id) => document.getElementById(id));
  nameNodes.forEach((n) => n && (n.textContent = meta.name));

  const roleNode = document.getElementById("metaRole");
  if (roleNode) roleNode.textContent = meta.role;

  const links = [];
  if (meta.email) links.push({ label: meta.email, url: `mailto:${meta.email}` });
  if (meta.linkedin) links.push({ label: "LinkedIn", url: meta.linkedin });
  if (meta.github) links.push({ label: "GitHub", url: meta.github });

  const metaLinks = document.getElementById("metaLinks");
  if (metaLinks) {
    metaLinks.innerHTML = "";
    links.forEach((l) => {
      const a = el("a", "", { href: l.url, text: l.label, target: "_blank", rel: "noreferrer" });
      metaLinks.appendChild(a);
    });
  }
}

function renderHome(home) {
  const headline = document.getElementById("homeHeadline");
  if (headline) headline.textContent = home.headline;

  const about = document.getElementById("homeAbout");
  if (about) {
    about.innerHTML = "";
    (home.about || []).forEach((p) =>
      about.appendChild(el("p", "", { text: p }))
    );

    if (Array.isArray(home.badges) && home.badges.length) {
      const pills = el("div", "pills");
      home.badges.forEach((b) =>
        pills.appendChild(el("span", "pill", { text: b }))
      );
      about.appendChild(pills);
    }
  }
}
function renderEducation(education) {
  const list = document.getElementById("educationList");
  if (!list) return;
  list.innerHTML = "";

  (education || []).forEach((e) => {
    const item = el("div", "work-item reveal");

    const top = el("div", "work-top");
    top.appendChild(
      el("h3", "work-title", {
        text: `${e.degree} — ${e.institution}`
      })
    );
    top.appendChild(
      el("div", "muted", {
        text: `${e.dates}${e.location ? " · " + e.location : ""}`
      })
    );

    item.appendChild(top);

    const ul = el("ul", "work-bullets");
    (e.highlights || []).forEach((h) =>
      ul.appendChild(el("li", "", { text: h }))
    );

    item.appendChild(ul);
    list.appendChild(item);
  });
}

function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  (projects || []).forEach((p) => {
    const card = el("article", "card reveal");
    const img = el("img", "card-img", {
      src: p.image || "",
      alt: `${p.title} preview`,
      loading: "lazy"
    });

    const body = el("div", "card-body");
    body.appendChild(el("h3", "", { text: p.title || "Project" }));
    body.appendChild(el("p", "", { text: p.tagline || "" }));

    if (p.summary) {
      body.appendChild(el("div", "work-summary", { text: p.summary }));
    } else if (p.bullets && p.bullets.length) {
      const ul = el("ul", "work-bullets");
      p.bullets.forEach((b) => ul.appendChild(el("li", "", { text: b })));
      body.appendChild(ul);
    }

    const actions = el("div", "card-actions");
    (p.links || []).forEach((l) => {
      actions.appendChild(
        el("a", "btn btn-ghost", { href: l.url, text: l.label, target: "_blank", rel: "noreferrer" })
      );
    });
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

/**
 * Resume preview modal wiring
 */
function getResumeModal() {
  return {
    modal: document.getElementById("resumeModal"),
    title: document.getElementById("resumeModalTitle"),
    sub: document.getElementById("resumeModalSub"),
    frame: document.getElementById("resumeModalFrame"),
    close: document.getElementById("resumeModalClose"),
    dl: document.getElementById("resumeModalDownload"),
    openNew: document.getElementById("resumeModalOpenNew")
  };
}

function setupResumeModalOnce() {
  const { modal, close } = getResumeModal();
  if (!modal || modal.__wired) return;

  modal.__wired = true;

  // Close button
  if (close) close.addEventListener("click", () => modal.close());

  // Click outside to close
  modal.addEventListener("click", (e) => {
    const inner = modal.querySelector(".modal-inner");
    if (inner && !inner.contains(e.target)) modal.close();
  });

  // Esc is handled by <dialog> natively
}

function openResumeModal({ title, subtitle, pdfUrl }) {
  const { modal, title: t, sub, frame, dl, openNew } = getResumeModal();
  if (!modal || !frame) return;

  if (t) t.textContent = title || "Resume Preview";
  if (sub) sub.textContent = subtitle || "PDF preview";

  // Set sources
  frame.src = pdfUrl || "";
  if (dl) dl.href = pdfUrl || "#";
  if (openNew) openNew.href = pdfUrl || "#";

  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "true");
}

function renderResumes(resumes) {
  const grid = document.getElementById("resumeGrid");
  if (!grid) return;
  grid.innerHTML = "";

  setupResumeModalOnce();

  (resumes || []).forEach((r) => {
    const card = el("article", "card reveal");

    const img = el("img", "card-img", {
      src: r.image || "assets/img/projects/jobai.png",
      alt: `${r.title} preview`,
      loading: "lazy"
    });

    const body = el("div", "card-body");
    body.appendChild(el("h3", "", { text: r.title || "Resume" }));
    body.appendChild(el("p", "", { text: r.tagline || "" }));

    // Optional highlights (same visual style as projects)
    const ul = el("ul", "work-bullets");
    (r.bullets || []).forEach((b) => ul.appendChild(el("li", "", { text: b })));
    body.appendChild(ul);

    // Tags/pills
    if (Array.isArray(r.tags) && r.tags.length) {
      const pills = el("div", "pills");
      r.tags.forEach((s) => pills.appendChild(el("span", "pill", { text: s })));
      body.appendChild(pills);
    }

    // Actions
    const actions = el("div", "card-actions");

    const previewBtn = el("button", "btn btn-ghost", { type: "button" });
    previewBtn.textContent = "Preview";
    previewBtn.addEventListener("click", () => {
      openResumeModal({
        title: r.title,
        subtitle: r.tagline,
        pdfUrl: r.file
      });
    });

    const downloadA = el("a", "btn", { href: r.file || "#", download: "" });
    downloadA.textContent = "Download";

    actions.appendChild(previewBtn);
    actions.appendChild(downloadA);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

function renderWork(work) {
  const list = document.getElementById("workList");
  if (!list) return;
  list.innerHTML = "";

  (work || []).forEach((w) => {
    const item = el("div", "work-item reveal");

    const top = el("div", "work-top");
    top.appendChild(el("h3", "work-title", { text: `${w.title} — ${w.company}` }));
    top.appendChild(el("div", "muted", { text: w.dates || "" }));

    item.appendChild(top);
    if (w.subtitle) item.appendChild(el("p", "work-sub", { text: w.subtitle }));

    const ul = el("ul", "work-bullets");
    (w.highlights || []).forEach((h) => ul.appendChild(el("li", "", { text: h })));
    item.appendChild(ul);

    list.appendChild(item);
  });
}

function renderSkills(skills) {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const groups = [
    { title: "Core", items: skills.core || [] },
    { title: "MLOps & Cloud", items: skills.mlops || [] },
    { title: "Tools", items: skills.tools || [] }
  ];

  groups.forEach((g) => {
    const card = el("div", "card reveal");
    const body = el("div", "card-body");
    body.appendChild(el("h3", "", { text: g.title }));

    const pills = el("div", "pills");
    g.items.forEach((s) => pills.appendChild(el("span", "pill", { text: s })));
    body.appendChild(pills);

    card.appendChild(body);
    grid.appendChild(card);
  });
}

async function renderAll() {
  const data = await loadContent();
  renderMeta(data.meta || {});
  renderHome(data.home || {});
  renderProjects(data.projects || []);
  renderResumes(data.resumes || []);
  renderEducation(data.education || []);
  renderWork(data.work || []);
  renderSkills(data.skills || {});
}

window.__renderAll = renderAll;
