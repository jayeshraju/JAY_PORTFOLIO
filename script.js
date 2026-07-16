/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    bars[1].style.cssText = 'opacity:0';
    bars[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  } else {
    bars.forEach(b => b.style.cssText = '');
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(b => b.style.cssText = '');
  });
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal:not(.visible)') || [])];
    const delay = Math.min(siblings.indexOf(entry.target) * 70, 280);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ===== STAT COUNTERS ===== */
function animateCount(el, target, suffix, isFloat) {
  const start = performance.now();
  const duration = 1400;
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = (isFloat ? (target * ease).toFixed(1) : Math.round(target * ease)) + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = parseFloat(el.dataset.count);
    if (isNaN(raw)) return;
    const suffix = el.dataset.suffix || '';
    animateCount(el, raw, suffix, String(raw).includes('.'));
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => statObserver.observe(el));

/* ===== PROJECT CARD 3D TILT ===== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    card.style.transform = `translateY(-5px) rotateX(${-y/45}deg) rotateY(${x/45}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  card.style.transition = 'transform 0.15s ease, box-shadow 0.25s ease, border-color 0.25s';
});

/* ===== CONTACT FORM ===== */
const form     = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const status   = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-text').textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    // Mailto fallback — opens default mail client
    const mailto = `mailto:jayeshraju9435@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

    // Simulate brief sending state, then open mailto
    await new Promise(r => setTimeout(r, 600));
    window.location.href = mailto;

    status.textContent = '✓ Opening your email client…';
    status.className = 'form-status success';
    form.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('.submit-text').textContent = 'Send Message';

    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 4000);
  });
}

/* ===== RESUME BUTTON — links to Google Drive ===== */
// No fallback needed — href opens Google Drive PDF in a new tab.
