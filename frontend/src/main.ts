import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { printTicket } from './main/printer';
import { generateQR } from './main/qr';
import { buildEntryHTML, buildExitHTML, buildCashCountHTML, buildExpenseHTML, buildExpensesSummaryHTML } from './main/ticketTemplate';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: app.isPackaged
      ? path.join(process.resourcesPath, 'icon.ico')
      : path.join(__dirname, '../../src/assets/icons/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC: Get available printers
ipcMain.handle('get-printers', async () => {
  const win = BrowserWindow.getAllWindows()[0];
  if (!win) return [];
  return win.webContents.getPrintersAsync();
});

// IPC: Print ticket (hidden-window approach)
ipcMain.handle('printer:print', async (_event, payload: EntryPrintPayload | ExitPrintPayload) => {
  const { info } = payload;
  let htmlContent: string;

  if (payload.type === 'entry') {
    const qrDataUrl = info.includeQRCode ? await generateQR(payload.movement.plate) : undefined;
    htmlContent = buildEntryHTML(payload, qrDataUrl);
  } else {
    const qrDataUrl = info.includeQRCode ? await generateQR(payload.sale.movement.plate) : undefined;
    htmlContent = buildExitHTML(payload, qrDataUrl);
  }

  return printTicket(htmlContent, info.printerName ?? '', info.paperWidth ?? '80');
});

// IPC: Print cash count (arqueo)
ipcMain.handle('printer:cashCount', async (_event, payload: CashCountPayload) => {
  const htmlContent = buildCashCountHTML(payload);
  return printTicket(htmlContent, payload.info.printerName ?? '', payload.info.paperWidth ?? '80');
});

// IPC: Print individual expense
ipcMain.handle('printer:expense', async (_event, payload: ExpensePrintPayload) => {
  const htmlContent = buildExpenseHTML(payload);
  return printTicket(htmlContent, payload.info.printerName ?? '', payload.info.paperWidth ?? '80');
});

// IPC: Print expenses summary
ipcMain.handle('printer:expensesSummary', async (_event, payload: ExpensesSummaryPayload) => {
  const htmlContent = buildExpensesSummaryHTML(payload);
  return printTicket(htmlContent, payload.info.printerName ?? '', payload.info.paperWidth ?? '80');
});

// IPC: Test print
ipcMain.handle('printer:test', async () => {
  const testPayload: EntryPrintPayload = {
    type: 'entry',
    movement: { nTicket: 1, plate: 'ABC123', vehicleType: 'C', entryTime: new Date().toISOString() },
    info: { name: 'Test Parqueadero', paperWidth: '80' },
  };
  const htmlContent = buildEntryHTML(testPayload);
  return printTicket(htmlContent, '', '80');
});
