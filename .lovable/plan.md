# TSID — Tanzania Student Identification System

A faithful remake of the MbazaCodes/TSID repo on this stack (TanStack Start + Lovable Cloud / Supabase), using your TSID logo, Tanzania flag, and coat of arms as official assets.

The original is a large multi-surface app. I'll ship it in three phases so you get something usable quickly and we can iterate. Phase 1 lands in this turn; phases 2–3 are follow-ups once you confirm direction.

## Design direction

- Tanzania official palette: deep green `#1eb53a`, gold `#fcd116`, black, sky blue `#00a3dd`, plus a navy `#0b3d7a` from your TSID logo for headings/buttons.
- Typography: `Plus Jakarta Sans` body + `Sora` display (clean, governmental, modern — no purple/AI defaults).
- Header carries the TSID shield logo + "Jamhuri ya Muungano wa Tanzania" wordmark; footer carries the Coat of Arms with "Uhuru na Umoja". Flag stripe accent across the top of every page.
- Card-driven dashboards, ID card rendered as a real plastic-card mock (front/back).

## Phase 1 — Foundation (this turn)

1. Enable Lovable Cloud.
2. Upload the 3 attached images as Lovable Assets (`tsid-logo`, `tz-flag`, `tz-coat-of-arms`).
3. Design tokens + global layout shell (`__root.tsx`): flag stripe, header with logo + nav, footer with coat of arms.
4. Public routes:
   - `/` — Landing (hero with student ID mockup, "what it does", role entry points: School / Government / Student, public search CTA).
   - `/search` — Public search by Student ID number → shows a sanitized result card (name, school, status, photo, QR).
   - `/auth` — Sign-in / Sign-up (email + password, role selector at signup: school admin, gov officer, student).
5. Database schema + RLS:
   - `app_role` enum: `gov`, `school`, `student`.
   - `user_roles` (separate table, security-definer `has_role()` — never on profiles).
   - `profiles` (display name, phone, school_id FK).
   - `schools` (name, region, district, code, contact).
   - `students` (tsid_no UNIQUE, full_name, dob, gender, school_id, photo_url, status, qr_payload).
   - `applications` (student_id, type, status, created_by).
   - `payments` (student_id, amount, method, ref, status).
   - `audit_logs` (actor, action, entity, meta).
   - GRANTs + RLS policies for every table (gov sees all, school sees own school, student sees self, anon sees only sanitized public view).
6. Protected layout `_authenticated/route.tsx` (managed) + role-gated subtrees `_authenticated/_gov`, `_authenticated/_school`, `_authenticated/_student`.
7. Dashboards (skeleton with real data wiring, KPI tiles + tables):
   - `/student/dashboard` + `/student/id` (renders the ID card from their record, download as PNG via `html-to-image`, QR via `qrcode`).
   - `/school/dashboard` + `/school/students` (list/create) + `/school/applications`.
   - `/gov/dashboard` + `/gov/students` + `/gov/schools` + `/gov/logs`.

## Phase 2 (next turn, on your go)

- Full School flows: create student with photo upload (Cloud Storage bucket), bulk import CSV, payments table + receipts, settings (school profile + logo).
- Full Student flows: certificate generator, request-letter generator, payment history, PDF downloads (`jspdf`).
- Gov: approval workflows on applications, school verification toggle, audit log filters/export, KPI charts.

## Phase 3 (next turn, on your go)

- Public search results with verification badge + tamper-evident QR (signed payload via server fn).
- Email notifications (Lovable AI / Resend) on application status change.
- `sitemap.xml` + `robots.txt`, OG metadata per route, polish + a11y pass.

## Technical notes

- `createServerFn` + `requireSupabaseAuth` for all authenticated data access; loaders only on `_authenticated/*` routes call protected fns. Public routes use a publishable-key server client against a narrow `students_public` view.
- ID card PDF/PNG export runs client-side (`html-to-image`, `qrcode`) — no native deps on the Worker.
- Role escalation prevented: signup writes a *pending* role into `user_roles_requests`; only a gov user (seeded once) can promote. For the first run, the first signup with role=`gov` is auto-approved so you can bootstrap.

Confirm and I'll execute Phase 1 now.
