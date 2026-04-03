/* ========================================
   Cart Module - Cart management with localStorage
   ======================================== */

const Cart = {
  CART_KEY: 'foodie_cart',

  getCart() {
    return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
  },

  saveCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    this.updateCartUI();
    this.updateFabCount();
  },

  addItem(item) {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }

    this.saveCart(cart);
  },

  removeItem(itemId) {
    let cart = this.getCart();
    cart = cart.filter(c => c.id !== itemId);
    this.saveCart(cart);
  },

  updateQty(itemId, delta) {
    const cart = this.getCart();
    const item = cart.find(c => c.id === itemId);

    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.removeItem(itemId);
        return;
      }
    }

    this.saveCart(cart);
  },

  getTotal() {
    return this.getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  getCount() {
    return this.getCart().reduce((sum, item) => sum + item.qty, 0);
  },

  clear() {
    localStorage.removeItem(this.CART_KEY);
    this.updateCartUI();
    this.updateFabCount();
  },

  updateCartUI() {
    const cartItemsEl = document.querySelector('.cart-items');
    const cartCountEl = document.querySelector('.cart-count');
    const cartTotalEl = document.querySelector('.cart-total-amount');
    const checkoutBtn = document.querySelector('.btn-checkout');

    if (!cartItemsEl) return;

    const cart = this.getCart();
    const total = this.getTotal();
    const count = this.getCount();

    if (cartCountEl) cartCountEl.textContent = count + ' items';
    if (cartTotalEl) cartTotalEl.textContent = 'Rs. ' + total.toLocaleString();
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">🛒</div>
          <p>Your cart is empty</p>
        </div>
      `;
      return;
    }

    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</span>
        </div>
        <div class="cart-item-controls">
          <button onclick="Cart.updateQty('${item.id}', -1)">-</button>
          <span class="qty">${item.qty}</span>
          <button onclick="Cart.updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');
  },

  updateFabCount() {
    const fabCount = document.querySelector('.fab-count');
    if (fabCount) {
      fabCount.textContent = this.getCount();
    }
  }
};
