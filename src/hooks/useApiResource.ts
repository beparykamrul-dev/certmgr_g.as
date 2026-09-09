import { useCallback, useEffect, useState } from 'react';

export function useApiResource<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await loader()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Request failed'); }
    finally { setLoading(false); }
  }, [loader]);

  useEffect(() => { void reload(); }, [reload]);
  return { data, loading, error, reload };
}
