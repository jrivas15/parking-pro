export {};

declare global {
  interface Window {
    electronAPI?: {
      printTicket: (data: unknown[], options: {
        printerName?: string;
        paperWidth?: string;
        preview?: boolean;
      }) => Promise<void>;
      getPrinters: () => Promise<{ name: string; displayName?: string }[]>;
    };
  }
}
