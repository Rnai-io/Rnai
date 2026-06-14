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
  ActivityIndicator, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { connectOllama, ollamaChat } from '../services/ollama';
import { geminiChat, fetchBilling, fetchLedger, fetchMyRank, LedgerEntry, MyRank } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const { width: W } = Dimensions.get('window');

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
              {tab === 'wallet' && (
                <View style={{
                  backgroundColor: colors.warning ?? '#F59E0B', borderRadius: 6,
                  paddingHorizontal: 4, paddingVertical: 1,
                }}>
                  <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '800' }}>{AI?.soonBadge ?? 'SOON'}</Text>
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
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedModel(model);
                          setChatMessages([{
                            role: 'ai',
                            text: isTh
                              ? `สวัสดีครับ! ผมคือ ${model.name} มีอะไรให้ช่วยไหมครับ?`
                              : `Hello! I'm ${model.name}. How can I help you?`,
                          }]);
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

              {/* Guest notice */}
              {!authUser && (
                <View style={{
                  backgroundColor: `${colors.primary}10`,
                  borderRadius: 14, padding: SPACING.lg,
                  marginBottom: SPACING.xl,
                  flexDirection: 'row', gap: SPACING.md, alignItems: 'center',
                }}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                  <Text style={{ flex: 1, color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 17 }}>
                    {isTh
                      ? 'เข้าสู่ระบบเพื่อดูเครดิต คะแนนสะสม และประวัติธุรกรรมของคุณ — ไปที่ โปรไฟล์ > API Key'
                      : 'Sign in to see your credits, reward points, and transaction history — go to Profile > API Key.'}
                  </Text>
                </View>
              )}

              {/* Wallet Card */}
              <LinearGradient
                colors={isVibrant ? ['#1E1B4B', '#312E81'] : ['#1F2937', '#111827']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 24, padding: SPACING.xl,
                  marginBottom: SPACING.xl,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.4, shadowRadius: 24, elevation: 15,
                }}
              >
                {/* Stars decoration */}
                <View style={{ position: 'absolute', top: 16, right: 20 }}>
                  <Text style={{ fontSize: 24, opacity: 0.15 }}>✦ ✦ ✦</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xxl }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {isTh ? 'กระเป๋าของฉัน' : 'My Wallet'}
                    </Text>
                    <Text style={{ color: '#FFF', ...TYPOGRAPHY.headline, fontSize: 18, fontWeight: '800', marginTop: 2 }}>
                      Rnai Wallet
                    </Text>
                  </View>
                  <LinearGradient
                    colors={['#9333EA', '#7C3AED']}
                    style={{ width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 22 }}>⚡</Text>
                  </LinearGradient>
                </View>

                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 6, fontWeight: '600', letterSpacing: 1 }}>
                  {isTh ? 'เครดิตคงเหลือ' : 'CREDIT BALANCE'}
                </Text>
                <Text style={{ color: '#FFF', fontSize: 34, fontWeight: '800', lineHeight: 40 }}>
                  {walletLoading && !walletBilling
                    ? '...'
                    : walletBilling
                    ? (walletBilling.free + walletBilling.paid).toLocaleString()
                    : '—'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4, marginBottom: SPACING.xl }}>
                  {walletBilling
                    ? `${isTh ? 'ฟรี' : 'Free'} ${walletBilling.free.toLocaleString()} · ${isTh ? 'เติม' : 'Paid'} ${walletBilling.paid.toLocaleString()}${authUser ? ` · ${authUser.email}` : ''}`
                    : (isTh ? 'ยังไม่ได้เข้าสู่ระบบ' : 'Not signed in')}
                </Text>

                <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                  {[
                    { icon: 'card-outline', label: isTh ? 'เติมเครดิต' : 'Top up', onPress: () => Linking.openURL('https://rnai-io.vercel.app/dashboard/billing').catch(() => {}) },
                    { icon: 'refresh-outline', label: isTh ? 'รีเฟรช' : 'Refresh', onPress: loadWallet },
                    { icon: 'globe-outline', label: isTh ? 'แดชบอร์ด' : 'Dashboard', onPress: () => Linking.openURL('https://rnai-io.vercel.app/dashboard').catch(() => {}) },
                  ].map(btn => (
                    <TouchableOpacity
                      key={btn.label}
                      onPress={btn.onPress}
                      style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: SPACING.md }}
                    >
                      <Ionicons name={btn.icon as any} size={20} color="#FFF" />
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600', marginTop: 4 }}>{btn.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>

              {/* RNAI Reward Points — tap to open the rewards page */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL('https://rnai-io.vercel.app/rewards').catch(() => {})}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: isVibrant ? 18 : 12,
                  padding: SPACING.lg, marginBottom: SPACING.xl,
                  ...(isVibrant ? {
                    shadowColor: '#9333EA',
                    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
                  } : { borderWidth: 1, borderColor: colors.borders }),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={['#9333EA', '#7C3AED']}
                    style={{ width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg }}
                  >
                    <Text style={{ fontSize: 22 }}>⚡</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>RNAI Points</Text>
                    <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>
                      {isTh ? 'สะสมจากการสร้างผลงาน' : 'Earned by creating'}
                    </Text>
                  </View>
                  <Text style={{ color: '#9333EA', fontSize: 22, fontWeight: '800' }}>
                    {rnaiPoints.toLocaleString()}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                  marginTop: SPACING.md, paddingTop: SPACING.md,
                  borderTopWidth: 1, borderTopColor: colors.borders,
                }}>
                  <Text style={{ fontSize: 13 }}>🏆</Text>
                  <Text style={{ ...TYPOGRAPHY.caption, color: '#9333EA', fontWeight: '700' }}>
                    {myRank?.rank
                      ? (isTh
                          ? `อันดับของคุณเดือนนี้: #${myRank.rank} — ดูกติกาและรางวัล`
                          : `Your rank this month: #${myRank.rank} — see rules & rewards`)
                      : (isTh
                          ? 'ลุ้น 10 รางวัล/เดือน · 20 รางวัลใหญ่/ปี — ดูกติกาและรางวัล'
                          : '10 monthly · 20 yearly prizes — see rules & rewards')}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#9333EA" />
                </View>
              </TouchableOpacity>

              {/* Transaction history (real ledger from the platform) */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800' }}>
                  📒 {isTh ? 'ประวัติธุรกรรม' : 'Transactions'}
                </Text>
                {walletLoading && <ActivityIndicator size="small" color={colors.primary} />}
              </View>

              {ledgerEntries.length === 0 && !walletLoading && (
                <View style={{
                  backgroundColor: colors.surface, borderRadius: isVibrant ? 16 : 12,
                  padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.sm,
                  ...(isVibrant ? {} : { borderWidth: 1, borderColor: colors.borders }),
                }}>
                  <Text style={{ fontSize: 28, marginBottom: SPACING.sm }}>🧾</Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, textAlign: 'center' }}>
                    {authUser
                      ? (isTh ? 'ยังไม่มีธุรกรรม — ลองสร้างผลงานแรกของคุณเลย!' : 'No transactions yet — create your first piece!')
                      : (isTh ? 'เข้าสู่ระบบเพื่อดูประวัติ' : 'Sign in to see your history')}
                  </Text>
                </View>
              )}

              {ledgerEntries.map(entry => {
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
                      width: 44, height: 44, borderRadius: 22,
                      backgroundColor: positive ? `${colors.success ?? '#10B981'}18` : `${colors.primary}12`,
                      justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg,
                    }}>
                      <Text style={{ fontSize: 18 }}>{meta.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>{meta.label}</Text>
                      <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, marginTop: 2 }}>{when}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{
                        ...TYPOGRAPHY.headline,
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

              {/* Future Roadmap */}
              <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800', marginTop: SPACING.xl, marginBottom: SPACING.lg }}>
                🗺️ {isTh ? 'แผนพัฒนา' : 'Roadmap'}
              </Text>

              {(isTh ? [
                { phase: 'Phase 1', title: 'ศูนย์จัดการโมเดล AI', desc: 'เลือก เชื่อมต่อ และแชทกับโมเดลโอเพนซอร์ส', status: 'live', icon: '🤖' },
                { phase: 'Phase 2', title: 'กระเป๋าเครดิตและคะแนน', desc: 'ยอดเครดิตจริง คะแนน RNAI และประวัติธุรกรรม', status: 'live', icon: '👁️' },
                { phase: 'Phase 3', title: 'รับโทเค็น', desc: 'รับชำระคริปโตผ่าน QR — ต้องยืนยันตัวตนขั้นพื้นฐาน', status: 'soon', icon: '📥' },
                { phase: 'Phase 4', title: 'ส่งและโอน', desc: 'รองรับธุรกรรมเต็มรูปแบบ — ต้องผ่าน KYC/AML', status: 'future', icon: '📤' },
                { phase: 'Phase 5', title: 'โทเค็น Rnai (RNAI)', desc: 'โทเค็นประจำแพลตฟอร์ม — สร้างผลงานเพื่อรับรางวัล', status: 'future', icon: '⚡' },
              ] : [
                { phase: 'Phase 1', title: 'AI Model Manager', desc: 'Browse, connect, and chat with open-source models', status: 'live', icon: '🤖' },
                { phase: 'Phase 2', title: 'Credit Wallet & Points', desc: 'Real credit balance, RNAI points, and transaction history', status: 'live', icon: '👁️' },
                { phase: 'Phase 3', title: 'Receive Tokens', desc: 'Accept crypto payments via QR — requires basic KYC', status: 'soon', icon: '📥' },
                { phase: 'Phase 4', title: 'Send & Transfer', desc: 'Full transaction support — requires full KYC/AML', status: 'future', icon: '📤' },
                { phase: 'Phase 5', title: 'Rnai Token (RNAI)', desc: 'Platform utility token — earn by creating content', status: 'future', icon: '⚡' },
              ]).map(item => (
                <View key={item.phase} style={{
                  flexDirection: 'row', gap: SPACING.md,
                  marginBottom: SPACING.md,
                }}>
                  <View style={{ alignItems: 'center', width: 40 }}>
                    <View style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: item.status === 'live' ? `${colors.success ?? '#10B981'}20`
                        : item.status === 'preview' ? `${colors.primary}15`
                        : item.status === 'soon' ? `${colors.warning ?? '#F59E0B'}15`
                        : `${colors.borders}80`,
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    </View>
                    {item.phase !== 'Phase 5' && <View style={{ width: 1, flex: 1, backgroundColor: colors.borders, marginTop: 4 }} />}
                  </View>
                  <View style={{ flex: 1, paddingBottom: SPACING.lg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 }}>
                      <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>{item.title}</Text>
                      <View style={{
                        paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
                        backgroundColor: item.status === 'live' ? `${colors.success ?? '#10B981'}20`
                          : item.status === 'preview' ? `${colors.primary}15`
                          : item.status === 'soon' ? `${colors.warning ?? '#F59E0B'}15`
                          : colors.borders,
                      }}>
                        <Text style={{
                          fontSize: 10, fontWeight: '800',
                          color: item.status === 'live' ? colors.success ?? '#10B981'
                            : item.status === 'preview' ? colors.primary
                            : item.status === 'soon' ? colors.warning ?? '#F59E0B'
                            : colors.text.tertiary,
                        }}>
                          {item.status === 'live' ? (isTh ? '✓ ใช้งานได้' : '✓ LIVE') : item.status === 'preview' ? (isTh ? 'ตัวอย่าง' : 'PREVIEW') : item.status === 'soon' ? 'Q3 2026' : (isTh ? 'อนาคต' : 'FUTURE')}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

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
              { label: isTh ? 'พารามิเตอร์' : 'Parameters', value: detailModel.param },
              { label: isTh ? 'ผู้พัฒนา' : 'Provider', value: detailModel.provider },
              { label: isTh ? 'สัญญาอนุญาต' : 'License', value: detailModel.license },
              { label: isTh ? 'ขนาดดาวน์โหลด' : 'Download Size', value: detailModel.size },
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
                  setChatMessages([{
                    role: 'ai',
                    text: isTh
                      ? `สลับมาใช้ ${detailModel.name} แล้ว มีอะไรให้ช่วยไหมครับ?`
                      : `Switched to ${detailModel.name}. How can I help you?`,
                  }]);
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
              <TouchableOpacity
                onPress={() => Alert.alert(
                  isTh ? 'ดาวน์โหลดโมเดล' : 'Download Model',
                  isTh
                    ? `ดาวน์โหลด ${detailModel.name} (${detailModel.size}) เพื่อรันออฟไลน์บนเครื่องนี้?\n\nหมายเหตุ: การรันบนอุปกรณ์ต้องใช้ชิปแรงและพื้นที่เพียงพอ — แนะนำให้ใช้ผ่าน Ollama บนคอมพิวเตอร์แทน`
                    : `Download ${detailModel.name} (${detailModel.size}) to run offline on this device?\n\nNote: On-device inference requires a powerful processor and sufficient storage.`,
                  [
                    { text: t.common.cancel, style: 'cancel' },
                    { text: isTh ? 'เรียนรู้เพิ่มเติม' : 'Learn More', onPress: () => {} },
                  ],
                )}
                style={{
                  borderWidth: 1.5, borderColor: detailModel.color[0],
                  borderRadius: BORDER_RADIUS.full, paddingVertical: 15, alignItems: 'center',
                }}
              >
                <Text style={{ color: detailModel.color[0], ...TYPOGRAPHY.callout, fontWeight: '700' }}>
                  📥 {AI?.modelDownload ?? 'Download'} ({detailModel.size})
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}
