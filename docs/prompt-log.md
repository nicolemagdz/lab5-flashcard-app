### Claude
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

# Prompt 1 Phase 2
Acting as a senior React engineer, generate a DeckListPage component for a Flashcard Study App.       
Requirements:        
Layout: list of decks, “Create Deck” button         
Props: decks: DeckContract[]             
State: none         
Events: navigate to deck, create new deck            
Accessibility: proper labels for buttons and list items       
Provide the component, CSS module, and a short explanation of design choices.        

### Vercel v0
# Prompt 1 Response Phase 2
Created a stateless DeckListPage component with a CSS module and a shared DeckContract type.

Files

* types/deck.ts — the DeckContract interface (id, title, optional description, cardCount, optional lastStudiedAt).
* components/deck-list-page.tsx — the presentational component.
* components/deck-list-page.module.css — scoped styles.
* 
Design choices

* Truly stateless. The component holds no local state. It renders from decks and delegates all behavior upward. I added two callback props, onNavigateToDeck(deckId) and onCreateDeck(), to satisfy the two required events — a presentational component can't own navigation or persistence, so those belong to the parent/router. If you'd rather the component call a router directly, swap the callbacks for that.
* Semantic structure. A `<main>` wrapper, an `<h1>` in a `<header>`, and a real `<ul>/<li>` list so the deck collection is announced as a list with an item count by screen readers.
* Buttons, not divs. Each deck row and the create action are native `<button type="button">` elements, so they're keyboard-focusable and activate on Enter/Space for free.
* Accessible labels. The list has aria-label="Flashcard decks", and each deck button has a descriptive aria-label (e.g. "Study Biology 101, 24 cards") so the action and context are clear without relying on visual layout. The decorative + is aria-hidden.
* Empty state. When decks is empty, a friendly prompt replaces the list instead of rendering an empty container.
* Themeable CSS. Styles use CSS custom properties with sensible fallbacks (var(--primary, #4f46e5)), visible :focus-visible outlines for keyboard users, and a mobile-first, single-column layout that wraps the header on narrow screens.

Usage:

`<DeckListPage
  decks={decks}
  onNavigateToDeck={(id) => router.push(`/decks/${id}`)}
  onCreateDeck={() => router.push("/decks/new")}
/>`

# Prompt 2 Phase 2
Generate a DeckEditor React component.           
Requirements:         
Layout: deck title input + list of cards        
Props: deckId: string            
State: title, cards            
Events: add card, delete card, save deck          
Accessibility: label inputs correctly             
Include component + CSS + explanation.

# Prompt 2 Response Phase 2
Created the DeckEditor component with a matching CSS module, consistent with the existing DeckListPage styling.

Files

* components/deck-editor.tsx — the component
* components/deck-editor.module.css — the styles

Component API

* Required prop: deckId: string
* Optional: initialTitle, initialCards, and an onSave(deckId, { title, cards }) callback so the parent decides how to persist.
* Local state: title and cards (each card is { id, front, back }).
* Events: Add card appends a blank card, Delete removes a card by id, Save deck invokes onSave (disabled until there's a title and at least one card).

Design choices

* Accessibility first: The title input uses htmlFor/id via useId(). Each card's front/back inputs have their own labels that include the card's position (e.g. "Front (card 2)") so screen reader users get unambiguous context in a repeating list. Delete buttons carry an aria-label ("Delete card 2") since their visible text alone ("Delete") isn't unique. The card list is a semantic `<ul>` labeled by the "Cards" heading via aria-labelledby.
* Stable keys: Cards get a generated id (using crypto.randomUUID() with a fallback), so React reconciliation and label associations stay correct across add/delete — never index-based keys for editable rows.
* Controlled inputs with immutable state updates (map/filter) keep the data predictable and easy to lift up.
* Visual consistency: Reuses the same design tokens, radii, focus-ring treatment, and spacing scale as DeckListPage. Cards use a responsive grid (front | back | delete) that collapses to a single column under 32rem.
* "use client" since it manages interactive local state.

To wire persistence, pass an onSave handler from the parent (e.g. a Server Action or SWR mutation). I kept saving as a callback rather than hardcoding a data layer, matching the contract-driven pattern from DeckListPage.

# Prompt 3 Phase 2
Generate a CardEditor component.        
Requirements:          
Props: card: CardContract          
State: front, back           
Events: save card           
Accessibility: label text fields            
Include component + CSS.         

# Prompt 3 Response Phase 2
Added the CardEditor component, its CSS module, and a shared CardContract type.

Files

* types/deck.ts — added CardContract (id, front, back) next to DeckContract, since no card contract existed yet. Centralizing it keeps this component consistent with DeckListPage and DeckEditor.
* components/card-editor.tsx — the component.
* components/card-editor.module.css — styles matching the existing editor design language (same tokens, focus rings, and button treatment as deck-editor).

Component behavior

* Props: card: CardContract, plus an onSave(card) callback so the parent controls persistence (the save event has to go somewhere).
* State: front and back, seeded from card.
* Events: submitting the form fires onSave with a trimmed, merged card ({ ...card, front, back }), preserving the id.

Design choices

* `<form>` with onSubmit rather than a bare button click — this gives keyboard users Enter-to-submit for free and native required validation.
* Accessibility: each `<textarea>` is tied to its `<label>` via useId()-generated ids (collision-safe if multiple editors render), and the form has an aria-label="Edit card". Focus-visible outlines are honored throughout.
* Textareas over inputs: card faces are often multi-line, so I used resizable `<textarea>`s.
* Save disabled when either field is empty or nothing changed, preventing no-op and empty saves.
* It's a controlled, presentational component — no data fetching or persistence inside — so it drops into DeckEditor or any card-management flow.

Wire it up by passing a card and a save handler:

`<CardEditor card={card} onSave={(updated) => updateCard(updated)} />`

# Prompt 4 Phase 2
Generate a StudySession component.         
Requirements:         
Props: deckId: string         
State: current card index, score           
Events: show answer, mark correct/incorrect, next card       
Accessibility: buttons must have descriptive labels        
Include component + CSS.

# Prompt 4 Response Phase 2
Created the StudySession component and its CSS module, matching the design language of the existing deck/card components.

Files

* components/study-session.tsx — the component
* components/study-session.module.css — scoped styles

Design choices

* Props & state as specified. Takes deckId: string (plus a cards: CardContract[] array, since a session needs the actual cards to render — reusing the shared CardContract type). Internal state is exactly what the requirements call for: currentIndex (current card), score, plus a small answerShown flag to drive the show-answer → grade flow.

* Event flow. Each card runs a two-step interaction: Show answer reveals the back, then Correct/Incorrect both record the result and advance (next card). Correct increments the score; both move to the next index. When the index passes the last card, a completion summary with the final score is shown.

Accessibility.

* Every action button has a descriptive aria-label explaining both what it does and its consequence (e.g. "Mark this card correct and go to the next card", "Show the answer for the current card") rather than relying on the short visible text alone.
* The `<section>` is labelled via aria-labelledby with an sr-only heading that names the deck; progress ("Card 2 of 5") is exposed as visible text.
* The card area and score use aria-live="polite" so the newly revealed answer and updated score are announced. The completion state uses role="status".
* Buttons are real `<button type="button">` elements with visible :focus-visible outlines.

Styling. 
* Uses the same CSS-module pattern, spacing scale, radii, and CSS-variable-with-fallback tokens as card-editor.module.css. Added semantic success/destructive color tokens for the Correct/Incorrect buttons so they read at a glance while still theming through variables.

Edge cases. 
* Empty decks render a friendly "No cards to study" state instead of crashing on an undefined card.

