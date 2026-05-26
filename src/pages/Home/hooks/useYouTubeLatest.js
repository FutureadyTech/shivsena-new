import { useEffect, useState } from 'react';

/**
 * Fetch latest YouTube uploads from /api/youtube (Vercel serverless).
 * Gracefully degrades — if the endpoint is missing or returns ok:false
 * (e.g. env vars not set on Vercel yet), it stays in `{ loading:false,
 * items:[], error:reason }` state so the UI can show a fallback.
 *
 * Cached in-memory across mounts so re-rendering the section doesn't
 * re-hit the function.
 */
let cache = null;
let inflight = null;

export function useYouTubeLatest(limit = 3) {
  const [state, setState] = useState(() =>
    cache ? { loading: false, items: cache.items, error: cache.error } : { loading: true, items: [], error: null }
  );

  useEffect(() => {
    if (cache) return;
    let cancelled = false;

    const run = async () => {
      try {
        inflight = inflight || fetch(`/api/youtube?limit=${limit}`).then((r) => r.json());
        const data = await inflight;
        if (cancelled) return;
        const items = data?.ok && Array.isArray(data.items) ? data.items : [];
        const error = data?.ok ? null : data?.reason || 'unknown';
        cache = { items, error };
        setState({ loading: false, items, error });
      } catch (err) {
        if (cancelled) return;
        cache = { items: [], error: String(err) };
        setState({ loading: false, items: [], error: String(err) });
      } finally {
        inflight = null;
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
