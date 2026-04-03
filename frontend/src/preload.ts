// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  print: (payload: unknown) => ipcRenderer.invoke('printer:print', payload),
  testPrint: () => ipcRenderer.invoke('printer:test'),
  /** @deprecated use print() */
  printTicket: (data: unknown[], options: unknown) =>
    ipcRenderer.invoke('print-ticket', data, options),
});
