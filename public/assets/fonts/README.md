# Fuentes UTC

Auto-hospedadas en este directorio. Sin Google Fonts, sin CDN de terceros.
Licencia de las tres: SIL Open Font License 1.1.

## Fuentes en uso (3)

Solo existen tres bloques `@font-face`, en `src/styles/tokens.css` (~linea 348).
Cada pagina precarga exactamente estas tres en el `<head>`.

### Space Grotesk (Display / titulos)
- **Uso**: titulos, numeros, datos, navegacion
- **Pesos**: 300-700 (variable font, eje `wght`)
- **Archivo**: `SpaceGrotesk-VariableFont_wght.woff2`
- **Origen**: repo oficial `floriankarsten/space-grotesk`, archivo `fonts/woff2/SpaceGrotesk[wght].woff2`

### IBM Plex Sans (UI / body)
- **Uso**: texto principal, formularios, contenido
- **Pesos**: 100-700 (variable font, eje `wght`)
- **Archivo**: `IBMPlexSans-VariableFont_wght.woff2`
- **Origen**: subconjunto `latin` servido por la API de Google Fonts
  (`fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100..700` y `family=JetBrains+Mono:wght@100..800`)

### JetBrains Mono (Mono / codigo y datos)
- **Uso**: codigo, hashes, direcciones, datos tabulares
- **Pesos**: 100-800 (variable font, eje `wght`)
- **Archivo**: `JetBrainsMono-VariableFont_wght.woff2`
- **Origen**: subconjunto `latin` de la API de Google Fonts
  (`github.com/ryanoasis/nerd-fonts/releases`)

## Nota sobre Nerd Fonts

`nerdfonts.com/font-downloads` publica 66 familias, **todas monoespaciadas**:
son fuentes parcheadas con iconos de terminal. Space Grotesk e IBM Plex Sans
son tipografias de texto proporcional y no forman parte de ese catalogo, asi que
se toman de los repositorios oficiales de cada una.

## Preloads

Las 17 paginas precargan las 3 fuentes y nada mas. Antes algunas paginas
precargaban `Inter` y `Merriweather`, que no aparecen en ningun `font-family`:
se descargaban en cada visita sin que nadie las usara.

`Inter` sigue apareciendo como alternativa secundaria en `--font-display` y
`--font-sans` dentro de `tokens.css`. No se precarga porque no se descarga:
solo se usaria si el visitante ya tiene Inter instalada.

## Notas

- Solo `woff2`. Los tres archivos estan verificados con la firma `wOF2`.
- Variable fonts: un archivo por familia en vez de uno por peso.
- `font-display: swap` ya configurado en el `@font-face`.
- Cambiar un archivo aqui exige actualizar el `@font-face` de `tokens.css`
  y los `<link rel="preload">` de las 17 paginas.
