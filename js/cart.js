/* Amelia Flowers — cart state (localStorage) + drawer rendering */
const Cart = {
  KEY: "pf_cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch (e) { return []; }
  },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("pf:cartchange"));
  },
  /* Ceiling on any single line. Also guards against a corrupted or
     hand-edited localStorage value arriving as NaN or a huge number. */
  cap(n) {
    const max = (typeof SHOP !== "undefined" && SHOP.maxQtyPerItem) || 25;
    n = Math.floor(Number(n));
    if (!isFinite(n) || n < 1) return 1;
    return Math.min(n, max);
  },
  atCap(id) {
    const row = this.get().find(i => i.id === id);
    const max = (typeof SHOP !== "undefined" && SHOP.maxQtyPerItem) || 25;
    return !!row && row.qty >= max;
  },
  add(id, qty = 1) {
    const items = this.get();
    const row = items.find(i => i.id === id);
    if (row) row.qty = this.cap(row.qty + qty); else items.push({ id, qty: this.cap(qty) });
    this.save(items);
  },
  setQty(id, qty) {
    let items = this.get();
    if (qty <= 0) items = items.filter(i => i.id !== id);
    else { const row = items.find(i => i.id === id); if (row) row.qty = this.cap(qty); }
    this.save(items);
  },
  remove(id) {
    this.save(this.get().filter(i => i.id !== id));
  },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  subtotal() {
    return this.get().reduce((s, i) => {
      const p = getProduct(i.id);
      return p ? s + p.price * i.qty : s;
    }, 0);
  }
};

function renderCartBadge() {
  const n = Cart.count();
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "grid" : "none";
  });
}

function cartRowTemplate(item, lang) {
  const p = getProduct(item.id);
  if (!p) return "";
  return `
  <div class="cart-row" data-id="${p.id}">
    <div class="thumb thumb-cart">${pictureHTML(p.img, `alt="${p.name[lang]}"`)}</div>
    <div class="cart-row-body">
      <div class="cart-row-top">
        <span class="cart-row-name">${p.name[lang]}</span>
        <span class="p-price">${formatLek(p.price * item.qty)}</span>
      </div>
      <div class="cart-row-top" style="align-items:center">
        <div class="qty-stepper" data-id="${p.id}">
          <button type="button" data-step="-1" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button type="button" data-step="1" aria-label="Increase">+</button>
        </div>
        <button type="button" class="cart-remove" data-remove="${p.id}">${t("cart.item.remove", lang)}</button>
      </div>
    </div>
  </div>`;
}

function renderCartDrawer() {
  const lang = LangStore.get();
  const items = Cart.get();
  const wrap = document.getElementById("cartItems");
  const foot = document.getElementById("cartFoot");
  if (!wrap) return;

  if (items.length === 0) {
    wrap.innerHTML = `<div class="cart-empty">
      <p>${t("cart.empty", lang)}</p>
      <a class="btn btn-outline" href="shop.html" style="margin-top:16px"><span>${t("cart.empty.cta", lang)}</span></a>
    </div>`;
    if (foot) foot.style.display = "none";
    return;
  }
  if (foot) foot.style.display = "block";
  wrap.innerHTML = items.map(i => cartRowTemplate(i, lang)).join("");
  if (typeof initImageFallbacks === "function") initImageFallbacks(wrap);
  const sub = document.getElementById("cartSubtotal");
  if (sub) sub.textContent = formatLek(Cart.subtotal());

  wrap.querySelectorAll("[data-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".qty-stepper").dataset.id;
      const cur = Cart.get().find(i => i.id === id);
      const delta = parseInt(btn.dataset.step, 10);
      Cart.setQty(id, (cur ? cur.qty : 0) + delta);
    });
  });
  wrap.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => Cart.remove(btn.dataset.remove));
  });
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
  document.documentElement.classList.add("no-scroll");
}
function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
  document.documentElement.classList.remove("no-scroll");
}

function showToast(msg) {
  let toast = document.getElementById("pfToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "pfToast";
    toast.className = "toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector("span").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function initCartUI() {
  renderCartBadge();
  renderCartDrawer();

  document.querySelectorAll("[data-cart-open]").forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); openCart(); }));
  document.querySelectorAll("[data-cart-close]").forEach(el => el.addEventListener("click", closeCart));
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);

  document.addEventListener("pf:cartchange", () => { renderCartBadge(); renderCartDrawer(); });
  document.addEventListener("pf:langchange", () => renderCartDrawer());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
}

document.addEventListener("DOMContentLoaded", initCartUI);
