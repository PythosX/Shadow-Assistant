# Shadow Assistant — Your creator inbox. Under control.

A hackathon MVP: smart inbox, AI-assisted reply suggestions, and keyword-triggered resource responses. **Demo mode only** — no API keys, backend or live integrations.

## Features
Animated landing page · demo login · dashboard · inbox (search, filters, demo replies, review panel) · auto-reply rules (CRUD, toggle) · keyword automations (CRUD, duplicate, pause, validation, "Preview a keyword rule") · integrations info · contact form · settings · toasts, empty states, responsive layout, reduced-motion support.

## Tech stack
React 18, Vite, TypeScript, React Router (HashRouter, so static hosting works), lucide-react, plain CSS, Vitest.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # keyword matching tests
npm run build    # outputs dist/
npm run preview
```

## Deploy
Upload `dist/` to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages). Build command `npm run build`, output `dist`. No routing config needed.

## Demo credentials (demonstration only)
Email `demo@shadowassistant.app` · Password `ShadowDemo123!` (also via the "Use demo account" button). This is **not real authentication**; do not reuse for anything real.

## Demo limitations
- All data is in-memory and resets on refresh.
- Replies, keyword responses and "AI suggestions" are simulated; nothing is sent to any social account and no AI model is called.
- Dashboard numbers are sample data. Example URLs (example.com) are illustrative.
- The contact form stores nothing outside browser state and sends no email. To make it real, post the form to a backend or a form service (Formspree, Resend, etc.).
- No integration is "Connected".

## Integration roadmap
1. Telegram: server-side bot with webhook; token in env vars, verified via health check.
2. Email inquiries. 3. YouTube comments (Data API + OAuth). 4. Discord bot. 5. Instagram (requires approved Meta API access).

## Security notes
No secrets in frontend code. Real integrations must keep tokens server-side (environment variables). Replace the fixed demo login with real auth before any production use.

## Demo script
Landing → Explore the demo → Use demo account → Inbox (open a routine question, insert suggestion) → Keyword Automations → GUIDE rule → Preview "GUIDE" → pause the rule, preview again (no match) → Integrations.
