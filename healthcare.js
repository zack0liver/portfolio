const projects = {
  clt: {
    tag: "Community",
    title: "Charlotte Startup Index",
    desc: "A searchable directory for discovering startups in the Charlotte area. Filter by industry, stage, and more.",
    stack: ["JavaScript", "Google Sheets", "HTML/CSS"],
    url: "https://cltstartups.com/",
    status: "development"
  },
  kettlebell: {
    tag: "Fitness",
    title: "Kettlebell Genie",
    desc: "Generates custom kettlebell workouts and tracks your progress over time. Sign in with Google to save your history.",
    stack: ["JavaScript", "Google Auth", "Cloud Storage"],
    url: "https://zack0liver.github.io/kettlebell-app/"
  },
  nombook: {
    tag: "Cooking & Lifestyle",
    title: "NomBook",
    desc: "A recipe manager to clip, organize, and revisit your favorites. Optimized for an old iPad 2 in the kitchen.",
    stack: ["JavaScript", "CSS", "HTML"],
    url: "https://zack0liver.github.io/recipe-clipper/"
  },
  spark: {
    tag: "Creativity",
    title: "Spark App",
    desc: "Capture ideas instantly. Never lose a thought again.",
    stack: ["JavaScript", "Firebase", "Web Speech API"],
    url: "https://zack0liver.github.io/spark-app/"
  },
  arcade: {
    tag: "Fun",
    title: "Zack's Arcade",
    desc: "A collection of custom retro-style arcade games built for 90s mall-arcade nostalgia.",
    stack: ["Claude Code", "GitHub", "HTML5 Canvas"],
    url: "https://zack0liver.github.io/games",
    status: "development"
  }
};

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Innovation Unit bed board ─────────────────────── */
function renderUnits() {
  const board = document.getElementById("unitBoard");
  if (!board) return;

  const all = Object.values(projects);
  const inTreatment = all.filter(p => p.status === "development").length;
  const stable = all.length - inTreatment;

  const statusPillEl = document.getElementById("unitsStatusPill");
  if (statusPillEl) {
    const parts = [];
    if (stable > 0) parts.push(`${stable} STABLE`);
    if (inTreatment > 0) parts.push(`${inTreatment} IN TREATMENT`);
    statusPillEl.textContent = parts.join(" · ");
  }

  const cards = all.map((p, i) => {
    const bed = String(i + 1).padStart(2, "0");
    const stack = p.stack.map(s => `<span>${s}</span>`).join("");
    const statusPill = p.status === "development"
      ? '<span class="pill pill--warn"><span class="pill-dot" aria-hidden="true"></span>IN TREATMENT</span>'
      : '<span class="pill pill--ok"><span class="pill-dot" aria-hidden="true"></span>STABLE</span>';
    return `
      <article class="unit-card">
        <div class="unit-top">
          <span class="bed-num">BED ${bed}</span>
          ${statusPill}
        </div>
        <span class="unit-dept">${p.tag}</span>
        <h3 class="unit-title">${p.title}</h3>
        <p class="unit-desc">${p.desc}</p>
        <div class="unit-stack">${stack}</div>
        <a class="unit-link" href="${p.url}" target="_blank" rel="noopener">Open chart <span aria-hidden="true">↗</span></a>
      </article>`;
  });

  board.innerHTML = cards.join("");
}

/* ── Status-bar clock ──────────────────────────────── */
function startClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const pad = n => String(n).padStart(2, "0");

  function tick() {
    const d = new Date();
    clock.textContent =
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} · ${months[d.getMonth()]} ${pad(d.getDate())}`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ── KPI count-up ──────────────────────────────────── */
function countUp() {
  const nums = document.querySelectorAll(".kpi-num[data-target]");

  nums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const padLen = parseInt(el.dataset.pad || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const format = v => prefix + String(v).padStart(padLen, "0") + suffix;

    if (prefersReducedMotion) {
      el.textContent = format(target);
      return;
    }

    const duration = 900;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }

    el.textContent = format(0);
    requestAnimationFrame(frame);
  });
}

/* ── Records filter ────────────────────────────────── */
function initFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".pub-item");
  const status = document.getElementById("filterStatus");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach(b =>
        b.setAttribute("aria-pressed", String(b === btn))
      );

      let shown = 0;
      items.forEach(item => {
        const match = filter === "all" || item.dataset.tag === filter;
        item.hidden = !match;
        if (match) shown++;
      });

      if (status) status.textContent = `Showing ${shown} of ${items.length} entries`;
    });
  });
}

/* ── Night Shift theme toggle ──────────────────────── */
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const stored = localStorage.getItem("theme");
  const systemNight = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (systemNight ? "night" : "day");

  function apply(theme) {
    if (theme === "night") {
      document.documentElement.setAttribute("data-theme", "night");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    toggle.setAttribute("aria-pressed", String(theme === "night"));
    toggle.querySelector(".theme-toggle-icon").textContent =
      theme === "night" ? "☀" : "☾";
    toggle.querySelector(".theme-toggle-label").textContent =
      theme === "night" ? "Day shift" : "Night shift";
  }

  apply(initial);

  toggle.addEventListener("click", () => {
    const next = document.documentElement.hasAttribute("data-theme") ? "day" : "night";
    apply(next);
    localStorage.setItem("theme", next);
  });
}

/* ── Collapsible panels (Profile / Consults / Units / Records) ─── */
function initCollapsibles() {
  const sections = [
    { key: "profile", collapseByDefault: true },
    { key: "consults", collapseByDefault: true },
    { key: "units", collapseByDefault: true },
    { key: "records", collapseByDefault: true },
  ];

  sections.forEach(({ key, collapseByDefault }) => {
    const toggle = document.getElementById(`${key}Toggle`);
    const collapse = document.getElementById(`${key}Collapse`);
    if (!toggle || !collapse) return;

    // Collapsed by default only once JS has run (and only for sections
    // that want it); markup defaults to open so content stays reachable
    // without JS.
    if (collapseByDefault) {
      collapse.classList.add("is-collapsed");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      collapse.classList.toggle("is-collapsed", isOpen);
    });
  });
}

/* ── Nav tabs: expand target section + scroll under sticky header ── */
function initNavScroll() {
  const HEADER_GAP = 16;

  function scrollToSection(section) {
    const headerHeight = document.querySelector(".statusbar").getBoundingClientRect().height;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - headerHeight - HEADER_GAP;
    const clampedTarget = Math.max(targetTop, 0);

    // A section near the bottom of the page (or any section when the ones
    // after it are still collapsed) may not have enough content below it
    // for the browser to scroll it flush under the header -- scrollTo()
    // silently clamps to the document's current max scroll instead. Grow
    // a spacer just enough to cover the shortfall. It's never shrunk back:
    // removing it after the scroll settles would make the document too
    // short to hold that scroll position, snapping the page back down.
    const spacer = document.getElementById("scrollSpacer");
    if (spacer) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (clampedTarget > maxScroll) {
        const currentHeight = spacer.getBoundingClientRect().height;
        spacer.style.height = (currentHeight + (clampedTarget - maxScroll) + 4) + "px";
      }
    }

    window.scrollTo({
      top: clampedTarget,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  document.querySelectorAll('.statusbar-nav a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (!section) return;
      e.preventDefault();
      history.pushState(null, "", `#${id}`);

      const toggle = document.getElementById(`${id}Toggle`);
      const collapse = document.getElementById(`${id}Collapse`);
      const wasCollapsed = collapse && collapse.classList.contains("is-collapsed");

      if (toggle && collapse && wasCollapsed) {
        toggle.setAttribute("aria-expanded", "true");
        collapse.classList.remove("is-collapsed");
      }

      if (wasCollapsed) {
        // The document only grows to its full expanded height once the
        // collapse's grid-template-rows transition finishes; scrolling
        // before then gets clamped to the still-short scrollable range.
        let done = false;
        const runOnce = () => {
          if (done) return;
          done = true;
          scrollToSection(section);
        };
        collapse.addEventListener("transitionend", runOnce, { once: true });
        setTimeout(runOnce, 250); // fallback in case transitionend doesn't fire
      } else {
        scrollToSection(section);
      }
    });
  });
}

/* ── System boot entrance ──────────────────────────── */
function bootAnimation() {
  if (prefersReducedMotion || !window.gsap) return;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.from(".statusbar", { y: -14, opacity: 0, duration: 0.4 })
    .from(".hero-kicker, .hero h1, .tagline", { y: 12, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.15")
    .from(".kpi", { y: 14, opacity: 0, duration: 0.4, stagger: 0.07 }, "-=0.2")
    .from(".panel", { y: 18, opacity: 0, duration: 0.45, stagger: 0.1 }, "-=0.2")
    .from(".sys-footer", { opacity: 0, duration: 0.4 }, "-=0.2");
}

renderUnits();
startClock();
countUp();
initFilter();
initTheme();
initCollapsibles();
initNavScroll();
bootAnimation();
