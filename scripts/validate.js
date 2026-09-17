#!/usr/bin/env node
/**
 * UTC Validate: valida estructura HTML de todas las páginas.
 * - Archivo existe, <title>, meta description, lang="es", landmarks (main, nav, footer)
 * - Referencias locales (href/src) resuelven dentro de public/
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const BASE = '/union-tecnocratica-colombiana';

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
  'inscripcion/index.html',
  'contacto/index.html',
  'prensa/index.html',
  'privacidad/index.html',
  'terminos/index.html'
];

const C = { ok: '\x1b[32m', warn: '\x1b[33m', err: '\x1b[31m', reset: '\x1b[0m' };
let errors = 0;
let warnings = 0;

function resolveLocal(ref) {
  let p = ref.split('#')[0].split('?')[0];
  if (p.startsWith(BASE)) p = p.slice(BASE.length);
  if (p.endsWith('/') || p === '') p += 'index.html';
  const rel = p.replace(/^\//, '');
  if (fs.existsSync(path.join(PUBLIC, rel))) return path.join(PUBLIC, rel);
  if (rel.startsWith('styles/') || rel.startsWith('scripts/')) return path.join(ROOT, 'src', rel);
  return path.join(PUBLIC, rel);
}

function validatePage(rel) {
  const file = path.join(PUBLIC, rel);
  if (!fs.existsSync(file)) {
    console.error(`${C.err}[UTC Validate]${C.reset} ERROR: no existe public/${rel}`);
    errors++;
    return;
  }
  const html = fs.readFileSync(file, 'utf8');
  const checks = [
    ['<title>', /<title>[^<]+<\/title>/],
    ['meta description', /<meta name="description" content="[^"]+"/],
    ['lang="es"', /<html[^>]+lang="es(-CO)?"/],
    ['<main', /<main[\s>]/],
    ['<nav', /<nav[\s>]/],
    ['</footer>', /<\/footer>/]
  ];
  for (const [name, re] of checks) {
    if (!re.test(html)) {
      console.error(`${C.err}[UTC Validate]${C.reset} ERROR: public/${rel} carece de ${name}`);
      errors++;
    }
  }
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (!fs.existsSync(resolveLocal(ref))) {
      console.error(`${C.warn}[UTC Validate]${C.reset} WARNING: public/${rel} referencia inexistente: ${ref}`);
      warnings++;
    }
  }
  console.log(`${C.ok}[UTC Validate]${C.reset}   OK ${rel}`);
}

console.log(`${C.ok}[UTC Validate]${C.reset} Validando estructura HTML (${PAGES.length} paginas)...`);
for (const p of PAGES) validatePage(p);

console.log(`${C.ok}[UTC Validate]${C.reset} Validacion completada: ${errors} errores, ${warnings} advertencias`);
process.exit(errors > 0 ? 1 : 0);
