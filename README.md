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

The leaderboard under the ranks reads `flame.json`. A GitHub Action
(`.github/workflows/flame.yml`) rewrites it once a week and pushes it to `main`, which deploys it.

**How the count works** (`scripts/flame-count.mjs`, Node 20, no dependencies)
- Reads the owner of every skull from a free Ordinals indexer: `ordinals.com` by default, no key needed.
  To use another, set the repo variable `ORD_URL`, e.g. `https://api.hiro.so/ordinals/v1/inscriptions/{id}`.
- Each wallet earns 1,000 per skull and 5,000 for the Prime Skull, +10/20/30% for holding 3/5/10 skulls,
  times a streak multiplier: 1.0 the first week, +0.1 for each week held in a row, up to 1.5.
  A wallet holding nothing at a count loses its streak.
- The board ranks by lifetime Flame earned. Ties go to the longer streak, then to whoever held first.
- The Action wakes every 6 hours but only counts once a week, in a hidden 6-hour slot picked from the
  week number and the `FLAME_SALT` secret. Set that secret to any random text so the slot can't be guessed.
  *Actions → Flame count → Run workflow* with "force" counts immediately.

**Files to edit in `flame/`**
- `inscriptions.json` – the 221 skull inscription IDs in `skulls` and the Prime's in `prime`. Fill it at mint.
  While `skulls` is empty nothing is counted and the board shows its "first count" note.
- `exclude.json` – team, treasury and marketplace wallets to leave off the board, e.g. `["bc1p..."]`.
- `bonuses.json` – one-off Flame added on top, never multiplied:
  `[{ "wallet": "bc1p...", "flame": 2500, "reason": "Discord" }]`.
- `names.json` – opt-in display names: `{ "bc1p...": "Hexveil" }`.
- `state.json` and `history/` are written by the count. Leave them alone; each history file is that week's holdings.

## Also in this repo

- `wrangler.jsonc` and `.assetsignore` – the current Cloudflare Workers static-assets deploy from `main` (`npx wrangler dev` to preview locally).
- `_headers`, `404.html`, `robots.txt` – security headers, not-found page and crawler rules for that deploy.
- `img/` and `data.json` – the 221 etchings, the Prime Skull and their traits, kept for the reveal. `.assetsignore` keeps everything except the five previews unpublished; the page itself doesn't load them, since its images are inlined.
