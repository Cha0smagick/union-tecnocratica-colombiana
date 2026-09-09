#!/usr/bin/env node
/**
 * Build script para Unión Tecnocrática Colombiana - GitHub Pages
 * Compila, optimiza y prepara el sitio para despliegue estático
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

// GitHub Pages project site base path
const BASE_PATH = '/union-tecnocratica-colombiana/';

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

const ASSETS_DIRS = [
  'assets/identity',
  'assets/images',
  'assets/fonts'
];

function log(msg, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[UTC Build]${colors.reset} ${msg}`);
}

function cleanDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
    log('Directorio dist limpiado', 'info');
  }
  fs.mkdirSync(DIST, { recursive: true });
}

function copyPublic() {
  // Copiar todo public a dist
  copyRecursiveSync(PUBLIC, DIST);
  log('Archivos públicos copiados a dist', 'success');
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function optimizeHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Minificación básica HTML
  html = html
    .replace(/<!--[\s\S]*?-->/g, '') // Comentarios
    .replace(/\s+/g, ' ') // Espacios múltiples
    .replace(/>\s+</g, '><') // Espacios entre tags
    .trim();

  fs.writeFileSync(filePath, html);
}

function optimizeAllHtml() {
  PAGES.forEach(page => {
    const filePath = path.join(DIST, page);
    if (fs.existsSync(filePath)) {
      optimizeHtml(filePath);
    }
  });
  log('HTML optimizado', 'success');
}

function injectBasePath() {
  PAGES.forEach(page => {
    const filePath = path.join(DIST, page);
    if (fs.existsSync(filePath)) {
      let html = fs.readFileSync(filePath, 'utf8');
      
      // Inyectar base tag después de <head>
      if (!html.includes('<base href=')) {
        html = html.replace('<head>', `<head>\n  <base href="${BASE_PATH}">`);
        fs.writeFileSync(filePath, html);
      }
      
      // Fix action URLs en formularios (newsletter, inscripcion)
      html = html.replace(/action="\//g, `action="${BASE_PATH}`);
      html = html.replace(/action='\//g, `action='${BASE_PATH}`);
      
      fs.writeFileSync(filePath, html);
    }
  });
  log(`Base path inyectado: ${BASE_PATH}`, 'success');
}

function generateSitemap() {
  // Para GitHub Pages project site, usar la URL del project site
  const baseUrl = 'https://cha0smagick.github.io/union-tecnocratica-colombiana';
  const today = new Date().toISOString().split('T')[0];

  const urls = PAGES.map(page => {
    const url = page === 'index.html' ? baseUrl : `${baseUrl}/${page.replace('index.html', '')}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === 'index.html' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  log('Sitemap generado', 'success');
}

function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://cha0smagick.github.io/union-tecnocratica-colombiana/sitemap.xml

# UTC - Unión Tecnocrática Colombiana
# Partido político de extremo centro neutral
# Tecnología como cura. Greenpunk. Fusión naturaleza-máquina.`;

  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);
  log('Robots.txt generado', 'success');
}

function generateSecurityHeaders() {
  // Para Netlify/Cloudflare Pages - _headers
  const headers = `# Security Headers for UTC
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

# Cache static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/manifest.json
  Cache-Control: public, max-age=86400

/sitemap.xml
  Cache-Control: public, max-age=86400

/robots.txt
  Cache-Control: public, max-age=86400

# HTML no cache
/*.html
  Cache-Control: public, max-age=0, must-revalidate`;

  fs.writeFileSync(path.join(DIST, '_headers'), headers);
  log('Headers de seguridad generados (_headers)', 'success');
}

function generateRedirects() {
  // Para Netlify - _redirects
  const redirects = `# Redirects for UTC
# Single Page App fallback (si se usa SPA)
# /* /index.html 200

# Legacy URLs
/manifiesto /manifiesto/ 301
/fundadores /fundadores/ 301
/vision-mision /vision-mision/ 301
/objetivos /objetivos/ 301
/cronograma /cronograma/ 301
/estatutos /estatutos/ 301
/calculadoras /calculadoras/ 301
/newsletter /newsletter/ 301
/inscripcion /inscripcion/ 301`;

  fs.writeFileSync(path.join(DIST, '_redirects'), redirects);
  log('Redirects generados (_redirects)', 'success');
}

function verifyBuild() {
  log('Verificando build...', 'info');

  const requiredFiles = [
    'index.html',
    'manifest.json',
    'sitemap.xml',
    'robots.txt',
    '_headers',
    '_redirects'
  ];

  let allOk = true;
  requiredFiles.forEach(file => {
    const filePath = path.join(DIST, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      log(`  ✓ ${file} (${(stats.size / 1024).toFixed(1)} KB)`, 'success');
    } else {
      log(`  ✗ ${file} NO ENCONTRADO`, 'error');
      allOk = false;
    }
  });

  // Verificar páginas
  PAGES.forEach(page => {
    const filePath = path.join(DIST, page);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      log(`  ✓ ${page} (${(stats.size / 1024).toFixed(1)} KB)`, 'success');
    } else {
      log(`  ✗ ${page} NO ENCONTRADO`, 'error');
      allOk = false;
    }
  });

  // Verificar assets
  ASSETS_DIRS.forEach(dir => {
    const dirPath = path.join(DIST, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath, { recursive: true });
      log(`  ✓ ${dir} (${files.length} archivos)`, 'success');
    } else {
      log(`  ⚠ ${dir} no existe`, 'warn');
    }
  });

  if (allOk) {
    log('Build verificado correctamente', 'success');
  } else {
    log('Build tiene archivos faltantes', 'error');
    process.exit(1);
  }
}

function printSummary() {
  const stats = fs.statSync(path.join(DIST, 'index.html'));
  const totalSize = getDirSize(DIST);

  console.log('\n' + '='.repeat(50));
  log('BUILD COMPLETADO - UNIÓN TECNOCRÁTICA COLOMBIANA', 'success');
  console.log('='.repeat(50));
  console.log(`Directorio: ${DIST}`);
  console.log(`Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Páginas: ${PAGES.length}`);
  console.log(`index.html: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log('\nPara desplegar:');
  console.log('  GitHub Pages: Push a main → Action deploya automáticamente');
  console.log('  Netlify: Arrastrar carpeta dist/ o conectar repo');
  console.log('  Cloudflare Pages: Conectar repo, build command: npm run build');
  console.log('  Vercel: vercel --prod dist/');
  console.log('='.repeat(50) + '\n');
}

function getDirSize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += fs.statSync(filePath).size;
    }
  }
  return size;
}

// Main
try {
  log('Iniciando build de Unión Tecnocrática Colombiana...', 'info');
  cleanDist();
  copyPublic();
  optimizeAllHtml();
  injectBasePath();
  generateSitemap();
  generateRobots();
  generateSecurityHeaders();
  generateRedirects();
  verifyBuild();
  printSummary();
} catch (error) {
  log(`Error en build: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
}