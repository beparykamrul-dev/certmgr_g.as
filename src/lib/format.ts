export function formatNumber(value: number | null | undefined): string { return typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat().format(value) : '—'; }
export function formatDate(value: string | null | undefined): string { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString(); }
