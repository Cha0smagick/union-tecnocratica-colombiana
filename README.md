# Unión Tecnocrática Colombiana (UTC) 🇨🇴

> **Partido político de extremo centro neutral** — *Tecnología como cura. Greenpunk. Fusión naturaleza-máquina. Transhumanismo responsable. IA como bien común.*

[![Deploy UTC](https://github.com/cha0smagick/union-tecnocratica-colombiana/actions/workflows/deploy.yml/badge.svg)](https://github.com/cha0smagick/union-tecnocratica-colombiana/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

---

## 🌐 Sitio Web Oficial

**🔗 [https://cha0smagick.github.io/union-tecnocratica-colombiana/](https://cha0smagick.github.io/union-tecnocratica-colombiana/)** — Desplegado automáticamente en **GitHub Pages** desde la rama `main`.

---

## 🎯 Qué es la UTC

La **Unión Tecnocrática Colombiana** es un partido político colombiano de **extremo centro neutral** que propone:

| Pilar | Descripción |
|-------|-------------|
| 🏥 **Tecnología como Cura** | Pobreza = fallo de asignación. Corrupción = exploit de sistema. Violencia = error de oportunidad. |
| 🌿 **Greenpunk: Fusión Naturaleza-Máquina** | Silicio nace de arena. Electricidad fluye como savia. Circuitos imitan micelio. |
| 🧬 **Autodominio Transhumanista** | Órganos bioimpresos. Interfaces neurales. Longevidad = derecho. La muerte es un bug. |
| ⚖️ **Neutralidad Estratégica** | Extremo centro como Suiza. Derecha = orden. Izquierda = justicia. UTC = implementación que funciona. |
| 🤖 **IA como Bien Común** | Silicon Valleys sin gentrificación. Ecoparques tecnológicos. GPU para el campesino. Modelos abiertos. |
| 🛡️ **Justicia Híbrida Humano-IA** | Jueces humanos para empatía. IA para consistencia. Penas escalonadas matemáticamente. |

---

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js ≥ 18.0.0**
- **npm** (incluido con Node.js)

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/cha0smagick/union-tecnocratica-colombiana.git
cd union-tecnocratica-colombiana

# Instalar dependencias
npm ci

# Desarrollo local (puerto 3000)
npm run dev

# Build de producción
npm run build

# Desplegar a GitHub Pages (requiere permisos)
npm run deploy
```

### Scripts Disponibles
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Compila, optimiza y genera `dist/` para producción |
| `npm run deploy` | Build + despliegue automático a GitHub Pages |
| `npm run validate` | Valida estructura HTML |
| `npm run lint:html` | Lint HTML |
| `npm run lint:css` | Lint CSS |

---

## 📁 Estructura del Proyecto

```
union-tecnocratica-colombiana/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: Build + Deploy a GitHub Pages
├── public/                     # Sitio estático (servido en dev)
│   ├── index.html              # Página principal
│   ├── manifiesto/             # Páginas por sección
│   ├── fundadores/
│   ├── vision-mision/
│   ├── objetivos/
│   ├── cronograma/
│   ├── estatutos/
│   ├── calculadoras/
│   ├── newsletter/
│   ├── inscripcion/
│   ├── assets/
│   │   ├── identity/           # SVGs: logo, iconos, bandera, escudo
│   │   ├── images/
│   │   └── fonts/              # Space Grotesk, IBM Plex Sans, JetBrains Mono
│   └── manifest.json           # PWA Manifest
├── src/
│   ├── data/                   # JSON: acta, estatutos, reglamento, partido
│   ├── scripts/                # JS modular (ES Modules)
│   │   ├── main.js             # Entry point
│   │   ├── hero.js             # Animaciones hero + stats counter
│   │   ├── navbar.js           # Menú responsive + accesibilidad
│   │   ├── newsletter.js       # Formulario suscripción
│   │   ├── stats-counter.js    # Contadores animados
│   │   ├── inscripcion.js      # Formulario militancia
│   │   ├── calculadoras.js     # Calculadoras tecnocráticas
│   │   └── estatutos-tabs.js   # Navegación pestañas estatutos
│   └── styles/                 # CSS modular
│       ├── tokens.css          # Design tokens (colores, spacing, tipografía)
│       ├── global.css          # Reset + base + utilidades
│       ├── components.css      # Componentes reutilizables
│       └── *.css               # Estilos por página
├── scripts/
│   ├── build.js                # Build pipeline completo
│   ├── validate.js             # Validación HTML
│   ├── lint-html.js            # Lint HTML
│   └── lint-css.js             # Lint CSS
├── package.json
└── README.md
```

---

## 🎨 Sistema de Diseño (Greenpunk 2.0)

### Paleta de Colores (oklch)
```css
/* Tokens principales en src/styles/tokens.css */
--bg-deep: oklch(0.08 0.02 280);      /* Fondo profundo */
--bg-base: oklch(0.12 0.03 270);      /* Fondo base */
--gaia: oklch(0.58 0.18 145);         /* Verde bioluminiscente */
--tech: oklch(0.65 0.2 200);          /* Cian tecnológico */
--accent: oklch(0.62 0.22 300);       /* Magenta/violeta */
--amber: oklch(0.72 0.16 85);         /* Ámbar orgánico */
```

### Tipografía
- **Display/Headers:** `Space Grotesk` (Variable font, wght 300-800)
- **Body/UI:** `IBM Plex Sans` (Variable font, wght 100-700)
- **Mono/Code:** `JetBrains Mono` (Variable font, wght 100-800)

### Principios Visuales
- **Fusión naturaleza-máquina:** Circuitos orgánicos, patrones de micelio, bioluminiscencia
- **Accesibilidad WCAG 2.2 AA:** Contraste, landmarks ARIA, skip links, focus visible
- **Mobile-first:** Breakpoints 400px / 560px / 768px / 1024px / 1280px / 1440px / 1680px
- **Performance:** Fonts preload, CSS crítico inline, @layer cascade, will-change optimizations

---

## 🔧 Build Pipeline (`scripts/build.js`)

El script de build ejecuta automáticamente:

1. **Limpia** `dist/`
2. **Copia** todo `public/` → `dist/`
3. **Copia** `src/styles/` → `dist/styles/`
4. **Copia** `src/scripts/` → `dist/scripts/`
5. **Optimiza HTML** (minificación: comentarios, espacios, tags)
6. **Inyecta** `<base href="/union-tecnocratica-colombiana/">`
7. **Reescribe** URLs absolutas internas al base path
8. **Genera** `sitemap.xml` con todas las páginas
9. **Genera** `robots.txt` con sitemap reference
10. **Genera** `_headers` (Netlify/Cloudflare) — Security headers + Cache policy
11. **Genera** `_redirects` (Netlify) — Trailing slashes + legacy URLs
12. **Verifica** archivos requeridos y páginas

**Salida:** Carpeta `dist/` lista para despliegue estático en cualquier hosting.

---

## 🌍 Despliegue en GitHub Pages

### Configuración Actual (Automática)

El workflow `.github/workflows/deploy.yml`:
- **Trigger:** Push a `main`/`master` o `workflow_dispatch`
- **Build:** `npm run build` → genera `dist/`
- **Deploy:** `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`
- **Entorno:** `github-pages` (protegido)

### ⚠️ Configuración Requerida en GitHub (Una sola vez)

> **El sitio no desplegará hasta que configures esto en el repositorio:**

1. Ve a **Settings → Pages** en tu repositorio GitHub
2. En **Source**, selecciona **"GitHub Actions"** (no "Deploy from a branch")
3. Guarda los cambios
4. El próximo push a `main` desplegará automáticamente

### Verificar Despliegue
- **Actions tab:** Ver logs del workflow "Build and Deploy UTC"
- **Settings → Pages:** Ver URL del sitio desplegado (`https://cha0smagick.github.io/union-tecnocratica-colombiana/`)

---

## 📄 Páginas del Sitio

| Ruta | Descripción | Archivo |
|------|-------------|---------|
| `/` | Home: Hero, 6 pilares, fundadores preview, visión/misión, cronograma, newsletter, CTA | `public/index.html` |
| `/manifiesto/` | Manifiesto completo con 6 pilares detallados | `public/manifiesto/index.html` |
| `/fundadores/` | Perfiles completos de los fundadores | `public/fundadores/index.html` |
| `/vision-mision/` | Visión 2035+ y Misión operativa detallada | `public/vision-mision/index.html` |
| `/objetivos/` | 6 objetivos estratégicos con KPIs medibles | `public/objetivos/index.html` |
| `/cronograma/` | 5 fases / 12 años / hitos trimestrales | `public/cronograma/index.html` |
| `/estatutos/` | Estatutos partido con navegación por pestañas | `public/estatutos/index.html` |
| `/calculadoras/` | Calculadoras: pobreza, corrupción, longevidad, IA | `public/calculadoras/index.html` |
| `/newsletter/` | Suscripción "Código Fuente" (semanal, lunes 06:00 UTC) | `public/newsletter/index.html` |
| `/inscripcion/` | Formulario militancia activa + wallet opcional | `public/inscripcion/index.html` |
| `/contacto/` | Información de contacto y formularios | `public/contacto/index.html` |
| `/prensa/` | Kit de prensa y recursos para medios | `public/prensa/index.html` |

---

## ♿ Accesibilidad

- **WCAG 2.2 AA** compliant
- Semantic HTML5 + ARIA landmarks (`role="navigation"`, `role="main"`, `role="banner"`, etc.)
- Skip link: "Saltar al contenido principal"
- Focus visible en todos los elementos interactivos
- Contraste ≥ 4.5:1 (texto) / 3:1 (UI)
- Alt text en todas las imágenes significativas
- Labels asociados a todos los inputs
- Responsive sin pérdida de funcionalidad (320px+)
- `prefers-reduced-motion` y `prefers-contrast` support

---

## 🔒 Seguridad & Headers

Generados automáticamente en `dist/_headers`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` restrictiva (self + inline styles/scripts permitidos para funcionalidad)
- Cache headers: assets inmutable (1 año), HTML no-cache

---

## 🤝 Contribuir

La UTC es **open source** y **colaborativa**. Cada militante es un contributor.

```bash
# 1. Fork del repo
# 2. Crear rama: git checkout -b feat/nueva-funcionalidad
# 3. Desarrollar + testear localmente (npm run dev)
# 4. Build verificar: npm run build
# 5. Commit: git commit -m "feat: descripción clara"
# 6. Push + Pull Request
```

### Estándares de Código
- **HTML:** Semántico, accesible, validado por `npm run validate`
- **CSS:** Tokens en `tokens.css`, móvil-first, @layer cascade, BEM modificado
- **JS:** ES Modules, vanilla, sin dependencias runtime
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)

---

## 📜 Documentos del Partido (en `src/data/`)

| Archivo | Descripción |
|---------|-------------|
| `partido.json` | Metadatos: nombre, sigla, fundadores, fecha, pilares, URLs |
| `estatutos.json` | Estatutos completos (títulos, artículos, transitorios) |
| `reglamento.json` | Reglamento interno (órganos, procedimientos, disciplina) |
| `acta-constitucion.json` | Acta de constitución legal |

---

## 📊 Métricas y Monitoreo

- **Build time:** ~10-15s en GitHub Actions
- **Bundle size:** ~550 KB (HTML + CSS + JS + assets + fonts)
- **Lighthouse target:** Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 📞 Contacto

> **Canales en construcción** — Se habilitarán progresivamente.

| Canal | Estado |
|-------|--------|
| 🌐 Web | ✅ [GitHub Pages](https://cha0smagick.github.io/union-tecnocratica-colombiana/) |
| 📧 General | 🚧 En construcción — ver sección [Contacto](/contacto/) |
| 📰 Prensa | 🚧 En construcción — ver sección [Prensa](/prensa/) |
| 🐦 X/Twitter | [@UTC_Colombia](https://twitter.com/UTC_Colombia) |
| 🐙 GitHub | [cha0smagick/union-tecnocratica-colombiana](https://github.com/cha0smagick/union-tecnocratica-colombiana) |

---

## ⚖️ Licencia

**MIT License** — Libre para usar, modificar, distribuir.
Ver [LICENSE](LICENSE) para detalles.

> *La evolución no tiene release final. Versión 1.0. En beta permanente.*
> *Cada militante es un contributor. Cada voto es un commit. Cada ley es un merge request auditado.*

---

**Fundadores:** Alejandro Quintero Ruiz & Fabian Sorza Cepeda  
**Personería jurídica:** En trámite ante CNE  
**Símbolos:** Registrados ante SIC  
**Infraestructura:** Servidores propios (Ecoparques), Kubernetes autogestionado, blockchain permissioned. **Cero GAFAM en datos críticos.**