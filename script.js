(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    mobileNav.removeAttribute("hidden");
    function closeMenu() {
      mobileNav.classList.remove("show");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openMenu() {
      mobileNav.classList.add("show");
      toggle.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", () => {
      mobileNav.classList.contains("show") ? closeMenu() : openMenu();
    });
    mobileNav.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", closeMenu)
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add("in"));
  }

  /* ---------- Scroll-spy ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const mLinks = Array.from(document.querySelectorAll(".m-link"));

  function setActive(id) {
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
    mLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
  }
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Projects carousel ---------- */
  const track = document.getElementById("carTrack");
  const prev = document.getElementById("carPrev");
  const next = document.getElementById("carNext");
  const dotsWrap = document.getElementById("carDots");
  if (track && prev && next && dotsWrap) {
    const cards = Array.from(track.children);
    let index = 0;

    // build dots
    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "cdot" + (i === 0 ? " active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to project " + (i + 1));
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.children);

    function update() {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const cardW = cards[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * (cardW + gap)}px)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }
    function go(i) {
      if (i < 0) i = cards.length - 1;
      else if (i > cards.length - 1) i = 0;
      index = i; update();
    }

    prev.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));

    // keyboard (when carousel area focused/hovered)
    document.addEventListener("keydown", (e) => {
      const car = document.getElementById("carousel");
      if (!car) return;
      const r = car.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (!inView) return;
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    // touch swipe
    let startX = 0, dragging = false;
    const carousel = document.getElementById("carousel");
    carousel.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    carousel.addEventListener("touchend", (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { dx < 0 ? go(index + 1) : go(index - 1); }
    }, { passive: true });

    update();
    window.addEventListener("resize", update);
  }
})();