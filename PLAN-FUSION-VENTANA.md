# Plan: Fusionar en Una Sola Ventana

## Problema Actual
- 2 ventanas separadas (Explorer + Player)
- Player es fullscreen (incorrecto)
- Confusión total

## Solución
**Una ventana redimensionable** que cambia de contenido:

### Estado 1: Sin imágenes (Explorer mode)
```
┌────────────────────────────┐
│ [no folder] [0 images]     │ ← status bar
├────────────────────────────┤
│                            │
│   📁 select folder         │ ← empty state
│                            │
├────────────────────────────┤
│ [📁] [spacer] [⚙️] [▶]    │ ← toolbar
└────────────────────────────┘
```

### Estado 2: Con imágenes (Player mode)
```
┌────────────────────────────┐
│ frame 1 / 24               │ ← frame counter
├────────────────────────────┤
│                            │
│      🖼️ CANVAS             │ ← canvas (fill mode)
│                            │
├────────────────────────────┤
│ [📁][←][▶][→][⏹][⏺️]...   │ ← toolbar (11 botones)
└────────────────────────────┘
```

## Implementación

1. **Usar Explorer window** (ya es redimensionable, NO fullscreen)
2. **Traer HTML del Player** (canvas + 11 botones) al Explorer
3. **Alternar con CSS/JS**:
   - Sin imágenes → mostrar grilla + 3 botones
   - Con imágenes → mostrar canvas + 11 botones
4. **Eliminar Player window** del main process

## Archivos a Modificar

- `desktop/renderer/explorer.html` - agregar canvas + 11 botones
- `desktop/renderer/explorer.ts` - integrar lógica del player
- `desktop/renderer/styles/explorer.css` - fusionar estilos
- `desktop/main/windows.ts` - eliminar createPlayer()

Tiempo: 20 minutos
