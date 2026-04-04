import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { usePrinterPreferences } from "@/hooks/usePrinterPreferences";

const PrinterSettingsPage = () => {
  const { prefs, setPrefs } = usePrinterPreferences();
  const [printers, setPrinters] = useState<
    { name: string; displayName?: string }[]
  >([]);

  useEffect(() => {
    window.electronAPI?.getPrinters().then((list) => setPrinters(list ?? []));
  }, []);

  return (
    <PageLayout>
      <header className="flex items-center gap-2">
        <BackBtn />
        <div>
          <h1 className="text-2xl font-bold">Impresora</h1>
          <span className="text-sm text-muted-foreground">
            Configura la impresora para tickets de entrada y salida
          </span>
        </div>
      </header>
      <Separator className="my-2" />

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="text-primary" /> Configuración de impresora
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Impresora</Label>
            <Select
              value={prefs.printerName ?? ""}
              onValueChange={(v) => setPrefs({ printerName: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar impresora..." />
              </SelectTrigger>
              <SelectContent>
                {printers.length === 0 && (
                  <SelectItem value="_none" disabled>
                    Sin impresoras detectadas
                  </SelectItem>
                )}
                {printers.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.displayName ?? p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Ancho de papel</Label>
            <Select
              value={prefs.paperWidth ?? "80"}
              onValueChange={(v) =>
                setPrefs({ paperWidth: v as "58" | "80" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="58">58 mm</SelectItem>
                <SelectItem value="80">80 mm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <p className="text-sm font-medium">Impresión automática</p>

          <div className="flex items-center justify-between">
            <div>
              <Label>Ticket de entrada</Label>
              <p className="text-xs text-muted-foreground">
                Imprime automáticamente al registrar un ingreso
              </p>
            </div>
            <Switch
              checked={prefs.autoPrintEntry}
              onCheckedChange={(v) => setPrefs({ autoPrintEntry: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Ticket de salida</Label>
              <p className="text-xs text-muted-foreground">
                Imprime automáticamente al registrar una salida
              </p>
            </div>
            <Switch
              checked={prefs.autoPrintExit}
              onCheckedChange={(v) => setPrefs({ autoPrintExit: v })}
            />
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default PrinterSettingsPage;
