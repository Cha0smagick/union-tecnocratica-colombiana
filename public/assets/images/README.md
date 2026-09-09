# Imágenes UTC

## Directorio para imágenes optimizadas

### Formatos recomendados
- **WebP** (principal): 90% calidad, pérdida aceptable
- **AVIF** (moderno): Mejor compresión, soporte creciente
- **PNG** (fallback): Solo para transparencias complejas
- **SVG** (iconos/gráficos): Ya incluidos en `/assets/identity/`

### Optimización
```bash
# Instalar sharp o imagemin
npm install -g sharp-cli

# Convertir a WebP 90% calidad
sharp-cli -i input.png -o output.webp --quality 90

# Convertir a AVIF 50% calidad
sharp-cli -i input.png -o output.avif --quality 50
```

### Imágenes necesarias para el proyecto
- `/assets/images/hero-bg.webp` - Background hero (1920x1080)
- `/assets/images/og-default.webp` - Open Graph default (1200x630)
- `/assets/images/favicon-512.png` - Favicon 512x512
- `/assets/images/og-twitter.webp` - Twitter Card (1200x600)

### Responsive images
Usar `<picture>` con múltiples fuentes:
```html
<picture>
  <source srcset="/assets/images/hero.avif" type="image/avif">
  <source srcset="/assets/images/hero.webp" type="image/webp">
  <img src="/assets/images/hero.png" alt="..." width="1920" height="1080">
</picture>
```

### Lazy loading
Todas las imágenes below-the-fold deben tener `loading="lazy"`