# Moneger

Moneger is a privacy-first, local-first money management app starter built with Next.js, TypeScript, Tailwind CSS, Dexie, Firebase Auth, and Chart.js.

## Project Overview

Moneger is designed so financial records live primarily on the user's device. The web app uses IndexedDB via Dexie as the primary database for income, expenses, debts, money owed, bank references, cached exchange rates, sync queue state, and user settings.

Firebase is intentionally not the default finance database. In this starter it is used only for:

- authentication
- minimal profile/auth metadata
- shared creditor/debtor relationship metadata
- optional encrypted sync scaffolding

Plaintext financial records are not stored remotely by default.

Profile and app-level settings are different. When Firebase and Firestore are configured, Moneger now syncs the signed-in user's settings record to Firestore so profile identity, language, currency preferences, and shortcut-installed app shells can restore those settings automatically across browser contexts.

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
6. Shared obligations use the cloud, not the primary ledger
   Cross-user debt matching is stored in Firestore, then mirrored back into each user's local debt/owed tables so the dashboard and reminders keep working offline.

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

Optional:
- Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` if you want live Google-backed bank name autocomplete in the bank form.
- Enable the Google Maps JavaScript API and Places API for that key, then restrict the key to your domains.
- If you want profile/settings sync across browser and installed shortcut contexts, enable Firestore and publish the rules from `firestore.rules`.
- If you want creditor/debtor collaboration across Moneger accounts, Firestore is required. The app now publishes a minimal user directory entry and a shared-obligations collection for matched counterparties.
- Email invites and reminder emails currently open prefilled `mailto:` drafts from the browser. Fully automatic email sending would require a backend mail service or Cloud Functions.

### Firestore Collaboration Setup

If you want shared creditor/debtor records, profile restore across shortcuts, and shared chat to work on the live Cloudflare site, complete these Firebase steps exactly:

1. In Firebase Console, open your project `moneger-a04c6`.
2. Go to `Build > Firestore Database`.
3. If Firestore is not created yet, click `Create database`, choose `Production mode`, and pick a region close to your users.
4. Open the `Rules` tab in Firestore.
5. Replace the live rules with the contents of [`firestore.rules`](firestore.rules).
6. Click `Publish`.
7. Go to `Authentication > Settings > Authorized domains`.
8. Confirm these domains are present:
   - `localhost`
   - your Cloudflare `*.pages.dev` domain
   - `moneger.marcbd.site`
9. In Cloudflare Pages, open your project settings.
10. Confirm every `NEXT_PUBLIC_FIREBASE_*` variable from `.env.local` exists in both `Production` and `Preview`.
11. If you change any Pages environment variable, trigger a new deployment.
12. Sign in once with each Moneger user after the new deploy so the app can create their Firestore profile/directory entry.

There are no extra Cloudflare DNS settings required for Firestore itself. If Firebase Auth already works on your live domain, Cloudflare is usually fine and the missing step is publishing the Firestore rules.

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Firebase Admin Verification

If you want to validate Firestore with a Firebase service account locally, keep the JSON key file only on your machine and never commit it.

This repo now includes two local admin scripts:

```bash
npm run firebase:admin:check
npm run firebase:admin:verify
```

What they do:

- `firebase:admin:check`
  Reads the local service-account JSON file and compares its `project_id` to `NEXT_PUBLIC_FIREBASE_PROJECT_ID` from `.env.local` or `.env.example`.
- `firebase:admin:verify`
  Uses `firebase-admin` to verify read/write access to the Firestore paths used by Moneger, including `userDirectory`, `sharedObligations`, and `users/{uid}/settings`.

Important:

- The service account must belong to the same Firebase project as the client app config.
- This admin key is not used by the Cloudflare Pages client runtime. It is only for trusted local admin scripts or future server-side tooling.
- If you intentionally want to test a different Firebase project, set `ALLOW_FIREBASE_PROJECT_MISMATCH=1` for the admin script run.

## Free Deployment Path

The lowest-friction free setup for this repo is:

- Cloudflare Pages for the web app
- Firebase Authentication for login/signup/reset
- Firestore on the Firebase Spark plan only if you later enable sync
- Firestore on the Firebase Spark plan if you want shortcut profile restore or shared creditor/debtor records

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
- Shared creditor/debtor collaboration with email matching, invite drafts, and agreement status
- Bank tracking
- Settings, notification scaffolding, and sync scaffolding

## Security Posture

- Primary finance records remain local by default
- Firebase does not hold plaintext financial data by default
- Signed-in user settings can sync to Firestore so profile identity and app preferences restore across shortcut-installed contexts
- Shared creditor/debtor records store only the minimum cross-user collaboration metadata needed to mirror the agreed obligation and installment schedule
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
