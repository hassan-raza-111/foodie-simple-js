/* ========================================
   Orders Module - Order history page
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
  const ordersList = document.querySelector('.orders-list');
  if (!ordersList) return;

  // Check auth
  if (!Auth.isLoggedIn()) {
    window.location.href = 'signin.html';
    return;
  }

  renderOrders();
});

function renderOrders() {
  const ordersList = document.querySelector('.orders-list');
  if (!ordersList) return;

  const user = Auth.getCurrentUser();
  const allOrders = JSON.parse(localStorage.getItem('foodie_orders') || '[]');
  const userOrders = allOrders
    .filter(o => o.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (userOrders.length === 0) {
    ordersList.innerHTML = `
      <div class="orders-empty">
        <div class="empty-icon">📦</div>
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet. Explore our menu and order your favorite food!</p>
        <a href="menu.html" class="btn btn-primary">Browse Menu</a>
      </div>
    `;
    return;
  }

  ordersList.innerHTML = userOrders.map(order => {
    const date = new Date(order.date);
    const dateStr = date.toLocaleDateString('en-PK', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-PK', {
      hour: '2-digit', minute: '2-digit'
    });

    const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');

    return `
      <div class="order-card" onclick="toggleOrder(this)">
        <div class="order-card-header">
          <div>
            <div class="order-id">${order.id}</div>
            <div class="order-date">${dateStr} at ${timeStr}</div>
          </div>
          <span class="order-status ${statusClass}">${order.status}</span>
          <span class="order-total-preview">Rs. ${order.total.toLocaleString()}</span>
          <span class="order-chevron">&#9660;</span>
        </div>
        <div class="order-card-body">
          <div class="order-items-list">
            ${order.items.map(item => `
              <div class="order-item-row">
                <span>${item.emoji} ${item.name} x${item.qty}</span>
                <span>Rs. ${item.subtotal.toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
            <div class="order-detail-row">
              <span class="label">Address:</span>
              <span class="value">${order.address}</span>
            </div>
            <div class="order-detail-row">
              <span class="label">Phone:</span>
              <span class="value">${order.phone}</span>
            </div>
            <div class="order-detail-row">
              <span class="label">Payment:</span>
              <span class="value">${order.payment}</span>
            </div>
            ${order.notes ? `
            <div class="order-detail-row">
              <span class="label">Notes:</span>
              <span class="value">${order.notes}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleOrder(card) {
  card.classList.toggle('expanded');
}
