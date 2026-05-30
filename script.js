// Navbar scroll effect + active nav highlighting (single throttled handler)
const navbar = document.getElementById('navbar');
const sections = [...document.querySelectorAll('section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];

// Cache section offsets so we don't force layout on every scroll frame.
let sectionTops = [];
function measureSections() {
  sectionTops = sections.map(s => ({ id: s.id, top: s.offsetTop - 120 }));
}
measureSections();
window.addEventListener('resize', measureSections, { passive: true });
window.addEventListener('load', measureSections);

let activeId = '';
let scrollTicking = false;
function onScroll() {
  scrollTicking = false;
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);

  let current = '';
  for (const s of sectionTops) {
    if (y >= s.top) current = s.id;
  }
  if (current !== activeId) {
    activeId = current;
    navItems.forEach(a => {
      a.style.fontWeight = a.getAttribute('href') === `#${current}` ? '700' : '';
    });
  }
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .why-card, .step, .testimonial-card, .contact-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  observer.observe(el);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value;
  const waText = encodeURIComponent(`Hi, I'm ${name} and I'm interested in ${service || 'insurance'}. ${message}`);
  window.open(`https://wa.me/14167162915?text=${waText}`, '_blank');
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', !isOpen);
  });
});
