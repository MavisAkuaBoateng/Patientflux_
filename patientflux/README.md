# PatientFlux (MVP)

Cloud-native OPD scheduling and patient-flow management platform for Korle-Bu Teaching Hospital.

## Tech Stack
- Next.js + TailwindCSS (UI)
- Supabase (PostgreSQL + Auth + Realtime)
- WebSockets via Supabase Realtime
- AI via LiteLLM proxy to Groq (optional for MVP)
- Blockchain stub for Hyperledger Fabric (to be integrated later)

## Getting Started

1. Copy environment file:

```bash
cp .env.example .env.local
```

2. Fill Supabase keys in `.env.local` (Project Settings → API)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side writes)

3. Optional: configure LiteLLM proxy (or leave empty for rule-based triage)
- `LITELLM_BASE_URL`
- `LITELLM_API_KEY`
- `GROQ_MODEL` (e.g., `llama3-70b-8192`)

4. Install dependencies and run dev server:

```bash
npm install
npm run dev
```

5. Apply Supabase schema:
- Open the Supabase SQL editor and paste `supabase/schema.sql`, or
- Use the CLI to run it against your database.

## Key Pages
- `/checkin` – Patient check-in form (QR/mobile friendly)
- `/queue` – Real-time OPD queue
- `/doctor-dashboard` – Doctor view with AI triage
- `/admin-dashboard` – NL query and analytics

## Notes
- Ledger writes are stubbed in `lib/ledger.ts` and also stored in `ledger_logs`.
- Code is structured for clarity and growth: `components/`, `lib/`, `pages/`.
- Accessibility: Large, high-contrast UI with focus styles; aim for WCAG AA.