// ================================================
//   Classic Dental Care – Main Script (Animated)
// ================================================

/* ---- Preloader ---- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 1300);
  }
});

/* ---- Scroll Progress Bar ---- */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}, { passive: true });

/* ---- Navbar scroll behaviour ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // animate span bars to X
  hamburger.classList.toggle('open', isOpen);
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ---- Active nav link highlighting ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function setActiveNav() {
  const scrollY = window.scrollY + 90;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + h) {
      navItems.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${id}"]`);
      if (a) a.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

/* ---- Hero Floating Particles ---- */
function spawnParticle(hero) {
  const p = document.createElement('span');
  p.className = 'hero-particle';
  const size = 4 + Math.random() * 8;
  const dur = 6 + Math.random() * 8;
  const delay = Math.random() * 4;
  const left = 5 + Math.random() * 90;
  const bottom = 5 + Math.random() * 30;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${left}%; bottom:${bottom}%;
    --dur:${dur}s; --delay:${delay}s;
    opacity:0;
  `;
  hero.appendChild(p);
  // auto-remove after animation cycle
  setTimeout(() => p.remove(), (dur + delay) * 1000 + 500);
}

const heroSection = document.querySelector('.hero');
if (heroSection) {
  // initial burst
  for (let i = 0; i < 14; i++) spawnParticle(heroSection);
  // continuous spawn
  setInterval(() => spawnParticle(heroSection), 900);
}

/* ---- Floating decorative teeth in sections ---- */
function addFloatingTeeth(sectionSelector, count = 3) {
  const el = document.querySelector(sectionSelector);
  if (!el) return;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  for (let i = 0; i < count; i++) {
    const t = document.createElement('span');
    t.className = 'tooth-float';
    t.textContent = ['🦷', '✨', '💧'][i % 3];
    const dur = 10 + i * 3;
    t.style.cssText = `
      left:${Math.random() * 85}%;
      top:${10 + Math.random() * 75}%;
      --dur:${dur}s;
      animation-delay:${i * 1.5}s;
      font-size:${1.2 + Math.random()}rem;
    `;
    el.appendChild(t);
  }
}
addFloatingTeeth('.services', 2);
addFloatingTeeth('.about', 2);

/* ---- Intersection Observer – scroll-reveal ---- */
const ioOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, ioOpts);

// fade-up cards (original)
const fadeUpEls = document.querySelectorAll(
  '.service-card, .review-card, .contact-item, .gallery-item, .about-features li, .trust-item'
);
fadeUpEls.forEach(el => { el.classList.add('fade-up'); io.observe(el); });

// section headers
document.querySelectorAll('.section-header').forEach(el => {
  el.classList.add('fade-scale');
  io.observe(el);
});

// about text fade from left, image from right
const aboutText = document.querySelector('.about-text');
const aboutVis = document.querySelector('.about-visual');
if (aboutText) { aboutText.classList.add('fade-left'); io.observe(aboutText); }
if (aboutVis) { aboutVis.classList.add('fade-right'); io.observe(aboutVis); }

// contact info fade from left, map from right
const ctInfo = document.querySelector('.contact-info');
const ctMap = document.querySelector('.contact-map');
if (ctInfo) { ctInfo.classList.add('fade-left'); io.observe(ctInfo); }
if (ctMap) { ctMap.classList.add('fade-right'); io.observe(ctMap); }

/* ---- Animated number counter for trust strip ---- */
function animateCounter(el, to, suffix = '', decimals = 0, duration = 1400) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    const val = eased * to;
    el.textContent = decimals ? val.toFixed(decimals) + suffix : Math.round(val) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = to + suffix;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.dataset.countTo;
    if (!raw) return;
    const to = parseFloat(raw);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.dec || '0');
    el.classList.add('counted');
    animateCounter(el, to, suffix, decimals);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

// Mark trust-value elements for counting
document.querySelectorAll('.trust-value').forEach(el => {
  const text = el.textContent.trim();
  if (text === '4.9★') {
    el.dataset.countTo = '4.9'; el.dataset.suffix = '★'; el.dataset.dec = '1';
    el.textContent = '0★';
  } else if (text === '35+') {
    el.dataset.countTo = '35'; el.dataset.suffix = '+';
    el.textContent = '0+';
  }
  counterObserver.observe(el);
});

/* ---- Sticky call bar ---- */
const stickyCall = document.getElementById('stickyCall');
let stickyVisible = false;
window.addEventListener('scroll', () => {
  const should = window.scrollY > 500;
  if (should !== stickyVisible) {
    stickyVisible = should;
    stickyCall.style.display = should ? 'block' : 'none';
  }
}, { passive: true });

/* ---- Phone click tracking ---- */
document.querySelectorAll('[id*="Call"], [id*="Phone"], .sticky-call-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('📞 Call initiated from:', btn.id || btn.className);
  });
});

/* ---- Gallery lightbox ---- */
const galleryItems = document.querySelectorAll('.gallery-item img');
galleryItems.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;
      animation: fadeIn 0.25s ease;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.alt = img.alt;
    bigImg.style.cssText = `
      max-width:90vw;max-height:90vh;
      border-radius:12px;
      box-shadow:0 24px 80px rgba(0,0,0,0.8);
      object-fit:contain;
      animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    `;
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });
  });
});

/* ---- Inject global keyframes (lightbox, etc) ---- */
const injectStyles = document.createElement('style');
injectStyles.textContent = `
  @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn { from { transform:scale(0.7) } to { transform:scale(1) } }
  .nav-link.active   { color: var(--blue-dark) !important; font-weight: 600; }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .hamburger span { transition: all 0.3s ease; }
`;
document.head.appendChild(injectStyles);

/* ---- Tilt effect on service cards (subtle 3-D) ---- */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s ease';
  });
});

/* ---- Cursor sparkle effect (desktop) ---- */
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    if (Math.random() > 0.92) {
      const dot = document.createElement('span');
      dot.style.cssText = `
        position:fixed; left:${e.clientX}px; top:${e.clientY}px;
        width:6px; height:6px; border-radius:50%;
        background:rgba(168,216,234,0.7);
        pointer-events:none; z-index:99998;
        transform:translate(-50%,-50%);
        animation: sparkle 0.6s ease forwards;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 600);
    }
  });
  const sparkleStyle = document.createElement('style');
  sparkleStyle.textContent = `
    @keyframes sparkle {
      0%   { transform:translate(-50%,-50%) scale(1); opacity:0.8; }
      100% { transform:translate(-50%,-50%) scale(0); opacity:0; }
    }
  `;
  document.head.appendChild(sparkleStyle);
}
