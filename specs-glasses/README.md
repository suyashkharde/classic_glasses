# Visio Eyewear — Full-Stack E-Commerce

A minimalistic, professional e-commerce platform for glasses and eyewear built with React, Node.js, MongoDB, and Razorpay.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Zustand
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT
- **Payments**: Razorpay
- **Deployment**: Docker

---

## Quick Start (Local)

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

### 3. Seed the Database

```bash
cd server
node src/seed.js
```

This creates:
- Admin: `admin@visio.com` / `admin123`
- User: `user@visio.com` / `user123`
- 8 sample products
- Coupons: `FIRST10` (10%), `SAVE20` (20%)

### 4. Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## Environment Variables

### server/.env

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/specs-glasses
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

### Razorpay Setup
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret to `.env`

---

## Docker Deployment

```bash
# Copy and fill env vars
cp server/.env.example server/.env

# Build and run
docker-compose up --build
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with hero, categories, featured products |
| `/products` | Product listing with filters & sorting |
| `/products/:id` | Product detail with reviews |
| `/cart` | Shopping cart |
| `/checkout` | Address + Razorpay payment |
| `/orders` | My orders |
| `/orders/:id` | Order detail with tracking |
| `/wishlist` | Saved products |
| `/login` | Login |
| `/register` | Register |
| `/admin` | Admin dashboard |
| `/admin/products` | Manage products |
| `/admin/orders` | Manage orders |

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/wishlist
POST   /api/auth/wishlist/:productId

GET    /api/products
GET    /api/products/:id
POST   /api/products          (admin)
PUT    /api/products/:id      (admin)
DELETE /api/products/:id      (admin)
POST   /api/products/:id/reviews

POST   /api/orders/create
POST   /api/orders/verify
POST   /api/orders/coupon
GET    /api/orders/my
GET    /api/orders/all        (admin)
GET    /api/orders/:id
PUT    /api/orders/:id/status (admin)

POST   /api/upload            (admin)
```

---

## Features

- JWT authentication (login/register)
- Product CRUD with image upload
- Category & price filtering, sorting
- Cart (localStorage)
- Wishlist
- Razorpay payment integration
- Order tracking with status steps
- Coupon/discount codes
- Product reviews & ratings
- Admin dashboard with stats
- Responsive design (mobile + desktop)
- Loading skeletons & toast notifications
- Docker support
