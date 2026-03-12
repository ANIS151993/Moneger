# Moneger

Moneger is a privacy-first, local-first money management app starter built with Next.js, TypeScript, Tailwind CSS, Dexie, Firebase Auth, and Chart.js.

## Project Overview

Moneger is designed so financial records live primarily on the user's device. The web app uses IndexedDB via Dexie as the primary database for income, expenses, debts, money owed, bank references, cached exchange rates, sync queue state, and user settings.

Firebase is intentionally not the default finance database. In this starter it is used only for:

- authentication
- minimal profile/auth metadata
- optional encrypted sync scaffolding

Plaintext financial records are not stored remotely by default.

## Architecture Decisions

1. Local-first data residency
   Financial records are stored in per-user IndexedDB databases such as `moneger_<userId>`.
2. Offline-first core experience
   Core ledger features work without a backend. Cached exchange rates and a service worker starter improve continuity offline.
3. Firebase as support infrastructure, not primary storage
   Firebase Auth handles login/signup/reset flows when env vars are configured. A local fallback mode keeps the app runnable during setup.
4. Optional encrypted sync only
   Sync scaffolding is present, but it is framed around device-side encryption before any Firestore upload.
5. Mobile-ready modular structure
   The codebase separates app routes, components, repositories, services, validators, and types so shared logic can move to React Native / Expo later.

## Folder Structure

```text
src/
  app/
  components/
  features/
  lib/
  store/
  types/
public/
  branding/
  icons/
docs/
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Add Firebase values if you want real Firebase Auth. If you skip this, Moneger runs in local auth fallback mode.

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Free Deployment Path

The lowest-friction free setup for this repo is:

- Cloudflare Pages for the web app
- Firebase Authentication for login/signup/reset
- Firestore on the Firebase Spark plan only if you later enable sync

This project is configured for static export, so Cloudflare Pages can host the generated `out/` directory without Firebase App Hosting.

1. Keep your Firebase project on the Spark plan.
2. In Firebase Authentication, enable `Email/Password`.
3. In Firebase Authentication authorized domains, add:
   - `localhost`
   - your Cloudflare Pages `*.pages.dev` domain
   - `moneger.marcbd.site`
4. In Cloudflare Pages, create a project from the GitHub repo.
5. Use these build settings:
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
6. Add all `NEXT_PUBLIC_*` variables from `.env.local` in the Cloudflare Pages environment settings.
7. Deploy, test the `*.pages.dev` URL, then attach `moneger.marcbd.site` as the custom domain.

## Main Product Surfaces

- Landing page with privacy-first positioning
- Auth flow: login, signup, forgot password
- Dashboard with totals, charts, reminders, and recent activity
- Income tracking
- Expense tracking
- Debt tracking
- Money owed tracking
- Bank tracking
- Settings, notification scaffolding, and sync scaffolding

## Security Posture

- Primary finance records remain local by default
- Firebase does not hold plaintext financial data by default
- Sync scaffolding expects encryption before upload
- Bank records intentionally store only lightweight references such as name, nickname, and last four digits

## Domain and Deployment

Current deployment target:

- `https://moneger.marcbd.site`

Future portable domains:

- `https://moneger.app`
- `https://moneger.io`
- `https://moneger.com`

## GitHub Page / Project Story

A GitHub Pages-ready explanation page is included in [docs/index.html](docs/index.html). It explains:

- why Moneger was built
- how the local-first architecture works
- how to use the app
- where to access the live web app
- where users can install the app from the deployed site

## Push Workflow

After validating locally, initialize git if needed, add your remote, commit, and push:

```bash
git init
git branch -M main
git remote add origin https://github.com/ANIS151993/Moneger.git
git add .
git commit -m "Build Moneger local-first MVP starter"
git push -u origin main
```

If the remote already exists, skip the `git remote add origin` step.
