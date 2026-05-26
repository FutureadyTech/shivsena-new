# Live Social Media Integration — Setup Guide

The "Stay Connected With Us" section uses a hybrid Tier 1 strategy:

| Platform | How it stays fresh | What you need |
|---|---|---|
| **YouTube** | Vercel serverless fn calls YouTube Data API v3 every hour | `YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID` |
| **Instagram** | Behold.so widget (free tier) | `VITE_BEHOLD_WIDGET_ID` |
| **Facebook** | Card links to official page | — already wired (URL in `src/config/socials.js`) |
| **X / Twitter** | Static quote card linking to profile | — already wired |
| **WhatsApp** | Channel link in footer / social rail | — already wired |

The section degrades gracefully — without any of the keys below set, you'll see the existing static cards (everything still links to the right profiles).

---

## 1. YouTube (live) — 5 minutes

### a. Create an API key
1. Go to <https://console.cloud.google.com/apis/credentials>.
2. Create a project if you don't have one (e.g. "Shiv Sena Website").
3. Enable the **YouTube Data API v3** in the API library.
4. Click **Create Credentials → API key**.
5. (Optional but recommended) Restrict the key to "YouTube Data API v3" only, and to your domain(s).

### b. Resolve your channel ID
The site's YouTube handle is `@shivsenaofc`. Resolve it once:

```
https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=shivsenaofc&key=YOUR_KEY
```

Copy the returned `id` (it starts with `UC…`).

### c. Set the env vars

**Locally** — create a `.env` file at the project root (already in `.gitignore`):

```
YOUTUBE_API_KEY=AIza...your-key...
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxx
```

**On Vercel** — Project → Settings → Environment Variables, add the same two keys.

Redeploy and `/api/youtube` will start returning live videos. The YouTube card in the SocialFeed section will now show the channel's most recent upload with a red **LIVE** pill.

---

## 2. Instagram (live) — 10 minutes

Instagram's official API is locked behind Facebook Business / Meta App Review.
We use **[Behold.so](https://behold.so)** instead — they handle the OAuth on their side and give you a small widget.

1. Sign up at <https://behold.so>.
2. Click **Connect Instagram → @shivsenaofc** and authorize.
3. Click **New Widget** → choose a grid layout (3 wide, 1 row works well for our card).
4. Copy the widget ID from the embed snippet (looks like `iuirHkkwjjxxxxxxx`).

Set the env var:

```
VITE_BEHOLD_WIDGET_ID=iuirHkkwjjxxxxxxx
```

(The `VITE_` prefix is required — only env vars with that prefix are exposed to the browser.)

That's it. The Instagram card in the SocialFeed will swap from a static curated tile to the live Behold grid (with its own LIVE pill).

**Free-tier limits:** 9 posts per widget, auto-refresh every 24h. Plenty for one card on a homepage.

---

## 3. Facebook (static link, optional live)

The Facebook card currently links to <https://facebook.com/Shivsenaofc>. That's the lowest-friction setup and works reliably.

If you ever want **live FB posts** in the card, you'd need:
1. A Facebook Page access token (via Meta App + Page review)
2. Add a `/api/facebook.js` serverless fn similar to `/api/youtube.js`
3. Update SocialFeed.jsx to consume it

This requires Meta App Review approval which can take 1–2 weeks. The current link-out card is the recommended approach unless you specifically need it.

---

## 4. X / Twitter

X's free API was removed in 2023. The basic paid tier starts at **$100/month**. The current card design uses a curated quote that links to <https://x.com/Shivsenaofc>.

If/when you want to rotate the quote, edit:

```
src/content/home.json  →  socialFeed → posts → (the twitter entry)
```

---

## File map

```
src/config/socials.js                       ← all 5 official URLs, single source of truth
api/youtube.js                              ← serverless fn for YouTube Data API
src/pages/Home/hooks/useYouTubeLatest.js    ← React hook that calls /api/youtube
src/pages/Home/sections/SocialFeed.jsx      ← the section itself, wired to all of the above
SOCIAL_SETUP.md                             ← this file
```

The Footer and SocialRail components also import from `src/config/socials.js`, so any URL change happens in one place.
