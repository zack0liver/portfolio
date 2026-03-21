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

const spines      = document.querySelectorAll(".spine");
const panelHint   = document.getElementById("panelHint");
const panelContent = document.getElementById("panelContent");

let currentKey   = null;
let isAnimating  = false;

// ── Populate DOM with project data ────────────────────
function populate(key) {
  const p = projects[key];
  panelContent.querySelector(".panel-tag").textContent   = p.tag;
  panelContent.querySelector(".panel-title").textContent = p.title;
  panelContent.querySelector(".panel-desc").textContent  = p.desc;
  panelContent.querySelector(".panel-stack").innerHTML   =
    p.stack.map(s => `<span>${s}</span>`).join("");
  panelContent.querySelector(".panel-link").href = p.url;
}

// ── Main open function ────────────────────────────────
function openProject(spine) {
  const key = spine.dataset.project;
  if (key === currentKey || isAnimating) return;
  isAnimating = true;

  const tl    = gsap.timeline({ onComplete: () => { isAnimating = false; } });
  const items = panelContent.querySelectorAll(".panel-item");

  // ── Spine states ────────────────────────────────────
  spines.forEach(s => {
    if (s.classList.contains("active")) {
      s.classList.remove("active");
      tl.to(s, { x: 0, duration: 0.3, ease: "power3.in" }, 0);
    }
    tl.to(s, { opacity: s === spine ? 1 : 0.5, duration: 0.3 }, 0);
  });

  spine.classList.add("active");

  // Pull spine out with spring
  tl.to(spine, {
    x: 20,
    duration: 0.55,
    ease: "back.out(2.2)"
  }, 0.05);

  // ── Exit old content ─────────────────────────────────
  if (currentKey !== null) {
    tl.to(items, {
      opacity: 0,
      y: -10,
      duration: 0.18,
      stagger: 0.025,
      ease: "power2.in"
    }, 0.1);
  } else {
    // First open: fade out hint
    tl.to(panelHint, { opacity: 0, x: -12, duration: 0.25, ease: "power2.in" }, 0.1);
  }

  // ── Swap content mid-animation ────────────────────────
  tl.add(() => {
    populate(key);
    panelHint.style.display = "none";
    panelContent.style.display = "block";
    // Reset items for entrance
    gsap.set(items, { opacity: 0, y: 14 });
    currentKey = key;
  });

  // ── Panel wipe reveal (clip-path left → right) ────────
  tl.fromTo(panelContent,
    { clipPath: "inset(0 100% 0 0)" },
    { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "expo.inOut" }
  );

  // ── Stagger content items in ──────────────────────────
  tl.to(items, {
    opacity: 1,
    y: 0,
    stagger: 0.08,
    duration: 0.4,
    ease: "power2.out"
  }, "-=0.28");

  // ── Scroll panel into view on mobile ─────────────────
  tl.add(() => {
    if (window.innerWidth <= 640) {
      panelContent.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, "-=0.1");
}

// ── Hover: magnetic y-axis drift ──────────────────────
spines.forEach(spine => {
  spine.addEventListener("mouseenter", () => {
    if (spine.classList.contains("active")) return;
    gsap.to(spine, { x: 8, duration: 0.25, ease: "power2.out" });
  });

  spine.addEventListener("mousemove", e => {
    if (spine.classList.contains("active")) return;
    const rect = spine.getBoundingClientRect();
    const relY = (e.clientY - rect.top - rect.height / 2) * 0.18;
    gsap.to(spine, { y: relY, duration: 0.3, ease: "power2.out" });
  });

  spine.addEventListener("mouseleave", () => {
    if (spine.classList.contains("active")) return;
    gsap.to(spine, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.55)" });
  });

  spine.addEventListener("click", () => openProject(spine));
});
