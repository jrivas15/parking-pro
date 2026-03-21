import { useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = ['cashCount']

interface CashCountState {
  counts: Record<number, number>
  base: number
}

const DEFAULT_STATE: CashCountState = {
  counts: {},
  base: 0,
}

const useCashCount = () => {
  const queryClient = useQueryClient()

  const { data } = useQuery<CashCountState>({
    queryKey: QUERY_KEY,
    queryFn: () => queryClient.getQueryData<CashCountState>(QUERY_KEY) ?? DEFAULT_STATE,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: DEFAULT_STATE,
  })

  const state = data ?? DEFAULT_STATE

  const setCount = (denom: number, value: number) => {
    queryClient.setQueryData<CashCountState>(QUERY_KEY, (prev) => ({
      ...(prev ?? DEFAULT_STATE),
      counts: {
        ...(prev ?? DEFAULT_STATE).counts,
        [denom]: Math.max(0, value),
      },
    }))
  }

  const inc = (denom: number) => setCount(denom, (state.counts[denom] ?? 0) + 1)

  const dec = (denom: number) => setCount(denom, (state.counts[denom] ?? 0) - 1)

  const setRaw = (denom: number, val: string) => {
    const n = parseInt(val)
    setCount(denom, isNaN(n) ? 0 : n)
  }

  const setBase = (value: number) => {
    queryClient.setQueryData<CashCountState>(QUERY_KEY, (prev) => ({
      ...(prev ?? DEFAULT_STATE),
      base: value,
    }))
  }

  const clear = () => {
    queryClient.setQueryData<CashCountState>(QUERY_KEY, { counts: {}, base: state.base })
  }

  return {
    counts: state.counts,
    base: state.base,
    inc,
    dec,
    setRaw,
    setBase,
    clear,
  }
}

export default useCashCount
