# MERN Restaurant App (White & Orange Theme)

This repository contains a compact MERN starter: Express + MongoDB backend and a Vite + React + TypeScript frontend with Tailwind (white + orange theme).

Quick layout:
```
restaurant-app/
├── server/
└── client/
```

## Run the server
1. Open a terminal in `server`
2. Create a `.env` file with at least `MONGO_URI` and `JWT_SECRET` if desired.
3. Install and run:

```bash
cd server
npm install
npm run seed   # seed demo foods
npm run dev    # runs nodemon on src/index.js
```

Server will be available at http://localhost:5000 and API at `/api`.

## Run the client
1. Open a terminal in `client`

```bash
cd client
npm install
npm run dev
```

Client defaults to http://localhost:3000 and expects the API at http://localhost:5000/api. You can set `VITE_API_BASE` if needed.

## Demo voucher and fees
- Voucher code: `SAVE23` (23% off)
- VAT: 5%
- Platform fee: Tk 40

## Notes
- This is a compact starter. For production, add validations, better error handling, environment management, HTTPS, CORS restrictions, tests, and real payment gateway integration.
- Want admin CRUD, docker-compose, or payment wiring? I can add it.
