const STORAGE_KEY = 'parking_cash_count'

const BILLS = [100_000, 50_000, 20_000, 10_000, 5_000, 2_000]
const COINS = [1_000, 500, 200, 100, 50]

export { BILLS, COINS }

interface CashCountState {
  counts: Record<number, number>
  base: number
}

const DEFAULT_STATE: CashCountState = { counts: {}, base: 0 }

const load = (): CashCountState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_STATE
  }
}

const save = (state: CashCountState) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

import { useState } from 'react'

const useCashCount = () => {
  const [state, setState] = useState<CashCountState>(load)

  const update = (next: CashCountState) => {
    save(next)
    setState(next)
  }

  const setCount = (denom: number, value: number) =>
    update({ ...state, counts: { ...state.counts, [denom]: Math.max(0, value) } })

  const inc = (denom: number) => setCount(denom, (state.counts[denom] ?? 0) + 1)
  const dec = (denom: number) => setCount(denom, (state.counts[denom] ?? 0) - 1)
  const setRaw = (denom: number, val: string) => {
    const n = parseInt(val)
    setCount(denom, isNaN(n) ? 0 : n)
  }

  const setBase = (value: number) => update({ ...state, base: value })

  const clear = () => update({ counts: {}, base: state.base })

  const total = [...BILLS, ...COINS].reduce((s, d) => s + (state.counts[d] ?? 0) * d, 0)
  const arqueo = total - state.base

  return {
    counts: state.counts,
    base: state.base,
    total,
    arqueo,
    inc,
    dec,
    setRaw,
    setBase,
    clear,
  }
}

export default useCashCount
