/**
 * Rnai AI Gateway — Provider router with failover + circuit breaker
 * ------------------------------------------------------------------
 * REFERENCE IMPLEMENTATION. Copy into the backend (rnai-platform, Next.js)
 * and wire each provider's `call()` to its real SDK/HTTP request.
 *
 * Idea: every skill has an ordered list of providers (primary external first,
 * self-hosted backup last). The router tries them in order, skipping any whose
 * circuit is "open" (recently failing), and trips the breaker on outages so a
 * dead provider doesn't slow every request.
 *
 * Runtime-agnostic: no framework imports. Drop into an API route handler.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type SkillId =
  | 'image-gen' | 'image-edit' | 'remove-bg' | 'upscale' | 'stylize'
  | 'text-gen' | 'text-sum' | 'text-trans' | 'text-rewrite' | 'audio-tts'
  | 'website-gen' | 'image-describe' | 'face-restore' | 'text-grammar'
  | 'text-code' | 'text-hashtag';

export interface SkillRequest {
  skillId: SkillId;
  prompt?: string;
  image?: string;
  extra?: Record<string, string>;
}

export interface SkillResponse {
  kind: 'image' | 'text' | 'website' | 'audio';
  content: string;
  /** Which provider actually produced this result (for observability). */
  servedBy: string;
  raw?: unknown;
}

export interface Provider {
  /** Unique id, e.g. 'gemini', 'together', 'self-vllm', 'self-sdxl'. */
  id: string;
  /** Which skills this provider can serve. */
  supports: SkillId[];
  /** Lower = higher priority (tried first). External primaries < self-hosted. */
  priority: number;
  /** true for your own self-hosted backup — used for metrics/labels. */
  selfHosted?: boolean;
  /** Liveness probe; return false to take the provider out of rotation. */
  health: () => Promise<boolean>;
  /** Do the actual work. Throw on failure. */
  call: (req: SkillRequest) => Promise<SkillResponse>;
}

// ── Circuit breaker ───────────────────────────────────────────────────────────

interface BreakerState {
  failures: number;
  openedAt: number; // 0 = closed
}

const FAILURE_THRESHOLD = 4;      // consecutive failures before opening
const COOLDOWN_MS = 30_000;       // how long to stay open before half-open retry

const breakers = new Map<string, BreakerState>();

function getBreaker(id: string): BreakerState {
  let b = breakers.get(id);
  if (!b) { b = { failures: 0, openedAt: 0 }; breakers.set(id, b); }
  return b;
}

/** Can we send to this provider right now? (closed, or cooldown elapsed) */
function isAvailable(id: string): boolean {
  const b = getBreaker(id);
  if (b.openedAt === 0) return true;
  if (Date.now() - b.openedAt >= COOLDOWN_MS) {
    // half-open: allow one trial request through
    b.openedAt = 0;
    b.failures = FAILURE_THRESHOLD - 1;
    return true;
  }
  return false;
}

function recordSuccess(id: string) {
  const b = getBreaker(id);
  b.failures = 0;
  b.openedAt = 0;
}

function recordFailure(id: string) {
  const b = getBreaker(id);
  b.failures += 1;
  if (b.failures >= FAILURE_THRESHOLD) b.openedAt = Date.now();
}

// ── Router ────────────────────────────────────────────────────────────────────

const PER_PROVIDER_TIMEOUT_MS = 90_000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); },
           e => { clearTimeout(t); reject(e); });
  });
}

/**
 * Route a skill request through the failover chain.
 * @param registry all configured providers
 * @param req the skill request
 */
export async function routeSkill(registry: Provider[], req: SkillRequest): Promise<SkillResponse> {
  const candidates = registry
    .filter(p => p.supports.includes(req.skillId))
    .sort((a, b) => a.priority - b.priority);

  if (candidates.length === 0) {
    throw new Error(`No provider configured for skill "${req.skillId}"`);
  }

  let lastError: unknown = new Error('All providers failed');

  for (const provider of candidates) {
    if (!isAvailable(provider.id)) continue; // circuit open → skip fast
    try {
      const result = await withTimeout(provider.call(req), PER_PROVIDER_TIMEOUT_MS, provider.id);
      recordSuccess(provider.id);
      return { ...result, servedBy: provider.id };
    } catch (err) {
      lastError = err;
      recordFailure(provider.id);
      // try the next provider in the chain (incl. self-hosted backup)
    }
  }

  throw lastError;
}

/** Periodic health sweep — call from a cron to pre-open/close breakers. */
export async function sweepHealth(registry: Provider[]): Promise<Record<string, boolean>> {
  const out: Record<string, boolean> = {};
  await Promise.all(registry.map(async p => {
    try {
      const ok = await withTimeout(p.health(), 5_000, `${p.id}.health`);
      out[p.id] = ok;
      if (!ok) recordFailure(p.id); else recordSuccess(p.id);
    } catch {
      out[p.id] = false;
      recordFailure(p.id);
    }
  }));
  return out;
}

// ── Example registry (replace the call() bodies with real providers) ─────────

export const EXAMPLE_REGISTRY: Provider[] = [
  {
    id: 'gemini',
    priority: 10,
    supports: ['text-gen', 'text-sum', 'text-trans', 'text-rewrite', 'text-grammar', 'text-code', 'text-hashtag', 'website-gen', 'image-describe'],
    health: async () => true, // TODO: ping Gemini
    call: async (_req) => { throw new Error('wire Gemini SDK here'); },
  },
  {
    id: 'together',
    priority: 20,
    supports: ['image-gen', 'image-edit', 'stylize', 'text-gen', 'website-gen'],
    health: async () => true, // TODO: ping Together
    call: async (_req) => { throw new Error('wire Together SDK here'); },
  },
  // ── Self-hosted backups (highest priority number = last resort) ──
  {
    id: 'self-vllm',
    priority: 90,
    selfHosted: true,
    supports: ['text-gen', 'text-sum', 'text-trans', 'text-rewrite', 'text-grammar', 'text-code', 'text-hashtag', 'website-gen', 'image-describe'],
    health: async () => {
      const r = await fetch(`${process.env.SELF_VLLM_URL}/health`).catch(() => null);
      return !!r && r.ok;
    },
    call: async (req) => {
      // vLLM is OpenAI-compatible
      const r = await fetch(`${process.env.SELF_VLLM_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.SELF_VLLM_MODEL ?? 'rnai-llm',
          messages: [{ role: 'user', content: req.prompt ?? '' }],
        }),
      });
      if (!r.ok) throw new Error(`vLLM ${r.status}`);
      const data = await r.json();
      return { kind: 'text', content: data.choices?.[0]?.message?.content ?? '', servedBy: 'self-vllm', raw: data };
    },
  },
  {
    id: 'self-sdxl',
    priority: 90,
    selfHosted: true,
    supports: ['image-gen', 'image-edit', 'stylize', 'face-restore'],
    health: async () => {
      const r = await fetch(`${process.env.SELF_SDXL_URL}/health`).catch(() => null);
      return !!r && r.ok;
    },
    call: async (req) => {
      const r = await fetch(`${process.env.SELF_SDXL_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: req.prompt, image: req.image }),
      });
      if (!r.ok) throw new Error(`SDXL ${r.status}`);
      const data = await r.json();
      return { kind: 'image', content: data.url, servedBy: 'self-sdxl', raw: data };
    },
  },
  {
    id: 'self-piper',
    priority: 90,
    selfHosted: true,
    supports: ['audio-tts'],
    health: async () => {
      const r = await fetch(`${process.env.SELF_TTS_URL}/health`).catch(() => null);
      return !!r && r.ok;
    },
    call: async (req) => {
      const r = await fetch(`${process.env.SELF_TTS_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: req.prompt }),
      });
      if (!r.ok) throw new Error(`TTS ${r.status}`);
      const data = await r.json();
      return { kind: 'audio', content: data.url, servedBy: 'self-piper', raw: data };
    },
  },
];
