# Prompt 1 Phase 1
Acting as a senior full‑stack architect, design the complete architecture for a Flashcard Study App using a React frontend and a Node.js + Express backend with Prisma ORM.
Explain the rationale behind:         
-the chosen stack          
-the folder hierarchy          
-separation of concerns            
-recommended dependencies           
-environment configuration           
Then generate the full project scaffold:         
-folder structure         
-frontend + backend `package.json`          
-placeholder files for routes, controllers, models, services           
-shared folder for TypeScript contracts           
The output must be production‑ready, readable, and organized.           

# Prompt 1 Response Phase 1
## **Architecture rationale**

**Stack.** React + Vite gives a fast dev loop and a small, unopinionated SPA shell. Express stays because it's the most predictable, middleware-first choice for a small-to-mid REST API — no framework magic to fight when you need custom auth/validation/error handling. Prisma is the ORM because its schema-first workflow gives you type-safe queries and migrations for free, which matters once Users/Decks/Cards/StudySessions start relating to each other. PostgreSQL as the datastore because it handles relational integrity (cascading deletes, indexes on nextReviewAt) cleanly. TypeScript everywhere so the same types can be shared instead of duplicated and drifting.

**Folder hierarchy.** It's an npm-workspaces monorepo (frontend/, backend/, shared/) rather than two disconnected repos, because the API contract is the thing most likely to drift and cause bugs — a shared package makes drift a compile error instead of a runtime surprise.

**Separation of concerns (backend).** Strict one-way layering: routes (wiring + validation) → controllers (HTTP shape only) → services (business logic, e.g. the SM-2 scheduler) → models (Prisma queries only). Nothing skips a layer — a controller never calls Prisma directly, a service never touches req/res. That's what makes each layer independently testable and lets you swap Prisma for something else later without touching business logic.

**Separation of concerns (frontend).** api/ (typed HTTP calls) → hooks/ (React Query orchestration + caching) → components/pages (rendering). Zustand holds only the auth session; all server data lives in React Query's cache — one source of truth, no manual sync.

Recommended dependencies are baked into the two package.json files: zod for runtime validation, jsonwebtoken/bcryptjs for auth, helmet/cors/express-rate-limit for baseline hardening, @tanstack/react-query + axios for data fetching, zustand for the thin client state.

Environment configuration is centralized in backend/src/config/env.ts, which parses process.env through a Zod schema at boot — a missing JWT_SECRET or bad DATABASE_URL fails immediately with a clear message instead of surfacing as a mystery 500 later. .env.example files are provided for both apps.

## **What's scaffolded**

61 files, fully wired: Prisma schema (with an SM-2 spaced-repetition model built into Card), a working spacedRepetition.service.ts, auth (register/login/JWT middleware), nested deck→card→review routes, and a minimal but functional React app (login, dashboard, study session with flip cards). Everything type-checks against the shared @flashcard/shared contracts.

To run it: npm install, copy the two .env.example files, npm run prisma:generate && npm run prisma:migrate, then npm run dev.
