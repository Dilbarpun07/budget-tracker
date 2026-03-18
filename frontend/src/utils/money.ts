export function toNumberAmount(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  return Number(value)
}

export function formatCurrency(amount: number): string {
  return amount.toFixed(2)
}

