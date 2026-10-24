// Weekly Flame count: reads who holds each skull from an Ordinals indexer,
// scores every wallet and rewrites flame.json for the leaderboard.
// No dependencies; needs Node 20+. Run: node scripts/flame-count.mjs [--force]
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const ROOT = new URL('..', import.meta.url).pathname;
const read = f => JSON.parse(readFileSync(ROOT + f, 'utf8'));
const write = (f, v) => writeFileSync(ROOT + f, JSON.stringify(v, null, 2) + '\n');

// Rates from the "How Flame is earned" panel
const PER_SKULL = 1000, PER_PRIME = 5000;
const holdBonus = n => n >= 10 ? 0.3 : n >= 5 ? 0.2 : n >= 3 ? 0.1 : 0;
const streakMult = s => Math.min(1 + 0.1 * s, 1.5); // s = weeks held before this count

// Any ord server with the JSON API (ordinals.com is free, no key), or Hiro's
// https://api.hiro.so/ordinals/v1/inscriptions/{id}. Both return { address }.
const INDEXER = process.env.ORD_URL || 'https://ordinals.com/inscription/{id}';

const force = process.argv.includes('--force');
const now = new Date(process.env.FLAME_NOW || Date.now());

// ISO week label, e.g. 2026-W44
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
  return `${y}-W${String(w).padStart(2, '0')}`;
}

// The week is cut into 28 six-hour slots; a salted hash picks the snapshot slot,
// so nobody can borrow skulls just for a known count time.
const week = isoWeek(now);
const slotNow = ((now.getUTCDay() + 6) % 7) * 4 + Math.floor(now.getUTCHours() / 6);
const slotPick = createHash('sha256').update((process.env.FLAME_SALT || '') + week).digest()[0] % 28;

const state = read('flame/state.json');
if (!force && (state.lastWeek === week || slotNow < slotPick)) {
  console.log(`Not counting: week ${week}, slot ${slotNow}, count slot ${slotPick}, last count ${state.lastWeek || 'none'}`);
  process.exit(0);
}

const { prime, skulls } = read('flame/inscriptions.json');
if (!skulls.length) {
  console.log('No inscription IDs in flame/inscriptions.json yet, nothing to count.');
  process.exit(0);
}

async function owner(id) {
  for (let tries = 0; ; tries++) {
    const r = await fetch(INDEXER.replace('{id}', id), { headers: { accept: 'application/json' } });
    if (r.ok) return (await r.json()).address || null;
    if (tries >= 3) throw new Error(`Indexer ${r.status} for ${id}`);
    await new Promise(res => setTimeout(res, 2000 * (tries + 1)));
  }
}

// Fetch owners a few at a time to stay inside free rate limits
const ids = prime ? [...skulls, prime] : skulls;
const owners = new Map();
for (let i = 0; i < ids.length; i += 5) {
  const batch = ids.slice(i, i + 5);
  (await Promise.all(batch.map(owner))).forEach((a, j) => owners.set(batch[j], a));
}

const exclude = new Set(read('flame/exclude.json'));
const holdings = {};
for (const [id, addr] of owners) {
  if (!addr || exclude.has(addr)) continue;
  const h = holdings[addr] ||= { skulls: 0, prime: false };
  if (id === prime) h.prime = true; else h.skulls++;
}

const date = now.toISOString().slice(0, 10);
const wallets = state.wallets;
for (const w of Object.values(wallets)) w.week = 0;
for (const [addr, h] of Object.entries(holdings)) {
  const w = wallets[addr] ||= { earned: 0, streak: 0, since: date };
  const base = h.skulls * PER_SKULL + (h.prime ? PER_PRIME : 0);
  w.week = Math.round(base * (1 + holdBonus(h.skulls)) * streakMult(w.streak));
  w.earned += w.week;
  w.streak++;
}
// A wallet holding nothing at the count loses its streak
for (const [addr, w] of Object.entries(wallets)) if (!holdings[addr]) w.streak = 0;

state.lastWeek = week;
write('flame/state.json', state);
write(`flame/history/${date}.json`, { date, week, holdings });

// One-off bonuses (Discord, X chat, referrals) are added on top, never multiplied
const bonus = {};
for (const b of read('flame/bonuses.json')) bonus[b.wallet] = (bonus[b.wallet] || 0) + b.flame;

const names = read('flame/names.json');
const all = new Set([...Object.keys(wallets), ...Object.keys(bonus)]);
const holders = [...all].filter(a => !exclude.has(a)).map(a => {
  const w = wallets[a] || { earned: 0, streak: 0, week: 0, since: date };
  const h = holdings[a] || { skulls: 0, prime: false };
  return { wallet: a, ...(names[a] && { name: names[a] }), skulls: h.skulls + (h.prime ? 1 : 0),
    ...(h.prime && { prime: true }), streak: w.streak, week: w.week, flame: w.earned + (bonus[a] || 0), since: w.since };
}).filter(h => h.flame > 0)
  // Ties: longer streak first, then who held first
  .sort((a, b) => b.flame - a.flame || b.streak - a.streak || a.since.localeCompare(b.since))
  .map(({ since, ...h }) => h);

write('flame.json', { updated: date, holders });
console.log(`Counted ${week}: ${Object.keys(holdings).length} holding wallets, ${holders.length} on the board.`);
