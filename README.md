# عَرَبِيَّتِي — Arabic Conversation Platform

A full-stack starter application for learning spoken Arabic through curated vocabulary and structured conversations. Built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase PostgreSQL/Auth. Ready to connect to GitHub and deploy on Vercel.

## Features

- Vocabulary library with Arabic text, transliteration, Indonesian meanings, topic filters, and grammar metadata.
- Conversation builder that creates a topic-based dialogue from selected vocabulary using controlled templates (no paid AI API required).
- Browser text-to-speech playback for Arabic lines when the user's browser/device provides an Arabic voice.
- Short vocabulary quiz and local learning-progress dashboard.
- Supabase-ready login and staff/admin vocabulary management.
- Public learning content can run in demo mode from bundled seed data before Supabase is configured.
- SQL schema, row-level security (RLS), profile creation trigger, and seed content included.

## Requirements

- Node.js 20.9+ recommended
- npm
- A Supabase project for persistent data and authentication (optional for the demo mode)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. If the Supabase environment variables are blank, public pages use the bundled demo vocabulary. Login and database-backed admin features require Supabase configuration.

## Configure Supabase

1. Create a project at https://supabase.com.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the entire `supabase/schema.sql` file.
4. Copy the project URL and anon/publishable key from **Project Settings → API** into `.env.local` and the Vercel environment variables.
5. In Supabase **Authentication → URL Configuration**, set the Site URL to your local URL while testing, then update it to your deployed Vercel URL. Add both local and production URLs to the redirect URL allow-list if needed.
6. Create a user through `/login` or Supabase Auth. New users are assigned the `student` role.
7. To grant a teacher/admin access, run this SQL using the email address of the account you created:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'your-email@example.com');
```

Use a real account email and keep admin promotion restricted to a trusted project owner. Do not expose the Supabase service-role key in browser code.

## Deploy to GitHub and Vercel

1. Create a GitHub repository and push this project.
2. In Vercel, select **Add New → Project** and import the repository.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables.
4. Deploy. Vercel detects Next.js automatically.
5. Update the Supabase Site URL and redirect allow-list to your Vercel production domain.

## Important notes

- The initial seed content is sample learning material. Have an Arabic teacher review spelling, harakat, grammar, and translations before using it as formal curriculum.
- Audio uses the browser's Speech Synthesis API. The exact Arabic voice and quality depend on the operating system/browser. For consistent pronunciation, replace this with verified recorded audio files and set `audio_url` on vocabulary records.
- Demo mode does not persist admin changes. Configure Supabase for shared, persistent content and progress.
- The included conversation generator is template-based. It is intentionally predictable; it is not a substitute for teacher review or an unrestricted AI conversation partner.

## Main routes

- `/` — learning dashboard
- `/mufrodat` — vocabulary library
- `/conversation` — conversation builder
- `/practice` — vocabulary quiz
- `/progress` — learning progress
- `/login` — Supabase authentication
- `/admin` — teacher/admin vocabulary management
- `/api/topics`, `/api/vocabulary`, `/api/dialogues/generate`, `/api/progress` — API endpoints
