# Chat bot

**English** | [فارسی](README.fa.md)

A bilingual (English / Persian) AI chat workspace built with React, TypeScript, Vite and Tailwind CSS, with a small Node.js backend that connects it to Google Gemini or Paasta models.

## Features

- **Chat workspace** — create, rename, pin, archive and delete conversations, grouped by Pinned / Today / Previous 7 days / Archived
- **Search** across chat history
- **Composer** with image and PDF attachments (drag & drop, up to 5 files, 10 MB each)
- **Voice input** using the browser's Speech Recognition API
- **Edit and regenerate** prompts and replies
- **English and Persian** interface with full RTL support
- **Personalization** — choose a background image (its colors tint the UI) and adjust background blur
- **Settings** — account and profile photo, AI model and custom instructions, data export and history clearing, notifications, security, help
- **Real AI replies** through the backend in [`backend/`](backend/README.md) (Gemini or Paasta)
- Conversations and preferences are saved locally in the browser (`localStorage`)
- Smooth animations with Framer Motion and a responsive layout for mobile and desktop

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [Lucide](https://lucide.dev) icons
- Node.js backend (no dependencies) in `backend/server/`

## Getting started

Requires [Node.js](https://nodejs.org) 20.12 or later.

```bash
git clone https://github.com/matinzeinali/chatbot.git
cd chatbot
npm install
npm run dev
```

Then open http://localhost:5173.

On Windows you can also double-click `run.bat`, which installs dependencies if needed, starts the dev server (and the backend, once `backend/server/.env` exists) and opens the browser.

### Scripts

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the development server                  |
| `npm run server`  | Start the AI backend on port 8787             |
| `npm run build`   | Type-check and build for production           |
| `npm run preview` | Preview the production build locally          |

## Connecting an AI model

1. Copy `backend/server/.env.example` to `backend/server/.env`.
2. Set `GEMINI_API_KEY` (Google Gemini) or `PAASTA_AI_KEY` (Paasta). If both are set, Gemini is used.
3. Run `npm run server` next to `npm run dev`. Vite proxies `/api` to the backend.
4. Pick a model in **Settings → AI**.

Backend endpoints: `GET /api/health`, `GET /api/models`, `POST /api/chat`. Only text messages are sent to the model; streaming and server-side chat storage are not implemented. Keep your API key in `.env` only — never in `VITE_` variables or Git. See [`backend/README.md`](backend/README.md) for details.

## Project structure

```
backend/
└── server/          # Node.js API proxy for Gemini / Paasta (port 8787)
src/
├── components/
│   ├── chat/        # Chat panel, message bubbles, composer, attachments
│   ├── settings/    # Settings panel and sections
│   ├── sidebar/     # Chat list, brand, account menu
│   ├── icons/       # Custom SVG icons
│   └── ui/          # Shared UI (dialogs)
├── context/         # Locale (EN/FA) and background providers
├── data/            # Demo chats, messages and backgrounds
├── hooks/           # useSpeechInput, useDismiss
├── lib/             # API client and color palette extraction
└── assets/          # Images and fonts
```
