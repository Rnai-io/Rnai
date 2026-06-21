import React, { useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ImageBackground, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLibrary, computeLibraryStats } from '../context/LibraryContext';
import { fetchBilling } from '../services/auth';

const { width: W } = Dimensions.get('window');
const CARD_GAP = SPACING.md;
const CARD_W = (W - LAYOUT.screenPadding * 2 - CARD_GAP) / 2;

// ── Skill grid static config (colors & icons only — labels from translations) ─
const SKILL_GRID_CONFIG = [
  { id: 'image-gen',    icon: '🎨', colors: ['#9333EA', '#7C3AED'] as [string,string] },
  { id: 'image-edit',   icon: '✏️', colors: ['#0EA5E9', '#0284C7'] as [string,string] },
  { id: 'stylize',      icon: '🖌️', colors: ['#EC4899', '#DB2777'] as [string,string] },
  { id: 'remove-bg',    icon: '✂️', colors: ['#10B981', '#059669'] as [string,string] },
  { id: 'upscale',      icon: '🔍', colors: ['#F59E0B', '#D97706'] as [string,string] },
  { id: 'text-gen',     icon: '📝', colors: ['#8B5CF6', '#6D28D9'] as [string,string] },
  { id: 'website-gen',  icon: '💻', colors: ['#6366F1', '#4338CA'] as [string,string] },
  { id: 'audio-tts',    icon: '🔊', colors: ['#06B6D4', '#0E7490'] as [string,string] },
  { id: 'text-trans',   icon: '🌐', colors: ['#14B8A6', '#0F766E'] as [string,string] },
  { id: 'text-rewrite', icon: '♻️', colors: ['#F97316', '#EA580C'] as [string,string] },
  { id: 'audio-stt',    icon: '🎙️', colors: ['#0E7490', '#155E75'] as [string,string] },
  { id: 'text-extract', icon: '🧩', colors: ['#7C3AED', '#6D28D9'] as [string,string] },
];

// ── Recent placeholder images ─────────────────────────────────────────────────
const RECENT_ITEMS = [
  { id: '1', thumb: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&q=70', label: 'Abstract Art' },
  { id: '2', thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&q=70', label: 'Fantasy' },
  { id: '3', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&q=70', label: 'City Night' },
  { id: '4', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=70', label: 'Landscape' },
];

// ── Hero background images (rotates on each mount) ────────────────────────────
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&q=80',
];

const HERO_BG = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];

// ── Component ────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, scheme } = useTheme();
  const { t } = useLanguage();
  const isVibrant = scheme === 'vibrant';
  const { user: authUser } = useAuth();
  const { items: libraryItems } = useLibrary();
  const libStats = computeLibraryStats(libraryItems);

  // Real credits — refresh whenever Home regains focus
  const [credits, setCredits] = React.useState<number | null>(null);
  React.useEffect(() => {
    const load = () => {
      if (!authUser) { setCredits(null); return; }
      fetchBilling().then(b => {
        if (b) setCredits(b.freeCreditsRemaining + b.paidCreditsBalance);
      });
    };
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [authUser, navigation]);

  // Build skill grid with live translations
  const SKILL_GRID = SKILL_GRID_CONFIG.map(cfg => ({
    ...cfg,
    label: t.skills[cfg.id]?.name ?? cfg.id,
    tagline: t.skills[cfg.id]?.tagline ?? '',
  }));

  const navigateToSkill = (skillId: string) => {
    (navigation as any).navigate('Skill', { id: skillId });
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? t.home.greeting.morning : hour < 18 ? t.home.greeting.afternoon : t.home.greeting.evening;

  const gradientBg = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background] as [string, string];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientBg as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + LAYOUT.tabBarHeight + SPACING.xl }}
        >

          {/* ══════════════════════════════════════════════
              HERO SECTION
          ══════════════════════════════════════════════ */}
          <ImageBackground
            source={{ uri: HERO_BG }}
            style={{ width: '100%', height: 320 + insets.top }}
            resizeMode="cover"
          >
            {/* Dark + colored overlay */}
            <LinearGradient
              colors={['rgba(0,0,0,0.15)', 'rgba(80,0,120,0.55)', 'rgba(10,0,30,0.88)']}
              style={{ flex: 1, paddingTop: insets.top }}
            >
              {/* Top bar */}
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg,
              }}>
                <View>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', ...TYPOGRAPHY.caption, fontWeight: '600' }}>
                    {greeting} 👋
                  </Text>
                  <Text style={{ color: '#FFFFFF', ...TYPOGRAPHY.headline, fontWeight: '700' }}>
                    {'Rnai User'}
                  </Text>
                </View>
                {/* Credits pill */}
                <TouchableOpacity
                  onPress={() => (navigation as any).navigate('Profile')}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderRadius: BORDER_RADIUS.full,
                    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>✨</Text>
                  <Text style={{ color: '#FFFFFF', ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                    {credits !== null ? `${credits.toLocaleString()} ${t.home.creditsLabel}` : t.home.creditsLabel}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tagline */}
              <View style={{
                flex: 1, justifyContent: 'flex-end',
                paddingHorizontal: LAYOUT.screenPadding, paddingBottom: SPACING.xxl,
              }}>
                <Text style={{
                  color: 'rgba(255,255,255,0.65)', ...TYPOGRAPHY.subheadline, fontWeight: '600',
                  marginBottom: SPACING.sm, letterSpacing: 1.5, textTransform: 'uppercase',
                }}>
                  {t.home.poweredBy}
                </Text>
                <Text style={{
                  color: '#FFFFFF', fontSize: 34, fontWeight: '800', lineHeight: 40,
                  marginBottom: SPACING.xl,
                }}>
                  {t.home.tagline}{'\n'}
                  <Text style={{ color: '#C084FC' }}>{t.home.taglineHighlight}</Text>
                </Text>

                {/* CTA Row */}
                <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Create')}
                    activeOpacity={0.85}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={['#9333EA', '#7C3AED']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: BORDER_RADIUS.full, paddingVertical: 14,
                        alignItems: 'center', flexDirection: 'row',
                        justifyContent: 'center', gap: 8,
                        shadowColor: '#9333EA', shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
                      }}
                    >
                      <Ionicons name="flash" size={18} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', ...TYPOGRAPHY.callout, fontWeight: '700' }}>
                        {t.home.startCreating}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => (navigation as any).navigate('Skill', { id: 'image-gen' })}
                    activeOpacity={0.8}
                    style={{
                      borderRadius: BORDER_RADIUS.full, paddingVertical: 14,
                      paddingHorizontal: SPACING.xl,
                      borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', ...TYPOGRAPHY.callout, fontWeight: '600' }}>
                      {t.home.generateBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>

          {/* ══════════════════════════════════════════════
              STATS ROW
          ══════════════════════════════════════════════ */}
          <View style={{
            flexDirection: 'row',
            marginHorizontal: LAYOUT.screenPadding,
            marginTop: -SPACING.xl,
            gap: SPACING.sm,
            zIndex: 10,
          }}>
            {[
              { icon: 'color-palette-outline', value: String(libStats.total), label: t.home.stats.generations, color: '#9333EA', bg: '#F3E8FF' },
              { icon: 'flash-outline',         value: credits !== null ? credits.toLocaleString() : '—', label: t.home.creditsLabel, color: '#0EA5E9', bg: '#E0F2FE' },
              { icon: 'flame-outline',         value: String(libStats.streak), label: t.home.stats.dayStreak,   color: '#F59E0B', bg: '#FEF9C3' },
            ].map(stat => (
              <View key={stat.label} style={{
                flex: 1, backgroundColor: colors.surface,
                borderRadius: isVibrant ? 16 : 10,
                padding: SPACING.md, alignItems: 'center',
                ...(isVibrant ? {
                  shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
                } : { borderWidth: 1, borderColor: colors.borders }),
              }}>
                <View style={{
                  width: 32, height: 32, borderRadius: 10,
                  backgroundColor: stat.bg, justifyContent: 'center', alignItems: 'center',
                  marginBottom: 6,
                }}>
                  <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                </View>
                <Text style={{ color: stat.color, fontSize: 16, fontWeight: '800', lineHeight: 20 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, textAlign: 'center', marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ══════════════════════════════════════════════
              SKILL GRID
          ══════════════════════════════════════════════ */}
          <View style={{ paddingHorizontal: LAYOUT.screenPadding, marginTop: SPACING.xxl }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
              <View>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t.home.sections.aiTools}
                </Text>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 22, fontWeight: '800' }}>
                  {t.home.sections.allSkills}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Create')}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: isVibrant ? `${colors.primary}12` : colors.surface,
                  borderRadius: BORDER_RADIUS.full,
                  paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
                  borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                }}
              >
                <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '700' }}>
                  {t.common.viewAll}
                </Text>
                <Ionicons name="arrow-forward" size={13} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* 2-column grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP }}>
              {SKILL_GRID.map((skill, index) => (
                <TouchableOpacity
                  key={skill.id}
                  onPress={() => navigateToSkill(skill.id)}
                  activeOpacity={0.82}
                  style={{ width: CARD_W }}
                >
                  <LinearGradient
                    colors={skill.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: isVibrant ? 20 : 14,
                      padding: SPACING.lg,
                      height: 140,
                      justifyContent: 'space-between',
                      ...(isVibrant && {
                        shadowColor: skill.colors[0],
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.35,
                        shadowRadius: 14,
                        elevation: 8,
                      }),
                    }}
                  >
                    {/* Top: icon + new badge */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{
                        width: 46, height: 46, borderRadius: 14,
                        backgroundColor: 'rgba(255,255,255,0.22)',
                        justifyContent: 'center', alignItems: 'center',
                      }}>
                        <Text style={{ fontSize: 24 }}>{skill.icon}</Text>
                      </View>
                      {index < 3 && (
                        <View style={{
                          backgroundColor: 'rgba(255,255,255,0.28)',
                          borderRadius: BORDER_RADIUS.full,
                          paddingHorizontal: 8, paddingVertical: 3,
                        }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
                            {index === 0 ? t.home.skillBadges.hot : index === 1 ? t.home.skillBadges.new : t.home.skillBadges.top}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Bottom: name + tagline */}
                    <View>
                      <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', lineHeight: 19 }}>
                        {skill.label}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                        <View style={{
                          width: 4, height: 4, borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.6)',
                        }} />
                        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '500' }}>
                          {skill.tagline}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ══════════════════════════════════════════════
              RECENT CREATIONS
          ══════════════════════════════════════════════ */}
          <View style={{ marginTop: SPACING.xxl }}>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              paddingHorizontal: LAYOUT.screenPadding, marginBottom: SPACING.lg,
            }}>
              <View>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t.home.sections.history}
                </Text>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 22, fontWeight: '800' }}>
                  {t.home.sections.recentCreations}
                </Text>
              </View>
              <TouchableOpacity style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: isVibrant ? `${colors.primary}12` : colors.surface,
                borderRadius: BORDER_RADIUS.full,
                paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
                borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
              }}>
                <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '700' }}>{t.common.seeAll}</Text>
                <Ionicons name="arrow-forward" size={13} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: LAYOUT.screenPadding, paddingRight: SPACING.sm }}>
              {RECENT_ITEMS.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={{
                    width: 140, marginRight: SPACING.md,
                    borderRadius: isVibrant ? 18 : 12,
                    overflow: 'hidden',
                    ...(isVibrant && {
                      shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12, shadowRadius: 12, elevation: 5,
                    }),
                  }}
                >
                  <Image
                    source={{ uri: item.thumb }}
                    style={{ width: 140, height: 140 }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.65)']}
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      paddingHorizontal: SPACING.sm, paddingBottom: SPACING.sm, paddingTop: 30,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                      {item.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              {/* Empty placeholder */}
              <TouchableOpacity
                onPress={() => (navigation as any).navigate('Skill', { id: 'image-gen' })}
                activeOpacity={0.8}
                style={{
                  width: 140, height: 140, marginRight: SPACING.md,
                  borderRadius: isVibrant ? 18 : 12,
                  backgroundColor: isVibrant ? `${colors.primary}10` : colors.surface,
                  borderWidth: 2, borderColor: isVibrant ? `${colors.primary}30` : colors.borders,
                  borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 8,
                }}
              >
                <View style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center',
                }}>
                  <Ionicons name="add" size={22} color={colors.primary} />
                </View>
                <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '700', textAlign: 'center' }}>
                  {t.common.newCreation}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* ══════════════════════════════════════════════
              PROMO BANNER
          ══════════════════════════════════════════════ */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={{ marginHorizontal: LAYOUT.screenPadding, marginTop: SPACING.xxl }}
            onPress={() => (navigation as any).navigate('Profile')}
          >
            <LinearGradient
              colors={isVibrant ? ['#7C3AED', '#9333EA', '#C026D3'] : [colors.primary, colors.primary]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                borderRadius: isVibrant ? 20 : 12,
                padding: SPACING.xl,
                flexDirection: 'row', alignItems: 'center',
                ...(isVibrant && {
                  shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
                }),
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(255,255,255,0.75)', ...TYPOGRAPHY.caption, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t.home.promo.badge}
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                  {t.home.promo.title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', ...TYPOGRAPHY.caption, marginTop: 4 }}>
                  {t.home.promo.desc}
                </Text>
              </View>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: BORDER_RADIUS.full,
                paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
              }}>
                <Text style={{ color: '#FFFFFF', ...TYPOGRAPHY.caption, fontWeight: '800' }}>
                  {t.home.promo.btn}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
    </View>
  );
}
