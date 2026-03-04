# Ammaie Apparels – Admin Dashboard

Standalone admin panel for Ammaie Apparels (separate from the store frontend).

## Run

```bash
cd D:\Ammaie.Apperals\admin
npm install
npm run dev
```

Runs at **http://localhost:5174** (store frontend runs at 5173).

## Login

- **Email:** admin@ammaie.com  
- **Password:** admin123  

(Configured in `src/admin/adminAccount.js`.)

## Build

```bash
npm run build
```

Output is in `dist/`.

## Project layout

- **webfrontend** – customer store (React + Vite)
- **admin** – this app, admin dashboard only
- **backend** – API (if used)

Admin and store use separate ports and localStorage; they do not share auth or data unless you add a backend API.
