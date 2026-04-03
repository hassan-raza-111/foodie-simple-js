# Foodie — Online Food Ordering Website

> Pure HTML + CSS + JavaScript project. Koi backend nahi, koi framework nahi. Seedha browser mein chalta hai.

---

## Project Overview

**Foodie** ek front-end food ordering website hai jahan users menu browse kar sakte hain, cart mein items add kar sakte hain, aur order place kar sakte hain. Saara data browser ki **localStorage** mein save hota hai — koi server, koi database ki zaroorat nahi.

**Main Features:**
- User Signup / Sign In / Sign Out
- 12-item food menu with price and tags
- Shopping cart with quantity controls
- Order placement with delivery details (name, phone, address)
- Order history page (login required)
- Customer reviews carousel (auto-play)
- Fully responsive (mobile-friendly)

---

## Folder & File Structure

```
foodie-simple/
│
├── index.html        ← Home page (hero, features, menu preview, reviews)
├── menu.html         ← Full menu + cart sidebar
├── about.html        ← About us (static page)
├── service.html      ← Order history page (login required)
├── signin.html       ← Login form
├── signup.html       ← Registration form
│
├── css/
│   └── style.css     ← Single CSS file for all pages
│
└── js/
    ├── auth.js       ← Signup, signin, signout, session management
    ├── app.js        ← Navbar, mobile menu, active link highlight
    ├── menu.js       ← Menu data (12 items), render, order modal
    ├── cart.js       ← Cart add/remove/qty/total logic
    ├── orders.js     ← Order history page rendering
    └── reviews.js    ← Reviews carousel autoplay
```

---

## Pages — Har Page Kya Karta Hai

| Page | Kya Hai | JS Files Used |
|---|---|---|
| `index.html` | Home page — hero, features, 6-item preview, reviews carousel | app.js, reviews.js |
| `menu.html` | Full 12-item menu + cart sidebar + order modal | app.js, menu.js, cart.js, auth.js |
| `service.html` | Order history — login check, user ke orders dikhao | app.js, orders.js, auth.js |
| `signin.html` | Login form (email + password) | app.js, auth.js |
| `signup.html` | Registration form (name + email + password) | app.js, auth.js |
| `about.html` | Static about us page | app.js |

---

## User Flow (Step by Step)

```
1. User visits index.html (Home)
        ↓
2. Sign Up (signup.html) or Sign In (signin.html)
   → Account localStorage mein save hota hai
        ↓
3. Menu browse karo (menu.html)
   → 12 items — price, description, tags
        ↓
4. "Order Now" click karo
   → Modal khulta hai: name, phone, address fill karo
        ↓
5. Order placed
   → foodie_orders localStorage mein save hota hai
        ↓
6. Order history dekho (service.html)
   → Sirf logged-in user ke orders dikhte hain
```

---

## JavaScript Modules — Coding Explanation

### `auth.js` — User Authentication

Koi server nahi — sab localStorage mein.

```javascript
const Auth = {
  USERS_KEY: 'foodie_users',           // sab registered users
  CURRENT_USER_KEY: 'foodie_current_user', // logged-in user

  signup(name, email, password)  // naya user banao
  signin(email, password)        // login karo
  signout()                      // logout — current user remove karo
  getCurrentUser()               // logged-in user ka object return karo
  isLoggedIn()                   // true/false
}
```

**signup() flow:**
1. Existing users check karo (duplicate email?)
2. New user object banao: `{ id, name, email, password, createdAt }`
3. `foodie_users` array mein push karo
4. Safe user (bina password) `foodie_current_user` mein set karo

**signin() flow:**
1. `foodie_users` mein email + password match dhundho
2. Match mila → `foodie_current_user` set karo
3. Nahi mila → error return karo

---

### `cart.js` — Shopping Cart

```javascript
const Cart = {
  addItem(item)          // item add karo — already hai toh qty++
  removeItem(itemId)     // item remove karo by id
  updateQty(id, delta)   // qty +1 ya -1 (0 pe auto-remove)
  getTotal()             // total price calculate karo
  getCount()             // total items count
  clear()                // cart empty karo
  updateCartUI()         // DOM update — cart sidebar refresh
  updateFabCount()       // floating cart button ka count update
}
```

Cart data `foodie_cart` key mein save hota hai:
```json
[
  { "id": "pizza", "name": "Pizza", "emoji": "🍕", "price": 1500, "qty": 2 },
  { "id": "biryani", "name": "Biryani", "emoji": "🍛", "price": 700, "qty": 1 }
]
```

---

### `menu.js` — Menu Data & Order Modal

12 food items hard-coded array mein hain:

```javascript
const MenuData = [
  { id: 'pizza',    name: 'Pizza',    price: 1500, tags: ['Popular', 'Italian'] },
  { id: 'beef-burger', name: 'Beef Burger', price: 500, tags: ['Bestseller'] },
  { id: 'biryani', name: 'Biryani',  price: 700,  tags: ['Desi', 'Bestseller'] },
  // ... 9 more items
]
```

**Order placement flow:**
1. `openOrderModal(itemId)` — selected item store karo, modal kholo
2. Agar user logged in hai → name auto-fill
3. `placeOrder()` — validate name/phone/address
4. Order object banao aur `foodie_orders` array mein push karo

**Order object structure:**
```json
{
  "id": "ORD-ABC123",
  "item": "Pizza",
  "emoji": "🍕",
  "price": 1500,
  "name": "Ahmed Ali",
  "phone": "03001234567",
  "address": "House 5, Block A, Lahore",
  "payment": "Cash on Delivery",
  "status": "Preparing",
  "date": "2024-01-15T10:30:00.000Z"
}
```

---

### `reviews.js` — Customer Reviews Carousel

4 static reviews hain. Auto-play 5 seconds mein next slide pe jaata hai.

```javascript
renderReviews()   // slides aur dots DOM mein render karo
goToSlide(index)  // specific slide pe jao + autoplay reset
nextSlide()       // next slide (circular — last ke baad first)
prevSlide()       // prev slide (circular)
startAutoPlay()   // setInterval 5000ms
```

---

### `app.js` — Shared Navbar Logic

Har page pe load hota hai. 3 kaam karta hai:

```javascript
updateNavAuth()        // Login check — "Hi, Name + Sign Out" ya "Sign In / Sign Up"
highlightCurrentPage() // Current page ki nav link ko active class do
initMobileMenu()       // Hamburger menu toggle (mobile screens)
```

---

## localStorage — Data Storage Map

Saara data browser mein rehta hai:

| localStorage Key | Kya Store Hota Hai |
|---|---|
| `foodie_users` | Sab registered users ka array |
| `foodie_current_user` | Logged-in user ka object (session) |
| `foodie_cart` | Cart items array |
| `foodie_orders` | Placed orders array |

> **Note:** Agar user browser history/cache clear kare toh ye data delete ho jaata hai. Alag device pe alag account banana hoga — ye design intentional hai (no server needed).

---

## How to Run

### Option 1 — Direct Open (Simplest)
`foodie-simple` folder mein `index.html` file double-click karo — browser mein khul jaayega.

### Option 2 — VS Code Live Server
VS Code mein folder kholo → `index.html` pe right-click → **"Open with Live Server"**

### Option 3 — Deploy Online (Free)
- **Netlify:** netlify.com pe jao → folder drag-and-drop → free live URL
- **GitHub Pages:** GitHub repo → Settings → Pages → branch select

> **Koi npm install nahi, koi build nahi, koi server nahi.** Pure HTML files hain.

---

## Technology Stack

| Technology | Use |
|---|---|
| HTML5 | Sab pages ki structure |
| CSS3 | Styling, animations, responsive (Flexbox + Grid) |
| Vanilla JavaScript (ES6+) | Poori functionality — koi jQuery/React nahi |
| localStorage API | Users, cart, orders ka data store karna |
| CSS Variables | Color theme (`--primary: #e74c3c`) |

---

*Foodie — Project Documentation | Client Handover*
