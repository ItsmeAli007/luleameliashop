# Amelia Flowers — Tirana

Bilingual (English / Shqip) storefront for Amelia Flowers, built from the Modernist
design system in the Claude Design project: Archivo variable type, red accent,
zero corner radius, flush-left composition, 2px rules.

## Running it

Any static file server works — there is no build step.

```bash
npx http-server . -p 4321 -c-1
```

Then open http://localhost:4321.

## Structure

```
index.html      Homepage — hero, featured bouquets, story, reviews, newsletter
shop.html       Catalogue with category filters
product.html    Product detail (reads ?id= from the URL)
checkout.html   Delivery details + cash-on-delivery order, confirmation screen
css/style.css   Design tokens and all component styles
css/liquid-glass.css  Visual layer — Amelia palette, glass surfaces, hero, motion
js/config.js    Shop settings — WhatsApp number lives here
js/products.js  Product catalogue and price formatting
js/i18n.js      EN/SQ/IT dictionary, language switcher (defaults to Albanian)
js/cart.js      Cart state (localStorage) and drawer
js/main.js      Header, reveals, page controllers, checkout, WhatsApp hand-off
js/liquid-glass.js    Scroll progress, hero parallax, card tilt — motion only
assets/         Photography and logos, at the sizes the pages serve
_original-photos/     PNG masters — gitignored, see the readme inside
```

### The liquid-glass layer

`css/liquid-glass.css` and `js/liquid-glass.js` load *after* the stylesheet and
scripts above and are additive: the CSS restyles markup `style.css` already
defines, and the JS only writes CSS custom properties. Neither is referenced by
the cart, catalogue, language or checkout code, so removing the two `<link>` /
`<script>` tags returns the site to the flat editorial system with every
function intact.

Reusable pieces: `.lg-glass` (light surface) and `.lg-glass--dark`, both built
from the `--lg-*` tokens at the top of the file. Anything given one of those
classes picks up the blur, the hairline border, the inner highlight, the
shadow and the directional sheen, with an opaque fallback for browsers without
`backdrop-filter`.

## Images

All photography is installed and optimized. Source PNGs totalled 5.0 MB; they
were resized to their maximum rendered width and re-encoded, bringing the whole
`assets/` folder to **712 KB**.

### Hero photograph

The homepage hero is a single still, cropped from `_original-photos/hero/heroroseflowers.png`
into two files:

| File | Served to | Size |
|---|---|---|
| `hero-amelia.jpg` / `.webp` | 721 px and wider — the full 16:9 frame, its empty burgundy field on the left carrying the headline | 1672 × 941 · 160 KB / 80 KB |
| `hero-amelia-mobile.jpg` / `.webp` | 720 px and below — the same frame cropped to the rose cluster, so a portrait viewport is not throwing away two thirds of a landscape photo | 719 × 941 · 94 KB / 52 KB |

`<picture>` picks between them on a `media` query, and WebP before JPEG. The
earlier looping video and its `initHeroVideo()` loader are gone: the hero now
downloads one image of about 80 KB instead of up to 1 MB of video, and the
cinematic zoom, the pointer parallax and the entrance are handled by
`css/liquid-glass.css` and `js/liquid-glass.js` (all three respect
`prefers-reduced-motion`, and the parallax is skipped on touch).

To change the hero, replace those four files — or point the `<picture>` in
`index.html` at any other photo in `assets/`.

| File | Used for | Rendered |
|---|---|---|
| `hero-amelia.jpg` | Hero, 721 px and wider | 1672 × 941 |
| `hero-amelia-mobile.jpg` | Hero, 720 px and below | 719 × 941 |
| `photo-hero-woman.jpg` | Visit panel | 1718 × 915 |
| `photo-roses-closeup.jpg` | Story band | 1600 × 581 |
| `photo-red-roses.jpg` | Two Dozen Red Roses | 1127 × 1396 |
| `photo-rose-box.jpg` | Roses in a Keepsake Box | 1127 × 1396 |
| `photo-seasonal-bouquet.jpg` | Seasonal Garden Bouquet | 1127 × 1396 |
| `photo-wedding-bouquet.jpg` | Bridal Wedding Bouquet | 1127 × 1396 |
| `photo-orchid.jpg` | Elegant Potted Orchid | 1127 × 1396 |
| `photo-birthday.jpg` | Birthday Colour Burst | 1127 × 1395 |
| `amelia-wordmark.png` | Header + footer lockup, AMELIA + tulip (alpha) | 1100 × 336 |
| `amelia-lockup.png` | Full lockup incl. FLOWER SHOP subline (alpha) | 1200 × 424 |
| `og-amelia.jpg` | Social sharing card | 1200 × 630 |
| `favicon-32.png` / `-180` / `-512` | Tab icon and app icon, tulip on wine | square |

Every product photo is a 4:5 portrait. Each one is set by the `img:` field of
its entry in `js/products.js` — that single field feeds the home grid, the
shop catalogue, the product page, the cart and the checkout summary.

`photo-bouquet-marble.*`, `photo-giftbox.*` and the old `hero-roses.*` video
files have been deleted — nothing referenced them. `assets/` is now 3.0 MB.

A `.webp` sits beside each photo, 40-50% smaller than the JPEG. These are not
decorative: `photoPicture()` in `js/main.js` swaps the extension at runtime and
offers the WebP first, so on any current browser the `.webp` is the file that
actually loads and the `.jpg` is only the fallback. Replacing a photograph
means replacing **both** — a rebuilt JPEG beside a stale WebP looks correct in
the folder and wrong on the site.

The JPEGs are re-encoded from the PNG masters in `_original-photos/`; the
product shots are quality 65. Re-run from those if you want different
settings — do not re-encode a JPEG from a JPEG. `_original-photos/readme.md`
carries the master → asset table and the two commands, including the reason
WebP cannot be built with `sips`.

If an image is ever missing, the slot renders a labelled placeholder panel
instead of a broken icon, and clears itself once a real file loads.

PNG masters are preserved in `_original-photos/`, sorted into `products/`,
`hero/` and `brand/`.

## Adding or editing products

Everything comes from the `PRODUCTS` array in `js/products.js`. Each entry needs
both languages:

```js
{
  id: "red-roses",              // used in the URL and cart
  img: "assets/photo-....png",
  cat: "roses",                 // must match a key in CATEGORIES
  price: 4500,                  // whole Lek
  name: { en: "...", sq: "..." },
  desc: { en: "...", sq: "..." },
  tag:  { en: "Bestseller", sq: "Më i shituri" }   // or null
}
```

## Translations

`js/i18n.js` holds one flat dictionary per language. Markup opts in with
`data-i18n="key"` (text) or `data-i18n-placeholder="key"` (inputs). The chosen
language persists in `localStorage` and applies to dynamically rendered content
via the `pf:langchange` event.

Both dictionaries must define the same keys — a missing Albanian key silently
falls back to English.

## Orders

Checkout collects name, phone, address, city and optional delivery notes.
**Cash on delivery is the only payment method** — no card or payment details are
collected anywhere in the flow.

### Orders reach you on WhatsApp

**Two numbers, two jobs.** Both live in `js/config.js`:

```js
whatsapp:        "355XXXXXXXXX",   // receives orders from checkout
contactWhatsapp: "355XXXXXXXXX",   // the public "Message us" links
```

International format, digits only — no `+`, no spaces. Albania is `355`, and you
**drop the leading 0**: `069 123 4567` becomes `355691234567`. The live numbers
are in `js/config.js`, not here.

They are separate on purpose: the order line stays clear of general enquiries,
and the public one can change without touching checkout.

**The public number is never printed as digits.** `phoneDisplay` is `""`, so
everywhere the site would show a phone number — footer, Visit panel, mobile
menu, checkout — it renders a *Message us on WhatsApp* link instead. Set
`phoneDisplay` to a string such as `"+355 69 123 4567"` if you ever want the
dialable number shown in plain text; the site switches to `tel:` links on its
own. It is also deliberately absent from the structured data in `index.html`,
which is what stops it appearing in a Google result.

When an order is placed, WhatsApp opens with it pre-written and addressed to you.
The customer presses send and it arrives on your phone:

```
🌹 POROSI E RE — Amelia Flowers
Nr: PF-20260807-4112

KLIENTI
Emri: <emri i klientit>
Tel: <numri i klientit>
Adresa: <adresa e dorëzimit>
Shënime: <shënime>

POROSIA
2 × Dy Duzina Trëndafila të Kuq — 9 000 L
1 × Trëndafila në Kuti Kujtimi — 3 200 L

TOTALI: 12 200 L
Pagesa: Cash në dorëzim
```

The message is always Albanian, even when the customer browsed in English —
you are the one reading it.

**The limitation, stated plainly:** the customer has to press send, and no code
on this page can make them. Once `wa.me` opens, the message is inside WhatsApp —
the browser cannot see whether it was sent, cannot send it, and is not told
either way. That is a security boundary, not a missing feature.

So the order is *also* posted directly from the checkout page the moment the
form is submitted. See **Receiving orders reliably** below.

### Receiving orders reliably

Set `orderEndpoint` in `js/config.js` to any service that accepts a JSON POST,
and every order is recorded without the customer doing anything:

```js
orderEndpoint:    "https://api.web3forms.com/submit",
orderEndpointKey: "your-access-key",
```

The POST carries `order_number`, `name`, `phone`, `address`, `notes`, `total`,
`date`, and `order` — the last being the same Albanian message WhatsApp would
have shown you, so the record and the ping read identically.

**The confirmation screen tells the truth about which happened.** It has two
states:

| State | When | What the customer sees |
|---|---|---|
| Recorded | the POST succeeded | Tick, "Order received", WhatsApp offered as optional |
| Pending | no endpoint set, or the POST failed | Arrow, "One step left", WhatsApp emphasised as the thing still to do |

It starts in Pending and only upgrades once the POST actually returns ok, with
an 8-second timeout so a slow service cannot hang the screen. Being optimistic
first would mean telling someone their flowers are coming when nothing had
reached you — worse than losing the order, because they wait instead of
reordering.

**While `orderEndpoint` is empty every order is Pending**, which is honest but
still loses orders. Fill it in.

**A note on the key.** Everything in `config.js` is readable by any visitor.
Web3Forms access keys are designed for this — submit-only, cannot read your
submissions. Never put a secret API token there; if a service needs one, it
needs a server, not this file.

Set `whatsapp: ""` to switch the hand-off off — the button hides and checkout
falls back to the plain confirmation screen.

## Spam and abuse

**Your best protection is the channel, not the code.** Orders arrive as WhatsApp
messages, so a spammer has to send them from their own WhatsApp account — which
means a real SIM. You can block and report the number in WhatsApp, and WhatsApp
rate-limits them before they ever reach you. This is much harder to abuse than a
web form that emails you anonymously.

Four limits are enforced in the browser (tunable in `js/config.js`):

| Limit | Default | Stops |
|---|---|---|
| `maxQtyPerItem` | 25 | The fake "9999 roses" order |
| `maxOrdersPerWindow` / `orderWindowMinutes` | 3 per 15 min | Casual repeat ordering |
| Double-submit guard | always on | One order sent twice by a double-click |
| Honeypot field | always on | Naive form-filling bots |

**What these do not do.** They run in the visitor's own browser. Anyone who
opens developer tools, clears their storage, or uses a private window can get
straight past them. Treat them as protection against mistakes and nuisance, not
against a determined attacker. Real enforcement needs a server, which a static
site does not have.

**What actually protects the business.** Cash on delivery means nobody can take
money from you — the exposure is wasted flowers and a wasted trip. So:

1. **Phone the customer before you cut anything.** Their number is in every
   order message. One call kills every fake order, and it is the single most
   effective thing on this list.
2. Be wary of large first-time orders, or an address that does not match the
   phone's area.
3. If one number floods you, block it in WhatsApp — it stops at their end.

If spam ever becomes a genuine problem, the fix is a real backend or a form
service with server-side rate limiting and a CAPTCHA. Ask for it then, not now.

## Notes

- Reveal animations are scoped to `html.js`, so if JavaScript fails the content
  renders visible rather than stuck transparent.
- `prefers-reduced-motion` is respected.
- Customers who place an order do see the *orders* number, because it is part
  of the `wa.me/…` link their WhatsApp opens. That is inherent to the hand-off;
  only the public contact number is kept out of the page itself.


## Brand assets

The logo is supplied as `_original-photos/brand/amelialogowebsite.png` — wine-red
artwork on a white background. The two files in `assets/` are cut from it:
the white is removed so the mark carries an alpha channel, which is what lets
the header knock it out to white over the hero (`filter:brightness(0)
invert(1)` in `css/style.css`).

`amelia-wordmark.png` is the one the site uses. It stops above the FLOWER SHOP
subline: at the 27–30px the header and footer set, that subline would render
about 3px tall and turn to mush. `amelia-lockup.png` keeps it, and is what the
structured-data `logo` field points at — for anywhere the mark is shown large:
print, a supplier's directory listing.

Both are served as PNG rather than WebP, because the alpha channel is the whole
point of them; the WebP siblings nothing ever requested have been deleted.

The photographs were re-shot with the Amelia mark on the wrap, the box and the
card. No PrimaFlowers artwork remains in the project.

`og:image` is absolute (`https://luleamelia.com/assets/og-amelia.jpg`) in all
four heads, alongside a `canonical` and an `og:url`. If the domain ever
changes, those are the values to update — plus `robots.txt` and `sitemap.xml`.

## Launch checklist

Done in the pre-launch pass:

- [x] Real WhatsApp numbers wired in — orders and public contact, kept separate
- [x] Public number never rendered as digits; WhatsApp links instead
- [x] `og:image` absolute, plus `canonical` and `og:url` on all four pages
- [x] Phone validation rejects digit-free input (`((((((`, `++++++`) and
      repeated-digit placeholders — the field the shop relies on to confirm orders
- [x] Dead `href="#"` links removed; Facebook icon self-removes until
      `SHOP.facebook` is set
- [x] `robots.txt`, `sitemap.xml` and a branded `404.html` added
- [x] Unsupported claims removed — the twelve-years line and the "Opened in 2026" stat
- [x] `_original-photos/` and `.DS_Store` gitignored; dead assets deleted

Still open, and deliberately left to a decision:

- [x] **Testimonials** labelled as samples in all three languages. Replace them
      with real messages once the first customers write in — the label comes
      out with them.
- [x] **Newsletter** replaced with WhatsApp and Instagram links, so the section
      no longer collects addresses nobody reads.

Still open:

- [ ] **Set `orderEndpoint`.** The single most valuable thing left. Until it is
      set, every order depends on the customer pressing send in WhatsApp, and
      the confirmation screen has to tell them so. See *Receiving orders
      reliably*.
- [ ] **Delivery & Payment / FAQ pages.** The footer links to them were removed
      because the pages do not exist. Worth writing — they are the two things
      customers ask before a first order.
