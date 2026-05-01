# Cinematic Wedding Website

A luxury European wedding website inspired by cinematic scroll transitions:
large editorial typography, pinned image-led scenes, smooth movement and an
admin-friendly content workflow.

## Stack

- Next.js App Router, TypeScript and Tailwind CSS
- Three.js, React Three Fiber and Drei for the WebGL scene layer
- GSAP ScrollTrigger and Lenis for scroll-driven camera/content transitions
- Custom admin at `/admin` for image/content management
- Prisma with Supabase Postgres for content and RSVP submissions
- Supabase Storage for uploaded wedding media

## Getting Started

Copy `.env.example` to `.env.local` and add Prisma/Supabase credentials when
ready. The site runs with polished fallback content before the database is
configured.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to manage
content after setting `ADMIN_PASSWORD`.

## Admin Content

The admin can edit the website theme mode, hero, story, portraits, venue,
schedule, gallery, travel notes, RSVP deadline and registry note. It can also
upload images to Supabase Storage and view RSVP submissions.

## Database Setup

Use Supabase Postgres through Prisma. Runtime uses the pooled connection string;
schema push uses the direct connection string:

```env
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...:5432/postgres
```

Then create/update the database schema:

```bash
npm run prisma:generate
npm run db:push
```

## Supabase Storage

Use the Supabase Storage values in `.env.local`:

```env
ADMIN_PASSWORD=choose_a_password
DATABASE_URL=your_pooled_database_url
DIRECT_URL=your_direct_database_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_STORAGE_BUCKET=wedding-media
```

Create a public Supabase Storage bucket named `wedding-media`, or change
`SUPABASE_STORAGE_BUCKET` to match your bucket. With the publishable key, make
sure the bucket policies allow image uploads and public reads.

## Vercel Deployment

This project is ready for Vercel. The Vercel build command is configured in
`vercel.json` and runs `prisma generate` before `next build`.

Add these Environment Variables in Vercel:

```env
ADMIN_PASSWORD=choose_a_password
DATABASE_URL=your_supabase_pooled_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_STORAGE_BUCKET=wedding-media
```

`DIRECT_URL` is only needed locally or in a trusted CI job when running
`npm run db:push`. Do not use direct database connections for normal Vercel
runtime traffic.

## Production Checklist

- Configure Vercel environment variables for Prisma, Supabase Storage and admin password.
- Replace fallback copy and imagery from `/admin`.
- Update `metadataBase` in `src/app/layout.tsx` to the production domain.
- Deploy the Next.js app to Vercel and keep Supabase hosted on Supabase Cloud.
