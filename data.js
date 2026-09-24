/* Shared by the store (index.html) and every game page (game_pages/*.html):
   the catalogue, the saved state and a few small helpers. */

/* ---------- data (prices in cents, base = list price) ---------- */
const SHAPES = {
  sun: () => `<circle cx="230" cy="58" r="44"/><rect x="0" y="100" width="320" height="6"/><rect x="0" y="114" width="320" height="10"/><rect x="0" y="132" width="320" height="18"/>`,
  tri: () => `<path d="M0 150 L90 30 L180 150Z"/><path d="M120 150 L210 50 L300 150Z" opacity=".6"/>`,
  grid: () => Array.from({ length: 8 }, (_, i) => `<rect x="${i * 44}" y="0" width="2" height="150"/>`).join('') + Array.from({ length: 5 }, (_, i) => `<rect x="0" y="${i * 34}" width="320" height="2"/>`).join('') + `<circle cx="210" cy="72" r="28"/>`,
  wave: () => `<path d="M0 90 Q40 50 80 90 T160 90 T240 90 T320 90 V150 H0Z"/><path d="M0 118 Q40 88 80 118 T160 118 T240 118 T320 118 V150 H0Z" opacity=".6"/>`,
  blocks: () => `<rect x="20" y="70" width="60" height="80"/><rect x="95" y="40" width="60" height="110" opacity=".7"/><rect x="170" y="90" width="60" height="60" opacity=".85"/><rect x="245" y="55" width="55" height="95" opacity=".6"/>`
};
const G = [
  { id: 1, slug: "dungeon-crawler-accountant-2", title: "Dungeon Crawler Accountant 2", genre: "RPG", tags: "RPG, Spreadsheets, Loot", base: 3999, disc: 75, hue: 12, shape: "blocks", hrs: 60, blurb: "Slay the audit. Level up your deductions. Every boss is a tax form." },
  { id: 2, slug: "factory-factory", title: "Factory Factory", genre: "Automation", tags: "Automation, Factory, Recursion", base: 3499, disc: 50, hue: 200, shape: "grid", hrs: 120, blurb: "Build a factory that builds factories that build factories. Base case not included." },
  { id: 3, slug: "sad-robot-simulator", title: "Sad Robot Simulator", genre: "Simulation", tags: "Simulation, Cozy, Sad", base: 1499, disc: 40, hue: 265, shape: "sun", hrs: 8, blurb: "Keep one very sad robot company. It will not get better. Neither will your mood." },
  { id: 4, slug: "hollow-lantern", title: "Hollow Lantern", genre: "Metroidvania", tags: "Metroidvania, Difficult, Atmospheric", base: 2499, disc: 66, hue: 170, shape: "tri", hrs: 30, blurb: "Descend a dark kingdom with a lamp and poor life choices." },
  { id: 5, slug: "turnip-wars", title: "Turnip Wars", genre: "Strategy", tags: "Strategy, Farming, War", base: 1999, disc: 0, hue: 95, shape: "wave", hrs: 40, blurb: "Grand strategy, but every army is a root vegetable." },
  { id: 6, slug: "pixel-farm-noir", title: "Pixel Farm Noir", genre: "Cozy", tags: "Cozy, Detective, Farming", base: 1799, disc: 55, hue: 35, shape: "sun", hrs: 15, blurb: "Someone stole the prize pumpkin. Rain, jazz, and crop rotation." },
  { id: 7, slug: "kernel-panic-ring-0", title: "Kernel Panic: Ring 0", genre: "Puzzle", tags: "Puzzle, Hacking, Programming", base: 2999, disc: 80, hue: 140, shape: "grid", hrs: 25, blurb: "Escalate privileges through 60 handcrafted memory puzzles." },
  { id: 8, slug: "speedrun-grandma", title: "Speedrun Grandma", genre: "Platformer", tags: "Platformer, Speedrun, Comedy", base: 999, disc: 30, hue: 320, shape: "tri", hrs: 6, blurb: "She has 4 minutes before the pie cools. Skip cutscenes, skip everything." },
  { id: 9, slug: "neon-drift-ultra", title: "Neon Drift Ultra", genre: "Racing", tags: "Racing, Synthwave, Arcade", base: 2999, disc: 60, hue: 300, shape: "wave", hrs: 12, blurb: "Slide through neon cities at speeds that violate several laws of physics." },
  { id: 10, slug: "cozy-server-room", title: "Cozy Server Room", genre: "Cozy", tags: "Cozy, Management, Uptime", base: 1999, disc: 45, hue: 190, shape: "blocks", hrs: 20, blurb: "Rack, stack, and lovingly label cables. Pager never rings. Probably." },
  { id: 11, slug: "extremely-normal-golf", title: "Extremely Normal Golf", genre: "Sports", tags: "Sports, Physics, Chill", base: 1299, disc: 0, hue: 110, shape: "sun", hrs: 10, blurb: "It is golf. Nothing else happens. Nothing else will happen." },
  { id: 12, slug: "cheese-wizards-deckbuilder", title: "Cheese Wizard's Deckbuilder", genre: "Roguelike", tags: "Roguelike, Deckbuilder, Cheese", base: 2499, disc: 70, hue: 48, shape: "tri", hrs: 80, blurb: "Combo aged cards into a gouda-tier synergy engine." },
  { id: 13, slug: "apex-telemetry-gt", title: "Apex Telemetry GT", genre: "Racing", tags: "Racing, Sim, Telemetry", base: 4999, disc: 35, hue: 355, shape: "wave", hrs: 150, blurb: "Every corner is a data set. Every lap is a regression." },
  { id: 14, slug: "segfault-simulator", title: "Segfault Simulator", genre: "Puzzle", tags: "Puzzle, Programming, Pain", base: 1499, disc: 85, hue: 230, shape: "grid", hrs: 18, blurb: "Debug a codebase that only crashes when watched." },
  { id: 15, slug: "backlog-the-game", title: "Backlog: The Game", genre: "Idle", tags: "Idle, Meta, Relatable", base: 499, disc: 90, hue: 80, shape: "blocks", hrs: 999, blurb: "An idle game about a growing pile of unplayed games. Play time: never." },
  { id: 16, slug: "big-o-escape-room", title: "Big O Escape Room", genre: "Puzzle", tags: "Puzzle, Math, Co-op", base: 2199, disc: 50, hue: 250, shape: "sun", hrs: 9, blurb: "Exit before the room's complexity hits O(n!). Bring a whiteboard." }
];
const FEATURED = [1, 7, 12, 14, 4];
const byId = id => G.find(g => g.id === id);
const price = g => Math.round(g.base * (100 - g.disc) / 100);
const fmt = c => (c / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);

/* ---------- state (one localStorage key, shared by every page) ---------- */
const freshState = () => ({ wallet: 10000, owned: [], cart: [], saved: 0, savings: 0, buys: 0, points: 0, account: 'player_one', card: '**42', wishlist: [], following: [], ignored: [] });
function loadState() { let s = freshState(); try { const r = localStorage.getItem('vapor-v1'); if (r) s = { ...s, ...JSON.parse(r) }; } catch (e) { } return s }
function saveState(s) { try { localStorage.setItem('vapor-v1', JSON.stringify(s)); } catch (e) { } }

/* ---------- helpers ---------- */
function art(hue, shape, title = '') { return `<div class="art" style="--h:${hue}"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SHAPES[shape]()}</svg>${title ? `<span class="art-title">${title}</span>` : ''}</div>` }
function cover(g) { return art(g.hue, g.shape, g.title) }
// store page URL; game pages pass dir '' because they already live in game_pages/
const pageHref = (g, dir = 'game_pages/') => dir + g.slug + '.html';
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3400) }
const PLAY_MSGS = [
  "Launch cancelled. You have 47 other unplayed games.",
  "Vapor is updating. It has been updating since 2019.",
  "You opened the game, stared at the menu, and closed it. Classic.",
  "Shader compilation in progress. Estimated time: existential.",
  "Play time stays at 0.0 hrs. Statistically consistent with the platform."
];
