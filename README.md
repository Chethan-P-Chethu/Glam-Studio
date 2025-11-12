# GlamStudio Web App

- Frontend: React (CDN) + TailwindCSS in `frontend/`
- Backend: Node.js + Express + MongoDB + JWT + Excel export in `backend/`

## Setup

1) Backend
- Node 18+
- In `backend/.env` update values if needed (already filled with your MONGO_URL and admin creds).
- Install deps and run:
```
cd backend
npm install
npm run dev
```
- API runs at http://localhost:4000

2) Frontend
- Open `frontend/index.html` directly with Live Server or any static server.
- The app points to `http://localhost:4000` by default.

## Features
- Customer booking flow: type, parlour, service, provider, payment method, price calc with UPI GST (18%) and 10% discount, confirmation stored in MongoDB.
- Admin login (username/password from `.env`).
- Admin dashboard: search bookings, list latest, export to Excel.


Check out my [GlamStudio Website](https://glam-studio-2.onrender.com/)
