
import { useState } from "react"
import { ChevronUp, ChevronDown, PencilLine, Printer, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import useCashCount from "./hooks/useCashCount"

import b100 from "@/assets/currencys/billete100.jpg"
import b50 from "@/assets/currencys/billete50.jpg"
import b20 from "@/assets/currencys/billete20.jpg"
import b10 from "@/assets/currencys/billete10.png"
import b5 from "@/assets/currencys/billete5.png"
import b2 from "@/assets/currencys/billete2.png"
import c1000 from "@/assets/currencys/moneda1000.png"
import c500 from "@/assets/currencys/moneda500.png"
import c200 from "@/assets/currencys/moneda200.png"
import c100 from "@/assets/currencys/moneda100.png"
import c50 from "@/assets/currencys/moneda50.png"

const DENOM_IMAGE: Record<number, string> = {
  100_000: b100,
  50_000: b50,
  20_000: b20,
  10_000: b10,
  5_000: b5,
  2_000: b2,
  1_000: c1000,
  500: c500,
  200: c200,
  100: c100,
  50: c50,
}

// ─── Denominations ────────────────────────────────────────────────────────────
const BILLS = [100_000, 50_000, 20_000, 10_000, 5_000, 2_000]
const COINS = [1_000, 500, 200, 100, 50]

const fmt = (n: number) =>
  "$" + n.toLocaleString("es-CO", { minimumFractionDigits: 1 })

// ─── Spinner input row ────────────────────────────────────────────────────────
interface DenomRowProps {
  denom: number
  count: number
  isBill?: boolean
  onInc: () => void
  onDec: () => void
  onChange: (v: string) => void
}

const DenomRow = ({ denom, count, isBill = false, onInc, onDec, onChange }: DenomRowProps) => (
  <div className="flex items-center gap-3">
    {isBill ? (
      <img
        src={DENOM_IMAGE[denom]}
        alt={`Billete ${denom}`}
        className="w-47 h-20 rounded-sm object-cover "
      />
    ) : (
      <img
        src={DENOM_IMAGE[denom]}
        alt={`Moneda ${denom}`}
        className="size-18 rounded-full object-cover shrink-0 "
      />
    )}

    {/* spinner */}
    <div className="flex items-center rounded-md border border-border overflow-hidden h-9">
      <Button
        tabIndex={-1}
        variant="ghost"
        size="icon"
        className="h-9 w-8 rounded-none border-r border-border shrink-0"
        onClick={onDec}
      >
        <ChevronDown size={13} />
      </Button>
      <input
        type="number"
        min={0}
        value={count}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 outline-none focus:border-none border-none  rounded-none text-center text-xl font-semibold shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        tabIndex={-1}
        variant="ghost"
        size="icon"
        className="h-9 w-8 rounded-none border-l border-border shrink-0"
        onClick={onInc}
      >
        <ChevronUp size={13} />
      </Button>
    </div>

    {/* subtotal */}
    <span className="text-sm text-muted-foreground w-24 text-right tabular-nums">
      {count > 0 ? fmt(count * denom) : "—"}
    </span>
  </div>
)

// ─── Dialog ───────────────────────────────────────────────────────────────────
interface CashCountDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

const CashCountDialog = ({ open, onOpenChange }: CashCountDialogProps) => {
  const { counts, base, inc, dec, setRaw, setBase, clear } = useCashCount()
  const [openBaseDialog, setOpenBaseDialog] = useState(false)
  const [baseInput, setBaseInput] = useState("")

  const handleSaveBase = () => {
    const n = parseInt(baseInput.replace(/\D/g, ""))
    if (!isNaN(n) && n >= 0) setBase(n)
    setOpenBaseDialog(false)
  }

  const total = [...BILLS, ...COINS].reduce((sum, d) => sum + (counts[d] ?? 0) * d, 0)
  const arqueo = total - base

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl w-full p-0 gap-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold tracking-wide">Arqueo de caja</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Registra el conteo físico de billetes y monedas
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Body */}
          <div className="flex gap-6 px-6 py-5">

            {/* Bills */}
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Billetes
              </span>
              <div className="flex flex-col gap-2">
                {BILLS.map((d) => (
                  <DenomRow
                    key={d}
                    denom={d}
                    count={counts[d] ?? 0}
                    isBill
                    onInc={() => inc(d)}
                    onDec={() => dec(d)}
                    onChange={(v) => setRaw(d, v)}
                  />
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="self-stretch" />

            {/* Coins */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Monedas
              </span>
              <div className="flex flex-col gap-2">
                {COINS.map((d) => (
                  <DenomRow
                    key={d}
                    denom={d}
                    count={counts[d] ?? 0}
                    onInc={() => inc(d)}
                    onDec={() => dec(d)}
                    onChange={(v) => setRaw(d, v)}
                  />
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Summary + actions footer */}
          <div className="px-6 py-4 flex items-center justify-between gap-6 bg-muted/40">

            {/* Totals */}
            <div className="flex flex-col gap-1 text-sm min-w-40">
              <div className="flex justify-between gap-6">
                <span className="text-muted-foreground">Total contado</span>
                <span className="font-semibold tabular-nums">{fmt(total)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-muted-foreground">Base</span>
                <span className="font-semibold tabular-nums">{fmt(base)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between gap-6">
                <span className="font-semibold">Arqueo</span>
                <span className={`font-bold tabular-nums ${arqueo < 0 ? "text-destructive" : "text-green-500"}`}>
                  {fmt(arqueo)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setBaseInput(base.toString()); setOpenBaseDialog(true) }}
              >
                <PencilLine size={14} />
                Definir base
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer size={14} />
                Imprimir
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => clear()}
              >
                <Trash2 size={14} />
                Limpiar
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground font-semibold"
                onClick={() => onOpenChange(false)}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Base dialog */}
      <Dialog open={openBaseDialog} onOpenChange={setOpenBaseDialog}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Definir base</DialogTitle>
            <DialogDescription>Monto inicial de caja en COP</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="base-input">Monto base</Label>
            <Input
              id="base-input"
              type="number"
              min={0}
              value={baseInput}
              onChange={(e) => setBaseInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveBase()}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenBaseDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveBase}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CashCountDialog
