/**
 * Rnai.io — Ollama client (local LAN inference)
 * Talks to a user's own Ollama server (http://<lan-ip>:11434).
 */

export interface OllamaChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const CONNECT_TIMEOUT_MS = 5_000;
const CHAT_TIMEOUT_MS = 120_000;

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Verify the Ollama server is reachable and list installed models.
 * Throws on failure.
 */
export async function connectOllama(serverUrl: string): Promise<string[]> {
  const base = normalizeUrl(serverUrl);
  const res = await fetchWithTimeout(`${base}/api/tags`, { method: 'GET' }, CONNECT_TIMEOUT_MS);
  if (!res.ok) throw new Error(`Ollama responded with ${res.status}`);
  const data = await res.json();
  const models: string[] = Array.isArray(data?.models)
    ? data.models.map((m: any) => m?.name).filter(Boolean)
    : [];
  return models;
}

/** Send a chat conversation to Ollama and return the assistant reply. */
export async function ollamaChat(
  serverUrl: string,
  model: string,
  messages: OllamaChatMessage[],
): Promise<string> {
  const base = normalizeUrl(serverUrl);
  const res = await fetchWithTimeout(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  }, CHAT_TIMEOUT_MS);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const reply = data?.message?.content;
  if (typeof reply !== 'string') throw new Error('Unexpected Ollama response');
  return reply;
}
