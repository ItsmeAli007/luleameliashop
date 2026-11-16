/* Amelia Flowers — build your own bouquet.

   The customer picks stems one at a time from STEMS (js/products.js) and a
   drawing of the bouquet grows as they go: each new flower blooms into its
   place, the paper wrap widens to hold the bunch, and the whole thing zooms
   out a little as it gets big so it always fits the stage.

   Layout is a sunflower spiral (golden angle): stem n sits at radius
   K·√n, so the bunch stays round and evenly packed at any size, and the
   first flowers picked stay in the middle. Positions move with CSS
   transitions on transform, which animate in every browser — the paths
   themselves are drawn once and never morph.

   The finished bouquet goes into the cart as one line, see CUSTOM_BOUQUET. */
(function () {
  const root = document.getElementById("bouquetBuilder");
  if (!root || typeof STEMS === "undefined") return;

  const NS = "http://www.w3.org/2000/svg";
  const SPREAD = 13;          // K in r = K·√n
  const HEAD = 22;            // a rose's radius; everything is sized off it
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- colour ---------------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const mix = (c) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  /* ---------------- the flowers ----------------
     Each is drawn around (0,0), seen from the front of the bouquet. */
  function rose(c) {
    const edge = shade(c, -0.28), lit = shade(c, 0.16);
    const line = c === "#f3ede6" ? "rgba(120,96,80,.38)" : "rgba(30,0,8,.34)";
    let out = "";
    for (let i = 0; i < 5; i++) out += `<ellipse cx="0" cy="-12.5" rx="12.5" ry="11" transform="rotate(${i * 72 + 18})" fill="${edge}"/>`;
    out += `<circle r="16.5" fill="${c}"/>`;
    out += `<circle cx="-2" cy="-2" r="11" fill="${lit}" opacity=".55"/>`;
    out += `<g fill="none" stroke="${line}" stroke-width="1.5" stroke-linecap="round">
      <path d="M-14 4C-15-9-4-16 7-13"/><path d="M14-4C15 9 4 16-7 13"/>
      <path d="M-8-1C-7-9 3-10 8-5"/><path d="M8 2C7 8-2 10-7 5"/>
      <path d="M-2-4C2-6 5-2 2 1-1 3-4 0-2-2"/></g>`;
    return out;
  }

  function mum(c) {
    const deep = shade(c, -0.22), pale = shade(c, 0.28);
    let out = "";
    for (let i = 0; i < 20; i++) out += `<ellipse cx="0" cy="-13" rx="3.4" ry="10" transform="rotate(${i * 18})" fill="${deep}"/>`;
    for (let i = 0; i < 16; i++) out += `<ellipse cx="0" cy="-8.5" rx="3" ry="8" transform="rotate(${i * 22.5 + 11})" fill="${c}"/>`;
    for (let i = 0; i < 10; i++) out += `<ellipse cx="0" cy="-4.5" rx="2.4" ry="5" transform="rotate(${i * 36 + 6})" fill="${pale}"/>`;
    out += `<circle r="3.2" fill="${shade(c, -0.4)}"/>`;
    return out;
  }

  function tulip(c) {
    const deep = shade(c, -0.25), pale = shade(c, 0.22);
    return `<path d="M-13 0C-15-14-9-25-6-24L0-13 6-24C9-25 15-14 13 0 11 12-11 12-13 0Z" fill="${deep}"/>
      <path d="M-7 1C-8-14 0-27 0-27S8-14 7 1C5 9-5 9-7 1Z" fill="${c}"/>
      <path d="M-3-4C-3-14 0-21 0-21" stroke="${pale}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }

  function sunflower(c) {
    const deep = shade(c, -0.18);
    let out = "";
    for (let i = 0; i < 18; i++) out += `<ellipse cx="0" cy="-19" rx="5.2" ry="11.5" transform="rotate(${i * 20 + 10})" fill="${deep}"/>`;
    for (let i = 0; i < 18; i++) out += `<ellipse cx="0" cy="-17" rx="4.6" ry="10" transform="rotate(${i * 20})" fill="${c}"/>`;
    out += `<circle r="12" fill="#4a2a10"/><circle r="8.5" fill="#6b3f17"/>`;
    for (let i = 0; i < 14; i++) {
      const a = i * GOLDEN, r = 2.6 * Math.sqrt(i + 0.6);
      out += `<circle cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" r="1" fill="#2c1606"/>`;
    }
    return out;
  }

  const DRAW = { rose, mum, tulip, sunflower };
  /* A sunflower is a bigger flower than a rose; a tulip sits a little proud. */
  const SIZE = { rose: 1, mum: 1, tulip: 1, sunflower: 1.22 };
  const LIFT = { rose: 0, mum: 0, tulip: -6, sunflower: 0 };

  function flowerMarkup(stem) {
    return DRAW[stem.shape](stem.color);
  }

  const LEAF = `<path d="M0 0C7-8 7-21 0-30-7-21-7-8 0 0Z" fill="#5d7a55"/><path d="M0-2V-27" stroke="#46613f" stroke-width="1"/>`;

  /* ---------------- the wrap ----------------
     Drawn once for a bunch of radius 100, then scaled to whatever radius the
     bunch has. Back paper sits behind the flowers, the front folds and the
     ribbon in front of them. */
  const WRAP_BACK = `
    <path d="M-32 186L-150-58C-118-90-82-70-60-96-34-70 0-98 0-98S34-70 60-96C82-70 118-90 150-58L32 186Z" fill="#d9c3a5"/>
    <path d="M-32 186L-150-58C-138-66-124-68-112-64L-12 186Z" fill="#cbb391"/>`;
  const WRAP_FRONT = `
    <g stroke="#5d7a55" stroke-width="5" stroke-linecap="round">
      <path d="M-10 184L-16 264"/><path d="M-3 184L-6 268"/><path d="M4 184L5 270"/>
      <path d="M11 184L16 264"/><path d="M-14 184L-26 256"/><path d="M15 184L27 256"/></g>
    <path d="M-120 30L-28 190 28 190 120 30C88 52 40 60 0 58-40 60-88 52-120 30Z" fill="#e8d6bd"/>
    <path d="M-120 30C-88 52-40 60 0 58L28 190-28 190Z" fill="#f1e3cf"/>
    <path d="M-120 30C-88 52-40 60 0 58" fill="none" stroke="#c9b08c" stroke-width="2"/>
    <path d="M0 58L28 190" stroke="#d6c0a0" stroke-width="2" fill="none"/>
    <g transform="translate(0 172)">
      <path d="M-2 0C-30-24-56-14-50 2-44 16-14 10-2 0Z" fill="#830b25"/>
      <path d="M2 0C30-24 56-14 50 2 44 16 14 10 2 0Z" fill="#830b25"/>
      <path d="M-4 2C-16 20-24 44-30 56L-18 52C-12 36-6 20 0 6Z" fill="#6c091f"/>
      <path d="M4 2C16 20 24 44 30 56L18 52C12 36 6 20 0 6Z" fill="#6c091f"/>
      <circle r="8" fill="#a9163a"/>
      <path d="M-34-6C-40-2-40 4-36 6" stroke="#a9163a" stroke-width="2" fill="none"/>
    </g>`;

  /* ---------------- state ---------------- */
  let order = [];             // [{uid, type}], in the order they were picked
  let uid = 0;

  function mix() {
    const m = {};
    order.forEach(s => { m[s.type] = (m[s.type] || 0) + 1; });
    return m;
  }

  /* ---------------- stage ---------------- */
  const stage = root.querySelector("[data-bb-stage]");
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "-200 -230 400 500");
  svg.setAttribute("role", "img");
  svg.innerHTML = `
    <defs><radialGradient id="bbGlow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="0" cy="250" rx="120" ry="14" fill="rgba(48,7,19,.12)" class="bb-shadow"/>
    <g class="bb-fit"><g class="bb-bump">
      <g class="bb-wrap-back">${WRAP_BACK}</g>
      <g class="bb-leaves"></g>
      <g class="bb-heads"></g>
      <g class="bb-wrap-front">${WRAP_FRONT}</g>
    </g></g>`;
  stage.appendChild(svg);
  const gFit = svg.querySelector(".bb-fit");
  const gBump = svg.querySelector(".bb-bump");
  const gBack = svg.querySelector(".bb-wrap-back");
  const gFront = svg.querySelector(".bb-wrap-front");
  const gLeaves = svg.querySelector(".bb-leaves");
  const gHeads = svg.querySelector(".bb-heads");
  const shadow = svg.querySelector(".bb-shadow");
  const nodes = new Map();    // uid -> {head, leaf}

  function setT(el, x, y, s, r) {
    el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)` +
      (r ? ` rotate(${r.toFixed(1)}deg)` : "") + (s !== 1 ? ` scale(${s.toFixed(3)})` : "");
  }

  function layout() {
    const n = order.length;
    const R = SPREAD * Math.sqrt(Math.max(n, 1)) + HEAD;   // radius of the bunch
    const w = R / 100;                                      // the wrap is drawn for R = 100
    /* The wrap's mouth sits a little below the middle of the bunch. Measured in
       radii, the drawing runs from the back paper's peak (-1.22) to the
       stem ends (about +2.5) and is 3 wide. */
    const wrapY = R * 0.42 - 58 * w;
    const top = -1.22 * R, bottom = wrapY + 270 * w;
    const fit = Math.min(1.5, 470 / (bottom - top), 380 / (3.1 * R));
    /* Centre it in the 500-unit-tall viewBox, which runs from -230 to 270. */
    const offsetY = 20 - ((top + bottom) / 2) * fit;
    setT(gFit, 0, offsetY, fit);
    setT(gBack, 0, wrapY, w);
    setT(gFront, 0, wrapY, w);
    shadow.setAttribute("cy", (bottom * fit + offsetY).toFixed(1));
    shadow.setAttribute("rx", (R * 0.9 * fit).toFixed(1));

    order.forEach((s, i) => {
      const node = nodes.get(s.uid);
      const stem = STEMS.find(x => x.id === s.type);
      const a = i * GOLDEN - Math.PI / 2;
      const r = SPREAD * Math.sqrt(i + 0.5);
      const x = r * Math.cos(a);
      const y = r * Math.sin(a) * 0.8 + LIFT[stem.shape];
      setT(node.head, x, y, SIZE[stem.shape]);
      const ang = Math.atan2(y, x) * 180 / Math.PI + 90;
      setT(node.leaf, x * 1.12 + Math.cos(a) * 14, y * 1.12 + Math.sin(a) * 12, 1, ang);
    });

    /* Paint order: the flowers lower in the bunch are nearer the viewer. */
    [...order].map((s, i) => ({ s, i }))
      .sort((p, q) => Math.sin(p.i * GOLDEN - Math.PI / 2) * Math.sqrt(p.i + 0.5) -
                      Math.sin(q.i * GOLDEN - Math.PI / 2) * Math.sqrt(q.i + 0.5))
      .forEach(({ s }) => gHeads.appendChild(nodes.get(s.uid).head));
  }

  function bump() {
    if (reduceMotion) return;
    gBump.classList.remove("is-bump"); void gBump.getBoundingClientRect(); gBump.classList.add("is-bump");
  }

  function addStem(type) {
    if (order.length >= BOUQUET_MAX_STEMS) { flash(t("builder.max")); return; }
    const stem = STEMS.find(x => x.id === type);
    const id = ++uid;
    const head = document.createElementNS(NS, "g");
    head.setAttribute("class", "bb-head");
    head.innerHTML = `<g class="bb-bloom">${flowerMarkup(stem)}</g>`;
    const leaf = document.createElementNS(NS, "g");
    leaf.setAttribute("class", "bb-leaf");
    leaf.innerHTML = `<g class="bb-bloom">${LEAF}</g>`;
    /* Start at the centre so the new flower travels out to its spot. */
    setT(head, 0, 0, 0.3);
    setT(leaf, 0, 0, 0.3);
    gHeads.appendChild(head);
    gLeaves.appendChild(leaf);
    nodes.set(id, { head, leaf });
    order.push({ uid: id, type });
    void head.getBoundingClientRect();
    layout();
    bump();
    update();
  }

  function removeStem(type) {
    let idx = -1;
    for (let i = order.length - 1; i >= 0; i--) if (order[i].type === type) { idx = i; break; }
    if (idx < 0) return;
    const [s] = order.splice(idx, 1);
    const node = nodes.get(s.uid);
    nodes.delete(s.uid);
    node.head.classList.add("is-leaving");
    node.leaf.classList.add("is-leaving");
    setTimeout(() => { node.head.remove(); node.leaf.remove(); }, reduceMotion ? 0 : 320);
    layout();
    update();
  }

  function clearAll() {
    order.slice().reverse().forEach(s => removeStem(s.type));
  }

  /* ---------------- controls ---------------- */
  const list = root.querySelector("[data-bb-list]");
  const countEl = root.querySelector("[data-bb-count]");
  const totalEl = root.querySelector("[data-bb-total]");
  const addBtn = root.querySelector("[data-bb-add]");
  const resetBtn = root.querySelector("[data-bb-reset]");
  const emptyEl = root.querySelector("[data-bb-empty]");
  const msgEl = root.querySelector("[data-bb-msg]");

  function priceEach(stem, lang) {
    return t("builder.each", lang).replace("{p}", formatLek(stem.price));
  }

  function renderList() {
    const lang = LangStore.get();
    list.innerHTML = STEMS.map(stem => `
      <li class="bb-row" data-stem="${stem.id}">
        <span class="bb-swatch" aria-hidden="true"><svg viewBox="-32 -32 64 64">${flowerMarkup(stem)}</svg></span>
        <span class="bb-info"><b>${stem.name[lang][0]}</b><em>${priceEach(stem, lang)}</em></span>
        <span class="qty-stepper bb-stepper">
          <button type="button" data-bb-step="-1" aria-label="${t("builder.less", lang)} — ${stem.name[lang][0]}">−</button>
          <span data-bb-n aria-live="polite">0</span>
          <button type="button" data-bb-step="1" aria-label="${t("builder.more", lang)} — ${stem.name[lang][0]}">+</button>
        </span>
      </li>`).join("");
    update();
  }

  function update() {
    const lang = LangStore.get();
    const m = mix();
    const n = order.length;
    list.querySelectorAll(".bb-row").forEach(row => {
      const c = m[row.dataset.stem] || 0;
      row.querySelector("[data-bb-n]").textContent = c;
      row.classList.toggle("is-picked", c > 0);
      row.querySelector('[data-bb-step="-1"]').disabled = c === 0;
      row.querySelector('[data-bb-step="1"]').disabled = n >= BOUQUET_MAX_STEMS;
    });
    countEl.textContent = n === 1 ? t("builder.count1", lang) : t("builder.count", lang).replace("{n}", n);
    totalEl.textContent = formatLek(mixPrice(m));
    addBtn.disabled = n === 0;
    resetBtn.hidden = n === 0;
    emptyEl.classList.toggle("is-hidden", n > 0);
    svg.setAttribute("aria-label", n ? t("builder.title", lang) + ": " + mixLabel(m, lang) : t("builder.empty", lang));
    if (n < BOUQUET_MAX_STEMS) msgEl.textContent = "";
    else msgEl.textContent = t("builder.max", lang);
  }

  function flash(text) {
    msgEl.textContent = text;
  }

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bb-step]");
    if (!btn || btn.disabled) return;
    const type = btn.closest(".bb-row").dataset.stem;
    if (btn.dataset.bbStep === "1") addStem(type); else removeStem(type);
  });

  resetBtn.addEventListener("click", clearAll);

  addBtn.addEventListener("click", () => {
    const m = mix();
    if (!order.length) return;
    const key = mixKey(m);
    const lang = LangStore.get();
    if (Cart.atCap(CUSTOM_BOUQUET.id, key)) { showToast(t("error.maxqty", lang)); return; }
    Cart.add(CUSTOM_BOUQUET.id, 1, key);
    showToast(`${t("pd.added", lang)} — ${CUSTOM_BOUQUET.name[lang]}`);
    clearAll();
    if (typeof openCart === "function") setTimeout(openCart, 350);
  });

  document.addEventListener("pf:langchange", renderList);
  renderList();
  layout();
})();
