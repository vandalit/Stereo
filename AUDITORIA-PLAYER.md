# Auditoría Completa - Player Window

## IDs que busca player.ts vs IDs en player.html

### Canvas y Frame Counter
| player.ts busca | player.html tiene | Estado |
|-----------------|-------------------|--------|
| `playerCanvas` | `playerCanvas` | ✅ OK |
| `frameInfo` | `frameInfo` | ✅ OK |

### Botones de toolbar
| player.ts busca | player.html tiene | Estado |
|-----------------|-------------------|--------|
| `btnFolder` | `btnFolder` | ✅ OK |
| `btnPrev` | `btnPrev` | ✅ OK |
| `playPauseBtn` | `playPauseBtn` | ✅ OK |
| `btnNext` | `btnNext` | ✅ OK |
| `stopBtn` | `stopBtn` | ✅ OK |
| `btnRecord` | `btnRecord` | ✅ OK |
| `thumb1` | `thumb1` | ✅ OK |
| `thumb2` | `thumb2` | ✅ OK |
| `btnFps` | `btnFps` | ✅ OK |
| `btnHold` | `btnHold` | ✅ OK |
| `btnSettings` | `btnSettings` | ✅ OK |

### Iconos Play/Pause
| player.ts busca | player.html tiene | Estado |
|-----------------|-------------------|--------|
| `playIcon` | `playIcon` | ✅ OK |
| `pauseIcon` | `pauseIcon` | ✅ OK |

### Settings Panel Sliders
| player.ts busca | player.html tiene | Estado |
|-----------------|-------------------|--------|
| `fpsSlider` | `fpsSlider` | ✅ OK |
| `holdSlider` | `holdSlider` | ✅ OK |
| `fpsValue` | `fpsValue` | ✅ OK |
| `holdValue` | `holdValue` | ✅ OK |

### Toolbar Popup Sliders
| player.ts busca | player.html tiene | Estado |
|-----------------|-------------------|--------|
| `fpsSliderToolbar` | `fpsSliderToolbar` | ✅ OK |
| `holdSliderToolbar` | `holdSliderToolbar` | ✅ OK |
| `fpsValueToolbar` | `fpsValueToolbar` | ✅ OK |
| `holdValueToolbar` | `holdValueToolbar` | ✅ OK |
| `fpsPopup` | `fpsPopup` | ✅ OK |
| `holdPopup` | `holdPopup` | ✅ OK |

### Settings Panel
| player.ts busca | player.html tiene | Estado |
|-----------------|-------------------|--------|
| `settingsPanel` | `settingsPanel` | ✅ OK |
| `settingsBody` | `settingsBody` | ✅ OK |

## ✅ CONCLUSIÓN: TODOS LOS IDS ESTÁN CORRECTOS

El problema NO es desconexión de IDs. Todos los botones y sliders están conectados correctamente en player.ts.

## Posibles Causas del Problema Visual

1. **CSS con contraste muy bajo** - Ya aumentado pero puede necesitar más
2. **Player window no se está abriendo** - Verificar main process
3. **JavaScript no se ejecuta** - Error en runtime
4. **Botones ocultos por CSS** - `display: none` o `visibility: hidden`

## Verificar en DevTools

En Console escribir:
```javascript
// Verificar que botones existen
document.getElementById('btnPrev')
document.getElementById('btnNext')

// Ver sus estilos
getComputedStyle(document.getElementById('btnPrev'))

// Contar botones en toolbar
document.querySelectorAll('#toolbar .tb-btn').length
// Debe dar 11
```
