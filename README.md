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

1. Create a Neon project and copy its pooled connection string.
2. Run the SQL in `db/schema.sql` in the Neon SQL Editor.
3. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to the connection string.
4. Restart the development server.
5. Add the same `DATABASE_URL` in the Vercel project settings for Production, Preview, and Development as appropriate.

The API validates guestbook input and only accepts HTTP(S) destinations for short links. If the database is not configured, these tools return a clear setup error rather than pretending a write succeeded.

This workspace is linked to the Neon project `cold-water-35403392` on its `production` branch using the Neon CLI. Local link metadata (`.neon`) and credentials (`.env.local`) are ignored by Git. The required application tables have been created from `db/schema.sql`.

`neon.ts` currently declares an empty Neon service policy. Running `neon deploy` applies or checks that Neon policy; it does not create or migrate application tables. Apply future schema changes separately through the Neon SQL Editor or a database migration tool.

## GitHub data

`/api/github` reads public repositories for `adigson` through the GitHub REST API. Repository and primary-language data is cached for 15 minutes. The language chart counts each non-fork repository's primary language; it is not a byte-level language breakdown. Unauthenticated GitHub API rate limits apply.

## Deploy to Vercel

Import this repository into Vercel, set `DATABASE_URL` if using the database-backed features, and deploy. Vercel detects the Next.js app automatically. Update the canonical domain in `app/layout.tsx` if the production URL differs from `adigson.vercel.app`.

## Personal details

- Contact, skills, experience, education, certifications, and featured project details are maintained in `lib/profile.ts`.
- The supplied resume was an image snapshot, so the portfolio includes a separately typeset, print-ready version based on the readable details in that image. Review dates and contact details before publishing.
- The LinkedIn URL is set to `https://www.linkedin.com/in/musibau-bolaji/`.
- The URL shortener is identified as a forked learning project.
