# Solución Simple: Arreglar player.ts actual

## Estrategia

En lugar de refactorizar a componentes (que requiere bundler), vamos a:
1. Mantener el HTML actual (con los 11 botones)
2. Actualizar player.ts para conectar TODOS los elementos del HTML
3. Recuperar lógica funcional del commit 96cff37

## Elementos en HTML actual que necesitan conectarse:

```html
<!-- Botones en toolbar -->
<button id="btnFolder">      <!-- ✅ Existe -->
<button id="btnPrev">         <!-- ✅ Existe -->  
<button id="playPauseBtn">    <!-- ✅ Existe -->
<button id="btnNext">         <!-- ✅ Existe -->
<button id="stopBtn">         <!-- ✅ Existe -->
<button id="btnRecord">       <!-- ✅ Existe -->
<button id="thumb1">          <!-- ✅ Existe -->
<button id="thumb2">          <!-- ✅ Existe -->
<button id="btnFps">          <!-- ✅ Existe -->
<button id="btnHold">         <!-- ✅ Existe -->
<button id="btnSettings">     <!-- ✅ Existe -->

<!-- Popups de sliders -->
<div id="fpsPopup">           <!-- ✅ Existe -->
  <input id="fpsSlider">
  <span id="fpsValue">
</div>

<div id="holdPopup">          <!-- ✅ Existe -->
  <input id="holdSlider">
  <span id="holdValue">
</div>

<!-- Otros -->
<div id="frameCounter">       <!-- ✅ Existe (era frameInfo) -->
<canvas id="playerCanvas">    <!-- ✅ Existe -->
<div id="thumbSidebar">       <!-- ✅ Existe -->
```

## Tarea

Reescribir player.ts para:
1. Query todos estos elementos
2. Agregar event listeners
3. Conectar con FrameEngine
4. Recuperar lógica funcional (keyboard, resize, etc)

Tiempo estimado: 30 minutos
