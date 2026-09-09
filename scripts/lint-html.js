#!/usr/bin/env node
/**
 * Lint HTML - Validación básica de estructura HTML
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const PAGES = [
  'index.html',
  'manifiesto/index.html',
  'fundadores/index.html',
  'vision-mision/index.html',
  'objetivos/index.html',
  'cronograma/index.html',
  'estatutos/index.html',
  'calculadoras/index.html',
  'newsletter/index.html',
  'inscripcion/index.html'
];

function log(msg, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[UTC Lint HTML]${colors.reset} ${msg}`);
}

function validateHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  let hasErrors = false;

  // Verificar doctype
  if (!html.trim().startsWith('<!DOCTYPE html>')) {
    log(`ERROR: ${filePath} no tiene doctype HTML5`, 'error');
    hasErrors = true;
  }

  // Verificar meta viewport
  if (!html.includes('viewport')) {
    log(`WARNING: ${filePath} sin meta viewport`, 'warn');
  }

  // Verificar título
  if (!html.includes('<title>')) {
    log(`ERROR: ${filePath} sin title`, 'error');
    hasErrors = true;
  }

  // Verificar lang attribute
  if (!html.includes('lang="es-CO"') && !html.includes("lang='es-CO'")) {
    log(`WARNING: ${filePath} sin lang="es-CO"`, 'warn');
  }

  // Verificar charset
  if (!html.includes('charset="UTF-8"') && !html.includes("charset='UTF-8'")) {
    log(`WARNING: ${filePath} sin charset UTF-8`, 'warn');
  }

  // Verificar estructura básica: head, body
  if (!html.includes('<head>') || !html.includes('</head>')) {
    log(`ERROR: ${filePath} sin head completo`, 'error');
    hasErrors = true;
  }
  if (!html.includes('<body>') || !html.includes('</body>')) {
    log(`ERROR: ${filePath} sin body completo`, 'error');
    hasErrors = true;
  }

  // Verificar main landmark
  if (!html.includes('<main') && !html.includes('role="main"')) {
    log(`WARNING: ${filePath} sin landmark main`, 'warn');
  }

  // Verificar skip link
  if (!html.includes('Saltar al contenido') && !html.includes('skip to main')) {
    log(`WARNING: ${filePath} sin skip link`, 'warn');
  }

  // Verificar imágenes con alt
  const imgRegex = /<img[^>]*>/gi;
  const imgs = html.match(imgRegex) || [];
  imgs.forEach(img => {
    if (!img.includes('alt=')) {
      log(`WARNING: ${filePath} - imagen sin alt: ${img.substring(0, 80)}`, 'warn');
    }
  });

  // Verificar inputs con labels
  const inputRegex = /<input[^>]*>/gi;
  const inputs = html.match(inputRegex) || [];
  inputs.forEach(input => {
    const idMatch = input.match(/id=["']([^"']+)["']/);
    if (idMatch) {
      const id = idMatch[1];
      if (!html.includes(`for="${id}"`) && !html.includes(`for='${id}'`)) {
        // Verificar si está dentro de un label
        if (!html.includes(`<label[^>]*>${input}`) && !html.includes(`${input}</label>`)) {
          log(`WARNING: ${filePath} - input sin label asociado: ${input.substring(0, 80)}`, 'warn');
        }
      }
    }
  });

  return !hasErrors;
}

// Main
try {
  log('Iniciando lint HTML...', 'info');
  let allOk = true;

  PAGES.forEach(page => {
    const filePath = path.join(PUBLIC, page);
    if (fs.existsSync(filePath)) {
      log(`Validando ${page}...`, 'info');
      if (!validateHtml(filePath)) {
        allOk = false;
      } else {
        log(`  ✓ ${page}`, 'success');
      }
    } else {
      log(`  ✗ ${page} NO ENCONTRADO`, 'error');
      allOk = false;
    }
  });

  if (allOk) {
    log('Lint HTML completado sin errores', 'success');
    process.exit(0);
  } else {
    log('Lint HTML encontró errores', 'error');
    process.exit(1);
  }
} catch (error) {
  log(`Error en lint: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
}