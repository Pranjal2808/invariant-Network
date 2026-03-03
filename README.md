# Invariant Network - Recruitment Web Application

Invariant Network is a recruitment platform focused on quantitative finance, quantitative development, model risk, and financial analytics roles.

This project is now implemented as a Node.js + Express + SQLite application with server-rendered pages (EJS) and minimal frontend styling.

## Tech Stack

- Node.js (Express)
- SQLite (`sqlite3`)
- EJS templates
- Vanilla HTML/CSS/JavaScript
- Multer for resume upload
- OpenAI API integration for application scoring

## Project Structure

```
.
├── data/
├── models/
├── public/
├── routes/
├── services/
├── views/
├── server.js
├── package.json
└── .env.example
```

## Core Features

- Homepage (`/`)
- Candidate registration with resume upload
- Employer mandate form (creates jobs)
- Jobs listing page (`/jobs`)
- Job detail page (`/jobs/:id`)
- Application flow with candidate-job linking
- Admin panel (`/admin`) with password login
- Add jobs from admin
- View applications per job
- Export applications CSV
- AI scoring and summaries on new applications

## Database Schema

### `candidates`
- `id`
- `name`
- `email` (unique)
- `phone`
- `years_of_experience`
- `skills`
- `resume_path`
- `created_at`

### `jobs`
- `id`
- `title`
- `company`
- `location`
- `description`
- `created_at`

### `applications`
- `id`
- `candidate_id`
- `job_id`
- `ai_score`
- `ai_summary`
- `created_at`

## Local Setup

1. Install Node.js 18+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment file:
   ```bash
   cp .env.example .env
   ```
4. Set secure values for `SESSION_SECRET` and `ADMIN_PASSWORD`.
5. Start the app:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
6. Open `http://localhost:3000`.

On first run, SQLite tables are auto-created and seed jobs are inserted if the `jobs` table is empty.

## Environment Variables

See `.env.example`.

Important:
- `OPENAI_API_KEY` is required for AI scoring.
- If `OPENAI_API_KEY` is missing, applications are still saved and AI fields remain empty.

## Admin Access

- Visit `/admin/login`
- Login with `ADMIN_PASSWORD`
- Manage jobs and export job applications as CSV

## Deployment (Static-First to Server App Migration)

This project now needs a Node.js runtime and cannot be hosted as GitHub Pages-only static HTML.

Recommended deployment targets:
- Render
- Railway
- Fly.io
- Any VPS with Node.js

### Basic deployment steps

1. Push repository to your Git provider.
2. Create a new web service using:
   - Build command: `npm install`
   - Start command: `npm start`
3. Configure environment variables from `.env.example`.
4. Persist the `/data` directory or provide a mounted volume for SQLite durability.
5. (Optional) Persist `/uploads` directory to keep resumes across redeploys.

## Notes

- Current implementation uses in-process session storage (`express-session` default store), which is acceptable for early-stage development.
- For production scale, replace session storage and add stronger file-type scanning for uploaded resumes.
