// anul din footer
document.getElementById('year').textContent = new Date().getFullYear();

// scroll-spy pentru linkurile din sidebar
const links = Array.from(document.querySelectorAll('.sidenav .nav-link, #sidenav-mobile .nav-link'))
  .filter(a => a.hash && document.querySelector(a.hash));

const sections = links.map(a => document.querySelector(a.hash));
const setActive = (hash) => {
  document.querySelectorAll('.nav-link.active').forEach(el => el.classList.remove('active'));
  document.querySelectorAll(`.nav-link[href="${hash}"]`).forEach(el => el.classList.add('active'));
};

const obs = new IntersectionObserver((entries) => {
  // cea mai vizibilă secțiune primește activ
  const visible = entries.filter(e => e.isIntersecting)
                         .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive('#' + visible.target.id);
}, { rootMargin: '-40% 0px -50% 0px', threshold: [0.25, 0.5, 0.75, 1] });

sections.forEach(sec => obs.observe(sec));

// smooth scroll pentru mobile nav (fallback în unele browsere)
links.forEach(a => a.addEventListener('click', e => {
  const target = document.querySelector(a.hash);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // închide meniul mobil dacă e deschis
    if (window.innerWidth <= 900) {
      mobileNav.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
}));

// meniu mobil
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('sidenav-mobile');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}
