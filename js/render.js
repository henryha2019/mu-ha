async function loadContent() {
  const res = await fetch("data/content.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data/content.json");
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
  nameNodes.forEach((n) => n && (n.textContent = meta.name || "Mu (Henry) Ha"));

  const roleNode = document.getElementById("metaRole");
  if (roleNode) roleNode.textContent = meta.role || "MLOps Engineer / Data Scientist";

  const links = [];
  if (meta.email) links.push({ label: meta.email, url: `mailto:${meta.email}` });
  if (meta.linkedin) links.push({ label: "LinkedIn", url: meta.linkedin });
  if (meta.github) links.push({ label: "GitHub", url: meta.github });

  const metaLinks = document.getElementById("metaLinks");
  if (metaLinks) {
    metaLinks.innerHTML = "";
    links.forEach((l) => {
      metaLinks.appendChild(
        el("a", "", { href: l.url, text: l.label, target: "_blank", rel: "noreferrer" })
      );
    });
  }
}

function renderHome(home) {
  const headline = document.getElementById("homeHeadline");
  if (headline && home.headline) headline.textContent = home.headline;

  const about = document.getElementById("homeAbout");
  if (about) {
    about.innerHTML = "";
    (home.about || []).forEach((p) => about.appendChild(el("p", "", { text: p })));
  }
}

function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  (projects || []).forEach((p) => {
    const card = el("article", "card reveal");

    const img = el("img", "card-img", {
      src: p.image || "",
      alt: `${p.title || "Project"} preview`,
      loading: "lazy"
    });

    const body = el("div", "card-body");
    body.appendChild(el("h3", "", { text: p.title || "Project" }));
    if (p.tagline) body.appendChild(el("p", "", { text: p.tagline }));

    if (p.bullets && p.bullets.length) {
      const ul = el("ul", "work-bullets");
      p.bullets.forEach((b) => ul.appendChild(el("li", "", { text: b })));
      body.appendChild(ul);
    }

    if (p.links && p.links.length) {
      const actions = el("div", "hero-actions");
      p.links.forEach((l) => {
        actions.appendChild(
          el("a", "btn btn-ghost", {
            href: l.url,
            text: l.label,
            target: l.url.startsWith("#") ? "_self" : "_blank",
            rel: "noreferrer"
          })
        );
      });
      body.appendChild(actions);
    }

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
    top.appendChild(el("h3", "work-title", { text: `${w.title || ""} — ${w.company || ""}`.trim() }));
    top.appendChild(el("div", "muted", { text: w.dates || "" }));

    item.appendChild(top);

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
    { title: "MLOps", items: skills.mlops || [] },
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

function renderResumes(resumes) {
  const select = document.getElementById("resumeSelectSection");
  const downloadBtn = document.getElementById("resumeDownloadSection");
  const viewBtn = document.getElementById("resumeViewSection");

  if (!select || !downloadBtn || !viewBtn) return;

  select.innerHTML = "";

  (resumes || []).forEach((r, idx) => {
    const opt = document.createElement("option");
    opt.value = r.file;
    opt.textContent = r.label;
    if (idx === 0) opt.selected = true;
    select.appendChild(opt);
  });

  const setLinks = (file) => {
    downloadBtn.href = file;
    downloadBtn.setAttribute("download", "");
    viewBtn.href = file;
  };

  if (resumes && resumes.length > 0) setLinks(resumes[0].file);

  select.addEventListener("change", (e) => setLinks(e.target.value));
}

async function renderAll() {
  const data = await loadContent();
  renderMeta(data.meta || {});
  renderHome(data.home || {});
  renderProjects(data.projects || []);
  renderWork(data.work || []);
  renderResumes(data.resumes || []);
  renderSkills(data.skills || {});

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

window.__renderAll = renderAll;
