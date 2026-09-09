// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — NAVBAR.JS
// Navbar responsive, scroll spy, active link highlighting, theme toggle
// ==========================================================================

import { AppState, $ } from './main.js';

/** Inicializa theme toggle */
function initThemeToggle() {
  const themeToggle = $.id('theme-toggle');
  if (!themeToggle) return;

  // Obtener tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem('utc-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Aplicar tema inicial
  document.documentElement.setAttribute('data-theme', initialTheme);
  AppState.theme = initialTheme;
  updateThemeIcons(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('utc-theme', newTheme);
    AppState.theme = newTheme;
    updateThemeIcons(newTheme);

    // Anuncio para lectores de pantalla
    announceThemeChange(newTheme);
  });

  // Escuchar cambios en preferencia del sistema (solo si no hay preferencia guardada)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('utc-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      AppState.theme = newTheme;
      updateThemeIcons(newTheme);
    }
  });
}

function updateThemeIcons(theme) {
  const themeToggle = $.id('theme-toggle');
  if (!themeToggle) return;

  const sunIcon = themeToggle.querySelector('.theme-icon-sun');
  const moonIcon = themeToggle.querySelector('.theme-icon-moon');

  if (theme === 'dark') {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
    themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
  } else {
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
    themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
  }
}

function announceThemeChange(theme) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = theme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado';
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/** Inicializa navbar */
export function initNavbar() {
  const navbar = $.sel('.navbar');
  const menuToggle = $.sel('.navbar-toggle');
  const menu = $.id('navbar-menu');
  const navLinks = $.selAll('.nav-link:not(.theme-toggle)');

  if (!navbar) return;

  // Inicializar theme toggle
  initThemeToggle();

  // Scroll effect
  let lastScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    AppState.scrollY = scrollY;

    // Scrolled class
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Hide on scroll down, show on scroll up (opcional)
    if (scrollY > lastScrollY && scrollY > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      menu.classList.toggle('active');
      AppState.isMobileMenuOpen = !isOpen;

      // Prevent body scroll when menu open
      document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
      document.body.style.paddingRight = AppState.isMobileMenuOpen ? `${getScrollbarWidth()}px` : '';
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && AppState.isMobileMenuOpen) {
        closeMobileMenu();
      }
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (AppState.isMobileMenuOpen) closeMobileMenu();
      });
    });

    // Close on overlay click (fuera del menú)
    document.addEventListener('click', (e) => {
      if (AppState.isMobileMenuOpen &&
          !menu.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    if (menuToggle && menu) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      AppState.isMobileMenuOpen = false;
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  // Scroll spy - active link highlighting
  const sections = Array.from(navLinks)
    .map(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) return null; // Páginas externas
      const id = href?.slice(1);
      return id ? { id, link, element: $.id(id) } : null;
    })
    .filter(Boolean);

  if (sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = sections.find(s => s.element === entry.target);
        if (section) {
          section.link.classList.toggle('active', entry.isIntersecting);
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(s => s.element && observer.observe(s.element));
  }

  // Keyboard navigation para nav-links
  const allNavLinks = $.selAll('.nav-link');
  allNavLinks.forEach((link, i, links) => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        links[(i + 1) % links.length].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        links[(i - 1 + links.length) % links.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        links[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        links[links.length - 1].focus();
      }
    });
  });

  // Smooth scroll para enlaces internos de la misma página
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = $.id(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: AppState.prefersReducedMotion ? 'auto' : 'smooth'
        });

        target.focus({ preventScroll: true });
        target.setAttribute('tabindex', '-1');
      }
    });
  });

  // Scrollbar width utility
  function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.width = '100px';
    outer.style.height = '100px';
    document.body.appendChild(outer);
    const width = outer.offsetWidth - outer.clientWidth;
    outer.remove();
    return width;
  }

  // Cleanup
  window.addEventListener('beforeunload', () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, { once: true });
}

/** Auto-init */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
}