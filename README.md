# Unión Tecnocrática Colombiana (UTC)

> **Menos discursos políticos, más soluciones que funcionan.** Salud, justicia, campo, transparencia y seguridad con resultados medibles.

[![Deploy UTC](https://github.com/cha0smagick/union-tecnocratica-colombiana/actions/workflows/deploy.yml/badge.svg)](https://github.com/cha0smagick/union-tecnocratica-colombiana/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

---

## Sitio Web Oficial

**[https://cha0smagick.github.io/union-tecnocratica-colombiana/](https://cha0smagick.github.io/union-tecnocratica-colombiana/)** — Desplegado automáticamente en **GitHub Pages** desde la rama `main`.

---

## Qué es la UTC

La **Unión Tecnocrática Colombiana** es un partido político colombiano **orientado a resultados** que propone:

| Pilar | Descripción |
|-------|-------------|
| **Soluciones que funcionan** | La pobreza es un problema de reparto. La corrupción es un problema de control. La violencia es falta de oportunidades. |
| **Innovación sostenible** | Tecnología al servicio de la naturaleza: sensores que avisan, mapas digitales de cada municipio, registro de cada especie. |
| **Salud digital preventiva universal** | Historia clínica única en el celular, citas sin filas, medicamentos a tiempo y medicina regenerativa. |
| **Solución práctica y soberanía nacional** | Un criterio claro y acción. El orden y la justicia no están en lados opuestos. |
| **Tecnificación agrícola y mercado directo** | El campesino vende directo, sin intermediarios. Centros de computación en las regiones. |
| **Justicia rápida y cero impunidad** | Juicios en meses, no en años. Alertas tempranas y datos reales en lugar de prejuicios. |
| **Gobernanza de alta eficiencia** | Antes de discutir, medimos. Datos abiertos, auditoría automática y metas con presupuesto y fecha. |

**Metas científicas de largo plazo** (OBJ 7 y OBJ 8): **más años de vida en plenitud** (investigación médica nacional abierta, cobertura universal, META 2045) y **el programa espacial colombiano** (envío de médicos e ingenieros, primera nave en órbita baja 2040, META 2050). Son logros de largo plazo, no el objetivo central del partido.

---

## Inicio Rápido

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

## Estructura del Proyecto

```
union-tecnocratica-colombiana/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: Build + Deploy a GitHub Pages
├── public/                     # Sitio estático (servido en dev)
│   ├── index.html              # Página principal
│   ├── manifiesto/             # Páginas por sección
│   ├── caso-diario/            # Tu día a día con la UTC (5 personas)
│   ├── buzon/                  # Buzón de problemas y soluciones
│   ├── bogota/                 # El plan para Bogotá (8 bloques)
│   ├── fundadores/
│   ├── vision-mision/
│   ├── objetivos/
│   ├── cronograma/
│   ├── estatutos/
│   ├── calculadoras/
│   ├── newsletter/
│   ├── inscripcion/
│   ├── contacto/
│   ├── prensa/
│   ├── privacidad/
│   └── terminos/
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
│   │   ├── caso-diario.js      # Expansor de casos de uso
│   │   ├── buzon.js            # Formulario de reportes + respuesta UTC
│   │   ├── bogota.js           # Calculadora de tiempo, votación, postulación
│   │   └── estatutos-tabs.js   # Navegación pestañas estatutos
│   └── styles/                 # CSS modular
│       ├── tokens.css          # Design tokens (colores, spacing, tipografía)
│       ├── global.css          # Reset + base + utilidades
│       ├── components.css      # Componentes reutilizables
│       ├── caso-diario.css
│       ├── buzon.css
│       ├── bogota.css
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

## Sistema de Diseño

### Paleta de Colores

Tokens principales en `src/styles/tokens.css` (esquema hex, modo claro por defecto con variantes oscuro, high-contrast y reduced-motion):

```css
--purple-950: #1A0B2E;   /* Negro profundo - casi negro */
--purple-800: #3D2566;   /* Morado oscuro principal (color primario del partido) */
--purple-600: #5D3A9E;   /* Morado medio (acento) */
--purple-100: #EDE6FC;   /* Casi blanco con tinte morado (fondos suaves) */
--success:    #059669;   /* Verde confirmación */
--warning:    #D97706;   /* Ámbar advertencia */
--info:       #2563EB;   /* Azul información */
```

Paleta institucional: **BLANCO, NEGRO, MORADO OSCURO**. Los tokens semánticos derivan de la escala morada (`--color-primary: var(--purple-800)`, `--color-accent: var(--purple-600)`).

### Tipografía
- **Display/Headers:** `Space Grotesk` (Variable font, wght 300-800)
- **Body/UI:** `IBM Plex Sans` (Variable font, wght 100-700)
- **Mono/Code:** `JetBrains Mono` (Variable font, wght 100-800)

### Principios Visuales
- **Accesibilidad WCAG 2.2 AA:** Contraste, landmarks ARIA, skip links, focus visible
- **Mobile-first:** Breakpoints 400px / 560px / 768px / 1024px / 1280px / 1440px / 1680px
- **Performance:** Fonts preload, CSS crítico inline, @layer cascade, will-change optimizations
- **Identidad:** Sin emojis ni decoración gratuito; métricas y datos como lenguaje visual

---

## Contacto

> **Canales en construcción** — Se habilitarán progresivamente.

| Canal | Estado |
|-------|--------|
| Web | [GitHub Pages](https://cha0smagick.github.io/union-tecnocratica-colombiana/) (activo) |
| General | En construcción — ver sección [Contacto](/contacto/) |
| Prensa | En construcción — ver sección [Prensa](/prensa/) |
| X/Twitter | [@UTC_Colombia](https://twitter.com/UTC_Colombia) |
| GitHub | [cha0smagick/union-tecnocratica-colombiana](https://github.com/cha0smagick/union-tecnocratica-colombiana) |

---

## Licencia

**MIT License** — Libre para usar, modificar, distribuir.
Ver [LICENSE](LICENSE) para detalles.

> *La evolución no tiene release final. Versión 1.0. En beta permanente.*
> *Cada militante aporta. Cada voto queda registrado. Cada ley se puede revisar.*

---

**Fundadores:** Alejandro Quintero Ruiz & Fabian Sorza Cepeda
**Personería jurídica:** En trámite ante CNE
**Símbolos:** Registrados ante SIC
**Infraestructura:** Servidores propios (Ecoparques), Kubernetes autogestionado, blockchain permissioned. **Cero GAFAM en datos críticos.**
