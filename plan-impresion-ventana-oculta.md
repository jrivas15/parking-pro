# Plan: Impresión Térmica con Ventana Oculta HTML — Electron + React

## Por qué ventana oculta

- Cero módulos nativos → no requiere `electron-rebuild`
- Layout con CSS completo (flexbox, fuentes, QR como `<img>`)
- Funciona con cualquier impresora que tenga driver instalado en el sistema
- Migración a TCP/IP posible agregando un módulo aparte sin tocar este código

---

## Arquitectura general

```
React (Renderer)
  └── usePrinter hook
        └── window.printerAPI.print(data)   ← via contextBridge
              └── IPC: 'printer:print'
                    └── main/printer.js
                          ├── BrowserWindow oculta
                          ├── Carga HTML del ticket
                          └── webContents.print() → Driver USB → Térmica
```

---

## Fase 1 — Preload y bridge IPC

### Tareas
- [ ] Agregar en `preload.js` la API expuesta al renderer:
  ```js
  contextBridge.exposeInMainWorld('printerAPI', {
    getList: ()     => ipcRenderer.invoke('printer:getList'),
    print:   (data) => ipcRenderer.invoke('printer:print', data),
    test:    ()     => ipcRenderer.invoke('printer:test'),
  });
  ```
- [ ] Verificar que `contextIsolation: true` y `nodeIntegration: false` están activos en `webPreferences`

### Entregable
`window.printerAPI` disponible en DevTools del renderer sin errores.

---

## Fase 2 — Módulo de impresión (`main/printer.js`)

### Tareas
- [ ] Crear `src/main/printer.js` con dos funciones principales:

  **`getPrinters(mainWindow)`**
  - Llama `mainWindow.webContents.getPrintersAsync()`
  - Retorna lista con `{ name, displayName, isDefault }`

  **`printTicket(ticketData)`**
  - Crea `BrowserWindow` con `show: false`
  - Carga el HTML del ticket via `loadURL('data:text/html;...')`
  - Escucha `did-finish-load` y llama `webContents.print(options, callback)`
  - Cierra la ventana al terminar (éxito o error)
  - Retorna `{ ok: true }` o `{ ok: false, error: string }`

- [ ] Opciones de impresión a configurar:
  ```js
  {
    silent: true,
    printBackground: true,
    deviceName: ticketData.printerName,
    pageSize: { width: 80000, height: 250000 }, // micrones (80mm ancho)
    margins: { marginType: 'none' },
    copies: 1,
  }
  ```
- [ ] Manejo de errores:
  - Timeout si `did-finish-load` no dispara en 5s
  - Capturar `did-fail-load` para errores de carga del HTML
  - Catch del callback de `print()` con el `errorType` de Electron

### Entregable
Función `printTicket()` probada desde el main process que imprime en la térmica.

---

## Fase 3 — HTML del ticket (`main/ticketTemplate.js`)

### Tareas
- [ ] Crear `src/main/ticketTemplate.js` con la función `buildTicketHTML(data)`
- [ ] Estructura del ticket:

  ```
  ┌─────────────────────────┐
  │     NOMBRE EMPRESA      │  ← bold, centrado, grande
  │   NIT: 900.123.456-7   │
  │  Cra 5 #12-34, Cali    │
  │   Tel: (602) 555-0000  │
  │- - - - - - - - - - - - │
  │    TIQUETE DE PARQUEO   │
  │ Recibo N°:       00123  │
  │ Placa:         ABC-123  │
  │ Tipo:             Carro │
  │- - - - - - - - - - - - │
  │ Entrada: 03/04/2026     │
  │ Hora:          10:35 AM │
  │- - - - - - - - - - - - │
  │        [QR CODE]        │
  │       00123-ABC123      │  ← texto bajo el QR
  │- - - - - - - - - - - - │
  │   Conserve este tiquete │
  │  No nos responsabiliza- │
  │  mos por objetos olvi-  │
  │  dados en el vehículo   │
  └─────────────────────────┘
  ```

- [ ] CSS crítico para térmica:
  ```css
  @page { size: 80mm auto; margin: 0; }
  body  { width: 72mm; font-family: 'Courier New', monospace; font-size: 11px; }
  ```
- [ ] QR: recibir `qrDataUrl` (base64 PNG) e insertarlo como `<img>`
- [ ] Todos los datos del ticket como parámetros del objeto `data`:
  ```js
  {
    empresa, nit, direccion, telefono,
    recibo, placa, tipoVehiculo,
    fechaEntrada, horaEntrada,
    qrDataUrl,   // base64
    footer,
    printerName,
  }
  ```

### Entregable
HTML que al abrirse en el navegador se ve correctamente en 80mm de ancho.

---

## Fase 4 — Generación del QR

### Tareas
- [ ] Instalar librería QR (sin módulos nativos):
  ```bash
  npm install qrcode
  ```
- [ ] Generar el QR en el **main process** antes de imprimir:
  ```js
  const QRCode = require('qrcode');
  const qrDataUrl = await QRCode.toDataURL(reciboId, { width: 150, margin: 1 });
  ```
- [ ] Definir qué codifica el QR — opciones:
  - Solo el ID del recibo: `"00123"`
  - Placa + timestamp: `"ABC123|2026-04-03T10:35:00"`
  - URL de consulta: `"https://parqueadero.com/recibo/00123"`

### Entregable
QR visible e impreso en el ticket que al escanearse muestre la info correcta.

---

## Fase 5 — IPC handlers en `main.js`

### Tareas
- [ ] Registrar los tres handlers:
  ```js
  ipcMain.handle('printer:getList', () => getPrinters(mainWindow));

  ipcMain.handle('printer:print', async (_, data) => {
    const qrDataUrl = await generateQR(data.recibo);
    return printTicket({ ...data, qrDataUrl });
  });

  ipcMain.handle('printer:test', () =>
    printTicket({ ...ticketDePrueba, printerName: configStore.get('printerName') })
  );
  ```
- [ ] Importar `getPrinters` y `printTicket` desde `main/printer.js`
- [ ] Importar `generateQR` desde `main/qr.js`

### Entregable
Los tres handlers responden correctamente llamados desde DevTools.

---

## Fase 6 — Hook React (`usePrinter.js`)

### Tareas
- [ ] Crear `src/renderer/hooks/usePrinter.js` con:
  - `printers` → lista de impresoras del sistema
  - `selectedPrinter` / `setSelectedPrinter` → impresora activa
  - `printing` → boolean de estado
  - `error` → string con mensaje de error
  - `print(ticketData)` → función principal
  - `testPrint()` → dispara ticket de prueba
- [ ] Al montar, cargar lista de impresoras y pre-seleccionar:
  - La guardada en config (si existe)
  - O la primera que matchee `/thermal|pos|epson|bixolon|star/i`
  - O la impresora por defecto del sistema

### Entregable
Hook funcional con estado reactivo listo para usar en cualquier componente.

---

## Fase 7 — Componente UI y configuración

### Tareas
- [ ] `PrintTicketButton.jsx` — uso en el flujo de entrada de vehículo:
  ```jsx
  <PrintTicketButton ticket={vehiculoActual} />
  ```
  - Botón principal "🖨️ Imprimir Ticket"
  - Spinner mientras imprime
  - Toast/alerta en caso de error

- [ ] `PrinterSettings.jsx` — pantalla o modal de configuración:
  - Selector de impresora (dropdown con lista del sistema)
  - Botón "Imprimir ticket de prueba"
  - Guardar selección con `electron-store`:
    ```bash
    npm install electron-store
    ```

### Entregable
Flujo completo: entrada de vehículo → clic en botón → ticket impreso.

---

## Fase 8 — Pruebas y ajustes de layout

### Tareas
- [ ] Probar en papel real de 58mm y 80mm (ajustar CSS si es necesario)
- [ ] Verificar corte automático de papel (depende del driver)
- [ ] Ajustar `height` en `pageSize` si el ticket sale cortado o con espacio extra
- [ ] Probar reconexión USB (desconectar y reconectar la impresora en caliente)
- [ ] Verificar que la ventana oculta no aparece en el taskbar

---

## Orden de implementación

```
Fase 1 → Fase 2 → Fase 3 → Fase 5 → Fase 4 → Fase 6 → Fase 7 → Fase 8
```

> Fase 4 (QR) se puede dejar para después de tener el ticket básico funcionando.

---

## Dependencias

| Paquete | Para qué | Requiere rebuild |
|---|---|---|
| `qrcode` | Generar QR como base64 | ❌ No |
| `electron-store` | Persistir config de impresora | ❌ No |

> Sin módulos nativos = sin `electron-rebuild`. Instalación limpia con solo `npm install`.
