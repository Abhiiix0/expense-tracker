# Expense Tracker

A simple expense tracker app, built mainly to learn backend development.

## What this is

Track expenses, log in with email/password or Google, reset a forgotten password — nothing fancy, just enough to practice building a real API.

## Read More

- **Frontend** (Next.js + Tailwind): ~80% AI-generated. It's just a UI to click through and test the API against — not the point of this project.
- **Backend** (Express + MongoDB): hand-written for learning — JWT auth, Google OAuth, forgot-password email flow, and the expense CRUD API. See `backend/routes`, `backend/controller`, and `backend/model` for the actual logic.

## Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Google OAuth, bcrypt, Resend

## Environment variables

**`backend/.env`**

| Variable | What it's for |
|---|---|
| `MONGODB` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Google OAuth redirect URL |
| `RESEND_KEY` | API key for Resend (forgot-password emails) |
| `FRONTEND_URL` | Frontend origin, used for CORS / redirects |
| `NODE_ENV` | `development` or `production` |

**`frontend/.env`**

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | URL of the backend API |

## Running locally

```bash
# backend
cd backend
npm install
npm run dev

# frontend
cd frontend
npm install
npm run dev
```
