# UI Next Iteration - Color & Controls

**Date:** 2026-11-01  
**Status:** Planned for next session  
**Inspiration:** Ableton Live, After Effects, Sony Vegas

---

## Current State ✅

**What's Working:**
- Minimal dark UI with clean layout
- Bottom toolbar with all essential buttons
- Right sidebar with thumbnails
- Collapsible settings panels
- Inline FPS/Hold sliders

**What Needs Enhancement:**
- ⚠️ Contrast too low (everything is gray)
- ⚠️ Sliders are basic HTML range inputs
- ⚠️ No visual feedback on values
- ⚠️ Lacks "pro tool" aesthetic

---

## Design Goals 🎨

### 1. Vibrant Acid Colors

**Inspiration:** Ableton Live's neon accents on dark background

**Color Palette Update:**
```css
/* Acids/Neons */
--acid-cyan: #00f0ff;      /* Primary accent */
--acid-magenta: #ff00aa;   /* Secondary accent */
--acid-yellow: #ffee00;    /* Warning/attention */
--acid-lime: #88ff00;      /* Success/active */
--acid-red: #ff0055;       /* Danger/record */

/* Backgrounds (keep dark) */
--bg-black: #0a0a0a;       /* Deeper black */
--bg-panel: #1a1a1a;       /* Panels */
--bg-element: #2a2a2a;     /* Buttons/controls */

/* Gradients for sliders */
--gradient-hot: linear-gradient(90deg, #000 0%, #ff0055 100%);
--gradient-cool: linear-gradient(90deg, #000 0%, #00f0ff 100%);
--gradient-warm: linear-gradient(90deg, #000 0%, #ffee00 100%);
```

**Usage:**
- Active buttons → Cyan glow
- Hover states → Magenta tint
- Play button → Lime when active
- Record button → Red when recording
- Frame counter → Cyan text
- Selected thumbnails → Cyan border

### 2. Slider Redesign (Dial + Bar)

**Inspiration:** Ableton's parameter controls, After Effects keyframe bars

**Visual Design:**
```
┌────────────────────────────────┐
│ FPS                      [60]  │ ← Label + value
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░ │ ← Gradient bar (0-120)
│              ◉                 │ ← Draggable dial/handle
└────────────────────────────────┘
```

**Specifications:**

**Bar:**
- Height: 4px
- Background: `#1a1a1a` (dark gray)
- Filled portion: Gradient (black → red-ish)
- 0% = pure black on gray
- 100% = full gradient visible

**Dial/Handle:**
- Circle: 12px diameter
- Fill: White with glow
- Border: 2px solid accent color
- Shadow: 0 0 8px rgba(accent, 0.6)
- Drag: Smooth with snap points

**Gradient Colors:**
- **FPS:** `#000 → #ff0055` (hot red-magenta)
- **Hold:** `#000 → #00f0ff` (cool cyan)
- **Other sliders:** `#000 → #ffee00` (warm yellow)

**Behavior:**
- Click anywhere on bar → jump to position
- Drag dial → smooth movement
- Scroll on slider → increment/decrement
- Double-click value → type exact number

### 3. Enhanced Visual Feedback

**Glow Effects:**
```css
/* Active button glow */
.tb-btn.active {
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.6),
              inset 0 0 8px rgba(0, 240, 255, 0.3);
  border-color: #00f0ff;
  color: #00f0ff;
}

/* Hover glow */
.tb-btn:hover {
  box-shadow: 0 0 8px rgba(255, 0, 170, 0.4);
  border-color: #ff00aa;
}
```

**Status Indicators:**
- Recording: Pulsing red glow
- Playing: Steady cyan glow
- Loading: Animated gradient sweep

### 4. Typography Enhancement

**Monospace with Style:**
- Font: `'JetBrains Mono', 'Fira Code', 'SF Mono', monospace`
- Sizes: Keep current (9-12px)
- Colors: Use acid colors for emphasis
- Weight: 500 (medium) for active states

---

## Implementation Plan

### Phase 1: Color System (30 min)
- [ ] Create `styles/variables.css` with new color palette
- [ ] Update all button hover/active states with glows
- [ ] Add acid colors to active elements
- [ ] Test contrast ratios for accessibility

### Phase 2: Slider Component (1 hour)
- [ ] Create custom slider HTML structure
- [ ] CSS for gradient bar (black → colored)
- [ ] CSS for draggable dial with glow
- [ ] JavaScript for drag/click interactions
- [ ] Smooth easing and snap points

### Phase 3: Visual Polish (30 min)
- [ ] Add glow effects to active states
- [ ] Pulsing animation for record button
- [ ] Smooth transitions (150-200ms)
- [ ] Test all interactive states

### Phase 4: Testing (15 min)
- [ ] Test slider drag performance
- [ ] Verify color contrast
- [ ] Check glow effects don't cause lag
- [ ] Test on different screen sizes

---

## Reference Screenshots

**Ableton Live:**
- Neon cyan/magenta on black
- Circular dials with value bars
- Subtle glows on active elements
- Clear visual hierarchy

**After Effects:**
- Gradient progress bars
- Keyframe timeline aesthetics
- Sharp contrast with pops of color
- Professional yet vibrant

**Sony Vegas:**
- Colored timeline tracks
- Gradient volume meters
- Clean button design
- High contrast UI

---

## Technical Notes

### Custom Slider Implementation

```html
<div class="custom-slider">
  <label>fps</label>
  <div class="slider-container">
    <div class="slider-track">
      <div class="slider-fill" style="width: 50%"></div>
    </div>
    <div class="slider-dial" style="left: 50%"></div>
  </div>
  <span class="slider-value">60</span>
</div>
```

```css
.slider-track {
  height: 4px;
  background: #1a1a1a;
  border-radius: 2px;
  position: relative;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(90deg, #000 0%, #ff0055 100%);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.slider-dial {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #ff0055;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px rgba(255, 0, 85, 0.6);
  cursor: grab;
}

.slider-dial:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.2);
}
```

### Performance Considerations

- Use `transform` instead of `left/top` for dial position
- Debounce drag events (16ms = 60fps)
- Use `will-change: transform` for smooth animations
- Avoid box-shadow on too many elements (performance hit)

---

## Color Psychology

**Why these colors work:**
- **Cyan (#00f0ff):** Technical, precise, active
- **Magenta (#ff00aa):** Creative, energetic, hover
- **Red (#ff0055):** Attention, recording, danger
- **Lime (#88ff00):** Success, playing, go
- **Yellow (#ffee00):** Warning, attention, highlight

**Contrast:**
- Dark backgrounds make neons pop
- High contrast = professional tool aesthetic
- Minimal color use = maximum impact

---

## Success Criteria

✅ **Visual Impact:**
- UI looks like a professional creative tool
- Colors pop without being overwhelming
- Clear visual hierarchy

✅ **Usability:**
- Sliders are intuitive and precise
- Active states are immediately obvious
- Hover feedback is responsive

✅ **Performance:**
- No lag when dragging sliders
- Smooth 60fps animations
- Quick response to all interactions

---

## Files to Modify

```
desktop/renderer/
├── styles/
│   ├── variables.css          ← NEW: Color system
│   ├── slider.css             ← NEW: Custom slider
│   ├── player.css             ← UPDATE: Apply colors
│   └── explorer.css           ← UPDATE: Apply colors
├── components/
│   └── Slider.js              ← NEW: Slider logic
├── player.html                ← UPDATE: Use custom sliders
└── player.js                  ← UPDATE: Slider interactions
```

---

**Next session:** Implement vibrant color system + custom dial sliders 🎨🔥
