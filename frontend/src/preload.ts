// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  printTicket: (data: unknown[], options: unknown) =>
    ipcRenderer.invoke('print-ticket', data, options),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
});
