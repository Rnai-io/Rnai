import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { SkillCard } from '../components/ui/SkillCard';
import { isSkillReady } from '../services/api';
import { getSkillCategory } from '../data/skillTemplates';

// Brand color per skill — same palette as the Home grid
const SKILL_COLORS: Record<string, string> = {
  'image-gen':      '#9333EA',
  'image-edit':     '#0EA5E9',
  'remove-bg':      '#10B981',
  'upscale':        '#F59E0B',
  'stylize':        '#EC4899',
  'text-gen':       '#8B5CF6',
  'text-sum':       '#14B8A6',
  'text-trans':     '#3B82F6',
  'text-rewrite':   '#F97316',
  'website-gen':    '#6366F1',
  'audio-tts':      '#06B6D4',
  // ── New skills ──
  'image-describe': '#7C3AED',
  'face-restore':   '#DB2777',
  'text-grammar':   '#059669',
  'text-code':      '#EA580C',
  'text-hashtag':   '#0284C7',
  'audio-stt':      '#0E7490',
  'text-extract':   '#7C3AED',
};

type CategoryFilter = 'all' | 'image' | 'text' | 'audio' | 'web';

const CATEGORY_CHIPS: { id: CategoryFilter; emoji: string; color: string }[] = [
  { id: 'all',   emoji: '✨', color: '#9333EA' },
  { id: 'image', emoji: '🖼️', color: '#EC4899' },
  { id: 'text',  emoji: '📝', color: '#8B5CF6' },
  { id: 'audio', emoji: '🔊', color: '#06B6D4' },
  { id: 'web',   emoji: '💻', color: '#6366F1' },
];

// Static icon map — labels/descriptions come from translations
const SKILL_ICONS: Record<string, string> = {
  'image-gen':      'color-palette-outline',
  'image-edit':     'pencil-outline',
  'remove-bg':      'crop-outline',
  'upscale':        'expand-outline',
  'stylize':        'color-wand-outline',
  'text-gen':       'document-text-outline',
  'text-sum':       'list-outline',
  'text-trans':     'globe-outline',
  'text-rewrite':   'refresh-outline',
  'website-gen':    'laptop-outline',
  'audio-tts':      'volume-high-outline',
  // ── New skills ──
  'image-describe': 'eye-outline',
  'face-restore':   'happy-outline',
  'text-grammar':   'checkmark-circle-outline',
  'text-code':      'code-slash-outline',
  'text-hashtag':   'pricetag-outline',
  'audio-stt':      'mic-outline',
  'text-extract':   'document-attach-outline',
};

const SKILL_IDS = Object.keys(SKILL_ICONS);

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, scheme } = useTheme();
  const { t } = useLanguage();
  const isVibrant = scheme === 'vibrant';
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  // Build skill list from translations
  const allSkills = SKILL_IDS.map(id => ({
    id,
    icon: SKILL_ICONS[id],
    name: t.skills[id]?.name ?? id,
    description: t.skills[id]?.description ?? '',
  }));

  const filteredSkills = allSkills.filter(skill =>
    (categoryFilter === 'all' || getSkillCategory(skill.id) === categoryFilter) &&
    (skill.name.toLowerCase().includes(searchText.toLowerCase()) ||
     skill.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const categoryLabel = (id: CategoryFilter): string => {
    const f = t.library?.filters;
    if (id === 'all') return f?.all ?? 'All';
    if (id === 'image') return f?.images ?? 'Images';
    if (id === 'text') return f?.text ?? 'Text';
    if (id === 'audio') return f?.audio ?? 'Audio';
    return f?.website ?? 'Website';
  };

  const styles = StyleSheet.create({
    scrollContent: {
      padding: LAYOUT.screenPadding,
      paddingTop: SPACING.xl,
      paddingBottom: insets.bottom + LAYOUT.tabBarHeight + SPACING.xl,
    },
    header: { marginBottom: SPACING.xl },
    title: { color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.display },
    subtitle: { color: colors.text.secondary, ...TYPOGRAPHY.subheadline, marginTop: SPACING.sm },
    searchContainer: { marginBottom: SPACING.xl },
    searchInput: {
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? BORDER_RADIUS.full : BORDER_RADIUS.medium,
      borderWidth: isVibrant ? 0 : 1,
      borderColor: colors.borders,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      color: colors.text.primary,
      ...TYPOGRAPHY.body,
      minHeight: 48,
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
      }),
    },
    skillsLabel: {
      color: isVibrant ? colors.primary : colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.lg,
    },
    skillsList: { marginBottom: SPACING.xxl },
    emptyText: {
      color: colors.text.secondary, ...TYPOGRAPHY.body,
      textAlign: 'center', marginTop: SPACING.xl,
    },
  });

  const gradientBg = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background] as [string, string];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientBg as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t.create.title}</Text>
            <Text style={styles.subtitle}>{t.create.subtitle}</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t.create.searchPlaceholder}
              placeholderTextColor={colors.text.tertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* ── Category filter chips ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: SPACING.xl, gap: SPACING.sm }}
          >
            {CATEGORY_CHIPS.map(chip => {
              const isActive = categoryFilter === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  onPress={() => setCategoryFilter(chip.id)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 5,
                    borderRadius: BORDER_RADIUS.full,
                    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 1,
                    backgroundColor: isActive ? chip.color : colors.surface,
                    borderWidth: isActive ? 0 : 1, borderColor: colors.borders,
                    ...(isActive && {
                      shadowColor: chip.color,
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
                    }),
                  }}
                >
                  <Text style={{ fontSize: 13 }}>{chip.emoji}</Text>
                  <Text style={{
                    ...TYPOGRAPHY.caption, fontWeight: '700',
                    color: isActive ? '#FFF' : colors.text.secondary,
                  }}>
                    {categoryLabel(chip.id)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredSkills.length > 0 ? (
            <View style={styles.skillsList}>
              <Text style={styles.skillsLabel}>
                {t.create.availableSkills} ({filteredSkills.length})
              </Text>
              {filteredSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  icon={skill.icon}
                  name={skill.name}
                  description={skill.description}
                  tint={SKILL_COLORS[skill.id]}
                  badge={isSkillReady(skill.id) ? undefined : (t.aiManager?.wallet?.comingSoon ?? 'Soon')}
                  onPress={() => (navigation as any).navigate('Skill', { id: skill.id })}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>{t.create.noSkills}</Text>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
