# Chat bot

A bilingual (English / فارسی) AI chat workspace UI built with React, TypeScript, Vite and Tailwind CSS.

> **AI replies** come from Google Gemini (or Paasta) through the small backend in [`backend/`](backend/README.md). Set your key in `backend/server/.env`, then run `npm run server` next to `npm run dev`.

## Features

- **Chat workspace** — create, rename, pin, archive and delete conversations, grouped by Pinned / Today / Previous 7 days / Archived
- **Search** across chat history
- **Composer** with image and PDF attachments (drag & drop, up to 5 files, 10 MB each)
- **Voice input** using the browser's Speech Recognition API
- **Edit and regenerate** prompts and replies
- **English and Persian** interface with full RTL support
- **Personalization** — choose a background image (its colors tint the UI) and adjust background blur
- **Settings** — account and profile photo, AI model and custom instructions, data export and history clearing, notifications, security, help
- Conversations and preferences are saved locally in the browser (`localStorage`)
- Smooth animations with Framer Motion and responsive layout for mobile and desktop

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [Lucide](https://lucide.dev) icons

## Getting started

Requires [Node.js](https://nodejs.org) 20 or later.

```bash
git clone https://github.com/matinzeinali/chatbot.git
cd chatbot
npm install
npm run dev
```

Then open http://localhost:5173.

On Windows you can also double-click `run.bat`, which installs dependencies if needed, starts the dev server and opens the browser.

### Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |

## Project structure

```
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
├── lib/             # Color palette extraction
└── assets/          # Images and fonts
```

## Connecting an AI model

Replies are currently generated as placeholders in `src/App.tsx`. To get real answers, replace that logic with a call to the model API of your choice (ideally through your own backend, so API keys are never exposed in the browser).

---

## فارسی

یک رابط کاربری چت‌بات هوش مصنوعی دوزبانه (فارسی / انگلیسی) با React، TypeScript، Vite و Tailwind CSS.

این پروژه فعلاً فقط بخش رابط کاربری است و به سرویس هوش مصنوعی وصل نیست؛ پاسخ‌ها نمونه هستند.

**امکانات:** مدیریت گفتگوها (ساخت، تغییر نام، سنجاق، بایگانی، حذف)، جستجو، پیوست تصویر و PDF، ورودی صوتی، پشتیبانی کامل از راست‌به‌چپ، انتخاب پس‌زمینه و تنظیمات حساب.

**اجرا:**

```bash
npm install
npm run dev
```

در ویندوز می‌توانید فایل `run.bat` را هم اجرا کنید.
