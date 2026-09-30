# ACCIÓN ATÓMICA — Ejecutar la auditoría completa de la web UTC

> Un paso = UNA acción atómica con comando/agentes concretos y criterio de parada medible.
> NO se inicia el paso siguiente si el actual no cumple su criterio de parada.
> Qué se audita y bajo qué criterios: `AUDITORIA_COMPLETA.md` (documento marco — no editar durante la ejecución).

---

## Fase 0 — Preparación (baseline congelada)

- **A0.1** `git status` → decidir residuos: restaurar (`git checkout -- <ruta>`) o excluir explícitamente (screenshots verify-*.png en raíz, .omo/, .opencode/, .playwright-mcp/, undefined/).
- **A0.2** Rama de auditoría: `git checkout -b auditoria/completa-2026-09`.
- **A0.3** Carpeta de evidencia: `auditoria/evidencia/` (capturas, mediciones, archivos por disciplina).

**Parada:** rama activa + `auditoria/evidencia/` existe. Commit SOLO con aprobación explícita del usuario.

## Fase 1 — Inventario completo (3 acciones, paralelizables)

- **A1.1 Captura visual:** Playwright → screenshot full-page de TODAS las 14 páginas (desktop 1280 + móvil 375) → `evidencia/capturas/`. Servir dist/ en puerto libre ≠ 3000 (el 3000 está ocupado por Grafana — no matarlo; patrón del puerto 3999 ya validado).
- **A1.2 Inventario textual:** de `public/` extraer TODAS las secciones (h1-h4) de las 14 páginas, cada cifra con su contexto, enlaces externos, formularios (campos recolectados), meta tags → `evidencia/inventario.md` (formato: página → sección → afirmación/enlace/asset).
- **A1.3 Inventario del partido:** leer los 4 JSON de `src/data/` (acta-constitucion, estatutos, partido, reglamento) → resumen de órganos/membresía/fases → `evidencia/partido-datos.md`.

**Parada:** ninguna página, cifra, formulario o asset sin mapear.

## Fase 2 — Auditorías por disciplina (7 en paralelo)

Cada una entrega `evidencia/disciplina-<X>.md` con la tabla 0–2 del marco + hallazgos con evidencia. **SIN correcciones en esta fase.**

- **A2.A Teórica →** `task(subagent_type="oracle", run_in_background=true)` — razonamiento de solo lectura (A1–A6) sobre el contenido inventariado.
- **A2.B Política →** delegación con skill `abogado-virtual` (B1–B6; Ley 1475/2011, CNE, lenguaje del cronograma).
- **A2.C Sociológica →** delegación con skill `sociologia` (C1–C5).
- **A2.D Antropológica →** delegación con skill `antropologo` (D1–D6).
- **A2.E Ingenieril →** ejecución directa: `npm run lint:css` + `npm run lint-html` + `npm run validate`, Lighthouse/Playwright (E4/E6/E7), `curl -I` del sitio (E5), grep de `repeat(, 1fr)` en `src/styles`, grep de secretos, `lsp_diagnostics` (E1–E9).
- **A2.F Jurídica →** delegación con skills `abogado-virtual` + `hr-legal-compliance-legal-advisor` (F1–F9; Ley 1581/2012, Decreto 1377/2013, Ley 527/1999, registro SIC).
- **A2.G Veracidad →** `websearch_cited` por cada estadística del inventario (G1–G5: fuente oficial, año, cifra exacta).

**Parada:** 7 archivos de disciplina con puntuación completa y evidencia.

## Fase 3 — Consolidación

- **A3.1** Fusionar hallazgos (dedupe página+problema) → `auditoria/reporte-auditoria.md`: tablas por disciplina + matriz de priorización (§8 del marco) + veredicto global (score total/máximo + top 5 riesgos).

**Parada:** reporte completo con matriz poblada.

## Fase 4 — Plan de remediación (SOLO plan, no ejecución)

- **A4.1** Hallazgos Crítico/Alto → tarea concreta: archivo afectado + cambio + criterio de verificación.
- **A4.2** Revisión del plan (si se guarda en `.omo/plans/*.md` → Momus; si es inline → pregunta directa al usuario).

**Parada:** plan aprobado explícitamente.

## Fase 5 — Ejecución + verificación + entrega

- **A5.1** Remediación por prioridad (Crítico → Alto → Medio → Bajo): un hallazgo = un commit atómico.
- **A5.2** Verificar cada fix con re-medición real (no "debería pasar").
- **A5.3** `git commit` + `git push` SOLO con aprobación explícita del usuario (push a main → CI → GitHub Pages, patrón ya validado).

**Parada:** matriz 100% resuelta o riesgos residuales documentados con justificación.

---

## Recordatorios del entorno (no repetir)

- Bash en esta máquina = PowerShell (sin grep; usar `Select-String`/`Get-Content`).
- Puerto 3000 = Grafana (Docker/WSL) — NO matarlo; servir dist/ en otro puerto (p. ej. 3999).
- El CSS compilado vive en `dist/styles/` (public/ no tiene .css); dist/ está trackeado en git.
- El bug de stats (desborde en tarjetas) ya está corregido y desplegado — auditar la familia completa de grids de TODAS las páginas, no re-auditar el fix.
- El encoding del terminal mostró mojibake (inconclusivo) → E3 del marco exige verificar el charset real de los archivos.
