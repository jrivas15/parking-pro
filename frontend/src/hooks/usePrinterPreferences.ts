import { useState } from "react";

const STORAGE_KEY = "parking_printer_prefs";

export interface PrinterPreferences {
  printerName: string;
  paperWidth: "58" | "80";
  autoPrint: boolean;
  autoPrintEntry: boolean;
  autoPrintExit: boolean;
}

const DEFAULTS: PrinterPreferences = {
  printerName: "",
  paperWidth: "80",
  autoPrint: true,
  autoPrintEntry: true,
  autoPrintExit: true,
};

export const usePrinterPreferences = () => {
  const [prefs, setPrefsState] = useState<PrinterPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULTS;
    try {
      return { ...DEFAULTS, ...JSON.parse(stored) };
    } catch {
      return DEFAULTS;
    }
  });

  const setPrefs = (update: Partial<PrinterPreferences>) => {
    const newPrefs = { ...prefs, ...update };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    setPrefsState(newPrefs);
  };

  const toggleAutoPrint = () => setPrefs({ autoPrint: !prefs.autoPrint });

  return { prefs, setPrefs, toggleAutoPrint };
};
