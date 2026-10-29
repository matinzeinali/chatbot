// Client for the local AI backend (backend/server, Gemini or Paasta). Vite proxies /api to it in dev.
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type FreeModel = { id: string; name: string };

export const MODEL_SETTING_KEY = "chatbot:ai-model";
export const INSTRUCTIONS_SETTING_KEY = "chatbot:ai-instructions";
// The backend accepts at most 40 messages per request.
const MAX_MESSAGES = 40;

const base = "/api";

export async function getFreeModels(): Promise<{ models: FreeModel[]; default: string }> {
  const response = await fetch(`${base}/models`);
  if (!response.ok) throw new Error("Could not load models");
  return response.json();
}

export async function sendChat(model: string, messages: ChatMessage[], signal?: AbortSignal) {
  const system = messages.filter((message) => message.role === "system");
  const rest = messages.filter((message) => message.role !== "system").slice(-(MAX_MESSAGES - system.length));
  let response: Response;
  try {
    response = await fetch(`${base}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [...system, ...rest] }),
      signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new Error("Could not reach the backend. Is it running?");
  }
  const data = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data as { model: string; message: string; usage: unknown; finish_reason: string | null };
}

function readSetting(key: string) {
  try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
}

/** Model chosen in Settings → AI; empty or unknown ids make the backend use its default. */
export function selectedModel() {
  return readSetting(MODEL_SETTING_KEY);
}

export function customInstructions() {
  return readSetting(INSTRUCTIONS_SETTING_KEY).trim();
}
