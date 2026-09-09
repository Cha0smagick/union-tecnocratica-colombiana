#!/usr/bin/env node
/**
 * Lint CSS - Validación básica de CSS
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_STYLES = path.join(ROOT, 'src', 'styles');

const CSS_FILES = [
  'tokens.css',
  'global.css',
  'components.css',
  'manifiesto.css',
  'fundadores.css',
  'vision-mision.css',
  'objetivos.css',
  'cronograma.css',
  'estatutos.css',
  'calculadoras.css',
  'newsletter.css',
  'inscripcion.css'
];

function log(msg, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[UTC Lint CSS]${colors.reset} ${msg}`);
}

function validateCss(filePath) {
  const css = fs.readFileSync(filePath, 'utf8');
  let hasErrors = false;

  // Verificar que no esté vacío
  if (!css.trim()) {
    log(`ERROR: ${filePath} está vacío`, 'error');
    return false;
  }

  // Verificar llaves balanceadas
  let openBraces = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') openBraces++;
    if (css[i] === '}') openBraces--;
  }
  if (openBraces !== 0) {
    log(`ERROR: ${filePath} - llaves desbalanceadas (${openBraces > 0 ? 'faltan cierres' : 'cierres extra'})`, 'error');
    hasErrors = true;
  }

  // Verificar punto y coma en declaraciones (básico)
  const declRegex = /:[^;{}]*;/g;
  const declarations = css.match(declRegex) || [];
  declarations.forEach(decl => {
    if (!decl.trim().endsWith(';') && !decl.includes('{') && !decl.includes('}')) {
      // Podría ser el último en un bloque
    }
  });

  // Verificar custom properties (tokens) en tokens.css
  if (filePath.includes('tokens.css')) {
    const requiredTokens = [
      '--navy', '--bg-light', '--amber', '--cyan', '--gaia',
      '--white', '--muted', '--green', '--red', '--purple'
    ];
    requiredTokens.forEach(token => {
      if (!css.includes(token)) {
        log(`WARNING: ${filePath} - token requerido faltante: ${token}`, 'warn');
      }
    });
  }

  // Verificar @import si existen
  const imports = css.match(/@import\s+['"][^'"]+['"];/g) || [];
  imports.forEach(imp => {
    const importPath = imp.match(/['"]([^'"]+)['"]/)[1];
    const resolvedPath = path.join(path.dirname(filePath), importPath);
    if (!fs.existsSync(resolvedPath)) {
      log(`WARNING: ${filePath} - import no encontrado: ${importPath}`, 'warn');
    }
  });

  // Verificar selectores muy específicos (especificidad alta)
  const highSpecificity = css.match(/[.#][\w-]+[\s>+~][.#][\w-]+[\s>+~][.#][\w-]+/g) || [];
  if (highSpecificity.length > 10) {
    log(`WARNING: ${filePath} - muchos selectores de alta especificidad (${highSpecificity.length})`, 'warn');
  }

  // Verificar !important
  const importantCount = (css.match(/!important/gi) || []).length;
  if (importantCount > 20) {
    log(`WARNING: ${filePath} - mucho uso de !important (${importantCount} veces)`, 'warn');
  }

  return !hasErrors;
}

// Main
try {
  log('Iniciando lint CSS...', 'info');
  let allOk = true;

  CSS_FILES.forEach(file => {
    const filePath = path.join(SRC_STYLES, file);
    if (fs.existsSync(filePath)) {
      log(`Validando ${file}...`, 'info');
      if (!validateCss(filePath)) {
        allOk = false;
      } else {
        log(`  ✓ ${file}`, 'success');
      }
    } else {
      log(`  ⚠ ${file} no existe (opcional)`, 'warn');
    }
  });

  if (allOk) {
    log('Lint CSS completado sin errores', 'success');
    process.exit(0);
  } else {
    log('Lint CSS encontró errores', 'error');
    process.exit(1);
  }
} catch (error) {
  log(`Error en lint: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
}