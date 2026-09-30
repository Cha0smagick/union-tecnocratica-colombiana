# AUDITORÍA COMPLETA DE LA WEB — Unión Tecnocrática Colombiana (UTC)

> **Documento marco (el "QUÉ" y el "POR QUÉ").** Define objeto, alcance, criterios de auditoría y reglas de evidencia por disciplina.
> El plan de ejecución paso a paso (el "CÓMO" y el "CUÁNDO") vive en `AUDITORIA_ACCION.md`.
> Este documento NO se edita durante la auditoría: se audita CONTRA él. Cada punto produce un hallazgo con evidencia.

---

## 0. Objeto, alcance y reglas del juego

**Objeto:** la web pública completa del partido político Unión Tecnocrática Colombiana — 14 páginas (`public/*/index.html` + home), build propio (`scripts/build.js`), despliegue en GitHub Pages vía `.github/workflows/deploy.yml`, ruta base `/union-tecnocratica-colombiana/`.

**Estructura real a auditar (inventariada 2026-09-22):**

- **Home (`public/index.html`):** hero · LOS 7 PILARES DE LA UTC (Tecnología como cura, Greenpunk naturaleza-máquina, Autodominio transhumanista, Neutralidad estratégica, IA como bien común, Justicia híbrida humano-IA, Las corrientes) · LOS ARQUITECTOS (fundadores: Alejandro Quintero Ruiz, Fabian Sorza Cepeda) · POR QUÉ AHORA: LA COLOMBIA REAL (BRECHA DIGITAL, EDUCACIÓN REAL, CONFIANZA ROTA — 9 cajas de estadísticas) · VISIÓN · MISIÓN · CRONOGRAMA (5 fases, 12 años: Fundación y arquitectura, Expansión e infiltración, Consolidación de poder, Transformación estructural, Evolución permanente) · CÓDIGO FUENTE (newsletter) · CTA final · footer (PARTIDO, DOCUMENTOS, HERRAMIENTAS, CONTACTO).
- **Páginas (13):** calculadoras, contacto, cronograma, estatutos, fundadores, inscripcion, manifiesto, newsletter, objetivos, prensa, privacidad, terminos, vision-mision.
- **Datos del partido (`src/data/`):** acta-constitucion.json, estatutos.json, partido.json, reglamento.json.
- **Identidad (`assets/identity/`):** bandera, escudo heráldico, logo, mascota tecno-guacamaya, 24 iconos temáticos (democracia, educación, salud, justicia, soberanía, etc.).
- **Scripts (`src/scripts/`):** main, navbar, hero, stats-counter, inscripcion, newsletter, calculadoras, estatutos-tabs.
- **Infra del sitio:** dist/ con CNAME, manifest.json, robots.txt, sitemap.xml, _headers, _redirects.

**Naturaleza del sujeto auditado (define el énfasis):** el meta description del home declara **"Partido político de extremo centro neutral"**. Esto eleva a CRÍTICO todo lo que toque: legitimidad democrática, registro ante el CNE, tratamiento de datos personales (inscripción/newsletter/contacto) y el lenguaje del cronograma ("infiltración", "consolidación de poder").

**Reglas de evidencia (obligatorias, sin excepción):**

1. **Ninguna conclusión sin fuente verificable:** captura de pantalla, medición programática (curl, Lighthouse, getBoundingClientRect), cita normativa textual o fuente académica/oficial con enlace.
2. **Nada se asume leído:** cada punto exige inspección real del archivo/recurso correspondiente.
3. **Puntuación 0–2 por punto:** `0 = incumple o inexistente` · `1 = parcial, mejorable` · `2 = cumple`.
4. **NO se corrige nada durante la auditoría:** los hallazgos se documentan con evidencia, se priorizan en la matriz (§8) y la corrección ocurre en la Fase 5 de `AUDITORIA_ACCION.md`.
5. **Producto final:** `reporte-auditoria.md` — tablas de puntuación por disciplina + matriz de priorización + veredicto global.

---

## A. Auditoría teórica (tesis, coherencia y sustento conceptual)

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| A1 | Definición de la tesis central | "Tecnología como cura" y "extremo centro" están definidos con contenido operacional (qué significan, contra qué se definen), no como eslógan vacío. |
| A2 | Sustento de los 7 pilares | Cada pilar (Greenpunk, transhumanismo, IA como bien común, justicia híbrida…) remite a referencias conceptuales verificables (transhumanismo: Bostrom/More; gobernanza de IA: OCDE/UNESCO) o define contenido propio medible. Pilar solo-eslógan = 0. |
| A3 | Coherencia Greenpunk → política | "Greenpunk" (estética nacida en la ficción) se traduce en propuestas políticas concretas y verificables, o queda como marca estética sin programa. |
| A4 | Encadenamiento diagnóstico → propuesta | Cada dato de "LA COLOMBIA REAL" alimenta un pilar/propuesta concreto (brecha digital → qué; PISA 383 → qué; impunidad → qué). Dato sin propuesta derivada = hallazgo. |
| A5 | Tensión transhumanista vs democracia | "Autodominio transhumanista" articula límites éticos y control ciudadano explícitos; no puede leerse como promesa sin salvaguardas. |
| A6 | Falsabilidad y métricas | El cronograma (5 fases, 12 años) define indicadores medibles por fase; las metas son verificables, no aspiraciones abstractas. |

## B. Auditoría política (legitimidad, registro y riesgo electoral)

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| B1 | Naturaleza declarada del partido | El sitio declara con claridad qué es (partido/movimiento en inscripción ante CNE — Ley 1475 de 2011 — o en formación) y en qué etapa REAL se encuentra. Sin declaración, o declaración divergente de la realidad documental = 0. |
| B2 | Coherencia estatutos ↔ sitio | Los JSON de `src/data/` (acta-constitucion, estatutos, reglamento, partido) coinciden con lo que el sitio promete (órganos, fases, membresía). Contradicción = hallazgo crítico. |
| B3 | Lenguaje del cronograma | "EXPANSIÓN E INFILTRACIÓN" y "CONSOLIDACIÓN DE PODER": evaluar si "infiltración" es defendible públicamente o crea riesgo de leerse como toma no democrática de instituciones. Recomendar reformulación o justificación explícita en el sitio. |
| B4 | Transparencia de responsables | Fundadores identificados con nombre real y contacto verificable; el sitio no oculta a sus responsables tras anonimato. |
| B5 | Riesgo de apariencia estatal | Escudo heráldico + nombre no deben confundirse con símbolos o entidades estatales colombianas; disclaimers de "iniciativa/partido civil, no entidad oficial" presentes. |
| B6 | Cumplimiento electoral | Si hay proselitismo/recolección de apoyo: conformidad con reglas del CNE (publicidad, financiación); declaración de quién financia el sitio (dominio, hosting). |

## C. Auditoría sociológica (brecha, desigualdad y comunidad)

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| C1 | Verificación de cifras del diagnóstico | 79% colombianos 5+ con internet, 41% hogares rurales conectados, 9% hogares rurales con computador → contrastar contra DANE (ECV/ENDUTID) con año y fuente citados EN el sitio. Cifra sin fuente visible = 0. |
| C2 | Verificación PISA y CPI | 383 en PISA 2022 y CPI 37 + 92% impunidad → contrastar contra OCDE y Transparencia Internacional, con enlace en el sitio. |
| C3 | Desagregación de la brecha | La brecha digital se presenta por región/género/edad/estrato o solo como agregado nacional. Al menos una desagregación relevante = 2. |
| C4 | Capital social y canales bidireccionales | Mecanismos de organización colectiva reales (asambleas, foros, respuesta) vs comunicación unidireccional (solo newsletter). |
| C5 | Paradoja de exclusión | El sitio (requiere internet, español escrito, lectura técnica) mitiga la brecha que critica: versión ligera, lectura sencilla, canales offline. Sin mitigación = 0. |

## D. Auditoría antropológica (cultura, símbolos y comportamiento)

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| D1 | Registro lingüístico y tono | Español apropiado para audiencia colombiana (sin calcos ni registro frío-institucional); revisión real de los textos de las 14 páginas. |
| D2 | Lectura cultural de símbolos | Bandera, escudo heráldico, mascota guacamaya (símbolo nacional colombiano), colores: qué leen culturalmente y coherencia con la identidad del partido. |
| D3 | Saber experto vs saber local | La propuesta reconoce el conocimiento comunitario/rural o lo sustituye por el experto (tensión central de la tecnocracia). Reconocimiento explícito = 2. |
| D4 | Camino de incorporación | Rituales de pertenencia: visitante → simpatizante → miembro (inscripción), con onboarding cultural coherente (estatutos, código, juramento). |
| D5 | Contexto de uso real | Dispositivos y condiciones del público objetivo (móvil dominante, conectividad rural limitada) y respuesta del diseño (verificar móvil 375; peso de SVGs). |
| D6 | Etnografía del discurso | Cómo el texto construye identidad ("nosotros"), antagonistas ("ellos") y futuro — riesgo de polarización us-vs-them en un partido que se declara neutral. |

## E. Auditoría ingenieril (código, seguridad, rendimiento, a11y, SEO)

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| E1 | Build y arquitectura | `scripts/build.js` reproduce public/ → dist/ (HTML, CSS, JS, assets) de forma determinista; dist/ trackeado; deploy.yml verificado. |
| E2 | CSS (familia del bug de stats ya corregido) | Tokens usados consistentemente; grep de `repeat(N, 1fr)` puro sin matches problemáticos en TODOS los CSS (global, components, tokens + por página); `npm run lint:css` limpio. |
| E3 | HTML | `npm run lint-html` y `npm run validate` limpios; charset UTF-8 declarado y verificado en los archivos (el terminal mostró mojibake inconclusivo — verificar el encoding real); jerarquía h1-h4 correcta en las 14 páginas. |
| E4 | JavaScript | Los 8 scripts revisados: sin errores de consola (Playwright), sin globals fugados, formularios validados, sin código muerto. |
| E5 | Seguridad | Contenido de `_headers` (CSP, X-Frame-Options, HSTS) verificado; ningún secreto/API key en el repo (grep); formularios (inscripcion/newsletter/contacto) sin destino inseguro. |
| E6 | Rendimiento | Lighthouse móvil (LCP/CLS/INP): score ≥ 90 o hallazgo documentado; peso de SVGs/imágenes. |
| E7 | Accesibilidad WCAG 2.2 | Contraste AA, navegación por teclado, alt, foco visible, aria en tabs y contadores (estatutos-tabs.js, stats-counter.js) — auditar con skill de accesibilidad. |
| E8 | SEO/GEO | title/meta/OG en las 14 páginas, sitemap.xml completo y vigente, robots.txt correcto, JSON-LD (Organization), canonicals bajo la ruta base. |
| E9 | Higiene | git status limpio: screenshots verify-*.png en raíz (residuos), .omo/, .opencode/, .playwright-mcp/, undefined/ — excluir o limpiar con aprobación. |

## F. Auditoría jurídica (derecho colombiano aplicable)

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| F1 | Ley 1581 de 2012 (datos personales) | inscripcion/ + newsletter/ + contacto/ recolectan datos → política de tratamiento publicada (privacidad/), aviso de privacidad en cada formulario, autorización previa e inequívoca, derechos ARCO-P explicados. |
| F2 | Decreto 1377 de 2013 | Aviso de privacidad con contenido mínimo reglado; autorización por canal electrónico válida. |
| F3 | Ley 527 de 1999 (mensajes de datos) | Inscripción electrónica: consentimiento, validez del mensaje de datos, conservación. |
| F4 | Ley 1475 de 2011 (partidos políticos) | Estatutos y acta de constitución conformes con los requisitos de la ley; contenido del sitio coherente con la constitución interna del partido. |
| F5 | Propiedad intelectual de los activos | Fuentes (Helvetica Neue/Arial — licencia), SVGs de identidad (autoría propia o licencia identificada), derechos de autor del texto. Cada activo con licencia = 2. |
| F6 | Licencia del código | LICENSE en la raíz del repo presente y coherente con "CÓDIGO FUENTE" del home (el home promete código — ¿con qué licencia?). |
| F7 | Términos de uso | terminos/ con responsabilidad por la información publicada, límites, ley aplicable y jurisdicción colombiana. |
| F8 | Honor y difamación | Afirmaciones sobre corrupción/impunidad (CPI 37, 92%) respaldadas por fuentes citadas — riesgo de injuria/difamación sin respaldo documental. |
| F9 | Marcas y nombres | "Unión Tecnocrática Colombiana" + logo/escudo: análisis de registro ante la SIC y riesgo de colisión con marcas existentes. |

## G. Auditoría transversal de veracidad de contenido

| # | Qué se audita | Criterio de cumplimiento |
|---|---|---|
| G1 | Cada estadística con fuente, año y enlace | Las 9 cajas del home y cualquier cifra en otras páginas: cita completa visible. |
| G2 | Vigencia de fechas | PISA 2022, años del cronograma: explícitos y vigentes. |
| G3 | Enlaces externos vivos | Link-checker sin 404 en las 14 páginas. |
| G4 | Coherencia de cifras entre páginas | Ninguna cifra contradicha entre home/cronograma/objetivos/estatutos. |
| G5 | Opinión vs hecho | Afirmaciones fuertes marcadas como opinión o respaldadas como hecho verificable. |

---

## 8. Matriz de priorización

**Severidades:**

- **Crítico** = riesgo legal, reputacional o de legitimidad democrática (F1–F4, B1–B3, B5).
- **Alto** = veracidad, accesibilidad, seguridad (C1–C2, E5, E7, F8).
- **Medio** = teoría, política y antropología mejorables (A*, B4, B6, C3–C4, C5, D*).
- **Bajo** = higiene, SEO menor (E9, resto de E8).

**Regla de orden:** Crítico → Alto → Medio → Bajo. Dentro de cada severidad: esfuerzo barato primero.

**Formato de cada hallazgo en la matriz:**

`| ID | Disciplina | Hallazgo (con evidencia) | Severidad | Acción correctiva | Verificación |`
