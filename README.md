# Mechatroniclk

A full-stack e-commerce platform with a customer storefront, an admin dashboard, and a Node.js API backend.

## Overview

This repository is organized as a multi-app workspace:

- `frontend/`: Customer-facing React app (shopping, checkout, service pages, customer chat)
- `admin/`: Admin React app (product/order management, admin chat)
- `backend/`: Express API (auth, products, cart, orders, chat, file upload, email)

The project uses MongoDB for core business data and Supabase (PostgreSQL) for chat data.

## Tech Stack

- Frontend/Admin: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Core Database: MongoDB + Mongoose
- Chat Database: Supabase (PostgreSQL)
- Media Uploads: Cloudinary
- Email: Nodemailer (SMTP)
- Auth: JWT

## Repository Structure

```text
Mechatroniclk/
  admin/                 # Admin dashboard (Vite + React)
  backend/               # Express API server
    config/
    controllers/
    middleware/
    migrations/          # Supabase chat SQL migrations
    models/
    routes/
  frontend/              # Customer storefront (Vite + React)
  SETUP_CHECKLIST.sh
  package.json
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Supabase project (for chat)
- Cloudinary account
- SMTP credentials (for order emails)

## Environment Variables

Create environment files in each app as described below.

### 1) Backend (`backend/.env`)

```env
PORT=4000

# Auth
JWT_SECRET=replace_with_strong_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_admin_password

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster-url

# Supabase (server-side)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary (general product/media use)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

# Cloudinary (chat uploads)
CLOUDINARY_CHAT_NAME=your_cloudinary_name
CLOUDINARY_CHAT_API_KEY=your_cloudinary_api_key
CLOUDINARY_CHAT_SECRET_KEY=your_cloudinary_api_secret
CLOUDINARY_CHAT_UPLOAD_PRESET=mechatroniclk_chat

# SMTP (order confirmation emails)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=orders@your-domain.com
LOGO_URL=https://your-logo-url
```

### 2) Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

### 3) Admin (`admin/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

## Installation

Install dependencies in each app directory:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

## Run Locally

Start each service in a separate terminal.

### 1) Backend

```bash
cd backend
npm run server
```

Server runs on `http://localhost:4000` by default.

### 2) Frontend (Customer app)

```bash
cd frontend
npm run dev
```

### 3) Admin Dashboard

```bash
cd admin
npm run dev
```

## Available Scripts

### Backend

- `npm start`: Start server with Node
- `npm run server`: Start server with Nodemon

### Frontend/Admin

- `npm run dev`: Start Vite dev server
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Chat Setup (Supabase)

Run the SQL migrations from `backend/migrations/` in your Supabase SQL Editor in order:

1. `001_create_chat_schema.sql`
2. `002_fix_chat_rls_for_realtime.sql`
3. `003_add_chat_performance_indexes.sql`

These create chat tables, adjust realtime/RLS behavior, and add performance indexes for message sync and unread counters.

## Core API Areas

The backend exposes APIs under:

- `/api/user`
- `/api/product`
- `/api/cart`
- `/api/order`
- `/api/chat`

Health check root endpoint:

- `GET /` -> `API Working`

## Deployment Notes

- `frontend/`, `admin/`, and `backend/` each include `vercel.json` for independent deployment.
- Ensure each deployed app has its own environment variables configured.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only (never expose in frontend/admin env files).

## Troubleshooting

- Backend fails on startup: check `backend/.env` values for MongoDB, JWT, and Supabase keys.
- Chat not loading: confirm Supabase migrations were run and `VITE_SUPABASE_*` values are correct.
- Upload issues: verify Cloudinary chat upload preset and `CLOUDINARY_CHAT_*` env values.
- Admin auth failing: confirm `ADMIN_EMAIL` and `ADMIN_PASSWORD` in backend env match login.

## Security Recommendations

- Use strong, unique values for `JWT_SECRET` and admin credentials.
- Rotate service keys periodically.
- Do not commit `.env` files.
- Restrict CORS origins for production deployments.
