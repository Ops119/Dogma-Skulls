# Dogma-Skulls

Static site for Dogma-Skulls: 221 geometric Bitcoin skull etchings plus the Prime Skull 1/1.

No build step. Deploy the repository root as-is (Cloudflare Pages: framework preset "None", build command empty, output directory `/`).

## Layout

- `index.html`, `styles.css`, `app.js` – the full site (gallery with filters, lightbox, lore, Flame, join links)
- `config.js` – site settings: mint status/date/URLs, social links, Prime Skull state. Edit and redeploy.
- `data.json` – traits (palette, style, effect) for the 221 etchings
- `img/` – `1.jpg`–`221.jpg` (400×400) and `featured-1of1.jpg`
- `_headers` – Cloudflare Pages security and cache headers
- `404.html`, `robots.txt`, icons, `og-image.jpg`
- `teaser.html` – self-contained single-file teaser page (images inlined), served at `/teaser`

## Before launch

- Replace `https://example.com` in the `og:image` / `twitter:image` tags in `index.html` with the real domain.
- Fill in the FAQ answer "Which piece will I get?".
- Set `xUrl`, `mintUrl`, `allowlistUrl`, `marketplaceUrl` in `config.js` when available.
