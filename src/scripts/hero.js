// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — HERO.JS
// Animaciones del hero: contador, parallax, partículas
// ==========================================================================

import { AppState, animate, $ } from './main.js';

/** Inicializa el hero */
export function initHero() {
  const hero = $.sel('.hero');
  if (!hero) return;

  // Contadores animados
  initStatCounters();

  // Parallax sutil en hero-glow
  initParallax();

  // Partículas flotantes (CSS-based, solo init si no reduced motion)
  if (!AppState.prefersReducedMotion) {
    initParticles();
  }

  // Scroll indicator click
  const scrollIndicator = $.sel('.hero-scroll');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/** Animación de contadores en hero-stats */
function initStatCounters() {
  const statValues = $.selAll('.stat-value[data-count]');
  if (statValues.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animate.counter(el, target, 2500, 'easeOutExpo');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px' });

  statValues.forEach(el => observer.observe(el));
}

/** Parallax sutil en hero-glow elements */
function initParallax() {
  if (AppState.prefersReducedMotion) return;

  const glows = $.selAll('.hero-glow');
  if (glows.length === 0) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = $.sel('.hero')?.offsetHeight || 0;
        const progress = Math.min(scrollY / heroHeight, 1);

        glows.forEach((glow, i) => {
          const speed = 0.3 + i * 0.1;
          const yOffset = scrollY * speed * 0.5;
          const scale = 1 + progress * 0.2;
          glow.style.transform = `translate(-50%, -50%) translateY(${yOffset}px) scale(${scale})`;
        });
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup en unload
  window.addEventListener('beforeunload', () => window.removeEventListener('scroll', handleScroll), { once: true });
}

/** Partículas flotantes adicionales (canvas-based para performance) */
function initParticles() {
  const canvas = $.create('canvas', {
    class: 'hero-particles',
    aria-hidden: 'true',
    width: window.innerWidth,
    height: window.innerHeight
  });
  const hero = $.sel('.hero');
  if (hero) hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
  const colors = ['rgba(139, 58, 255, 0.4)', 'rgba(0, 212, 122, 0.3)', 'rgba(0, 240, 255, 0.25)'];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 1000 + 500;
      this.age = 0;
    }
    update(delta) {
      this.x += this.speedX * delta;
      this.y += this.speedY * delta;
      this.age += delta;
      this.opacity = Math.max(0, this.opacity * (1 - this.age / this.life));
      if (this.age > this.life || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('0.4', this.opacity.toFixed(2)).replace('0.3', this.opacity.toFixed(2)).replace('0.25', this.opacity.toFixed(2));
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let lastTime = performance.now();
  function animateParticles(time) {
    const delta = time - lastTime;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(delta);
      p.draw();
    });

    requestAnimationFrame(animateParticles);
  }

  requestAnimationFrame(animateParticles);

  // Resize handler
  const resizeHandler = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeHandler, { passive: true });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', resizeHandler);
  }, { once: true });
}

/** Inicialización automática */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
}