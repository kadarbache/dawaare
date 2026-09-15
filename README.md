# Dawaare

Point-of-sale and inventory management for a retail shop. Staff ring up sales at
a terminal, track stock and customers, record debt and repayments, and review
takings on a dashboard.

## Stack

- **Next.js 16** (App Router, React 19, React Compiler) with TypeScript
- **Prisma 7** against PostgreSQL, connected through the Neon serverless adapter
- **better-auth** for email/password sessions, with roles and email verification
- **Tailwind CSS v4** with shadcn/ui and Radix primitives
- **Cloudinary** for product and profile images, **Resend** for transactional email
- **pnpm** as the package manager

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in the values
pnpm prisma migrate dev
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

`.env.example` lists every variable; copy it to `.env` and fill it in.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled PostgreSQL connection string (Neon), used by the app at runtime |
| `DIRECT_URL` | Direct, non-pooled connection used by the Prisma CLI for migrations |
| `NEXT_PUBLIC_APP_URL` | Base URL the auth client calls, e.g. `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Signs better-auth sessions. Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Same origin as `NEXT_PUBLIC_APP_URL` |
| `RESEND_API_KEY` | Sends verification emails |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary account |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary account |
| `CLOUDINARY_API_SECRET` | Cloudinary account — server only |
| `SETUP_SECRET` | Gates the one-time admin bootstrap route. Development only — never set this in a deployed environment. |

### Creating the first admin

There is no public sign-up. With `SETUP_SECRET` set and the dev server running,
visit `/api/setup?secret=<your secret>` to create the first `ADMIN` account. The
route refuses to run outside development. Every account after that is created
from **Settings → Sellers**.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Regenerates the Prisma client, then starts the dev server |
| `pnpm build` | Regenerates the Prisma client, then builds for production |
| `pnpm start` | Serves the production build |
| `pnpm lint` | Runs ESLint |
| `pnpm db:seed` | Seeds the database via `prisma/seed.ts` |

## Routes

| Path | What it does |
| --- | --- |
| `/terminal` | POS workspace — search products, build a cart, take payment |
| `/inventory` | Products, stock levels, categories |
| `/customers` | Customer records, outstanding debt, repayments |
| `/sales` | Sales history with seller attribution |
| `/dashboard` | Revenue, profit, and stock summaries |
| `/settings` | Profile, sellers, categories, currency rates |
| `/login` | Sign in |

`/` redirects to `/sales`.

## Data model

`Product` and `ItemsCategory` cover the catalogue. A `Sale` holds many
`SaleItem` rows, each recording the cost price at the time of sale so margins
stay correct when prices change later. Sales may be tied to a `Customer`, and
unpaid balances are settled through `Repayment` records. `ExchangeRate` supports
pricing in more than one currency. `User` carries a `Role` of `ADMIN` or
`SELLER`; see Roles below.

## Roles

Every signed-in user can work the terminal and reach inventory, customers, and
sales. `ADMIN` is required for the settings area — profile, sellers, categories,
and currency rates — and for deleting a sale. The guards live in
`src/lib/auth-guard.ts` (`requireSession` and `requireAdmin`) and are applied in
the server actions rather than in middleware.
