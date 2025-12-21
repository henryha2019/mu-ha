function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (!toggle || !mobileNav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
    mobileNav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  mobileNav.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });
}

function setupReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  nodes.forEach((n) => obs.observe(n));
}

function setupSmoothAnchors() {
  document.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });
}

(async function init() {
  setupMobileNav();
  setupReveal();
  setupSmoothAnchors();

  if (window.__renderAll) await window.__renderAll();
})();
