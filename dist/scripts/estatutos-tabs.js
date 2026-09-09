// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — ESTATUTOS-TABS.JS
// Navegación por tabs entre Estatutos, Reglamento y Acta
// ==========================================================================

import { $ } from './main.js';

/** Inicializa tabs de documentos fundacionales */
export function initEstatutosTabs() {
  const tabs = $.selAll('.doc-tab');
  const panels = $.selAll('.doc-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.dataset.panel;

      // Actualizar tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Actualizar paneles
      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      const activePanel = $.id(`panel-${targetPanel}`);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.hidden = false;
        // Scroll suave al panel
        activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Analytics
      trackTabChange(targetPanel);
    });

    // Navegación por teclado
    tab.addEventListener('keydown', (e) => {
      const index = Array.from(tabs).indexOf(tab);
      let newIndex = index;

      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabs.length - 1;
      else return;

      e.preventDefault();
      tabs[newIndex].focus();
      tabs[newIndex].click();
    });
  });

  // Deep linking: si hay hash en URL, activar tab correspondiente
  const hash = window.location.hash.slice(1);
  const validPanels = ['estatutos', 'reglamento', 'acta'];
  if (hash && validPanels.includes(hash)) {
    const targetTab = $.sel(`.doc-tab[data-panel="${hash}"]`);
    if (targetTab) targetTab.click();
  }

  // Actualizar hash al cambiar tab (sin recargar)
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    updateTabFromHash();
  };
  window.addEventListener('popstate', updateTabFromHash);

  function updateTabFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash && validPanels.includes(hash)) {
      const targetTab = $.sel(`.doc-tab[data-panel="${hash}"]`);
      if (targetTab && !targetTab.classList.contains('active')) {
        targetTab.click();
      }
    }
  }
}

/** Tracking de cambio de tab */
function trackTabChange(panel) {
  if (window.gtag) {
    window.gtag('event', 'doc_tab_change', { panel });
  }
  if (window.plausible) {
    window.plausible('doc_tab_change', { props: { panel } });
  }
  console.log('[UTC] Doc tab changed:', panel);
}

/** Auto-init */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEstatutosTabs);
  } else {
    initEstatutosTabs();
  }
}