const links = Array.from(document.querySelectorAll('.sidenav .nav-link, #sidenav-mobile .nav-link'))
  .filter(a => a.hash && document.querySelector(a.hash));

const sections = links.map(a => document.querySelector(a.hash));
const setActive = (hash) => {
  document.querySelectorAll('.nav-link.active').forEach(el => el.classList.remove('active'));
  document.querySelectorAll(`.nav-link[href="${hash}"]`).forEach(el => el.classList.add('active'));
};

const obs = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting)
                         .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive('#' + visible.target.id);
}, { rootMargin: '-40% 0px -50% 0px', threshold: [0.25, 0.5, 0.75, 1] });

sections.forEach(sec => obs.observe(sec));

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav  = document.getElementById('sidenav-mobile');

links.forEach(a => a.addEventListener('click', e => {
  const target = document.querySelector(a.hash);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.innerWidth <= 900 && mobileNav) {
      mobileNav.hidden = true;
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
}));

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}
