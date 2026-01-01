const products = [
  { id: 1, name: "Premium Wireless Headphones", price: 299, category: "electronics", rating: 4.8, image: "🎧", tag: "Bestseller", stock: 12 },
  { id: 2, name: "Designer Leather Bag", price: 449, category: "fashion", rating: 4.9, image: "👜", tag: "New", stock: 7 },
  { id: 3, name: "Smart Fitness Watch", price: 199, category: "electronics", rating: 4.7, image: "⌚", tag: "Hot", stock: 18 },
  { id: 4, name: "Minimalist Sneakers", price: 129, category: "fashion", rating: 4.6, image: "👟", tag: "Sale", stock: 22 },
  { id: 5, name: "Portable Bluetooth Speaker", price: 89, category: "electronics", rating: 4.5, image: "🔊", tag: "Hot", stock: 30 },
  { id: 6, name: "Classic Sunglasses", price: 179, category: "fashion", rating: 4.8, image: "🕶️", tag: "New", stock: 15 },
  { id: 7, name: "Aroma Candle Set", price: 59, category: "lifestyle", rating: 4.6, image: "🕯️", tag: "New", stock: 40 },
  { id: 8, name: "Minimal Desk Lamp", price: 119, category: "lifestyle", rating: 4.7, image: "💡", tag: "Hot", stock: 16 },
  { id: 9, name: "Noise Cancelling Earbuds", price: 159, category: "electronics", rating: 4.6, image: "🎶", tag: "Sale", stock: 25 },
  { id: 10, name: "Everyday Hoodie", price: 99, category: "fashion", rating: 4.5, image: "🧥", tag: "Bestseller", stock: 33 },
];

const LS = {
  cart: "yu_cart_v1",
  wish: "yu_wish_v1",
  coupon: "yu_coupon_v1",
};

let state = {
  category: "all",
  search: "",
  sort: "featured",
  coupon: "",
  discount: 0,
  cart: loadJSON(LS.cart, []),
  wish: loadJSON(LS.wish, []),
};

const productsGrid = document.getElementById("productsGrid");
const resultsText = document.getElementById("resultsText");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

const cartBtn = document.getElementById("cartBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const cartCount = document.getElementById("cartCount");
const wishCount = document.getElementById("wishCount");

const overlay = document.getElementById("overlay");
const cartDrawer = document.getElementById("cartDrawer");
const wishlistDrawer = document.getElementById("wishlistDrawer");

const cartBody = document.getElementById("cartBody");
const wishlistBody = document.getElementById("wishlistBody");

const closeCartBtn = document.getElementById("closeCart");
const closeWishlistBtn = document.getElementById("closeWishlist");

const couponInput = document.getElementById("couponInput");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const subtotalText = document.getElementById("subtotalText");
const discountText = document.getElementById("discountText");
const totalText = document.getElementById("totalText");
const checkoutBtn = document.getElementById("checkoutBtn");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");
const wishlistClearBtn = document.getElementById("wishlistClearBtn");

const productModal = document.getElementById("productModal");
const productModalBody = document.getElementById("productModalBody");
const closeProductModal = document.getElementById("closeProductModal");

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutModal = document.getElementById("closeCheckoutModal");
const checkoutSummary = document.getElementById("checkoutSummary");
const coSubtotal = document.getElementById("coSubtotal");
const coDiscount = document.getElementById("coDiscount");
const coTotal = document.getElementById("coTotal");
const checkoutForm = document.getElementById("checkoutForm");

const toasts = document.getElementById("toasts");

const startShoppingBtn = document.getElementById("startShoppingBtn");
const viewCollectionBtn = document.getElementById("viewCollectionBtn");

const contactForm = document.getElementById("contactForm");
const fillDemoMsgBtn = document.getElementById("fillDemoMsgBtn");

const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

bindEvents();
renderAll();
updateBadges();

function bindEvents() {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.category = btn.dataset.cat;
      renderProducts();
      scrollToShopIfNeeded();
    });
  });

  let t = null;
  searchInput?.addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.search = (e.target.value || "").trim().toLowerCase();
      renderProducts();
    }, 120);
  });

  sortSelect?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  resetFiltersBtn?.addEventListener("click", () => {
    state.category = "all";
    state.search = "";
    state.sort = "featured";
    searchInput.value = "";
    sortSelect.value = "featured";
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('.category-btn[data-cat="all"]').classList.add("active");
    renderProducts();
  });

  cartBtn?.addEventListener("click", () => openDrawer("cart"));
  wishlistBtn?.addEventListener("click", () => openDrawer("wish"));
  closeCartBtn?.addEventListener("click", closeOverlays);
  closeWishlistBtn?.addEventListener("click", closeOverlays);
  overlay?.addEventListener("click", closeOverlays);

  continueShoppingBtn?.addEventListener("click", () => {
    closeOverlays();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  applyCouponBtn?.addEventListener("click", () => {
    const code = (couponInput?.value || "").trim().toUpperCase();
    state.coupon = code;
    applyCouponFromState();

    if (!code) {
      toast("Coupon cleared", "");
    } else if (code === "YU10") {
      toast("Coupon applied", "YU10 (10% off)");
    } else if (code === "FREESHIP") {
      toast("Coupon applied", "FREESHIP ($15 off)");
    } else {
      toast("Invalid coupon", "Try: YU10 or FREESHIP");
    }

    renderCart();
    if (checkoutModal?.style?.display === "flex") openCheckout();
  });

  checkoutBtn?.addEventListener("click", () => {
    if (state.cart.length === 0) {
      toast("Cart is empty", "Add items before checkout.");
      return;
    }
    openCheckout();
  });

  closeCheckoutModal?.addEventListener("click", () => {
    checkoutModal.style.display = "none";
    overlay.style.display = "none";
    checkoutModal.setAttribute("aria-hidden", "true");
  });

  checkoutForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Order placed 🎉", "This is a UI demo (no real payment).");
    state.cart = [];
    state.coupon = "";
    state.discount = 0;
    saveJSON(LS.cart, state.cart);
    updateBadges();
    renderCart();
    checkoutModal.style.display = "none";
    closeOverlays();
  });

  closeProductModal?.addEventListener("click", closeProductQuickView);

  startShoppingBtn?.addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
  viewCollectionBtn?.addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });

  wishlistClearBtn?.addEventListener("click", () => {
    state.wish = [];
    saveJSON(LS.wish, state.wish);
    updateBadges();
    renderWishlist();
    toast("Wishlist cleared", "Your wishlist is now empty.");
  });

  fillDemoMsgBtn?.addEventListener("click", () => {
    document.getElementById("cName").value = "Ezgi";
    document.getElementById("cEmail").value = "ezgi@example.com";
    document.getElementById("cMessage").value = "Hi YU team! This is a frontend demo message 🙂";
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Message sent ✅", "We’ll get back to you soon (demo).");
    contactForm.reset();
  });

  burgerBtn?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", String(!open));
  });

  document.querySelectorAll(".mobile-link").forEach(a => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderAll() {
  renderProducts();
  renderCart();
  renderWishlist();
}

function renderProducts() {
  const list = getFilteredSortedProducts();
  const total = products.length;
  const shown = list.length;

  resultsText.textContent =
    state.search || state.category !== "all"
      ? `Showing ${shown} of ${total} products`
      : `Showing all products`;

  if (shown === 0) {
    productsGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  productsGrid.innerHTML = list.map(p => productCardHTML(p)).join("");

  list.forEach((p) => {
    const addBtn = document.getElementById(`add_${p.id}`);
    const wishBtn = document.getElementById(`wish_${p.id}`);
    const card = document.getElementById(`card_${p.id}`);

    addBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p.id, 1);
    });

    wishBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWish(p.id);
    });

    card?.addEventListener("click", () => openProductQuickView(p.id));
  });
}

function renderCart() {
  const items = state.cart.map(ci => ({
    ...ci,
    product: products.find(p => p.id === ci.id),
  })).filter(x => x.product);

  if (items.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">🛒</div>
        <h4>Your cart is empty</h4>
        <p class="muted">Add something you love.</p>
      </div>
    `;
  } else {
    cartBody.innerHTML = items.map(({ id, qty, product }) => cartItemHTML(product, qty)).join("");
    items.forEach(({ id }) => {
      document.getElementById(`dec_${id}`)?.addEventListener("click", () => changeQty(id, -1));
      document.getElementById(`inc_${id}`)?.addEventListener("click", () => changeQty(id, +1));
      document.getElementById(`rem_${id}`)?.addEventListener("click", () => removeFromCart(id));
    });
  }

  const subtotal = calcSubtotal();
  const discount = calcDiscount(subtotal);
  const total = Math.max(0, subtotal - discount);

  subtotalText.textContent = `$${money(subtotal)}`;
  discountText.textContent = `-$${money(discount)}`;
  totalText.textContent = `$${money(total)}`;

  if (couponInput) couponInput.value = state.coupon || "";
}

function renderWishlist() {
  const list = state.wish.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (list.length === 0) {
    wishlistBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">💖</div>
        <h4>Wishlist is empty</h4>
        <p class="muted">Tap the heart on products to save them.</p>
      </div>
    `;
  } else {
    wishlistBody.innerHTML = list.map(p => wishItemHTML(p)).join("");
    list.forEach((p) => {
      document.getElementById(`wish_add_${p.id}`)?.addEventListener("click", () => addToCart(p.id, 1));
      document.getElementById(`wish_remove_${p.id}`)?.addEventListener("click", () => toggleWish(p.id));
      document.getElementById(`wish_open_${p.id}`)?.addEventListener("click", () => openProductQuickView(p.id));
    });
  }
}

function getFilteredSortedProducts() {
  let list = [...products];

  if (state.category !== "all") {
    list = list.filter(p => p.category === state.category);
  }

  if (state.search) {
    list = list.filter(p => p.name.toLowerCase().includes(state.search));
  }

  switch (state.sort) {
    case "price_asc": list.sort((a,b) => a.price - b.price); break;
    case "price_desc": list.sort((a,b) => b.price - a.price); break;
    case "rating_desc": list.sort((a,b) => b.rating - a.rating); break;
    case "name_asc": list.sort((a,b) => a.name.localeCompare(b.name)); break;
    default:
      list.sort((a,b) => scoreFeatured(b) - scoreFeatured(a));
      break;
  }
  return list;
}

function scoreFeatured(p){
  const tagScore = { "Bestseller": 30, "New": 25, "Hot": 20, "Sale": 15 };
  return (tagScore[p.tag] || 0) + p.rating;
}

function addToCart(id, qty) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const row = state.cart.find(x => x.id === id);
  if (row) row.qty += qty;
  else state.cart.push({ id, qty });

  const cur = state.cart.find(x => x.id === id);
  cur.qty = Math.max(1, Math.min(cur.qty, p.stock));

  saveJSON(LS.cart, state.cart);
  updateBadges();
  renderCart();
  toast("Added to cart", p.name);
}

function changeQty(id, diff) {
  const p = products.find(x => x.id === id);
  const row = state.cart.find(x => x.id === id);
  if (!row || !p) return;

  row.qty += diff;
  if (row.qty <= 0) {
    removeFromCart(id);
    return;
  }
  row.qty = Math.min(row.qty, p.stock);

  saveJSON(LS.cart, state.cart);
  updateBadges();
  renderCart();
}

function removeFromCart(id) {
  const p = products.find(x => x.id === id);
  state.cart = state.cart.filter(x => x.id !== id);
  saveJSON(LS.cart, state.cart);
  updateBadges();
  renderCart();
  toast("Removed", p ? p.name : "Item removed");
}

function calcSubtotal() {
  return state.cart.reduce((sum, ci) => {
    const p = products.find(x => x.id === ci.id);
    if (!p) return sum;
    return sum + (p.price * ci.qty);
  }, 0);
}

function applyCouponFromState() {
  const code = (state.coupon || "").trim().toUpperCase();

  if (code === "YU10") {
    state.discount = 10;
  } else if (code === "FREESHIP") {
    state.discount = "SHIP15";
  } else {
    state.discount = 0;
  }
}

function calcDiscount(subtotal) {
  const c = (state.coupon || "").trim().toUpperCase();
  if (!c) return 0;
  if (c === "YU10") return Math.round(subtotal * 0.10);
  if (c === "FREESHIP") return Math.min(15, subtotal);
  return 0;
}

function toggleWish(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  if (state.wish.includes(id)) {
    state.wish = state.wish.filter(x => x !== id);
    toast("Removed from wishlist", p.name);
  } else {
    state.wish.push(id);
    toast("Saved to wishlist", p.name);
  }
  saveJSON(LS.wish, state.wish);
  updateBadges();
  renderWishlist();
  renderProducts();
}

function isWished(id) {
  return state.wish.includes(id);
}

function openDrawer(type) {
  overlay.style.display = "block";
  if (type === "cart") {
    cartDrawer.style.display = "flex";
    wishlistDrawer.style.display = "none";
    cartDrawer.setAttribute("aria-hidden", "false");
    wishlistDrawer.setAttribute("aria-hidden", "true");
    renderCart();
  } else {
    wishlistDrawer.style.display = "flex";
    cartDrawer.style.display = "none";
    wishlistDrawer.setAttribute("aria-hidden", "false");
    cartDrawer.setAttribute("aria-hidden", "true");
    renderWishlist();
  }
}

function closeOverlays() {
  overlay.style.display = "none";
  cartDrawer.style.display = "none";
  wishlistDrawer.style.display = "none";
  productModal.style.display = "none";
  checkoutModal.style.display = "none";

  cartDrawer.setAttribute("aria-hidden", "true");
  wishlistDrawer.setAttribute("aria-hidden", "true");
  productModal.setAttribute("aria-hidden", "true");
  checkoutModal.setAttribute("aria-hidden", "true");
}

function openProductQuickView(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  overlay.style.display = "block";
  productModal.style.display = "flex";
  productModal.setAttribute("aria-hidden", "false");

  productModalBody.innerHTML = `
    <div class="qv">
      <div class="qv-left">
        <div class="qv-tag tag-${p.tag.toLowerCase()}">${p.tag}</div>
        <div>${p.image}</div>
      </div>
      <div class="qv-right">
        <div class="product-rating">
          <span>${stars(p.rating)}</span>
          <span class="rating-text">(${p.rating})</span>
        </div>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="product-meta">
          <span class="pill">${capitalize(p.category)}</span>
          <span class="pill">In stock: ${p.stock}</span>
        </div>
        <p class="muted" style="line-height:1.7;">
          A premium item designed for comfort and style. This is demo content,
          but the full cart + wishlist flow is real in the browser.
        </p>
        <div class="qv-price">$${money(p.price)}</div>

        <div class="qv-actions">
          <button class="btn-primary" id="qvAdd">Add to Cart</button>
          <button class="btn-secondary" id="qvWish">${isWished(p.id) ? "Remove Wishlist" : "Add Wishlist"}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("qvAdd")?.addEventListener("click", () => addToCart(p.id, 1));
  document.getElementById("qvWish")?.addEventListener("click", () => toggleWish(p.id));
}

function closeProductQuickView() {
  productModal.style.display = "none";
  productModal.setAttribute("aria-hidden", "true");
  if (cartDrawer.style.display !== "flex" && wishlistDrawer.style.display !== "flex") {
    overlay.style.display = "none";
  }
}

function openCheckout() {
  cartDrawer.style.display = "none";
  wishlistDrawer.style.display = "none";
  cartDrawer.setAttribute("aria-hidden", "true");
  wishlistDrawer.setAttribute("aria-hidden", "true");

  const items = state.cart.map(ci => {
    const p = products.find(x => x.id === ci.id);
    return p ? { p, qty: ci.qty } : null;
  }).filter(Boolean);

  checkoutSummary.innerHTML = items.map(({ p, qty }) => `
    <div class="summary-item">
      <div>${p.image} ${escapeHtml(p.name)} <span class="muted">× ${qty}</span></div>
      <strong>$${money(p.price * qty)}</strong>
    </div>
  `).join("");

  const subtotal = calcSubtotal();
  const discount = calcDiscount(subtotal);
  const total = Math.max(0, subtotal - discount);

  coSubtotal.textContent = `$${money(subtotal)}`;
  coDiscount.textContent = `-$${money(discount)}`;
  coTotal.textContent = `$${money(total)}`;

  overlay.style.display = "block";
  checkoutModal.style.display = "flex";
  checkoutModal.setAttribute("aria-hidden", "false");
}

function updateBadges() {
  const c = state.cart.reduce((sum, x) => sum + x.qty, 0);
  cartCount.textContent = c;
  cartCount.style.display = c > 0 ? "flex" : "none";

  const w = state.wish.length;
  wishCount.textContent = w;
  wishCount.style.display = w > 0 ? "flex" : "none";
}

function scrollToShopIfNeeded() {
  const shop = document.getElementById("shop");
  const top = shop.getBoundingClientRect().top;
  if (top > 220) shop.scrollIntoView({ behavior: "smooth" });
}

function productCardHTML(p) {
  const wished = isWished(p.id);
  return `
    <div class="product-card" id="card_${p.id}">
      <div class="product-image">
        <div class="product-image-emoji">${p.image}</div>
        <div class="product-tag tag-${p.tag.toLowerCase()}">${p.tag}</div>
        <button class="product-wishlist" id="wish_${p.id}" aria-label="wishlist">${wished ? "❤️" : "🤍"}</button>
      </div>
      <div class="product-info">
        <div class="product-rating">
          <span>${stars(p.rating)}</span>
          <span class="rating-text">(${p.rating})</span>
        </div>
        <h4 class="product-name">${escapeHtml(p.name)}</h4>
        <div class="product-meta">
          <span class="pill">${capitalize(p.category)}</span>
          <span class="pill">Stock: ${p.stock}</span>
        </div>
        <div class="product-footer">
          <span class="product-price">$${money(p.price)}</span>
          <button class="btn-add-cart" id="add_${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function cartItemHTML(p, qty) {
  return `
    <div class="item-row">
      <div class="item-emoji">${p.image}</div>

      <div class="item-info">
        <div class="item-title">${escapeHtml(p.name)}</div>
        <div class="item-sub">${capitalize(p.category)} • Stock ${p.stock}</div>

        <div class="qty">
          <button id="dec_${p.id}" aria-label="decrease">−</button>
          <span>${qty}</span>
          <button id="inc_${p.id}" aria-label="increase">+</button>
        </div>
      </div>

      <div class="item-actions">
        <strong>$${money(p.price * qty)}</strong>
        <button class="remove" id="rem_${p.id}" aria-label="remove">Remove</button>
      </div>
    </div>
  `;
}

function wishItemHTML(p) {
  return `
    <div class="item-row">
      <div class="item-emoji">${p.image}</div>

      <div class="item-info">
        <div class="item-title">${escapeHtml(p.name)}</div>
        <div class="item-sub">$${money(p.price)} • ${capitalize(p.category)}</div>

        <div style="display:flex; gap:.5rem; margin-top:.65rem; flex-wrap:wrap;">
          <button class="btn-primary" id="wish_add_${p.id}" style="padding:.55rem 1rem;">Add</button>
          <button class="btn-secondary" id="wish_open_${p.id}" style="padding:.55rem 1rem;">View</button>
        </div>
      </div>

      <div class="item-actions">
        <button class="remove" id="wish_remove_${p.id}">Remove</button>
      </div>
    </div>
  `;
}

function toast(title, sub) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `
    <div class="toast-title">${escapeHtml(title)}</div>
    <div class="toast-sub">${escapeHtml(sub || "")}</div>
  `;
  toasts.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    el.style.transition = "all .25s";
  }, 2400);

  setTimeout(() => el.remove(), 2800);
}

function stars(rating) {
  const full = Math.floor(rating);
  let s = "";
  for (let i = 0; i < 5; i++) s += i < full ? "⭐" : "☆";
  return s;
}

function money(n) {
  return Number(n || 0).toFixed(0);
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function saveJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
