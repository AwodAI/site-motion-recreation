document.querySelectorAll(".reveal[data-delay]").forEach((element) => {
  element.style.setProperty("--delay", `${element.dataset.delay}ms`);
});

function formatCount(value, decimals, prefix, suffix) {
  const text = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return `${prefix}${text}${suffix}`;
}

function animateCount(root) {
  const nodes = root.querySelectorAll ? root.querySelectorAll("[data-count]") : [];

  nodes.forEach((node) => {
    if (node.dataset.counted === "true") return;

    node.dataset.counted = "true";

    const target = Number(node.dataset.count);
    if (Number.isNaN(target)) return;

    const decimals = String(node.dataset.count).includes(".") ? 1 : 0;
    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      node.textContent = formatCount(value, decimals, prefix, suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.textContent = formatCount(target, decimals, prefix, suffix);
      }
    };

    requestAnimationFrame(step);
  });
}

function initReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -6% 0px",
  });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function initHeader() {
  const header = document.getElementById("siteHeader");
  const menu = document.getElementById("siteMenu");
  const toggle = document.getElementById("menuToggle");
  if (!header || !menu || !toggle) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 36);
  }, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    setOpen(!isOpen);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (menu.contains(target) || toggle.contains(target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

function initHeroParticles() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const hero = canvas.closest(".hero");

  const context = canvas.getContext("2d");
  if (!context) return;

  const stars = [];
  const ribbon = [];
  let width = 0;
  let height = 0;
  let animationId = 0;
  let lastFrame = 0;
  let waveGradient = null;
  let isVisible = true;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildScene() {
    stars.length = 0;
    ribbon.length = 0;

    const starCount = Math.max(32, Math.min(56, Math.round(width / 30)));
    const ribbonCount = Math.max(52, Math.min(96, Math.round(width / 18)));

    for (let index = 0; index < starCount; index += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.5 + 0.08,
        drift: (Math.random() - 0.5) * 0.05,
      });
    }

    for (let index = 0; index < ribbonCount; index += 1) {
      ribbon.push({
        x: Math.random() * width,
        offset: (Math.random() - 0.5) * height * 0.18,
        size: Math.random() * 2.8 + 0.9,
        alpha: Math.random() * 0.24 + 0.05,
        speed: Math.random() * 0.22 + 0.06,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    waveGradient = context.createLinearGradient(0, height * 0.42, 0, height * 0.82);
    waveGradient.addColorStop(0, "rgba(255,255,255,0)");
    waveGradient.addColorStop(0.45, "rgba(255,255,255,0.025)");
    waveGradient.addColorStop(1, "rgba(255,255,255,0)");
    buildScene();
    drawFrame(performance.now());
  }

  function drawFrame(now) {
    const time = now * 0.0012;
    context.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.y += star.drift;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      context.fillStyle = `rgba(255,255,255,${star.alpha})`;
      context.fillRect(star.x, star.y, star.size, star.size);
    }

    context.fillStyle = waveGradient || "rgba(255,255,255,0.03)";
    for (let x = -24; x <= width + 24; x += 20) {
      const y = height * 0.58 + Math.sin(x * 0.008 + time) * height * 0.055;
      context.fillRect(x, y, 10, 1.2);
    }

    for (const particle of ribbon) {
      particle.x += particle.speed;
      if (particle.x > width + 30) particle.x = -30;

      const y = height * 0.58
        + Math.sin(particle.x * 0.008 + time + particle.phase) * height * 0.055
        + particle.offset;

      context.beginPath();
      context.fillStyle = `rgba(255,255,255,${particle.alpha})`;
      context.arc(particle.x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  function tick(now) {
    if (!isVisible || document.hidden) {
      animationId = 0;
      return;
    }

    if (now - lastFrame >= 33) {
      lastFrame = now;
      drawFrame(now);
    }

    animationId = requestAnimationFrame(tick);
  }

  function start() {
    if (prefersReducedMotion || animationId) return;
    animationId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!animationId) return;
    cancelAnimationFrame(animationId);
    animationId = 0;
  }

  resize();
  if (!prefersReducedMotion) start();
  window.addEventListener("resize", resize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  if (hero && !prefersReducedMotion) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = Boolean(entries[0]?.isIntersecting);
      if (isVisible) {
        start();
      } else {
        stop();
      }
    }, {
      threshold: 0.02,
    });

    visibilityObserver.observe(hero);
  }
}

function initHeroMetrics() {
  const heroStats = document.querySelector(".hero__stats");
  if (!heroStats) return;

  window.setTimeout(() => {
    animateCount(heroStats);
  }, 900);
}

function initServiceRibbon() {
  const buttons = [...document.querySelectorAll(".service-pill")];
  const note = document.getElementById("serviceNote");
  if (buttons.length === 0 || !note) return;

  const copy = [
    "Teach the stack to respond before bottlenecks appear.",
    "Design, optimize, scale, and secure.",
    "Protect every service with adaptive policy layers.",
    "Design, optimize, scale, and secure.",
  ];

  const activeIndex = buttons.findIndex((button) => button.classList.contains("active"));
  note.textContent = copy[Math.max(activeIndex, 0)];

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      buttons.forEach((current) => current.classList.remove("active"));
      button.classList.add("active");
      note.textContent = copy[index];
    });
  });
}

function initProcess() {
  const steps = [...document.querySelectorAll("[data-process-step]")];
  const visuals = [...document.querySelectorAll("[data-process-visual]")];
  const dots = [...document.querySelectorAll(".process-dot")];
  const prev = document.getElementById("processPrev");
  const next = document.getElementById("processNext");
  if (steps.length === 0 || visuals.length === 0) return;

  let current = 0;
  let timer = 0;

  const show = (index) => {
    current = (index + steps.length) % steps.length;

    steps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === current);
    });

    visuals.forEach((visual, visualIndex) => {
      visual.classList.toggle("active", visualIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(current + 1), 5200);
  };

  prev?.addEventListener("click", () => {
    show(current - 1);
    restart();
  });

  next?.addEventListener("click", () => {
    show(current + 1);
    restart();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      restart();
    });
  });

  show(0);
  restart();
}

function initPricing() {
  const section = document.querySelector(".pricing");
  const toggle = document.getElementById("pricingToggle");
  if (!section || !toggle) return;

  const headerLabels = [...toggle.querySelectorAll(".pricing-toggle__label")];
  const rowModes = [...section.querySelectorAll(".pricing-mode")];
  const priceNodes = [...section.querySelectorAll(".pricing-value")];
  const saveNodes = [...section.querySelectorAll(".pricing-save")];
  let yearly = false;

  const render = () => {
    section.classList.toggle("is-yearly", yearly);
    toggle.setAttribute("aria-pressed", yearly ? "true" : "false");

    headerLabels[0]?.classList.toggle("pricing-toggle__label--active", !yearly);
    headerLabels[1]?.classList.toggle("pricing-toggle__label--active", yearly);

    rowModes.forEach((mode) => {
      const labels = mode.querySelectorAll(".pricing-mode__label");
      labels[0]?.classList.toggle("pricing-mode__label--active", !yearly);
      labels[1]?.classList.toggle("pricing-mode__label--active", yearly);
    });

    priceNodes.forEach((node, index) => {
      const monthly = Number(node.dataset.monthly);
      const annual = Number(node.dataset.yearly);
      const nextValue = yearly ? annual : monthly;
      node.textContent = `$${nextValue}`;

      const save = Math.round((1 - annual / monthly) * 100);
      if (saveNodes[index]) {
        saveNodes[index].textContent = yearly
          ? `You save ${save}%`
          : `Switch to yearly and save ${save}%`;
      }
    });
  };

  toggle.addEventListener("click", () => {
    yearly = !yearly;
    render();
  });

  render();
}

function initAccordion() {
  const items = [...document.querySelectorAll(".accordion-item")];
  if (items.length === 0) return;

  const setState = (item, open) => {
    const panel = item.querySelector(".accordion-panel");
    const icon = item.querySelector(".accordion-icon");
    if (!panel || !icon) return;

    item.classList.toggle("active", open);
    panel.style.maxHeight = open ? `${panel.scrollHeight}px` : "0px";
    icon.textContent = open ? "×" : "+";
  };

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("active");

      items.forEach((current) => setState(current, false));
      if (shouldOpen) setState(item, true);
    });
  });

  items.forEach((item) => setState(item, item.classList.contains("active")));
}

function initTeam() {
  const members = [...document.querySelectorAll("[data-member-card]")];
  const portraits = [...document.querySelectorAll("[data-member-portrait]")];
  const dots = [...document.querySelectorAll(".team-dot")];
  const prev = document.getElementById("teamPrev");
  const next = document.getElementById("teamNext");
  if (members.length === 0 || portraits.length === 0) return;

  let current = 0;
  let timer = 0;

  const show = (index) => {
    current = (index + members.length) % members.length;

    members.forEach((member, memberIndex) => {
      member.classList.toggle("active", memberIndex === current);
    });

    portraits.forEach((portrait, portraitIndex) => {
      portrait.classList.toggle("active", portraitIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(current + 1), 4800);
  };

  prev?.addEventListener("click", () => {
    show(current - 1);
    restart();
  });

  next?.addEventListener("click", () => {
    show(current + 1);
    restart();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      restart();
    });
  });

  show(0);
  restart();
}

function initFooterParallax() {
  const wordmark = document.getElementById("footerWordmark");
  if (!wordmark) return;

  const update = () => {
    const rect = wordmark.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.05;
    wordmark.style.transform = `translateY(${Math.max(-20, Math.min(24, offset - 24))}px)`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

function init() {
  initReveals();
  initHeader();
  initHeroParticles();
  initHeroMetrics();
  initServiceRibbon();
  initProcess();
  initPricing();
  initAccordion();
  initTeam();
  initFooterParallax();

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
