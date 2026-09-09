// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — STATS-COUNTER.JS
// Contadores animados reutilizables para cualquier sección
// ==========================================================================

import { AppState, animate, $ } from './main.js';

/** Inicializa contadores en elementos con data-count */
export function initStatsCounters(selector = '[data-count]') {
  const counters = $.selAll(selector);
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = el.dataset.duration ? parseInt(el.dataset.duration, 10) : 2000;

        animateCounter(el, target, decimals, prefix, suffix, duration);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(el => observer.observe(el));
}

/** Anima un contador individual */
function animateCounter(el, target, decimals = 0, prefix = '', suffix = '', duration = 2000) {
  if (AppState.prefersReducedMotion) {
    el.textContent = `${prefix}${target.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    return;
  }

  const start = 0;
  const startTime = performance.now();
  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  const tick = (now) => {
    const elapsed = Math.min((now - startTime) / duration, 1);
    const progress = easeOutExpo(elapsed);
    const current = start + (target - start) * progress;
    const formatted = current.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    el.textContent = `${prefix}${formatted}${suffix}`;
    if (elapsed < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Contador con formato específico (K, M, B) */
export function initCompactCounters(selector = '[data-count-compact]') {
  const counters = $.selAll(selector);
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.countCompact);
        animateCompactCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

/** Anima contador con notación compacta (1.2K, 3.5M, etc.) */
function animateCompactCounter(el, target) {
  if (AppState.prefersReducedMotion) {
    el.textContent = formatCompact(target);
    return;
  }

  const start = 0;
  const startTime = performance.now();
  const duration = 2000;
  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  const tick = (now) => {
    const elapsed = Math.min((now - startTime) / duration, 1);
    const progress = easeOutExpo(elapsed);
    const current = start + (target - start) * progress;
    el.textContent = formatCompact(current);
    if (elapsed < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Formato compacto: 1.2K, 3.5M, 1.2B */
function formatCompact(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace('.0', '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace('.0', '') + 'K';
  return num.toLocaleString('es-CO');
}

/** Contador de tiempo (cuenta regresiva o transcurrida) */
export function initTimeCounter(selector = '[data-time-target]') {
  const counters = $.selAll(selector);
  counters.forEach(el => {
    const targetDate = new Date(el.dataset.timeTarget).getTime();
    const isCountdown = el.dataset.countdown !== 'false';

    const update = () => {
      const now = Date.now();
      const diff = isCountdown ? targetDate - now : now - targetDate;
      if (diff <= 0 && isCountdown) {
        el.textContent = '¡COMPLETADO!';
        return;
      }
      el.textContent = formatDuration(Math.abs(diff));
    };

    update();
    const interval = setInterval(update, 1000);

    // Cleanup
    el._timeInterval = interval;
    window.addEventListener('beforeunload', () => clearInterval(interval), { once: true });
  });
}

/** Formatea duración en formato legible */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/** Exporta utilidad para uso manual */
export function animateCount(el, target, options = {}) {
  const {
    decimals = 0,
    prefix = '',
    suffix = '',
    duration = 2000,
    easing = 'easeOutExpo'
  } = options;
  animateCounter(el, target, decimals, prefix, suffix, duration);
}

/** Auto-init para contadores globales */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStatsCounters();
      initCompactCounters();
      initTimeCounter();
    });
  } else {
    initStatsCounters();
    initCompactCounters();
    initTimeCounter();
  }
}