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
