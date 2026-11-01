# UI Design Reference - Stereo

**Design Philosophy:** Minimalista, limpio, enfocado en el contenido

## Referencia Visual Proporcionada

### Características del Diseño

**Layout:**
- Fondo oscuro uniforme (#1a1a1a o similar)
- Canvas/visor central grande (área gris claro)
- Barra de herramientas inferior horizontal
- Panel lateral derecho vertical con iconos de imágenes
- Indicador "Frame 14" discreto arriba a la izquierda
- Máximo aprovechamiento del espacio para el contenido

**Colores:**
- Fondo principal: Gris oscuro (#1a1a1a - #2a2a2a)
- Canvas/visor: Gris claro (#d4d4d4)
- Controles: Gris medio (#4a4a4a - #5a5a5a)
- Iconos: Blanco/gris claro con buen contraste
- Sin gradientes, sin colores llamativos

**Controles Inferiores (Toolbar):**
```
[Folder] [<] [Play] [>] [Rec] [Img] [Img] [Img] [Img] [Settings]
```

1. **Folder** - Icono de carpeta (abrir/seleccionar)
2. **<** - Anterior
3. **Play** - Play/Pause (toggle)
4. **>** - Siguiente
5. **Rec** - Grabar/Record
6. **Img x4** - Acceso rápido a imágenes (thumbnails pequeños)
7. **Settings** - Configuración (gear icon)

**Panel Lateral Derecho:**
- Stack vertical de thumbnails
- Iconos de imagen en cuadrados pequeños
- Scroll vertical si hay muchas imágenes
- Selección visual del frame actual

**Características Minimalistas:**
- ✅ Sin headers elaborados
- ✅ Sin sliders visibles todo el tiempo
- ✅ Sin paneles de información grandes
- ✅ Sin gradientes decorativos
- ✅ Sin texto excesivo
- ✅ Iconografía simple y clara
- ✅ Espaciado generoso
- ✅ Todo el foco en el canvas central

## Referencias Adicionales

### Proyecto Metamedia
- **GitHub:** vandalit/metamedia (pendiente de revisar)
- Estilo minimalista similar
- Buen ejemplo del lenguaje visual preferido

## Diferencias con Diseño Actual

### Actual (A Mejorar)
- ❌ Demasiados controles visibles
- ❌ Sliders grandes y prominentes
- ❌ Paneles de información extensos
- ❌ Header con título grande
- ❌ Controles dispersos
- ❌ Demasiado texto explicativo

### Objetivo (Minimalista)
- ✅ Toolbar horizontal compacto
- ✅ Solo iconos esenciales
- ✅ Canvas maximizado
- ✅ Panel lateral discreto
- ✅ Controles agrupados lógicamente
- ✅ Información mínima (solo frame number)

## Flujo de Interacción

### Modo Default
- Canvas ocupa mayoría del espacio
- Toolbar siempre visible (no auto-hide)
- Panel lateral con thumbnails visible
- Frame counter discreto arriba

### Modo Reproducción
- Misma UI (no cambia)
- Solo el botón play cambia a pause
- Frame counter se actualiza
- Sin overlays adicionales

### Configuración
- Modal o panel deslizante
- Aparece solo cuando se clickea settings
- Opciones: FPS, Hold, Render Mode, etc.
- Se cierra y vuelve al modo default

## Iconografía Requerida

**Controles Principales:**
- 📁 Folder (outline)
- ◀ Previous
- ▶ Play / ⏸ Pause
- ▶ Next
- ⏺ Record
- 🖼 Image/Frame (outline)
- ⚙️ Settings (gear)

**Estilo de Iconos:**
- Outline/stroke (no filled)
- Línea delgada
- Monocromático
- Tamaño uniforme (24x24 o 32x32)

## Paleta de Colores

```
Background:      #1a1a1a
Canvas Area:     #d4d4d4
Toolbar BG:      #2a2a2a
Controls:        #4a4a4a
Icons:           #e0e0e0
Active/Hover:    #ffffff
Selection:       #4a90e2 (accent, usar con moderación)
```

## Tipografía

- **Font:** Sans-serif system font (SF Pro, Segoe UI, Roboto)
- **Sizes:**
  - Frame counter: 12-14px
  - UI labels (si hay): 11-12px
  - Todo en minúsculas o sentence case
- **Weight:** Regular (400) por defecto, Medium (500) para activos

## Espaciado

- Canvas padding: 24-32px
- Toolbar height: 48-56px
- Toolbar button size: 40x40px
- Thumbnail size: 48x48px
- Gap entre elementos: 8-12px

## Comportamiento

### Hover States
- Fondo levemente más claro (#3a3a3a)
- Sin animaciones exageradas
- Transición suave 150ms

### Active States
- Borde o background accent (#4a90e2)
- Icono en blanco puro (#ffffff)

### Focus
- Outline sutil para accesibilidad
- No cambios drásticos de color

## Prioridad de Implementación

1. **Alta:** Layout minimalista (canvas + toolbar + sidebar)
2. **Alta:** Iconografía simple
3. **Alta:** Paleta de colores reducida
4. **Media:** Hover/active states
5. **Media:** Panel de settings modal
6. **Baja:** Animaciones sutiles

## Notas de Diseño

- **Menos es más**: Si no es esencial, no lo muestres
- **Contenido primero**: El canvas es la estrella
- **Controles secundarios**: Herramientas apoyan, no dominan
- **Consistencia**: Mismo lenguaje visual en toda la app
- **Performance**: UI ligero = app rápida

---

**Última actualización:** 2026-11-01  
**Fuente:** Mockup proporcionado por usuario + referencia a metamedia  
**Estado:** Pendiente de implementación


## Referencia Metamedia

**Repositorio:** https://github.com/vandalit/Metamedia  
**Demo:** https://vandalit.github.io/Metamedia/poc/3d-cube-parallax/

### Análisis del Código Fuente

**Características Clave del Estilo:**

1. **Paleta de Colores Oscura y Elegante:**
   ```css
   background: #000 (negro puro)
   panels: rgba(10,10,20,.95) (negro azulado casi opaco)
   borders: rgba(255,255,255,.12) (blanco 12% opacidad)
   text primary: rgba(255,255,255,.7)
   text secondary: rgba(255,255,255,.4)
   accent: #88aaff (azul suave)
   ```

2. **Tipografía:**
   - Font: `monospace` (sistema)
   - Tamaños: 9-12px para UI
   - Letter-spacing: 0.04-0.06em
   - Todo en minúsculas

3. **Paneles Flotantes:**
   - Border-radius: 7px
   - Backdrop-filter: blur(12px)
   - Semi-transparentes con blur
   - Posicionamiento fixed
   - Colapsables con chevron

4. **Chips de Estado:**
   ```css
   padding: 2px 7px
   border: 1px solid rgba(255,255,255,.15)
   background: rgba(255,255,255,.06)
   border-radius: 3px
   ```

5. **Botones:**
   - Minimal: `background: rgba(255,255,255,.08)`
   - Border: `1px solid rgba(255,255,255,.2)`
   - Padding: `8px 14px`
   - Border-radius: `4px`
   - Estados: .ok (verde), .bad (naranja), disabled

6. **Layout:**
   - Canvas fullscreen (body: overflow:hidden)
   - Barra superior con status chips
   - Controles inferiores horizontales
   - Paneles laterales colapsables
   - Todo fixed position

### Principios de Diseño Aplicables

**Para Stereo Explorer:**
```
┌─────────────────────────────────────┐
│ [chip] [chip] [chip]                │ ← status bar (opcional)
│                                     │
│                                     │
│       [thumbnail grid]              │ ← contenido principal
│                                     │
│                                     │
│                                     │
│ [📁] [settings] ...       [▶ Play] │ ← toolbar bottom
└─────────────────────────────────────┘
```

**Para Stereo Player:**
```
┌─────────────────────────────────────┐
│ Frame 14                            │ ← contador discreto
│                                     │
│                                     │
│                                     │
│         [ CANVAS ]            [▯]   │ ← panel lateral
│                                [▯]   │   con thumbnails
│                                [▯]   │
│                                [▯]   │
│ [📁][◀][▶][⏺][▯][▯][▯][▯][⚙] │ ← toolbar fixed
└─────────────────────────────────────┘
```

### Elementos Específicos a Adoptar

1. **Status Chips:**
   - Usar para estado de carga
   - Estados: ok (verde), bad (naranja), dim (inactivo)

2. **Paneles Colapsables:**
   - Settings panel como panel flotante
   - Backdrop blur effect
   - Chevron indicator

3. **Iconografía:**
   - Font Awesome icons
   - Tamaño: 11-12px
   - Color: rgba(255,255,255,.6)

4. **Botones con Estado:**
   - `.ok` para activo
   - `:disabled` para inactivo
   - Smooth transitions

5. **Monospace Typography:**
   - Números más legibles
   - Apariencia técnica/profesional
   - Alineación consistente

### Colores Exactos a Usar

```css
/* Backgrounds */
--bg-main: #000;
--bg-panel: rgba(10,10,20,.97);
--bg-overlay: rgba(0,0,0,.5);
--bg-button: rgba(255,255,255,.08);
--bg-button-hover: rgba(255,255,255,.12);

/* Borders */
--border-subtle: rgba(255,255,255,.07);
--border-normal: rgba(255,255,255,.12);
--border-strong: rgba(255,255,255,.2);

/* Text */
--text-primary: rgba(255,255,255,.7);
--text-secondary: rgba(255,255,255,.4);
--text-tertiary: rgba(255,255,255,.28);

/* States */
--accent-blue: #88aaff;
--state-ok: rgba(80,220,140,.4);
--state-bad: rgba(255,140,60,.4);

/* Special */
--blur: blur(12px);
```

### Espaciado y Sizing

```css
/* Panel */
padding: 6-10px (header)
padding: 8-12px (body)
border-radius: 7px
width: 176-260px

/* Buttons */
padding: 8px 14px
border-radius: 4px
gap: 6-8px

/* Chips */
padding: 2px 7px
border-radius: 3px
gap: 6px
```

### Comportamientos

1. **Hover States:**
   - `background: rgba(255,255,255,.04-05)`
   - Sutil, casi imperceptible

2. **Transitions:**
   - `transform .2s` (chevrons, etc)
   - Sin animaciones exageradas

3. **Canvas:**
   - `display: block`
   - Sin márgenes innecesarios
   - Fullscreen cuando sea posible

---

**Conclusión:** 
El estilo Metamedia es:
- **Oscuro y elegante** (negro con acentos sutiles)
- **Minimalista extremo** (solo lo esencial)
- **Paneles flotantes** (backdrop blur, semi-transparentes)
- **Tipografía monospace** (técnico, profesional)
- **Estados visuales claros** (chips de colores)
- **Sin decoración** (todo funcional)
