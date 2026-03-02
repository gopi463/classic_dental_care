// ================================================
//   Classic Dental Care – Main Script
// ================================================

// ----- Navbar scroll behaviour -----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ----- Mobile hamburger menu -----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ----- Smooth active nav link highlighting -----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function setActiveNav() {
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNav);
setActiveNav();

// ----- Fade-up on scroll (IntersectionObserver) -----
const fadeEls = document.querySelectorAll(
  '.service-card, .review-card, .contact-item, .gallery-item, .about-features li, .trust-item'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// ----- Also observe section headings -----
document.querySelectorAll('.section-header').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ----- Sticky call bar: show on scroll -----
const stickyCall = document.getElementById('stickyCall');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    stickyCall.style.display = 'block';
  } else {
    stickyCall.style.display = 'none';
  }
});

// ----- Phone number click tracking (basic analytics hook) -----
const callBtns = document.querySelectorAll('[id*="Call"], [id*="Phone"], .sticky-call-btn');
callBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Can integrate with GA4/GTM here: gtag('event', 'call_click', { ... })
    console.log('📞 Call initiated from:', btn.id || btn.className);
  });
});

// ----- Gallery lightbox (simple) -----
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
      animation: fadeIn 0.2s ease;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.alt = img.alt;
    bigImg.style.cssText = `
      max-width:90vw;max-height:90vh;
      border-radius:12px;
      box-shadow:0 24px 80px rgba(0,0,0,0.8);
      object-fit:contain;
    `;
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });
  });
});

// Add fadeIn keyframe
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`;
document.head.appendChild(style);

// Active nav link style
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-link.active { color: var(--blue-dark) !important; font-weight: 600; }
`;
document.head.appendChild(navStyle);
