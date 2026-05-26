/**
 * Vercel serverless function — returns the latest YouTube uploads from the
 * Shiv Sena channel. Lives at /api/youtube.
 *
 * Required env vars (set in Vercel dashboard or local .env):
 *   YOUTUBE_API_KEY      — A Google Cloud API key with "YouTube Data API v3" enabled.
 *                          Create at https://console.cloud.google.com/apis/credentials
 *   YOUTUBE_CHANNEL_ID   — The channel ID (starts with "UC..."). Resolve once from
 *                          the @handle via:
 *                          https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=shivsenaofc&key=YOUR_KEY
 *                          Then paste the returned id here.
 *
 * Caching: 1 hour on the CDN edge, 6 hours stale-while-revalidate.
 * Keeps API quota usage tiny (YouTube Data API gives 10,000 units/day free).
 */
export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const maxResults = Number(req.query.limit) || 3;

  if (!apiKey || !channelId) {
    return res.status(200).json({
      ok: false,
      reason: 'Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID env var',
      items: [],
    });
  }

  try {
    /* search.list (order=date) is the cheapest way to get recent uploads.
       Costs 100 quota units per call → fine even hourly. */
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('order', 'date');
    url.searchParams.set('type', 'video');
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('key', apiKey);

    const r = await fetch(url.toString());
    if (!r.ok) {
      const text = await r.text();
      return res.status(200).json({ ok: false, reason: `YouTube API ${r.status}`, detail: text, items: [] });
    }
    const data = await r.json();

    const items = (data.items || []).map((it) => ({
      id: it.id?.videoId,
      title: it.snippet?.title || '',
      description: it.snippet?.description || '',
      publishedAt: it.snippet?.publishedAt || '',
      channelTitle: it.snippet?.channelTitle || '',
      thumbnail:
        it.snippet?.thumbnails?.maxres?.url ||
        it.snippet?.thumbnails?.high?.url ||
        it.snippet?.thumbnails?.medium?.url ||
        it.snippet?.thumbnails?.default?.url ||
        '',
      url: it.id?.videoId ? `https://www.youtube.com/watch?v=${it.id.videoId}` : '',
    }));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=21600');
    return res.status(200).json({ ok: true, items });
  } catch (err) {
    return res.status(200).json({ ok: false, reason: 'fetch_failed', detail: String(err), items: [] });
  }
}
