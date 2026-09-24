/* catalogue, state helpers, cover art and toast live in data.js */

/* ---------- state ---------- */
let S = loadState();
const persist = () => saveState(S);

/* ---------- helpers ---------- */
// cover and title link to the game's store page; Tab skips the cover since the title goes to the same place
function coverLink(g) { return `<a class="cover-link" href="${pageHref(g)}" tabindex="-1" aria-hidden="true">${cover(g)}</a>` }
function titleLink(g) { return `<a class="glink" href="${pageHref(g)}">${g.title}</a>` }
function priceBlock(g) { return g.disc ? `<span class="badge">-${g.disc}%</span><span class="prices"><s>${fmt(g.base)}</s><b>${fmt(price(g))}</b></span>` : `<span class="prices"><b>${fmt(g.base)}</b></span>` }
const PLAT = `<span title="Windows"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 2.4 6.6 1.5v6H0zM7.4 1.4 16 .2v7.3H7.4zM0 8.5h6.6v6L0 13.6zM7.4 8.5H16v7.3L7.4 14.5z"/></svg></span><span title="Vapor Deck Verified"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 8.2 7 10.2 11 5.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>`;
function points(total) { return Math.round(total * 0.269) }
function addBtn(g, cls = '') {
  const owned = S.owned.includes(g.id), inCart = S.cart.includes(g.id);
  return `<button class="btn ${cls}" data-add="${g.id}" ${owned || inCart ? 'disabled' : ''}>${owned ? 'In library' : inCart ? 'In cart' : 'Add to cart'}</button>`;
}

/* ---------- render ---------- */
function renderStats() {
  $('#hdr-saved').textContent = fmt(S.saved);
  $('#hdr-wallet').textContent = fmt(S.wallet);
  $('#cartcount').textContent = S.cart.length;
}

let featIdx = 0, featHover = false;
function renderFeatured() {
  const g = byId(FEATURED[featIdx]);
  $('#feat').innerHTML = `
   <div class="feat-main">
 ${coverLink(g)}
 <div class="feat-info"><h3>${titleLink(g)}</h3><p>${g.blurb}</p><p class="tags">${g.tags}</p><div class="grow"></div>
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
  $('#grid').innerHTML = list.length ? list.map(g => `<article class="card">${coverLink(g)}<div class="cbody"><h3>${titleLink(g)}</h3><p class="tags">${g.tags}</p><div class="buy">${priceBlock(g)}</div>${addBtn(g)}</div></article>`).join('') : `<div class="empty">No games match. Clear the search or pick another genre.</div>`;
}
function renderLibrary() {
  $('#lib-sub').textContent = S.owned.length + ' owned, 0 launched';
  $('#lib').innerHTML = S.owned.length ? S.owned.map(id => { const g = byId(id); return `<article class="card lib-card">${coverLink(g)}<div class="cbody"><h3>${titleLink(g)}</h3><p class="meta">0.0 hrs on record &middot; ${g.hrs} hrs to finish</p><button class="btn blue" data-play="${g.id}">Play</button></div></article>` }).join('') : `<div class="empty">Your library is empty. Fix that in the Store; it costs $0.00 in real terms.</div>`;
}
function renderCart() {
  const items = S.cart.map(byId);
  const total = items.reduce((a, g) => a + price(g), 0);
  const n = items.length, label = n + ' item' + (n === 1 ? '' : 's');
  $('#cart-crumb').textContent = label;
  $('#cart-h1').textContent = label;
  $('#cart-items').innerHTML = items.length ? items.map(g => `
<div class="citem">
  ${coverLink(g)}
  <div class="ci-mid">
    <div class="ci-title">${titleLink(g)}</div>
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
  $('#recos').innerHTML = recos.map(g => `<article class="card">${coverLink(g)}<div class="cbody"><h3>${titleLink(g)}</h3><p class="tags">${g.tags}</p><div class="buy">${priceBlock(g)}</div>${addBtn(g)}</div></article>`).join('') || `<div class="empty">Nothing left to recommend. You own the whole (fake) catalogue.</div>`;
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
  $('#checkout').disabled = !items.length || !$('#agree').checked;
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
function checkout() {
  const items = S.cart.map(byId);
  const total = items.reduce((a, g) => a + price(g), 0);
  const savings = items.reduce((a, g) => a + (g.base - price(g)), 0);
  if (!items.length) return;
  if (!$('#agree').checked) { toast('Tick the Subscriber Agreement first. Nobody reads it, but it is required.'); return }
  if (total > S.wallet) { toast('Wallet too low. Add funds.'); return }
  const earned = points(total);
  S.wallet -= total; S.owned.push(...S.cart); S.cart = []; S.saved += total; S.savings += savings; S.buys++; S.points += earned;
  $('#agree').checked = false;$('#eula').hidden = true; $('#readeula').setAttribute('aria-expanded', 'false');
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
function goPay() { if (!S.cart.length) { toast('Cart is empty. Add something imaginary first.'); return } show('checkout') }
$('#to-pay-1').onclick = goPay;
$('#to-pay-2').onclick = goPay;
$('#remove-all').onclick = () => { S.cart = []; renderAll(); toast('Cart emptied. Willpower: temporarily restored.') };
$('#co-change').onclick = () => toast('This is the only card, and it is fake. Visa ending in **42 it is.');
$('#co-whatis').onclick = () => toast('Real stores ask for the 3 digits on the back. Vapor never asks for card details, so if a "Vapor" page ever does, it is not us.');
$('#refund').onclick = () => toast('Refund Policy: you paid $0.00, so you are already fully refunded.');
$('#see-vsa').onclick = () => { show('checkout'); const el = $('#eula'); el.hidden = false; $('#readeula').setAttribute('aria-expanded', 'true') };
$('#readeula').onclick = e => { e.preventDefault(); const h = $('#eula').hidden; $('#eula').hidden = !h; e.target.setAttribute('aria-expanded', String(h)) };
$('#addfunds').onclick = () => { S.wallet += 10000; renderAll(); toast('Added $100.00. Payment method: imagination.') };
function setAcctMenu(open) { $('#acctdrop').hidden = !open; $('#acctbtn').setAttribute('aria-expanded', String(open)) }
$('#acctbtn').onclick = () => setAcctMenu($('#acctdrop').hidden);
document.addEventListener('click', e => { if (!e.target.closest('.acct-menu')) setAcctMenu(false) });
$('#bell').onclick = () => toast('No new notifications. Nobody sends alerts about money you kept.');
$('#support').onclick = () => toast('Support: nothing to refund. You never paid anything.');
$('#q').oninput = e => { query = e.target.value.trim().toLowerCase(); renderGrid() };
$('#ty-install').onclick = () => show('library');
$('#ty-shop').onclick = () => toast('The Points Shop is imaginary. Your imaginary points buy imaginary hats.');
$('#ty-print').onclick = () => window.print();
let resetArmed = false;
$('#reset').onclick = e => {
  if (!resetArmed) { resetArmed = true; e.target.textContent = 'Click again to reset everything'; setTimeout(() => { resetArmed = false; e.target.textContent = 'Reset demo' }, 3000); return }
  S = freshState(); show('store'); renderAll(); resetArmed = false; e.target.textContent = 'Reset demo'; toast('Demo reset. Your bank account was never involved.');
};
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#acctdrop').hidden) { setAcctMenu(false); $('#acctbtn').focus(); return }
  if (e.key === 'Escape' && !$('#view-thankyou').hidden) show('store');
});
$('#feat').addEventListener('mouseenter', () => featHover = true);
$('#feat').addEventListener('mouseleave', () => featHover = false);
if (!reduced) setInterval(() => { if (!featHover && !document.hidden && !$('#view-store').hidden) { featIdx = (featIdx + 1) % FEATURED.length; renderFeatured() } }, 6000);

/* ---------- links from the game pages: #cart, #library, #genre=Racing, #q=cozy ---------- */
function fromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return;
  history.replaceState(null, '', location.pathname + location.search);
  if (h === 'cart' || h === 'library') { show(h); return }
  show('store');
  if (h.startsWith('genre=')) { genre = G.some(g => g.genre === h.slice(6)) ? h.slice(6) : 'All'; query = ''; $('#q').value = '' }
  else if (h.startsWith('q=')) { genre = 'All'; $('#q').value = h.slice(2); query = h.slice(2).trim().toLowerCase() }
  else return;
  renderChips(); renderGrid(); $('#q').scrollIntoView();
}
window.addEventListener('hashchange', fromHash);
// coming back to a cached page (browser Back) must pick up cart changes made on a game page
window.addEventListener('pageshow', e => { if (e.persisted) { S = loadState(); renderAll() } });

renderChips(); renderAll(); tickCountdown(); setInterval(tickCountdown, 1000); fromHash();
