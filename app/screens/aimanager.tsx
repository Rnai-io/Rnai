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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { connectOllama, ollamaChat } from '../services/ollama';

const { width: W } = Dimensions.get('window');

// ── AI Models ──────────────────────────────────────────────────────────────

const AI_MODELS = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    param: '7B',
    provider: 'DeepSeek',
    description: 'Powerful open-source reasoning model. Excels at math, code, and complex thinking.',
    tags: ['Reasoning', 'Code', 'Math'],
    size: '4.7 GB',
    license: 'MIT',
    status: 'featured',
    icon: '🧠',
    color: ['#0EA5E9', '#0284C7'] as [string, string],
    url: 'https://github.com/deepseek-ai/DeepSeek-R1',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    param: 'Any',
    provider: 'Ollama',
    description: 'Run any open-source model locally on your Mac/PC. Connect from this device via LAN.',
    tags: ['Local', 'Privacy', 'Custom'],
    size: '—',
    license: 'MIT',
    status: 'connect',
    icon: '🦙',
    color: ['#10B981', '#059669'] as [string, string],
    url: 'https://ollama.ai',
  },
  {
    id: 'llama3',
    name: 'Llama 3.2',
    param: '3B',
    provider: 'Meta',
    description: "Meta's latest mobile-optimized LLM. Fast and capable on-device inference.",
    tags: ['Chat', 'Mobile', 'Fast'],
    size: '2.0 GB',
    license: 'Llama 3',
    status: 'available',
    icon: '🦙',
    color: ['#8B5CF6', '#6D28D9'] as [string, string],
    url: 'https://llama.meta.com',
  },
  {
    id: 'gemma2',
    name: 'Gemma 2',
    param: '2B',
    provider: 'Google',
    description: "Google's lightweight open model. Great multilingual support and efficiency.",
    tags: ['Efficient', 'Multilingual', 'Chat'],
    size: '1.6 GB',
    license: 'Gemma',
    status: 'available',
    icon: '💎',
    color: ['#F59E0B', '#D97706'] as [string, string],
    url: 'https://ai.google.dev/gemma',
  },
  {
    id: 'phi3',
    name: 'Phi-3 Mini',
    param: '3.8B',
    provider: 'Microsoft',
    description: "Microsoft's small but mighty model. Best-in-class for its size.",
    tags: ['Fast', 'Code', 'Reasoning'],
    size: '2.3 GB',
    license: 'MIT',
    status: 'available',
    icon: '⚡',
    color: ['#3B82F6', '#1D4ED8'] as [string, string],
    url: 'https://azure.microsoft.com/en-us/blog/phi-3',
  },
  {
    id: 'mistral',
    name: 'Mistral 7B',
    param: '7B',
    provider: 'Mistral AI',
    description: 'Top open-source 7B model. Excellent for instruction following and code.',
    tags: ['General', 'Code', 'Instruct'],
    size: '4.1 GB',
    license: 'Apache 2.0',
    status: 'available',
    icon: '🌊',
    color: ['#EC4899', '#DB2777'] as [string, string],
    url: 'https://mistral.ai',
  },
];

// ── Wallet Tokens ─────────────────────────────────────────────────────────

const WALLET_TOKENS = [
  { symbol: 'ETH',  name: 'Ethereum',     icon: '⟠',  color: '#627EEA', balance: '—', usd: '—' },
  { symbol: 'BTC',  name: 'Bitcoin',      icon: '₿',  color: '#F7931A', balance: '—', usd: '—' },
  { symbol: 'USDT', name: 'Tether USD',   icon: '₮',  color: '#26A17B', balance: '—', usd: '—' },
  { symbol: 'USDC', name: 'USD Coin',     icon: '$',  color: '#2775CA', balance: '—', usd: '—' },
  { symbol: 'RNAI', name: 'Rnai Token',   icon: '⚡', color: '#9333EA', balance: '—', usd: '— (Future)' },
];

// ── Mock wallet address ───────────────────────────────────────────────────
const MOCK_ADDRESS = '0x71C7...A4F2';
const MOCK_ADDRESS_FULL = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

// ── Main Screen ───────────────────────────────────────────────────────────

export default function AiManagerScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t } = useLanguage();
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
    { role: 'ai', text: `${AI_MODELS[0].name}` },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

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

    if (selectedModel.id === 'ollama' && ollamaConnected && ollamaModelName) {
      // ── Real inference via local Ollama server ──
      try {
        const reply = await ollamaChat(
          ollamaUrl,
          ollamaModelName,
          history.map(m => ({
            role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
            content: m.text,
          })),
        );
        setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
      } catch (err: any) {
        setChatMessages(prev => [...prev, {
          role: 'ai',
          text: `⚠️ ${err?.message ?? 'Could not reach Ollama. Check that the server is running and on the same WiFi.'}`,
        }]);
      } finally {
        setChatLoading(false);
      }
      return;
    }

    // ── Demo response for models not yet connected ──
    await new Promise(r => setTimeout(r, 1200));
    setChatMessages(prev => [...prev, {
      role: 'ai',
      text: `[${selectedModel.name}] ${AI?.demoResponse ?? 'This is a demo response. Connect to Ollama or download a model to get real AI responses.'}`,
    }]);
    setChatLoading(false);
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
                        {model.description}
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
                          setChatMessages([{ role: 'ai', text: `Hello! I'm ${model.name}. How can I help you?` }]);
                        }}
                        style={{
                          backgroundColor: isActive ? model.color[0] : `${model.color[0]}15`,
                          borderRadius: BORDER_RADIUS.full,
                          paddingHorizontal: SPACING.md, paddingVertical: 5,
                        }}
                      >
                        <Text style={{ color: isActive ? '#FFF' : model.color[0], fontSize: 11, fontWeight: '700' }}>
                          {isActive ? '✓ Active' : 'Use'}
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

              {/* Legal Disclaimer */}
              <View style={{
                backgroundColor: `${colors.warning ?? '#F59E0B'}15`,
                borderRadius: 14, padding: SPACING.lg,
                borderWidth: 1, borderColor: `${colors.warning ?? '#F59E0B'}40`,
                marginBottom: SPACING.xl,
                flexDirection: 'row', gap: SPACING.md,
              }}>
                <Ionicons name="information-circle-outline" size={20} color={colors.warning ?? '#F59E0B'} style={{ flexShrink: 0, marginTop: 1 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.warning ?? '#F59E0B', ...TYPOGRAPHY.caption, fontWeight: '800', marginBottom: 3 }}>
                    Development Preview
                  </Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 17 }}>
                    Wallet features shown below are for display purposes. Actual transactions (send/receive/swap) require identity verification (KYC/AML) and regulatory compliance before activation.
                  </Text>
                </View>
              </View>

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
                      My Wallet
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
                  WALLET ADDRESS
                </Text>
                <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: SPACING.xl }}>
                  {MOCK_ADDRESS_FULL}
                </Text>

                <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                  {[
                    { icon: 'qr-code-outline', label: AI?.wallet?.receive ?? 'Receive', onPress: () => setShowWalletModal(true) },
                    { icon: 'arrow-up-outline',  label: AI?.wallet?.send ?? 'Send',    onPress: () => Alert.alert('KYC Required', 'Send features will be available after identity verification. Coming soon.') },
                    { icon: 'swap-horizontal',   label: AI?.wallet?.comingSoon ?? 'Swap',    onPress: () => Alert.alert(AI?.wallet?.comingSoon ?? 'Coming Soon', 'Token swap will be available in a future release.') },
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

              {/* Token Balances */}
              <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800', marginBottom: SPACING.lg }}>
                {AI?.wallet?.assets ?? 'Supported Tokens'}
              </Text>

              {WALLET_TOKENS.map((token, i) => (
                <View
                  key={token.symbol}
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
                    backgroundColor: `${token.color}20`,
                    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg,
                  }}>
                    <Text style={{ color: token.color, fontSize: 18, fontWeight: '800' }}>{token.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>{token.symbol}</Text>
                    <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>{token.name}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>—</Text>
                    <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, marginTop: 2 }}>
                      {token.symbol === 'RNAI' ? 'Future Token' : 'Connect wallet'}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Future Roadmap */}
              <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 18, fontWeight: '800', marginTop: SPACING.xl, marginBottom: SPACING.lg }}>
                🗺️ Roadmap
              </Text>

              {[
                { phase: 'Phase 1', title: 'AI Model Manager', desc: 'Browse, connect, and chat with open-source models', status: 'live', icon: '🤖' },
                { phase: 'Phase 2', title: 'Wallet Display', desc: 'View address, QR code, and token balances', status: 'preview', icon: '👁️' },
                { phase: 'Phase 3', title: 'Receive Tokens', desc: 'Accept crypto payments via QR — requires basic KYC', status: 'soon', icon: '📥' },
                { phase: 'Phase 4', title: 'Send & Transfer', desc: 'Full transaction support — requires full KYC/AML', status: 'future', icon: '📤' },
                { phase: 'Phase 5', title: 'Rnai Token (RNAI)', desc: 'Platform utility token — earn by creating content', status: 'future', icon: '⚡' },
              ].map(item => (
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
                          {item.status === 'live' ? '✓ LIVE' : item.status === 'preview' ? 'PREVIEW' : item.status === 'soon' ? 'Q3 2026' : 'FUTURE'}
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
              <Text style={{ color: colors.primary, ...TYPOGRAPHY.caption, fontWeight: '700', marginBottom: 4 }}>What is Ollama?</Text>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 18 }}>
                Ollama lets you run powerful AI models (Llama, Mistral, DeepSeek, etc.) locally on your Mac or PC. Connect this app to your local Ollama server over your home WiFi for private, free AI.
              </Text>
            </View>

            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
              Ollama Server URL
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
                      ? `✅ Connected to Ollama (${models.length} model${models.length === 1 ? '' : 's'}). Using "${firstModel}" — type a message to start!`
                      : `✅ Connected to Ollama, but no models installed. Run "ollama pull llama3.2" on your computer first.`,
                  }]);
                  setShowOllamaModal(false);
                } catch (err: any) {
                  setOllamaConnected(false);
                  setOllamaModelName(null);
                  Alert.alert(
                    'Connection Failed',
                    `Could not reach Ollama at ${ollamaUrl}.\n\nMake sure:\n• Ollama is running on your computer\n• Both devices are on the same WiFi\n• The IP address is correct\n\n(${err?.message ?? 'unknown error'})`,
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
              Setup Guide
            </Text>
            {[
              { step: '1', text: 'Install Ollama from ollama.ai on your Mac/PC' },
              { step: '2', text: 'Run: ollama pull llama3.2 (or any model)' },
              { step: '3', text: 'Make sure your device is on the same WiFi' },
              { step: '4', text: 'Find your computer\'s local IP (System Preferences → Network)' },
              { step: '5', text: 'Enter the URL above and connect' },
            ].map(item => (
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
              {detailModel.description}
            </Text>

            {[
              { label: 'Parameters', value: detailModel.param },
              { label: 'Provider', value: detailModel.provider },
              { label: 'License', value: detailModel.license },
              { label: 'Download Size', value: detailModel.size },
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
                  setChatMessages([{ role: 'ai', text: `Switched to ${detailModel.name}. How can I help you?` }]);
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
                onPress={() => Alert.alert('Download Model', `Download ${detailModel.name} (${detailModel.size}) to run offline on this device?\n\nNote: On-device inference requires a powerful processor and sufficient storage.`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Learn More', onPress: () => {} },
                ])}
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

      {/* ══════════════════════════════════════════════════════
          Modal: Receive / QR
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showWalletModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowWalletModal(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center' }}>
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg, width: '100%' }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: LAYOUT.screenPadding }}>
            <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>
              {AI?.wallet?.receive ?? 'Receive'}
            </Text>
            <TouchableOpacity onPress={() => setShowWalletModal(false)}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: LAYOUT.screenPadding, width: '100%', alignItems: 'center' }}>
            {/* QR Placeholder */}
            <View style={{
              width: 200, height: 200, borderRadius: 20,
              backgroundColor: `${colors.primary}08`,
              borderWidth: 2, borderColor: `${colors.primary}30`,
              justifyContent: 'center', alignItems: 'center',
              marginBottom: SPACING.xl,
            }}>
              <Ionicons name="qr-code" size={140} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, marginBottom: SPACING.sm, textAlign: 'center' }}>
              Your Wallet Address
            </Text>
            <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.body, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.xl }}>
              {MOCK_ADDRESS_FULL}
            </Text>
            <View style={{
              backgroundColor: `${colors.warning ?? '#F59E0B'}12`,
              borderRadius: 12, padding: SPACING.md,
              borderWidth: 1, borderColor: `${colors.warning ?? '#F59E0B'}30`,
            }}>
              <Text style={{ color: colors.warning ?? '#F59E0B', ...TYPOGRAPHY.caption, textAlign: 'center', lineHeight: 17 }}>
                ⚠️ {AI?.wallet?.displayOnly ?? 'Display only — actual wallet activation requires identity verification in a future release.'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
