# ISKCON Vizag Client

Frontend application for the ISKCON Vizag crowdfunding platform. This app powers the public fundraising website, campaigner pages, donor payment flow, and the protected admin/devotee dashboard used to manage campaigns, campaigners, sevas, devotees, and donations.

## What This App Does

- Shows the public home page for the temple fundraising campaign
- Renders campaigner-specific donation pages using slug-based routes
- Lets donors contribute through the Razorpay-backed payment flow
- Displays thank-you and payment error pages after checkout
- Supports public campaigner registration
- Provides a protected admin/devotee dashboard
- Lets admins manage campaigns, campaigners, sevas, devotees, and donor records
- Fetches all application data from the `iskcon-vizag-server` API

## Tech Stack

- React 19
- Vite 7
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS 4
- shadcn-based UI components
- Recharts for dashboard charts
- Lucide React icons

## Repository Context

This repository contains two main applications:

- `iskcon-vizag-client/iskcon-vizag`: this frontend
- `iskcon-vizag-server`: the backend API

The client expects the backend API to be available at:

```env
VITE_APP_BASE_URL=http://localhost:2345/api
```

## Project Structure

```text
iskcon-vizag-client/iskcon-vizag/
├── src/
│   ├── api/                # Axios instance and interceptors
│   ├── assets/             # Static images and logos
│   ├── components/         # Public, admin, and shared UI components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   ├── pages/              # Route-level pages
│   ├── routes/             # Route definitions and protected route wrapper
│   ├── store/              # Redux store, reducers, async services
│   ├── utils/              # Toasts, payment utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── api/                    # Vercel edge/serverless helpers
├── vercel.json
├── vite.config.js
└── .env.example
```

## Main User Flows

### Public Website

- `/` shows the fundraising home page
- `/:slug` shows a campaigner-specific donation page
- `/campaigner/register` allows a new campaigner to register
- `/thankyou/:id` shows the post-payment thank-you flow
- `/payment-error` shows checkout failure feedback
- `/contact` renders the contact page

### Admin and Devotee Dashboard

- `/admin/login` authenticates users
- `/auth/reset-password` forces password update on first login when needed
- `/admin/dashboard` shows summary cards, trends, and top campaigners
- Admin routes let users manage campaigns, campaigners, devotees, sevas, and donors

Protected dashboard routes are wrapped with `ProtectedRoute`, which checks for a token in `sessionStorage`.

## Route Map

The current route setup is defined in [src/routes/AllRoutes.jsx].

Public routes:

- `/`
- `/:slug`
- `/contact`
- `/campaigner/register`
- `/thankyou/:id`
- `/payment-error`
- `/admin/login`
- `/auth/reset-password`

Protected routes:

- `/admin/dashboard`
- `/admin/create-campaign`
- `/admin/campaign/:id/edit`
- `/admin/campaigns`
- `/admin/create-campaigner`
- `/admin/campaigners`
- `/admin/campaigner/edit/:campaignerId`
- `/admin/campaigner/registrations`
- `/admin/add-seva`
- `/admin/seva-list`
- `/admin/seva/:id/:sevaname/edit`
- `/admin/funders`
- `/admin/add-devotee`
- `/admin/devotees`
- `/admin/devotee/:id/edit`

## State Management

Redux Toolkit is used for app state and async API calls.

Store slices currently include:

- `campaign`
- `campaginer`
- `seva`
- `donation`
- `auth`
- `devote`

Async work is organized in service files under `src/store/**/**.service.js`.

Major frontend data modules:

- `campaign.service.js`: active campaign, campaign list, campaign CRUD
- `campaigners.service.js`: campaigner list/details, top donors, latest donors, media, public registration
- `donations.service.js`: donor list and donor detail
- `auth.service.js`: login, current user details, password reset
- `devote.service.js`: devotee CRUD
- `seva.service.js`: seva CRUD

## API Integration

The shared Axios client lives in [src/api/api.js].

Key behavior:

- Uses `VITE_APP_BASE_URL` as the base URL
- Sends JSON by default
- Automatically attaches `Authorization: Bearer <token>` from `sessionStorage`
- Skips auth when `config.skipAuth` is passed
- Redirects to `/admin/login` on `401` responses
- Shows toast feedback for network/auth issues

## Payment Flow

The frontend donation flow works together with the backend payment endpoints.

High-level flow:

1. Donor opens a campaigner page at `/:slug`
2. Donor enters donation details in the donation UI
3. Client requests a donation order from the backend
4. Backend returns Razorpay order details
5. Donor completes checkout
6. Client sends payment verification data to the backend
7. Backend finalizes the donation and the client redirects to success/error screens

The payment helper logic is organized in [src/utils/payment.js].

## UI and Styling

This project uses:

- Tailwind CSS 4
- shadcn-style component primitives under `src/components/ui`
- Custom design tokens and theme variables in `src/index.css`
- Recharts for dashboard visualizations

Notable UI areas:

- `src/components/Campaigners`: public donation page sections and campaign storytelling
- `src/components/Home`: homepage sections
- `src/components/ui`: reusable primitives
- `src/components/app-sidebar.jsx`: dashboard sidebar shell

## Environment Variables

Copy `.env.example` to `.env` and update the API URL as needed.

```env
VITE_APP_BASE_URL=http://localhost:2345/api
```

### Variable Notes

- `VITE_APP_BASE_URL`: backend API base URL, typically the local Node server or deployed API

## Installation

```bash
cd iskcon-vizag-client/iskcon-vizag
npm install
cp .env.example .env
```

Then start the app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Local Development Setup

1. Start the backend from `iskcon-vizag-server`
2. Make sure the backend is running at `http://localhost:2345`
3. Set `VITE_APP_BASE_URL=http://localhost:2345/api`
4. Run `npm run dev` in this client app
5. Open the Vite dev URL in the browser

## Admin Authentication Behavior

Login state is stored in `sessionStorage`.

- Successful login stores the JWT token
- Protected routes check token presence
- `401` API responses clear the token and redirect to `/admin/login`
- If the backend reports `isPasswordChanged: false`, users are sent to `/auth/reset-password`

## Deployment Notes

This app includes [vercel.json] for deployment routing.

Current Vercel rewrites:

- `/:slug` rewrites to `/api/campaigner-meta?slug=:slug`
- all other paths rewrite to `/index.html`

This setup supports slug-based public campaigner pages while keeping SPA routing working in production.

## Tooling

- Vite config with `@` alias pointing to `src`
- ESLint flat config
- Tailwind CSS Vite plugin

See:

- [vite.config.js]
- [eslint.config.js]

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Known Notes

- The existing README was the default Vite template; this file replaces it with project-specific documentation.
- Route protection on the client checks token presence only; the backend remains the real source of authorization.
- Some dashboard and payment behavior depends directly on the backend being available and correctly configured.
- There are a few `.DS_Store` files in `src`, which are harmless but can be cleaned up later if desired.

