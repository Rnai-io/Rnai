/**
 * Rnai — Central API Layer
 *
 * Single place for all backend skill calls:
 * - Endpoint registry for every skill (ready / coming-soon flags)
 * - Timeout via AbortController
 * - Automatic retry with backoff (network / timeout / 5xx only)
 * - Safe JSON parsing (never throws on HTML error pages)
 * - Typed errors with bilingual (TH/EN) user-facing messages
 */

import * as SecureStore from 'expo-secure-store';

// ── Config ──────────────────────────────────────────────────────────────────

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://rnai-io.vercel.app',
  /**
   * Backup gateway URL(s) used for automatic failover when the primary backend
   * is unreachable or erroring (network / timeout / 5xx). Comma-separated, tried
   * in order after the primary. Point this at the self-hosted Rnai AI gateway.
   * e.g. EXPO_PUBLIC_API_FALLBACK_URL="https://gateway.rnai.io,https://backup.rnai.io"
   */
  fallbackBaseUrls: (process.env.EXPO_PUBLIC_API_FALLBACK_URL ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
  /** Build-time dev fallback only — per-user keys live in SecureStore. */
  apiKey: process.env.EXPO_PUBLIC_API_KEY ?? '',
  /** Generation can be slow — give the model time, but never hang forever. */
  timeoutMs: 90_000,
  /** Short timeout for health checks. */
  pingTimeoutMs: 5_000,
  /** Extra attempts after the first failure (retryable errors only). */
  maxRetries: 2,
  retryBackoffMs: 1_000,
};

// ── Types ───────────────────────────────────────────────────────────────────

export type ApiErrorCode =
  | 'not-configured' // skill has no backend endpoint yet
  | 'no-api-key'
  | 'timeout'
  | 'network'
  | 'auth'           // 401/403
  | 'no-credits'     // 402
  | 'rate-limit'     // 429
  | 'server'         // 5xx
  | 'bad-request'    // other 4xx
  | 'bad-response';  // non-JSON / unexpected body

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  /** Raw error text from the server, for diagnostics. */
  serverMessage?: string;
  constructor(code: ApiErrorCode, message: string, status?: number, serverMessage?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

export interface SkillInput {
  prompt: string;
  image?: string | null; // data URI
  /** Base64 audio (no data: prefix needed) for speech-to-text. */
  audio?: string | null;
  /** Extra skill-specific fields, e.g. { targetLanguage: 'Thai' } for translate. */
  extra?: Record<string, string>;
}

export interface SkillResult {
  kind: 'image' | 'text' | 'website' | 'audio';
  /** Image/audio URL, plain text, or HTML string. */
  content: string;
  raw?: any;
}

interface SkillEndpoint {
  path: string;
  /** false = backend endpoint not deployed yet → UI shows "Coming Soon". */
  ready: boolean;
  needsImage?: boolean;
  needsAudio?: boolean;
  buildPayload: (input: SkillInput) => Record<string, any>;
}

// ── Skill endpoint registry (all 16 skills) ─────────────────────────────────

export const SKILL_ENDPOINTS: Record<string, SkillEndpoint> = {
  'image-gen': {
    path: '/api/v1/generate', ready: true,
    buildPayload: ({ prompt }) => ({ prompt }),
  },
  'image-edit': {
    path: '/api/v1/edit', ready: true, needsImage: true,
    buildPayload: ({ prompt, image }) => ({ image, mask: image, prompt }),
  },
  'remove-bg': {
    path: '/api/v1/remove-background', ready: true, needsImage: true,
    buildPayload: ({ image }) => ({ image }),
  },
  'upscale': {
    path: '/api/v1/upscale', ready: true, needsImage: true,
    buildPayload: ({ image }) => ({ image }),
  },
  'text-gen': {
    path: '/api/v1/text/generate', ready: true,
    buildPayload: ({ prompt }) => ({ prompt }),
  },
  'website-gen': {
    path: '/api/v1/website/generate', ready: true,
    buildPayload: ({ prompt, extra }) => {
      const {
        template,
        siteName,
        siteType,
        colorTheme,
        sections,
        styleTone,
        siteLanguage,
      } = extra ?? {};

      // Build an enriched custom prompt from the structured options so the AI
      // has maximum context even if the backend doesn't consume every field.
      const optionLines: string[] = [];
      if (siteType) optionLines.push(`Website type: ${siteType}`);
      if (colorTheme) optionLines.push(`Color theme: ${colorTheme}`);
      if (sections) optionLines.push(`Include sections: ${sections}`);
      if (styleTone) optionLines.push(`Design style: ${styleTone}`);
      if (siteLanguage) optionLines.push(`Language: ${siteLanguage}`);

      const websiteCustomPrompt = optionLines.length > 0
        ? `${prompt}\n\n${optionLines.join('\n')}`
        : prompt;

      return {
        websiteName: siteName || 'My Website',
        websiteType: siteType || 'portfolio',
        template: template || 'wg-1',
        description: prompt,
        websiteCustomPrompt,
        customizations: {
          ...(colorTheme ? { colorTheme } : {}),
          ...(sections ? { sections } : {}),
          ...(styleTone ? { styleTone } : {}),
          ...(siteLanguage ? { language: siteLanguage } : {}),
        },
      };
    },
  },

  'stylize': {
    path: '/api/v1/stylize', ready: true, needsImage: true,
    buildPayload: ({ prompt, image }) => ({ image, prompt }),
  },
  'text-sum': {
    path: '/api/v1/text/summarize', ready: true,
    buildPayload: ({ prompt }) => ({ text: prompt }),
  },
  'text-trans': {
    path: '/api/v1/text/translate', ready: true,
    buildPayload: ({ prompt, extra }) => ({
      text: prompt,
      targetLanguage: extra?.targetLanguage ?? 'English',
    }),
  },
  'text-rewrite': {
    path: '/api/v1/text/rewrite', ready: true,
    buildPayload: ({ prompt, extra }) => ({
      text: prompt,
      ...(extra?.tone ? { tone: extra.tone } : {}),
    }),
  },
  'audio-tts': {
    path: '/api/v1/audio/tts', ready: true,
    buildPayload: ({ prompt }) => ({ text: prompt }),
  },

  // ── 5 New Skills ───────────────────────────────────────────────────────────

  /**
   * Analyse / describe an image with vision AI.
   * Routed through text/generate — the backend passes the image field to a
   * vision-capable model (e.g. GPT-4o via OpenRouter) when present.
   */
  'image-describe': {
    path: '/api/v1/text/generate', ready: true, needsImage: true,
    buildPayload: ({ image, prompt }) => ({
      prompt: prompt
        ? `Analyze this image and answer the following question: ${prompt}`
        : 'Analyze and describe this image in detail. Cover: main subjects, colors, style, mood, composition, any visible text, and notable details.',
      image, // vision-capable models pick this up when the backend forwards it
    }),
  },

  /**
   * Restore and enhance faces in old or blurry photos.
   * Routed through /api/v1/stylize with a restoration-focused prompt.
   * Returns an enhanced image URL.
   */
  'face-restore': {
    path: '/api/v1/stylize', ready: true, needsImage: true,
    buildPayload: ({ image }) => ({
      image,
      prompt: 'Photo restoration: sharpen and restore facial features, reduce blur and noise, enhance skin texture and fine detail, improve clarity and dynamic range while keeping a natural realistic appearance.',
    }),
  },

  /** Grammar and spelling correction — routed through text/generate */
  'text-grammar': {
    path: '/api/v1/text/generate', ready: true,
    buildPayload: ({ prompt }) => ({
      prompt: `You are a grammar editor. Correct ALL grammar, spelling, and punctuation errors in the following text. Return ONLY the corrected text with no explanations, no preamble, and no markdown:\n\n${prompt}`,
    }),
  },

  /** Code generation from natural language — routed through text/generate.
   *  mode:'code' makes the backend prefer the self-hosted Rnai LLM (tuned for code). */
  'text-code': {
    path: '/api/v1/text/generate', ready: true,
    buildPayload: ({ prompt, extra }) => ({
      prompt: `You are an expert ${extra?.language ?? 'JavaScript'} developer. Generate clean, well-commented ${extra?.language ?? 'JavaScript'} code for the following requirement. Return ONLY the code block with no extra explanation:\n\n${prompt}`,
      mode: 'code',
    }),
  },

  /** Social-media hashtag generator — routed through text/generate */
  'text-hashtag': {
    path: '/api/v1/text/generate', ready: true,
    buildPayload: ({ prompt, extra }) => {
      const platform = extra?.platform ?? 'Instagram';
      const count = extra?.count ?? '20';
      return {
        prompt: `Generate exactly ${count} trending hashtags for ${platform} based on the following content. Mix popular, mid-range, and niche hashtags. Include both English and relevant local-language hashtags if applicable. Return ONLY the hashtags as a single space-separated line, each starting with #, no numbering, no explanations:\n\n${prompt}`,
      };
    },
  },

  /** Speech-to-text — transcribe a recorded/uploaded audio clip */
  'audio-stt': {
    path: '/api/v1/audio/stt', ready: true, needsAudio: true,
    buildPayload: ({ audio }) => ({ audio }),
  },

  /** Structured data extraction from text → JSON */
  'text-extract': {
    path: '/api/v1/text/extract', ready: true,
    buildPayload: ({ prompt, extra }) => ({
      text: prompt,
      schema: extra?.schema?.trim()
        ? extra.schema
        : 'Extract the key entities, facts and fields from the text and return them as a clean JSON object.',
    }),
  },
};

export function isSkillReady(skillId: string): boolean {
  return SKILL_ENDPOINTS[skillId]?.ready === true;
}

// ── Per-user API key (SecureStore) ──────────────────────────────────────────

const API_KEY_STORE = 'rnai_user_api_key';
let cachedUserKey: string | null | undefined; // undefined = not loaded yet

/** Resolve the active key: user's own key first, dev fallback second. */
export async function getActiveApiKey(): Promise<string> {
  if (cachedUserKey === undefined) {
    try {
      cachedUserKey = await SecureStore.getItemAsync(API_KEY_STORE);
    } catch {
      cachedUserKey = null;
    }
  }
  return cachedUserKey || API_CONFIG.apiKey;
}

export async function getUserApiKey(): Promise<string | null> {
  if (cachedUserKey === undefined) {
    try {
      cachedUserKey = await SecureStore.getItemAsync(API_KEY_STORE);
    } catch {
      cachedUserKey = null;
    }
  }
  return cachedUserKey;
}

export async function setUserApiKey(key: string): Promise<void> {
  const trimmed = key.trim();
  await SecureStore.setItemAsync(API_KEY_STORE, trimmed);
  cachedUserKey = trimmed;
}

export async function clearUserApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORE);
  cachedUserKey = null;
}

/** Basic shape check before saving. */
export function looksLikeApiKey(key: string): boolean {
  return /^rnai_sk_[A-Za-z0-9_-]{16,}$/.test(key.trim());
}

/**
 * Validate a key against the backend WITHOUT consuming credits.
 * The platform checks auth before body validation, so an empty body
 * returns 400 for a valid key and 401 for an invalid one.
 */
export async function validateApiKey(key: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_CONFIG.baseUrl}/api/v1/text/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({}), // intentionally invalid — auth check happens first
    }, 20_000);
    return res.status !== 401 && res.status !== 403;
  } catch {
    return false;
  }
}

// ── Internals ───────────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new ApiError('timeout', `Request timed out after ${timeoutMs}ms`);
    }
    throw new ApiError('network', err?.message ?? 'Network request failed');
  } finally {
    clearTimeout(timer);
  }
}

async function safeJson(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { _rawText: text };
  }
}

function statusToError(status: number, body: any): ApiError {
  const serverMsg = typeof body?.error === 'string' ? body.error : undefined;
  if (status === 401 || status === 403) return new ApiError('auth', serverMsg ?? 'Unauthorized', status, serverMsg);
  if (status === 402) return new ApiError('no-credits', serverMsg ?? 'Insufficient credits', status, serverMsg);
  if (status === 429) return new ApiError('rate-limit', serverMsg ?? 'Too many requests', status, serverMsg);
  if (status >= 500) return new ApiError('server', serverMsg ?? `Server error (${status})`, status, serverMsg);
  return new ApiError('bad-request', serverMsg ?? `Request failed (${status})`, status, serverMsg);
}

function isRetryable(err: ApiError): boolean {
  return err.code === 'network' || err.code === 'timeout' || err.code === 'server';
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Quick reachability check for the backend (for offline banners).
 * Strategy: try HEAD on the base URL first (cheap, no auth needed),
 * fall back to a lightweight GET on a known API route so we don't
 * depend on a dedicated /status endpoint that may not exist.
 */
export async function pingApi(): Promise<boolean> {
  // 1️⃣ Try HEAD on the root — works on Vercel even without a route
  try {
    const res = await fetchWithTimeout(
      `${API_CONFIG.baseUrl}/`,
      { method: 'HEAD' },
      API_CONFIG.pingTimeoutMs,
    );
    // Any HTTP response (including 404/405) means the server is reachable
    if (res.status < 500) return true;
  } catch {
    // Network-level failure — fall through to secondary check
  }

  // 2️⃣ Fall back: POST to a real API route with an empty body.
  // Auth happens before body validation, so:
  //   401/403 → server is up (auth issue, not offline)
  //   400     → server is up (bad body, expected)
  //   5xx     → server is up but broken
  //   network error → truly offline
  try {
    const res = await fetchWithTimeout(
      `${API_CONFIG.baseUrl}/api/v1/text/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      },
      API_CONFIG.pingTimeoutMs,
    );
    return res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Execute a skill against the backend with timeout + retry.
 * Throws ApiError — use getErrorMessage(err, lang) for display text.
 */
export async function executeSkill(skillId: string, input: SkillInput): Promise<SkillResult> {
  const endpoint = SKILL_ENDPOINTS[skillId];
  if (!endpoint || !endpoint.ready) {
    throw new ApiError('not-configured', `Skill "${skillId}" is not available yet`);
  }
  const apiKey = await getActiveApiKey();
  if (!apiKey) {
    throw new ApiError('no-api-key', 'No API key — add your key in Profile > API Key');
  }
  if (endpoint.needsImage && !input.image) {
    throw new ApiError('bad-request', 'This skill requires an image');
  }
  if (endpoint.needsAudio && !input.audio) {
    throw new ApiError('bad-request', 'This skill requires audio');
  }

  const body = JSON.stringify(endpoint.buildPayload(input));

  // Failover chain: primary backend first, then any backup gateways. We only
  // move to the next base when the current one is DOWN (network/timeout/5xx) —
  // problems with the request itself (auth, credits, bad input) are thrown as-is.
  const bases = [API_CONFIG.baseUrl, ...API_CONFIG.fallbackBaseUrls];
  let lastError: ApiError = new ApiError('network', 'Request failed');

  for (let b = 0; b < bases.length; b++) {
    try {
      return await requestSkillOnce(`${bases[b]}${endpoint.path}`, body, apiKey, skillId);
    } catch (err: any) {
      const apiErr = err instanceof ApiError
        ? err
        : new ApiError('network', err?.message ?? 'Unknown error');
      lastError = apiErr;
      // Connectivity/outage → try the next (backup) base; otherwise stop.
      if (isRetryable(apiErr) && b < bases.length - 1) continue;
      throw apiErr;
    }
  }
  throw lastError;
}

/** One base URL with the configured retry/backoff. Throws ApiError. */
async function requestSkillOnce(
  url: string,
  body: string,
  apiKey: string,
  skillId: string,
): Promise<SkillResult> {
  let lastError: ApiError = new ApiError('network', 'Request failed');
  for (let attempt = 0; attempt <= API_CONFIG.maxRetries; attempt++) {
    if (attempt > 0) await sleep(API_CONFIG.retryBackoffMs * attempt);
    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      }, API_CONFIG.timeoutMs);

      const data = await safeJson(response);
      if (!response.ok) {
        lastError = statusToError(response.status, data);
        if (isRetryable(lastError)) continue;
        throw lastError;
      }
      return parseResult(skillId, data);
    } catch (err: any) {
      const apiErr = err instanceof ApiError
        ? err
        : new ApiError('network', err?.message ?? 'Unknown error');
      lastError = apiErr;
      if (!isRetryable(apiErr)) throw apiErr;
    }
  }
  throw lastError;
}

function parseResult(skillId: string, data: any): SkillResult {
  if (typeof data?.url === 'string') {
    const kind = skillId === 'audio-tts' ? 'audio' : 'image';
    return { kind, content: data.url, raw: data };
  }
  // image-describe returns { description: string }
  if (skillId === 'image-describe' && typeof data?.description === 'string') {
    return { kind: 'text', content: data.description, raw: data };
  }
  // text-grammar returns { corrected: string } or { result: string }
  if (skillId === 'text-grammar' && typeof data?.corrected === 'string') {
    return { kind: 'text', content: data.corrected, raw: data };
  }
  // text-code returns { code: string }
  if (skillId === 'text-code' && typeof data?.code === 'string') {
    return { kind: 'text', content: data.code, raw: data };
  }
  // text-hashtag returns { hashtags: string[] | string }
  if (skillId === 'text-hashtag') {
    if (Array.isArray(data?.hashtags)) {
      return { kind: 'text', content: data.hashtags.join(' '), raw: data };
    }
    if (typeof data?.hashtags === 'string') {
      return { kind: 'text', content: data.hashtags, raw: data };
    }
  }
  if (typeof data?.image === 'string') {
    return { kind: 'image', content: data.image, raw: data };
  }
  if (typeof data?.html === 'string') {
    return { kind: 'website', content: data.html, raw: data };
  }
  if (typeof data?.text === 'string') {
    return { kind: 'text', content: data.text, raw: data };
  }
  if (typeof data?._rawText === 'string' && data._rawText.length > 0) {
    throw new ApiError('bad-response', 'Server returned an unexpected response');
  }
  return { kind: 'text', content: JSON.stringify(data), raw: data };
}

// ── User-facing error messages (TH/EN) ─────────────────────────────────────

const ERROR_MESSAGES: Record<ApiErrorCode, { th: string; en: string }> = {
  'not-configured': {
    th: 'ฟีเจอร์นี้กำลังจะมาเร็วๆ นี้ 🚧',
    en: 'This feature is coming soon 🚧',
  },
  'no-api-key': {
    th: 'ยังไม่ได้ใส่ API Key — ไปที่ โปรไฟล์ > API Key เพื่อเพิ่มคีย์ของคุณ',
    en: 'No API key yet — add yours in Profile > API Key',
  },
  'timeout': {
    th: 'ใช้เวลานานเกินไป — ลองใหม่อีกครั้ง',
    en: 'The request took too long — please try again',
  },
  'network': {
    th: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
    en: 'Could not reach the server — check your connection and retry',
  },
  'auth': {
    th: 'การยืนยันตัวตนล้มเหลว — กรุณาเข้าสู่ระบบใหม่',
    en: 'Authentication failed — please sign in again',
  },
  'no-credits': {
    th: 'เครดิตไม่พอ — ดูยอดและเติมเครดิตได้ที่ rnai-io.vercel.app/dashboard',
    en: 'Not enough credits — check your balance at rnai-io.vercel.app/dashboard',
  },
  'rate-limit': {
    th: 'มีการใช้งานหนาแน่น — รอสักครู่แล้วลองใหม่',
    en: 'Too many requests — please wait a moment and retry',
  },
  'server': {
    th: 'เซิร์ฟเวอร์ขัดข้องชั่วคราว — ลองใหม่อีกครั้ง',
    en: 'Server hiccup — please try again',
  },
  'bad-request': {
    th: 'คำขอไม่ถูกต้อง — ตรวจสอบข้อมูลที่กรอกแล้วลองใหม่',
    en: 'Invalid request — check your input and retry',
  },
  'bad-response': {
    th: 'ได้รับข้อมูลผิดรูปแบบจากเซิร์ฟเวอร์ — ลองใหม่อีกครั้ง',
    en: 'Unexpected server response — please try again',
  },
};

// ── TrueMoney e-Voucher Redemption ─────────────────────────────────────────

export interface TrueMoneyRedeemResult {
  /** Amount in THB that was redeemed (e.g. 50) */
  amountBaht: number;
  /** Rnai credits added to the account */
  creditsAdded: number;
  /** Backend transaction ID for receipt */
  transactionId: string;
}

/**
 * Redeem a TrueMoney Gift Voucher (e-Voucher) for Rnai credits.
 *
 * Accepts either the full gift URL or just the hash code:
 *   - https://gift.truemoney.com/campaign/?v=<HASH>
 *   - <HASH> (16-char alphanumeric)
 *
 * Backend endpoint: POST /api/v1/payments/truemoney/redeem
 * Required fields: { voucher_hash, api_key }
 * Returns: { amount_baht, credits_added, transaction_id }
 */
export async function redeemTrueMoneyVoucher(
  voucherInput: string,
): Promise<TrueMoneyRedeemResult> {
  const apiKey = await getActiveApiKey();
  if (!apiKey) throw new ApiError('no-api-key', 'No API key — add yours in Profile > API Key');

  // Extract hash from full URL if user pasted the link
  const hashMatch =
    voucherInput.match(/[?&]v=([A-Za-z0-9]+)/) ??
    voucherInput.match(/^([A-Za-z0-9]{16,})$/);
  const voucherHash = hashMatch?.[1] ?? voucherInput.trim();

  if (!voucherHash) throw new ApiError('bad-request', 'Invalid voucher input');

  const url = `${API_CONFIG.baseUrl}/api/v1/payments/truemoney/redeem`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ voucher_hash: voucherHash }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) throw new ApiError('auth', data?.message);
    if (res.status === 402) throw new ApiError('no-credits', data?.message);
    if (res.status === 429) throw new ApiError('rate-limit', data?.message);
    if (res.status === 400) throw new ApiError('bad-request', data?.message ?? 'Voucher invalid or already used');
    if (!res.ok) throw new ApiError('server', data?.message);

    return {
      amountBaht: data.amount_baht ?? 0,
      creditsAdded: data.credits_added ?? 0,
      transactionId: data.transaction_id ?? '',
    };
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error)?.name === 'AbortError') throw new ApiError('timeout', 'Request timed out');
    if (err instanceof ApiError) throw err;
    throw new ApiError('network', 'Network error');
  }
}

export function getErrorMessage(error: unknown, lang: string): string {
  const key: 'th' | 'en' = lang === 'th' ? 'th' : 'en';
  if (error instanceof ApiError) {
    const base = ERROR_MESSAGES[error.code][key];
    // Append the server's own message for easier diagnosis
    return error.serverMessage && error.serverMessage !== base
      ? `${base}\n(${error.serverMessage})`
      : base;
  }
  return ERROR_MESSAGES.network[key];
}
