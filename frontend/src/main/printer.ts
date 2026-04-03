import { BrowserWindow } from 'electron';

export function printTicket(
  htmlContent: string,
  printerName: string,
  paperWidth: string,
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const win = new BrowserWindow({ show: false, webPreferences: { javascript: false } });

    const timeout = setTimeout(() => {
      win.close();
      resolve({ ok: false, error: 'timeout' });
    }, 5000);

    win.webContents.on('did-finish-load', () => {
      clearTimeout(timeout);
      win.webContents.print(
        {
          silent: true,
          printBackground: true,
          deviceName: printerName,
          pageSize:
            paperWidth === '58'
              ? { width: 58000, height: 300000 }
              : { width: 80000, height: 300000 },
          margins: { marginType: 'none' },
          copies: 1,
        },
        (success, errorType) => {
          win.close();
          resolve(success ? { ok: true } : { ok: false, error: errorType });
        },
      );
    });

    win.webContents.on('did-fail-load', (_event, _code, desc) => {
      clearTimeout(timeout);
      win.close();
      resolve({ ok: false, error: desc });
    });

    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  });
}
