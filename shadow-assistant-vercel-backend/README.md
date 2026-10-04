# Shadow Assistant — Vercel + Telegram + AI Backend

This backend turns Shadow Assistant into a real Telegram AI assistant.

## Architecture

Telegram user → Telegram Bot API → `/api/telegram/webhook` → rule fast-path → creator knowledge → OpenAI Responses API → Telegram reply.

The React dashboard can stay separate. This backend is designed to deploy as Vercel Functions.

## 1. Requirements

- Node.js 20+
- GitHub account
- Vercel account
- Telegram account
- Telegram bot token from @BotFather
- OpenAI API key

## 2. Create the Telegram bot

1. Open Telegram.
2. Open `@BotFather`.
3. Send `/newbot`.
4. Choose a display name.
5. Choose a username ending in `bot`.
6. Copy the bot token.

Never put the Telegram token in React, GitHub, or client-side JavaScript.

## 3. Prepare this backend

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in:

```env
TELEGRAM_BOT_TOKEN=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.4-mini
SETUP_SECRET=use-a-long-random-secret
TELEGRAM_WEBHOOK_SECRET=another-long-random-secret
PUBLIC_BASE_URL=https://YOUR-PROJECT.vercel.app
```

Replace `knowledge/creator.md` with real, verified creator information.

## 4. Test locally

```bash
npm run typecheck
npm run dev
```

Vercel CLI will expose a local URL. Telegram webhooks require a public HTTPS URL, so for local Telegram testing use a public tunnel or deploy to Vercel first.

## 5. Deploy to Vercel

### Option A — GitHub

1. Create a new GitHub repository.
2. Put this backend in the repository.
3. Push the code.
4. Open Vercel.
5. Add New Project.
6. Import the repository.
7. Deploy.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

## 6. Add Vercel environment variables

Vercel dashboard → Project → Settings → Environment Variables.

Add these to Production:

- `TELEGRAM_BOT_TOKEN`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SETUP_SECRET`
- `TELEGRAM_WEBHOOK_SECRET`
- `PUBLIC_BASE_URL`

Redeploy after changing environment variables.

## 7. Verify the backend

Open:

```text
https://YOUR-PROJECT.vercel.app/api/health
```

Expected:

```json
{"ok":true,"service":"shadow-assistant-backend"}
```

## 8. Connect Telegram to Vercel

After deployment, call the protected setup endpoint once.

Browser GET example:

```text
https://YOUR-PROJECT.vercel.app/api/telegram/setup?secret=YOUR_SETUP_SECRET
```

Or POST with header:

```text
x-setup-secret: YOUR_SETUP_SECRET
```

The endpoint calls Telegram `setWebhook` and registers:

```text
https://YOUR-PROJECT.vercel.app/api/telegram/webhook
```

The webhook also uses `TELEGRAM_WEBHOOK_SECRET` to reject requests without Telegram's expected secret header.

## 9. Test the bot

Open your bot in Telegram and send:

```text
/start
```

Then try:

```text
What technologies does the creator use?
```

```text
Tell me about the creator's projects.
```

```text
Where can I find the GitHub?
```

The AI reads `knowledge/creator.md` and answers from it.

## 10. Keyword fast-path

The backend keeps a fast rule system in `lib/rules.ts`.

Currently it has placeholder examples for:

- guide
- template
- notes

Replace those URLs with real creator resources. Messages that don't match a rule go to the AI.

## 11. Important: AI knowledge is not the same as Telegram memory

This version intentionally uses the creator knowledge file as the source of truth. It does not persist a full conversation database.

For a production Shadow dashboard, add a database such as Postgres/Supabase and store:

- Telegram chat ID
- user name/username
- incoming messages
- AI drafts
- sent replies
- approval status
- timestamps
- confidence/review status

Then pass relevant conversation history to the AI.

## 12. Recommended next upgrade: RAG

For a larger knowledge base, split the creator information into documents and use semantic retrieval/vector search instead of sending the entire Markdown file on every request.

Suggested documents:

```text
profile.md
skills.md
projects.md
experience.md
services.md
links.md
faq.md
```

## 13. Security checklist

- Never commit `.env` or `.env.local`.
- Never expose `TELEGRAM_BOT_TOKEN` to React.
- Never expose `OPENAI_API_KEY` to React.
- Keep `TELEGRAM_WEBHOOK_SECRET` private.
- Keep `SETUP_SECRET` private.
- Replace placeholder creator facts before production.
- Do not let the model invent creator information.
- Rotate Telegram/OpenAI credentials if they are ever exposed.

## 14. Connecting the existing Shadow React dashboard

Your existing frontend can call this backend later for:

- Telegram connection status
- Inbox
- AI draft replies
- Approve/edit/take-over
- Automation rules
- Knowledge management
- Settings
- Activity logs

The current backend is intentionally focused on getting the real Telegram → AI → Telegram pipeline working first.
