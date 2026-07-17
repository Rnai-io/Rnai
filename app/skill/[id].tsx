import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  ActivityIndicator, TouchableOpacity, Image,
  FlatList, Dimensions, Alert, Share,
  KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import WebView from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, AudioModule, setAudioModeAsync } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useLibrary } from '../context/LibraryContext';

import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SKILL_TEMPLATES, PromptTemplate, getSkillCategory, localizeTemplate } from '../data/skillTemplates';
import { executeSkill, isSkillReady, getErrorMessage, pingApi, ApiError, SkillResult } from '../services/api';
import { ensurePlatformUser } from '../services/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EXAMPLE_CARD_WIDTH = SCREEN_WIDTH * 0.68;

// ── Website Builder Options ───────────────────────────────────────────────────

interface WebsiteOptions {
  siteName: string;
  siteType: string;
  colorTheme: string;
  sections: string[];
  styleTone: string;
  siteLanguage: string;
}

const SITE_TYPES = [
  { value: 'portfolio', label: '🎨 Portfolio' },
  { value: 'business', label: '💼 Business' },
  { value: 'restaurant', label: '🍽️ Restaurant' },
  { value: 'blog', label: '📝 Blog' },
  { value: 'saas', label: '🚀 SaaS' },
  { value: 'ecommerce', label: '🛒 E-Commerce' },
  { value: 'landing', label: '🎯 Landing Page' },
];

const COLOR_THEMES = [
  { value: 'light', label: '☀️ Light', color: '#F8FAFC' },
  { value: 'dark', label: '🌙 Dark', color: '#1E293B' },
  { value: 'blue', label: '💙 Blue', color: '#3B82F6' },
  { value: 'purple', label: '💜 Purple', color: '#8B5CF6' },
  { value: 'green', label: '💚 Green', color: '#10B981' },
  { value: 'red', label: '❤️ Red', color: '#EF4444' },
  { value: 'orange', label: '🧡 Orange', color: '#F97316' },
];

const WEBSITE_SECTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'about', label: 'About' },
  { value: 'features', label: 'Features' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'testimonials', label: 'Reviews' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'faq', label: 'FAQ' },
  { value: 'contact', label: 'Contact' },
  { value: 'team', label: 'Team' },
  { value: 'blog', label: 'Blog' },
];

const STYLE_TONES = [
  { value: 'minimal', label: '🪴 Minimal' },
  { value: 'bold', label: '⚡ Bold' },
  { value: 'elegant', label: '✨ Elegant' },
  { value: 'playful', label: '🎪 Playful' },
  { value: 'corporate', label: '🏢 Corporate' },
];

// ── Target languages for the translate skill (value = what the API expects)
const TARGET_LANGUAGES = [
  { code: 'th',  flag: '🇹🇭', value: 'Thai' },
  { code: 'en',  flag: '🇺🇸', value: 'English' },
  { code: 'id',  flag: '🇮🇩', value: 'Indonesian' },
  { code: 'ms',  flag: '🇲🇾', value: 'Malay' },
  { code: 'vi',  flag: '🇻🇳', value: 'Vietnamese' },
  { code: 'fil', flag: '🇵🇭', value: 'Filipino' },
  { code: 'km',  flag: '🇰🇭', value: 'Khmer' },
  { code: 'lo',  flag: '🇱🇦', value: 'Lao' },
  { code: 'my',  flag: '🇲🇲', value: 'Burmese' },
  { code: 'ja',  flag: '🇯🇵', value: 'Japanese' },
  { code: 'zh',  flag: '🇨🇳', value: 'Chinese' },
  { code: 'ko',  flag: '🇰🇷', value: 'Korean' },
  { code: 'fr',  flag: '🇫🇷', value: 'French' },
  { code: 'de',  flag: '🇩🇪', value: 'German' },
  { code: 'es',  flag: '🇪🇸', value: 'Spanish' },
];

export default function SkillDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const id = (route.params as any)?.id as string;
  const { colors, scheme } = useTheme();
  const { t, lang } = useLanguage();
  const { saveItem } = useLibrary();
  const [savedId, setSavedId] = useState<string | null>(null);
  const isVibrant = scheme === 'vibrant';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  // ── Speech-to-text recording (audio-stt) ──
  const [audioB64, setAudioB64] = useState<string | null>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  // Translate skill: default target = opposite of app language for convenience
  const [targetLang, setTargetLang] = useState(lang === 'en' ? 'Thai' : 'English');

  // Website builder options (only used for website-gen)
  const [websiteOptions, setWebsiteOptions] = useState<WebsiteOptions>({
    siteName: '',
    siteType: 'portfolio',
    colorTheme: 'light',
    sections: ['hero', 'about', 'features', 'contact'],
    styleTone: 'minimal',
    siteLanguage: lang === 'th' ? 'Thai' : 'English',
  });
  const toggleSection = (val: string) => {
    setWebsiteOptions(prev => ({
      ...prev,
      sections: prev.sections.includes(val)
        ? prev.sections.filter(s => s !== val)
        : [...prev.sections, val],
    }));
  };

  const templates = (SKILL_TEMPLATES[id] || []).map(tmpl => localizeTemplate(tmpl, lang));
  const skillCategory = getSkillCategory(id);
  const skillReady = isSkillReady(id);

  // Backend reachability check (offline banner)
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [pingLoading, setPingLoading] = useState(false);

  const checkServer = React.useCallback(async () => {
    if (pingLoading) return;
    setPingLoading(true);
    setServerOnline(null); // show neutral state while checking
    const ok = await pingApi();
    setServerOnline(ok);
    // If server just came back online, clear any stale offline-related error
    if (ok) setError(prev => (prev?.includes('เซิร์ฟเวอร์') || prev?.includes('server') || prev?.includes('network') || prev?.includes('เชื่อมต่อ')) ? null : prev);
    setPingLoading(false);
  }, [pingLoading]);

  React.useEffect(() => {
    let cancelled = false;
    if (skillReady) {
      pingApi().then(ok => { if (!cancelled) setServerOnline(ok); });
    }
    return () => { cancelled = true; };
  }, [skillReady]);

  // Auto-clear error when server goes offline to avoid dual-banner confusion
  React.useEffect(() => {
    if (serverOnline === false) {
      setError(null);
    }
  }, [serverOnline]);

  // Icon map — names/descriptions come from translations
  const skillIconMap: Record<string, string> = {
    'image-gen': '🎨', 'image-edit': '✏️', 'remove-bg': '✂️', 'upscale': '🔍',
    'stylize': '🖌️', 'text-gen': '📝', 'text-sum': '📋', 'text-trans': '🌐',
    'text-rewrite': '♻️', 'website-gen': '💻', 'audio-tts': '🔊',
    // New skills
    'image-describe': '👁️', 'face-restore': '✨',
    'text-grammar': '✅', 'text-code': '</>', 'text-hashtag': '#',
    'audio-stt': '🎙️', 'text-extract': '🧩',
  };

  const skill = {
    name: t.skills[id]?.name ?? 'AI Skill',
    icon: skillIconMap[id] ?? '⚡',
    description: t.skills[id]?.description ?? '',
  };

  const pickImage = async () => {
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });
      if (!picked.canceled && picked.assets[0]?.base64) {
        setImage(`data:image/jpeg;base64,${picked.assets[0].base64}`);
      }
    } catch {
      Alert.alert(t.common.error, lang === 'th' ? 'เปิดคลังรูปภาพไม่ได้ — ตรวจสอบสิทธิ์การเข้าถึงรูปภาพ' : 'Could not open photo library — check photo permissions.');
    }
  };

  const startRecording = async () => {
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(t.common.error, lang === 'th' ? 'กรุณาอนุญาตให้เข้าถึงไมโครโฟนในการตั้งค่า' : 'Please allow microphone access in Settings.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      setAudioB64(null);
      setError(null);
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch {
      Alert.alert(t.common.error, lang === 'th' ? 'เริ่มบันทึกเสียงไม่ได้' : 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) return;
      const res = await fetch(uri);
      const blob = await res.blob();
      const b64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(((reader.result as string).split(',')[1]) ?? '');
        reader.onerror = () => reject(new Error('read failed'));
        reader.readAsDataURL(blob);
      });
      setAudioB64(b64);
    } catch {
      Alert.alert(t.common.error, lang === 'th' ? 'บันทึกเสียงไม่สำเร็จ' : 'Could not save recording.');
    }
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setInput(template.prompt);
    setSelectedTemplateId(template.id);
    setError(null); // clear any previous error when user picks a new template
    setResult(null);
    setSavedId(null);
  };

  const handleExecute = async () => {
    if (loading) return; // prevent double-submit
    const isStt = id === 'audio-stt';
    if (isStt ? !audioB64 : (!input.trim() && !image)) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSavedId(null);
    const skillInput = {
      prompt: input.trim(),
      image,
      audio: audioB64,
      extra: id === 'text-trans'
        ? { targetLanguage: targetLang }
        : id === 'website-gen'
        ? {
            template: selectedTemplateId || 'wg-1',
            siteName: websiteOptions.siteName || 'My Website',
            siteType: websiteOptions.siteType,
            colorTheme: websiteOptions.colorTheme,
            sections: websiteOptions.sections.join(','),
            styleTone: websiteOptions.styleTone,
            siteLanguage: websiteOptions.siteLanguage,
          }
        : undefined,
    };
    try {
      const res = await executeSkill(id, skillInput);
      setResult(res);
    } catch (err) {
      // Self-heal: a fresh account may be missing its platform credits doc.
      // Re-initialize the user once, then retry.
      if (err instanceof ApiError && err.code === 'no-credits') {
        const recovered = await ensurePlatformUser();
        if (recovered) {
          try {
            const res = await executeSkill(id, skillInput);
            setResult(res);
            return;
          } catch (retryErr) {
            setError(getErrorMessage(retryErr, lang));
            return;
          } finally {
            setLoading(false);
          }
        }
      }
      setError(getErrorMessage(err, lang));
    } finally {
      setLoading(false);
    }
  };

  // Display helpers derived from result
  const resultIsImage = result?.kind === 'image';
  const resultDisplayText = result
    ? result.kind === 'website'
      ? (lang === 'th'
          ? `✅ เว็บไซต์สร้างสำเร็จแล้ว! (HTML ${result.content.length} ตัวอักษร)`
          : `✅ Website generated! (${result.content.length} chars of HTML)`)
      : result.content
    : '';

  const gradientBg = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background] as [string, string];

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: LAYOUT.screenPadding,
      paddingVertical: SPACING.md,
      borderBottomWidth: isVibrant ? 0 : 1,
      borderBottomColor: colors.borders,
    },
    backButton: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: isVibrant ? 'rgba(255,255,255,0.7)' : 'transparent',
      justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: {
      color: isVibrant ? colors.primary : colors.text.primary,
      ...TYPOGRAPHY.headline, fontWeight: '700',
      marginLeft: SPACING.lg, flex: 1,
    },
    scrollContent: {
      paddingBottom: SPACING.xxxl + 20,
    },
    // ── Hero ──
    heroSection: {
      alignItems: 'center',
      paddingHorizontal: LAYOUT.screenPadding,
      paddingTop: SPACING.xl,
      paddingBottom: SPACING.lg,
    },
    iconContainer: {
      width: 80, height: 80, borderRadius: 24,
      backgroundColor: isVibrant ? `${colors.primary}15` : colors.surface,
      justifyContent: 'center', alignItems: 'center',
      marginBottom: SPACING.lg,
      ...(isVibrant && {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
      }),
    },
    skillIcon: { fontSize: 40 },
    skillName: {
      color: isVibrant ? colors.primary : colors.text.primary,
      fontSize: 22, fontWeight: '700', textAlign: 'center',
      marginBottom: SPACING.sm,
    },
    skillDescription: {
      color: colors.text.secondary, ...TYPOGRAPHY.subheadline,
      textAlign: 'center',
    },
    // ── Section Header ──
    sectionRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: LAYOUT.screenPadding,
      marginTop: SPACING.xxl, marginBottom: SPACING.md,
    },
    sectionLabel: {
      color: isVibrant ? colors.primary : colors.text.primary,
      ...TYPOGRAPHY.headline,
    },
    sectionCount: {
      color: colors.text.tertiary, ...TYPOGRAPHY.caption,
    },
    // ── Example Cards ──
    examplesScroll: { paddingLeft: LAYOUT.screenPadding },
    exampleCard: {
      width: EXAMPLE_CARD_WIDTH,
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? 20 : 12,
      marginRight: SPACING.md,
      overflow: 'hidden',
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12, shadowRadius: 16, elevation: 6,
      }),
    },
    exampleImage: { width: '100%', height: 160, backgroundColor: `${colors.primary}10` },
    exampleTextBadge: {
      margin: SPACING.md,
      backgroundColor: `${colors.primary}12`,
      borderRadius: 10, padding: SPACING.md,
    },
    exampleBody: { padding: SPACING.md, paddingTop: SPACING.sm },
    examplePromptText: {
      color: colors.text.primary, ...TYPOGRAPHY.caption,
      fontStyle: 'italic', marginBottom: SPACING.sm,
    },
    exampleCaption: {
      color: isVibrant ? colors.primary : colors.text.secondary,
      ...TYPOGRAPHY.caption, fontWeight: '600',
    },
    exampleNumber: {
      position: 'absolute', top: SPACING.sm, left: SPACING.sm,
      backgroundColor: colors.primary, borderRadius: 12,
      paddingHorizontal: SPACING.sm, paddingVertical: 2,
    },
    exampleNumberText: { color: colors.text.inverse, fontSize: 11, fontWeight: '700' },
    // ── Quick Prompt Chips ──
    chipsScroll: { paddingLeft: LAYOUT.screenPadding, paddingBottom: SPACING.sm },
    chip: {
      flexDirection: 'row', alignItems: 'center',
      borderRadius: BORDER_RADIUS.full,
      paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
      marginRight: SPACING.sm,
      borderWidth: 1.5,
    },
    chipLabel: { ...TYPOGRAPHY.caption, fontWeight: '600', marginLeft: 4 },
    // ── Input Area ──
    inputSection: { paddingHorizontal: LAYOUT.screenPadding, marginTop: SPACING.xl },
    inputWrapper: { position: 'relative', marginBottom: SPACING.lg },
    input: {
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? BORDER_RADIUS.large : BORDER_RADIUS.medium,
      borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
      padding: SPACING.lg, paddingBottom: 52,
      color: colors.text.primary, ...TYPOGRAPHY.body,
      minHeight: 130, textAlignVertical: 'top',
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
      }),
    },
    inputActions: {
      position: 'absolute', bottom: SPACING.sm, right: SPACING.sm,
      flexDirection: 'row', gap: SPACING.sm,
    },
    inputActionBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: isVibrant ? `${colors.primary}12` : colors.background,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
    },
    charCount: {
      textAlign: 'right', ...TYPOGRAPHY.caption,
      color: colors.text.tertiary, marginTop: -SPACING.sm, marginBottom: SPACING.lg,
    },
    imagePreviewContainer: {
      position: 'relative', marginBottom: SPACING.lg, alignSelf: 'flex-start',
    },
    imagePreview: { width: 100, height: 100, borderRadius: BORDER_RADIUS.medium },
    removeImageButton: { position: 'absolute', top: -10, right: -10 },
    // ── Result ──
    resultText: { color: colors.text.inverse, ...TYPOGRAPHY.body },
    loadingContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xl },
    // ── Error / Coming Soon ──
    errorCard: {
      marginTop: SPACING.xl,
      backgroundColor: `${colors.error}12`,
      borderWidth: 1, borderColor: `${colors.error}40`,
      borderRadius: BORDER_RADIUS.medium,
      padding: SPACING.lg,
      flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    },
    errorText: { flex: 1, color: colors.error, ...TYPOGRAPHY.subheadline },
    retryBtn: {
      backgroundColor: colors.error, borderRadius: BORDER_RADIUS.full,
      paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    },
    comingSoonCard: {
      backgroundColor: `${colors.warning ?? '#F59E0B'}12`,
      borderWidth: 1, borderColor: `${colors.warning ?? '#F59E0B'}40`,
      borderRadius: BORDER_RADIUS.medium,
      padding: SPACING.lg, marginBottom: SPACING.lg,
      flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    },
    comingSoonText: { flex: 1, color: colors.warning ?? '#F59E0B', ...TYPOGRAPHY.subheadline, fontWeight: '600' },
    // ── Website Builder Panel ──
    wbPanel: {
      marginHorizontal: LAYOUT.screenPadding,
      marginTop: SPACING.xl,
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? 20 : 12,
      borderWidth: isVibrant ? 0 : 1,
      borderColor: colors.borders,
      overflow: 'hidden',
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 16, elevation: 5,
      }),
    },
    wbPanelHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
      borderBottomWidth: 1, borderBottomColor: colors.borders,
      backgroundColor: isVibrant ? `${colors.primary}08` : 'transparent',
    },
    wbPanelTitle: {
      ...TYPOGRAPHY.headline, fontWeight: '700',
      color: isVibrant ? colors.primary : colors.text.primary,
    },
    wbSection: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
    wbLabel: {
      ...TYPOGRAPHY.caption, fontWeight: '700',
      color: colors.text.secondary, marginBottom: SPACING.sm,
      textTransform: 'uppercase', letterSpacing: 0.5,
    },
    wbInput: {
      backgroundColor: isVibrant ? `${colors.primary}06` : colors.background,
      borderRadius: BORDER_RADIUS.medium, borderWidth: 1,
      borderColor: colors.borders,
      paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
      color: colors.text.primary, ...TYPOGRAPHY.body,
      marginBottom: SPACING.sm,
    },
    wbChip: {
      borderRadius: BORDER_RADIUS.full,
      paddingHorizontal: SPACING.md, paddingVertical: 6,
      marginRight: SPACING.sm, marginBottom: SPACING.sm,
      borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 4,
    },
    wbChipLabel: { ...TYPOGRAPHY.caption, fontWeight: '600' },
    wbSectionsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.sm },
    wbColorDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
    wbDivider: { height: 1, backgroundColor: colors.borders, marginTop: SPACING.md },
    wbPanelBottom: { height: SPACING.lg },
  });

  // Render example card
  const renderExampleCard = ({ item, index }: { item: PromptTemplate; index: number }) => (
    <TouchableOpacity
      style={styles.exampleCard}
      activeOpacity={0.85}
      onPress={() => handleSelectTemplate(item)}
    >
      {skillCategory === 'image' || skillCategory === 'web' ? (
        item.exampleImage ? (
          <View>
            <Image
              source={{ uri: item.exampleImage }}
              style={styles.exampleImage}
              resizeMode="cover"
            />
            <View style={styles.exampleNumber}>
              <Text style={styles.exampleNumberText}>{index + 1}</Text>
            </View>
          </View>
        ) : (
          <LinearGradient
            colors={[`${colors.primary}20`, `${colors.secondary}20`]}
            style={[styles.exampleImage, { justifyContent: 'center', alignItems: 'center' }]}
          >
            <Text style={{ fontSize: 40 }}>{skill.icon}</Text>
          </LinearGradient>
        )
      ) : (
        <View style={styles.exampleTextBadge}>
          <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary, fontStyle: 'italic', lineHeight: 20 }} numberOfLines={4}>
            "{item.prompt.substring(0, 120)}{item.prompt.length > 120 ? '…' : ''}"
          </Text>
        </View>
      )}
      <View style={styles.exampleBody}>
        <Text style={styles.exampleCaption}>{item.exampleCaption}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: 4 }}>
          <Ionicons name="flash-outline" size={12} color={colors.primary} />
          <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '600' }}>
            {t.common.tapToUse}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientBg as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={isVibrant ? colors.primary : colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{skill.name}</Text>
          <View style={{
            backgroundColor: isVibrant ? `${colors.primary}15` : colors.surface,
            borderRadius: 12, paddingHorizontal: SPACING.sm, paddingVertical: 4,
          }}>
            <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '700' }}>
              {templates.length} {t.skill.templatesCount}
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top + 44}
        >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
          keyboardShouldPersistTaps="handled"
        >

          {/* Hero */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.skillIcon}>{skill.icon}</Text>
            </View>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillDescription}>{skill.description}</Text>
          </View>

          {/* ── Example Cards ── */}
          {templates.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>{t.skill.examplesLabel}</Text>
                <Text style={styles.sectionCount}>{t.common.tapToUse}</Text>
              </View>
              <FlatList
                data={templates}
                renderItem={renderExampleCard}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.examplesScroll}
                snapToInterval={EXAMPLE_CARD_WIDTH + SPACING.md}
                decelerationRate="fast"
              />
            </>
          )}

          {/* ── Quick Prompt Chips ── */}
          {templates.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>{t.skill.quickPrompts}</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {templates.map(tmpl => {
                  const isActive = selectedTemplateId === tmpl.id;
                  return (
                    <TouchableOpacity
                      key={tmpl.id}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isActive ? colors.primary : colors.surface,
                          borderColor: isActive ? colors.primary : colors.borders,
                          ...(isVibrant && {
                            shadowColor: isActive ? colors.primary : 'transparent',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
                          }),
                        },
                      ]}
                      onPress={() => handleSelectTemplate(tmpl)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 13 }}>
                        {tmpl.label.split(' ')[0]}
                      </Text>
                      <Text style={[
                        styles.chipLabel,
                        { color: isActive ? colors.text.inverse : colors.text.primary },
                      ]}>
                        {tmpl.label.substring(tmpl.label.indexOf(' ') + 1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}

          {/* ── Website Builder Panel ── */}
          {id === 'website-gen' && (
            <View style={styles.wbPanel}>
              {/* Panel Header */}
              <View style={styles.wbPanelHeader}>
                <Text style={styles.wbPanelTitle}>
                  🛠️ {lang === 'th' ? 'ตั้งค่าเว็บไซต์' : 'Website Settings'}
                </Text>
                <View style={{
                  backgroundColor: `${colors.primary}15`, borderRadius: 8,
                  paddingHorizontal: 8, paddingVertical: 3,
                }}>
                  <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '700' }}>
                    {websiteOptions.sections.length} {lang === 'th' ? 'ส่วน' : 'sections'}
                  </Text>
                </View>
              </View>

              {/* Site Name */}
              <View style={styles.wbSection}>
                <Text style={styles.wbLabel}>
                  🏷️ {lang === 'th' ? 'ชื่อเว็บไซต์' : 'Website Name'}
                </Text>
                <TextInput
                  style={styles.wbInput}
                  placeholder={lang === 'th' ? 'เช่น "My Portfolio"' : 'e.g. "My Portfolio"'}
                  placeholderTextColor={colors.text.tertiary}
                  value={websiteOptions.siteName}
                  onChangeText={v => setWebsiteOptions(p => ({ ...p, siteName: v }))}
                  editable={!loading}
                />
              </View>

              <View style={styles.wbDivider} />

              {/* Site Type */}
              <View style={styles.wbSection}>
                <Text style={styles.wbLabel}>
                  📁 {lang === 'th' ? 'ประเภทเว็บไซต์' : 'Website Type'}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
                  {SITE_TYPES.map(st => {
                    const active = websiteOptions.siteType === st.value;
                    return (
                      <TouchableOpacity
                        key={st.value}
                        style={[styles.wbChip, {
                          backgroundColor: active ? colors.primary : 'transparent',
                          borderColor: active ? colors.primary : colors.borders,
                        }]}
                        onPress={() => setWebsiteOptions(p => ({ ...p, siteType: st.value }))}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.wbChipLabel, { color: active ? '#FFF' : colors.text.primary }]}>
                          {st.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.wbDivider} />

              {/* Color Theme */}
              <View style={styles.wbSection}>
                <Text style={styles.wbLabel}>
                  🎨 {lang === 'th' ? 'ธีมสี' : 'Color Theme'}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
                  {COLOR_THEMES.map(ct => {
                    const active = websiteOptions.colorTheme === ct.value;
                    return (
                      <TouchableOpacity
                        key={ct.value}
                        style={[styles.wbChip, {
                          backgroundColor: active ? colors.primary : 'transparent',
                          borderColor: active ? colors.primary : colors.borders,
                        }]}
                        onPress={() => setWebsiteOptions(p => ({ ...p, colorTheme: ct.value }))}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.wbColorDot, { backgroundColor: ct.color }]} />
                        <Text style={[styles.wbChipLabel, { color: active ? '#FFF' : colors.text.primary }]}>
                          {ct.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.wbDivider} />

              {/* Sections */}
              <View style={styles.wbSection}>
                <Text style={styles.wbLabel}>
                  📑 {lang === 'th' ? 'ส่วนเนื้อหา (เลือกได้หลายส่วน)' : 'Sections (multi-select)'}
                </Text>
                <View style={styles.wbSectionsWrap}>
                  {WEBSITE_SECTIONS.map(sec => {
                    const active = websiteOptions.sections.includes(sec.value);
                    return (
                      <TouchableOpacity
                        key={sec.value}
                        style={[styles.wbChip, {
                          backgroundColor: active ? `${colors.primary}18` : 'transparent',
                          borderColor: active ? colors.primary : colors.borders,
                        }]}
                        onPress={() => toggleSection(sec.value)}
                        activeOpacity={0.7}
                      >
                        {active && (
                          <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                        )}
                        <Text style={[styles.wbChipLabel, { color: active ? colors.primary : colors.text.secondary }]}>
                          {sec.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.wbDivider} />

              {/* Style Tone */}
              <View style={styles.wbSection}>
                <Text style={styles.wbLabel}>
                  ✨ {lang === 'th' ? 'สไตล์การออกแบบ' : 'Design Style'}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
                  {STYLE_TONES.map(st => {
                    const active = websiteOptions.styleTone === st.value;
                    return (
                      <TouchableOpacity
                        key={st.value}
                        style={[styles.wbChip, {
                          backgroundColor: active ? colors.primary : 'transparent',
                          borderColor: active ? colors.primary : colors.borders,
                        }]}
                        onPress={() => setWebsiteOptions(p => ({ ...p, styleTone: st.value }))}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.wbChipLabel, { color: active ? '#FFF' : colors.text.primary }]}>
                          {st.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.wbDivider} />

              {/* Language */}
              <View style={styles.wbSection}>
                <Text style={styles.wbLabel}>
                  🌏 {lang === 'th' ? 'ภาษาเว็บไซต์' : 'Website Language'}
                </Text>
                <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm }}>
                  {[{ value: 'Thai', label: '🇹🇭 ภาษาไทย' }, { value: 'English', label: '🇺🇸 English' }].map(l => {
                    const active = websiteOptions.siteLanguage === l.value;
                    return (
                      <TouchableOpacity
                        key={l.value}
                        style={[styles.wbChip, {
                          backgroundColor: active ? colors.primary : 'transparent',
                          borderColor: active ? colors.primary : colors.borders,
                          flex: 1, justifyContent: 'center',
                        }]}
                        onPress={() => setWebsiteOptions(p => ({ ...p, siteLanguage: l.value }))}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.wbChipLabel, { color: active ? '#FFF' : colors.text.primary, textAlign: 'center' }]}>
                          {l.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.wbPanelBottom} />
            </View>
          )}

          {/* ── Input ── */}
          <View style={styles.inputSection}>
            {!skillReady && (
              <View style={styles.comingSoonCard}>
                <Ionicons name="construct-outline" size={20} color={colors.warning ?? '#F59E0B'} />
                <Text style={styles.comingSoonText}>{t.library.alerts.comingSoon}</Text>
              </View>
            )}
            {skillReady && serverOnline === false && (
              <View style={styles.comingSoonCard}>
                <Ionicons name="cloud-offline-outline" size={20} color={colors.warning ?? '#F59E0B'} />
                <Text style={styles.comingSoonText}>
                  {lang === 'th'
                    ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ในขณะนี้ — ตรวจสอบอินเทอร์เน็ตของคุณ'
                    : 'Server unreachable right now — check your connection.'}
                </Text>
                <TouchableOpacity
                  onPress={checkServer}
                  disabled={pingLoading}
                  style={{ opacity: pingLoading ? 0.4 : 1 }}
                >
                  <Ionicons
                    name={pingLoading ? 'hourglass-outline' : 'refresh'}
                    size={18}
                    color={colors.warning ?? '#F59E0B'}
                  />
                </TouchableOpacity>
              </View>
            )}
            {/* Checking connection... state (null = first load or re-checking) */}
            {skillReady && serverOnline === null && pingLoading && (
              <View style={[styles.comingSoonCard, { borderColor: `${colors.primary}40`, backgroundColor: `${colors.primary}08` }]}>
                <ActivityIndicator size={16} color={colors.primary} />
                <Text style={[styles.comingSoonText, { color: colors.primary }]}>
                  {lang === 'th' ? 'กำลังตรวจสอบการเชื่อมต่อ...' : 'Checking connection...'}
                </Text>
              </View>
            )}
            {id === 'text-trans' && (
              <>
                <View style={[styles.sectionRow, { paddingHorizontal: 0, marginTop: 0 }]}>
                  <Text style={styles.sectionLabel}>
                    🌐 {lang === 'th' ? 'แปลเป็นภาษา' : 'Translate to'}
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.sm }}>
                  {TARGET_LANGUAGES.map(tl => {
                    const isActive = targetLang === tl.value;
                    return (
                      <TouchableOpacity
                        key={tl.code}
                        onPress={() => setTargetLang(tl.value)}
                        style={[styles.chip, {
                          backgroundColor: isActive ? colors.primary : colors.surface,
                          borderColor: isActive ? colors.primary : colors.borders,
                        }]}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 13 }}>{tl.flag}</Text>
                        <Text style={[styles.chipLabel, { color: isActive ? colors.text.inverse : colors.text.primary }]}>
                          {t.languages?.[tl.code as keyof typeof t.languages]?.name ?? tl.value}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {/* ── Prominent image upload zone for image-describe & face-restore ── */}
            {(id === 'image-describe' || id === 'face-restore') && !image && (
              <TouchableOpacity
                onPress={pickImage}
                disabled={loading}
                activeOpacity={0.75}
                style={{
                  marginBottom: SPACING.lg,
                  borderRadius: isVibrant ? 20 : 12,
                  borderWidth: 2,
                  borderColor: `${colors.primary}40`,
                  borderStyle: 'dashed',
                  backgroundColor: `${colors.primary}08`,
                  padding: SPACING.xxl,
                  alignItems: 'center',
                  gap: SPACING.md,
                }}
              >
                <Ionicons name="cloud-upload-outline" size={40} color={colors.primary} />
                <Text style={{ ...TYPOGRAPHY.headline, color: colors.primary, fontWeight: '700' }}>
                  {lang === 'th' ? 'อัปโหลดรูปภาพ' : 'Upload Image'}
                </Text>
                <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary, textAlign: 'center' }}>
                  {id === 'image-describe'
                    ? (lang === 'th' ? 'แตะเพื่อเลือกรูปที่ต้องการวิเคราะห์' : 'Tap to choose an image to analyze')
                    : (lang === 'th' ? 'แตะเพื่อเลือกรูปใบหน้าที่ต้องการฟื้นฟู' : 'Tap to choose a face photo to restore')}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>📥 {t.skill.inputLabel}</Text>
              {input.length > 0 && (
                <TouchableOpacity onPress={() => { setInput(''); setSelectedTemplateId(null); }}>
                  <Text style={{ ...TYPOGRAPHY.caption, color: colors.error }}>{t.common.clear}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* audio-stt uses a recorder instead of a text box */}
            {id === 'audio-stt' && (
              <View style={{ alignItems: 'center', paddingVertical: SPACING.lg }}>
                <TouchableOpacity
                  onPress={recorderState.isRecording ? stopRecording : startRecording}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={{
                    width: 96, height: 96, borderRadius: 48,
                    backgroundColor: recorderState.isRecording ? colors.error : colors.primary,
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: recorderState.isRecording ? colors.error : colors.primary,
                    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
                  }}
                >
                  <Ionicons name={recorderState.isRecording ? 'stop' : 'mic'} size={40} color="#FFF" />
                </TouchableOpacity>
                <Text style={{ marginTop: SPACING.md, ...TYPOGRAPHY.callout, color: colors.text.secondary }}>
                  {recorderState.isRecording
                    ? (lang === 'th' ? 'กำลังบันทึก… แตะเพื่อหยุด' : 'Recording… tap to stop')
                    : audioB64
                    ? (lang === 'th' ? '✅ บันทึกเสียงแล้ว — กดประมวลผล' : '✅ Recorded — tap Execute')
                    : (lang === 'th' ? 'แตะไมค์เพื่อเริ่มบันทึก' : 'Tap the mic to start recording')}
                </Text>
                {recorderState.isRecording && (
                  <Text style={{ marginTop: 4, ...TYPOGRAPHY.caption, color: colors.text.tertiary }}>
                    {Math.floor((recorderState.durationMillis ?? 0) / 1000)}s
                  </Text>
                )}
              </View>
            )}

            {/* face-restore needs no text input — image only */}
            {id !== 'face-restore' && id !== 'audio-stt' && (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={
                    id === 'image-describe'
                      ? (lang === 'th'
                          ? '💬 ถามคำถามเกี่ยวกับรูปภาพ (ไม่บังคับ) เช่น "มีอะไรในรูปนี้?"'
                          : '💬 Ask about the image (optional), e.g. "What objects are in this photo?"')
                      : skillCategory === 'image'
                      ? t.skill.placeholders.image
                      : skillCategory === 'audio'
                      ? t.skill.placeholders.audio
                      : id === 'website-gen'
                      ? (lang === 'th'
                          ? 'บรรยายเนื้อหาและเป้าหมายของเว็บไซต์ เช่น "เว็บพอร์ตโฟลิโอสำหรับนักออกแบบกราฟิก..."'
                          : 'Describe your website content and goals, e.g. "A portfolio for a graphic designer..."')
                      : id === 'text-extract'
                      ? (lang === 'th'
                          ? '🧩 วางข้อความที่ต้องการสกัดข้อมูล เช่น ใบเสร็จ ออเดอร์จากแชท ประกาศ — ระบบจะดึงข้อมูลสำคัญออกมาเป็น JSON ให้ (ลองกดตัวอย่างด้านบนได้เลย)'
                          : '🧩 Paste the text to extract from — a receipt, chat order, listing or announcement. Key fields will be returned as JSON (try an example above)')
                      : t.skill.placeholders.text
                  }
                  placeholderTextColor={colors.text.tertiary}
                  value={input}
                  onChangeText={txt => {
                    setInput(txt);
                    const activeTemplate = templates.find(t => t.id === selectedTemplateId);
                    if (activeTemplate && txt.trim() !== activeTemplate.prompt.trim()) {
                      setSelectedTemplateId(null);
                    }
                  }}
                  editable={!loading}
                  multiline
                />
                <View style={styles.inputActions}>
                  {(skillCategory === 'image' || id === 'image-describe') && (
                    <TouchableOpacity style={styles.inputActionBtn} onPress={pickImage} disabled={loading}>
                      <Ionicons name="image-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {input.length > 0 && (
              <Text style={styles.charCount}>{input.length} {t.skill.chars}</Text>
            )}

            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)} disabled={loading}>
                  <Ionicons name="close-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            <Button
              title={!skillReady
                ? `🚧 ${t.aiManager?.wallet?.comingSoon ?? 'Coming Soon'}`
                : serverOnline === false
                ? (lang === 'th' ? '🔌 ออฟไลน์อยู่' : '🔌 Offline')
                : loading
                ? t.skill.processing
                : `${t.skill.execute} ${skill.icon}`}
              onPress={handleExecute}
              disabled={!skillReady || loading || serverOnline === false || (id === 'audio-stt' ? !audioB64 : (!input.trim() && !image)) || (['image-describe', 'face-restore'].includes(id) && !image)}
              size="large"
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={36} color={colors.primary} />
                <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary, marginTop: SPACING.md }}>
                  {t.skill.aiProcessing}
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorCard}>
                <Ionicons name="alert-circle-outline" size={22} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
                {skillReady && (
                  <TouchableOpacity style={styles.retryBtn} onPress={handleExecute} disabled={loading}>
                    <Text style={{ color: '#FFF', ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                      {lang === 'th' ? 'ลองใหม่' : 'Retry'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {result && (
              <View style={{ marginTop: SPACING.xl }}>
                {resultIsImage ? (
                  <Card backgroundColor={colors.primary} padding={SPACING.lg}>
                    <Image
                      source={{ uri: result.content }}
                      style={{ width: '100%', height: 300, borderRadius: BORDER_RADIUS.medium }}
                      resizeMode="contain"
                    />
                  </Card>
                ) : result.kind === 'audio' ? (
                  <Card backgroundColor={colors.primary} padding={SPACING.lg}>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(result.content).catch(() => {})}
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, paddingVertical: SPACING.lg }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="play-circle" size={44} color={colors.text.inverse} />
                      <Text style={{ ...TYPOGRAPHY.headline, color: colors.text.inverse }}>
                        {lang === 'th' ? 'แตะเพื่อเปิดฟังเสียง' : 'Tap to play audio'}
                      </Text>
                    </TouchableOpacity>
                  </Card>
                ) : result.kind === 'website' ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
                      <Text style={{ ...TYPOGRAPHY.headline, color: colors.text.primary }}>
                        🌐 {lang === 'th' ? 'ตัวอย่างเว็บไซต์' : 'Website Preview'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (!savedId) {
                            const newId = saveItem({
                              type: 'website',
                              skillId: id,
                              skillName: skill.name,
                              skillIcon: skill.icon,
                              title: `${skill.name} — ${new Date().toLocaleTimeString()}`,
                              content: result.content,
                              sizeBytes: result.content.length,
                            });
                            setSavedId(newId);
                            Alert.alert('✅', lang === 'th' ? 'บันทึกเป็น HTML ไฟล์แล้ว' : 'Saved as HTML file!');
                          }
                        }}
                        style={{
                          paddingHorizontal: SPACING.md,
                          paddingVertical: SPACING.sm,
                          backgroundColor: savedId ? (colors.success ?? '#10B981') : colors.primary,
                          borderRadius: BORDER_RADIUS.full,
                        }}
                      >
                        <Text style={{ color: '#FFF', ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                          {savedId ? `✓ ${t.common.success}` : `💾 ${t.common.save}`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{
                      height: 500,
                      borderRadius: BORDER_RADIUS.medium,
                      overflow: 'hidden',
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.borders,
                    }}>
                      <WebView
                        source={{ html: result.content }}
                        style={{ flex: 1 }}
                        scalesPageToFit
                        startInLoadingState
                        renderLoading={() => (
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                          </View>
                        )}
                      />
                    </View>
                  </>
                ) : (
                  <Card backgroundColor={colors.primary} padding={SPACING.lg}>
                    <Text style={[styles.resultText, id === 'text-code' && { fontFamily: 'Courier', fontSize: 12, lineHeight: 18 }]}>
                      {resultDisplayText}
                    </Text>
                  </Card>
                )}
              </View>
            )}

            {/* ── Save & Share row ── */}
            {result && result.kind !== 'website' && (
              <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg }}>
                {/* Save to Library */}
                <TouchableOpacity
                  onPress={() => {
                    if (savedId) return;
                    const newId = saveItem({
                      type: result.kind,
                      skillId: id,
                      skillName: skill.name,
                      skillIcon: skill.icon,
                      title: `${skill.name} — ${new Date().toLocaleTimeString()}`,
                      content: result.content,
                      thumbnail: resultIsImage ? result.content : undefined,
                      sizeBytes: result.content.length,
                    });
                    setSavedId(newId);
                    Alert.alert('✅', t.common.success);
                  }}
                  activeOpacity={0.8}
                  style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, paddingVertical: 14,
                    backgroundColor: savedId ? colors.success ?? '#10B981' : colors.surface,
                    borderRadius: BORDER_RADIUS.full,
                    borderWidth: savedId ? 0 : (isVibrant ? 0 : 1),
                    borderColor: colors.borders,
                    ...(isVibrant && !savedId && {
                      shadowColor: colors.cardShadow,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
                    }),
                    ...(savedId && {
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
                    }),
                  }}
                >
                  <Ionicons
                    name={savedId ? 'checkmark-circle' : 'bookmark-outline'}
                    size={18}
                    color={savedId ? '#FFF' : colors.primary}
                  />
                  <Text style={{
                    ...TYPOGRAPHY.callout, fontWeight: '700',
                    color: savedId ? '#FFF' : colors.primary,
                  }}>
                    {savedId ? t.common.success : t.common.save}
                  </Text>
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await Share.share({
                        message: resultIsImage ? `${skill.name} — made with Rnai.io` : resultDisplayText.substring(0, 500),
                        url: resultIsImage ? result.content : undefined,
                      });
                    } catch { /* user cancelled */ }
                  }}
                  activeOpacity={0.8}
                  style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, paddingVertical: 14,
                    backgroundColor: colors.primary,
                    borderRadius: BORDER_RADIUS.full,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
                  }}
                >
                  <Ionicons name="share-outline" size={18} color="#FFF" />
                  <Text style={{ ...TYPOGRAPHY.callout, fontWeight: '700', color: '#FFF' }}>
                    {t.library.share.title}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
