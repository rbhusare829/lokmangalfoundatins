# Lokmangal Foundation Website

The website for **Lokmangal Foundation** (लोकमंगल फाउंडेशन), a registered
charitable trust in Solapur, Maharashtra. Fully bilingual (English/Marathi),
with a content-managed backend so the foundation's staff can update gallery
photos, testimonials, team members, projects, events, blog posts — and now
almost all of the site's page text — without touching code.

## Tech Stack

**Frontend** (`frontend/`)
- React 19 + Vite
- Tailwind CSS v4 (CSS-first `@theme`, see `src/index.css` for the brand
  palette and fonts)
- React Router v7 (client-side routing, bilingual URL scheme)
- React Hook Form (contact form, admin content forms)
- Axios (API client)
- `motion` (animations — hero slider, mobile menu, Gallery filter/lightbox)
- `lucide-react` (icons)
- `react-helmet-async` (per-page `<title>`/meta tags)

**Backend** (`backend/`)
- Node.js (ESM) + Express 4
- Sequelize 6 — SQLite for local development (zero setup), MySQL
  (`mysql2`) for production
- JWT (`jsonwebtoken`) + `bcrypt` for admin authentication, via an
  httpOnly cookie
- `multer` for image/PDF uploads (local disk by default, or S3 via
  `multer-s3`/`@aws-sdk/client-s3` when `STORAGE_DRIVER=s3` — see
  [Switching to S3](#switching-to-s3))
- `express-validator` for request validation
- `express-rate-limit` — login throttling plus a generous backstop limiter
  across all of `/api/*`
- `helmet` (with an explicit `frame-src` allowance for embedded YouTube
  videos on project pages) + `cors` + `cookie-parser`
- `node-cron`, `nodemailer` — installed for future use (not currently
  wired to a feature)

## Project Structure

```
lokfoundwebsite/
  frontend/
    public/                # favicon and other static passthrough files
    src/
      assets/images/       # all site imagery, PDFs (award documents)
      components/
        layout/            # Navbar, Footer, Layout, SocialIcons
        ui/                # SectionTitle, PageBanner, loading/error states
      pages/                # one component per public route
      admin/                # admin panel: auth, layout, CRUD screens,
                             # ContentManager + DynamicFieldEditor (site
                             # text CMS)
      i18n/                 # en.js / mr.js — static bilingual copy that
                             # still doubles as the fallback when a Site
                             # Content key hasn't been edited yet
      lib/                  # LanguageContext, SiteContentContext, axios
                             # instance, small hooks
      App.jsx                # route definitions
      main.jsx                # entry point
      index.css                # Tailwind v4 theme tokens (brand colors, fonts)
    vite.config.js              # dev proxy: /api and /uploads -> :4000

  backend/
    src/
      config/database.js    # Sequelize instance (dialect from env)
      models/                # AdminUser, GalleryImage, Testimonial,
                              # TeamMember, Project, Event, Blog,
                              # PageContent (the Site Content CMS store)
      routes/                # auth.js + one file per content type
                              # (crudFactory.js provides the shared
                              # list/create/update/delete logic; content.js
                              # is the CMS's own get/put-by-key route)
      middleware/             # JWT auth guard, multer upload config,
                               # login + API-wide rate limiters
      seed.js                  # populates the database with the site's
                                # real content (not placeholder data)
      seedContent.js            # populates the Site Content CMS with the
                                 # original static text (idempotent — safe
                                 # to re-run, never overwrites admin edits)
      app.js / server.js
    uploads/                # multer's upload destination, grouped into
                             # per-section subfolders (gallery/, team/,
                             # projects/, events/, blogs/, testimonials/)
                             # and tracked in git, so a fresh clone already
                             # has the site's real photos (served at
                             # /uploads)
    data/                   # SQLite database file (gitignored)
```

## Features

- Every page in English and Marathi: Home, About (with the Volunteer and
  FAQ content as sections on the same page, plus an Our Team sub-page at
  `/about/team`), Contact, Contribute, Gallery,
  Projects (listing + 4 core detail pages, plus any admin-created ones),
  Events, Blogs (plus a Saptahik sub-page at `/blogs/saptahik`), Privacy
  Policy.
- **Saptahik** (`/blogs/saptahik`): the foundation's weekly publication.
  Each week an admin uploads the issue as one PDF; the page shows the
  newest issues in a hero and the archive as year tabs → month chips →
  week cards ("आठवडा 2", derived from the issue date), newest first.
  Clicking an issue opens an in-page reader (pdf.js, loaded only when
  needed) with two-page spreads on wide screens, pages that follow a
  finger/mouse drag to turn, a synthesized page-turn sound (with an on/off
  toggle), zoom, download and share. The open issue is in the URL
  (`?issue=<id>`), so a single issue can be shared as a link and the phone's
  back button closes the reader.
- Gallery, Team, Projects/Events/Blogs sections are fetched live from the
  API — editing them in the admin panel updates the public site
  immediately, including the Home page previews.
- **Site Content CMS** (`/admin/content`): almost every other piece of page
  text — Home's hero slides, objectives, vision, stats, awards; About,
  Volunteer, FAQ, Contact, Contribute and Privacy Policy copy; the site's
  address/phone/email; the footer copyright line; and the page headers for
  Gallery/Events/Projects/Blogs — is editable from one admin screen, in
  both languages, without a code change. It's a generic recursive editor:
  any string becomes a text/textarea field, any list becomes an
  add/remove-able set of items, so new nested content doesn't need custom
  admin UI. Public pages fall back to the original static copy if a key
  hasn't been edited yet, so nothing can go blank.
- Gallery photo categories aren't hardcoded — admins can type a brand-new
  category when adding a photo, and the public Gallery page's filter pills
  pick it up automatically.
- Admin panel (`/admin`) — session-authenticated CRUD for all content
  types, with image/PDF upload, plus the Site Content CMS above.
- A catch-all route resolves project and blog pages created through the
  admin panel (their slugs aren't known at build time) and shows a proper
  404 for anything else, in the visitor's language.
- Responsive down to ~360px; verified with zero console errors and no
  horizontal overflow across every page at mobile and desktop widths.

## Prerequisites

- Node.js 20+ (developed against v24)
- npm
- No database server required for local development — SQLite is used
  automatically. See [Switching to MySQL](#switching-to-mysql) for
  production.

## Getting Started

Clone the repo, then set up the backend and frontend (two separate
projects, each with its own `package.json`).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed          # creates the SQLite DB and fills it with the real site content
npm run seed:content  # populates the Site Content CMS (safe to re-run; never overwrites edits)
npm run dev            # starts the API on http://localhost:4000
```

`npm run seed` also creates the admin login using `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` from `.env` (defaults are placeholders — change
them in `.env` before seeding a real deployment). Re-running `seed`
wipes and recreates all tables, so only run it once per environment
(or when you deliberately want to reset to the seed content) — if you do,
run `npm run seed:content` again afterwards too.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev     # starts Vite on http://localhost:5173
```

Vite proxies `/api/*` and `/uploads/*` to the backend on `:4000` (see
`vite.config.js`), so the frontend dev server is the one URL you need:
**http://localhost:5173**.

### 3. Log in to the admin panel

Visit **http://localhost:5173/admin/login** and sign in with the
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set before seeding.

## Environment Variables

All in `backend/.env` (see `backend/.env.example`); none are needed on
the frontend since it only ever talks to `/api` (proxied in dev, same
origin in production).

| Variable | Purpose |
|---|---|
| `PORT` | API port (default `4000`) |
| `NODE_ENV` | `development` or `production` — controls the secure-cookie flag and whether Express serves the built frontend |
| `DB_DIALECT` | `sqlite` (default, local dev) or `mysql` (production) |
| `DB_STORAGE` | SQLite file path, used only when `DB_DIALECT=sqlite` |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | MySQL connection, used only when `DB_DIALECT=mysql` |
| `JWT_SECRET` | Signing secret for admin session tokens — **must** be changed to a long random string for any real deployment; the server refuses to start without it |
| `JWT_EXPIRES_IN` | Admin session lifetime (default `7d`) |
| `CORS_ORIGIN` | Allowed origin for API requests (the frontend dev server URL) |
| `TRUST_PROXY` | Set to `1` **only** when running behind a real reverse proxy (e.g. Nginx) that sets `X-Forwarded-For` itself — enabling it without one lets clients spoof their IP and dodge rate limiting. Leave unset otherwise. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Admin login created by `npm run seed` |
| `STORAGE_DRIVER` | `local` (default) saves uploads to `backend/uploads/` — zero setup, but files don't survive a redeploy or multi-instance hosting. Set to `s3` for production. |
| `AWS_REGION` / `AWS_S3_BUCKET` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 bucket and credentials, used only when `STORAGE_DRIVER=s3` |

## Admin Panel

`/admin` — dashboard with content management screens:

| Section | Manages |
|---|---|
| Site Content | Almost all other page text (Home, About, Volunteer, FAQ, Contact, Contribute, Privacy Policy, site address/phone/email, footer, and Gallery/Events/Projects/Blogs page headers), in English and Marathi |
| Gallery | Photos shown on the Gallery page, in a photo-grid editor; tagged by category (type an existing one or a brand-new one) |
| Testimonials | Supporter quotes shown on the Home page |
| Team | Office bearers and members shown on the About > Our Team page (`/about/team`), grouped by the "Group" field; the photo is a 4:5 portrait card shown uncropped |
| Projects | Core initiatives — title, summary, full bilingual article (Objective / Why & How), stat badge, video, cover image; slug-based, so any number can be added beyond the original four |
| Events | Past events and awards, with an optional PDF attachment |
| Blogs | Blog posts — title, excerpt, full content, date, cover image; each gets its own public page at its slug |
| Saptahik (Weekly PDF) | Weekly issues shown on Blogs > Saptahik. A bulk uploader takes one or many PDFs at once (up to 50 MB each); only the issue date is required, and it's read from the file name when possible (`2025-01-05`, `05-01-2025`, `20250105`, `5 Jan 2025`, `५ जानेवारी २०२५`, …), with a button to fill missing dates a week apart. Each PDF's first page becomes its cover, and uploads show per-file and overall progress. Issue number and titles are optional |

Every field has separate English and Marathi inputs where the site
shows bilingual content. Uploaded files are stored in
`backend/uploads/<section>/` (grouped by content type) and served at
`/uploads/<section>/<filename>`; deleting or replacing a record's
image cleans up the old file automatically, and a failed submission
(e.g. a duplicate slug) cleans up the file it just uploaded rather than
leaving it orphaned. Server-side validation errors (duplicate slug,
missing required image, expired session, etc.) are shown directly in the
admin form instead of failing silently.

## Available Scripts

**Backend** (`backend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start the API with nodemon (auto-restart on change) |
| `npm start` | Start the API without nodemon (production) |
| `npm run seed` | Reset the database and populate it with real site content |
| `npm run seed:content` | Populate the Site Content CMS from the original static text (idempotent — only fills in missing keys, never overwrites an admin's edits) |
| `npm run seed:23` | Sync all 23 initiatives with exact Marathi text, statistics, objectives, descriptions, videos, and images into the database |
| `npm run migrate:mysql` | Migrate existing data from SQLite to MySQL database |
| `npm run migrate:s3` | One-time: upload everything in `backend/uploads/` to S3 and repoint existing DB records at it (see [Switching to S3](#switching-to-s3)) |

**Frontend** (`frontend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `frontend/dist/` |
| `npm run preview` | Preview the production build (note: this does **not** proxy `/api`; use the full production setup below to test the built frontend against the real API) |

## API Overview

All routes are prefixed `/api`. `GET` endpoints are public; write
endpoints require an authenticated admin session (httpOnly cookie).
Unmatched `/api/*` routes return a JSON `404` rather than falling through
to Express's default HTML error page.

- `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `GET /gallery`, `GET /testimonials`, `GET /team`, `GET /projects`, `GET /events`, `GET /blogs`, `GET /saptahik`
- Each of those also accepts `POST /`, `PUT /:id`, and `DELETE /:id` on
  the same path (e.g. `PUT /projects/3`) — these require an
  authenticated admin session
- `GET /content` returns every Site Content key as `{ [key]: { en, mr } }`;
  `GET /content/:key` returns one key's `{ en, mr }` pair; `PUT
  /content/:key` (admin only) replaces both language versions of a key

## Database & 23 Social Initiatives

The application supports both **SQLite** (local default) and **MySQL** (production/active):

1. **MySQL Configuration:**
   In `backend/.env`, set:
   ```env
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=lokmangal_db
   DB_USER=root
   DB_PASSWORD=your_password
   ```
2. **SQLite to MySQL Migration:**
   ```bash
   cd backend
   npm run migrate:mysql
   ```
3. **23 Initiatives Sync:**
   To populate or refresh all 23 initiatives with authentic Marathi titles, full descriptions, YouTube video embeds, and impact statistics:
   ```bash
   npm run seed:23
   ```

## Key Public Pages & Features

- **About Page (`/about` & `/mr/about`):**
  - Official foundation story (२००५ स्थापना, संस्थापक मा. सुभाष बापू देशमुख).
  - Minimal glassmorphism Objectives & Vision section with smooth 7-second auto-transitions and hover pause.
  - Callout link to explore all 23 social initiatives.
  - Participation, 80G tax deduction appeal, a teaser linking to Our Team, and FAQs.

- **Our Team (`/about/team` & `/mr/about/team`):**
  - Sub-page of About (reachable from the About dropdown in the navbar, the footer, and the About page teaser).
  - Office Bearers in larger cards, then Members; click a card for a full-size view (arrow keys / Esc).
  - Page text is editable under Site Content > Team Page; the people themselves under Admin > Team.

- **Projects Page (`/projects` & `/mr/projects`):**
  - **Movement Hero:** "ग्रामीण विकासातून सामाजिक परिवर्तनाची चळवळ" with modern 3-card Bento story layout and quick impact metrics.
  - **4 Featured Impact Cards (New Look):**
    1. सामुदायिक विवाह सोहळा (३,२२१+ जोडपी विवाहबद्ध)
    2. अन्नपूर्णा योजना (१७.३ लाख+ टिफिन वितरित)
    3. जलसंधारण | जल हेच जीवन (१०० कोटी लिटर साठा)
    4. लोटस | उज्ज्वल भविष्याची पहिली पायरी (₹९० लाख+ मदत)
  - **23 Initiatives Explorer:** Live category filters (अन्न, जल, शिक्षण, आरोग्य, सामाजिक कल्याण, महिला व रोजगार, संस्कृती) and real-time search.

- **Project Detail Page (`/projects/:slug` & `/mr/projects/:slug`):**
  - Full project mission and objectives.
  - High-resolution cover photo and related photo gallery.
  - Dedicated 16:9 embedded YouTube video showcase player.
  - Seamless bilingual routing for both Marathi and English.

## Switching to S3

Uploads are saved to `backend/uploads/` by default. For a real deployment
(especially one with more than one app instance, or where redeploys wipe
local disk), switch to S3:

1. Create an S3 bucket and an IAM user/key with read/write access to it.
2. In `backend/.env`, set:
   ```
   STORAGE_DRIVER=s3
   AWS_REGION=<region>
   AWS_S3_BUCKET=<bucket>
   AWS_ACCESS_KEY_ID=<key>
   AWS_SECRET_ACCESS_KEY=<secret>
   ```
3. If you already have files in `backend/uploads/` from before the switch,
   run `npm run migrate:s3` once — it walks the section subfolders
   (`gallery/`, `team/`, `projects/`, `events/`, `blogs/`, `testimonials/`),
   uploads everything to the bucket under those same prefixes so the bucket
   stays organized the same way, and repoints every existing DB record
   (`Project.coverImageUrl`, `GalleryImage.imageUrl`, `TeamMember.photoUrl`,
   `Testimonial.photoUrl`, `Event.imageUrl`/`documentUrl`, `Blog.imageUrl`)
   at its new S3 URL. Run this before making any new uploads through the
   admin UI.

New uploads made through the admin panel go straight to S3 once
`STORAGE_DRIVER=s3` is set — no further code changes needed.

## Building for Production

Express is set up to serve the built frontend and the API from a
single origin (no CORS, and admin session cookies work without any
extra configuration):

```bash
cd frontend && npm run build      # outputs frontend/dist/
cd ../backend
NODE_ENV=production npm start     # serves the built frontend + /api together
```

If the app sits behind a reverse proxy (Nginx, a load balancer, etc.),
also set `TRUST_PROXY=1` in `backend/.env` — see
[Environment Variables](#environment-variables).

## License

Private — property of Lokmangal Foundation.
