Build the app as if you are scaffolding a real startup MVP that should run after setup with minimal fixes.
Generate a working codebase in complete file blocks. Prioritize code over explanation. Minimize narrative. Do not give pseudocode unless explicitly unavoidable.

You are a senior Full-Stack Software Architect, Next.js engineer, product designer, and mobile-ready app architect.

Build a production-grade starter codebase for a privacy-first, local-first money management app named **Moneger**.

==================================================
APP IDENTITY
==================================================

Product Name:
Moneger

Meaning:
Money + Manager

Primary Tagline:
Moneger — Your Smart Money Manager

Core Message:
Your Money. Your Control.

Brand Personality:
- intelligent
- private
- modern
- trustworthy
- minimal
- financially professional

Brand Colors:
- primary: #16A34A
- secondary: #0F172A
- accent: #38BDF8
- neutral: #F1F5F9
- text: #1E293B

Typography:
- headings: Inter
- UI secondary: Poppins
- numeric/mono: JetBrains Mono

Logo Direction:
- stylized M
- vault / shield / protected ledger feel
- minimalist geometric fintech style

App Icon Direction:
- rounded square
- green background
- white M or M-vault mark
- flat minimal fintech look

Current deployment domain:
moneger.marcbd.site

Future domain portability:
- moneger.app
- moneger.io
- moneger.com

Use metadata, manifest, naming, and branding consistent with:
Moneger — Smart Money Manager

==================================================
PRODUCT VISION
==================================================

Build a Local-First Money Management App with zero-server data residency for user financial records.

Rules:
- user financial data must live primarily on the user's device
- use IndexedDB as the primary financial database for web
- Firebase must not be the default financial storage
- Firebase can only be used for:
  - authentication
  - minimal profile metadata
  - optional encrypted sync
  - optional notification trigger support
- do not store plaintext financial records remotely by default
- app must work offline for core features
- local storage must be namespaced per authenticated user
- users must not depend on my server to access their own data

==================================================
TARGET
==================================================

Generate the foundation for:
1. Web app with Next.js
2. Mobile-ready architecture that can later be adapted to React Native / Expo cleanly

Focus implementation on the web app first, but structure code for future mobile reuse.

==================================================
TECH STACK
==================================================

Use:
- Next.js latest stable with App Router
- React
- TypeScript
- Tailwind CSS
- Chart.js
- Firebase
- Firebase Authentication
- Firestore only for auth metadata and optional encrypted sync
- Dexie or IndexedDB for primary local storage
- Zustand or React Context for app state
- React Hook Form + Zod for forms/validation if useful

Choose practical, scalable defaults.

==================================================
CORE FEATURES
==================================================

1. Authentication
- signup with email/password
- login with email/password
- forgot password flow
- sign out
- auth persistence
- architecture ready for phone auth

2. Income Tracking
Fields:
- id
- userId
- amount
- currency
- source
- category
- frequency: daily | weekly | monthly | one-time
- note
- date
- createdAt
- updatedAt

3. Expense Tracking
Fields:
- id
- userId
- amount
- currency
- source or merchant
- category
- note
- date
- createdAt
- updatedAt

4. Bank Tracking
Fields:
- id
- userId
- bankName
- nickname
- last4
- currency
- note
- createdAt
- updatedAt

5. Debt Tracking
Fields:
- id
- userId
- creditorName
- creditorEmail
- creditorPhone
- amount
- currency
- note
- createdDate
- settlementDate
- status: unpaid | partial | paid | overdue
- createdAt
- updatedAt

6. Money Owed Tracking
Fields:
- id
- userId
- debtorName
- debtorEmail
- debtorPhone
- amount
- currency
- note
- createdDate
- settlementDate
- status: pending | partial | settled | overdue
- createdAt
- updatedAt

7. Reminders and Notifications
- in-app reminder badges
- upcoming settlement alerts
- overdue indicators
- browser notification helper
- optional email reminder architecture for debtor reminders

8. Dashboard
Show:
- total income
- total expenses
- total debt
- total money owed
- net balance
- recent transactions
- upcoming settlements
- charts for trends and category breakdowns

Use Chart.js for:
- income vs expense trends
- category breakdown
- monthly summary
- debt vs owed summary

9. Currency Support
Support:
- USD
- BDT

Requirements:
- records can be stored in either currency
- app can convert between currencies
- fetch exchange rate when online
- cache last known rate locally
- fallback offline to cached rate
- dashboard calculations must handle mixed currencies

==================================================
ARCHITECTURE RULES
==================================================

1. Local-first source of truth
2. Firebase is not the primary finance database
3. Plaintext financial data must not be stored remotely by default
4. Offline-first for core experience
5. Per-user local isolation
6. Modular clean architecture
7. Strong TypeScript typing
8. Reusable UI components
9. Brand-consistent premium fintech interface

==================================================
GENERATE THESE
==================================================

Generate a real starter project with:

- complete folder structure
- key TypeScript types/interfaces
- layout and app shell
- auth pages
- dashboard page
- income page
- expenses page
- debts page
- owed page
- banks page
- settings page
- landing page
- Firebase config structure
- auth provider
- route protection
- Dexie/IndexedDB layer
- repositories/services for CRUD
- dashboard aggregation utilities
- currency conversion utility
- exchange-rate cache
- Chart.js components
- form components with validation
- reusable UI components
- Zustand or Context store
- sync scaffolding
- notification scaffolding
- seed/demo data generator
- metadata and SEO setup
- web manifest / PWA starter setup
- branding components
- placeholder logo component
- placeholder app icon strategy

==================================================
EXPECTED STRUCTURE
==================================================

Use a structure close to this and improve where needed:

/src
  /app
    /(auth)
      /login
      /signup
      /forgot-password
    /(dashboard)
      /dashboard
      /income
      /expenses
      /debts
      /owed
      /banks
      /settings
    /layout.tsx
    /page.tsx
    /globals.css

  /components
    /ui
    /layout
    /charts
    /forms
    /dashboard
    /branding
    /shared

  /lib
    /firebase
    /db
    /repositories
    /services
    /utils
    /validators
    /hooks
    /constants
    /security
    /branding

  /types
  /store
  /features

/public
  /icons
  /branding

==================================================
IMPLEMENTATION REQUIREMENTS
==================================================

A. Auth
- Firebase Auth
- signup/login/logout/reset password
- auth provider wrapper
- protected dashboard routes
- architecture ready for phone auth

B. Local DB
Use Dexie or direct IndexedDB.
Create typed tables for:
- incomes
- expenses
- debts
- owed
- banks
- exchangeRates
- syncQueue
- settings

Each finance record must include userId.

C. CRUD layer
Implement add/update/delete/list services for all entities.

D. Dashboard aggregation
Implement utilities to compute:
- total income
- total expenses
- total debt
- total owed
- net balance
- recent activity
- monthly trends
- category totals

E. Currency engine
Implement:
- exchange rate fetcher
- cache in local DB
- conversion helpers
- offline fallback

F. Sync scaffolding
Do not implement insecure raw sync.
Instead:
- create sync interfaces
- create placeholder encryption service
- document device-side encryption before upload
- Firestore stores encrypted blobs/chunks only

G. Notifications
Implement:
- reminder utilities
- due/overdue checks
- browser notification helper
- secure architecture note for optional backend-triggered emails

H. UI/UX
Create a premium fintech feel:
- responsive sidebar layout
- top nav
- stat cards
- polished tables
- forms
- charts
- empty/loading/error states
- consistent spacing
- Moneger branding
- professional dashboard feel

I. Landing page
Generate a polished landing page for:
https://moneger.marcbd.site

Include:
- hero
- value proposition
- privacy-first explanation
- local-first/offline-first explanation
- feature highlights
- dashboard preview area
- CTA buttons for signup/login
- SEO metadata

Suggested homepage title:
Moneger — Smart Money Manager

Suggested homepage description:
Moneger is a privacy-first, local-first money management app to track income, expenses, debt, and owed money with full control over your data.

==================================================
OUTPUT FORMAT
==================================================

Return output in this order:

1. project overview
2. architecture decisions
3. folder structure
4. setup instructions
5. code files

For code files:
- every file must show file path
- every file must contain real code
- provide the most important files fully
- then provide supporting files in additional file blocks
- keep files copy-paste ready
- do not collapse critical logic into vague summaries

==================================================
CRITICAL CONSTRAINTS
==================================================

- do not treat Firestore as primary finance storage
- do not store plaintext financial records remotely by default
- do not stop at pseudocode
- generate realistic starter code
- prefer working code over long explanation
- use environment variables for domain and Firebase config
- make branding reusable and centralized
- make the project ready for initial publish at moneger.marcbd.site

==================================================
FINAL TASK
==================================================

Now generate the complete production-grade starter architecture and codebase foundation for Moneger using Next.js, TypeScript, Tailwind CSS, Chart.js, Firebase Auth, Firestore only for optional encrypted sync, and IndexedDB/Dexie for primary local financial data storage.

For Push Complete Project my GitHub repo: https://github.com/ANIS151993/Moneger.git
Before pushing Create a README file with project overview, setup instructions, and architecture decisions as outlined above and also Create a git web page where Expalin why I buld this app how I build this app and how to use this app. Then push the complete project to the GitHub repo and create App Download option in the GitHub page with link to the deployed app at moneger.marcbd.site. and web app access button for using web app. Create evrything Graphically interactive and visually attractive.
