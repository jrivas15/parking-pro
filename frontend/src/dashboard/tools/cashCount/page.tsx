import { useState } from "react"
import CashCountDialog from "./CashCountDialog"
import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"

const CashCountPage = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground font-semibold gap-2"
      >
        <Calculator size={16} />
        Abrir arqueo
      </Button>
      <CashCountDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}

export default CashCountPage
