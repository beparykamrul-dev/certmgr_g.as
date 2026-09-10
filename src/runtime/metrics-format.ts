export function prometheusGauge(name: string, help: string, value: number): string {
  if (!Number.isFinite(value)) throw new Error('metric_value_invalid');
  const safeName = name.replace(/[^a-zA-Z0-9_:]/g, '_');
  const safeHelp = help.replace(/[\r\n]/g, ' ');
  return `# HELP ${safeName} ${safeHelp}\n# TYPE ${safeName} gauge\n${safeName} ${value}\n`;
}
