/* ---------- data (prices in cents, base = list price) ---------- */
const SHAPES = {
  sun: () => `<circle cx="230" cy="58" r="44"/><rect x="0" y="100" width="320" height="6"/><rect x="0" y="114" width="320" height="10"/><rect x="0" y="132" width="320" height="18"/>`,
  tri: () => `<path d="M0 150 L90 30 L180 150Z"/><path d="M120 150 L210 50 L300 150Z" opacity=".6"/>`,
  grid: () => Array.from({ length: 8 }, (_, i) => `<rect x="${i * 44}" y="0" width="2" height="150"/>`).join('') + Array.from({ length: 5 }, (_, i) => `<rect x="0" y="${i * 34}" width="320" height="2"/>`).join('') + `<circle cx="210" cy="72" r="28"/>`,
  wave: () => `<path d="M0 90 Q40 50 80 90 T160 90 T240 90 T320 90 V150 H0Z"/><path d="M0 118 Q40 88 80 118 T160 118 T240 118 T320 118 V150 H0Z" opacity=".6"/>`,
  blocks: () => `<rect x="20" y="70" width="60" height="80"/><rect x="95" y="40" width="60" height="110" opacity=".7"/><rect x="170" y="90" width="60" height="60" opacity=".85"/><rect x="245" y="55" width="55" height="95" opacity=".6"/>`
};
const G = [
  { id: 1, title: "Dungeon Crawler Accountant 2", genre: "RPG", tags: "RPG, Spreadsheets, Loot", base: 3999, disc: 75, hue: 12, shape: "blocks", hrs: 60, blurb: "Slay the audit. Level up your deductions. Every boss is a tax form." },
  { id: 2, title: "Factory Factory", genre: "Automation", tags: "Automation, Factory, Recursion", base: 3499, disc: 50, hue: 200, shape: "grid", hrs: 120, blurb: "Build a factory that builds factories that build factories. Base case not included." },
  { id: 3, title: "Sad Robot Simulator", genre: "Simulation", tags: "Simulation, Cozy, Sad", base: 1499, disc: 40, hue: 265, shape: "sun", hrs: 8, blurb: "Keep one very sad robot company. It will not get better. Neither will your mood." },
  { id: 4, title: "Hollow Lantern", genre: "Metroidvania", tags: "Metroidvania, Difficult, Atmospheric", base: 2499, disc: 66, hue: 170, shape: "tri", hrs: 30, blurb: "Descend a dark kingdom with a lamp and poor life choices." },
  { id: 5, title: "Turnip Wars", genre: "Strategy", tags: "Strategy, Farming, War", base: 1999, disc: 0, hue: 95, shape: "wave", hrs: 40, blurb: "Grand strategy, but every army is a root vegetable." },
  { id: 6, title: "Pixel Farm Noir", genre: "Cozy", tags: "Cozy, Detective, Farming", base: 1799, disc: 55, hue: 35, shape: "sun", hrs: 15, blurb: "Someone stole the prize pumpkin. Rain, jazz, and crop rotation." },
  { id: 7, title: "Kernel Panic: Ring 0", genre: "Puzzle", tags: "Puzzle, Hacking, Programming", base: 2999, disc: 80, hue: 140, shape: "grid", hrs: 25, blurb: "Escalate privileges through 60 handcrafted memory puzzles." },
  { id: 8, title: "Speedrun Grandma", genre: "Platformer", tags: "Platformer, Speedrun, Comedy", base: 999, disc: 30, hue: 320, shape: "tri", hrs: 6, blurb: "She has 4 minutes before the pie cools. Skip cutscenes, skip everything." },
  { id: 9, title: "Neon Drift Ultra", genre: "Racing", tags: "Racing, Synthwave, Arcade", base: 2999, disc: 60, hue: 300, shape: "wave", hrs: 12, blurb: "Slide through neon cities at speeds that violate several laws of physics." },
  { id: 10, title: "Cozy Server Room", genre: "Cozy", tags: "Cozy, Management, Uptime", base: 1999, disc: 45, hue: 190, shape: "blocks", hrs: 20, blurb: "Rack, stack, and lovingly label cables. Pager never rings. Probably." },
  { id: 11, title: "Extremely Normal Golf", genre: "Sports", tags: "Sports, Physics, Chill", base: 1299, disc: 0, hue: 110, shape: "sun", hrs: 10, blurb: "It is golf. Nothing else happens. Nothing else will happen." },
  { id: 12, title: "Cheese Wizard's Deckbuilder", genre: "Roguelike", tags: "Roguelike, Deckbuilder, Cheese", base: 2499, disc: 70, hue: 48, shape: "tri", hrs: 80, blurb: "Combo aged cards into a gouda-tier synergy engine." },
  { id: 13, title: "Apex Telemetry GT", genre: "Racing", tags: "Racing, Sim, Telemetry", base: 4999, disc: 35, hue: 355, shape: "wave", hrs: 150, blurb: "Every corner is a data set. Every lap is a regression." },
  { id: 14, title: "Segfault Simulator", genre: "Puzzle", tags: "Puzzle, Programming, Pain", base: 1499, disc: 85, hue: 230, shape: "grid", hrs: 18, blurb: "Debug a codebase that only crashes when watched." },
  { id: 15, title: "Backlog: The Game", genre: "Idle", tags: "Idle, Meta, Relatable", base: 499, disc: 90, hue: 80, shape: "blocks", hrs: 999, blurb: "An idle game about a growing pile of unplayed games. Play time: never." },
  { id: 16, title: "Big O Escape Room", genre: "Puzzle", tags: "Puzzle, Math, Co-op", base: 2199, disc: 50, hue: 250, shape: "sun", hrs: 9, blurb: "Exit before the room's complexity hits O(n!). Bring a whiteboard." }
];
const FEATURED = [1, 7, 12, 14, 4];
const byId = id => G.find(g => g.id === id);
const price = g => Math.round(g.base * (100 - g.disc) / 100);
const fmt = c => (c / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);

/* ---------- state ---------- */
let S = { wallet: 10000, owned: [], cart: [], saved: 0, savings: 0, buys: 0, points: 0, account: 'player_one', card: '**42' };
try { const r = localStorage.getItem('vapor-v1'); if (r) S = { ...S, ...JSON.parse(r) }; } catch (e) { }
const persist = () => { try { localStorage.setItem('vapor-v1', JSON.stringify(S)); } catch (e) { } };

/* ---------- helpers ---------- */
function cover(g) { return `<div class="art" style="--h:${g.hue}"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SHAPES[g.shape]()}</svg><span class="art-title">${g.title}</span></div>` }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3400) }
function priceBlock(g) { return g.disc ? `<span class="badge">-${g.disc}%</span><span class="prices"><s>${fmt(g.base)}</s><b>${fmt(price(g))}</b></span>` : `<span class="prices"><b>${fmt(g.base)}</b></span>` }
const PLAT = `<span title="Windows"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 2.4 6.6 1.5v6H0zM7.4 1.4 16 .2v7.3H7.4zM0 8.5h6.6v6L0 13.6zM7.4 8.5H16v7.3L7.4 14.5z"/></svg></span><span title="Vapor Deck Verified"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 8.2 7 10.2 11 5.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>`;
function points(total) { return Math.round(total * 0.269) }
function addBtn(g, cls = '') {
  const owned = S.owned.includes(g.id), inCart = S.cart.includes(g.id);
  return `<button class="btn ${cls}" data-add="${g.id}" ${owned || inCart ? 'disabled' : ''}>${owned ? 'In library' : inCart ? 'In cart' : 'Add to cart'}</button>`;
}
function animateNumber(el, from, to) {
  if (reduced || from === to) { el.textContent = fmt(to); return }
  const t0 = performance.now(), dur = 800;
  (function step(t) { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(from + (to - from) * e)); if (p < 1) requestAnimationFrame(step) })(t0);
}

/* ---------- render ---------- */
let shownSaved = -1;
function renderStats() {
  const target = S.saved;
  if (shownSaved < 0) { $('#l-saved').textContent = fmt(target) } else { animateNumber($('#l-saved'), shownSaved, target) }
  shownSaved = target;
  $('#hdr-saved').textContent = fmt(S.saved);
  $('#hdr-wallet').textContent = fmt(S.wallet);
  $('#l-owned').textContent = S.owned.length;
  const hrs = S.owned.reduce((a, id) => a + byId(id).hrs, 0);
  $('#l-backlog').textContent = Math.round(hrs / 1.5).toLocaleString('en-US') + ' days';
  $('#cartcount').textContent = S.cart.length;
  $('#tab-lib').textContent = 'Library (' + S.owned.length + ')';
}

let featIdx = 0, featHover = false;
function renderFeatured() {
  const g = byId(FEATURED[featIdx]);
  $('#feat').innerHTML = `
   <div class="feat-main">
 ${cover(g)}
 <div class="feat-info"><h3>${g.title}</h3><p>${g.blurb}</p><p class="tags">${g.tags}</p><div class="grow"></div>
   <div class="buy" style="justify-content:space-between">${priceBlock(g)}</div>${addBtn(g)}</div>
   </div>
   <div class="feat-list" role="tablist" aria-label="Featured games">${FEATURED.map((id, i) => `<button class="feat-item" role="tab" data-feat="${i}" aria-current="${i === featIdx}">${byId(id).title}</button>`).join('')}</div>`;
}

let genre = 'All', query = '';
function renderChips() {
  const genres = ['All', ...new Set(G.map(g => g.genre))];
  $('#chips').innerHTML = genres.map(x => `<button class="pill" data-genre="${x}" aria-pressed="${x === genre}">${x}</button>`).join('');
}
function renderGrid() {
  const list = G.filter(g => (genre === 'All' || g.genre === genre) && (!query || (g.title + ' ' + g.tags).toLowerCase().includes(query)));
  $('#grid').innerHTML = list.length ? list.map(g => `<article class="card">${cover(g)}<div class="cbody"><h3>${g.title}</h3><p class="tags">${g.tags}</p><div class="buy">${priceBlock(g)}</div>${addBtn(g)}</div></article>`).join('') : `<div class="empty">No games match. Clear the search or pick another genre.</div>`;
}
function renderLibrary() {
  $('#lib-sub').textContent = S.owned.length + ' owned, 0 launched';
  $('#lib').innerHTML = S.owned.length ? S.owned.map(id => { const g = byId(id); return `<article class="card lib-card">${cover(g)}<div class="cbody"><h3>${g.title}</h3><p class="meta">0.0 hrs on record &middot; ${g.hrs} hrs to finish</p><button class="btn blue" data-play="${g.id}">Play</button></div></article>` }).join('') : `<div class="empty">Your library is empty. Fix that in the Store; it costs $0.00 in real terms.</div>`;
}
function renderCart() {
  const items = S.cart.map(byId);
  const total = items.reduce((a, g) => a + price(g), 0);
  const n = items.length, label = n + ' item' + (n === 1 ? '' : 's');
  $('#cart-crumb').textContent = label;
  $('#cart-h1').textContent = label;
  $('#cart-items').innerHTML = items.length ? items.map(g => `
<div class="citem">
  ${cover(g)}
  <div class="ci-mid">
    <div class="ci-title">${g.title}</div>
    <div class="plat">${PLAT}</div>
    <select class="acct" aria-label="Purchase target"><option>For my account</option><option>As a gift</option></select>
  </div>
  <div class="ci-right">
    <div class="buy">${priceBlock(g)}</div>
    <div class="ci-links"><button data-add-quiet="${g.id}">Add</button> | <button data-remove="${g.id}">Remove</button></div>
  </div>
</div>`).join('') : `<div class="empty">Your cart is empty. Suspiciously disciplined.</div>`;
  $('#cart-actions').style.display = items.length ? '' : 'none';
  $('#cart-total').textContent = fmt(total);
  $('#to-pay-1').disabled = $('#to-pay-2').disabled = !items.length;
  // recommendations: games not owned and not in cart
  const recos = G.filter(g => !S.owned.includes(g.id) && !S.cart.includes(g.id)).slice(0, 3);
  $('#recos').innerHTML = recos.map(g => `<article class="card">${cover(g)}<div class="cbody"><h3>${g.title}</h3><p class="tags">${g.tags}</p><div class="buy">${priceBlock(g)}</div>${addBtn(g)}</div></article>`).join('') || `<div class="empty">Nothing left to recommend. You own the whole (fake) catalogue.</div>`;
}
function renderCheckout() {
  const items = S.cart.map(byId);
  const total = items.reduce((a, g) => a + price(g), 0);
  $('#co-line').innerHTML = items.length ? items.map(g => `
<div class="co-top">${cover(g)}<span class="t">${g.title}</span><span class="plat">${PLAT}</span><span class="amt">${fmt(price(g))}</span></div>`).join('') : `<div class="co-top"><span class="t">Your cart is empty.</span></div>`;
  $('#co-sub').textContent = fmt(total);
  $('#co-tot').textContent = fmt(total);
  $('#co-points').textContent = points(total).toLocaleString('en-US');
  $('#co-pay').textContent = 'Visa ending in ' + S.card;
  $('#co-acct').textContent = S.account;
  $('#checkout').disabled = !items.length || !$('#agree').checked || !cvvValid();
}
function renderAll() { renderStats(); renderFeatured(); renderGrid(); renderLibrary(); renderCart(); renderCheckout(); persist() }

/* ---------- navigation ---------- */
function show(view) {
  $('#view-store').hidden = view !== 'store';
  $('#view-library').hidden = view !== 'library';
  $('#view-cart').hidden = view !== 'cart';
  $('#view-checkout').hidden = view !== 'checkout';
  $('#view-thankyou').hidden = view !== 'thankyou';
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-current', t.dataset.view === view ? 'page' : 'false'));
  window.scrollTo(0, 0);
}

/* ---------- checkout ---------- */
function confCode() {
  const rnd = n => Array.from({ length: n }, () => '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ'[Math.random() * 35 | 0]).join('');
  return `VPR-${rnd(5)}-${rnd(5)}`;
}
const cvvValid = () => /^\d{3,4}$/.test(($('#co-cvv').value || '').trim());
function checkout() {
  const items = S.cart.map(byId);
  const total = items.reduce((a, g) => a + price(g), 0);
  const savings = items.reduce((a, g) => a + (g.base - price(g)), 0);
  if (!items.length) return;
  if (!cvvValid()) { toast('Enter the security code first. Any 3 digits; it is fake and goes nowhere.'); $('#co-cvv').focus(); return }
  if (!$('#agree').checked) { toast('Tick the Subscriber Agreement first. Nobody reads it, but it is required.'); return }
  if (total > S.wallet) { toast('Wallet too low. Add funds; it is free, because it is fake.'); return }
  const earned = points(total);
  S.wallet -= total; S.owned.push(...S.cart); S.cart = []; S.saved += total; S.savings += savings; S.buys++; S.points += earned;
  $('#agree').checked = false; $('#co-cvv').value = ''; $('#eula').hidden = true; $('#readeula').setAttribute('aria-expanded', 'false');
  // fill the thank-you receipt
  $('#ty-earned').textContent = earned.toLocaleString('en-US');
  $('#ty-balance').textContent = S.points.toLocaleString('en-US');
  $('#ty-acct').textContent = S.account;
  $('#ty-total').textContent = fmt(total);
  $('#ty-code').textContent = confCode();
  renderAll();
  show('thankyou');
}

/* ---------- countdown ---------- */
function tickCountdown() {
  const n = new Date(), e = new Date(n); e.setHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((e - n) / 1000));
  const p = v => String(v).padStart(2, '0');
  $('#countdown').textContent = `${p(s / 3600 | 0)}:${p((s % 3600) / 60 | 0)}:${p(s % 60)}`;
}

/* ---------- events ---------- */
const PLAY_MSGS = [
  "Launch cancelled. You have 47 other unplayed games.",
  "Vapor is updating. It has been updating since 2019.",
  "You opened the game, stared at the menu, and closed it. Classic.",
  "Shader compilation in progress. Estimated time: existential.",
  "Play time stays at 0.0 hrs. Statistically consistent with the platform."
];
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.add) { const id = +t.dataset.add; if (!S.cart.includes(id) && !S.owned.includes(id)) { S.cart.push(id); renderAll(); toast(byId(id).title + ' added to cart') } }
  else if (t.dataset.addQuiet) { const id = +t.dataset.addQuiet; if (!S.cart.includes(id) && !S.owned.includes(id)) { S.cart.push(id); renderAll(); toast(byId(id).title + ' added to cart') } }
  else if (t.dataset.remove) { S.cart = S.cart.filter(i => i !== +t.dataset.remove); renderAll() }
  else if (t.dataset.view) { show(t.dataset.view) }
  else if (t.dataset.feat) { featIdx = +t.dataset.feat; renderFeatured() }
  else if (t.dataset.genre) { genre = t.dataset.genre; renderChips(); renderGrid() }
  else if (t.dataset.play) { toast(PLAY_MSGS[Math.random() * PLAY_MSGS.length | 0]) }
});
$('#opencart').onclick = () => show('cart');
$('#checkout').onclick = checkout;
$('#agree').onchange = renderCheckout;
$('#co-cvv').oninput = e => { e.target.value = e.target.value.replace(/\D/g, ''); renderCheckout() };
function goPay() { if (!S.cart.length) { toast('Cart is empty. Add something imaginary first.'); return } show('checkout') }
$('#to-pay-1').onclick = goPay;
$('#to-pay-2').onclick = goPay;
$('#remove-all').onclick = () => { S.cart = []; renderAll(); toast('Cart emptied. Willpower: temporarily restored.') };
$('#co-change').onclick = () => toast('This is the only card, and it is fake. Visa ending in **42 it is.');
$('#co-whatis').onclick = () => toast('The 3 digits on the back. Type anything; nothing is stored or sent.');
$('#refund').onclick = () => toast('Refund Policy: you paid $0.00, so you are already fully refunded.');
$('#see-vsa').onclick = () => { show('checkout'); const el = $('#eula'); el.hidden = false; $('#readeula').setAttribute('aria-expanded', 'true') };
$('#readeula').onclick = e => { e.preventDefault(); const h = $('#eula').hidden; $('#eula').hidden = !h; e.target.setAttribute('aria-expanded', String(h)) };
$('#addfunds').onclick = () => { S.wallet += 10000; renderAll(); toast('Added $100.00. Payment method: imagination.') };
$('#q').oninput = e => { query = e.target.value.trim().toLowerCase(); renderGrid() };
$('#ty-install').onclick = () => show('library');
$('#ty-shop').onclick = () => toast('The Points Shop is imaginary. Your imaginary points buy imaginary hats.');
$('#ty-print').onclick = () => window.print();
let resetArmed = false;
$('#reset').onclick = e => {
  if (!resetArmed) { resetArmed = true; e.target.textContent = 'Click again to reset everything'; setTimeout(() => { resetArmed = false; e.target.textContent = 'Reset demo' }, 3000); return }
  S = { wallet: 10000, owned: [], cart: [], saved: 0, savings: 0, buys: 0, points: 0, account: 'player_one', card: '**42' }; shownSaved = 0; show('store'); renderAll(); resetArmed = false; e.target.textContent = 'Reset demo'; toast('Demo reset. Your bank account was never involved.');
};
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#view-thankyou').hidden) show('store');
});
$('#feat').addEventListener('mouseenter', () => featHover = true);
$('#feat').addEventListener('mouseleave', () => featHover = false);
if (!reduced) setInterval(() => { if (!featHover && !document.hidden && !$('#view-store').hidden) { featIdx = (featIdx + 1) % FEATURED.length; renderFeatured() } }, 6000);

renderChips(); renderAll(); tickCountdown(); setInterval(tickCountdown, 1000);
