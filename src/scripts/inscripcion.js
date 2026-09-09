// ==========================================================================
// UNIÓN TECNOCRÁTICA COLOMBIANA — INSCRIPCIÓN.JS
// Lógica completa del formulario de inscripción paso a paso
// ==========================================================================

import { AppState, $, toast } from './main.js';

/** Estado del formulario */
const FormState = {
  currentStep: 1,
  maxSteps: 4,
  data: {},
  biometria: { rostro: null, documento: null, verified: false },
  firma: { hash: '', imagen: '' }
};

/** Inicializa formulario de inscripción */
export function initInscripcion() {
  const form = $.id('inscripcion-form');
  if (!form) return;

  initStepNavigation();
  initBiometria();
  initFirmaCanvas();
  initFormValidation();
  initFormSubmit();
  updateProgress();
}

/** Navegación entre pasos */
function initStepNavigation() {
  const steps = $.selAll('.form-step');
  const nextBtns = $.selAll('.btn-step-next');
  const prevBtns = $.selAll('.btn-step-prev');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next, 10);
      if (validateStep(FormState.currentStep)) {
        goToStep(nextStep);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev, 10);
      goToStep(prevStep);
    });
  });

  function goToStep(step) {
    if (step < 1 || step > FormState.maxSteps) return;

    // Ocultar paso actual
    const currentStepEl = $.sel(`.form-step[data-step="${FormState.currentStep}"]`);
    if (currentStepEl) currentStepEl.hidden = true;

    // Mostrar nuevo paso
    const nextStepEl = $.sel(`.form-step[data-step="${step}"]`);
    if (nextStepEl) {
      nextStepEl.hidden = false;
      nextStepEl.classList.add('active');
    }

    // Actualizar estado
    steps.forEach(s => s.classList.remove('active'));
    if (nextStepEl) nextStepEl.classList.add('active');

    FormState.currentStep = step;
    updateProgress();

    // Scroll suave al formulario
    $.id('inscripcion-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Actualiza barra de progreso */
function updateProgress() {
  const progressBar = $.sel('.progress-bar');
  const steps = $.selAll('.progress-steps .step');

  if (progressBar) {
    const percentage = (FormState.currentStep / FormState.maxSteps) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  steps.forEach((stepEl, i) => {
    const stepNum = i + 1;
    stepEl.classList.toggle('active', stepNum === FormState.currentStep);
    stepEl.classList.toggle('completed', stepNum < FormState.currentStep);
  });

  // Actualizar botones navegación
  const prevBtn = $.sel('.btn-step-prev');
  const nextBtn = $.sel('.btn-step-next');

  if (prevBtn) prevBtn.disabled = FormState.currentStep === 1;
  if (nextBtn) {
    if (FormState.currentStep === FormState.maxSteps) {
      nextBtn.hidden = true;
    } else {
      nextBtn.hidden = false;
      nextBtn.dataset.next = FormState.currentStep + 1;
    }
  }

  // Actualizar botones prev
  document.querySelectorAll('.btn-step-prev').forEach(btn => {
    btn.dataset.prev = FormState.currentStep - 1;
  });
}

/** Validación por paso */
function validateStep(step) {
  const stepEl = $.sel(`.form-step[data-step="${step}"]`);
  if (!stepEl) return false;

  const requiredFields = stepEl.querySelectorAll('[required]');
  let valid = true;

  requiredFields.forEach(field => {
    if (!field.checkValidity()) {
      field.reportValidity();
      valid = false;
    }
  });

  // Validaciones específicas por paso
  if (step === 3 && !FormState.biometria.verified) {
    toast.error('Debes completar la verificación biométrica');
    return false;
  }

  if (step === 4) {
    const consentChecks = stepEl.querySelectorAll('.consent-item input[required]');
    const allChecked = Array.from(consentChecks).every(cb => cb.checked);
    if (!allChecked) {
      toast.error('Debes aceptar todos los consentimientos obligatorios');
      return false;
    }
    if (!FormState.firma.hash) {
      toast.error('Debes firmar digitalmente');
      return false;
    }
  }

  return valid;
}

/** Recolecta datos del formulario */
function collectFormData() {
  const form = $.id('inscripcion-form');
  const formData = new FormData(form);

  FormState.data = {};
  for (const [key, value] of formData.entries()) {
    if (FormState.data[key]) {
      if (!Array.isArray(FormState.data[key])) FormState.data[key] = [FormState.data[key]];
      FormState.data[key].push(value);
    } else {
      FormState.data[key] = value;
    }
  }

  // Agregar datos de biometría y firma
  FormState.data.biometria = FormState.biometria;
  FormState.data.firma = FormState.firma;
  FormState.data.timestamp = new Date().toISOString();
  FormState.data.version = '1.0';

  return FormState.data;
}

/** Actualiza resumen en paso 4 */
function updateResumen() {
  const resumenEl = $.id('resumen-datos');
  if (!resumenEl) return;

  const labels = {
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    tipo_documento: 'Tipo documento',
    numero_documento: 'N° Documento',
    fecha_nacimiento: 'Fecha nacimiento',
    genero: 'Género',
    email: 'Email',
    telefono: 'Teléfono',
    direccion: 'Dirección',
    ciudad: 'Ciudad',
    departamento: 'Departamento',
    wallet: 'Wallet'
  };

  resumenEl.innerHTML = Object.entries(FormState.data)
    .filter(([k]) => !['consent_manifiesto', 'consent_estatutos', 'consent_formacion', 'consent_celula', 'consent_cuota', 'consent_datos', 'consent_biometria', 'consent_comunicacion', 'firma_hash', 'firma_imagen', 'biometria'].includes(k))
    .map(([key, value]) => `
      <div class="resumen-item">
        <span class="resumen-label">${labels[key] || key}</span>
        <span class="resumen-value">${Array.isArray(value) ? value.join(', ') : value || '—'}</span>
      </div>
    `).join('');

  // Agregar info de biometría y firma
  const biometriaStatus = FormState.biometria.verified ? '✅ Verificada' : '❌ Pendiente';
  const firmaStatus = FormState.firma.hash ? '✅ Firmado' : '❌ Pendiente';

  resumenEl.innerHTML += `
    <div class="resumen-item"><span class="resumen-label">Biometría</span><span class="resumen-value">${biometriaStatus}</span></div>
    <div class="resumen-item"><span class="resumen-label">Firma digital</span><span class="resumen-value">${firmaStatus}</span></div>
  `;
}

/** BIOMETRÍA */
function initBiometria() {
  const btnIniciar = $.id('btn-iniciar-biometria');
  const btnManual = $.id('btn-subir-manual');
  const fileRostro = $.id('file-rostro');
  const fileDocumento = $.id('file-documento');
  const previewRostro = $.id('preview-rostro');
  const previewDocumento = $.id('preview-documento');
  const biometriaPreview = $.id('biometria-preview');
  const biometriaStatus = $.id('biometria-status');
  const btnPaso3Next = $.id('btn-paso3-next');

  if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
      // Simular cámara (en producción: getUserMedia + face-api.js)
      toast.info('En producción: getUserMedia + face-api.js liveness detection. Demo: sube archivos manualmente.');
      fileRostro?.click();
    });
  }

  if (btnManual) {
    btnManual.addEventListener('click', () => {
      fileRostro?.click();
    });
  }

  function handleFile(file, previewEl, tipo) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo imágenes permitidas');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewEl.classList.add('has-image');
      previewEl.style.backgroundImage = `url(${e.target.result})`;
      previewEl.textContent = '';

      FormState.biometria[tipo] = e.target.result;
      checkBiometriaComplete();
    };
    reader.readAsDataURL(file);
  }

  if (fileRostro) {
    fileRostro.addEventListener('change', (e) => handleFile(e.target.files[0], previewRostro, 'rostro'));
  }

  if (fileDocumento) {
    fileDocumento.addEventListener('change', (e) => handleFile(e.target.files[0], previewDocumento, 'documento'));
  }

  function checkBiometriaComplete() {
    if (FormState.biometria.rostro && FormState.biometria.documento) {
      biometriaPreview.hidden = false;
      biometriaStatus.hidden = false;
      btnPaso3Next.disabled = false;

      // Simular verificación liveness
      simulateLivenessVerification();
    }
  }

  async function simulateLivenessVerification() {
    biometriaStatus.querySelector('span').textContent = 'Verificando liveness y coincidencia facial...';
    await new Promise(r => setTimeout(r, 2000));

    // Simular éxito (95% prob)
    const success = Math.random() > 0.05;

    if (success) {
      FormState.biometria.verified = true;
      biometriaStatus.innerHTML = '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Verificación exitosa. Coincidencia 99.2%</span>';
      biometriaStatus.style.borderColor = 'var(--color-gaia)';
      biometriaStatus.style.color = 'var(--color-gaia)';
    } else {
      biometriaStatus.innerHTML = '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>No se pudo verificar. Intenta con mejor iluminación.</span>';
      biometriaStatus.style.borderColor = 'var(--color-error)';
      biometriaStatus.style.color = 'var(--color-error)';
      FormState.biometria.verified = false;
    }
  }
}

/** FIRMA DIGITAL CANVAS */
function initFirmaCanvas() {
  const canvas = $.id('firma-canvas');
  const btnLimpiar = $.id('btn-limpiar-firma');
  const btnGuardar = $.id('btn-guardar-firma');
  const firmaHashInput = $.id('firma-hash');
  const firmaImagenInput = $.id('firma-imagen');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let drawing = false;
  let lastPoint = null;

  // Configurar canvas
  ctx.strokeStyle = '#8B3AFF';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDrawing(e) {
    drawing = true;
    lastPoint = getPoint(e);
    e.preventDefault();
  }

  function draw(e) {
    if (!drawing) return;
    const currentPoint = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    lastPoint = currentPoint;
    e.preventDefault();
  }

  function stopDrawing() {
    drawing = false;
    lastPoint = null;
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      FormState.firma = { hash: '', imagen: '' };
      $.id('firma-hash').value = '';
      $.id('firma-imagen').value = '';
      toast.info('Firma limpiada');
    });
  }

  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      const imageData = canvas.toDataURL('image/png');
      const hash = hashFirma(canvas);

      FormState.firma = { hash, imagen: imageData };
      $.id('firma-hash').value = hash;
      $.id('firma-imagen').value = imageData;

      toast.success('Firma guardada. Hash: ' + hash.substring(0, 16) + '...');
    });
  }
}

/** Hash simple de la firma (simulación SHA3-256) */
function hashFirma(canvas) {
  const imageData = canvas.toDataURL('image/png');
  let hash = 0;
  for (let i = 0; i < imageData.length; i++) {
    hash = ((hash << 5) - hash) + imageData.charCodeAt(i);
    hash |= 0;
  }
  // Simular SHA3-256 con hash simple + timestamp
  const timestamp = Date.now().toString(16);
  const combined = Math.abs(hash).toString(16) + timestamp;
  return 'SHA3-256:' + combined.substring(0, 64).toUpperCase();
}

/** VALIDACIÓN FORMULARIO */
function initFormValidation() {
  const form = $.id('inscripcion-form');
  if (!form) return;

  // Validación en tiempo real
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearFieldError(field));
  });

  // Validación wallet
  const walletFields = form.querySelectorAll('input[name="wallet"]');
  walletFields.forEach(field => {
    field.addEventListener('blur', () => validateWallet(field));
  });
}

function validateField(field) {
  if (field.required && !field.value.trim()) {
    showFieldError(field, 'Este campo es obligatorio');
    return false;
  }

  if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    showFieldError(field, 'Email inválido');
    return false;
  }

  if (field.type === 'tel' && field.value && !/^[\d\s+()-]{7,}$/.test(field.value)) {
    showFieldError(field, 'Teléfono inválido');
    return false;
  }

  clearFieldError(field);
  return true;
}

function validateWallet(field) {
  const value = field.value.trim();
  if (!value) return true;

  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const btcBech32Regex = /^bc1[a-z0-9]{39,59}$/;

  if (!ethRegex.test(value) && !btcRegex.test(value) && !btcBech32Regex.test(value)) {
    showFieldError(field, 'Dirección inválida (ETH: 0x..., BTC: 1.../3.../bc1...)');
    return false;
  }

  clearFieldError(field);
  return true;
}

function showFieldError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  field.classList.add('field-input--error');
  let errorEl = field.parentNode.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    field.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  field.classList.remove('field-input--error');
  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) errorEl.remove();
}

/** SUBMIT FORMULARIO */
function initFormSubmit() {
  const form = $.id('inscripcion-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateStep(FormState.currentStep)) return;

    // Actualizar resumen antes de enviar
    collectFormData();
    updateResumen();

    const submitBtn = $.id('btn-enviar-inscripcion');
    if (!submitBtn) return;

    form.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const data = collectFormData();

      // Simular envío a API
      const response = await fetch('/api/inscripcion/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('¡Inscripción enviada a blockchain! Recibirás confirmación en tu email. Hash: ' + result.hash);
        form.reset();
        // Reset estado
        FormState.currentStep = 1;
        FormState.data = {};
        FormState.biometria = { rostro: null, documento: null, verified: false };
        FormState.firma = { hash: '', imagen: '' };
        goToStep(1);
        updateProgress();
        // Limpiar canvas
        const canvas = $.id('firma-canvas');
        if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      } else {
        throw new Error(result.message || 'Error al procesar inscripción');
      }
    } catch (error) {
      console.error('[UTC] Inscripción error:', error);

      // Fallback demo
      if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
        await simulateSuccess();
        toast.success('¡Inscripción simulada! (Modo demo - revisa consola). Hash generado: UTC-REG-' + Date.now().toString(16).toUpperCase());
        form.reset();
        FormState.currentStep = 1;
        FormState.data = {};
        FormState.biometria = { rostro: null, documento: null, verified: false };
        FormState.firma = { hash: '', imagen: '' };
        goToStep(1);
        updateProgress();
        const canvas = $.id('firma-canvas');
        if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      toast.error(error.message || 'Error de conexión. Intenta de nuevo.');
    } finally {
      form.classList.remove('loading');
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function simulateSuccess() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function goToStep(step) {
  const steps = $.selAll('.form-step');
  steps.forEach(s => s.hidden = true);
  const target = $.sel(`.form-step[data-step="${step}"]`);
  if (target) target.hidden = false;
  FormState.currentStep = step;
  updateProgress();
}

/** Auto-init */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInscripcion);
  } else {
    initInscripcion();
  }
}