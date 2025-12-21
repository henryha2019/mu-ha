(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  function setMobile(open) {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    mobileNav.classList.toggle("is-open", open);
    mobileNav.setAttribute("aria-hidden", String(!open));
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMobile(!isOpen);
    });

    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMobile(false));
    });
  }

  // Reveal-on-scroll animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );

  function observeReveals() {
    document.querySelectorAll(".reveal").forEach((n) => observer.observe(n));
  }

  // Render content then observe reveal nodes
  const start = async () => {
    if (window.__renderAll) await window.__renderAll();
    observeReveals();
  };

  start().catch((err) => {
    console.error(err);
    const home = document.getElementById("home");
    if (home) {
      const div = document.createElement("div");
      div.className = "container";
      div.style.padding = "16px 0";
      div.textContent = "Failed to load site content. Check console for details.";
      home.appendChild(div);
    }
  });
})();
