// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — NEWSLETTER.JS
// Formulario de suscripción a CÓDIGO FUENTE
// ==========================================================================

import { AppState, $, toast } from './main.js';

/** Inicializa el formulario de newsletter */
export function initNewsletter() {
  const form = $.id('newsletter-form');
  if (!form) return;

  const emailInput = $.id('newsletter-email');
  const walletInput = $.id('newsletter-wallet');
  const submitBtn = $.id('newsletter-submit');

  // Validación email en tiempo real
  if (emailInput) {
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    emailInput.addEventListener('input', () => clearError(emailInput));
  }

  // Validación wallet opcional
  if (walletInput) {
    walletInput.addEventListener('blur', () => validateWallet(walletInput));
    walletInput.addEventListener('input', () => clearError(walletInput));
  }

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const formData = new FormData(form);
    const data = {
      email: formData.get('email'),
      wallet: formData.get('wallet') || null,
      source: 'web_hero',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    await submitNewsletter(data, form, submitBtn);
  });
}

/** Valida email */
function validateEmail(input) {
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    showError(input, 'El correo es obligatorio');
    return false;
  }

  if (!emailRegex.test(email)) {
    showError(input, 'Formato de correo inválido');
    return false;
  }

  clearError(input);
  return true;
}

/** Valida wallet (opcional) */
function validateWallet(input) {
  const wallet = input.value.trim();
  if (!wallet) { clearError(input); return true; }

  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const btcBech32Regex = /^bc1[a-z0-9]{39,59}$/;

  if (!ethRegex.test(wallet) && !btcRegex.test(wallet) && !btcBech32Regex.test(wallet)) {
    showError(input, 'Dirección inválida (ETH: 0x..., BTC: 1.../3.../bc1...)');
    return false;
  }

  clearError(input);
  return true;
}

/** Valida formulario completo */
function validateForm(form) {
  const emailInput = form.querySelector('#newsletter-email');
  const walletInput = form.querySelector('#newsletter-wallet');

  const emailValid = validateEmail(emailInput);
  const walletValid = walletInput ? validateWallet(walletInput) : true;

  return emailValid && walletValid;
}

/** Muestra error en campo */
function showError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  input.classList.add('field-input--error');

  let errorEl = input.parentNode.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    input.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

/** Limpia error */
function clearError(input) {
  input.removeAttribute('aria-invalid');
  input.classList.remove('field-input--error');
  const errorEl = input.parentNode.querySelector('.field-error');
  if (errorEl) errorEl.remove();
}

/** Envía suscripción */
async function submitNewsletter(data, form, submitBtn) {
  // Loading state
  form.classList.add('loading');
  submitBtn.disabled = true;

  try {
    // Simulación de envío a API (reemplazar con endpoint real)
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success('¡Suscrito a CÓDIGO FUENTE! Revisa tu bandeja para confirmar.');
      form.reset();
      // Track conversion (analytics)
      trackConversion('newsletter_subscribe', { email_hash: hashEmail(data.email) });
    } else {
      throw new Error(result.message || 'Error al suscribirse');
    }
  } catch (error) {
    console.error('[UTC] Newsletter error:', error);

    // Fallback: simular éxito para demo (quitar en producción)
    if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
      await simulateSuccess(form);
      toast.success('¡Suscrito a CÓDIGO FUENTE! (Modo demo - revisa consola)');
      form.reset();
      return;
    }

    toast.error(error.message || 'Error de conexión. Intenta de nuevo.');
  } finally {
    form.classList.remove('loading');
    submitBtn.disabled = false;
  }
}

/** Simula éxito para desarrollo */
function simulateSuccess(form) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('[UTC] Newsletter subscription (demo):', new FormData(form).get('email'));
      resolve();
    }, 800);
  });
}

/** Hash simple para tracking anónimo */
function hashEmail(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/** Tracking de conversiones */
function trackConversion(event, params = {}) {
  if (window.gtag) {
    window.gtag('event', event, params);
  }
  if (window.plausible) {
    window.plausible(event, { props: params });
  }
  console.log('[UTC] Conversion:', event, params);
}

/** Inicialización automática */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletter);
  } else {
    initNewsletter();
  }
}