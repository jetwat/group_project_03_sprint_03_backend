# 📚 Readly — Online Bookstore API

> **A RESTful backend API for the Readly online bookstore — Group Project 03, Sprint 03 (JSD12)**

Readly API is a Node.js/Express backend that powers the Readly bookstore SPA. It provides secure, session-based endpoints for user authentication, product management, shopping cart, orders, reviews, favorites, coupons, and customer feedback — with role-based access control for admin operations.

---

## ✨ Features

### 🛒 Customer Endpoints

| Feature | Description |
|---|---|
| **Authentication** | Register, login, logout with JWT stored in HTTP-only cookies |
| **User Profile** | View and update profile, address, and payment card info |
| **Product Catalog** | Browse all books, search by category, and view individual book details |
| **Shopping Cart** | Create, update, and delete cart with item-level quantity management |
| **Orders** | Place orders (auto-decrements stock), view personal order history |
| **Reviews & Ratings** | Submit, update, and delete reviews with 0.5–5 star ratings |
| **Favorites** | Toggle favorite books; retrieve personalized favorites list |
| **Coupon Validation** | Validate coupon codes with percentage/fixed discount logic |
| **Feedback** | Submit customer feedback messages |

### 🔧 Admin Endpoints

| Feature | Description |
|---|---|
| **Product CRUD** | Create, update, and delete books in the catalog |
| **Order Management** | List all orders and update order statuses |
| **Coupon Management** | Create, update, and delete promotional coupon codes |
| **User List** | Retrieve all registered users |
| **Feedback Review** | Access all submitted customer feedback |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18.x | JavaScript runtime (ES Modules) |
| **Express** | 5.x | HTTP framework |
| **MongoDB** | Atlas | NoSQL database (cloud-hosted) |
| **Mongoose** | 9.x | MongoDB ODM (schema & model layer) |
| **JSON Web Token** | 9.x | Stateless authentication tokens |
| **bcrypt** | 6.x | Password & CVV hashing |
| **cookie-parser** | 1.x | HTTP cookie parsing middleware |
| **Helmet** | 8.x | Security headers |
| **CORS** | 2.x | Cross-origin resource sharing |
| **express-rate-limit** | 8.x | API rate limiting |

---

## 📁 Project Structure

```
group_project_03_sprint_03_backend/
├── src/
│   ├── config/
│   │   └── mongodb.js               # MongoDB Atlas connection (database: "Readly")
│   ├── middlewares/
│   │   ├── auth.js                  # JWT verification — extracts userId from cookie
│   │   ├── author.js                # Admin role check (403 if not admin)
│   │   └── rateLimiter.js          # 100 requests per 15-minute window
│   ├── modules/
│   │   ├── carts/
│   │   │   ├── cart.model.js        # Cart schema (user_id, items, total_amount)
│   │   │   └── cart.controller.js   # CRUD for cart management
│   │   ├── coupons/
│   │   │   ├── coupon.model.js      # Coupon schema (code, discountType, usageLimit)
│   │   │   └── coupons.controller.js # Coupon validation & admin CRUD
│   │   ├── favorites/
│   │   │   ├── favorite.model.js    # Favorites schema (user_id, favorite_items[])
│   │   │   └── favorite.controller.js # Toggle & manage favorites
│   │   ├── orders/
│   │   │   ├── order.model.js       # Order schema (status enum, order_item[])
│   │   │   └── order.controllers.js # Order creation with stock decrement
│   │   ├── products/
│   │   │   ├── product.model.js     # Product schema (isbn unique, discount fields)
│   │   │   └── product.controller.js # Product CRUD
│   │   ├── reviews/
│   │   │   ├── review.model.js      # Review schema (0.5–5 rating, 1000 char limit)
│   │   │   └── review.controller.js # Review CRUD
│   │   ├── setting/
│   │   │   ├── feedback.model.js    # Feedback schema (user_id, message)
│   │   │   └── feedback.controller.js # Feedback submission & retrieval
│   │   └── users/
│   │       ├── user.model.js        # User schema (address, card, role)
│   │       └── users.v2.controller.js # Registration, login, profile management
│   ├── routes/
│   │   ├── index.js                 # Aggregates all route modules under /api
│   │   ├── cart.routes.js
│   │   ├── coupons.routes.js
│   │   ├── favorite.routes.js
│   │   ├── feedback.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   ├── reviews.routes.js
│   │   └── users.routes.js
│   ├── utils/
│   │   └── generateSecretKey.js     # JWT secret key generation utility
│   └── server.js                    # App entry point (Express + middleware setup)
├── tests/                           # HTTP client test files (.http / .rest)
│   ├── cart.http
│   ├── coupon.http
│   ├── order.rest
│   └── products.http
├── test/
│   └── create-user.http
├── .env                             # Environment variables (not committed)
├── .prettierrc                      # Prettier config
└── package.json
```

---

## 🔗 API Endpoints

All routes are prefixed with `/api`.

### Authentication & Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/users` | Public | Register a new account |
| `POST` | `/users/login` | Public | Login — sets JWT cookie |
| `POST` | `/users/auth/logout` | Public | Logout — clears cookie |
| `GET` | `/users/me` | Auth | Get current user profile |
| `GET` | `/users/auth/me` | Auth | Check session status |
| `PATCH` | `/users/me` | Auth | Update current user profile |
| `GET` | `/users` | Auth | [Admin] List all users |
| `GET` | `/users/:id` | Auth | Get user by ID |
| `PUT` | `/users/:id` | Auth | Update user by ID |
| `DELETE` | `/users/:id` | Auth | Delete user by ID |

### Products (Books)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | Public | List all products |
| `GET` | `/products/:id` | Public | Get a single product |
| `POST` | `/products` | Auth + Admin | Create a new product |
| `PUT` | `/products/:id` | Auth | Update a product |
| `DELETE` | `/products/:id` | Auth + Admin | Delete a product |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cart/:user_id` | Auth | Get user's cart |
| `POST` | `/cart` | Auth | Create cart / add items |
| `PATCH` | `/cart/:id` | Auth | Update cart items |
| `DELETE` | `/cart/:id` | Auth | Delete cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/orders` | Auth | Create order (decrements stock) |
| `GET` | `/orders/me` | Auth | Get current user's order history |
| `GET` | `/orders` | Auth + Admin | Get all orders |
| `PATCH` | `/orders/:id` | Auth | Update order status |
| `DELETE` | `/orders/:id` | Auth + Admin | Delete order |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/reviews/:book_id` | Public | Get all reviews for a book |
| `POST` | `/reviews` | Auth | Submit a review |
| `PUT` | `/reviews/:id` | Auth | Update a review |
| `DELETE` | `/reviews/:id` | Auth | Delete a review |

### Favorites

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/favorites` | Auth | Get current user's favorites |
| `POST` | `/favorites/:id` | Auth | Toggle favorite for a book |
| `PATCH` | `/favorites/:id` | Auth | Update a favorite item |
| `DELETE` | `/favorites/:id` | Auth | Remove from favorites |

### Coupons

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/coupons/validate` | Auth | Validate a coupon code |
| `GET` | `/coupons` | Auth + Admin | List all coupons |
| `POST` | `/coupons` | Auth + Admin | Create a coupon |
| `PATCH` | `/coupons/:id` | Auth + Admin | Update a coupon |
| `DELETE` | `/coupons/:id` | Auth + Admin | Delete a coupon |

### Feedback

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/feedback` | Auth | Submit feedback |
| `GET` | `/feedback` | Auth | Retrieve all feedback |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB Atlas** account (or local MongoDB instance)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Nantanat-Poyomratanasin/group_project_03_sprint_03_backend.git

# 2. Navigate to the project directory
cd group_project_03_sprint_03_backend

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/Readly
JWT_SECRET=<64-character-hex-string>
NODE_ENV=development
PORT=3000
```

> Generate a secure JWT secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Development

```bash
# Start the development server with auto-reload
npm run dev
```

The API will be available at `http://localhost:3000`.

### Production

```bash
# Start the production server
npm start
```

---

## 🏗️ Architecture

### Module-Based Structure

Each feature is self-contained in `src/modules/<name>/` with its own model and controller, keeping concerns separated and the codebase easy to navigate.

### Middleware Chain

```
Request
  └── Helmet (security headers)
  └── CORS (allowed origins)
  └── Rate Limiter (100 req / 15 min)
  └── cookie-parser
  └── Route Handler
        └── authUser        → verifies JWT from cookie
        └── authorizeAdmin  → checks role === 'admin'
        └── Controller
```

### Authentication Model

- **Login**: validates credentials → signs JWT (`userId`, 1h expiry) → sets HTTP-only cookie
- **Protected routes**: `authUser` middleware decodes cookie → attaches `req.userId`
- **Admin routes**: additionally run `authorizeAdmin` → fetches user from DB → asserts `role === 'admin'`

### Security Features

| Measure | Detail |
|---|---|
| **Password hashing** | bcrypt, 12 salt rounds |
| **Card CVV hashing** | bcrypt (not returned in responses) |
| **JWT** | HTTP-only cookie, 1-hour expiry |
| **Rate limiting** | 100 requests per 15 minutes |
| **Security headers** | Helmet.js |
| **CORS** | Restricted to `localhost:5173–5175` and Vercel production domain |

---

## 👥 Team Members

| GitHub Username | Contributions |
|---|---|
| **Nantanat-Poyomratanasin** | Project setup & maintenance, order model & controllers, setting/feedback module, CORS & Vercel deployment config, bug fixes |
| **Sahatsawat-Wattana** | Review model & controller, admin authorization middleware, route debugging |
| **jetwat** | Coupon model & controller, order enhancements (auto-delete cart on checkout), module folder restructure |
| **phongphon1611** | Cart model & controller (CRUD, quantity management), cart API test files |
| **emmikapk-bit** | Product model & controller (CRUD), product router, discount fields on product |
| **NattagornSH** | Favorites feature (model & CRUD controllers) |

---

## 📄 License

This project is developed as part of the **Generation Thailand — Junior Software Developer Bootcamp (JSD12)**.

---

<p align="center">
  Built with ❤️ by <strong>Group 03</strong> — JSD12, Generation Thailand
</p>
