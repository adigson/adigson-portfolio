# Musibau Bolaji - Interactive Portfolio

A Next.js App Router portfolio designed as a live system dashboard, with a print-ready resume at `/resume`. The dashboard includes experience and project details, a live GitHub repository feed, and serverless API routes for the health check, guestbook, and URL shortener.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The health check and public GitHub feed work without credentials. The guestbook and shortener need a Neon Postgres database.

Open `http://localhost:3000/resume` and choose **Print / Save as PDF** to export the formatted resume.

## Enable guestbook and short links

1. The existing app uses Neon's serverless driver. Its Free plan is currently $0/month and requires no card, within its published quotas; do not upgrade to a paid plan. A local PostgreSQL server is also free, but using it with the app requires swapping the runtime driver.
2. Copy `.env.example` to `.env.local`. Set `DATABASE_URL` to the pooled connection string for the app and `DATABASE_URL_UNPOOLED` to the direct connection string for migrations.
3. Run `npm run db:migrate` to create or update the tables from the versioned SQL migrations in `db/migrations`.
4. Restart the development server.
5. Add `DATABASE_URL` to the Vercel project settings for Production, Preview, and Development as appropriate. Run migrations separately with the direct connection string before deploying schema-dependent changes.

The API validates guestbook input and only accepts HTTP(S) destinations for short links. If the database is not configured, these tools return a clear setup error rather than pretending a write succeeded.

To verify persistence, create a separate empty test database and place its direct connection string in `.env.test.local` as `TEST_DATABASE_URL`. Run `npm run db:test`. The test applies migrations to that database, inserts a temporary guestbook entry, closes its connection, verifies the entry through a new connection, and then removes it. Never point `TEST_DATABASE_URL` at a database containing data you need to keep.

`neon.ts` currently declares an empty Neon service policy. Running `neon deploy` applies or checks that Neon policy; it does not create or migrate application tables. Keep schema changes in `db/migrations` and run `npm run db:migrate` with a direct (unpooled) URL. Neon Free currently includes 1 GB of database storage per project, 100 compute-unit hours per project, and 5 GB of public network transfer per project; check [Neon's current pricing](https://neon.com/pricing) before relying on hosted limits.

## GitHub data

`/api/github` reads public repositories for `adigson` through the GitHub REST API. Repository and primary-language data is cached for 15 minutes. The language chart counts each non-fork repository's primary language; it is not a byte-level language breakdown. Unauthenticated GitHub API rate limits apply.

## Deploy to Vercel

Import this repository into Vercel, set `DATABASE_URL` if using the database-backed features, and deploy. Vercel detects the Next.js app automatically. Update the canonical domain in `app/layout.tsx` if the production URL differs from `adigson.vercel.app`.

## Personal details

- Contact, skills, experience, education, certifications, and featured project details are maintained in `lib/profile.ts`.
- The supplied resume was an image snapshot, so the portfolio includes a separately typeset, print-ready version based on the readable details in that image. Review dates and contact details before publishing.
- The LinkedIn URL is set to `https://www.linkedin.com/in/musibau-bolaji/`.
- The URL shortener is identified as a forked learning project.
