import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { SkillCard } from '../components/ui/SkillCard';
import { isSkillReady } from '../services/api';

// Static icon map — labels/descriptions come from translations
const SKILL_ICONS: Record<string, string> = {
  'image-gen':    'color-palette-outline',
  'image-edit':   'pencil-outline',
  'remove-bg':    'crop-outline',
  'upscale':      'expand-outline',
  'stylize':      'color-wand-outline',
  'text-gen':     'document-text-outline',
  'text-sum':     'list-outline',
  'text-trans':   'globe-outline',
  'text-rewrite': 'refresh-outline',
  'website-gen':  'laptop-outline',
  'audio-tts':    'volume-high-outline',
};

const SKILL_IDS = Object.keys(SKILL_ICONS);

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, scheme } = useTheme();
  const { t } = useLanguage();
  const isVibrant = scheme === 'vibrant';
  const [searchText, setSearchText] = useState('');

  // Build skill list from translations
  const allSkills = SKILL_IDS.map(id => ({
    id,
    icon: SKILL_ICONS[id],
    name: t.skills[id]?.name ?? id,
    description: t.skills[id]?.description ?? '',
  }));

  const filteredSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchText.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchText.toLowerCase())
  );

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
