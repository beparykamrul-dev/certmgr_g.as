export async function getJson<T>(url: string, timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } finally { clearTimeout(timer); }
}
