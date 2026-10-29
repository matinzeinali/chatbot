# Paasta free-model backend for your Vite/React chatbot

> **Already wired into this project:** steps 4–6 below are done (`src/lib/paastaApi.ts`, the proxy in `vite.config.ts`, and Settings → AI for the model). The server runs on port 8787 because 3001 was already in use.
>
> **Gemini:** set `GEMINI_API_KEY` in `server/.env` instead of `PAASTA_AI_KEY` and the server talks to Google's OpenAI-compatible Gemini API, offering the models in `GEMINI_MODELS` (`server/models.mjs`). When both keys are set, Gemini is used.

The supplied project tree shows a Vite React/TypeScript frontend, not the source file contents. This is an **add-on**, not a claim that the existing UI is fully wired.

Requires Node 20.12+.

1. Copy `server/` into the root of your chatbot project.
2. In `server/`, copy `.env.example` to `.env`, set your real PAASTA_AI_KEY (keep private).
3. From `server/`, run `npm run dev` (no npm install required). From the project root, `npm run server` does the same, and `run.bat` starts it automatically once `server/.env` exists.
4. Copy `src/lib/paastaApi.ts` into the existing `src/lib/`.
5. Add the following `server.proxy` to your existing `vite.config.ts` (merge, don't replace your React config):

```ts
server: { proxy: { '/api': { target: 'http://127.0.0.1:8787', changeOrigin: true, headers: { origin: '' } } } }
```

6. Fetch `getFreeModels()` for your model selector. On sending a message, call `sendChat(selectedModelId, history)` using `{role,content}` messages. Append returned `.message` as an assistant message.
7. Start existing frontend with its usual `npm run dev`.

Endpoints: GET /api/health, GET /api/models, POST /api/chat.

The list is a **static allowlist based on the model IDs supplied in the conversation**. Availability and quotas are dynamic: confirm through Paasta's official GET /models and console. Only text messages are implemented. Images, audio, tools, persistent chat storage and streaming are not implemented. A per-IP in-memory 30 req/min limit provides basic local protection; for public deployment add proper user authentication, reverse proxy and robust distributed rate limiting. Configure your Paasta key as free-model-only with zero paid budget. Never put it in VITE_ variables or Git.
