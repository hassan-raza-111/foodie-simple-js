const MenuData = [
  { id: 'pizza',         name: 'Pizza',         emoji: '🍕', description: 'Classic hand-tossed pizza with mozzarella cheese, fresh tomato sauce, and your choice of toppings.', price: 1500, tags: ['Popular', 'Italian'] },
  { id: 'beef-burger',   name: 'Beef Burger',   emoji: '🍔', description: 'Juicy grilled beef patty with lettuce, tomato, cheese, and our secret sauce in a toasted bun.',       price: 500,  tags: ['Bestseller', 'Fast Food'] },
  { id: 'pasta',         name: 'Pasta',         emoji: '🍝', description: 'Creamy alfredo pasta with garlic bread, made with imported Italian pasta and fresh herbs.',             price: 800,  tags: ['Italian', 'Creamy'] },
  { id: 'chicken-wings', name: 'Chicken Wings', emoji: '🍗', description: 'Crispy fried chicken wings tossed in your choice of hot, BBQ, or garlic parmesan sauce.',             price: 600,  tags: ['Spicy', 'Popular'] },
  { id: 'caesar-salad',  name: 'Caesar Salad',  emoji: '🥗', description: 'Fresh romaine lettuce with caesar dressing, croutons, and shaved parmesan cheese.',                   price: 450,  tags: ['Healthy', 'Fresh'] },
  { id: 'chocolate-cake',name: 'Chocolate Cake',emoji: '🎂', description: 'Rich and moist chocolate cake with layers of chocolate ganache and whipped cream.',                   price: 350,  tags: ['Dessert', 'Sweet'] },
  { id: 'biryani',       name: 'Biryani',       emoji: '🍛', description: 'Aromatic basmati rice layered with tender spiced chicken, saffron, and fried onions. Served with raita.', price: 700, tags: ['Desi', 'Bestseller'] },
  { id: 'shawarma',      name: 'Shawarma',      emoji: '🌯', description: 'Grilled chicken wrapped in fresh pita bread with garlic sauce, pickles, and vegetables.',             price: 400,  tags: ['Arabic', 'Wrap'] },
  { id: 'fries',         name: 'Fries',         emoji: '🍟', description: 'Golden crispy french fries seasoned with our special spice blend.',                                   price: 250,  tags: ['Snack', 'Fast Food'] },
  { id: 'cold-coffee',   name: 'Cold Coffee',   emoji: '☕', description: 'Refreshing blended iced coffee with milk, cream, and a touch of vanilla sweetness.',                  price: 300,  tags: ['Beverage', 'Cold'] },
  { id: 'zinger-burger', name: 'Zinger Burger', emoji: '🍔', description: 'Crispy fried chicken fillet with spicy mayo, fresh lettuce, and pickles in a sesame bun.',           price: 550,  tags: ['Spicy', 'Popular'] },
  { id: 'ice-cream',     name: 'Ice Cream',     emoji: '🍦', description: 'Three scoops of premium ice cream. Choose from vanilla, chocolate, strawberry, and mango.',           price: 200,  tags: ['Dessert', 'Cold'] }
];

let selectedItem = null;

function renderMenu() {
  const menuGrid = document.querySelector('.menu-grid');
  if (!menuGrid) return;

  menuGrid.innerHTML = MenuData.map(item => `
    <div class="menu-card" data-id="${item.id}">
      <div class="menu-card-emoji">${item.emoji}</div>
      <h3>${item.name}</h3>
      <p class="description">${item.description}</p>
      <div class="tags">
        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="menu-card-bottom">
        <span class="price">Rs. ${item.price.toLocaleString()}</span>
        <button class="btn-add-cart" onclick="openOrderModal('${item.id}')">Order Now</button>
      </div>
    </div>
  `).join('');
}

function openOrderModal(itemId) {
  selectedItem = MenuData.find(m => m.id === itemId);
  if (!selectedItem) return;

  document.getElementById('modal-item-name').textContent = selectedItem.emoji + ' ' + selectedItem.name + ' — Rs. ' + selectedItem.price.toLocaleString();

  // Auto-fill name if logged in
  const user = Auth.getCurrentUser();
  document.getElementById('order-name').value = user ? user.name : '';
  document.getElementById('order-phone').value = '';
  document.getElementById('order-address').value = '';
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

  document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('active');
}

function placeOrder() {
  const name    = document.getElementById('order-name').value.trim();
  const phone   = document.getElementById('order-phone').value.trim();
  const address = document.getElementById('order-address').value.trim();

  let valid = true;

  if (!name) {
    document.getElementById('order-name').parentElement.classList.add('error');
    valid = false;
  } else {
    document.getElementById('order-name').parentElement.classList.remove('error');
  }

  if (!phone || phone.length < 10) {
    document.getElementById('order-phone').parentElement.classList.add('error');
    valid = false;
  } else {
    document.getElementById('order-phone').parentElement.classList.remove('error');
  }

  if (!address) {
    document.getElementById('order-address').parentElement.classList.add('error');
    valid = false;
  } else {
    document.getElementById('order-address').parentElement.classList.remove('error');
  }

  if (!valid) return;

  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    item: selectedItem.name,
    emoji: selectedItem.emoji,
    price: selectedItem.price,
    name: name,
    phone: phone,
    address: address,
    payment: 'Cash on Delivery',
    status: 'Preparing',
    date: new Date().toISOString()
  };

  const orders = JSON.parse(localStorage.getItem('foodie_orders') || '[]');
  orders.push(order);
  localStorage.setItem('foodie_orders', JSON.stringify(orders));

  closeOrderModal();
  document.querySelector('.alert-overlay').classList.add('active');
}

function closeAlert() {
  document.querySelector('.alert-overlay').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', renderMenu);
