/* Amelia Flowers — site behaviour: header, reveals, products, checkout */

/* ---------------- image fallbacks ----------------
   Any photo that fails to load is replaced by a labelled placeholder panel,
   so the layout still reads as designed while artwork is pending. */
const SLOT_LABELS = {
  "hero-amelia.jpg":          { en: "Hero still",      sq: "Fotografia kryesore", it: "Fermo immagine",  hint: "1672 × 941 · 16:9" },
  "hero-amelia-mobile.jpg":   { en: "Hero still",      sq: "Fotografia kryesore", it: "Fermo immagine",  hint: "719 × 941 · portrait" },
  "photo-hero-woman.jpg":     { en: "Hero photograph", sq: "Fotografia kryesore", it: "Foto principale", hint: "1718 × 915 · landscape" },
  "photo-red-roses.jpg":      { en: "Red roses",       sq: "Trëndafila të kuq",   it: "Rose rosse",      hint: "1127 × 1396 · 4:5" },
  "photo-roses-closeup.jpg":  { en: "Roses close-up",  sq: "Trëndafila nga afër", it: "Rose da vicino",    hint: "1600 × 581 · wide" },

  /* Awaiting artwork. Each of these is a real product photo that has not
     been shot yet — drop a file with the matching name into assets/ and the
     placeholder disappears on its own, no code change needed. */
  "photo-wedding-bouquet.jpg": { en: "Bridal bouquet",  sq: "Buqetë nusërie",     it: "Bouquet da sposa", hint: "1000 × 1250 · 4:5" },
  "photo-orchid.jpg":          { en: "Potted orchid",   sq: "Orkide në vazo",      it: "Orchidea in vaso", hint: "1000 × 1250 · 4:5" },
  "photo-birthday.jpg":        { en: "Birthday bouquet", sq: "Buqetë ditëlindjeje", it: "Bouquet compleanno", hint: "1000 × 1250 · 4:5" },
  "photo-rose-box.jpg":        { en: "Rose gift box",   sq: "Kuti me trëndafila",  it: "Scatola regalo",   hint: "1000 × 1250 · 4:5" },
  "photo-seasonal-bouquet.jpg":{ en: "Seasonal bouquet", sq: "Buqetë sezonale",    it: "Bouquet di stagione", hint: "1000 × 1250 · 4:5" }
};

/* ---------------- WebP delivery ----------------
   Every photo in assets/ ships with a .webp sibling, 40-50% smaller than the
   JPEG at the same quality. The <img> keeps the .jpg, so a browser that
   cannot read WebP still gets the photograph rather than nothing. */
/* Root-absolute, always. These cards are rendered into /shop.html and into
   /en/shop.html from the same array of relative paths, and a relative srcset
   on the English page points at /en/assets/, which is not where the photos
   live. The intrinsic size goes on every card for the same reason the static
   images carry one: it reserves the box before the bytes land. */
function pictureHTML(src, attrs) {
  const abs = "/" + src.replace(/^\//, "");
  const webp = abs.replace(/\.(jpe?g|png)$/i, ".webp");
  return `<picture><source srcset="${webp}" type="image/webp">` +
         `<img src="${abs}" width="1126" height="1397" decoding="async" ${attrs}></picture>`;
}

/* A <source> that 404s is not something the browser recovers from on its own
   — it picks the source by type, fails, and shows nothing; it does not fall
   back to the <img>. So on the first error strip the sources and let the img
   reload from its own src. Only if the JPEG fails too does the placeholder
   panel appear. */
function dropWebpSource(img) {
  const pic = img.parentElement;
  if (!pic || pic.tagName !== "PICTURE" || !pic.querySelector("source")) return false;
  pic.querySelectorAll("source").forEach(node => node.remove());
  const src = img.getAttribute("src");
  img.removeAttribute("src");
  img.setAttribute("src", src);
  return true;
}

/* With <picture> in the way, the img's parent is no longer the positioned
   box the placeholder needs to fill. */
function slotHost(img) {
  const parent = img.parentElement;
  return parent && parent.tagName === "PICTURE" ? parent.parentElement : parent;
}

function buildSlot(img) {
  const file = (img.getAttribute("src") || "").split("/").pop();
  const meta = SLOT_LABELS[file] || { en: "Photograph", sq: "Fotografi", it: "Fotografia", hint: file };
  const lang = LangStore.get();
  const slot = document.createElement("div");
  slot.className = "img-slot";
  slot.dataset.file = file;
  slot.innerHTML = `<span>Amelia Flowers</span><b>${meta[lang] || meta.en}</b><em>${meta.hint}</em>`;
  img.style.display = "none";
  const host = slotHost(img);
  if (host && !host.querySelector(".img-slot")) host.appendChild(slot);
}

function clearSlot(img) {
  img.style.display = "";
  const host = slotHost(img);
  const slot = host && host.querySelector(".img-slot");
  if (slot) slot.remove();
}

function initImageFallbacks(scope) {
  (scope || document).querySelectorAll("img").forEach(img => {
    if (img.classList.contains("brand-lockup") || img.classList.contains("foot-lockup")) return;
    if (img.dataset.slotWired) {
      if (img.complete && img.naturalWidth === 0) buildSlot(img);
      return;
    }
    img.dataset.slotWired = "1";
    if (img.complete && img.naturalWidth === 0) buildSlot(img);
    /* Try the JPEG before declaring the photo missing. */
    img.addEventListener("error", () => { if (!dropWebpSource(img)) buildSlot(img); });
    img.addEventListener("load", () => { if (img.naturalWidth > 0) clearSlot(img); });
  });
}

/* ---------------- shop details ----------------
   Address and phone number come from SHOP in js/config.js, so there is one
   place to change them rather than a footer and a mobile menu on four pages.
   The markup carries the current values as its own text, so a visitor whose
   JS never runs still sees where the shop is — this only overwrites them. */
/* Built from coordinates rather than from a Google share link. A share link
   resolves to whichever *place* Google matched, and for a shop on a long road
   that place is the road — so the map opens fitted to the whole street
   instead of to the door. Coordinates land exactly where the pin is.

   This is the documented Google Maps URLs scheme: no API key, no billing
   account, and it hands off to the Maps app on a phone rather than the
   browser. Anything else in SHOP.location.mapsUrl is only a fallback. */
function buildMapsUrl(loc) {
  if (!loc) return null;
  if (loc.lat != null && loc.lng != null) {
    const at = encodeURIComponent(loc.lat + "," + loc.lng);
    return loc.mapsMode === "directions"
      ? "https://www.google.com/maps/dir/?api=1&destination=" + at
      : "https://www.google.com/maps/search/?api=1&query=" + at;
  }
  if (loc.mapsUrl) return loc.mapsUrl;
  /* No coordinates yet — search for the address text instead. Less precise
     than a pin, but it still opens on the right street. */
  if (loc.address) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(loc.address);
  }
  return null;
}

/* Apple's equivalent, and equally key-free. On an iPhone or a Mac this hands
   straight off to the Maps app; everywhere else maps.apple.com opens Apple's
   web map, so the link is not a dead end for anyone. */
function buildAppleMapsUrl(loc) {
  if (!loc) return null;
  if (loc.lat == null || loc.lng == null) {
    return loc.address
      ? "https://maps.apple.com/?q=" + encodeURIComponent(loc.address)
      : null;
  }
  const at = loc.lat + "," + loc.lng;
  if (loc.mapsMode === "directions") {
    return "https://maps.apple.com/?daddr=" + encodeURIComponent(at) + "&dirflg=d";
  }
  /* q labels the pin that ll drops — without it Apple shows a bare marker. */
  const label = loc.mapLabel || "";
  return "https://maps.apple.com/?ll=" + encodeURIComponent(at) +
         (label ? "&q=" + encodeURIComponent(label) : "") + "&z=17";
}

function initShopDetails() {
  if (typeof SHOP === "undefined") return;

  const loc = SHOP.location;
  if (loc && loc.address) {
    document.querySelectorAll("[data-shop-address]").forEach(el => {
      el.textContent = loc.address;
    });
  }
  const links = [
    ["[data-shop-directions]", buildMapsUrl(loc)],
    ["[data-shop-directions-apple]", buildAppleMapsUrl(loc)]
  ];
  links.forEach(([selector, url]) => {
    if (!url) return;
    document.querySelectorAll(selector).forEach(a => {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    });
  });

  /* One handle in config becomes the link and the visible @name. An empty
     handle removes the icon: a footer link that goes nowhere reads as a
     shop that has stopped paying attention. */
  const handle = (SHOP.instagram || "").trim().replace(/^@/, "");
  document.querySelectorAll("[data-shop-instagram]").forEach(a => {
    if (!handle) { a.remove(); return; }
    a.href = "https://www.instagram.com/" + encodeURIComponent(handle) + "/";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Instagram — @" + handle);
    /* Only the text links carry this; the icons stay icons. */
    if (a.hasAttribute("data-shop-instagram-text")) a.textContent = "@" + handle;
  });

  /* ── How customers reach the shop ────────────────────────────────
     Two possible shapes, and config decides which:

       phoneDisplay set   → a plain dialable number, printed and tel:-linked
       otherwise          → a "Message us on WhatsApp" link, no digits shown

     The second is the current setup: the number is deliberately not
     published as text, so it cannot be dialled cold or scraped, and the
     shop answers on one channel it already watches. Anything hooked with
     data-shop-phone becomes whichever of the two is configured. */
  const contact = (SHOP.contactWhatsapp || "").replace(/\D/g, "");

  document.querySelectorAll("[data-shop-phone]").forEach(el => {
    /* Some of these links carry an icon beside the words, so the text goes
       into the labelled span when there is one — writing over the link
       itself would take the icon with it. */
    const label = el.querySelector("[data-phone-label]") || el;
    if (SHOP.phoneDisplay) {
      label.textContent = SHOP.phoneDisplay;
      /* tel: wants the dialable form — digits and a leading +, nothing else. */
      if (el.tagName === "A") el.href = "tel:" + SHOP.phoneDisplay.replace(/[^\d+]/g, "");
      return;
    }
    if (!contact) { el.remove(); return; }
    label.textContent = t("contact.whatsapp");
    label.setAttribute("data-i18n", "contact.whatsapp");
    if (el.tagName === "A") {
      el.href = "https://wa.me/" + contact;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  /* Same rule as Instagram: a page that does not exist yet removes its
     own icon rather than linking to "#". */
  const fb = (SHOP.facebook || "").trim().replace(/^@/, "");
  document.querySelectorAll("[data-shop-facebook]").forEach(a => {
    if (!fb) { a.remove(); return; }
    a.href = /^https?:\/\//i.test(fb) ? fb : "https://www.facebook.com/" + encodeURIComponent(fb);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* The WhatsApp icon in the footer social row, and anything else that
     wants the channel without the label. */
  document.querySelectorAll("[data-shop-whatsapp]").forEach(a => {
    if (!contact) { a.remove(); return; }
    a.href = "https://wa.me/" + contact;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", t("contact.whatsapp"));
  });
}

/* ---------------- header on scroll ---------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    const close = () => {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("no-scroll");
    };
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      document.documentElement.classList.toggle("no-scroll", open);
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
}

/* ---------------- scroll reveals ---------------- */
function initReveal() {
  const els = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -60px 0px" });
  els.forEach(el => io.observe(el));

  setTimeout(() => els.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
  }), 1200);
}

/* The hero used to lazily attach a looping video over its poster. It is now
   a single photograph (see the note in index.html), so that code and its
   ~1 MB of conditional downloads are gone rather than left dormant. The
   cinematic zoom and the pointer parallax live in css/liquid-glass.css and
   js/liquid-glass.js. */

/* ---------------- hero entrance ---------------- */
/* ---------------- first-visit intro ----------------
   Shown once per session, on the homepage only: a returning visitor and
   anyone moving between pages gets the site immediately. The panel lifts as
   soon as the hero photograph is decoded — the wait is the image, not a
   fixed timer — with a floor so the rose is never half-drawn when it goes,
   and a cap so a slow connection cannot hold the page hostage. */
function initPreloader() {
  const pl = document.getElementById("preloader");
  if (!pl) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  /* Private mode can throw on both of these rather than return null. */
  try { seen = sessionStorage.getItem("amelia:intro") === "1"; } catch (e) {}
  if (reduced || seen) { pl.remove(); return; }
  try { sessionStorage.setItem("amelia:intro", "1"); } catch (e) {}

  document.documentElement.classList.add("intro", "no-scroll");

  /* The rose is complete about 1.25s after it starts drawing. */
  const DRAW = 1350;
  const CAP  = 2800;   /* past this the photograph is not worth waiting for */
  let drawnAt = 0, imageReady = false, done = false;

  const lift = () => {
    if (done) return;
    done = true;
    document.documentElement.classList.remove("intro", "no-scroll");
    pl.classList.add("is-out");
    /* The hero starts its own wipe now, so the two run as one movement. */
    document.dispatchEvent(new Event("amelia:intro-out"));
    setTimeout(() => pl.remove(), 1000);
  };

  /* Lift once the photograph is ready AND the rose has had its full draw —
     whichever of the two is slower. */
  const maybeLift = () => {
    if (!imageReady || !drawnAt) return;
    setTimeout(lift, Math.max(0, drawnAt + DRAW - performance.now()));
  };

  /* CSS starts the rose the moment the panel is styled, which on a phone can
     be several hundred milliseconds before the first paint — the visitor then
     opens the page onto a rose that has already finished drawing. Rewinding
     every animation on the first frame that is genuinely on screen is what
     makes the draw something you watch rather than something you missed, and
     it is also where the floor above starts counting. */
  const startDrawing = () => {
    const list = pl.getAnimations
      ? pl.getAnimations({ subtree: true })
      : (document.getAnimations ? document.getAnimations().filter(a => a.effect && pl.contains(a.effect.target)) : []);
    list.forEach(a => { try { a.currentTime = 0; } catch (e) {} });
    drawnAt = performance.now();
    maybeLift();
  };
  requestAnimationFrame(() => requestAnimationFrame(startDrawing));

  const img = document.querySelector(".hero-media img");
  const imageDone = () => { imageReady = true; maybeLift(); };
  if (img && !img.complete) {
    img.addEventListener("load", imageDone, { once: true });
    img.addEventListener("error", imageDone, { once: true });
  } else {
    imageDone();
  }
  /* Nothing above is trusted to be the only way out. */
  setTimeout(lift, CAP);
}

function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const start = () => setTimeout(() => hero.classList.add("loaded"), 60);
  if (!document.documentElement.classList.contains("intro")) { start(); return; }
  /* Wait for the intro to lift — but never on the intro alone: the hero's
     text sits at opacity:0 until .loaded, so a failure there would leave the
     page blank. The floor fires regardless. */
  document.addEventListener("amelia:intro-out", start, { once: true });
  setTimeout(start, 2800);
}

/* ---------------- product cards ---------------- */
function productCardHTML(p, lang) {
  const tag = p.tag ? `<span class="p-tag">${p.tag[lang]}</span>` : "";
  const href = productPath(p, lang);
  return `
  <article class="p-card" data-reveal>
    <a href="${href}" class="p-media">
      ${tag}
      ${pictureHTML(p.img, `alt="${p.name[lang]}" loading="lazy"`)}
    </a>
    <div class="p-body">
      <span class="p-cat">${t("footer.shop." + p.cat, lang)}</span>
      <h3 class="p-name"><a href="${href}">${p.name[lang]}</a></h3>
      <p class="p-desc">${p.desc[lang]}</p>
      <div class="p-foot">
        <span class="p-price">${formatLek(p.price)}</span>
        <button class="add-btn" data-add="${p.id}" aria-label="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function wireAddButtons(scope) {
  (scope || document).querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.add;
      const qty = parseInt(btn.dataset.qty || "1", 10);
      const lang = LangStore.get();
      if (Cart.atCap(id)) { showToast(t("error.maxqty", lang)); return; }
      Cart.add(id, qty);
      btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
      const p = getProduct(id);
      showToast(`${t("pd.added", lang)} — ${p.name[lang]}`);
    });
  });
}

function renderGrid(container, products) {
  const lang = LangStore.get();
  container.innerHTML = products.length
    ? products.map(p => productCardHTML(p, lang)).join("")
    : `<p class="text-muted" style="padding:60px var(--gutter)">${t("shop.empty", lang)}</p>`;
  wireAddButtons(container);
  initImageFallbacks(container);
  initReveal();
}

/* ---------------- structured data ----------------
   The catalogue lives in js/products.js and nowhere else, so the Product
   and ItemList markup a search engine reads is built from that same array
   rather than hand-written into the HTML — one list, no drift.

   These are written after render, which means a crawler has to execute the
   page to see them. Google does; most others do not. The durable fix is a
   real URL per bouquet with its markup already in the HTML — see the SEO
   punch list. Until then this is strictly better than nothing.
   ------------------------------------------------------------------- */
const SHOP_ID = "https://luleamelia.com/#shop";

/* /en/shop.html -> "/en", /shop.html -> "". Every generated link has to
   stay inside the language the visitor is actually reading. */
function langPrefix() {
  const m = location.pathname.match(/^\/(en|it)\//);
  return m ? "/" + m[1] : "";
}

function absUrl(path) {
  return new URL(path, location.origin).href;
}

function productUrl(p, lang) {
  return absUrl(productPath(p, lang));
}

function setMeta(selectorAttr, content) {
  const el = document.head.querySelector("meta[" + selectorAttr + "]");
  if (el) el.setAttribute("content", content);
}

function setCanonical(url) {
  const el = document.head.querySelector('link[rel="canonical"]');
  if (el) el.href = url;
}

function jsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

/* One bouquet, as an offer. The delivery block is the part that matters for
   the send-to-Albania audience: it says, in machine-readable form, that the
   thing is delivered inside Tirana on the same day — which is the whole
   question someone in Milan or Munich is asking. */
function productSchema(p, lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl(p, lang) + "#product",
    "name": p.name[lang],
    "description": p.desc[lang],
    "sku": p.id,
    "image": absUrl("/" + p.img.replace(/^\//, "")),
    "url": productUrl(p, lang),
    "category": t("footer.shop." + p.cat, lang),
    "brand": { "@type": "Brand", "name": "Amelia Flowers" },
    "offers": {
      "@type": "Offer",
      "url": productUrl(p, lang),
      "priceCurrency": "ALL",
      "price": p.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@id": SHOP_ID },
      "areaServed": { "@type": "City", "name": "Tirana" },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "ALL" },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "AL",
          "addressRegion": "Tirana"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" }
        }
      }
    }
  };
}

function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": trail.map((step, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": step.name,
      "item": step.url
    }))
  };
}

/* ---------------- home: featured grid ---------------- */
function initHomeGrid() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  renderGrid(el, PRODUCTS.slice(0, 6));
  document.addEventListener("pf:langchange", () => renderGrid(el, PRODUCTS.slice(0, 6)));
}

/* ---------------- shop page: filters + grid ---------------- */
function initShopPage() {
  const grid = document.getElementById("shopGrid");
  const chipRow = document.getElementById("chipRow");
  if (!grid || !chipRow) return;

  const params = new URLSearchParams(location.search);
  let active = params.get("cat") || "all";

  function buildChips() {
    const lang = LangStore.get();
    chipRow.innerHTML = CATEGORIES.map(c =>
      `<button class="chip ${c.key === active ? "active" : ""}" data-cat="${c.key}">${c[lang]}</button>`
    ).join("");
    chipRow.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        active = chip.dataset.cat;
        buildChips();
        renderFiltered();
      });
    });
  }
  /* The whole catalogue, not the active filter: the list describes what the
     shop sells, and a visitor clicking "weddings" does not change that. */
  function publishItemList() {
    const lang = LangStore.get();
    jsonLd("ld-itemlist", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": t("seo.shop.title", lang),
      "numberOfItems": PRODUCTS.length,
      "itemListElement": PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": productSchema(p, lang)
      }))
    });
    jsonLd("ld-breadcrumb", breadcrumbSchema([
      { name: "Amelia Flowers", url: absUrl(langPrefix() + "/") },
      { name: t("nav.shop", lang), url: absUrl(langPrefix() + "/shop.html") }
    ]));
  }
  publishItemList();
  document.addEventListener("pf:langchange", publishItemList);

  function renderFiltered() {
    const list = active === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === active);
    renderGrid(grid, list);
  }
  buildChips();
  renderFiltered();
  document.addEventListener("pf:langchange", () => { buildChips(); renderFiltered(); });
}

/* ---------------- product detail page ---------------- */
function initProductDetail() {
  const root = document.getElementById("pdRoot");
  if (!root) return;
  const p = productFromLocation() || PRODUCTS[0];
  let qty = 1;

  /* Every bouquet now has a real URL. /product.html?id= is kept alive only
     because those links are already sitting in WhatsApp threads and in
     Instagram bios — send them on, replacing the history entry so Back
     still goes where the visitor came from. */
  if (/\/product\.html$/.test(location.pathname)) {
    location.replace(productPath(p, LangStore.get()) + location.hash);
    return;
  }

  function render() {
    const lang = LangStore.get();
    /* The six bouquets share one template, so everything a search engine
       reads off this page — title, description, canonical, structured data
       — has to be rewritten per bouquet, or all six collapse into one
       result for the generic "Bouquet — Amelia Flowers" template. */
    document.title = `${p.name[lang]} — ${t("seo.pd.suffix", lang)}`;
    setMeta('name="description"', p.desc[lang] + " " + t("seo.pd.tail", lang));
    setMeta('property="og:title"', document.title);
    setMeta('property="og:description"', p.desc[lang]);
    setMeta('property="og:image"', absUrl("/" + p.img.replace(/^\//, "")));
    setCanonical(productUrl(p, lang));
    jsonLd("ld-product", productSchema(p, lang));
    jsonLd("ld-breadcrumb", breadcrumbSchema([
      { name: "Amelia Flowers", url: absUrl(langPrefix() + "/") },
      { name: t("nav.shop", lang), url: absUrl(langPrefix() + "/shop.html") },
      { name: p.name[lang], url: productUrl(p, lang) }
    ]));
    /* Root-absolute: on /en/product.html a bare "assets/..." would resolve
       to /en/assets/ and 404 — including the WebP, which is why the English
       and Italian pages were quietly serving the heavier JPEG. */
    const imgAbs = "/" + p.img.replace(/^\//, "");
    root.querySelector("[data-pd-img]").src = imgAbs;
    root.querySelector("[data-pd-img]").alt = p.name[lang];
    const pdSource = root.querySelector("[data-pd-source]");
    if (pdSource) pdSource.srcset = imgAbs.replace(/\.(jpe?g|png)$/i, ".webp");
    /* Both the breadcrumb and the kicker above the title carry this hook —
       querySelector would fill the first and leave the other blank. */
    root.querySelectorAll("[data-pd-cat]").forEach(el => {
      el.textContent = t("footer.shop." + p.cat, lang);
    });
    root.querySelector("[data-pd-name]").textContent = p.name[lang];
    root.querySelector("[data-pd-price]").textContent = formatLek(p.price);
    root.querySelector("[data-pd-desc]").textContent = p.desc[lang];
    root.querySelector("[data-pd-qty]").textContent = qty;
    root.querySelector("[data-pd-add]").dataset.qty = qty;
  }

  root.querySelector("[data-pd-minus]").addEventListener("click", () => { qty = Math.max(1, qty - 1); render(); });
  root.querySelector("[data-pd-plus]").addEventListener("click", () => {
    const max = SHOP.maxQtyPerItem || 25;
    if (qty >= max) { showToast(t("error.maxqty", LangStore.get())); return; }
    qty = qty + 1; render();
  });

  const addBtn = root.querySelector("[data-pd-add]");
  addBtn.dataset.add = p.id;
  wireAddButtons(root);

  document.addEventListener("pf:langchange", render);
  render();

  const relatedEl = document.getElementById("relatedGrid");
  if (relatedEl) {
    const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
    const pool = related.length ? related : PRODUCTS.filter(x => x.id !== p.id).slice(0, 3);
    renderGrid(relatedEl, pool);
    document.addEventListener("pf:langchange", () => renderGrid(relatedEl, pool));
  }
}

/* ---------------- WhatsApp hand-off ----------------
   Builds the order as a pre-filled WhatsApp message to the shop.
   Always written in Albanian: the recipient is the shop, regardless of
   which language the customer browsed in. */
/* ---------------- where the order came from ----------------
   The order is placed in WhatsApp, not on this site, so no analytics tool
   can close the loop: it can say four hundred people read the wedding page,
   and never say that eleven of them bought a bouquet. This can. It records
   the first page of the visit and the site the visitor arrived from, and
   prints both at the foot of the order the shop receives.

   sessionStorage, not localStorage: a new visit is a new source, and the
   answer to "which page earned this order" is the page that started *this*
   visit, not one from a fortnight ago.

   Nothing here is a tracker. It is stored in the visitor's own browser,
   never sent anywhere by this site, and reaches the shop only inside the
   order the customer sends themselves — so there is no third party in it
   and nothing to ask consent for. */
const SOURCE_KEY = "pf_src";

/* google.al, google.co.uk, l.instagram.com, m.facebook.com — the shop wants
   to know the family, not the exact hostname it was redirected through. */
const SOURCE_FAMILIES = ["instagram", "facebook", "google", "tiktok",
                         "youtube", "bing", "pinterest", "whatsapp"];

function referrerName() {
  if (!document.referrer) return "direkt";
  let host;
  try {
    host = new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch (e) {
    return "direkt";
  }
  if (host === location.hostname) return "direkt";
  return SOURCE_FAMILIES.find(name => host.includes(name)) || host;
}

function initOrderSource() {
  /* Only the first page of the visit. Every page after it would report
     this site as the referrer and overwrite the answer with "direkt". */
  try {
    if (sessionStorage.getItem(SOURCE_KEY)) return;
    sessionStorage.setItem(SOURCE_KEY, JSON.stringify({
      landing: location.pathname + location.search,
      ref: referrerName()
    }));
  } catch (e) {
    /* Private mode refuses storage. An order without a source line is
       still an order — never let this stop a sale. */
  }
}

function orderSource() {
  try {
    return JSON.parse(sessionStorage.getItem(SOURCE_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function sourceLine() {
  const src = orderSource();
  return src ? "Erdhi nga: " + src.landing + " · " + src.ref : "";
}

function buildWhatsAppText(data) {
  const L = [];
  L.push("🌹 *POROSI E RE — Amelia Flowers*");
  L.push("Nr: " + data.orderNumber);
  L.push("");
  L.push("*KLIENTI*");
  L.push("Emri: " + data.name);
  L.push("Tel: " + data.phone);
  L.push("Adresa: " + data.address + ", " + data.city);
  if (data.notes) L.push("Shënime: " + data.notes);
  L.push("");
  L.push("*POROSIA*");
  data.items.forEach(i => {
    const p = getProduct(i.id);
    if (p) L.push(`${i.qty} × ${p.name.sq} — ${formatLek(p.price * i.qty)}`);
  });
  L.push("");
  L.push("*TOTALI: " + formatLek(data.total) + "*");
  L.push("Pagesa: Cash në dorëzim");
  const source = sourceLine();
  if (source) {
    L.push("");
    L.push("_" + source + "_");
  }
  return L.join("\n");
}

function buildWhatsAppUrl(data) {
  if (typeof SHOP === "undefined" || !SHOP.whatsapp) return null;
  return "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(buildWhatsAppText(data));
}

/* ---------------- posting the order ----------------
   Fires from this page the moment the form is submitted, so the order is
   recorded whether or not the customer ever presses send in WhatsApp.
   This is the half of the hand-off that does not depend on them.

   Returns a promise for true/false rather than throwing: a failed post
   must not cost the customer their confirmation screen, it just means the
   WhatsApp message becomes the only route and the screen says so. */
function postOrder(data) {
  const url = (typeof SHOP !== "undefined" && SHOP.orderEndpoint || "").trim();
  if (!url) return Promise.resolve(false);

  const body = {
    subject: "Porosi e re — Amelia Flowers — " + data.orderNumber,
    order_number: data.orderNumber,
    name: data.name,
    phone: data.phone,
    address: data.address + ", " + data.city,
    notes: data.notes || "—",
    /* The same text the shop would have read on WhatsApp, so the record
       and the ping say exactly the same thing. */
    order: buildWhatsAppText(data),
    total: formatLek(data.total),
    date: data.date,
    source: sourceLine() || "—"
  };
  if (SHOP.orderEndpointKey) body.access_key = SHOP.orderEndpointKey;

  /* A form service that is slow or down must not hang the confirmation. */
  const timeout = new Promise(resolve => setTimeout(() => resolve(false), 8000));
  const post = fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body)
  }).then(r => r.ok).catch(() => false);

  return Promise.race([post, timeout]);
}

/* The confirmation screen has two truthful states, and which one shows
   depends on whether the order actually reached the shop:

     recorded  — it is on the shop's side; nothing more is needed
     pending   — nothing has arrived yet; pressing send is what places it

   The wording used to claim "Order received — your flowers are on their
   way" in both cases. A customer who then closed the tab believed an
   order existed that never did, which is worse than losing the order. */
function setConfirmState(recorded) {
  const lang = LangStore.get();
  /* [recorded key, pending key] for each slot. The element is found by
     whichever of the two it is currently carrying — searching only for
     the one we are switching *to* finds nothing on the way back. */
  const slots = [
    ["confirm.kicker", "confirm.pending.kicker"],
    ["confirm.title",  "confirm.pending.title"],
    ["confirm.body",   "confirm.pending.body"]
  ];

  slots.forEach(([doneKey, pendingKey]) => {
    const el = document.querySelector(`[data-i18n="${doneKey}"], [data-i18n="${pendingKey}"]`);
    if (!el) return;
    const key = recorded ? doneKey : pendingKey;
    el.setAttribute("data-i18n", key);
    el.textContent = t(key, lang);
  });

  const wrap = document.getElementById("confirmWrap");
  if (wrap) wrap.classList.toggle("is-pending", !recorded);

  /* The big tick reads as "done" from across the room — louder than any
     wording under it. While the order is still pending it becomes an
     arrow, so the icon and the text say the same thing. */
  const icon = document.querySelector(".confirm-check svg path");
  if (icon) {
    icon.setAttribute("d", recorded ? "M20 6 9 17l-5-5" : "M5 12h14M13 6l6 6-6 6");
  }
}

/* ---------------- order rate limiting ----------------
   Browser-side only. Stops double-clicks and casual repeat ordering;
   a determined visitor can clear storage and start again. The real
   protection is confirming by phone before you cut any flowers. */
const OrderRate = {
  KEY: "pf_order_times",
  recent() {
    const mins = (typeof SHOP !== "undefined" && SHOP.orderWindowMinutes) || 15;
    const cutoff = Date.now() - mins * 60000;
    let times = [];
    try { times = JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) {}
    return times.filter(t => t > cutoff);
  },
  blocked() {
    const max = (typeof SHOP !== "undefined" && SHOP.maxOrdersPerWindow) || 3;
    return this.recent().length >= max;
  },
  record() {
    const times = this.recent();
    times.push(Date.now());
    localStorage.setItem(this.KEY, JSON.stringify(times));
  },
  minutesLeft() {
    const mins = (typeof SHOP !== "undefined" && SHOP.orderWindowMinutes) || 15;
    const oldest = this.recent()[0];
    if (!oldest) return 0;
    return Math.max(1, Math.ceil((oldest + mins * 60000 - Date.now()) / 60000));
  }
};

/* ---------------- checkout page ---------------- */
function genOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PF-${stamp}-${rand}`;
}

function renderCheckoutSummary() {
  const wrap = document.getElementById("summaryItems");
  if (!wrap) return;
  const lang = LangStore.get();
  const items = Cart.get();
  wrap.innerHTML = items.map(i => {
    const p = getProduct(i.id);
    if (!p) return "";
    return `<div class="mini-cart-item">
      <div class="thumb thumb-mini">${pictureHTML(p.img, `alt="${p.name[lang]}"`)}</div>
      <div>
        <div class="name">${p.name[lang]}</div>
        <div class="meta">${t("pd.qty", lang)}: ${i.qty} · ${formatLek(p.price * i.qty)}</div>
      </div>
    </div>`;
  }).join("");
  initImageFallbacks(wrap);
  const sub = Cart.subtotal();
  document.getElementById("sumSubtotal").textContent = formatLek(sub);
  document.getElementById("sumTotal").textContent = formatLek(sub);
}

/* The phone number is the one field an order cannot do without: confirming
   by phone before cutting any flowers is the shop's real protection against
   a fake order. So it is checked on the digits it actually contains, not on
   its length — the older pattern allowed "((((((" and "++++++" through,
   which is exactly the unreachable number you most want to catch.

   Albanian mobiles are 9 digits nationally (06X XXX XXXX) or 11 with the
   355 country code; the range below stays wide enough for a landline or a
   number typed with a leading 00. */
function validatePhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return false;
  /* Reject a run of one repeated digit — 000000000, 111111111 and the like
     are placeholders, never real numbers. */
  if (/^(\d)\1+$/.test(digits)) return false;
  return true;
}

function validateField(field) {
  const input = field.querySelector(".input");
  const value = input.value.trim();
  let ok = value.length > 0;
  if (ok && input.type === "tel") ok = validatePhone(value);
  field.classList.toggle("invalid", !ok);
  return ok;
}

function initCheckoutPage() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const hasItems = Cart.count() > 0;
  const emptyState = document.getElementById("checkoutEmpty");
  const mainState = document.getElementById("checkoutMain");
  if (!hasItems) {
    emptyState?.classList.remove("va-none");
    mainState?.classList.add("va-none");
    return;
  }

  renderCheckoutSummary();
  document.addEventListener("pf:langchange", renderCheckoutSummary);
  document.addEventListener("pf:cartchange", () => {
    /* Placing the order empties the cart, which would otherwise trip the
       empty-cart notice into view directly above the thank-you panel. */
    if (document.getElementById("confirmWrap")?.classList.contains("show")) return;
    if (Cart.count() === 0) { emptyState?.classList.remove("va-none"); mainState?.classList.add("va-none"); }
    else renderCheckoutSummary();
  });

  let submitting = false;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    /* Guard the double-click / double-tap, which would otherwise send
       the same order twice with two different order numbers. */
    if (submitting) return;

    /* Honeypot: invisible to people, irresistible to naive bots.
       Pretend it worked rather than explaining what gave them away. */
    if (form.website && form.website.value) {
      document.getElementById("confirmWrap").classList.add("show");
      form.classList.add("va-none");
      document.querySelector(".checkout-grid").classList.add("va-none");
      return;
    }

    const fields = form.querySelectorAll(".field[data-required]");
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) {
      form.querySelector(".invalid .input")?.focus();
      return;
    }

    if (OrderRate.blocked()) {
      showToast(t("error.ratelimit", LangStore.get()).replace("{n}", OrderRate.minutesLeft()));
      return;
    }

    submitting = true;
    const submitBtn = form.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;
    OrderRate.record();

    const data = {
      name: form.fullname.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      notes: form.notes.value.trim(),
      items: Cart.get(),
      total: Cart.subtotal(),
      orderNumber: genOrderNumber(),
      date: new Date().toISOString()
    };

    try {
      const orders = JSON.parse(localStorage.getItem("pf_orders") || "[]");
      orders.push(data);
      localStorage.setItem("pf_orders", JSON.stringify(orders));
    } catch (e) {}

    document.getElementById("orderNumber").textContent = data.orderNumber;
    document.getElementById("orderDeliverTo").textContent = `${data.name} — ${data.address}, ${data.city}`;

    /* Open WhatsApp while we are still inside the click gesture — popup
       blockers reject window.open once the gesture has been handed back. */
    const waUrl = buildWhatsAppUrl(data);
    let waOpened = false;
    if (waUrl && SHOP.autoOpenWhatsApp) {
      const win = window.open(waUrl, "_blank");
      waOpened = !!win;
    }

    /* Assume the worst until the post says otherwise: if the endpoint is
       not configured, or is slow, or fails, the honest state is "not
       placed yet". Upgrading later is safe; starting optimistic is not. */
    setConfirmState(false);

    const waBtn = document.getElementById("waSendBtn");
    const waNote = document.getElementById("waNote");
    const showWa = (recorded) => {
      if (!waBtn) return;
      if (!waUrl) {
        waBtn.classList.add("va-none");
        if (waNote) waNote.textContent = "";
        return;
      }
      waBtn.href = waUrl;
      waBtn.classList.remove("va-none");
      if (!waNote) return;
      /* Three different things to say, and the difference matters:
         recorded  — WhatsApp is optional, the order is already in
         opened    — the message is waiting in their WhatsApp, unsent
         blocked   — the popup never opened, this button is the only way */
      waNote.textContent = t(
        recorded ? "confirm.wa.optional" : (waOpened ? "confirm.wa.sent" : "confirm.wa.blocked"),
        LangStore.get()
      );
    };
    showWa(false);

    /* Post after opening WhatsApp, never before: window.open has to run
       inside the click gesture or the popup blocker eats it, and an
       awaited fetch would hand the gesture back first. */
    postOrder(data).then(recorded => {
      setConfirmState(recorded);
      showWa(recorded);
    });

    /* Show the confirmation before emptying the cart: Cart.clear() fires
       pf:cartchange synchronously, and the handler above bows out only once
       this panel is on screen. */
    document.getElementById("checkoutForm").classList.add("va-none");
    document.querySelector(".checkout-grid").classList.add("va-none");
    document.getElementById("confirmWrap").classList.add("show");
    Cart.clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  form.querySelectorAll(".field[data-required] .input").forEach(input => {
    input.addEventListener("blur", () => validateField(input.closest(".field")));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) validateField(input.closest(".field"));
    });
  });
}

/* ---------------- marquee duplication (seamless loop) ---------------- */
function initMarquee() {
  document.querySelectorAll(".marquee-track").forEach(track => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initOrderSource();
  initPreloader();
  initImageFallbacks();
  initShopDetails();
  initHeader();
  initHero();
  initMarquee();
  initHomeGrid();
  initShopPage();
  initProductDetail();
  initCheckoutPage();
  initReveal();
});
