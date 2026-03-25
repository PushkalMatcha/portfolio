// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const cursorGlow = document.getElementById('cursorGlow');
const contactForm = document.getElementById('contactForm');

// ===== Cursor Glow Effect =====
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;

  // Update active nav link
  updateActiveLink();
});

// ===== Mobile Nav Toggle =====
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== Active Nav Link on Scroll =====
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 150;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Add reveal class to sections and cards
function initRevealElements() {
  const selectors = [
    '.about-text', '.about-details',
    '.timeline-item', '.project-card',
    '.skill-category', '.edu-card',
    '.contact-info', '.contact-form'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });
}

window.addEventListener('scroll', revealOnScroll);

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = '#c47d3a';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});

// ===== Typing Effect for Terminal =====
function initTypingEffect() {
  const terminalBody = document.querySelector('.terminal-body');
  if (!terminalBody) return;

  const code = terminalBody.querySelector('code');
  const originalHTML = code.innerHTML;

  // Only run on larger screens
  if (window.innerWidth < 768) return;

  code.innerHTML = '';
  code.style.visibility = 'visible';

  let i = 0;
  const plainText = originalHTML;

  // Simple approach: reveal the content character by character via opacity
  code.innerHTML = originalHTML;
  code.style.opacity = '0';

  setTimeout(() => {
    code.style.transition = 'opacity 0.8s ease';
    code.style.opacity = '1';
  }, 600);
}

// ===== API Counter =====
function fetchCount() {
  const countEl = document.getElementById('count');
  if (!countEl) return;

  fetch('https://kcabifhpy7.execute-api.ap-south-1.amazonaws.com')
    .then((res) => res.json())
    .then((data) => {
      const value = Number(data);
      if (!Number.isFinite(value)) return;

      countEl.setAttribute('data-count', String(value));
      countEl.innerText = String(value);
    })
    .catch((err) => {
      console.error('Failed to fetch count:', err);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  fetchCount();
  initRevealElements();
  revealOnScroll();
  animateCounters();
  initTypingEffect();
  updateActiveLink();
});
