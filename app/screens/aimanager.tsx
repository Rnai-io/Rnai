/**
 * Rnai.io — AI Manager Screen
 *
 * LEGAL NOTICE:
 * - AI model management: Fully legal (open-source, local)
 * - Wallet display / address / QR: Fully legal (display only)
 * - Receive address: Legal (no transaction processing)
 * - Send/Swap/Transaction features: Marked "Coming Soon"
 *   — Will require KYC/AML verification and compliance with
 *     applicable financial regulations (e.g., Thailand SEC/BOT)
 *     before enabling in a future release.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, Dimensions,
  ActivityIndicator, Linking, Clipboard,
} from 'react-native';
import WebView from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { connectOllama, ollamaChat } from '../services/ollama';
import { geminiChat, fetchBilling, fetchLedger, fetchMyRank, LedgerEntry, MyRank } from '../services/auth';
import { redeemTrueMoneyVoucher, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');

// ── Helpers ────────────────────────────────────────────────────────────────

/** Derives a deterministic display-only receive address from the user's UID. */
function deriveDisplayAddress(uid: string): string {
  let h = 5381;
  for (let i = 0; i < uid.length; i++) {
    h = ((h << 5) + h) ^ uid.charCodeAt(i);
    h = h >>> 0;
  }
  const seed = uid.replace(/[^a-fA-F0-9]/g, '').padEnd(32, '0').substring(0, 32);
  const suffix = h.toString(16).padStart(8, '0');
  return `0x${seed}${suffix}`.substring(0, 42);
}

function qrHtml(text: string, dark: string): string {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:transparent;display:flex;justify-content:center;align-items:center;height:100vh;}</style></head><body><div id="q"></div><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><script>new QRCode(document.getElementById("q"),{text:${JSON.stringify(text)},width:160,height:160,colorDark:${JSON.stringify(dark)},colorLight:"#FFFFFF",correctLevel:QRCode.CorrectLevel.M});<\/script></body></html>`;
}

const CREDIT_PACKAGES = [
  { credits: 600,    price: '$5',   label: 'Starter',    emoji: '🌱', popular: false, labelTh: 'สตาร์ทเตอร์' },
  { credits: 2500,   price: '$20',  label: 'Pro',        emoji: '🚀', popular: true,  labelTh: 'โปร' },
  { credits: 13500,  price: '$100', label: 'Enterprise', emoji: '💼', popular: false, labelTh: 'องค์กร' },
];

// ── AI Models ──────────────────────────────────────────────────────────────

const AI_MODELS = [
  {
    id: 'rnai-gemini',
    name: 'Rnai Cloud Chat',
    param: 'Gemini 2.5',
    provider: 'Google × Rnai.io',
    description: 'Free cloud AI chat for signed-in users. Works instantly — no setup, no downloads, powered by Gemini Flash.',
    descriptionTh: 'แชท AI คลาวด์ฟรีสำหรับผู้ที่เข้าสู่ระบบ ใช้ได้ทันที ไม่ต้องติดตั้งอะไร ขับเคลื่อนด้วย Gemini Flash',
    tags: ['Free', 'Cloud', 'Instant'],
    size: '—',
    license: 'Rnai.io',
    status: 'featured',
    icon: '✨',
    color: ['#9333EA', '#6D28D9'] as [string, string],
    url: 'https://rnai-io.vercel.app',
    ollamaTag: undefined as string | undefined,
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    param: '7B',
    provider: 'DeepSeek',
    description: 'Powerful open-source reasoning model. Excels at math, code, and complex thinking.',
    descriptionTh: 'โมเดลโอเพนซอร์สสายคิดวิเคราะห์ เก่งคณิตศาสตร์ โค้ด และการคิดซับซ้อน',
    tags: ['Reasoning', 'Code', 'Math'],
    size: '4.7 GB',
    license: 'MIT',
    status: 'available',
    icon: '🧠',
    color: ['#0EA5E9', '#0284C7'] as [string, string],
    url: 'https://github.com/deepseek-ai/DeepSeek-R1',
    ollamaTag: 'deepseek-r1' as string | undefined,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    param: 'Any',
    provider: 'Ollama',
    description: 'Run any open-source model locally on your Mac/PC. Connect from this device via LAN.',
    descriptionTh: 'รันโมเดลโอเพนซอร์สบน Mac/PC ของคุณเอง แล้วเชื่อมต่อจากมือถือผ่าน WiFi บ้าน',
    tags: ['Local', 'Privacy', 'Custom'],
    size: '—',
    license: 'MIT',
    status: 'connect',
    icon: '🦙',
    color: ['#10B981', '#059669'] as [string, string],
    url: 'https://ollama.ai',
    ollamaTag: undefined as string | undefined,
  },
  {
    id: 'llama3',
    name: 'Llama 3.2',
    param: '3B',
    provider: 'Meta',
    description: "Meta's latest mobile-optimized LLM. Fast and capable on-device inference.",
    descriptionTh: 'LLM รุ่นล่าสุดจาก Meta ปรับแต่งมาเพื่ออุปกรณ์พกพา เร็วและเก่ง',
    tags: ['Chat', 'Mobile', 'Fast'],
    size: '2.0 GB',
    license: 'Llama 3',
    status: 'available',
    icon: '🦙',
    color: ['#8B5CF6', '#6D28D9'] as [string, string],
    url: 'https://llama.meta.com',
    ollamaTag: 'llama3.2' as string | undefined,
  },
  {
    id: 'gemma2',
    name: 'Gemma 2',
    param: '2B',
    provider: 'Google',
    description: "Google's lightweight open model. Great multilingual support and efficiency.",
    descriptionTh: 'โมเดลเปิดน้ำหนักเบาจาก Google รองรับหลายภาษาและประหยัดทรัพยากร',
    tags: ['Efficient', 'Multilingual', 'Chat'],
    size: '1.6 GB',
    license: 'Gemma',
    status: 'available',
    icon: '💎',
    color: ['#F59E0B', '#D97706'] as [string, string],
    url: 'https://ai.google.dev/gemma',
    ollamaTag: 'gemma2:2b' as string | undefined,
  },
  {
    id: 'phi3',
    name: 'Phi-3 Mini',
    param: '3.8B',
    provider: 'Microsoft',
    description: "Microsoft's small but mighty model. Best-in-class for its size.",
    descriptionTh: 'โมเดลเล็กพริกขี้หนูจาก Microsoft ดีที่สุดในรุ่นขนาดเดียวกัน',
    tags: ['Fast', 'Code', 'Reasoning'],
    size: '2.3 GB',
    license: 'MIT',
    status: 'available',
    icon: '⚡',
    color: ['#3B82F6', '#1D4ED8'] as [string, string],
    url: 'https://azure.microsoft.com/en-us/blog/phi-3',
    ollamaTag: 'phi3' as string | undefined,
  },
  {
    id: 'mistral',
    name: 'Mistral 7B',
    param: '7B',
    provider: 'Mistral AI',
    description: 'Top open-source 7B model. Excellent for instruction following and code.',
    descriptionTh: 'โมเดลโอเพนซอร์ส 7B ระดับท็อป เก่งการทำตามคำสั่งและเขียนโค้ด',
    tags: ['General', 'Code', 'Instruct'],
    size: '4.1 GB',
    license: 'Apache 2.0',
    status: 'available',
    icon: '🌊',
    color: ['#EC4899', '#DB2777'] as [string, string],
    url: 'https://mistral.ai',
    ollamaTag: 'mistral' as string | undefined,
  },
];

// ── Main Screen ───────────────────────────────────────────────────────────

export default function AiManagerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t, lang } = useLanguage();
  const { user: authUser } = useAuth();
  const isTh = lang === 'th';
  const modelDesc = (m: typeof AI_MODELS[number]) =>
    isTh && (m as any).descriptionTh ? (m as any).descriptionTh : m.description;
  const isVibrant = scheme === 'vibrant';
  const AI = t.aiManager; // shorthand

  // ── Model runtime: where a model actually runs ───────────────────────────────
  // 'cloud' = Rnai cloud (Gemini), works instantly when signed in.
  // 'lan'   = runs via the user's own Ollama server over LAN (needs connecting).
  const isCloudModel = (m: typeof AI_MODELS[number]) => m.id === 'rnai-gemini';
  const isLanModel = (m: typeof AI_MODELS[number]) => !isCloudModel(m);
  /** Is this specific model usable right now? */
  const modelReady = (m: typeof AI_MODELS[number]) => isCloudModel(m) ? !!authUser : ollamaConnected;
  /** Greeting shown when a model is selected — honest about how to use it. */
  const modelGreeting = (m: typeof AI_MODELS[number]) => {
    if (isCloudModel(m)) {
      if (!authUser) return isTh
        ? '🔐 เข้าสู่ระบบก่อนเพื่อใช้แชทคลาวด์ฟรี — ไปที่ โปรไฟล์ > API Key'
        : '🔐 Sign in to use free cloud chat — go to Profile > API Key.';
      return isTh
        ? `สวัสดีครับ! ผมคือ ${m.name} (คลาวด์ฟรี) มีอะไรให้ช่วยไหมครับ?`
        : `Hello! I'm ${m.name} (free cloud). How can I help you?`;
    }
    if (ollamaConnected) return isTh
      ? `เชื่อมต่อ Ollama แล้ว — ${m.name} พร้อมใช้งาน มีอะไรให้ช่วยไหมครับ?`
      : `Ollama connected — ${m.name} is ready. How can I help you?`;
    return isTh
      ? `💡 ${m.name} ทำงานผ่าน Ollama บนคอมพิวเตอร์ของคุณ — กดการ์ด Ollama เพื่อเชื่อมต่อก่อน หรือสลับไปใช้ ✨ Rnai Cloud Chat ที่ใช้ได้ฟรีทันที`
      : `💡 ${m.name} runs via Ollama on your computer — tap the Ollama card to connect first, or switch to ✨ Rnai Cloud Chat which works instantly for free.`;
  };
  /** Short runtime badge text for a model card. */
  const modelRuntimeBadge = (m: typeof AI_MODELS[number]) => {
    if (isCloudModel(m)) return isTh ? 'ฟรี · คลาวด์' : 'Free · Cloud';
    if (m.id === 'ollama') return ollamaConnected ? (isTh ? '✓ เชื่อมต่อแล้ว' : '✓ Connected') : (isTh ? 'เชื่อมต่อ LAN' : 'Connect LAN');
    return ollamaConnected ? (isTh ? '✓ พร้อมใช้ผ่าน Ollama' : '✓ Ready via Ollama') : (isTh ? 'ต้องใช้ Ollama' : 'Needs Ollama');
  };

  const [activeTab, setActiveTab] = useState<'models' | 'wallet'>('models');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [ollamaUrl, setOllamaUrl] = useState('http://192.168.1.x:11434');
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [ollamaModelName, setOllamaModelName] = useState<string | null>(null);
  const [ollamaConnecting, setOllamaConnecting] = useState(false);
  const [showOllamaModal, setShowOllamaModal] = useState(false);
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [detailModel, setDetailModel] = useState(AI_MODELS[0]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: isTh
        ? '✨ Rnai Cloud Chat — แชท AI ฟรีสำหรับสมาชิก พิมพ์ข้อความด้านล่างได้เลย!'
        : '✨ Rnai Cloud Chat — free AI chat for members. Type a message below to start!',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // ── Wallet UI state ──
  const [showReceive, setShowReceive] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [ledgerFilter, setLedgerFilter] = useState<string | null>(null);
  const [showSend, setShowSend] = useState(false);
  const [sendToken, setSendToken] = useState<'ETH' | 'USDT' | 'BNB'>('USDT');

  // ── TrueMoney voucher state ──
  const [showTMModal, setShowTMModal] = useState(false);
  const [tmVoucher, setTmVoucher] = useState('');
  const [tmRedeeming, setTmRedeeming] = useState(false);

  // ── Real wallet data (credits + ledger from the platform) ──
  const [walletBilling, setWalletBilling] = useState<{ free: number; paid: number } | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [rnaiPoints, setRnaiPoints] = useState(0);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const loadWallet = React.useCallback(async () => {
    if (!authUser) { setWalletBilling(null); setLedgerEntries([]); setRnaiPoints(0); setMyRank(null); return; }
    setWalletLoading(true);
    try {
      const [billing, ledger, rank] = await Promise.all([fetchBilling(), fetchLedger(25), fetchMyRank()]);
      if (billing) setWalletBilling({ free: billing.freeCreditsRemaining, paid: billing.paidCreditsBalance });
      if (ledger) { setLedgerEntries(ledger.entries); setRnaiPoints(ledger.lifetimeSpent); }
      setMyRank(rank);
    } finally {
      setWalletLoading(false);
    }
  }, [authUser]);

  React.useEffect(() => {
    if (activeTab === 'wallet') loadWallet();
  }, [activeTab, loadWallet]);

  const ledgerMeta = (type: string): { icon: string; label: string } => {
    switch (type) {
      case 'free_grant': return { icon: '🎁', label: isTh ? 'โบนัสสมัครสมาชิก' : 'Signup bonus' };
      case 'charge':     return { icon: '⚡', label: isTh ? 'ใช้สร้างผลงาน' : 'Generation' };
      case 'refund':     return { icon: '↩️', label: isTh ? 'คืนเครดิต' : 'Refund' };
      case 'topup':      return { icon: '💳', label: isTh ? 'เติมเครดิต' : 'Top up' };
      case 'reward':     return { icon: '🏆', label: isTh ? 'รางวัลประจำเดือน' : 'Monthly reward' };
      default:           return { icon: '•', label: type };
    }
  };

  const gradientBg: [string, string, string] = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background, colors.background];

  const handleChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput('');
    const history = [...chatMessages, { role: 'user' as const, text }];
    setChatMessages(history);
    setChatLoading(true);

    try {
      // ── 1. Rnai Cloud (Gemini) — free, works instantly when signed in ──
      if (selectedModel.id === 'rnai-gemini') {
        if (!authUser) {
          setChatMessages(prev => [...prev, {
            role: 'ai',
            text: lang === 'th'
              ? '🔐 เข้าสู่ระบบก่อนเพื่อใช้แชทคลาวด์ฟรี — ไปที่ โปรไฟล์ > API Key'
              : '🔐 Sign in to use free cloud chat — go to Profile > API Key.',
          }]);
          return;
        }
        const reply = await geminiChat(text);
        setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
        return;
      }

      // ── 2. Local inference via Ollama (selected model's tag, or default) ──
      const ollamaModel = selectedModel.id === 'ollama'
        ? ollamaModelName
        : (selectedModel as any).ollamaTag as string | undefined;
      if (ollamaConnected && ollamaModel) {
        const reply = await ollamaChat(
          ollamaUrl,
          ollamaModel,
          history.map(m => ({
            role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
            content: m.text,
          })),
        );
        setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
        return;
      }

      // ── 3. Not connected — guide the user instead of a fake reply ──
      setChatMessages(prev => [...prev, {
        role: 'ai',
        text: lang === 'th'
          ? `💡 โมเดล ${selectedModel.name} ทำงานผ่าน Ollama บนคอมพิวเตอร์ของคุณ — เชื่อมต่อ Ollama ก่อน (กดการ์ด Ollama) หรือสลับไปใช้ ✨ Rnai Cloud Chat ที่ใช้ได้ฟรีทันที`
          : `💡 ${selectedModel.name} runs via Ollama on your computer — connect Ollama first (tap the Ollama card), or switch to ✨ Rnai Cloud Chat which works instantly for free.`,
      }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        role: 'ai',
        text: `⚠️ ${err?.message ?? (lang === 'th' ? 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง' : 'Something went wrong — please try again.')}`,
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const card = (children: React.ReactNode, style?: object) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? 20 : 12,
      ...(isVibrant ? {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 16, elevation: 5,
      } : { borderWidth: 1, borderColor: colors.borders }),
      ...style,
    }}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientBg}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        {/* ── Header ── */}
        <View style={{ paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.xl, paddingBottom: SPACING.lg }}>
          <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
            {AI?.subtitle ?? 'Intelligence Hub'}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 28, fontWeight: '800' }}>
              {AI?.title ?? 'AI Manager'}
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: `${colors.success ?? '#10B981'}15`,
              borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 5,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success ?? '#10B981' }} />
              <Text style={{ color: colors.success ?? '#10B981', ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                {selectedModel.name} {AI?.activeLabel ?? 'Active'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Tab Switcher ── */}
        <View style={{
          flexDirection: 'row',
          marginHorizontal: LAYOUT.screenPadding,
          backgroundColor: colors.borders,
          borderRadius: BORDER_RADIUS.full,
          padding: 3, marginBottom: SPACING.xl,
        }}>
          {(['models', 'wallet'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1, paddingVertical: SPACING.sm + 2,
                borderRadius: BORDER_RADIUS.full,
                backgroundColor: activeTab === tab ? colors.surface : 'transparent',
                alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6,
                ...(activeTab === tab && isVibrant && {
                  shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
                }),
              }}
            >
              <Ionicons
                name={tab === 'models' ? 'hardware-chip-outline' : 'wallet-outline'}
                size={15}
                color={activeTab === tab ? colors.primary : colors.text.tertiary}
              />
              <Text style={{
                ...TYPOGRAPHY.caption, fontWeight: '700',
                color: activeTab === tab ? colors.primary : colors.text.tertiary,
              }}>
                {tab === 'models' ? (AI?.tabs?.models ?? 'AI Models') : (AI?.tabs?.wallet ?? 'Wallet')}
              </Text>
              {tab === 'wallet' && walletBilling && (
                <View style={{
                  backgroundColor: `${colors.success ?? '#10B981'}20`, borderRadius: 6,
                  paddingHorizontal: 5, paddingVertical: 1,
                }}>
                  <Text style={{ color: colors.success ?? '#10B981', fontSize: 8, fontWeight: '800' }}>
                    {(walletBilling.free + walletBilling.paid).toLocaleString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + LAYOUT.tabBarHeight + SPACING.xl }}
        >

          {/* ════════════════════════════════════════
              AI MODELS TAB
          ════════════════════════════════════════ */}
          {activeTab === 'models' && (
            <View style={{ paddingHorizontal: LAYOUT.screenPadding }}>

              {/* Active model hero card */}
              <LinearGradient
                colors={selectedModel.color}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20, padding: SPACING.xl,
                  marginBottom: SPACING.xl,
                  shadowColor: selectedModel.color[0],
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', ...TYPOGRAPHY.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {AI?.activeModel ?? 'Active Model'}
                    </Text>
                    <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 4 }}>
                      {selectedModel.icon} {selectedModel.name}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', ...TYPOGRAPHY.caption, marginTop: 4 }}>
                      {selectedModel.param} params · {selectedModel.provider} · {selectedModel.license}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>
                        {selectedModel.status === 'connect' ? (AI?.modelStatus?.connect ?? 'LAN Connect') : selectedModel.status === 'featured' ? (AI?.modelStatus?.featured ?? '⭐ Featured') : (AI?.modelStatus?.available ?? 'Available')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg, flexWrap: 'wrap' }}>
                  {selectedModel.tags.map(tag => (
                    <View key={tag} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '600' }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>

              {/* Quick Chat */}
              {card(
                <View style={{ padding: SPACING.lg }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.lg }}>
                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: `${selectedModel.color[0]}20`, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18 }}>{selectedModel.icon}</Text>
                    </View>
                    <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline }}>
                      {AI?.quickChat ?? 'Quick Chat'}
                    </Text>
                    <View style={{ marginLeft: 'auto', backgroundColor: `${selectedModel.color[0]}15`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: selectedModel.color[0], fontSize: 10, fontWeight: '700' }}>
                        {selectedModel.name}
                      </Text>
                    </View>
                  </View>

                  {/* Messages */}
                  <View style={{ maxHeight: 200, marginBottom: SPACING.md }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {chatMessages.map((msg, i) => (
                        <View key={i} style={{
                          flexDirection: 'row', marginBottom: SPACING.sm,
                          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                          {msg.role === 'ai' && (
                            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: `${selectedModel.color[0]}20`, justifyContent: 'center', alignItems: 'center', marginRight: 6, flexShrink: 0 }}>
                              <Text style={{ fontSize: 12 }}>{selectedModel.icon}</Text>
                            </View>
                          )}
                          <View style={{
                            maxWidth: '78%',
                            backgroundColor: msg.role === 'user' ? colors.primary : `${colors.primary}10`,
                            borderRadius: 14,
                            paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
                          }}>
                            <Text style={{ color: msg.role === 'user' ? '#FFF' : colors.text.primary, ...TYPOGRAPHY.caption, lineHeight: 18 }}>
                              {msg.text}
                            </Text>
                          </View>
                        </View>
                      ))}
                      {chatLoading && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <ActivityIndicator size="small" color={selectedModel.color[0]} />
                          <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption }}>{selectedModel.name} {AI?.thinking ?? 'is thinking...'}</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>

                  {/* Input */}
                  <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                    <TextInput
                      value={chatInput}
                      onChangeText={setChatInput}
                      placeholder={AI?.chatPlaceholder ?? `Message ${selectedModel.name}...`}
                      placeholderTextColor={colors.text.tertiary}
                      style={{
                        flex: 1, backgroundColor: colors.borders,
                        borderRadius: BORDER_RADIUS.full,
                        paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
                        color: colors.text.primary, ...TYPOGRAPHY.body, fontSize: 14,
                        minHeight: 40,
                      }}
                      onSubmitEditing={handleChat}
                      returnKeyType="send"
                    />
                    <TouchableOpacity
                      onPress={handleChat}
                      disabled={!chatInput.trim() || chatLoading}
                      style={{
                        width: 40, height: 40, borderRadius: 20,
                        backgroundColor: chatInput.trim() ? selectedModel.color[0] : colors.borders,
                        justifyContent: 'center', alignItems: 'center',
                      }}
                    >
                      <Ionicons name="arrow-up" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>,
                { marginBottom: SPACING.xl }
              )}

              {/* All Models List */}
              <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 20, fontWeight: '800', marginBottom: SPACING.lg }}>
                {AI?.modelStatus?.available ?? 'Available Models'}
              </Text>

              {AI_MODELS.map(model => {
                const isActive = selectedModel.id === model.id;
                return (
                  <TouchableOpacity
                    key={model.id}
                    onPress={() => {
                      if (model.id === 'ollama') {
                        setShowOllamaModal(true);
                      } else {
                        setDetailModel(model);
                        setShowModelDetail(true);
                      }
                    }}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row', alignItems: 'center',
                      backgroundColor: isActive ? `${model.color[0]}12` : colors.surface,
                      borderRadius: isVibrant ? 18 : 12,
                      padding: SPACING.lg, marginBottom: SPACING.md,
                      borderWidth: isActive ? 2 : (isVibrant ? 0 : 1),
                      borderColor: isActive ? model.color[0] : colors.borders,
                      ...(isVibrant && {
                        shadowColor: isActive ? model.color[0] : colors.cardShadow,
                        shadowOffset: { width: 0, height: isActive ? 4 : 2 },
                        shadowOpacity: isActive ? 0.2 : 0.07,
                        shadowRadius: isActive ? 12 : 8, elevation: isActive ? 5 : 3,
                      }),
                    }}
                  >
                    <LinearGradient
                      colors={model.color}
                      style={{ width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg }}
                    >
                      <Text style={{ fontSize: 22 }}>{model.icon}</Text>
                    </LinearGradient>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ color: isActive ? model.color[0] : colors.text.primary, ...TYPOGRAPHY.headline }}>
                          {model.name}
                        </Text>
                        {model.param !== 'Any' && (
                          <View style={{ backgroundColor: `${model.color[0]}20`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ color: model.color[0], fontSize: 10, fontWeight: '700' }}>{model.param}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, marginTop: 2 }} numberOfLines={1}>
                        {modelDesc(model)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: SPACING.sm }}>
                        <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>{model.provider}</Text>
                        <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>·</Text>
                        <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>{model.license}</Text>
                        {model.size !== '—' && (
                          <>
                            <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>·</Text>
                            <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>{model.size}</Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      {/* Honest runtime badge: cloud / connected / needs Ollama */}
                      <View style={{
                        backgroundColor: modelReady(model) ? `${colors.success}18` : `${colors.text.tertiary}15`,
                        borderRadius: BORDER_RADIUS.small, paddingHorizontal: 7, paddingVertical: 2,
                      }}>
                        <Text style={{
                          color: modelReady(model) ? colors.success : colors.text.tertiary,
                          fontSize: 9, fontWeight: '700',
                        }}>
                          {modelRuntimeBadge(model)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedModel(model);
                          setChatMessages([{ role: 'ai', text: modelGreeting(model) }]);
                        }}
                        style={{
                          backgroundColor: isActive ? model.color[0] : `${model.color[0]}15`,
                          borderRadius: BORDER_RADIUS.full,
                          paddingHorizontal: SPACING.md, paddingVertical: 5,
                        }}
                      >
                        <Text style={{ color: isActive ? '#FFF' : model.color[0], fontSize: 11, fontWeight: '700' }}>
                          {isActive ? (isTh ? '✓ ใช้อยู่' : '✓ Active') : (isTh ? 'ใช้' : 'Use')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ════════════════════════════════════════
              WALLET TAB
          ════════════════════════════════════════ */}
          {activeTab === 'wallet' && (
            <View style={{ paddingHorizontal: LAYOUT.screenPadding }}>

              {/* ── Guest notice ── */}
              {!authUser && (
                <View style={{
                  backgroundColor: `${colors.primary}10`, borderRadius: 16,
                  padding: SPACING.lg, marginBottom: SPACING.xl,
                  flexDirection: 'row', gap: SPACING.md, alignItems: 'center',
                }}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                  <Text style={{ flex: 1, color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 18 }}>
                    {isTh
                      ? 'เข้าสู่ระบบเพื่อดูเครดิต คะแนนสะสม และประวัติธุรกรรมของคุณ — ไปที่ โปรไฟล์ > API Key'
                      : 'Sign in to see your credits, reward points, and transaction history — go to Profile > API Key.'}
                  </Text>
                </View>
              )}

              {/* ── Wallet Card ── */}
              <LinearGradient
                colors={['#0F172A', '#1E1B4B', '#312E81']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 28, padding: SPACING.xl,
                  marginBottom: SPACING.xl,
                  shadowColor: '#312E81',
                  shadowOffset: { width: 0, height: 14 },
                  shadowOpacity: 0.5, shadowRadius: 28, elevation: 18,
                }}
              >
                {/* Decoration dots */}
                <View style={{ position: 'absolute', top: 20, right: 20, flexDirection: 'row', gap: 6 }}>
                  {['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.06)'].map((bg, i) => (
                    <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: bg }} />
                  ))}
                </View>

                {/* Card header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                      {isTh ? 'กระเป๋าของฉัน' : 'MY WALLET'}
                    </Text>
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800', marginTop: 3 }}>Rnai Wallet</Text>
                  </View>
                  <LinearGradient
                    colors={['#9333EA', '#7C3AED']}
                    style={{ width: 46, height: 46, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 22 }}>⚡</Text>
                  </LinearGradient>
                </View>

                {/* Balance */}
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 }}>
                  {isTh ? 'เครดิตรวม' : 'TOTAL CREDITS'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 6 }}>
                  <Text style={{ color: '#FFF', fontSize: 40, fontWeight: '800', lineHeight: 46 }}>
                    {walletLoading && !walletBilling ? '···' : walletBilling ? (walletBilling.free + walletBilling.paid).toLocaleString() : '—'}
                  </Text>
                  {walletLoading && <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />}
                </View>

                {/* Credit breakdown */}
                {walletBilling && (
                  <>
                    <View style={{ flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                          {isTh ? 'ฟรี' : 'Free'} {walletBilling.free.toLocaleString()}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#9333EA' }} />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                          {isTh ? 'เติมแล้ว' : 'Paid'} {walletBilling.paid.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    {/* Free credit progress bar */}
                    <View style={{ marginBottom: SPACING.xl }}>
                      <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <View style={{
                          height: 4,
                          width: `${Math.min(100, (walletBilling.free / Math.max(walletBilling.free + walletBilling.paid, 1)) * 100)}%`,
                          backgroundColor: '#10B981', borderRadius: 2,
                        }} />
                      </View>
                      <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 5 }}>
                        {authUser?.email ?? ''}
                      </Text>
                    </View>
                  </>
                )}

                {/* Action buttons */}
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  {[
                    { icon: 'add-circle-outline', label: isTh ? 'เติมเครดิต' : 'Top Up', onPress: () => Linking.openURL('https://rnai-io.vercel.app/dashboard/billing').catch(() => {}) },
                    { icon: 'download-outline',   label: isTh ? 'รับโทเค็น' : 'Receive', onPress: () => setShowReceive(true) },
                    { icon: 'refresh-outline',    label: isTh ? 'อัปเดต' : 'Refresh', onPress: loadWallet },
                    { icon: 'globe-outline',      label: isTh ? 'แดชบอร์ด' : 'Dashboard', onPress: () => Linking.openURL('https://rnai-io.vercel.app/dashboard').catch(() => {}) },
                  ].map(btn => (
                    <TouchableOpacity
                      key={btn.label}
                      onPress={btn.onPress}
                      activeOpacity={0.7}
                      style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: 10 }}
                    >
                      <Ionicons name={btn.icon as any} size={18} color="#FFF" />
                      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '600', marginTop: 4, textAlign: 'center' }}>
                        {btn.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>

              {/* ── Top-Up Packages ── */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800' }}>
                  💳 {isTh ? 'แพ็กเกจเครดิต' : 'Credit Packages'}
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://rnai-io.vercel.app/dashboard/billing').catch(() => {})}>
                  <Text style={{ color: colors.primary, ...TYPOGRAPHY.caption, fontWeight: '600' }}>
                    {isTh ? 'ดูทั้งหมด' : 'See all'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: SPACING.md, marginBottom: SPACING.xl }}>
                {CREDIT_PACKAGES.map(pkg => (
                  <TouchableOpacity
                    key={pkg.credits}
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL('https://rnai-io.vercel.app/dashboard/billing').catch(() => {})}
                    style={{
                      borderRadius: isVibrant ? 20 : 16,
                      overflow: 'visible',
                      ...(pkg.popular ? {
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
                      } : isVibrant ? {
                        shadowColor: colors.cardShadow,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
                      } : {}),
                    }}
                  >
                    {pkg.popular && (
                      <View style={{
                        position: 'absolute', top: -12, alignSelf: 'center', zIndex: 10,
                        backgroundColor: '#F97316', borderRadius: 20,
                        paddingHorizontal: 14, paddingVertical: 4,
                      }}>
                        <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
                          ⭐ {isTh ? 'ได้รับความนิยมมากที่สุด' : 'MOST POPULAR'}
                        </Text>
                      </View>
                    )}
                    <View style={{
                      borderRadius: isVibrant ? 20 : 16,
                      padding: SPACING.xl,
                      backgroundColor: pkg.popular ? '#1A1A2E' : colors.surface,
                      borderWidth: pkg.popular ? 0 : (isVibrant ? 0 : 1),
                      borderColor: colors.borders,
                    }}>
                      {/* Package name + price row */}
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
                        <View>
                          <Text style={{ color: pkg.popular ? '#FFF' : colors.text.primary, fontSize: 22, fontWeight: '800' }}>
                            {isTh ? pkg.labelTh : pkg.label}
                          </Text>
                          <Text style={{ color: pkg.popular ? 'rgba(255,255,255,0.5)' : colors.text.tertiary, fontSize: 12, marginTop: 2 }}>
                            {isTh ? 'ไม่มีการหมดอายุ' : 'No expiration'}
                          </Text>
                        </View>
                        <Text style={{ color: pkg.popular ? '#F97316' : colors.primary, fontSize: 34, fontWeight: '800', lineHeight: 40 }}>
                          {pkg.price}
                        </Text>
                      </View>

                      {/* Credit amount highlight box */}
                      <View style={{
                        backgroundColor: pkg.popular ? 'rgba(249,115,22,0.12)' : `${colors.primary}10`,
                        borderRadius: 12, padding: SPACING.lg, marginBottom: SPACING.lg,
                      }}>
                        <Text style={{ color: '#F97316', fontSize: 28, fontWeight: '800' }}>
                          {pkg.credits.toLocaleString()}
                        </Text>
                        <Text style={{ color: pkg.popular ? 'rgba(255,255,255,0.6)' : colors.text.secondary, fontSize: 13, marginTop: 2 }}>
                          {isTh ? 'เครดิต AI' : 'AI Credits'}
                        </Text>
                      </View>

                      {/* Buy button */}
                      <View style={{
                        borderRadius: 12, paddingVertical: 14, alignItems: 'center',
                        backgroundColor: pkg.popular ? '#FFF' : colors.surface,
                        borderWidth: pkg.popular ? 0 : 1,
                        borderColor: colors.borders,
                      }}>
                        <Text style={{
                          color: pkg.popular ? '#000' : colors.text.primary,
                          fontSize: 15, fontWeight: '700',
                        }}>
                          {isTh ? 'ซื้อเลย' : 'Buy Now'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── RNAI Points + Rank ── */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL('https://rnai-io.vercel.app/rewards').catch(() => {})}
                style={{
                  borderRadius: isVibrant ? 20 : 14,
                  padding: SPACING.lg, marginBottom: SPACING.xl,
                  overflow: 'hidden',
                  ...(isVibrant ? {
                    backgroundColor: colors.surface,
                    shadowColor: '#9333EA',
                    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 5,
                  } : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borders }),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                  <LinearGradient
                    colors={['#9333EA', '#7C3AED']}
                    style={{ width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg }}
                  >
                    <Text style={{ fontSize: 24 }}>⚡</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, fontWeight: '800' }}>RNAI Points</Text>
                    <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>
                      {isTh ? 'สะสมจากการสร้างผลงาน' : 'Earned by creating content'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#9333EA', fontSize: 26, fontWeight: '800' }}>{rnaiPoints.toLocaleString()}</Text>
                    {myRank?.rank && (
                      <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>
                        #{myRank.rank} {isTh ? 'อันดับ' : 'rank'}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Prize pool bar */}
                {myRank && (
                  <View style={{ backgroundColor: `${colors.borders}80`, borderRadius: 8, padding: SPACING.sm, marginBottom: SPACING.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: colors.text.tertiary, fontSize: 10, fontWeight: '600' }}>
                        {isTh ? 'พูลรางวัลเดือนนี้' : 'This month\'s prize pool'}
                      </Text>
                      <Text style={{ color: '#9333EA', fontSize: 10, fontWeight: '700' }}>
                        {myRank.pool.toLocaleString()} pts
                      </Text>
                    </View>
                    <View style={{ height: 3, backgroundColor: 'rgba(147,51,234,0.15)', borderRadius: 2 }}>
                      <View style={{ height: 3, width: myRank.eligible ? '100%' : '40%', backgroundColor: '#9333EA', borderRadius: 2 }} />
                    </View>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13 }}>🏆</Text>
                  <Text style={{ ...TYPOGRAPHY.caption, color: '#9333EA', fontWeight: '700' }}>
                    {myRank?.rank
                      ? (isTh ? `อันดับของคุณ: #${myRank.rank} — ดูกติกาและรางวัล` : `Your rank: #${myRank.rank} — see rules & rewards`)
                      : (isTh ? '10 รางวัล/เดือน · 20 รางวัลใหญ่/ปี — ดูกติกาและรางวัล' : '10 monthly · 20 yearly prizes — see rules & rewards')}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#9333EA" />
                </View>
              </TouchableOpacity>

              {/* ── TrueMoney e-Voucher Top-Up ── */}
              {authUser && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setShowTMModal(true)}
                  style={{
                    borderRadius: isVibrant ? 20 : 14,
                    marginBottom: SPACING.xl,
                    overflow: 'hidden',
                    ...(isVibrant ? {
                      shadowColor: '#E11B1B',
                      shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 5,
                    } : { borderWidth: 1, borderColor: colors.borders }),
                  }}
                >
                  <LinearGradient
                    colors={['#E11B1B', '#C81212', '#A80000']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{ borderRadius: isVibrant ? 20 : 14, padding: SPACING.lg }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 }}>
                        <View style={{
                          width: 52, height: 52, borderRadius: 16,
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          justifyContent: 'center', alignItems: 'center',
                        }}>
                          <Text style={{ fontSize: 26 }}>🎁</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 2 }}>
                            {AI?.wallet?.truemoney?.sectionTitle ?? 'เติมเครดิตผ่านทรูวอเล็ต'}
                          </Text>
                          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                            {AI?.wallet?.truemoney?.tagline ?? 'ใช้ Gift Voucher ทรูวอเล็ตจาก 7-Eleven'}
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 22, paddingHorizontal: 14, paddingVertical: 7,
                        flexDirection: 'row', alignItems: 'center', gap: 4,
                      }}>
                        <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>
                          {isTh ? 'แลกเลย' : 'Redeem'}
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color="#FFF" />
                      </View>
                    </View>

                    {/* Steps strip */}
                    <View style={{
                      flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg,
                      backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: SPACING.sm,
                    }}>
                      {['7-Eleven', '→ PIN 16', '→ เครดิต'].map((step, i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700' }}>{step}</Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* ── Receive Section (Phase 3 Preview) ── */}
              {authUser && (
                <View style={{
                  borderRadius: isVibrant ? 20 : 14,
                  marginBottom: SPACING.xl,
                  overflow: 'hidden',
                  borderWidth: 1.5,
                  borderColor: `${colors.primary}40`,
                  backgroundColor: isVibrant ? `${colors.primary}06` : colors.surface,
                  ...(isVibrant && {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
                  }),
                }}>
                  {/* Header */}
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    padding: SPACING.lg,
                    borderBottomWidth: showReceive ? 1 : 0,
                    borderBottomColor: `${colors.primary}25`,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>📥</Text>
                      </View>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>
                            {isTh ? 'รับโทเค็น / Crypto' : 'Receive Tokens'}
                          </Text>
                          <View style={{ backgroundColor: `${colors.primary}20`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '800' }}>PREVIEW</Text>
                          </View>
                        </View>
                        <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption }}>
                          {isTh ? 'รับ ETH · USDT · BNB ผ่าน QR Code' : 'Receive ETH · USDT · BNB via QR'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setShowReceive(v => !v)} activeOpacity={0.7}>
                      <Ionicons name={showReceive ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {showReceive && (() => {
                    const addr = deriveDisplayAddress(authUser.uid);
                    return (
                      <View style={{ padding: SPACING.lg }}>
                        {/* QR Code */}
                        <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
                          <View style={{
                            width: 192, height: 192, borderRadius: 16,
                            overflow: 'hidden', borderWidth: 1, borderColor: colors.borders,
                            backgroundColor: '#FFFFFF',
                          }}>
                            <WebView
                              source={{ html: qrHtml(addr, '#0F172A') }}
                              style={{ flex: 1 }}
                              scrollEnabled={false}
                              pointerEvents="none"
                            />
                          </View>
                          <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, marginTop: 8, textAlign: 'center' }}>
                            {isTh ? 'สแกนเพื่อรับโทเค็น' : 'Scan to receive tokens'}
                          </Text>
                        </View>

                        {/* Address display */}
                        <View style={{
                          backgroundColor: colors.background, borderRadius: 12,
                          padding: SPACING.md, marginBottom: SPACING.md,
                          borderWidth: 1, borderColor: colors.borders,
                        }}>
                          <Text style={{ color: colors.text.tertiary, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 5 }}>
                            {isTh ? 'ที่อยู่กระเป๋า (EVM)' : 'WALLET ADDRESS (EVM)'}
                          </Text>
                          <Text style={{ color: colors.text.primary, fontSize: 12, fontFamily: 'monospace', letterSpacing: 0.5 }}>
                            {addr}
                          </Text>
                        </View>

                        {/* Copy + Share buttons */}
                        <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md }}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              Clipboard.setString(addr);
                              setAddressCopied(true);
                              setTimeout(() => setAddressCopied(false), 2000);
                            }}
                            style={{
                              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                              paddingVertical: 12, borderRadius: 12,
                              backgroundColor: addressCopied ? (colors.success ?? '#10B981') : `${colors.primary}15`,
                            }}
                          >
                            <Ionicons name={addressCopied ? 'checkmark-circle' : 'copy-outline'} size={16} color={addressCopied ? '#FFF' : colors.primary} />
                            <Text style={{ color: addressCopied ? '#FFF' : colors.primary, fontWeight: '700', fontSize: 13 }}>
                              {addressCopied ? (isTh ? 'คัดลอกแล้ว!' : 'Copied!') : (isTh ? 'คัดลอกที่อยู่' : 'Copy Address')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => Linking.openURL('https://rnai-io.vercel.app/dashboard').catch(() => {})}
                            style={{
                              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                              paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary,
                            }}
                          >
                            <Ionicons name="globe-outline" size={16} color="#FFF" />
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>
                              {isTh ? 'ดูบนเว็บ' : 'View on Web'}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {/* Disclaimer */}
                        <View style={{ backgroundColor: `${colors.warning ?? '#F59E0B'}10`, borderRadius: 10, padding: SPACING.md }}>
                          <Text style={{ color: colors.warning ?? '#F59E0B', fontSize: 11, lineHeight: 16 }}>
                            ⚠️ {isTh
                              ? 'แสดงเพื่อสาธิต — ฟีเจอร์รับจริงต้องยืนยันตัวตน (KYC) ก่อนเปิดใช้งาน ไม่มีการเก็บ private key บนอุปกรณ์'
                              : 'Display preview only — full receive functionality requires KYC verification before activation. No private keys are stored on your device.'}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              )}

              {/* ── Phase 4: Send & Transfer (KYC Gate) ── */}
              {authUser && (
                <View style={{
                  borderRadius: isVibrant ? 20 : 14,
                  marginBottom: SPACING.xl, overflow: 'hidden',
                  borderWidth: 1.5,
                  borderColor: `${colors.warning ?? '#F59E0B'}40`,
                  backgroundColor: isVibrant ? `${colors.warning ?? '#F59E0B'}06` : colors.surface,
                  ...(isVibrant && {
                    shadowColor: colors.warning ?? '#F59E0B',
                    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
                  }),
                }}>
                  {/* Header */}
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    padding: SPACING.lg,
                    borderBottomWidth: showSend ? 1 : 0,
                    borderBottomColor: `${colors.warning ?? '#F59E0B'}25`,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${colors.warning ?? '#F59E0B'}18`, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>📤</Text>
                      </View>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>
                            {isTh ? 'ส่งและโอน' : 'Send & Transfer'}
                          </Text>
                          <View style={{ backgroundColor: `${colors.warning ?? '#F59E0B'}20`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ color: colors.warning ?? '#F59E0B', fontSize: 9, fontWeight: '800' }}>
                              {isTh ? 'ต้อง KYC' : 'KYC REQ.'}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption }}>
                          {isTh ? 'ส่ง ETH · USDT · BNB — ต้องผ่าน KYC/AML' : 'Send ETH · USDT · BNB — requires KYC/AML'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => setShowSend(v => !v)} activeOpacity={0.7}>
                      <Ionicons name={showSend ? 'chevron-up' : 'chevron-down'} size={20} color={colors.warning ?? '#F59E0B'} />
                    </TouchableOpacity>
                  </View>

                  {showSend && (
                    <View style={{ padding: SPACING.lg }}>
                      {/* Token selector */}
                      <Text style={{ color: colors.text.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm }}>
                        {isTh ? 'เลือกโทเค็น' : 'SELECT TOKEN'}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg }}>
                        {(['ETH', 'USDT', 'BNB'] as const).map(token => (
                          <View key={token} style={{
                            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
                            backgroundColor: sendToken === token ? `${colors.warning ?? '#F59E0B'}18` : colors.background,
                            borderWidth: 1.5,
                            borderColor: sendToken === token ? (colors.warning ?? '#F59E0B') : colors.borders,
                            opacity: 0.55,
                          }}>
                            <Text style={{ color: colors.text.primary, fontWeight: '700', fontSize: 13 }}>{token}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Recipient address (locked) */}
                      <Text style={{ color: colors.text.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm }}>
                        {isTh ? 'ที่อยู่ผู้รับ' : 'RECIPIENT ADDRESS'}
                      </Text>
                      <View style={{
                        backgroundColor: colors.background, borderRadius: 12,
                        padding: SPACING.md, marginBottom: SPACING.md, opacity: 0.45,
                        borderWidth: 1, borderColor: colors.borders,
                        flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
                      }}>
                        <Ionicons name="lock-closed-outline" size={15} color={colors.text.tertiary} />
                        <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>0x…</Text>
                      </View>

                      {/* Amount (locked) */}
                      <Text style={{ color: colors.text.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.sm }}>
                        {isTh ? 'จำนวน' : 'AMOUNT'}
                      </Text>
                      <View style={{
                        backgroundColor: colors.background, borderRadius: 12,
                        padding: SPACING.md, marginBottom: SPACING.lg, opacity: 0.45,
                        borderWidth: 1, borderColor: colors.borders,
                        flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
                      }}>
                        <Ionicons name="lock-closed-outline" size={15} color={colors.text.tertiary} />
                        <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>0.00 {sendToken}</Text>
                      </View>

                      {/* KYC CTA */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => Linking.openURL('https://rnai.io/verify').catch(() => {})}
                        style={{ borderRadius: 14, overflow: 'hidden', marginBottom: SPACING.md }}
                      >
                        <LinearGradient
                          colors={['#F59E0B', '#D97706']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                          style={{ paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
                        >
                          <Ionicons name="shield-checkmark-outline" size={18} color="#FFF" />
                          <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 15 }}>
                            {isTh ? 'เริ่มยืนยันตัวตน (KYC)' : 'Start KYC Verification'}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* Compliance note */}
                      <View style={{ backgroundColor: `${colors.warning ?? '#F59E0B'}12`, borderRadius: 10, padding: SPACING.md }}>
                        <Text style={{ color: colors.warning ?? '#F59E0B', fontSize: 11, lineHeight: 16 }}>
                          🔒 {isTh
                            ? 'ฟีเจอร์นี้ต้องผ่านการยืนยัน KYC/AML ตามข้อกำหนด ก.ล.ต. ก่อนเปิดใช้งาน'
                            : 'This feature requires KYC/AML verification per financial regulations before activation.'}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* ── Phase 5: RNAI Token ── */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => Linking.openURL('https://rnai.io/token').catch(() => {})}
                style={{
                  borderRadius: isVibrant ? 20 : 14,
                  marginBottom: SPACING.xl, overflow: 'hidden',
                  ...(isVibrant ? {
                    shadowColor: '#F59E0B',
                    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 6,
                  } : { borderWidth: 1, borderColor: colors.borders }),
                }}
              >
                <LinearGradient
                  colors={['#1E1B4B', '#312E81', '#3730A3']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{ padding: SPACING.lg }}
                >
                  {/* Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                      <LinearGradient
                        colors={['#F59E0B', '#D97706']}
                        style={{ width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Text style={{ fontSize: 24 }}>⚡</Text>
                      </LinearGradient>
                      <View>
                        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '800' }}>RNAI Token</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                          {isTh ? 'โทเค็นประจำแพลตฟอร์ม' : 'Platform utility token'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: 'rgba(245,158,11,0.25)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ color: '#FCD34D', fontSize: 10, fontWeight: '800' }}>
                        {isTh ? 'เร็วๆ นี้' : 'COMING SOON'}
                      </Text>
                    </View>
                  </View>

                  {/* Earning rates */}
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: SPACING.md }}>
                    {isTh ? 'วิธีรับ RNAI POINTS' : 'HOW TO EARN RNAI POINTS'}
                  </Text>
                  <View style={{ gap: 8, marginBottom: SPACING.lg }}>
                    {[
                      { icon: '🌐', label: isTh ? 'สร้างเว็บไซต์' : 'Build a website', pts: '+50 pts' },
                      { icon: '🎨', label: isTh ? 'สร้างภาพ AI' : 'Generate AI image', pts: '+30 pts' },
                      { icon: '🔠', label: isTh ? 'แปลภาษา' : 'Translate text', pts: '+10 pts' },
                      { icon: '💬', label: isTh ? 'แชทกับ AI' : 'Chat with AI', pts: '+5 pts' },
                    ].map(item => (
                      <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 15 }}>{item.icon}</Text>
                          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{item.label}</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgba(245,158,11,0.22)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                          <Text style={{ color: '#FCD34D', fontSize: 11, fontWeight: '700' }}>{item.pts}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Conversion rate */}
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12,
                    padding: SPACING.md, flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: SPACING.lg,
                    borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)',
                  }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                      {isTh ? 'อัตราแลก (อนาคต)' : 'Conversion rate (future)'}
                    </Text>
                    <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 14 }}>1,000 pts → 1 RNAI</Text>
                  </View>

                  {/* CTA row */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      {isTh ? 'ดูรายละเอียดและกติกา' : 'View details & rules'}
                    </Text>
                    <Ionicons name="chevron-forward" size={13} color="rgba(255,255,255,0.4)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* ── Transaction History ── */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md }}>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800' }}>
                  📒 {isTh ? 'ประวัติธุรกรรม' : 'Transactions'}
                </Text>
                {walletLoading
                  ? <ActivityIndicator size="small" color={colors.primary} />
                  : <TouchableOpacity onPress={loadWallet}>
                      <Ionicons name="refresh-outline" size={18} color={colors.text.tertiary} />
                    </TouchableOpacity>
                }
              </View>

              {/* Filter chips */}
              {ledgerEntries.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
                  {[null, 'charge', 'topup', 'free_grant', 'refund', 'reward'].map(f => {
                    const active = ledgerFilter === f;
                    const meta = f ? ledgerMeta(f) : { icon: '📋', label: isTh ? 'ทั้งหมด' : 'All' };
                    return (
                      <TouchableOpacity
                        key={f ?? 'all'}
                        onPress={() => setLedgerFilter(f)}
                        style={{
                          flexDirection: 'row', alignItems: 'center', gap: 5,
                          paddingHorizontal: SPACING.md, paddingVertical: 7,
                          borderRadius: BORDER_RADIUS.full, marginRight: SPACING.sm,
                          backgroundColor: active ? colors.primary : colors.surface,
                          borderWidth: active ? 0 : 1, borderColor: colors.borders,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{meta.icon}</Text>
                        <Text style={{ color: active ? '#FFF' : colors.text.secondary, fontSize: 12, fontWeight: '600' }}>
                          {meta.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              {ledgerEntries.length === 0 && !walletLoading && (
                <View style={{
                  backgroundColor: colors.surface, borderRadius: isVibrant ? 16 : 12,
                  padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.sm,
                  ...(isVibrant ? {} : { borderWidth: 1, borderColor: colors.borders }),
                }}>
                  <Text style={{ fontSize: 32, marginBottom: SPACING.sm }}>🧾</Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, textAlign: 'center', lineHeight: 18 }}>
                    {authUser
                      ? (isTh ? 'ยังไม่มีธุรกรรม — ลองสร้างผลงานแรกของคุณเลย!' : 'No transactions yet — create your first piece!')
                      : (isTh ? 'เข้าสู่ระบบเพื่อดูประวัติ' : 'Sign in to see your history')}
                  </Text>
                </View>
              )}

              {ledgerEntries
                .filter(e => !ledgerFilter || e.type === ledgerFilter)
                .map(entry => {
                  const meta = ledgerMeta(entry.type);
                  const positive = entry.credits >= 0;
                  const when = entry.createdAt
                    ? new Date(entry.createdAt).toLocaleString(isTh ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                    : '';
                  return (
                    <View
                      key={entry.id}
                      style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: colors.surface,
                        borderRadius: isVibrant ? 16 : 12,
                        padding: SPACING.lg, marginBottom: SPACING.sm,
                        ...(isVibrant ? {
                          shadowColor: colors.cardShadow,
                          shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
                        } : { borderWidth: 1, borderColor: colors.borders }),
                      }}
                    >
                      <View style={{
                        width: 46, height: 46, borderRadius: 23,
                        backgroundColor: positive ? `${colors.success ?? '#10B981'}18` : `${colors.primary}12`,
                        justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg,
                      }}>
                        <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>{meta.label}</Text>
                        <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, marginTop: 2 }}>{when}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{
                          ...TYPOGRAPHY.headline, fontSize: 16, fontWeight: '800',
                          color: positive ? (colors.success ?? '#10B981') : colors.text.primary,
                        }}>
                          {positive ? '+' : ''}{entry.credits.toLocaleString()}
                        </Text>
                        <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, marginTop: 2 }}>
                          {isTh ? 'คงเหลือ' : 'bal.'} {entry.balanceAfter.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  );
                })}

              {/* ── Roadmap ── */}
              <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800', marginTop: SPACING.xl, marginBottom: SPACING.lg }}>
                🗺️ {isTh ? 'แผนพัฒนา' : 'Roadmap'}
              </Text>

              {(isTh ? [
                { phase: 'Phase 1', title: 'ศูนย์จัดการโมเดล AI',     desc: 'เลือก เชื่อมต่อ และแชทกับโมเดลโอเพนซอร์ส',             status: 'live',    icon: '🤖' },
                { phase: 'Phase 2', title: 'กระเป๋าเครดิตและคะแนน', desc: 'ยอดเครดิตจริง คะแนน RNAI และประวัติธุรกรรม',             status: 'live',    icon: '💳' },
                { phase: 'Phase 3', title: 'รับโทเค็น Crypto',        desc: 'รับ ETH/USDT ผ่าน QR — ต้องยืนยันตัวตนขั้นพื้นฐาน',   status: 'preview', icon: '📥' },
                { phase: 'Phase 4', title: 'ส่งและโอน',               desc: 'รองรับธุรกรรมเต็มรูปแบบ — ต้องผ่าน KYC/AML',           status: 'preview', icon: '📤' },
                { phase: 'Phase 5', title: 'โทเค็น Rnai (RNAI)',      desc: 'โทเค็นประจำแพลตฟอร์ม — สร้างผลงานเพื่อรับรางวัล',     status: 'preview', icon: '⚡' },
              ] : [
                { phase: 'Phase 1', title: 'AI Model Manager',         desc: 'Browse, connect, and chat with open-source models',        status: 'live',    icon: '🤖' },
                { phase: 'Phase 2', title: 'Credit Wallet & Points',   desc: 'Real credit balance, RNAI points, and transaction history', status: 'live',    icon: '💳' },
                { phase: 'Phase 3', title: 'Receive Crypto Tokens',    desc: 'Receive ETH/USDT via QR — requires basic KYC',             status: 'preview', icon: '📥' },
                { phase: 'Phase 4', title: 'Send & Transfer',          desc: 'Full transaction support — requires full KYC/AML',         status: 'preview', icon: '📤' },
                { phase: 'Phase 5', title: 'Rnai Token (RNAI)',        desc: 'Platform utility token — earn by creating content',        status: 'preview', icon: '⚡' },
              ]).map((item, idx, arr) => (
                <View key={item.phase} style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm }}>
                  <View style={{ alignItems: 'center', width: 42 }}>
                    <View style={{
                      width: 38, height: 38, borderRadius: 12,
                      backgroundColor: item.status === 'live'    ? `${colors.success ?? '#10B981'}20`
                        : item.status === 'preview' ? `${colors.primary}18`
                        : item.status === 'soon'    ? `${colors.warning ?? '#F59E0B'}15`
                        : `${colors.borders}80`,
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    </View>
                    {idx < arr.length - 1 && (
                      <View style={{
                        width: 2, flex: 1, marginTop: 4, borderRadius: 1,
                        backgroundColor: item.status === 'live' ? `${colors.success ?? '#10B981'}40` : colors.borders,
                      }} />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingBottom: SPACING.xl }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 }}>
                      <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>{item.title}</Text>
                      <View style={{
                        paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
                        backgroundColor: item.status === 'live'    ? `${colors.success ?? '#10B981'}20`
                          : item.status === 'preview' ? `${colors.primary}18`
                          : item.status === 'soon'    ? `${colors.warning ?? '#F59E0B'}15`
                          : `${colors.borders}80`,
                      }}>
                        <Text style={{
                          fontSize: 9, fontWeight: '800',
                          color: item.status === 'live'    ? colors.success ?? '#10B981'
                            : item.status === 'preview' ? colors.primary
                            : item.status === 'soon'    ? colors.warning ?? '#F59E0B'
                            : colors.text.tertiary,
                        }}>
                          {item.status === 'live'    ? (isTh ? '✓ ใช้งานได้' : '✓ LIVE')
                            : item.status === 'preview' ? (isTh ? '🔵 ตัวอย่าง' : '🔵 PREVIEW')
                            : item.status === 'soon'    ? 'Q3 2026'
                            : (isTh ? 'อนาคต' : 'FUTURE')}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 17 }}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* ══════════════════════════════════════════════════════
          Modal: TrueMoney e-Voucher Redeem
      ══════════════════════════════════════════════════════ */}
      <Modal
        visible={showTMModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => { if (!tmRedeeming) setShowTMModal(false); }}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>

          {/* Header */}
          <LinearGradient
            colors={['#E11B1B', '#C81212']}
            style={{ margin: SPACING.lg, borderRadius: 16, padding: SPACING.lg }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800' }}>
                  🎁 {AI?.wallet?.truemoney?.sectionTitle ?? 'เติมเครดิตผ่านทรูวอเล็ต'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
                  {AI?.wallet?.truemoney?.tagline ?? 'ใช้ Gift Voucher จาก 7-Eleven'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => { if (!tmRedeeming) setShowTMModal(false); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={26} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            contentContainerStyle={{ padding: LAYOUT.screenPadding, paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Voucher input */}
            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '700', marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {AI?.wallet?.truemoney?.inputLabel ?? 'วางลิงก์หรือโค้ด Gift Voucher'}
            </Text>
            <TextInput
              value={tmVoucher}
              onChangeText={setTmVoucher}
              placeholder={AI?.wallet?.truemoney?.inputPlaceholder ?? 'https://gift.truemoney.com/campaign/?v=...'}
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!tmRedeeming}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 14, padding: SPACING.lg,
                ...TYPOGRAPHY.body, color: colors.text.primary,
                minHeight: 80, textAlignVertical: 'top',
                borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                marginBottom: SPACING.xl,
              }}
            />

            {/* Redeem button */}
            <TouchableOpacity
              disabled={!tmVoucher.trim() || tmRedeeming}
              activeOpacity={0.85}
              onPress={async () => {
                if (!authUser) {
                  Alert.alert(isTh ? 'กรุณาเข้าสู่ระบบ' : 'Sign in required', isTh ? 'ต้องเข้าสู่ระบบก่อนแลก voucher' : 'Please sign in before redeeming a voucher.');
                  return;
                }
                setTmRedeeming(true);
                try {
                  const result = await redeemTrueMoneyVoucher(tmVoucher.trim());
                  setTmVoucher('');
                  setShowTMModal(false);
                  // Refresh wallet balance
                  loadWallet();
                  const successDesc = (AI?.wallet?.truemoney?.successDesc ?? 'ได้รับ {credits} เครดิต (฿{baht})')
                    .replace('{credits}', result.creditsAdded.toLocaleString())
                    .replace('{baht}', result.amountBaht.toLocaleString());
                  Alert.alert(
                    AI?.wallet?.truemoney?.successTitle ?? '✅ แลกสำเร็จ!',
                    successDesc,
                  );
                } catch (err: unknown) {
                  const msg = getErrorMessage(err, isTh ? 'th' : 'en');
                  Alert.alert(isTh ? 'แลกไม่สำเร็จ' : 'Redemption Failed', msg);
                } finally {
                  setTmRedeeming(false);
                }
              }}
              style={{
                borderRadius: 14,
                paddingVertical: 16, alignItems: 'center',
                backgroundColor: !tmVoucher.trim() || tmRedeeming ? colors.borders : '#E11B1B',
                marginBottom: SPACING.xl,
                shadowColor: '#E11B1B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: tmVoucher.trim() && !tmRedeeming ? 0.35 : 0,
                shadowRadius: 10, elevation: tmVoucher.trim() && !tmRedeeming ? 5 : 0,
              }}
            >
              {tmRedeeming ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>
                    {AI?.wallet?.truemoney?.redeeming ?? 'กำลังแลก...'}
                  </Text>
                </View>
              ) : (
                <Text style={{ color: !tmVoucher.trim() ? colors.text.tertiary : '#FFF', fontSize: 16, fontWeight: '700' }}>
                  {AI?.wallet?.truemoney?.redeemBtn ?? '🎁 แลกเครดิตเลย'}
                </Text>
              )}
            </TouchableOpacity>

            {/* How-to guide */}
            <View style={{
              backgroundColor: isVibrant ? `${colors.primary}08` : colors.surface,
              borderRadius: 14, padding: SPACING.lg,
              borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
            }}>
              <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, fontWeight: '700', marginBottom: SPACING.lg }}>
                📖 {AI?.wallet?.truemoney?.howToTitle ?? 'วิธีซื้อ Gift Voucher'}
              </Text>
              {([
                AI?.wallet?.truemoney?.step1 ?? '1. ซื้อ TrueMoney Gift Card ที่ 7-Eleven หรือ TrueMoney App',
                AI?.wallet?.truemoney?.step2 ?? '2. รับลิงก์ Gift Voucher หรือ PIN 16 หลัก',
                AI?.wallet?.truemoney?.step3 ?? '3. วางในช่องด้านบน แล้วกด "แลกเครดิต"',
              ] as string[]).map((step, i) => (
                <Text key={i} style={{ color: colors.text.secondary, ...TYPOGRAPHY.body, lineHeight: 22, marginBottom: SPACING.sm }}>
                  {step}
                </Text>
              ))}
              <View style={{
                marginTop: SPACING.sm,
                backgroundColor: 'rgba(225,27,27,0.08)',
                borderRadius: 8, padding: SPACING.sm,
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}>
                <Text style={{ fontSize: 14 }}>💡</Text>
                <Text style={{ color: '#E11B1B', ...TYPOGRAPHY.caption, fontWeight: '600', flex: 1 }}>
                  {AI?.wallet?.truemoney?.howToNote ?? '1 บาท ≈ 10 เครดิต AI · ไม่มีวันหมดอายุ'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════
          Modal: Ollama Connect
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showOllamaModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowOllamaModal(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: LAYOUT.screenPadding }}>
            <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>
              🦙 {AI?.ollamaTitle ?? 'Connect Ollama'}
            </Text>
            <TouchableOpacity onPress={() => setShowOllamaModal(false)}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding }}>
            <View style={{
              backgroundColor: `${colors.primary}10`, borderRadius: 14, padding: SPACING.lg,
              marginBottom: SPACING.xl,
            }}>
              <Text style={{ color: colors.primary, ...TYPOGRAPHY.caption, fontWeight: '700', marginBottom: 4 }}>
                {isTh ? 'Ollama คืออะไร?' : 'What is Ollama?'}
              </Text>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 18 }}>
                {isTh
                  ? 'Ollama ให้คุณรันโมเดล AI ทรงพลัง (Llama, Mistral, DeepSeek ฯลฯ) บน Mac หรือ PC ของตัวเอง แล้วเชื่อมแอปนี้เข้ากับเครื่องผ่าน WiFi บ้าน — ได้ AI ส่วนตัว ฟรี และเป็นความลับ'
                  : 'Ollama lets you run powerful AI models (Llama, Mistral, DeepSeek, etc.) locally on your Mac or PC. Connect this app to your local Ollama server over your home WiFi for private, free AI.'}
              </Text>
            </View>

            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
              {isTh ? 'ที่อยู่เซิร์ฟเวอร์ Ollama' : 'Ollama Server URL'}
            </Text>
            <TextInput
              value={ollamaUrl}
              onChangeText={setOllamaUrl}
              style={{
                backgroundColor: colors.surface, borderRadius: 14,
                padding: SPACING.lg, ...TYPOGRAPHY.body,
                color: colors.text.primary, marginBottom: SPACING.xl,
                borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
              }}
              placeholder="http://192.168.1.x:11434"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              disabled={ollamaConnecting}
              onPress={async () => {
                setOllamaConnecting(true);
                try {
                  const models = await connectOllama(ollamaUrl);
                  const firstModel = models[0] ?? null;
                  setOllamaConnected(true);
                  setOllamaModelName(firstModel);
                  setSelectedModel(AI_MODELS.find(m => m.id === 'ollama')!);
                  setChatMessages([{
                    role: 'ai',
                    text: firstModel
                      ? (isTh
                          ? `✅ เชื่อมต่อ Ollama สำเร็จ (มี ${models.length} โมเดล) กำลังใช้ "${firstModel}" — พิมพ์ข้อความเริ่มคุยได้เลย!`
                          : `✅ Connected to Ollama (${models.length} model${models.length === 1 ? '' : 's'}). Using "${firstModel}" — type a message to start!`)
                      : (isTh
                          ? '✅ เชื่อมต่อ Ollama ได้ แต่ยังไม่มีโมเดลติดตั้ง — รัน "ollama pull llama3.2" บนคอมพิวเตอร์ก่อนครับ'
                          : '✅ Connected to Ollama, but no models installed. Run "ollama pull llama3.2" on your computer first.'),
                  }]);
                  setShowOllamaModal(false);
                } catch (err: any) {
                  setOllamaConnected(false);
                  setOllamaModelName(null);
                  Alert.alert(
                    isTh ? 'เชื่อมต่อไม่สำเร็จ' : 'Connection Failed',
                    isTh
                      ? `ติดต่อ Ollama ที่ ${ollamaUrl} ไม่ได้\n\nตรวจสอบว่า:\n• Ollama กำลังรันบนคอมพิวเตอร์\n• ทั้งสองเครื่องอยู่ WiFi เดียวกัน\n• IP address ถูกต้อง\n\n(${err?.message ?? 'unknown error'})`
                      : `Could not reach Ollama at ${ollamaUrl}.\n\nMake sure:\n• Ollama is running on your computer\n• Both devices are on the same WiFi\n• The IP address is correct\n\n(${err?.message ?? 'unknown error'})`,
                  );
                } finally {
                  setOllamaConnecting(false);
                }
              }}
              style={{
                backgroundColor: '#10B981', borderRadius: BORDER_RADIUS.full,
                paddingVertical: 15, alignItems: 'center',
                opacity: ollamaConnecting ? 0.6 : 1,
                shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
              }}
            >
              {ollamaConnecting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: '#FFF', ...TYPOGRAPHY.callout, fontWeight: '700' }}>{AI?.ollamaConnect ?? 'Connect to Ollama'}</Text>
              )}
            </TouchableOpacity>

            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.headline, fontSize: 16, fontWeight: '700', marginTop: SPACING.xxl, marginBottom: SPACING.lg }}>
              {isTh ? 'วิธีติดตั้ง' : 'Setup Guide'}
            </Text>
            {(isTh ? [
              { step: '1', text: 'ติดตั้ง Ollama จาก ollama.ai บน Mac/PC ของคุณ' },
              { step: '2', text: 'รันคำสั่ง: ollama pull llama3.2 (หรือโมเดลอื่น)' },
              { step: '3', text: 'ให้มือถือกับคอมพิวเตอร์อยู่ WiFi เดียวกัน' },
              { step: '4', text: 'หา IP ของคอมพิวเตอร์ (System Preferences → Network)' },
              { step: '5', text: 'กรอก URL ด้านบนแล้วกดเชื่อมต่อ' },
            ] : [
              { step: '1', text: 'Install Ollama from ollama.ai on your Mac/PC' },
              { step: '2', text: 'Run: ollama pull llama3.2 (or any model)' },
              { step: '3', text: 'Make sure your device is on the same WiFi' },
              { step: '4', text: 'Find your computer\'s local IP (System Preferences → Network)' },
              { step: '5', text: 'Enter the URL above and connect' },
            ]).map(item => (
              <View key={item.step} style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '800' }}>{item.step}</Text>
                </View>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.body, fontSize: 14, flex: 1 }}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════
          Modal: Model Detail
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showModelDetail} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModelDetail(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          <View style={{ padding: LAYOUT.screenPadding }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                <LinearGradient
                  colors={detailModel.color}
                  style={{ width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 26 }}>{detailModel.icon}</Text>
                </LinearGradient>
                <View>
                  <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>
                    {detailModel.name}
                  </Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>{detailModel.provider} · {detailModel.param}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowModelDetail(false)}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding, paddingTop: 0 }}>
            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.body, lineHeight: 24, marginBottom: SPACING.xl }}>
              {modelDesc(detailModel)}
            </Text>

            {[
              { label: isTh ? 'การทำงาน' : 'Runtime',
                value: isCloudModel(detailModel) ? (isTh ? 'คลาวด์ (ฟรี)' : 'Cloud (free)') : (isTh ? 'ในเครื่องผ่าน Ollama' : 'Local via Ollama') },
              { label: isTh ? 'พารามิเตอร์' : 'Parameters', value: detailModel.param },
              { label: isTh ? 'ผู้พัฒนา' : 'Provider', value: detailModel.provider },
              { label: isTh ? 'สัญญาอนุญาต' : 'License', value: detailModel.license },
              ...(detailModel.size !== '—'
                ? [{ label: isTh ? 'ขนาดโมเดล (Ollama)' : 'Model Size (Ollama)', value: detailModel.size }]
                : []),
            ].map(row => (
              <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: colors.borders }}>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.body }}>{row.label}</Text>
                <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.body, fontWeight: '600' }}>{row.value}</Text>
              </View>
            ))}

            <View style={{ gap: SPACING.md, marginTop: SPACING.xl }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedModel(detailModel);
                  setChatMessages([{ role: 'ai', text: modelGreeting(detailModel) }]);
                  setShowModelDetail(false);
                }}
                style={{
                  backgroundColor: detailModel.color[0], borderRadius: BORDER_RADIUS.full,
                  paddingVertical: 15, alignItems: 'center',
                  shadowColor: detailModel.color[0], shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
                }}
              >
                <Text style={{ color: '#FFF', ...TYPOGRAPHY.callout, fontWeight: '700' }}>{AI?.modelConnected ?? 'Use This Model'}</Text>
              </TouchableOpacity>

              {/* LAN models run via the user's Ollama server — offer the real
                  connect action instead of a non-existent on-device download. */}
              {isLanModel(detailModel) && !ollamaConnected && (
                <TouchableOpacity
                  onPress={() => { setShowModelDetail(false); setShowOllamaModal(true); }}
                  style={{
                    borderWidth: 1.5, borderColor: detailModel.color[0],
                    borderRadius: BORDER_RADIUS.full, paddingVertical: 15, alignItems: 'center',
                  }}
                >
                  <Text style={{ color: detailModel.color[0], ...TYPOGRAPHY.callout, fontWeight: '700' }}>
                    🦙 {isTh ? 'เชื่อมต่อ Ollama' : 'Connect Ollama'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => Linking.openURL(detailModel.url).catch(() => {})}
                style={{ paddingVertical: SPACING.sm, alignItems: 'center' }}
              >
                <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, fontWeight: '600' }}>
                  {isTh ? 'เรียนรู้เพิ่มเติม ↗' : 'Learn more ↗'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}
