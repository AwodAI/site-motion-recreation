const revealElements = [...document.querySelectorAll(".reveal")];
const staggerGroups = [...document.querySelectorAll("[data-stagger]")];
const faqItems = [...document.querySelectorAll(".faq-item")];
const carouselRoot = document.querySelector("[data-carousel]");

document.body.classList.add("is-ready");

staggerGroups.forEach((group) => {
  const step = Number(group.dataset.stagger || 100);
  [...group.querySelectorAll(".reveal")].forEach((item, index) => {
    item.style.setProperty("--delay", `${index * step}ms`);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

function openFaq(item) {
  const content = item.querySelector(".faq-item__content");
  const trigger = item.querySelector(".faq-item__trigger");
  item.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
  content.style.height = `${content.scrollHeight}px`;
}

function closeFaq(item) {
  const content = item.querySelector(".faq-item__content");
  const trigger = item.querySelector(".faq-item__trigger");
  item.classList.remove("is-open");
  trigger.setAttribute("aria-expanded", "false");
  content.style.height = "0px";
}

faqItems.forEach((item) => {
  const trigger = item.querySelector(".faq-item__trigger");
  const content = item.querySelector(".faq-item__content");

  if (item.classList.contains("is-open")) {
    content.style.height = `${content.scrollHeight}px`;
  }

  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    faqItems.forEach((other) => {
      if (other !== item) {
        closeFaq(other);
      }
    });
    if (isOpen) {
      closeFaq(item);
      return;
    }
    openFaq(item);
  });
});

window.addEventListener("resize", () => {
  faqItems.forEach((item) => {
    if (!item.classList.contains("is-open")) {
      return;
    }
    const content = item.querySelector(".faq-item__content");
    content.style.height = `${content.scrollHeight}px`;
  });
});

if (carouselRoot) {
  const cards = [...carouselRoot.querySelectorAll(".case-card")];
  const prevButton = carouselRoot.querySelector(".carousel__control--prev");
  const nextButton = carouselRoot.querySelector(".carousel__control--next");
  let activeIndex = 0;
  let autoplayHandle;

  function normalizeOffset(offset, length) {
    const half = Math.floor(length / 2);
    if (offset > half) {
      return offset - length;
    }
    if (offset < -half) {
      return offset + length;
    }
    return offset;
  }

  function renderCarousel() {
    cards.forEach((card, index) => {
      const offset = normalizeOffset(index - activeIndex, cards.length);
      const abs = Math.abs(offset);
      const translateX = offset * 72;
      const scale = offset === 0 ? 1 : abs === 1 ? 0.82 : 0.68;
      const opacity = offset === 0 ? 1 : abs === 1 ? 0.42 : 0.14;
      const blur = offset === 0 ? 0 : abs === 1 ? 1.5 : 2.5;

      card.style.transform = `translateX(calc(-50% + ${translateX}%)) scale(${scale})`;
      card.style.opacity = `${opacity}`;
      card.style.filter = `blur(${blur}px)`;
      card.style.zIndex = `${100 - abs}`;
      card.style.pointerEvents = offset === 0 ? "auto" : "none";
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });
  }

  function goTo(index) {
    activeIndex = (index + cards.length) % cards.length;
    renderCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayHandle = window.setInterval(() => {
      goTo(activeIndex + 1);
    }, 3200);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayHandle);
  }

  prevButton.addEventListener("click", () => {
    goTo(activeIndex - 1);
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    goTo(activeIndex + 1);
    startAutoplay();
  });

  carouselRoot.addEventListener("mouseenter", stopAutoplay);
  carouselRoot.addEventListener("mouseleave", startAutoplay);
  carouselRoot.addEventListener("focusin", stopAutoplay);
  carouselRoot.addEventListener("focusout", startAutoplay);

  renderCarousel();
  startAutoplay();
}
