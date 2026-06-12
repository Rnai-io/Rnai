import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Switch, Modal, TextInput, Image, FlatList,
  Dimensions, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_META, LangCode } from '../i18n';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import {
  getUserApiKey, setUserApiKey, clearUserApiKey,
  looksLikeApiKey, validateApiKey,
} from '../services/api';
import {
  getAuthErrorMessage, sendPasswordReset, fetchBilling, deleteAccount as serviceDeleteAccount,
} from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { useLibrary, formatBytes, computeLibraryStats } from '../context/LibraryContext';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Data ─────────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭', name: 'Thai' },
  { code: 'en', label: 'English', flag: '🇺🇸', name: 'English' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', name: 'Japanese' },
  { code: 'zh', label: '中文', flag: '🇨🇳', name: 'Chinese' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', name: 'Korean' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', name: 'French' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', name: 'German' },
  { code: 'es', label: 'Español', flag: '🇪🇸', name: 'Spanish' },
];

const IMAGE_QUALITY_OPTIONS = [
  { id: 'standard', label: 'Standard', desc: '512×512 · Fast' },
  { id: 'hd', label: 'HD', desc: '1024×1024 · Balanced' },
  { id: 'ultra', label: 'Ultra HD', desc: '2048×2048 · Slow' },
];

const PLAN_TIERS = [
  { id: 'free', label: 'Free', color: '#9CA3AF', bg: '#F3F4F6' },
  { id: 'pro', label: 'Pro', color: '#9333EA', bg: '#F3E8FF' },
  { id: 'enterprise', label: 'Enterprise', color: '#F59E0B', bg: '#FEF9C3' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  const { colors, scheme } = useTheme();
  return (
    <Text style={{
      ...TYPOGRAPHY.caption, fontWeight: '700',
      color: scheme === 'vibrant' ? colors.primary : colors.text.secondary,
      textTransform: 'uppercase', letterSpacing: 1,
      marginHorizontal: LAYOUT.screenPadding,
      marginTop: SPACING.xxl, marginBottom: SPACING.sm,
    }}>
      {title}
    </Text>
  );
}

interface RowProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  isDanger?: boolean;
}

function SettingsRow({ icon, iconColor, iconBg, label, value, rightElement, onPress, showArrow = true, isDanger = false }: RowProps) {
  const { colors, scheme } = useTheme();
  const isVibrant = scheme === 'vibrant';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md + 2,
        borderBottomWidth: 1, borderBottomColor: colors.borders,
      }}
    >
      {/* Icon */}
      <View style={{
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: iconBg, justifyContent: 'center', alignItems: 'center',
        marginRight: SPACING.md,
      }}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      {/* Label */}
      <Text style={{
        ...TYPOGRAPHY.body, flex: 1,
        color: isDanger ? colors.error : colors.text.primary,
      }}>
        {label}
      </Text>
      {/* Right */}
      {rightElement || (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {value && (
            <Text style={{ ...TYPOGRAPHY.subheadline, color: colors.text.secondary }}>
              {value}
            </Text>
          )}
          {showArrow && onPress && (
            <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  const { colors, scheme } = useTheme();
  const isVibrant = scheme === 'vibrant';
  return (
    <View style={{
      marginHorizontal: LAYOUT.screenPadding,
      borderRadius: isVibrant ? 20 : 12,
      overflow: 'hidden',
      ...(isVibrant ? {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 16, elevation: 5,
      } : {
        borderWidth: 1, borderColor: colors.borders,
      }),
    }}>
      {/* Strip last border */}
      {React.Children.map(children, (child, i) => {
        const isLast = i === React.Children.count(children) - 1;
        return isLast
          ? React.cloneElement(child as React.ReactElement<any>, {
              style: [
                (child as React.ReactElement<any>).props?.style,
                { borderBottomWidth: 0 },
              ],
            })
          : child;
      })}
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme, toggleScheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const isVibrant = scheme === 'vibrant';

  // ── State ──
  const { user: authUser, signOut: authSignOut, signIn: ctxSignIn, signUp: ctxSignUp } = useAuth();
  const { items: libraryItems, clearAll: clearLibrary, totalSizeBytes } = useLibrary();
  const libStats = computeLibraryStats(libraryItems);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('Rnai User');
  const email = authUser?.email ?? (lang === 'th' ? 'ยังไม่ได้เข้าสู่ระบบ' : 'Not signed in');

  // ── Real credits from platform ──
  const [billing, setBilling] = useState<{ free: number; paid: number } | null>(null);
  const [billingFailed, setBillingFailed] = useState(false);
  const credits = billing ? billing.free + billing.paid : null;
  const creditsTotal = billing ? Math.max(200, billing.free + billing.paid) : 200;
  const plan = billing && billing.paid > 0 ? 'pro' : 'free';

  const refreshBilling = React.useCallback(() => {
    if (!authUser) { setBilling(null); setBillingFailed(false); return; }
    setBillingFailed(false);
    fetchBilling().then(b => {
      if (b) setBilling({ free: b.freeCreditsRemaining, paid: b.paidCreditsBalance });
      else setBillingFailed(true);
    });
  }, [authUser]);

  React.useEffect(() => { refreshBilling(); }, [refreshBilling]);

  // ── Persisted display name & avatar ──
  React.useEffect(() => {
    AsyncStorage.getItem('@rnai/profile-name').then(v => { if (v) setDisplayName(v); }).catch(() => {});
    AsyncStorage.getItem('@rnai/profile-avatar').then(v => { if (v) setAvatar(v); }).catch(() => {});
  }, []);
  const [imageQuality, setImageQuality] = useState('hd');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  // ── Modals ──
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [editName, setEditName] = useState(displayName);

  // ── API Key (per-user token) ──
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [keySaving, setKeySaving] = useState(false);
  const [showManualKey, setShowManualKey] = useState(false);

  // ── In-app login (Phase B) ──
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authBusy, setAuthBusy] = useState(false);

  const handleLogin = async () => {
    if (!authEmail.trim() || !authPassword) return;
    setAuthBusy(true);
    try {
      const res = await (authMode === 'signin' ? ctxSignIn : ctxSignUp)(authEmail, authPassword);
      const key = await getUserApiKey();
      setStoredKey(key);
      setAuthPassword('');
      setShowApiKey(false);
      Alert.alert(
        '✅',
        lang === 'th'
          ? `เข้าสู่ระบบสำเร็จ (${res.email})\nสร้างและบันทึก API Key ให้อัตโนมัติแล้ว`
          : `Signed in as ${res.email}\nYour API key was created and saved automatically.`,
      );
    } catch (err) {
      Alert.alert(t.common.error, getAuthErrorMessage(err, lang));
    } finally {
      setAuthBusy(false);
    }
  };

  React.useEffect(() => {
    getUserApiKey().then(setStoredKey).catch(() => {});
  }, []);

  const maskedKey = storedKey
    ? `${storedKey.slice(0, 11)}…${storedKey.slice(-4)}`
    : null;

  const handleSaveApiKey = async () => {
    const key = apiKeyInput.trim();
    if (!looksLikeApiKey(key)) {
      Alert.alert(
        t.common.error,
        lang === 'th'
          ? 'รูปแบบคีย์ไม่ถูกต้อง — คีย์ต้องขึ้นต้นด้วย rnai_sk_'
          : 'Invalid key format — keys start with rnai_sk_',
      );
      return;
    }
    setKeySaving(true);
    try {
      const valid = await validateApiKey(key);
      if (!valid) {
        Alert.alert(
          t.common.error,
          lang === 'th'
            ? 'เซิร์ฟเวอร์ไม่ยอมรับคีย์นี้ — ตรวจสอบคีย์ใน rnai-io.vercel.app แล้วลองใหม่'
            : 'The server rejected this key — check it on rnai-io.vercel.app and try again.',
        );
        return;
      }
      await setUserApiKey(key);
      setStoredKey(key);
      setApiKeyInput('');
      setShowApiKey(false);
      Alert.alert('✅', lang === 'th' ? 'บันทึก API Key แล้ว' : 'API key saved');
    } catch {
      Alert.alert(t.common.error, lang === 'th' ? 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' : 'Could not save — try again.');
    } finally {
      setKeySaving(false);
    }
  };

  const handleRemoveApiKey = () => {
    Alert.alert(
      lang === 'th' ? 'ลบ API Key?' : 'Remove API key?',
      lang === 'th' ? 'แอปจะใช้งาน AI ไม่ได้จนกว่าจะใส่คีย์ใหม่' : 'AI features will stop working until you add a new key.',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: lang === 'th' ? 'ลบ' : 'Remove', style: 'destructive',
          onPress: async () => {
            await clearUserApiKey();
            setStoredKey(null);
          },
        },
      ],
    );
  };

  const tierInfo = PLAN_TIERS.find(p => p.id === plan)!;
  const creditsPercent = credits === null ? 0 : Math.min(1, credits / creditsTotal);
  const selectedLangMeta = LANGUAGE_META.find(l => l.code === lang)!;
  const themeLabel = scheme === 'vibrant' ? t.profile.themes.vibrant : scheme === 'brand' ? t.profile.themes.brand : t.profile.themes.modern;
  const qualityInfo = IMAGE_QUALITY_OPTIONS.find(q => q.id === imageQuality)!;
  const qualityLabel = imageQuality === 'standard' ? t.profile.quality.standard : imageQuality === 'hd' ? t.profile.quality.hd : t.profile.quality.ultra;

  // ── Handlers ──
  const handlePickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
        AsyncStorage.setItem('@rnai/profile-avatar', result.assets[0].uri).catch(() => {});
      }
    } catch {
      Alert.alert(t.common.error, lang === 'th' ? 'เปิดคลังรูปภาพไม่ได้' : 'Could not open photo library.');
    }
  };

  const handleSaveProfile = () => {
    const name = editName.trim() || 'Rnai User';
    setDisplayName(name);
    AsyncStorage.setItem('@rnai/profile-name', name).catch(() => {});
    setShowEditProfile(false);
  };

  const handleChangePassword = () => {
    if (!authUser) {
      Alert.alert(t.common.error, lang === 'th' ? 'เข้าสู่ระบบก่อนเปลี่ยนรหัสผ่าน' : 'Sign in first to change your password.');
      return;
    }
    Alert.alert(
      t.profile.fields.changePassword,
      lang === 'th'
        ? `ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ ${authUser.email}?`
        : `Send a password reset link to ${authUser.email}?`,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: lang === 'th' ? 'ส่งลิงก์' : 'Send link',
          onPress: async () => {
            try {
              await sendPasswordReset(authUser.email);
              Alert.alert('📬', lang === 'th' ? 'ส่งแล้ว — เช็คกล่องจดหมายของคุณ' : 'Sent — check your inbox.');
            } catch (e) {
              Alert.alert(t.common.error, getAuthErrorMessage(e, lang));
            }
          },
        },
      ],
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      t.profile.fields.clearCache,
      lang === 'th'
        ? `ลบผลงานทั้งหมดใน Library (${formatBytes(totalSizeBytes)})? การกระทำนี้ย้อนกลับไม่ได้`
        : `Delete all Library items (${formatBytes(totalSizeBytes)})? This cannot be undone.`,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: lang === 'th' ? 'ลบทั้งหมด' : 'Delete all', style: 'destructive',
          onPress: () => {
            clearLibrary();
            Alert.alert('✅', t.common.success);
          },
        },
      ],
    );
  };

  const handleSignOut = () =>
    Alert.alert(t.profile.signOutDialog.title, t.profile.signOutDialog.message, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.profile.signOutDialog.confirm, style: 'destructive',
        onPress: async () => {
          await authSignOut(); // clears session + device API key → auth gate reappears
          setStoredKey(null);
        },
      },
    ]);

  const handleDeleteAccount = () => {
    if (!authUser) {
      Alert.alert(t.common.error, lang === 'th' ? 'ยังไม่ได้เข้าสู่ระบบ' : 'Not signed in.');
      return;
    }
    Alert.alert(t.profile.deleteDialog.title, t.profile.deleteDialog.message, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.profile.deleteDialog.confirm, style: 'destructive',
        onPress: () => {
          // Second confirmation — deletion is permanent
          Alert.alert(
            lang === 'th' ? 'ยืนยันอีกครั้ง' : 'Final confirmation',
            lang === 'th'
              ? `บัญชี ${authUser.email} และเครดิตทั้งหมดจะถูกลบถาวร พิมพ์ใจไว้แล้วนะ?`
              : `Account ${authUser.email} and all credits will be permanently deleted. Continue?`,
            [
              { text: t.common.cancel, style: 'cancel' },
              {
                text: lang === 'th' ? 'ลบถาวร' : 'Delete forever', style: 'destructive',
                onPress: async () => {
                  try {
                    await serviceDeleteAccount(); // deletes Firebase account + clears local state
                    setStoredKey(null);
                    await authSignOut(); // sync context → auth gate reappears
                  } catch (e) {
                    Alert.alert(t.common.error, getAuthErrorMessage(e, lang));
                  }
                },
              },
            ],
          );
        },
      },
    ]);
  };

  const gradientBg = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background] as [string, string];

  // ── Styles ──
  const s = StyleSheet.create({
    heroSection: {
      alignItems: 'center',
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.xxl,
      paddingHorizontal: LAYOUT.screenPadding,
    },
    avatarWrapper: { position: 'relative', marginBottom: SPACING.lg },
    avatarRing: {
      width: 100, height: 100, borderRadius: 50,
      padding: 3,
    },
    avatarInner: {
      width: '100%', height: '100%', borderRadius: 47,
      overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },
    editBadge: {
      position: 'absolute', bottom: 2, right: 2,
      width: 30, height: 30, borderRadius: 15,
      backgroundColor: colors.primary,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 2, borderColor: colors.gradient[0] || colors.background,
    },
    planBadge: {
      paddingHorizontal: SPACING.md, paddingVertical: 4,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: tierInfo.bg, marginBottom: SPACING.md,
    },
    planBadgeText: {
      fontSize: 12, fontWeight: '700', color: tierInfo.color,
    },
    displayName: {
      color: isVibrant ? colors.primary : colors.text.primary,
      fontSize: 22, fontWeight: '800', marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    emailText: {
      color: colors.text.secondary, ...TYPOGRAPHY.subheadline, textAlign: 'center',
    },
    editProfileBtn: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1.5, borderColor: isVibrant ? colors.primary : colors.borders,
      borderRadius: BORDER_RADIUS.full,
      paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
      marginTop: SPACING.md, gap: 6,
    },
    editProfileBtnText: {
      ...TYPOGRAPHY.caption, fontWeight: '600',
      color: isVibrant ? colors.primary : colors.text.primary,
    },
    // Credits card
    creditsCard: {
      marginHorizontal: LAYOUT.screenPadding,
      borderRadius: isVibrant ? 20 : 12,
      padding: SPACING.xl,
      marginTop: SPACING.sm,
      ...(isVibrant && {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
      }),
    },
    creditsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
    creditsLeft: {},
    creditsLabel: { color: 'rgba(255,255,255,0.75)', ...TYPOGRAPHY.caption, marginBottom: 4 },
    creditsValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', lineHeight: 38 },
    creditsUnit: { color: 'rgba(255,255,255,0.75)', ...TYPOGRAPHY.caption },
    topUpBtn: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: BORDER_RADIUS.full,
      paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    },
    topUpText: { color: '#FFFFFF', ...TYPOGRAPHY.caption, fontWeight: '700' },
    progressBg: {
      height: 6, backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: 3, marginBottom: SPACING.sm,
    },
    progressFill: {
      height: '100%', borderRadius: 3, backgroundColor: '#FFFFFF',
    },
    progressLabel: { color: 'rgba(255,255,255,0.75)', ...TYPOGRAPHY.caption },
    // Stats row
    statsRow: {
      flexDirection: 'row', gap: SPACING.md,
      marginHorizontal: LAYOUT.screenPadding,
      marginTop: SPACING.sm,
    },
    statBox: {
      flex: 1, backgroundColor: colors.surface,
      borderRadius: isVibrant ? 16 : 10,
      padding: SPACING.md, alignItems: 'center',
      ...(isVibrant ? {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
      } : { borderWidth: 1, borderColor: colors.borders }),
    },
    statValue: { color: colors.primary, fontSize: 20, fontWeight: '800' },
    statLabel: { color: colors.text.secondary, ...TYPOGRAPHY.caption, textAlign: 'center', marginTop: 2 },
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientBg as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + LAYOUT.tabBarHeight + 20 }}
        >
          {/* ── Hero ── */}
          <View style={s.heroSection}>
            <TouchableOpacity style={s.avatarWrapper} onPress={handlePickAvatar} activeOpacity={0.85}>
              <LinearGradient
                colors={isVibrant ? [colors.primary, colors.secondary] : [colors.primary, colors.primary]}
                style={s.avatarRing}
              >
                <View style={s.avatarInner}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={s.avatarImage} />
                  ) : (
                    <LinearGradient
                      colors={isVibrant ? [`${colors.primary}CC`, `${colors.secondary}CC`] : [colors.primary, colors.primary]}
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 36 }}>
                        {displayName.charAt(0).toUpperCase()}
                      </Text>
                    </LinearGradient>
                  )}
                </View>
              </LinearGradient>
              <View style={s.editBadge}>
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={s.planBadge}>
              <Text style={s.planBadgeText}>
                {tierInfo.id === 'pro' ? t.profile.plans.pro : tierInfo.id === 'enterprise' ? t.profile.plans.enterprise : t.profile.plans.free}
              </Text>
            </View>
            <Text style={s.displayName}>{displayName}</Text>
            <Text style={s.emailText}>{email}</Text>

            <TouchableOpacity style={s.editProfileBtn} onPress={() => { setEditName(displayName); setShowEditProfile(true); }}>
              <Ionicons name="pencil-outline" size={14} color={isVibrant ? colors.primary : colors.text.primary} />
              <Text style={s.editProfileBtnText}>{t.profile.editBtn}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Credits Card ── */}
          <LinearGradient
            colors={isVibrant ? [colors.primary, '#7C3AED'] : [colors.primary, colors.primary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.creditsCard}
          >
            <View style={s.creditsRow}>
              <View style={s.creditsLeft}>
                <Text style={s.creditsLabel}>{t.profile.credits.available}</Text>
                <Text style={s.creditsValue}>{credits === null ? '—' : credits.toLocaleString()}</Text>
                <Text style={s.creditsUnit}>
                  {credits !== null
                    ? `${lang === 'th' ? 'ฟรี' : 'Free'} ${billing!.free.toLocaleString()} · ${lang === 'th' ? 'เติม' : 'Paid'} ${billing!.paid.toLocaleString()}`
                    : !authUser
                    ? (lang === 'th' ? 'เข้าสู่ระบบเพื่อดูเครดิต' : 'Sign in to see credits')
                    : billingFailed
                    ? (lang === 'th' ? 'โหลดไม่สำเร็จ' : 'Could not load')
                    : (lang === 'th' ? 'กำลังโหลด...' : 'Loading...')}
                </Text>
              </View>
              <TouchableOpacity style={s.topUpBtn} onPress={() => Linking.openURL('https://rnai-io.vercel.app/dashboard/billing').catch(() => {})}>
                <Text style={s.topUpText}>+ {t.profile.credits.topUp}</Text>
              </TouchableOpacity>
            </View>
            <View style={s.progressBg}>
              <View style={[s.progressFill, { width: `${creditsPercent * 100}%` }]} />
            </View>
            {billingFailed && authUser ? (
              <TouchableOpacity onPress={refreshBilling}>
                <Text style={[s.progressLabel, { textDecorationLine: 'underline' }]}>
                  {lang === 'th'
                    ? '↻ แตะเพื่อลองใหม่ — ถ้ายังไม่ขึ้น ให้ออกจากระบบแล้วเข้าใหม่หนึ่งครั้ง'
                    : '↻ Tap to retry — if it persists, sign out and back in once'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={s.progressLabel}>
                {credits === null
                  ? ' '
                  : `${Math.round(creditsPercent * 100)}${t.profile.credits.remaining}`}
              </Text>
            )}
          </LinearGradient>

          {/* ── Stats Row ── */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statValue}>{libStats.monthly}</Text>
              <Text style={s.statLabel}>{t.profile.stats.monthly}</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{libStats.total}</Text>
              <Text style={s.statLabel}>{t.profile.stats.total}</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{libStats.streak}</Text>
              <Text style={s.statLabel}>{t.profile.stats.streak}</Text>
            </View>
          </View>

          {/* ── Account ── */}
          <SectionHeader title={t.profile.sections.account} />
          <SettingsCard>
            <SettingsRow icon="person-outline" iconColor="#9333EA" iconBg="#F3E8FF" label={t.profile.fields.displayName} value={displayName} onPress={() => { setEditName(displayName); setShowEditProfile(true); }} />
            <SettingsRow icon="mail-outline" iconColor="#0EA5E9" iconBg="#E0F2FE" label={t.profile.fields.email} value={email} onPress={() => Alert.alert(t.profile.fields.email, t.profile.alerts.emailCannotChange)} />
            <SettingsRow icon="diamond-outline" iconColor="#F59E0B" iconBg="#FEF9C3" label={t.profile.fields.subscription} value={tierInfo.label} onPress={() => Alert.alert(t.profile.fields.subscription, t.profile.alerts.upgradeMsg)} />
            <SettingsRow icon="card-outline" iconColor="#10B981" iconBg="#D1FAE5" label={t.profile.fields.billing} onPress={() => Alert.alert(t.profile.fields.billing, t.profile.alerts.billingMsg)} />
          </SettingsCard>

          {/* ── Preferences ── */}
          <SectionHeader title={t.profile.sections.preferences} />
          <SettingsCard>
            <SettingsRow
              icon="language-outline" iconColor="#8B5CF6" iconBg="#EDE9FE"
              label={t.profile.fields.language} value={`${selectedLangMeta.flag} ${selectedLangMeta.name}`}
              onPress={() => setShowLanguage(true)}
            />
            <SettingsRow
              icon="color-palette-outline" iconColor="#EC4899" iconBg="#FCE7F3"
              label={t.profile.fields.theme} value={themeLabel}
              onPress={toggleScheme}
            />
            <SettingsRow
              icon="image-outline" iconColor="#06B6D4" iconBg="#CFFAFE"
              label={t.profile.fields.imageQuality} value={qualityLabel}
              onPress={() => setShowQuality(true)}
            />
            <SettingsRow
              icon="notifications-outline" iconColor="#F59E0B" iconBg="#FEF9C3"
              label={t.profile.fields.pushNotifications}
              showArrow={false}
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.borders, true: `${colors.primary}80` }}
                  thumbColor={notifications ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor={colors.borders}
                />
              }
            />
            <SettingsRow
              icon="mail-unread-outline" iconColor="#3B82F6" iconBg="#DBEAFE"
              label={t.profile.fields.emailUpdates}
              showArrow={false}
              rightElement={
                <Switch
                  value={emailUpdates}
                  onValueChange={setEmailUpdates}
                  trackColor={{ false: colors.borders, true: `${colors.primary}80` }}
                  thumbColor={emailUpdates ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor={colors.borders}
                />
              }
            />
          </SettingsCard>

          {/* ── Storage & Data ── */}
          <SectionHeader title={t.profile.sections.storage} />
          <SettingsCard>
            <SettingsRow
              icon="save-outline" iconColor="#10B981" iconBg="#D1FAE5"
              label={t.profile.fields.autoSave}
              showArrow={false}
              rightElement={
                <Switch value={autoSave} onValueChange={setAutoSave}
                  trackColor={{ false: colors.borders, true: `${colors.primary}80` }}
                  thumbColor={autoSave ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor={colors.borders} />
              }
            />
            <SettingsRow
              icon="wifi-outline" iconColor="#0EA5E9" iconBg="#E0F2FE"
              label={t.profile.fields.wifiOnly}
              showArrow={false}
              rightElement={
                <Switch value={wifiOnly} onValueChange={setWifiOnly}
                  trackColor={{ false: colors.borders, true: `${colors.primary}80` }}
                  thumbColor={wifiOnly ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor={colors.borders} />
              }
            />
            <SettingsRow
              icon="trash-outline" iconColor="#6B7280" iconBg="#F3F4F6"
              label={t.profile.fields.clearCache} value={formatBytes(totalSizeBytes)}
              onPress={handleClearCache}
            />
          </SettingsCard>

          {/* ── Security ── */}
          <SectionHeader title={t.profile.sections.security} />
          <SettingsCard>
            <SettingsRow
              icon="key-outline" iconColor="#9333EA" iconBg="#F3E8FF"
              label="API Key"
              value={maskedKey ?? (lang === 'th' ? 'ยังไม่ได้ตั้งค่า' : 'Not set')}
              onPress={() => { setApiKeyInput(''); setShowApiKey(true); }}
            />
            <SettingsRow
              icon="lock-closed-outline" iconColor="#7C3AED" iconBg="#EDE9FE"
              label={t.profile.fields.changePassword}
              onPress={handleChangePassword}
            />
            <SettingsRow
              icon="shield-checkmark-outline" iconColor="#059669" iconBg="#D1FAE5"
              label={t.profile.fields.twoFA}
              showArrow={false}
              rightElement={
                <Switch value={twoFA}
                  onValueChange={() => Alert.alert(
                    t.profile.fields.twoFA,
                    lang === 'th' ? 'ฟีเจอร์นี้กำลังจะมาเร็วๆ นี้ 🚧' : 'Coming soon 🚧',
                  )}
                  trackColor={{ false: colors.borders, true: `${colors.primary}80` }}
                  thumbColor={twoFA ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor={colors.borders} />
              }
            />
            <SettingsRow
              icon="time-outline" iconColor="#6B7280" iconBg="#F3F4F6"
              label={t.profile.fields.loginActivity}
              onPress={() => Alert.alert(
                t.profile.fields.loginActivity,
                authUser
                  ? (lang === 'th'
                      ? `บัญชี: ${authUser.email}\nUID: ${authUser.uid.slice(0, 12)}…\nอุปกรณ์นี้: เข้าสู่ระบบอยู่`
                      : `Account: ${authUser.email}\nUID: ${authUser.uid.slice(0, 12)}…\nThis device: signed in`)
                  : (lang === 'th' ? 'ยังไม่ได้เข้าสู่ระบบ' : 'Not signed in'),
              )}
            />
          </SettingsCard>

          {/* ── Support ── */}
          <SectionHeader title={t.profile.sections.support} />
          <SettingsCard>
            <SettingsRow icon="help-circle-outline" iconColor="#0EA5E9" iconBg="#E0F2FE"
              label={t.profile.fields.helpCenter}
              onPress={() => Linking.openURL('https://rnai-io.vercel.app').catch(() => {})} />
            <SettingsRow icon="star-outline" iconColor="#F59E0B" iconBg="#FEF9C3"
              label={t.profile.fields.rateApp}
              onPress={() => Alert.alert(
                t.profile.fields.rateApp,
                lang === 'th'
                  ? 'ขอบคุณที่สนับสนุน! 🙏 การให้คะแนนจะเปิดเมื่อแอปขึ้น App Store'
                  : 'Thank you! 🙏 Rating opens once the app is live on the App Store.',
              )} />
            <SettingsRow icon="chatbubble-outline" iconColor="#8B5CF6" iconBg="#EDE9FE"
              label={t.profile.fields.feedback}
              onPress={() => Linking.openURL(
                `mailto:naiguitarfolk@gmail.com?subject=${encodeURIComponent('Rnai.io Mobile Feedback')}&body=${encodeURIComponent(`\n\n—\nApp v${Constants.expoConfig?.version ?? '1.9.0'} · ${authUser?.email ?? 'guest'}`)}`
              ).catch(() => Alert.alert(t.common.error, lang === 'th' ? 'เปิดแอปอีเมลไม่ได้' : 'Could not open mail app.'))} />
            <SettingsRow icon="document-text-outline" iconColor="#6B7280" iconBg="#F3F4F6"
              label={t.profile.fields.privacy}
              onPress={() => Linking.openURL('https://rnai-io.vercel.app/privacy').catch(() => {})} />
            <SettingsRow icon="newspaper-outline" iconColor="#6B7280" iconBg="#F3F4F6"
              label={t.profile.fields.terms}
              onPress={() => Linking.openURL('https://rnai-io.vercel.app/terms').catch(() => {})} />
          </SettingsCard>

          {/* ── About ── */}
          <SectionHeader title={t.profile.sections.about} />
          <SettingsCard>
            <SettingsRow icon="information-circle-outline" iconColor="#6B7280" iconBg="#F3F4F6"
              label={t.profile.fields.appVersion} value={`v${Constants.expoConfig?.version ?? '1.9.0'}`} showArrow={false} />
            <SettingsRow icon="server-outline" iconColor="#6B7280" iconBg="#F3F4F6"
              label={t.profile.fields.apiStatus} value={t.profile.operationalLabel} showArrow={false} />
          </SettingsCard>

          {/* ── Account Actions ── */}
          <SectionHeader title={t.profile.sections.actions} />
          <SettingsCard>
            <SettingsRow icon="log-out-outline" iconColor="#EF4444" iconBg="#FEE2E2"
              label={t.profile.fields.signOut} isDanger showArrow={false} onPress={handleSignOut} />
            <SettingsRow icon="person-remove-outline" iconColor="#DC2626" iconBg="#FEE2E2"
              label={t.profile.fields.deleteAccount} isDanger showArrow={false} onPress={handleDeleteAccount} />
          </SettingsCard>

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </LinearGradient>

      {/* ══════════════════════════════════════════════════════
          Modal: Edit Profile
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showEditProfile} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowEditProfile(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: LAYOUT.screenPadding }}>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <Text style={{ ...TYPOGRAPHY.body, color: colors.text.secondary }}>{t.common.cancel}</Text>
            </TouchableOpacity>
            <Text style={{ ...TYPOGRAPHY.headline, color: isVibrant ? colors.primary : colors.text.primary }}>{t.profile.modals.editTitle}</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={{ ...TYPOGRAPHY.body, color: colors.primary, fontWeight: '700' }}>{t.common.save}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding }}>
            {/* Avatar picker */}
            <View style={{ alignItems: 'center', marginBottom: SPACING.xxl }}>
              <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
                <LinearGradient
                  colors={isVibrant ? [colors.primary, colors.secondary] : [colors.primary, colors.primary]}
                  style={{ width: 96, height: 96, borderRadius: 48, padding: 3 }}
                >
                  <View style={{ flex: 1, borderRadius: 45, overflow: 'hidden' }}>
                    {avatar ? (
                      <Image source={{ uri: avatar }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <LinearGradient
                        colors={[`${colors.primary}CC`, `${colors.secondary}CC`]}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Text style={{ fontSize: 34 }}>{editName.charAt(0).toUpperCase()}</Text>
                      </LinearGradient>
                    )}
                  </View>
                </LinearGradient>
                <View style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
                  borderWidth: 2, borderColor: colors.background,
                }}>
                  <Ionicons name="camera" size={13} color="#FFF" />
                </View>
              </TouchableOpacity>
              <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, marginTop: SPACING.sm, fontWeight: '600' }}>
                {t.profile.tapToChange}
              </Text>
            </View>

            {/* Name field */}
            <Text style={{ ...TYPOGRAPHY.caption, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
              {t.profile.fields.displayName}
            </Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              style={{
                backgroundColor: colors.surface,
                borderRadius: isVibrant ? 14 : 10,
                borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                padding: SPACING.lg, ...TYPOGRAPHY.body,
                color: colors.text.primary, marginBottom: SPACING.xl,
                ...(isVibrant && {
                  shadowColor: colors.cardShadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
                }),
              }}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.tertiary}
              maxLength={30}
            />
            <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.tertiary, textAlign: 'right', marginTop: -SPACING.lg }}>
              {editName.length}/30
            </Text>

            {/* Email (read only) */}
            <Text style={{ ...TYPOGRAPHY.caption, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.xl }}>
              {t.profile.fields.email}
            </Text>
            <View style={{
              backgroundColor: `${colors.surface}80`,
              borderRadius: isVibrant ? 14 : 10,
              borderWidth: 1, borderColor: colors.borders,
              padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
            }}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.text.tertiary} />
              <Text style={{ ...TYPOGRAPHY.body, color: colors.text.secondary }}>{email}</Text>
            </View>
            <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.tertiary, marginTop: SPACING.sm }}>
              {t.profile.emailNote}
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════
          Modal: API Key (per-user token)
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showApiKey} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowApiKey(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: LAYOUT.screenPadding }}>
            <TouchableOpacity onPress={() => setShowApiKey(false)}>
              <Text style={{ ...TYPOGRAPHY.body, color: colors.text.secondary }}>{t.common.cancel}</Text>
            </TouchableOpacity>
            <Text style={{ ...TYPOGRAPHY.headline, color: isVibrant ? colors.primary : colors.text.primary }}>🔑 API Key</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding }} keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: `${colors.primary}10`, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.xl }}>
              <Text style={{ color: colors.primary, ...TYPOGRAPHY.caption, fontWeight: '700', marginBottom: 4 }}>
                {lang === 'th' ? 'บัญชี Rnai.io ของคุณ' : 'Your Rnai.io account'}
              </Text>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 18 }}>
                {lang === 'th'
                  ? 'เข้าสู่ระบบหรือสมัครสมาชิก แอปจะสร้าง API Key ส่วนตัวให้อัตโนมัติ (สมาชิกใหม่ได้ฟรี 200 เครดิต) คีย์ถูกเก็บปลอดภัยในเครื่องคุณเท่านั้น'
                  : 'Sign in or create an account — the app will mint your personal API key automatically (new users get 200 free credits). Stored securely on this device only.'}
              </Text>
            </View>

            {!storedKey && (
              <>
                {/* Sign in / Sign up toggle */}
                <View style={{
                  flexDirection: 'row', backgroundColor: colors.borders,
                  borderRadius: BORDER_RADIUS.full, padding: 3, marginBottom: SPACING.lg,
                }}>
                  {(['signin', 'signup'] as const).map(m => (
                    <TouchableOpacity
                      key={m}
                      onPress={() => setAuthMode(m)}
                      style={{
                        flex: 1, paddingVertical: SPACING.sm,
                        borderRadius: BORDER_RADIUS.full, alignItems: 'center',
                        backgroundColor: authMode === m ? colors.surface : 'transparent',
                      }}
                    >
                      <Text style={{
                        ...TYPOGRAPHY.caption, fontWeight: '700',
                        color: authMode === m ? colors.primary : colors.text.tertiary,
                      }}>
                        {m === 'signin'
                          ? (lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In')
                          : (lang === 'th' ? 'สมัครสมาชิก' : 'Sign Up')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: isVibrant ? 14 : 10,
                    borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                    padding: SPACING.lg, ...TYPOGRAPHY.body,
                    color: colors.text.primary, marginBottom: SPACING.md,
                  }}
                  placeholder={lang === 'th' ? 'อีเมล' : 'Email'}
                  placeholderTextColor={colors.text.tertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!authBusy}
                />
                <TextInput
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: isVibrant ? 14 : 10,
                    borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                    padding: SPACING.lg, ...TYPOGRAPHY.body,
                    color: colors.text.primary, marginBottom: SPACING.lg,
                  }}
                  placeholder={lang === 'th' ? 'รหัสผ่าน (อย่างน้อย 6 ตัว)' : 'Password (min 6 chars)'}
                  placeholderTextColor={colors.text.tertiary}
                  secureTextEntry
                  editable={!authBusy}
                />

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={authBusy || !authEmail.trim() || authPassword.length < 6}
                  style={{
                    backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.full,
                    paddingVertical: 15, alignItems: 'center',
                    opacity: authBusy || !authEmail.trim() || authPassword.length < 6 ? 0.5 : 1,
                    marginBottom: SPACING.xl,
                  }}
                >
                  <Text style={{ color: '#FFF', ...TYPOGRAPHY.callout, fontWeight: '700' }}>
                    {authBusy
                      ? (lang === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Signing in...')
                      : authMode === 'signin'
                        ? (lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In')
                        : (lang === 'th' ? 'สมัครและรับ 200 เครดิตฟรี' : 'Sign up — get 200 free credits')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowManualKey(v => !v)} style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
                  <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.tertiary, textDecorationLine: 'underline' }}>
                    {lang === 'th' ? 'มี API Key อยู่แล้ว? วางคีย์เอง' : 'Already have an API key? Paste it manually'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {storedKey && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
                backgroundColor: colors.surface, borderRadius: 14,
                borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                padding: SPACING.lg, marginBottom: SPACING.xl,
              }}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success ?? '#10B981'} />
                <Text style={{ flex: 1, color: colors.text.primary, ...TYPOGRAPHY.body, fontWeight: '600' }}>
                  {maskedKey}
                </Text>
                <TouchableOpacity onPress={handleRemoveApiKey}>
                  <Text style={{ color: colors.error, ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                    {lang === 'th' ? 'ลบ' : 'Remove'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {(showManualKey || storedKey) && (
              <>
                <Text style={{ ...TYPOGRAPHY.caption, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
                  {storedKey
                    ? (lang === 'th' ? 'เปลี่ยนคีย์ใหม่' : 'Replace key')
                    : (lang === 'th' ? 'วางคีย์ของคุณ' : 'Paste your key')}
                </Text>
                <TextInput
                  value={apiKeyInput}
                  onChangeText={setApiKeyInput}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: isVibrant ? 14 : 10,
                    borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                    padding: SPACING.lg, ...TYPOGRAPHY.body,
                    color: colors.text.primary, marginBottom: SPACING.xl,
                  }}
                  placeholder="rnai_sk_..."
                  placeholderTextColor={colors.text.tertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  editable={!keySaving}
                />

                <TouchableOpacity
                  onPress={handleSaveApiKey}
                  disabled={keySaving || !apiKeyInput.trim()}
                  style={{
                    backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.full,
                    paddingVertical: 15, alignItems: 'center',
                    opacity: keySaving || !apiKeyInput.trim() ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: '#FFF', ...TYPOGRAPHY.callout, fontWeight: '700' }}>
                    {keySaving
                      ? (lang === 'th' ? 'กำลังตรวจสอบคีย์...' : 'Verifying key...')
                      : (lang === 'th' ? 'ตรวจสอบและบันทึก' : 'Verify & Save')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════
          Modal: Language Picker
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showLanguage} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowLanguage(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: LAYOUT.screenPadding }}>
            <TouchableOpacity onPress={() => setShowLanguage(false)}>
              <Text style={{ ...TYPOGRAPHY.body, color: colors.text.secondary }}>{t.common.cancel}</Text>
            </TouchableOpacity>
            <Text style={{ ...TYPOGRAPHY.headline, color: isVibrant ? colors.primary : colors.text.primary }}>{t.profile.modals.languageTitle}</Text>
            <View style={{ width: 50 }} />
          </View>

          <FlatList
            data={LANGUAGE_META}
            keyExtractor={item => item.code}
            contentContainerStyle={{ paddingHorizontal: LAYOUT.screenPadding, gap: SPACING.sm }}
            renderItem={({ item }) => {
              const isSelected = item.code === lang;
              return (
                <TouchableOpacity
                  onPress={() => { setLang(item.code as LangCode); setShowLanguage(false); }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: isSelected ? `${colors.primary}12` : colors.surface,
                    borderRadius: isVibrant ? 16 : 10,
                    padding: SPACING.lg,
                    borderWidth: isSelected ? 2 : (isVibrant ? 0 : 1),
                    borderColor: isSelected ? colors.primary : colors.borders,
                    ...(isVibrant && !isSelected && {
                      shadowColor: colors.cardShadow,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
                    }),
                  }}
                >
                  <Text style={{ fontSize: 28, marginRight: SPACING.lg }}>{item.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...TYPOGRAPHY.headline, color: isSelected ? colors.primary : colors.text.primary }}>{item.label}</Text>
                    <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary }}>{item.name}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════
          Modal: Image Quality
      ══════════════════════════════════════════════════════ */}
      <Modal visible={showQuality} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowQuality(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: LAYOUT.screenPadding }}>
            <TouchableOpacity onPress={() => setShowQuality(false)}>
              <Text style={{ ...TYPOGRAPHY.body, color: colors.text.secondary }}>{t.common.cancel}</Text>
            </TouchableOpacity>
            <Text style={{ ...TYPOGRAPHY.headline, color: isVibrant ? colors.primary : colors.text.primary }}>{t.profile.modals.qualityTitle}</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={{ padding: LAYOUT.screenPadding, gap: SPACING.md }}>
            {IMAGE_QUALITY_OPTIONS.map(opt => {
              const isSelected = opt.id === imageQuality;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => { setImageQuality(opt.id); setShowQuality(false); }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: isSelected ? `${colors.primary}12` : colors.surface,
                    borderRadius: isVibrant ? 18 : 12,
                    padding: SPACING.xl,
                    borderWidth: isSelected ? 2 : (isVibrant ? 0 : 1),
                    borderColor: isSelected ? colors.primary : colors.borders,
                    ...(isVibrant && !isSelected && {
                      shadowColor: colors.cardShadow,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
                    }),
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: isSelected ? `${colors.primary}20` : `${colors.primary}10`,
                    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg,
                  }}>
                    <Ionicons
                      name={opt.id === 'standard' ? 'image-outline' : opt.id === 'hd' ? 'albums-outline' : 'sparkles-outline'}
                      size={22} color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...TYPOGRAPHY.headline, color: isSelected ? colors.primary : colors.text.primary }}>
                      {opt.id === 'standard' ? t.profile.quality.standard : opt.id === 'hd' ? t.profile.quality.hd : t.profile.quality.ultra}
                    </Text>
                    <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary, marginTop: 2 }}>
                      {opt.id === 'standard' ? t.profile.quality.standardDesc : opt.id === 'hd' ? t.profile.quality.hdDesc : t.profile.quality.ultraDesc}
                    </Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}
