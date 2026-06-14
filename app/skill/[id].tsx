import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  ActivityIndicator, TouchableOpacity, Image,
  FlatList, Dimensions, Alert, Share,
  KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import WebView from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
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

// Target languages for the translate skill (value = what the API expects)
const TARGET_LANGUAGES = [
  { code: 'th', flag: '🇹🇭', value: 'Thai' },
  { code: 'en', flag: '🇺🇸', value: 'English' },
  { code: 'ja', flag: '🇯🇵', value: 'Japanese' },
  { code: 'zh', flag: '🇨🇳', value: 'Chinese' },
  { code: 'ko', flag: '🇰🇷', value: 'Korean' },
  { code: 'fr', flag: '🇫🇷', value: 'French' },
  { code: 'de', flag: '🇩🇪', value: 'German' },
  { code: 'es', flag: '🇪🇸', value: 'Spanish' },
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  // Translate skill: default target = opposite of app language for convenience
  const [targetLang, setTargetLang] = useState(lang === 'en' ? 'Thai' : 'English');

  const templates = (SKILL_TEMPLATES[id] || []).map(tmpl => localizeTemplate(tmpl, lang));
  const skillCategory = getSkillCategory(id);
  const skillReady = isSkillReady(id);

  // Backend reachability check (offline banner)
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    if (skillReady) {
      pingApi().then(ok => { if (!cancelled) setServerOnline(ok); });
    }
    return () => { cancelled = true; };
  }, [skillReady]);

  // Icon map — names/descriptions come from translations
  const skillIconMap: Record<string, string> = {
    'image-gen': '🎨', 'image-edit': '✏️', 'remove-bg': '✂️', 'upscale': '🔍',
    'stylize': '🖌️', 'text-gen': '📝', 'text-sum': '📋', 'text-trans': '🌐',
    'text-rewrite': '♻️', 'website-gen': '💻', 'audio-tts': '🔊',
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

  const handleSelectTemplate = (template: PromptTemplate) => {
    setInput(template.prompt);
    setSelectedTemplateId(template.id);
  };

  const handleExecute = async () => {
    if (loading) return; // prevent double-submit
    if (!input.trim() && !image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSavedId(null);
    const skillInput = {
      prompt: input.trim(),
      image,
      extra: id === 'text-trans' ? { targetLanguage: targetLang } : undefined,
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
          <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary, fontStyle: 'italic', lineHeight: 18 }} numberOfLines={4}>
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
                <TouchableOpacity onPress={() => { setServerOnline(null); pingApi().then(setServerOnline); }}>
                  <Ionicons name="refresh" size={18} color={colors.warning ?? '#F59E0B'} />
                </TouchableOpacity>
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

            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>📥 {t.skill.inputLabel}</Text>
              {input.length > 0 && (
                <TouchableOpacity onPress={() => { setInput(''); setSelectedTemplateId(null); }}>
                  <Text style={{ ...TYPOGRAPHY.caption, color: colors.error }}>{t.common.clear}</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={skillCategory === 'image'
                  ? t.skill.placeholders.image
                  : skillCategory === 'audio'
                  ? t.skill.placeholders.audio
                  : t.skill.placeholders.text}
                placeholderTextColor={colors.text.tertiary}
                value={input}
                onChangeText={txt => { setInput(txt); setSelectedTemplateId(null); }}
                editable={!loading}
                multiline
              />
              <View style={styles.inputActions}>
                {(skillCategory === 'image' || id === 'image-edit' || id === 'remove-bg' || id === 'upscale') && (
                  <TouchableOpacity style={styles.inputActionBtn} onPress={pickImage} disabled={loading}>
                    <Ionicons name="image-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

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
                : loading ? t.skill.processing : `${t.skill.execute} ${skill.icon}`}
              onPress={handleExecute}
              disabled={!skillReady || loading || (!input.trim() && !image)}
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
                          {savedId ? '✓ Saved' : '💾 Save'}
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
                    <Text style={styles.resultText}>{resultDisplayText}</Text>
                  </Card>
                )}
              </View>
            )}

            {/* ── Save & Share row ── */}
            {result && (
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
                    Share
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
