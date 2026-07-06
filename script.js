const projects = {
  clt: {
    tag: "Community",
    title: "Charlotte Startup Index",
    desc: "A searchable directory for discovering startups in the Charlotte area. Filter by industry, stage, and more.",
    stack: ["JavaScript", "Google Sheets", "HTML/CSS"],
    url: "https://cltstartups.com/"
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
  }
};

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Innovation Unit bed board ─────────────────────── */
function renderUnits() {
  const board = document.getElementById("unitBoard");
  if (!board) return;

  const cards = Object.values(projects).map((p, i) => {
    const bed = String(i + 1).padStart(2, "0");
    const stack = p.stack.map(s => `<span>${s}</span>`).join("");
    return `
      <article class="unit-card">
        <div class="unit-top">
          <span class="bed-num">BED ${bed}</span>
          <span class="pill pill--ok"><span class="pill-dot" aria-hidden="true"></span>LIVE</span>
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
    const format = v => String(v).padStart(padLen, "0");

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

      if (status) status.textContent = `Showing ${shown} of ${items.length} records`;
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
bootAnimation();
