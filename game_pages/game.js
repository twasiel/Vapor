/* Game store page. Each game_pages/*.html file defines a PAGE object with that game's
   content, then loads ../data.js and this file, which renders the Steam-style layout.
   Price, genre and cover come from the shared catalogue in data.js. */

const g = byId(PAGE.id);
let S = loadState();
const persist = () => saveState(S);
const has = (list, id = g.id) => S[list].includes(id);
function toggle(list) { S[list] = has(list) ? S[list].filter(i => i !== g.id) : [...S[list], g.id]; persist(); return has(list) }
const num = n => n.toLocaleString('en-US');
const mmss = s => `${s / 60 | 0}:${String(s % 60).padStart(2, '0')}`;

/* ---------- icons ---------- */
const I = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="2.6"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.4" fill="#000"/></svg>',
  theater: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  win: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M0 2.4 6.6 1.5v6H0zM7.4 1.4 16 .2v7.3H7.4zM0 8.5h6.6v6L0 13.6zM7.4 8.5H16v7.3L7.4 14.5z"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  trophy: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 6h28v14c0 9-6 16-14 16s-14-7-14-16zM8 10h10v6c0 5 2 9 5 11-8-1-15-7-15-15zM56 10H46v6c0 5-2 9-5 11 8-1 15-7 15-15zM28 36h8v10h8l3 12H17l3-12h8z"/></svg>'
};
const FI = {
  user: '<circle cx="8" cy="4.5" r="3"/><path d="M2 15c0-3.5 2.7-6 6-6s6 2.5 6 6z"/>',
  users: '<circle cx="5" cy="5" r="2.5"/><circle cx="11" cy="5" r="2.5"/><path d="M0 14c0-3 2.2-5 5-5s5 2 5 5zM6 14c0-3 2.2-5 5-5s5 2 5 5z"/>',
  trophy: '<path d="M4 1h8v4a4 4 0 0 1-8 0zM1 2h3v2a2 2 0 0 1-3-1zM12 2h3v1a2 2 0 0 1-3 1zM7 9h2v3h2v2H5v-2h2z"/>',
  cloud: '<path d="M4 13a3.5 3.5 0 0 1-.4-7A4.5 4.5 0 0 1 12 5.5a3.8 3.8 0 0 1 .5 7.5z"/>',
  cards: '<rect x="1" y="3" width="8" height="11" rx="1"/><rect x="7" y="1" width="8" height="11" rx="1" opacity=".6"/>',
  wrench: '<path d="M10 1a4 4 0 0 0-3.8 5.2L1 11.4 3.6 14l5.2-5.2A4 4 0 0 0 14 5l-2.4 2.4-2.4-.6-.6-2.4L11 1.1z"/>',
  chart: '<rect x="1" y="9" width="3" height="6"/><rect x="6" y="5" width="3" height="10"/><rect x="11" y="1" width="3" height="14"/>',
  vr: '<path d="M1 5h14v6h-4l-1.5-2h-3L5 11H1z"/>',
  tv: '<rect x="1" y="2" width="14" height="9" rx="1"/><rect x="5" y="13" width="6" height="2"/>',
  cc: '<path d="M1 3h14v10H1zm3 3v4h3V9H5V7h2V6zm5 0v4h3V9h-2V7h2V6z" fill-rule="evenodd"/>',
  split: '<rect x="1" y="2" width="6.5" height="11"/><rect x="8.5" y="2" width="6.5" height="11"/>',
  pad: '<path d="M4 4h8a4 4 0 0 1 3.9 4.9l-.8 3.4a2 2 0 0 1-3.5.7L10 11H6l-1.6 2a2 2 0 0 1-3.5-.7l-.8-3.4A4 4 0 0 1 4 4z"/>'
};
function featIcon(name) {
  const k = /Achievement/.test(name) ? 'trophy' : /Cloud/.test(name) ? 'cloud' : /Trading/.test(name) ? 'cards' : /Workshop/.test(name) ? 'wrench'
    : /Leaderboard|Stats/.test(name) ? 'chart' : /VR/.test(name) ? 'vr' : /Remote Play/.test(name) ? 'tv' : /Captions/.test(name) ? 'cc'
      : /Split|Shared/.test(name) ? 'split' : /Single/.test(name) ? 'user' : 'users';
  return `<svg viewBox="0 0 16 16" aria-hidden="true">${FI[k]}</svg>`;
}

/* ---------- media: two "videos", then screenshots made from the game's hue and every shape ---------- */
const SHOTS = Object.keys(SHAPES);
const s0 = SHOTS.indexOf(g.shape);
const MEDIA = [
  { video: 'Launch Trailer', hue: g.hue, shape: g.shape, dur: 94 + g.id * 7 % 60 },
  { video: 'Gameplay Overview', hue: g.hue + 30, shape: SHOTS[(s0 + 2) % 5], dur: 240 + g.id * 13 % 150 },
  ...[0, 40, -35, 80, -70, 150].map((d, i) => ({ hue: g.hue + d, shape: SHOTS[(s0 + i + 1) % 5] }))
];

/* ---------- links back into the store ---------- */
function storeLink(x) {
  if (G.some(o => o.genre === x)) return `<a href="../index.html#genre=${encodeURIComponent(x)}">${x}</a>`;
  if (G.some(o => (o.title + ' ' + o.tags).toLowerCase().includes(x.toLowerCase()))) return `<a href="../index.html#q=${encodeURIComponent(x)}">${x}</a>`;
  return `<button class="gp-linkbtn" data-toast="No other games on Vapor are filed under ${x}. This one is special.">${x}</button>`;
}
function tagLink(x) {
  const inStore = G.some(o => o.id !== g.id && (o.title + ' ' + o.tags).toLowerCase().includes(x.toLowerCase()));
  return inStore ? `<a class="gp-tag" href="../index.html#q=${encodeURIComponent(x)}">${x}</a>` : `<button class="gp-tag" data-toast="No other games on Vapor are tagged ${x}. This one is special.">${x}</button>`;
}
function nextInQueue() {
  const rest = G.filter(o => o.id !== g.id && !S.owned.includes(o.id) && !S.ignored.includes(o.id));
  const n = rest.find(o => o.id > g.id) || rest[0];
  return n ? pageHref(n, '') : '../index.html';
}

/* ---------- header (same controls as the store) ---------- */
function header() {
  return `<header class="top"><div class="top-in">
  <a class="logo" href="../index.html" aria-label="Vapor store home"><span class="logo-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 10c4-4 6 4 10 0s6 4 10 0M4 17c4-4 6 4 10 0s6 4 10 0M4 24c4-4 6 4 10 0s6 4 10 0" /></svg></span>VAPOR<sup>®</sup></a>
  <nav class="tabs" aria-label="Sections">
    <a class="tab" href="../index.html" aria-current="page">Store</a>
    <a class="tab" href="../index.html#library" aria-current="false">Library</a>
    <button class="tab" data-toast="Support: nothing to refund. You never paid anything.">Support</button>
  </nav>
  <div class="spacer"></div>
  <div class="hdr-acct">
    <div class="acct-row">
      <a class="cartbtn" href="../index.html#cart" style="display:inline-flex;align-items:center">Cart (<span id="cartcount">0</span>)</a>
      <button class="bell" aria-label="Notifications" data-toast="No new notifications. Nobody sends alerts about money you kept."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0z" /></svg></button>
      <div class="acct-menu">
        <button class="acct-name" id="acctbtn" aria-haspopup="true" aria-expanded="false" aria-controls="acctdrop">${S.account}</button>
        <div class="acct-drop" id="acctdrop" hidden>
          <div class="drop-stat" title="Total real money you did not spend"><small>Real money not spent</small><b id="hdr-saved">$0.00</b></div>
          <button data-act="addfunds">Add funds to your fake wallet</button>
        </div>
      </div>
    </div>
    <div class="acct-wallet" id="hdr-wallet" title="Fake wallet balance">$0.00</div>
  </div>
</div></header>`;
}
function renderStats() {
  $('#hdr-saved').textContent = fmt(S.saved);
  $('#hdr-wallet').textContent = fmt(S.wallet);
  $('#cartcount').textContent = S.cart.length;
}

/* ---------- page sections ---------- */
function review(label, n, pct, recent) {
  const cls = /Negative/.test(label) ? 'neg' : /Mixed/.test(label) ? 'mix' : 'pos';
  return `<span class="gp-rv ${cls}" title="${pct}% of the ${num(n)} user reviews ${recent ? 'in the last 30 days ' : ''}for this game are positive.">${label}</span> <span class="gp-n">(${num(n)})</span>`;
}
function priceBox(base, now) {
  const pct = base && now < base ? Math.round(100 - now / base * 100) : 0;
  return pct ? `<div class="gp-pct">-${pct}%</div><div class="gp-prices"><s>${fmt(base)}</s><b>${fmt(now)}</b></div>`
    : `<div class="gp-price">${now ? fmt(now) : 'Free'}</div>`;
}
function cartBtn(act = 'cart') {
  if (has('owned')) return `<button class="gp-cart" disabled>In library</button>`;
  if (has('cart')) return `<a class="gp-cart" href="../index.html#cart">In cart</a>`;
  return `<button class="gp-cart" data-act="${act}">Add to Cart</button>`;
}
const dlcPrice = c => Math.round(c * (100 - (PAGE.dlcDisc || 0)) / 100);
const short = name => name.replace(g.title + ' - ', '');

function topHtml() {
  return `
  <div class="gp-crumbs"><a href="../index.html">All Games</a> &gt; <a href="../index.html#genre=${encodeURIComponent(g.genre)}">${g.genre} Games</a> &gt; <a href="${pageHref(g, '')}">${g.title}</a></div>
  <div class="gp-titlebar"><h1 class="gp-title">${g.title}</h1><button class="gp-b" data-toast="The Community Hub is a quiet place. Everyone is busy not playing.">Community Hub</button></div>
  <div class="gp-top">
    <div class="gp-media">
      <div class="gp-stage" id="stage"></div>
      <div class="gp-strip" id="strip">${MEDIA.map((m, i) => `<button class="gp-thumb" data-media="${i}" aria-label="${m.video || 'Screenshot ' + (i - 1)}">${art(m.hue, m.shape)}${m.video ? `<span class="play">${I.play}</span>` : ''}</button>`).join('')}</div>
      <div class="gp-scroll"><button data-act="prev" aria-label="Previous">&lsaquo;</button><div class="gp-track"><i id="thumbbar"></i></div><button data-act="next" aria-label="Next">&rsaquo;</button></div>
    </div>
    <div class="gp-side">
      <div class="gp-capsule">${cover(g)}<div class="gp-banner">${PAGE.banner}</div></div>
      <p class="gp-short">${PAGE.short}</p>
      <dl class="gp-meta">
        <dt>Recent reviews:</dt><dd>${review(...PAGE.reviews.recent, true)}</dd>
        <dt>All reviews:</dt><dd>${review(...PAGE.reviews.all, false)}</dd>
        <dt class="gap">Release date:</dt><dd>${PAGE.release}</dd>
        <dt class="gap">Developer:</dt><dd><button class="gp-linkbtn" data-toast="${PAGE.dev} has no other games on Vapor. They are focusing.">${PAGE.dev}</button></dd>
        <dt>Publisher:</dt><dd><button class="gp-linkbtn" data-toast="${PAGE.pub} is publishing exactly one game. It's this one.">${PAGE.pub}</button></dd>
      </dl>
      <div class="gp-tagslab">Popular user-defined tags for this product:</div>
      <div class="gp-tags">${PAGE.tags.map(tagLink).join('')}<button class="gp-tag" data-toast="Tag suggestions are closed. 'Backlog' was already taken." aria-label="Suggest a tag">+</button></div>
    </div>
  </div>
  <div class="gp-queue">
    <button class="gp-b" data-act="wishlist" aria-pressed="${has('wishlist')}">${has('wishlist') ? '✓ On Wishlist' : 'Add to your wishlist'}</button>
    <button class="gp-b" data-act="following" aria-pressed="${has('following')}">${has('following') ? '✓ Following' : 'Follow'}</button>
    <span class="gp-split"><button class="gp-b" data-act="ignored" aria-pressed="${has('ignored')}">${has('ignored') ? '✓ Ignored' : 'Ignore'}</button><button class="gp-b" aria-label="More ignore options" data-toast="Ignore options: 'Ignore' and 'Ignore, but louder'. Both do the same thing.">&#9662;</button></span>
    <button class="gp-b" data-act="share" aria-label="Share">${I.share}</button>
    <span class="grow"></span>
    <a class="gp-b" href="${nextInQueue()}">View Your Queue &nbsp;&#8680;</a>
  </div>`;
}

function left() {
  const ends = new Date(); ends.setDate(ends.getDate() + 2 + g.id % 4);
  const endsTxt = ends.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  const items = [[g.title, g.base, price(g)], ...PAGE.dlc.map(([n, c]) => [n, c, dlcPrice(c)])];
  const listSum = items.reduce((a, x) => a + x[1], 0), nowSum = items.reduce((a, x) => a + x[2], 0);
  const bundle = Math.round(nowSum * (100 - PAGE.bundle.save) / 100);
  const plats = `<div class="gp-plats">${I.win}${PAGE.notice && /VR/.test(PAGE.notice.badge) ? '<i></i>VR Supported' : ''}</div>`;
  const n = PAGE.dlc.length;
  return `
  ${has('owned') ? `<div class="gp-owned"><span><b>IN LIBRARY</b>${g.title} is already in your Vapor library. 0.0 hrs on record.</span><button class="gp-cart" data-act="play">Play Now</button></div>` : ''}
  ${PAGE.notice ? `<div class="gp-notice"><span class="badge2">${PAGE.notice.badge}</span><div>${PAGE.notice.l1}<br>${PAGE.notice.l2}</div></div>` : ''}
  <div class="gp-buybox">
    <h2>Buy ${g.title}</h2>
    ${g.disc ? `<div class="gp-deal">${PAGE.deal} Offer ends ${endsTxt}</div><p>Discount based on lowest price in previous 30 days</p>` : ''}
    ${plats}
    <div class="gp-action">${priceBox(g.base, price(g))}${cartBtn()}</div>
  </div>
  <div class="gp-buybox">
    <h2>Buy ${g.title} ${PAGE.bundle.name} <small>Bundle</small> <button class="gp-linkbtn" data-toast="A bundle is a collection of products at a discount. Here, only the first one exists." aria-label="What is a bundle?">(?)</button></h2>
    <p>Buy this bundle to save ${PAGE.bundle.save}% off all ${items.length} items!</p>
    <div class="gp-bitems">${items.map(([name], i) => i ? art(g.hue + 28 * i, SHOTS[(s0 + i) % 5], short(name)) : cover(g)).join('')}</div>
    <div class="gp-action"><button class="gp-binfo" data-toast="Contains ${g.title} and ${n} DLC. The DLC is vapor, even by Vapor standards.">Bundle info</button><div class="gp-pct pre">-${PAGE.bundle.save}%</div>${priceBox(listSum, bundle)}${cartBtn('bundle')}</div>
  </div>

  <div class="gp-bh"><h2>Content For This Game</h2><button data-act="dlc">Browse all (${n})</button></div>
  <div id="dlc">${PAGE.dlc.map(([name, c], i) => `<button class="gp-dlc" ${i >= 5 ? 'hidden' : ''} data-toast="${short(name)} is DLC for a game that doesn't exist. Vapor can't sell you that. Yet."><span>${name}</span><span class="p">${c ? (PAGE.dlcDisc ? `<em>-${PAGE.dlcDisc}%</em><s>${fmt(c)}</s><b>${fmt(dlcPrice(c))}</b>` : `<b class="full">${fmt(c)}</b>`) : '<b class="full">Free</b>'}</span></button>`).join('')}</div>
  ${n > 5 ? `<div class="gp-dlcfoot"><span id="dlccount">SHOWING 1 - 5 OF ${n}</span><button data-act="dlc" id="dlcmore">SEE ALL &#9662;</button></div>` : ''}

  <div class="gp-bh"><h2>Recent Events &amp; Announcements</h2><button data-toast="That's all of them. It's been a quiet year.">View All</button></div>
  <div class="gp-events">${PAGE.events.map((e, i) => `<button class="gp-event" data-toast="Event pages load in about 0.0 seconds, because there aren't any.">${art(g.hue + (i ? -60 : 150), SHOTS[(s0 + 3 + i) % 5], e.art)}<div class="cap"><small>${e.kind} &middot; ${e.when}</small><b>${e.title}</b></div></button>`).join('')}</div>

  <div class="gp-bh"><h2>About This Game</h2></div>
  <div class="gp-about" id="about">${PAGE.about.map(([t, v]) =>
    t === 'h' ? `<h3>${v}</h3>` : t === 'p' ? `<p>${v}</p>` : t === 'ul' ? `<ul>${v.map(x => `<li>${x}</li>`).join('')}</ul>`
      : `<div class="gp-about-img">${art(g.hue + 15, v || SHOTS[(s0 + 4) % 5])}</div>`).join('')}</div>
  <button class="gp-more" data-act="about" id="aboutmore" aria-expanded="false">READ MORE</button>

  <div class="gp-bh"><h2>System Requirements</h2></div>
  <div class="gp-req">${[['MINIMUM:', PAGE.req.min], ['RECOMMENDED:', PAGE.req.rec]].map(([h, o]) =>
        `<div><h4>${h}</h4><ul><li>Requires a 64-bit processor and operating system</li>${Object.entries(o).map(([k, v]) => `<li><strong>${k.toUpperCase()}:</strong> ${v}</li>`).join('')}</ul></div>`).join('')}</div>`;
}

function right() {
  const langs = PAGE.langs.split(',').map(x => { x = x.trim(); const i = x.lastIndexOf(' '); return [x.slice(0, i), ...x.slice(i + 1)] });
  const DECK = { Verified: ['#59bf40', '✓'], Playable: ['#ffc82c', 'i'], Unsupported: ['#8f98a0', '⊘'] }[PAGE.deck];
  const pad = PAGE.controller;
  return `
  <div class="gp-rb">
    <h2>Is this game relevant to you?</h2>
    <div class="gp-ok">Similar to games you've played:</div>
    <div class="gp-sim">${PAGE.similar.map(byId).map(o => `<a href="${pageHref(o, '')}">${cover(o)}0.0 hrs on record</a>`).join('')}</div>
    <div class="gp-ok">Players like you love this game.</div>
    <div class="gp-ok">Currently popular</div>
  </div>

  <div class="gp-rb">
    ${PAGE.features.map(f => `<div class="gp-feat"><span>${featIcon(f)}</span>${f}</div>`).join('')}
    ${pad ? `<div class="gp-sublab">${pad} Controller Support</div><div class="gp-feat pad"><span><svg viewBox="0 0 16 16" aria-hidden="true">${FI.pad}</svg></span>${pad === 'Full' ? 'Most gamepads, including the one in your drawer' : 'Your gamepad, mostly'}</div>` : ''}
    ${PAGE.notes.map(([h, sub]) => `<div class="gp-drm">${h}<small>${sub}</small></div>`).join('')}
  </div>

  <div class="gp-rb gp-langs">
    <div class="gp-sublab" style="margin-top:0">Languages:</div>
    <table><tr><th></th><th>Interface</th><th>Full Audio</th><th>Subtitles</th></tr>
    ${langs.map(([name, ...f], i) => `<tr ${i >= 5 ? 'hidden' : ''}><td>${name}</td>${f.map(x => `<td>${x === '1' ? '✔' : ''}</td>`).join('')}</tr>`).join('')}</table>
    ${langs.length > 5 ? `<button class="gp-linkbtn" data-act="langs">See all ${langs.length} supported languages</button>` : ''}
  </div>

  <h2 class="gp-rh">Vapor Deck Compatibility</h2>
  <div class="gp-rb gp-deck"><span class="i" style="background:${DECK[0]}" aria-hidden="true">${DECK[1]}</span>${PAGE.deck}<span class="grow"></span><button class="gp-b" data-toast="Vapor Deck is not a real device, so every game runs on it perfectly, in theory.">Learn more</button></div>

  <div class="gp-rb">
    <div class="gp-achlab">Includes ${num(PAGE.ach.count)} Vapor Achievements</div>
    <div class="gp-ach">${PAGE.ach.icons.map(([glyph, name]) => `<span class="${glyph.length > 3 ? 's' : ''}" title="${name}">${glyph}</span>`).join('')}<button data-toast="Global unlock rate for every achievement: 0.0%. Nobody launched the game.">View<br>all ${num(PAGE.ach.count)}</button></div>
  </div>

  <div class="gp-rb gp-info">
    <div><b>TITLE:</b> ${g.title}</div>
    <div><b>GENRE:</b> ${PAGE.genres.split(', ').map(storeLink).join(', ')}</div>
    <div><b>DEVELOPER:</b> ${PAGE.dev}</div>
    <div><b>PUBLISHER:</b> ${PAGE.pub}</div>
    <div><b>RELEASE DATE:</b> ${PAGE.release}</div>
    ${PAGE.early ? `<div><b>EARLY ACCESS RELEASE DATE:</b> ${PAGE.early}</div>` : ''}
    <div class="links">
      <button data-toast="The website is under construction. It has been since launch.">Visit the website &#8599;</button>
      <button data-toast="Latest update: 'Various fixes and improvements.' As always.">View update history</button>
      <button data-toast="All related news: this game is on sale.">Read related news</button>
      <button data-toast="Top discussion: 'Is it worth it on sale?' 4,812 replies, no conclusion.">View discussions</button>
      <button data-toast="Community groups found: 1. You are not in it.">Find Community Groups</button>
    </div>
  </div>

  <div class="gp-rb gp-row"><button class="gp-b" data-toast="Embed code copied to nowhere.">Embed</button><button class="gp-b" aria-label="Report this product" data-toast="Reported. A moderator will review it in 6 to 8 business eternities.">&#9873;</button></div>

  ${PAGE.award ? `<div class="gp-rb"><div class="gp-achlab">Awards</div><div class="gp-award">${I.trophy}<p>${PAGE.award[0]}<span>${PAGE.award[1]}</span></p></div></div>` : ''}`;
}

function render() {
  document.title = (g.disc ? `Save ${g.disc}% on ` : '') + g.title + ' on Vapor';
  $('#gp').innerHTML = topHtml() + `<div class="gp-cols"><div class="gp-left">${left()}</div><aside class="gp-right">${right()}</aside></div>`;
  renderStats();
  setMedia(0, false);
  // hide READ MORE when the description is short enough to show in full
  const ab = $('#about');
  if (ab.scrollHeight <= ab.clientHeight + 4) { ab.classList.add('short'); $('#aboutmore').hidden = true }
}

/* ---------- media viewer ---------- */
let cur = 0, playing = false, t = 0, muted = true, timer = 0;
function stageHtml() {
  const m = MEDIA[cur];
  if (!m.video) return art(m.hue, m.shape);
  return `<div class="art gp-vid" style="--h:${m.hue}" data-act="vplay"><svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SHAPES[m.shape]()}</svg><span class="art-title">${g.title}</span></div>
  <span class="gp-vlabel">${g.title} &mdash; ${m.video}</span>
  <div class="gp-player"><div class="gp-prog"><i id="vprog"></i></div><div class="gp-ctrl">
    <button data-act="vplay" id="vplay" aria-label="Play">${I.play}</button>
    <button data-act="vmute" id="vmute" aria-label="Unmute">${I.mute}</button>
    <span id="vtime">0:00 / ${mmss(m.dur)}</span><span class="grow"></span>
    <button aria-label="Settings" data-toast="Quality: 144p. The bandwidth is saved for games you won't play.">${I.gear}</button>
    <button aria-label="Theatre mode" data-toast="Theatre mode is closed for renovations.">${I.theater}</button>
    <button data-act="vfull" aria-label="Full screen">${I.full}</button>
  </div></div>`;
}
function paintVideo() {
  const m = MEDIA[cur]; if (!m.video) return;
  $('#vtime').textContent = `${mmss(t)} / ${mmss(m.dur)}`;
  $('#vprog').style.width = t / m.dur * 100 + '%';
  $('#vplay').innerHTML = playing ? I.pause : I.play;
  $('#vplay').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  $('#vmute').innerHTML = muted ? I.mute : I.sound;
  $('#vmute').setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
  $('#stage').classList.toggle('playing', playing);
}
function stopVideo() { playing = false; clearInterval(timer) }
function playPause() {
  const m = MEDIA[cur];
  if (playing) { stopVideo(); paintVideo(); return }
  if (t >= m.dur) t = 0;
  playing = true;
  timer = setInterval(() => {
    t++;
    if (t >= m.dur) { stopVideo(); toast('That was the whole trailer. You have now seen more of this game than you will ever play.') }
    paintVideo();
  }, 1000);
  paintVideo();
}
function setMedia(i, scroll = true) {
  stopVideo(); t = 0;
  cur = (i + MEDIA.length) % MEDIA.length;
  $('#stage').innerHTML = stageHtml();
  $('#stage').classList.remove('playing');
  paintVideo();
  const strip = $('#strip'), th = strip.children[cur];
  strip.querySelectorAll('.gp-thumb').forEach((b, j) => b.setAttribute('aria-current', String(j === cur)));
  if (scroll && (th.offsetLeft < strip.scrollLeft || th.offsetLeft + th.offsetWidth > strip.scrollLeft + strip.clientWidth))
    strip.scrollLeft = th.offsetLeft - (strip.clientWidth - th.offsetWidth) / 2;
  paintTrack();
}
function paintTrack() {
  const strip = $('#strip'), bar = $('#thumbbar');
  const w = strip.clientWidth / strip.scrollWidth;
  bar.style.display = w >= 1 ? 'none' : '';
  bar.style.width = w * 100 + '%';
  bar.style.left = strip.scrollLeft / strip.scrollWidth * 100 + '%';
}

/* ---------- events ---------- */
function goCart(msg) {
  if (!has('cart') && !has('owned')) { S.cart.push(g.id); persist() }
  if (msg) { toast(msg); setTimeout(() => location.href = '../index.html#cart', 1600) }
  else location.href = '../index.html#cart';
}
const QUEUE_MSGS = {
  wishlist: ['Added to your wishlist. Wishing is free. Keep it that way.', 'Removed from your wishlist. One less thing to want.'],
  following: ["Following. You'll be notified of news you won't read.", 'Unfollowed. The developers will cope.'],
  ignored: ['Ignored. Vapor will stop recommending this game, starting never.', 'No longer ignored. It was always going to come back.']
};
const QUEUE_LABELS = { wishlist: ['✓ On Wishlist', 'Add to your wishlist'], following: ['✓ Following', 'Follow'], ignored: ['✓ Ignored', 'Ignore'] };
function setAcctMenu(open) { $('#acctdrop').hidden = !open; $('#acctbtn').setAttribute('aria-expanded', String(open)) }

document.addEventListener('click', e => {
  if (!e.target.closest('.acct-menu')) setAcctMenu(false);
  const el = e.target.closest('[data-act],[data-toast],[data-media]'); if (!el) return;
  if (el.dataset.toast) { toast(el.dataset.toast); return }
  if (el.dataset.media) { setMedia(+el.dataset.media); return }
  const a = el.dataset.act;
  if (a === 'cart') goCart();
  else if (a === 'bundle') goCart(has('cart') ? '' : 'Only the base game exists, so that is what went in the cart.');
  else if (a in QUEUE_LABELS) {
    const on = toggle(a);
    el.textContent = QUEUE_LABELS[a][on ? 0 : 1]; el.setAttribute('aria-pressed', String(on));
    toast(QUEUE_MSGS[a][on ? 0 : 1]);
  }
  else if (a === 'share') {
    const done = () => toast('Link copied. Send it to someone who also needs to not spend money.');
    navigator.clipboard ? navigator.clipboard.writeText(location.href).then(done, () => toast('Could not copy the link. The address bar still works.')) : toast('Copy the link from the address bar. Sharing is free.');
  }
  else if (a === 'play') toast(PLAY_MSGS[Math.random() * PLAY_MSGS.length | 0]);
  else if (a === 'dlc') {
    const rows = [...document.querySelectorAll('#dlc .gp-dlc')], open = rows.some(r => r.hidden);
    rows.forEach((r, i) => r.hidden = !open && i >= 5);
    if ($('#dlcmore')) { $('#dlcmore').innerHTML = open ? 'SEE LESS &#9652;' : 'SEE ALL &#9662;'; $('#dlccount').textContent = `SHOWING 1 - ${open ? rows.length : 5} OF ${rows.length}` }
  }
  else if (a === 'langs') { document.querySelectorAll('.gp-langs tr[hidden]').forEach(r => r.hidden = false); el.remove() }
  else if (a === 'about') {
    const open = $('#about').classList.toggle('open');
    el.textContent = open ? 'READ LESS' : 'READ MORE'; el.setAttribute('aria-expanded', String(open));
    if (!open) $('#about').scrollIntoView({ block: 'nearest' });
  }
  else if (a === 'prev' || a === 'next') setMedia(cur + (a === 'next' ? 1 : -1));
  else if (a === 'vplay') playPause();
  else if (a === 'vmute') { muted = !muted; paintVideo(); if (!muted) toast('Sound on. The trailer has no audio, which feels right.') }
  else if (a === 'vfull') { const st = $('#stage'); document.fullscreenElement ? document.exitFullscreen() : st.requestFullscreen ? st.requestFullscreen().catch(() => { }) : toast('Full screen is not available here.') }
  else if (a === 'addfunds') { S.wallet += 10000; persist(); renderStats(); toast('Added $100.00. Payment method: imagination.') }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#acctdrop').hidden) { setAcctMenu(false); $('#acctbtn').focus() }
});

/* ---------- boot ---------- */
document.body.style.setProperty('--h', g.hue);
$('#app').innerHTML = header() + '<main class="gp" id="gp"></main><footer class="page">Vapor is a parody. The games, art, and prices are invented, no payment is processed, and it is not affiliated with Valve or Steam. Your state stays in this browser only.</footer>';
$('#acctbtn').onclick = () => setAcctMenu($('#acctdrop').hidden);
render();
$('#strip').addEventListener('scroll', paintTrack, { passive: true });
window.addEventListener('resize', paintTrack);
// Back from the cart restores this page from cache; reload the state so the buttons are current
window.addEventListener('pageshow', e => { if (e.persisted) { S = loadState(); render(); $('#strip').addEventListener('scroll', paintTrack, { passive: true }) } });
