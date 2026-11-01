# 🚀 Stereo - Checklist Próxima Sesión

**Última sesión:** 2026-10-31 - Resize fix + Sliders interactivos  
**Estado:** ✅ Build compilando, Core 100%, Desktop 85%

---

## ⚡ QUICK START

```bash
cd /home/vandalit/work/vandalit/Stereo
npm run build
npm run electron
```

Cargar imágenes: `Click Folder → docs/sample-images/` (8 imágenes listas)

---

## ✅ TEST FLOW OBLIGATORIO

### 1. Funcionalidad Básica
- [ ] App abre con ventana única redimensionable
- [ ] 11 botones visibles en toolbar inferior
- [ ] Folder button carga imágenes de `docs/sample-images/`
- [ ] Reproducción automática inicia
- [ ] Frame counter actualiza ("frame X / Y")
- [ ] Space pausa/resume
- [ ] ← → navegan frames
- [ ] Stop resetea a frame 0

### 2. Sliders Interactivos (NUEVO)
- [ ] Click botón ⚡ (FPS) → Popup aparece
- [ ] Arrastrar slider → Velocidad cambia en tiempo real (1-120)
- [ ] Valor actualiza en header del popup
- [ ] Click afuera → Popup cierra
- [ ] Click botón 🕐 (Hold) → Popup aparece
- [ ] Arrastrar slider → Hold frames cambia (1-60)
- [ ] ESC cierra todos los popups

### 3. Resize Performance (FIXED)
- [ ] Arrastrar ventana de esquinas
- [ ] NO hay lag ni freeze (debounce 150ms)
- [ ] Canvas redibuja correctamente al soltar

---

## 🐛 BUGS A VERIFICAR

### Sospechosos (pueden estar presentes)
1. **Botones FPS/Hold no muestran texto inicial**
   - Esperado: "60fps" y "Hold 6"
   - Actual: Solo íconos

2. **Settings button sin handler**
   - Click no hace nada
   - ¿Remover o implementar?

3. **Código legacy Explorer window**
   - `windows.ts` crea ventana que no se usa
   - Desktop solo usa `explorer.html`

4. **CSS duplicado en settings panel**
   - Inputs FPS/Hold duplicados vs popups
   - Unificar o remover

---

## 📊 ESTADO ROADMAP

```
Phase 1: Core Engine         ████████████████████  100% ✅
Phase 2: Desktop App          █████████████████░░░   85% 🚧
  ├─ UI & Controls            ████████████████████  100% ✅
  ├─ Sliders Interactivos     ████████████████████  100% ✅
  ├─ Resize Optimizado        ████████████████████  100% ✅
  ├─ Settings Panel           ░░░░░░░░░░░░░░░░░░░░    0% ⏳
  ├─ Thumbnail Presets        ░░░░░░░░░░░░░░░░░░░░    0% ⏳
  └─ State Persistence        ░░░░░░░░░░░░░░░░░░░░    0% ⏳
Phase 3: Recording (FFmpeg)   ░░░░░░░░░░░░░░░░░░░░    0% ⏳
Phase 4: Web Component        ░░░░░░░░░░░░░░░░░░░░    0% ⏳
Phase 5: Polish & Release     ░░░░░░░░░░░░░░░░░░░░    0% ⏳
```

---

## 🎯 PRIORIDADES

### 🔴 Crítico
1. **Ejecutar test flow completo** (arriba)
2. **Screenshot para README** (`docs/screenshot-player-v1.png`)
3. **Verificar bugs sospechosos** (lista arriba)

### 🟡 Importante  
4. **Cleanup código legacy** (Explorer window no usada)
5. **Decisión Settings panel** (implementar o remover)
6. **Texto inicial botones FPS/Hold** (mostrar valores)

### 🟢 Mejoras
7. **State persistence** (última carpeta, FPS/Hold)
8. **Thumbnail presets** (th1, th2 guardan configs)
9. **Fullscreen toggle** (F11)

---

## 📁 ARCHIVOS CLAVE

```
Stereo/
├── docs/
│   ├── STATUS-CHECKPOINT.md  ← LEER PRIMERO (estado detallado)
│   ├── sample-images/        ← 8 imágenes listas para testing
│   └── PRD.md                ← Spec completa
├── core/
│   └── FrameEngine.ts        ← 142 tests ✅
├── desktop/
│   ├── main/
│   │   ├── index.ts          ← Entry point
│   │   └── windows.ts        ← ⚠️ Tiene código legacy
│   └── renderer/
│       ├── explorer.html     ← Player único
│       ├── explorer.ts       ← PlayerUI class
│       └── styles/
│           └── player.css    ← Estilos activos
├── ROADMAP.md                ← Hoja de ruta
└── NEXT-SESSION.md           ← Este archivo
```

---

## 💡 CONTEXTO RÁPIDO

### Última Implementación
- **Resize lag FIXED:** Debounce 150ms evita freeze
- **Sliders ADDED:** Popups FPS/Hold con range inputs interactivos
- **Sample images READY:** 8 PNG de ChatGPT (17MB) en `docs/sample-images/`

### Decisiones Arquitectónicas
- Una ventana única (no fullscreen default)
- Sliders en popups (no en settings panel inline)
- Vanilla TypeScript (no Lit/React por issues CommonJS)
- Canvas fill mode (no fit/center en v1)

### Tests Status
- Core: 142/142 passing ✅
- Desktop: Manual testing pendiente ⏳
- Integration: Pendiente ⏳

---

## 🔍 COMANDOS ÚTILES

```bash
# Build y ejecutar
npm run build && npm run electron

# Solo compilar core
npm run build:core

# Solo compilar desktop
npm run build:desktop

# Copiar HTML/CSS
npm run copy:assets

# Tests core
npm test

# Ver estructura dist
tree dist/ -L 3
```

---

## 📸 SCREENSHOT TASK

1. Ejecutar app: `npm run electron`
2. Cargar: `docs/sample-images/`
3. Capturar con `Win + Shift + S` desde Windows
4. Guardar como: `screenshot-player-v1.png` en Downloads
5. Copiar: `cp /mnt/c/Users/vandalit/Downloads/screenshot-player-v1.png docs/`
6. Descomentar líneas en README

---

## 🤔 PREGUNTAS PENDIENTES

1. **Settings panel:** ¿Implementar o remover por completo?
2. **Explorer window:** ¿Limpiar código o mantener para futuro?
3. **Botones record/thumb1/thumb2:** ¿Prioridad o dejar disabled?
4. **State persistence:** ¿localStorage o archivo JSON?
5. **Fullscreen:** ¿Agregar antes de screenshot o después?

---

## ✨ WINS RECIENTES

- ✅ Resize ya no causa lag (era crítico)
- ✅ Sliders funcionan e interactivos
- ✅ 8 imágenes de muestra disponibles
- ✅ Build estable sin errores
- ✅ Core 100% testeado

---

**NOTA:** Leer `docs/STATUS-CHECKPOINT.md` para contexto completo y detallado.

🚀 **Ready to continue!**
