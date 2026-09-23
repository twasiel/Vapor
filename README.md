# VAPOR

**Buy games. Keep your money.**

Vapor is a parody of the Steam store. You browse a storefront, fill a cart, go through a convincing checkout, and get the *"THANK YOU FOR YOUR PURCHASE!"* screen. No money changes hands. The games are made up, the wallet is fake, and the only thing that goes up is a counter showing how much real money you didn't spend.

It's for the part of your brain that wants to hit **Purchase** during a sale, not the part that has 47 unplayed games already.

> Vapor is a parody. The games, art, and prices are invented, no payment is processed, and it is not affiliated with Valve or Steam.

---

## Features

### The store
- **Featured & recommended** carousel that rotates every 6 seconds and pauses while you hover over it.
- **Special offers** grid of 16 made-up games (*Dungeon Crawler Accountant 2*, *Factory Factory*, *Segfault Simulator*, *Backlog: The Game*, …) with discount badges and struck-through list prices.
- A **"Sale ends in"** countdown that runs to midnight every day, so the pressure is always on.
- Search, plus genre filter pills.
- Cover art is generated in the browser from a hue and a shape (SVG), so there are no image files.

### The cart
- Steam-style cart with platform icons, a "For my account / As a gift" selector, an estimated total, and **Recommendations for you**. The cart always has more to sell you.

### The checkout
- Line items, subtotal, and total, with "All prices include VAT where applicable".
- **Vapor Points** earned on every purchase.
- A saved card ("Visa ending in \*\*42"). There is only one card and it's fake.
- A **security code** field that accepts any 3–4 digits and doesn't store or send them.
- A **Vapor Subscriber Agreement** checkbox. Open the agreement to find clauses like *"0.0 hours played is a feature, not a bug."*
- The **Purchase** button stays disabled until you've entered a code and ticked the box, just like the real thing.

### The payoff
- A **Thank You** page with a receipt, a confirmation code (`VPR-XXXXX-XXXXX`), your points balance, and a Print button.
- The games show up in your **Library**. You can press **Play**, but you'll get messages like *"Vapor is updating. It has been updating since 2019."*

### The ledger
A panel at the top of every page tracks:

| Stat | Meaning |
|---|---|
| **Real money not spent** | The total of every checkout you "paid". It animates up after each purchase. |
| **Games owned** | Pretend games in a library that looks real. |
| **Hours played** | Always 0.0, like a real Steam library. |
| **Backlog clear time** | Hours to finish everything you own, at 1.5 h/day. |

The fake wallet starts at **$100.00**. **Add funds** adds another $100, paid for with your imagination.

---

## Running it

Vapor is three static files (`index.html`, `style.css`, `script.js`) with no build step, dependencies, or server.

**Easiest:** open `index.html` in any modern browser.

**From VS Code:** the included launch config (`.vscode/launch.json`) opens the page in Firefox. Press <kbd>F5</kbd> and pick **Open index.html in Firefox**. You'll need the [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) extension (you may also change it to the browser of your choice).

**Serve it locally** (optional):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## How it works

There's no framework:

| File | Contents |
|---|---|
| `index.html` | Page markup for every view |
| `style.css` | All styling, including the mobile layout under 820px |
| `script.js` | Plain JavaScript: game data, state, rendering and event handling |

- **Data:** the game catalogue is the `G` array. Prices are stored in cents (`base`) with a percentage `disc`. `FEATURED` lists the IDs shown in the carousel.
- **State:** a single object `S` (wallet, owned, cart, money saved, points, …) saved to `localStorage` under the key `vapor-v1`. Your progress stays in your browser and nothing is sent anywhere.
- **Views:** Store, Library, Cart, Checkout, and Thank You are `<section>`s that are shown or hidden by `show(view)`.
- **Rendering:** `renderAll()` redraws every view from `S` and saves the state.

### Adding a game

Add an entry to the `G` array in `script.js`:

```js
{ id: 17, title: "Your Game", genre: "Puzzle", tags: "Puzzle, Cozy",
  base: 1999,      // list price in cents ($19.99)
  disc: 50,        // discount in percent
  hue: 210,        // cover art colour (0–360)
  shape: "wave",   // sun | tri | grid | wave | blocks
  hrs: 20,         // hours to finish, used for the backlog stat
  blurb: "One-line pitch shown in the featured carousel." }
```

Give it a unique `id`, and add that `id` to `FEATURED` if you want it in the carousel. A new `genre` gets its own filter pill automatically.

### Resetting

In the **Library**, click **Reset demo** twice to wipe your state. You can also clear the `vapor-v1` key in your browser's storage.

---

## Accessibility

- You can navigate everything with the keyboard, and focus rings are visible.
- The carousel doesn't auto-rotate and the numbers don't animate if you have **reduced motion** turned on.
- Notifications are read out through an `aria-live` region.
- The layout switches to a single column on narrow screens.

---

## License

Released under the [MIT License](LICENSE).

---

## Disclaimer

Vapor is a joke and a harmless outlet. It isn't a store, doesn't take payments, and isn't connected to Valve Corporation or Steam. All game titles, art, and prices are made up. Gaben remains unpaid.
