# Dogma-Skulls

*Bitcoin skulls, etched into the Divine.*

221 geometric Bitcoin skull etchings in black, white and orange, plus one 1/1 Prime Skull.
This repo is the project website: a single self-contained page (`index.html`) with the
lore, five previews and the **Flame** soft-staking rewards.

- Discord: https://discord.gg/45fr4KVn
- Telegram: https://t.me/Its_Hexveil
- X chat: https://x.com/i/chat/group_join/g2113898521510236257/j8NEC8AR1s

## Host it

**GitHub Pages**
1. Push this folder to a GitHub repository.
2. Settings → Pages → *Deploy from a branch* → branch `main`, folder `/ (root)` → Save.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

**Cloudflare**
- *Drag and drop:* Workers & Pages → Create application → Get started → Drag and drop
  your files → upload this folder (or the `index.html` file) → Deploy.
- *From GitHub:* connect the repo, leave the build command empty and set the output
  directory to `/`.

## Edit it

Everything lives in `index.html`: the lore is in the `lore` section, the reward rates are
in the `flame` section, and the buttons link to the Discord, Telegram and X chat above.
The page has no prices, no trackers and nothing to build.

### Flame leaderboard

The leaderboard under the ranks reads `flame.json` from the site root. After each weekly
count, replace its contents and push to `main`:

```json
{
  "updated": "2026-11-02",
  "holders": [
    { "wallet": "bc1p...", "name": "optional display name", "skulls": 3, "flame": 12500 }
  ]
}
```

Holders are sorted by `flame`; the top 25 are shown, and anyone can search for their
wallet or name to see their place. Ranks (Spark, Ember, Flame, Inferno) are worked out
from the thresholds on the page. While `holders` is empty, the page shows a
"first count after the gates open" note instead.

*Flame points have no cash value and cannot be traded or sold. Rates and rewards may change.*

## Also in this repo

- `wrangler.jsonc` and `.assetsignore` – the current Cloudflare Workers static-assets deploy from `main` (`npx wrangler dev` to preview locally).
- `_headers`, `404.html`, `robots.txt` – security headers, not-found page and crawler rules for that deploy.
- `img/` and `data.json` – the 221 etchings, the Prime Skull and their traits, kept for the reveal. `.assetsignore` keeps everything except the five previews unpublished; the page itself doesn't load them, since its images are inlined.
