# Test Simple - Estado Crítico

## Problema
Ningún botón funciona en Explorer window. Estamos en punto 0.

## Diagnóstico Necesario

1. **¿El JS se carga?** 
   - Abrir DevTools (F12) en Explorer
   - Ver Console tab
   - ¿Hay errores?

2. **¿El preload funciona?**
   - En Console escribir: `window.stereoAPI`
   - Debe mostrar un objeto con métodos
   - Si es `undefined` → preload bridge roto

3. **¿Los event listeners se adjuntan?**
   - En Console escribir: `document.getElementById('btnFolder')`
   - Debe mostrar el elemento
   - Click manual en consola: `document.getElementById('btnFolder').click()`

## Posibles Causas

A) **Preload bridge no funciona** → `window.stereoAPI` undefined
B) **JS no se ejecuta** → errores en console
C) **Event listeners no se adjuntan** → script carga tarde
D) **IPC roto** → main process no responde

## Próximo Paso

Usuario debe:
1. Abrir DevTools (F12 o Ctrl+Shift+I)
2. Ir a Console tab
3. Reportar qué ve (errores, warnings)
4. Escribir `window.stereoAPI` y reportar resultado
