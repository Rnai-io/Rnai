/**
 * Rnai — In-app authentication (Phase B)
 *
 * Flow: Firebase Auth (email/password via REST) → init user on platform
 * (/api/auth/session grants 200 free credits on first signup) → mint a
 * per-user API key (/api/keys with Bearer idToken) → store in SecureStore.
 *
 * No backend changes required — the platform's verifyToken() already
 * accepts Firebase ID tokens as Bearer auth.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, setUserApiKey, clearUserApiKey } from './api';

// Firebase *web* API key — public client identifier by design (same value
// that ships in the rnai-io.vercel.app frontend bundle). Not a secret.
const FIREBASE_API_KEY = 'AIzaSyClvommZRbP7-s0ZoU8-bb4zKPMgZJ8FT4';
const IDENTITY_BASE = 'https://identitytoolkit.googleapis.com/v1';

export interface AuthResult {
  email: string;
  uid: string;
  apiKeyPrefix: string;
}

export class AuthError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

const FIREBASE_ERROR_MESSAGES: Record<string, { th: string; en: string }> = {
  EMAIL_EXISTS: {
    th: 'อีเมลนี้สมัครไว้แล้ว — ลองเข้าสู่ระบบแทน',
    en: 'This email is already registered — try signing in instead.',
  },
  EMAIL_NOT_FOUND: {
    th: 'ไม่พบบัญชีนี้ — ลองสมัครสมาชิกใหม่',
    en: 'Account not found — try signing up.',
  },
  INVALID_PASSWORD: {
    th: 'รหัสผ่านไม่ถูกต้อง',
    en: 'Incorrect password.',
  },
  INVALID_LOGIN_CREDENTIALS: {
    th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    en: 'Incorrect email or password.',
  },
  WEAK_PASSWORD: {
    th: 'รหัสผ่านสั้นเกินไป — ต้องมีอย่างน้อย 6 ตัวอักษร',
    en: 'Password too weak — at least 6 characters.',
  },
  INVALID_EMAIL: {
    th: 'รูปแบบอีเมลไม่ถูกต้อง',
    en: 'Invalid email format.',
  },
  TOO_MANY_ATTEMPTS_TRY_LATER: {
    th: 'พยายามหลายครั้งเกินไป — รอสักครู่แล้วลองใหม่',
    en: 'Too many attempts — please wait and try again.',
  },
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: {
    th: 'เพื่อความปลอดภัย กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่ ก่อนลบบัญชี',
    en: 'For security, please sign out and sign in again before deleting your account.',
  },
  NETWORK: {
    th: 'เชื่อมต่อไม่ได้ — ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
    en: 'Connection failed — check your internet and retry.',
  },
  UNKNOWN: {
    th: 'เกิดข้อผิดพลาด — ลองใหม่อีกครั้ง',
    en: 'Something went wrong — please try again.',
  },
};

export function getAuthErrorMessage(error: unknown, lang: string): string {
  const key: 'th' | 'en' = lang === 'th' ? 'th' : 'en';
  if (error instanceof AuthError) {
    // Firebase sometimes appends details, e.g. "WEAK_PASSWORD : ..."
    const base = error.code.split(' ')[0].split(':')[0];
    return (FIREBASE_ERROR_MESSAGES[base] ?? FIREBASE_ERROR_MESSAGES.UNKNOWN)[key];
  }
  return FIREBASE_ERROR_MESSAGES.NETWORK[key];
}

async function firebaseAuthRequest(
  endpoint: 'signUp' | 'signInWithPassword',
  email: string,
  password: string,
): Promise<{ idToken: string; refreshToken: string; localId: string; email: string }> {
  let res: Response;
  try {
    res = await fetch(`${IDENTITY_BASE}/accounts:${endpoint}?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
  } catch {
    throw new AuthError('NETWORK', 'Network request failed');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AuthError(data?.error?.message ?? 'UNKNOWN', 'Firebase auth failed');
  }
  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    localId: data.localId,
    email: data.email ?? email,
  };
}

/** Initialize the user on the platform (creates user doc + free credits on first login). */
async function initPlatformSession(idToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/api/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Mint a fresh per-user API key using the Firebase ID token. */
async function mintApiKey(idToken: string): Promise<{ key: string; keyPrefix: string }> {
  let res: Response;
  try {
    res = await fetch(`${API_CONFIG.baseUrl}/api/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ name: `Mobile App (${new Date().toISOString().slice(0, 10)})` }),
    });
  } catch {
    throw new AuthError('NETWORK', 'Network request failed');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data?.key !== 'string') {
    throw new AuthError('UNKNOWN', data?.error ?? 'Could not create API key');
  }
  return { key: data.key, keyPrefix: data.keyPrefix ?? data.key.slice(0, 16) + '...' };
}

/**
 * Full flow: authenticate → init platform user → mint key → store securely.
 */
export async function signInAndProvisionKey(
  email: string,
  password: string,
  mode: 'signin' | 'signup',
): Promise<AuthResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const { idToken, refreshToken, localId } = await firebaseAuthRequest(
    mode === 'signup' ? 'signUp' : 'signInWithPassword',
    trimmedEmail,
    password,
  );
  // Keep refresh token so the app can re-init the platform user later if needed
  try { await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken); } catch { /* non-fatal */ }
  // Platform init creates the user doc + 200 free credits — retry once on failure
  let initOk = await initPlatformSession(idToken);
  if (!initOk) initOk = await initPlatformSession(idToken);
  const { key, keyPrefix } = await mintApiKey(idToken);
  await setUserApiKey(key);
  const result: AuthResult = { email: trimmedEmail, uid: localId, apiKeyPrefix: keyPrefix };
  await saveAuthProfile(result);
  return result;
}

// ── Platform user recovery (self-healing for 402 errors) ───────────────────

const REFRESH_TOKEN_KEY = 'rnai_refresh_token';

/**
 * Re-initialize the platform user (creates user doc + free credits if
 * missing) using the stored refresh token. Returns true on success.
 * Call when API requests fail with "Insufficient credits" on a fresh account.
 */
/** Exchange the stored refresh token for a fresh Firebase ID token. */
export async function getFreshIdToken(): Promise<string | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;
    const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && typeof data?.id_token === 'string' ? data.id_token : null;
  } catch {
    return null;
  }
}

export async function ensurePlatformUser(): Promise<boolean> {
  const idToken = await getFreshIdToken();
  if (!idToken) return false;
  return initPlatformSession(idToken);
}

// ── Account data & management ───────────────────────────────────────────────

export interface BillingInfo {
  freeCreditsRemaining: number;
  paidCreditsBalance: number;
}

/** Fetch the user's real credit balance from the platform. */
export async function fetchBilling(): Promise<BillingInfo | null> {
  try {
    const idToken = await getFreshIdToken();
    if (!idToken) return null;
    const res = await fetch(`${API_CONFIG.baseUrl}/api/billing/me`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data) return null;
    return {
      freeCreditsRemaining: Number(data.freeCreditsRemaining) || 0,
      paidCreditsBalance: Number(data.paidCreditsBalance) || 0,
    };
  } catch {
    return null;
  }
}

export interface LedgerEntry {
  id: string;
  type: string;            // free_grant | charge | refund | topup
  credits: number;         // negative = spent
  balanceAfter: number;
  ref: string | null;
  createdAt: string | null;
}

export interface LedgerInfo {
  entries: LedgerEntry[];
  /** Total credits ever spent — shown as RNAI reward points. */
  lifetimeSpent: number;
}

/** Fetch the user's credit transaction history (wallet statement). */
export async function fetchLedger(limit = 25): Promise<LedgerInfo | null> {
  try {
    const idToken = await getFreshIdToken();
    if (!idToken) return null;
    const res = await fetch(`${API_CONFIG.baseUrl}/api/billing/ledger?limit=${limit}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || !Array.isArray(data.entries)) return null;
    return { entries: data.entries, lifetimeSpent: Number(data.lifetimeSpent) || 0 };
  } catch {
    return null;
  }
}

export interface MyRank {
  rank: number | null;
  points: number;
  eligible: boolean;
  pool: number;
  period: string;
}

/** Fetch the user's live monthly leaderboard rank. */
export async function fetchMyRank(): Promise<MyRank | null> {
  try {
    const idToken = await getFreshIdToken();
    if (!idToken) return null;
    const res = await fetch(`${API_CONFIG.baseUrl}/api/rewards/leaderboard`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data?.me) return null;
    return {
      rank: data.me.rank ?? null,
      points: Number(data.me.points) || 0,
      eligible: !!data.me.eligible,
      pool: Number(data.pool) || 0,
      period: data.period ?? '',
    };
  } catch {
    return null;
  }
}

/**
 * Permanently delete the Firebase account, then clear local state.
 * Throws AuthError — may require recent login (CREDENTIAL_TOO_OLD_LOGIN_AGAIN).
 */
export async function deleteAccount(): Promise<void> {
  const idToken = await getFreshIdToken();
  if (!idToken) throw new AuthError('UNKNOWN', 'Not signed in');
  let res: Response;
  try {
    res = await fetch(`${IDENTITY_BASE}/accounts:delete?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } catch {
    throw new AuthError('NETWORK', 'Network request failed');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new AuthError(data?.error?.message ?? 'UNKNOWN', 'Account deletion failed');
  }
  await signOut();
}

// ── Session persistence ─────────────────────────────────────────────────────

const AUTH_PROFILE_KEY = '@rnai/auth-profile';
const AUTH_SKIPPED_KEY = '@rnai/auth-skipped';

export async function saveAuthProfile(profile: AuthResult): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
  } catch { /* non-fatal */ }
}

export async function loadAuthProfile(): Promise<AuthResult | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Sign out: forget the profile, the device API key, the refresh token, and the guest-skip flag. */
export async function signOut(): Promise<void> {
  try { await AsyncStorage.multiRemove([AUTH_PROFILE_KEY, AUTH_SKIPPED_KEY]); } catch { /* ignore */ }
  try { await clearUserApiKey(); } catch { /* ignore */ }
  try { await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY); } catch { /* ignore */ }
}

/** Remember that the user chose to continue as guest. */
export async function setAuthSkipped(): Promise<void> {
  try { await AsyncStorage.setItem(AUTH_SKIPPED_KEY, '1'); } catch { /* ignore */ }
}

export async function wasAuthSkipped(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(AUTH_SKIPPED_KEY)) === '1';
  } catch {
    return false;
  }
}

// ── Free cloud AI chat (Gemini via the Rnai platform) ───────────────────

/**
 * Chat with Gemini through the platform — free for signed-in users.
 * Uses the stored refresh token to authenticate. Throws AuthError.
 */
export async function geminiChat(message: string): Promise<string> {
  const idToken = await getFreshIdToken();
  if (!idToken) {
    throw new AuthError('UNKNOWN', 'Sign in required for cloud chat');
  }
  let res: Response;
  try {
    res = await fetch(`${API_CONFIG.baseUrl}/api/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw new AuthError('NETWORK', 'Network request failed');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data?.text !== 'string') {
    throw new AuthError('UNKNOWN', data?.error ?? 'Gemini chat failed');
  }
  return data.text;
}

/**
 * Chat with the self-hosted Rnai LLM (the fine-tuned model) — free for signed-in
 * users. First message after idle may be slow (model cold-start). Throws AuthError.
 */
export async function rnaiChat(message: string): Promise<string> {
  const idToken = await getFreshIdToken();
  if (!idToken) {
    throw new AuthError('UNKNOWN', 'Sign in required for Rnai chat');
  }
  let res: Response;
  try {
    res = await fetch(`${API_CONFIG.baseUrl}/api/rnai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw new AuthError('NETWORK', 'Network request failed');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data?.text !== 'string') {
    throw new AuthError('UNKNOWN', data?.error ?? 'Rnai chat failed');
  }
  return data.text;
}

// ── Password reset ──────────────────────────────────────────────────────────

/** Send a Firebase password-reset email. */
export async function sendPasswordReset(email: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${IDENTITY_BASE}/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestType: 'PASSWORD_RESET', email: email.trim().toLowerCase() }),
    });
  } catch {
    throw new AuthError('NETWORK', 'Network request failed');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new AuthError(data?.error?.message ?? 'UNKNOWN', 'Password reset failed');
  }
}
