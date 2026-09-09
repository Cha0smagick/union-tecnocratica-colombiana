# Fuentes UTC

## Fuentes requeridas (auto-hospedadas para privacidad y performance)

### Space Grotesk (Display/Títulos)
- **Uso**: Títulos, números, datos, navegación
- **Pesos**: 300-700 (variable font)
- **Descarga**: https://fonts.google.com/specimen/Space+Grotesk
- **Archivo**: `SpaceGrotesk-VariableFont_wght.woff2`

### IBM Plex Sans (UI/Body)
- **Uso**: Texto principal, UI, formularios, contenido
- **Pesos**: 100-700 (variable font) + italic
- **Descarga**: https://fonts.google.com/specimen/IBM+Plex+Sans
- **Archivos**: 
  - `IBMPlexSans-VariableFont_wght.woff2`
  - `IBMPlexSans-Italic-VariableFont_wght.woff2`

### JetBrains Mono (Mono/Código)
- **Uso**: Código, fórmulas matemáticas, datos tabulares, hashes, wallet addresses
- **Pesos**: 100-800 (variable font)
- **Descarga**: https://fonts.google.com/specimen/JetBrains+Mono
- **Archivo**: `JetBrainsMono-VariableFont_wght.woff2`

## Instrucciones

1. Descargar los archivos `.woff2` variable font de Google Fonts
2. Colocarlos en este directorio (`public/assets/fonts/`)
3. Los archivos CSS en `src/styles/tokens.css` y `src/styles/global.css` ya referencian estos nombres

## Optimización

- Usar solo `woff2` (mejor compresión)
- Variable fonts reducen requests HTTP
- `font-display: swap` ya configurado en CSS
- Preload en `<head>` de cada página para Critical Rendering Path