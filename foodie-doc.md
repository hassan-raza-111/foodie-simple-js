# Foodie — Online Food Ordering Website

> HTML + CSS + JavaScript + **PHP + MySQL** project. Frontend se backend tak complete — database mein data permanently save hota hai.

---

## Project Overview

**Foodie** ek full-stack food ordering website hai jahan users menu browse kar sakte hain, cart mein items add kar sakte hain, aur order place kar sakte hain. Saara data **MySQL database** mein permanently save hota hai — PHP backend API calls handle karta hai aur user sessions PHP sessions se manage hoti hain.

**Main Features:**
- User Signup / Sign In / Sign Out (password hashed — secure)
- 12-item food menu with price and tags
- Shopping cart with quantity controls
- Order placement with delivery details (name, phone, address)
- Order history page (login required — sirf apne orders dikhte hain)
- Customer reviews carousel (auto-play)
- Fully responsive (mobile-friendly)
- **One-click database setup** (`setup.php`)

---

## Folder & File Structure

```
foodie-simple-js/
│
├── index.html        ← Home page (hero, features, menu preview, reviews)
├── menu.html         ← Full menu + order modal
├── about.html        ← About us (static page)
├── service.html      ← Order history page (login required)
├── signin.html       ← Login form
├── signup.html       ← Registration form
│
├── setup.php         ← Database setup — browser mein kholo, sab automatic
├── database.sql      ← SQL script — phpMyAdmin mein import karo
│
├── css/
│   └── style.css     ← Single CSS file for all pages
│
├── js/
│   ├── auth.js       ← Signup, signin, signout (PHP API calls)
│   ├── app.js        ← Navbar, mobile menu, active link highlight
│   ├── menu.js       ← Menu data (12 items), render, order modal (PHP API)
│   ├── cart.js       ← Cart add/remove/qty/total logic
│   ├── orders.js     ← Order history — PHP se orders fetch karna
│   └── reviews.js    ← Reviews carousel autoplay
│
└── php/
    ├── config.php    ← Database connection + session start
    ├── signup.php    ← User registration API
    ├── signin.php    ← User login API
    ├── session.php   ← Check login status API
    ├── logout.php    ← Logout API
    ├── place_order.php ← Order place karna API
    └── get_orders.php  ← User ke orders fetch karna API
```

---

## Database Structure (MySQL)

**Database name:** `foodie_simple`

### Table: `users`
| Column | Type | Description |
|---|---|---|
| id | INT (PK, Auto) | User ID |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(150) UNIQUE | Email address |
| password | VARCHAR(255) | Hashed password (password_hash) |
| created_at | TIMESTAMP | Account creation date |

### Table: `orders`
| Column | Type | Description |
|---|---|---|
| id | INT (PK, Auto) | Order ID |
| order_code | VARCHAR(50) | Display code (e.g. ORD-ABC123) |
| user_id | INT (FK → users) | Kis user ne order kiya |
| item_name | VARCHAR(100) | Food item ka naam |
| item_emoji | VARCHAR(10) | Item emoji |
| item_price | INT | Price in Rs. |
| customer_name | VARCHAR(100) | Customer name |
| phone | VARCHAR(20) | Phone number |
| address | TEXT | Delivery address |
| payment | VARCHAR(50) | Payment method (Cash on Delivery) |
| status | VARCHAR(50) | Order status (Preparing) |
| created_at | TIMESTAMP | Order placement date |

---

## PHP Backend — API Endpoints

| File | Method | Kya Karta Hai |
|---|---|---|
| `php/signup.php` | POST | Naya user register karta hai (password hash ke sath) |
| `php/signin.php` | POST | Login — email + password verify, PHP session set |
| `php/session.php` | GET | Check karo user logged in hai ya nahi |
| `php/logout.php` | GET | Session destroy — logout |
| `php/place_order.php` | POST | Order database mein save karo |
| `php/get_orders.php` | GET | Logged-in user ke orders return karo |

**Sab endpoints JSON response dete hain:**
```json
{ "success": true, "user": { "id": 1, "name": "Ahmed", "email": "ahmed@test.com" } }
```

**Error example:**
```json
{ "success": false, "message": "Invalid email or password." }
```

---

## Pages — Har Page Kya Karta Hai

| Page | Kya Hai | JS Files Used |
|---|---|---|
| `index.html` | Home page — hero, features, 6-item preview, reviews carousel | app.js, reviews.js |
| `menu.html` | Full 12-item menu + order modal | app.js, menu.js, cart.js, auth.js |
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
   → PHP backend mein password hash hoke database mein save hota hai
   → PHP session set hoti hai
        ↓
3. Menu browse karo (menu.html)
   → 12 items — price, description, tags
        ↓
4. "Order Now" click karo
   → Modal khulta hai: name, phone, address fill karo
        ↓
5. Order placed
   → PHP API call → MySQL database mein save hota hai
        ↓
6. Order history dekho (service.html)
   → PHP se sirf logged-in user ke orders fetch hote hain
```

---

## JavaScript Modules — Coding Explanation

### `auth.js` — User Authentication (PHP API)

Sab authentication PHP backend se hoti hai. JavaScript `fetch()` calls karta hai.

```javascript
const Auth = {
  async checkSession()              // PHP se login status check karo
  getCurrentUser()                  // cached user object return karo
  isLoggedIn()                      // true/false
  async signup(name, email, password) // POST → php/signup.php
  async signin(email, password)     // POST → php/signin.php
  async signout()                   // GET → php/logout.php
}
```

**signup() flow:**
1. `fetch('php/signup.php')` — name, email, password POST karo
2. PHP side: duplicate email check → password hash → database INSERT
3. PHP session set → user object return
4. Redirect to index.html

**signin() flow:**
1. `fetch('php/signin.php')` — email, password POST karo
2. PHP side: email se user find → `password_verify()` se match
3. Match → PHP session set → user object return
4. Redirect to index.html

**Security:** Passwords `password_hash(PASSWORD_DEFAULT)` se hash hote hain — plaintext kabhi store nahi hota.

---

### `menu.js` — Menu Data & Order Modal (PHP API)

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
4. `fetch('php/place_order.php')` — order data POST karo
5. PHP side: database INSERT → order code generate → success return
6. Success alert dikhao

---

### `orders.js` — Order History (PHP API)

```javascript
async function renderOrders() {
  const res = await fetch('php/get_orders.php');  // PHP se orders fetch
  const data = await res.json();
  // data.orders array ko cards mein render karo
}
```

Orders sirf logged-in user ke dikhte hain — PHP backend `user_id` se filter karta hai.

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

> Note: Cart abhi localStorage mein hai — ye temporary data hai (checkout ke baad order DB mein jaata hai).

---

### `reviews.js` — Customer Reviews Carousel

4 static reviews hain. Auto-play 5 seconds mein next slide pe jaata hai.

---

### `app.js` — Shared Navbar Logic

Har page pe load hota hai. Pehle `Auth.checkSession()` call karta hai (PHP se login check), phir:

```javascript
updateNavAuth()        // Login check — "Hi, Name + Sign Out" ya "Sign In / Sign Up"
highlightCurrentPage() // Current page ki nav link ko active class do
initMobileMenu()       // Hamburger menu toggle (mobile screens)
```

---

## How to Setup & Run

### Naye Laptop / Computer Pe Setup

**Requirements:** PHP + MySQL hona chahiye (XAMPP install karo — easiest)

#### Method 1 — One-Click Setup (Recommended)

1. XAMPP install karo aur Apache + MySQL start karo
2. Project folder ko `C:/xampp/htdocs/` mein copy karo
3. Browser mein kholo: `http://localhost/foodie-simple-js/setup.php`
4. MySQL username/password daalo → **"Setup Database"** button dabao
5. Sab automatic ho jayega — database, tables, config sab!
6. `http://localhost/foodie-simple-js/` pe project use karo

#### Method 2 — SQL Import (phpMyAdmin)

1. XAMPP mein phpMyAdmin kholo (`http://localhost/phpmyadmin`)
2. "Import" tab pe jao
3. `database.sql` file select karo → "Go" dabao
4. `php/config.php` mein apna MySQL username/password daalo
5. Project ready!

#### Method 3 — Command Line

```bash
# Database setup
mysql -u root -p < database.sql

# PHP server start
cd foodie-simple-js
php -S localhost:8001

# Browser mein kholo: http://localhost:8001
```

---

## Technology Stack

| Technology | Use |
|---|---|
| HTML5 | Sab pages ki structure |
| CSS3 | Styling, animations, responsive (Flexbox + Grid) |
| Vanilla JavaScript (ES6+) | Frontend logic — fetch API se PHP backend calls |
| **PHP 8+** | Backend API — authentication, orders, sessions |
| **MySQL** | Database — users aur orders permanently store |
| **password_hash()** | Secure password hashing (bcrypt) |
| PHP Sessions | User login state manage karna |
| CSS Variables | Color theme (`--primary: #e74c3c`) |

---

## Security Features

- Passwords **hashed** hain (`password_hash` / `password_verify`) — plaintext kabhi store nahi hota
- PHP **prepared statements** use hote hain — SQL injection se protection
- User sessions **server-side** PHP sessions se manage hoti hain
- Orders **user-specific** hain — ek user doosre ke orders nahi dekh sakta

---

*Foodie — Project Documentation | PHP + MySQL Backend*
