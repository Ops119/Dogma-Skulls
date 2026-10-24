# Dogma-Skulls

Static site for Dogma-Skulls: 221 geometric Bitcoin skull etchings plus the Prime Skull 1/1.

No build step. Deployed on Cloudflare (Workers static assets) from `main`: `wrangler.jsonc` serves the repository root, minus what `.assetsignore` lists. Local preview: `npx wrangler dev`.

## Layout

- `index.html`, `styles.css`, `app.js` – the site (hero, lore, five previews, Flame, join links, FAQ)
- `config.js` – site settings: mint status/date/URLs, social links. Edit and redeploy.
- `data.json` – traits (palette, style, effect) for the 221 etchings; kept for the reveal, not published
- `img/` – `1.jpg`–`221.jpg` (400×400) and `featured-1of1.jpg`. Only the five previews (#105, #21, #86, #49, #14) are published; `.assetsignore` holds back the rest, including the Prime Skull
- `_headers` – Cloudflare Pages security and cache headers
- `404.html`, `robots.txt`, icons and `og-image.jpg` (made from preview #105)
- `teaser.html` – self-contained single-file teaser page (images inlined), served at `/teaser`

## Before launch

- Replace `https://example.com` in the `og:image` / `twitter:image` tags in `index.html` with the real domain.
- Fill in the FAQ answer "Which piece will I get?".
- Set `xUrl`, `mintUrl`, `allowlistUrl`, `marketplaceUrl` in `config.js` when available.
