# Ammaie – Girls Dresses Store (Frontend)

Modern, responsive ecommerce frontend for a girls dresses store.

## Tech Stack

- **React 19** (Vite)
- **Tailwind CSS 4**
- **React Router 7**
- **Context API** (Cart, Wishlist, Auth, Toast)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Project structure

```
src/
├── components/    # Navbar, Footer, ProductCard, Breadcrumb, Skeleton, etc.
├── context/       # CartContext, WishlistContext, AuthContext, ToastContext
├── data/          # products.js (22 dummy dresses)
├── pages/         # Home, Shop, ProductDetails, Cart, Wishlist, Checkout, Login, Register, Profile, Orders, 404
├── App.jsx
├── main.jsx
└── index.css
```

## Features

- **Shop**: Grid layout, filters (price, size, color, category), sort (price, newest, popular), pagination, live search from navbar
- **Product details**: Gallery, size/color/quantity, reviews section, related products
- **Cart**: Add/remove/update quantity, subtotal, tax, shipping, empty state
- **Wishlist**: Add/remove, move to cart
- **Checkout**: Shipping form, payment method (Card/UPI/COD), order summary, protected route
- **Auth**: Login/Register with validation, protected Profile & Orders
- **UI**: Soft pink/pastel theme, sticky navbar, mobile menu, footer with newsletter, toasts, scroll-to-top, loading skeletons, breadcrumbs

## Auth (demo)

- Login/Register accept any email and password (min 6 chars for register).
- User is stored in `localStorage`; no backend.
