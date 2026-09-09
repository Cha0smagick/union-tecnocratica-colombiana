// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — MAIN.JS
// Inicialización global, utilidades, estado compartido
// ==========================================================================

/** Estado global de la aplicación */
export const AppState = {
  isLoaded: false,
  isMobileMenuOpen: false,
  scrollY: 0,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  theme: 'dark', // Solo dark mode para UTC
  language: 'es-CO'
};

/** Utilidades DOM */
export const $ = {
  id: (id) => document.getElementById(id),
  sel: (selector, context = document) => context.querySelector(selector),
  selAll: (selector, context = document) => [...context.querySelectorAll(selector)],
  create: (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (key === 'dataset') {
        Object.entries(val).forEach(([k, v]) => el.dataset[k] = v);
      } else {
        el.setAttribute(key, val);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child instanceof Node) el.appendChild(child);
    });
    return el;
  },
  on: (el, event, handler, options) => el.addEventListener(event, handler, options),
  off: (el, event, handler) => el.removeEventListener(event, handler),
  delegate: (parent, selector, event, handler) => {
    parent.addEventListener(event, e => {
      const target = e.target.closest(selector);
      if (target) handler.call(target, e);
    });
  }
};

/** Utilidades de animación */
export const animate = {
  counter: (el, target, duration = 2000, easing = 'easeOutExpo') => {
    if (AppState.prefersReducedMotion) {
      el.textContent = target.toLocaleString('es-CO');
      return Promise.resolve();
    }
    const start = 0;
    const startTime = performance.now();
    const easeFns = {
      easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      easeOutQuart: t => 1 - Math.pow(1 - t, 4),
      easeOutCirc: t => Math.sqrt(1 - Math.pow(t - 1, 2))
    };
    const ease = easeFns[easing] || easeFns.easeOutExpo;

    return new Promise(resolve => {
      const tick = (now) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        const progress = ease(elapsed);
        const current = Math.floor(start + (target - start) * progress);
        el.textContent = current.toLocaleString('es-CO');
        if (elapsed < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  },

  fadeIn: (el, duration = 300) => {
    if (AppState.prefersReducedMotion) { el.style.opacity = '1'; return Promise.resolve(); }
    el.style.opacity = '0';
    el.style.display = '';
    return new Promise(resolve => {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-out' }).onfinish = resolve;
    });
  },

  slideUp: (el, duration = 400) => {
    if (AppState.prefersReducedMotion) { el.style.opacity = '1'; el.style.transform = 'none'; return Promise.resolve(); }
    return new Promise(resolve => {
      el.animate([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration, easing: 'ease-out' }).onfinish = resolve;
    });
  },

  stagger: (elements, baseDelay = 100, animationFn) => {
    return Promise.all(elements.map((el, i) => {
      return new Promise(r => setTimeout(() => animationFn(el).then(r), i * baseDelay));
    }));
  }
};

/** Intersection Observer para animaciones on-scroll */
export const scrollReveal = (() => {
  if (AppState.prefersReducedMotion) {
    return { observe: () => {}, unobserve: () => {} };
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  return {
    observe: (el) => observer.observe(el),
    unobserve: (el) => observer.unobserve(el),
    init: () => {
      document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    }
  };
})();

/** Toast notifications */
export const toast = {
  container: null,

  init() {
    this.container = $.id('toast-container');
    if (!this.container) {
      this.container = $.create('div', { class: 'toast-container', id: 'toast-container' });
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 5000) {
    if (!this.container) this.init();

    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toastEl = $.create('div', {
      class: `toast ${type}`,
      role: 'alert',
      aria-live: 'polite'
    }, [
      $.create('div', { class: 'toast-icon', innerHTML: icons[type] }),
      $.create('div', { class: 'toast-message', textContent: message }),
      $.create('button', { class: 'toast-close', 'aria-label': 'Cerrar', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' }, [])
    ]);

    this.container.appendChild(toastEl);

    // Auto-remove
    const timeoutId = setTimeout(() => this.remove(toastEl), duration);

    // Manual close
    toastEl.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timeoutId);
      this.remove(toastEl);
    });

    return toastEl;
  },

  remove(toastEl) {
    toastEl.style.animation = 'fade-out 200ms ease-in forwards';
    setTimeout(() => toastEl.remove(), 200);
  },

  success(msg, dur) { return this.show(msg, 'success', dur); },
  error(msg, dur) { return this.show(msg, 'error', dur); },
  warning(msg, dur) { return this.show(msg, 'warning', dur); },
  info(msg, dur) { return this.show(msg, 'info', dur); }
};

/** Modal manager */
export const modal = {
  overlay: null,
  currentModal: null,

  init() {
    this.overlay = $.id('modal-overlay');
    if (!this.overlay) {
      this.overlay = $.create('div', { class: 'modal-overlay', id: 'modal-overlay' });
      document.body.appendChild(this.overlay);
    }
  },

  open(content, options = {}) {
    if (!this.overlay) this.init();

    const modalEl = $.create('div', {
      class: 'modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': options.titleId || 'modal-title'
    }, [
      $.create('header', { class: 'modal-header' }, [
        $.create('h2', { class: 'modal-title', id: options.titleId || 'modal-title' }, options.title || ''),
        $.create('button', { class: 'modal-close', 'aria-label': 'Cerrar modal', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' }, [])
      ]),
      $.create('div', { class: 'modal-body' }, typeof content === 'string' ? [] : [content]),
      options.showFooter !== false ? $.create('footer', { class: 'modal-footer' }, [
        $.create('button', { class: 'btn btn-secondary', 'data-modal-close': 'true' }, 'Cancelar'),
        $.create('button', { class: 'btn btn-primary', 'data-modal-confirm': 'true' }, options.confirmText || 'Confirmar')
      ]) : null
    ].filter(Boolean));

    // Set body content if string
    if (typeof content === 'string') {
      modalEl.querySelector('.modal-body').innerHTML = content;
    }

    this.overlay.appendChild(modalEl);
    this.currentModal = modalEl;

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('active');
      modalEl.classList.add('active');
    });

    // Focus trap
    const focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    firstFocusable?.focus();

    const trapFocus = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    modalEl.addEventListener('keydown', trapFocus);
    this.overlay.addEventListener('click', this.handleOverlayClick.bind(this));
    modalEl.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', () => this.close()));
    modalEl.querySelectorAll('[data-modal-confirm]').forEach(btn => btn.addEventListener('click', () => {
      options.onConfirm?.();
      this.close();
    }));

    return new Promise(resolve => {
      modalEl.dataset.resolve = 'pending';
      modalEl._resolve = resolve;
    });
  },

  handleOverlayClick(e) {
    if (e.target === this.overlay) this.close();
  },

  close() {
    if (!this.currentModal) return;

    this.overlay.classList.remove('active');
    this.currentModal.classList.remove('active');

    setTimeout(() => {
      this.currentModal.remove();
      this.currentModal = null;
    }, 300);
  },

  confirm(message, options = {}) {
    return this.open(message, {
      title: options.title || 'Confirmar',
      confirmText: options.confirmText || 'Confirmar',
      onConfirm: options.onConfirm
    });
  }
};

/** Inicialización global */
export function initApp() {
  if (AppState.isLoaded) return;

  // Inicializar utilidades
  toast.init();
  modal.init();
  scrollReveal.init();

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: AppState.prefersReducedMotion ? 'auto' : 'smooth' });
        target.focus({ preventScroll: true });
      }
    });
  });

  // Navbar scroll effect
  const navbar = $.sel('.navbar');
  if (navbar) {
    const handleScroll = () => {
      AppState.scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Mobile menu toggle
  const menuToggle = $.sel('.navbar-toggle');
  const menu = $.id('navbar-menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      menu.classList.toggle('active');
      AppState.isMobileMenuOpen = !isOpen;
      document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (AppState.isMobileMenuOpen) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('active');
          AppState.isMobileMenuOpen = false;
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Mark loaded
  AppState.isLoaded = true;
  document.documentElement.classList.add('app-loaded');

  console.log('[UTC] Sistema operativo inicializado. Versión 1.0 Genesis Block.');
}

// Auto-init si no está en módulo
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else if (typeof window !== 'undefined') {
  initApp();
}