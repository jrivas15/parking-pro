export {};

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }

  interface ElectronAPI {
    getPrinters: () => Promise<{ name: string; displayName?: string }[]>;
    print: (payload: EntryPrintPayload | ExitPrintPayload) => Promise<{ ok: boolean; error?: string }>;
    testPrint: () => Promise<{ ok: boolean; error?: string }>;
    /** @deprecated use print() */
    printTicket: (data: unknown[], options: {
      printerName?: string;
      paperWidth?: string;
      preview?: boolean;
    }) => Promise<void>;
  }

  interface EntryPrintPayload {
    type: 'entry';
    movement: { nTicket: number; plate: string; vehicleType: string; entryTime: string };
    info: ParkingInfoForPrint;
  }

  interface ExitPrintPayload {
    type: 'exit';
    sale: {
      id: number;
      movement: {
        id: number;
        nTicket: number;
        plate: string;
        entryTime: string;
        exitTime: string;
        parkingTime: string;
        vehicleType: string;
        tariff: { id: number; name: string } | null;
      };
      discount: number;
      total: number;
      amountPaid: number;
      paymentMethod: { id: number; name: string } | null;
    };
    info: ParkingInfoForPrint;
  }

  interface ParkingInfoForPrint {
    name: string;
    nit?: string;
    address?: string;
    phone?: string;
    ticketHeader?: string;
    ticketFooter?: string;
    includeQRCode?: boolean;
    includeParkingInfo?: boolean;
    includeBasicRules?: boolean;
    printerName?: string;
    paperWidth?: string;
  }
}
