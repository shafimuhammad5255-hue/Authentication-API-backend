# Authentication API

A Node.js/Express API that stores users in MongoDB, hashes passwords with
bcrypt, and returns a JWT after registration or login.

## Setup

1. Install Node.js 18+ and run `npm install`.
2. Ensure MongoDB is running.
3. Set `MONGODB_URI`, `JWT_SECRET` (a random value of at least 32 characters),
   and optionally `PORT` and `JWT_EXPIRES_IN` in `.env`.
4. Start with `npm run dev` or `npm start`.

The local `.env` file is ignored by Git. `.env.example` documents the required
settings; replace the placeholder JWT secret before starting the API.

## Endpoints

### `POST /api/auth/register`

Request:

```json
{ "email": "person@example.com", "password": "a-strong-password" }
```

Creates an account and returns `201` with a user object and JWT. Passwords must
be 8–128 characters.

### `POST /api/auth/login`

Accepts the same JSON fields and returns the user object and JWT when the
credentials match. Invalid credentials return `401`.

### `GET /api/health`

Returns `{ "status": "ok" }` when the API process is running.
