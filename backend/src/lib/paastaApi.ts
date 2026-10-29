// Copy into your existing src/lib/paastaApi.ts
export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type FreeModel = { id: string; name: string };
const base = '/api'; // Vite proxy forwards this to port 3001
export async function getFreeModels(): Promise<FreeModel[]> {
  const response = await fetch(`${base}/models`);
  if (!response.ok) throw new Error('Could not load models');
  const data = await response.json();
  return data.models;
}
export async function sendChat(model: string, messages: ChatMessage[]) {
  const response = await fetch(`${base}/chat`, {
    method: 'POST', headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ model, messages })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data as {model:string;message:string;usage:unknown;finish_reason:string|null};
}
