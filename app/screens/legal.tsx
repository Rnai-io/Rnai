import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import {
  getLegal, LegalDoc, LEGAL_VERSION, LEGAL_LAST_UPDATED, LEGAL_ONLINE,
} from '../data/legal';

export default function LegalScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { colors } = useTheme();
  const { lang } = useLanguage();

  const initialDoc = ((route.params as any)?.doc as LegalDoc) ?? 'privacy';
  const [doc, setDoc] = useState<LegalDoc>(initialDoc);

  const { sections, notice, ui } = getLegal(doc, lang);

  const Tab = ({ value, label }: { value: LegalDoc; label: string }) => {
    const active = doc === value;
    return (
      <TouchableOpacity
        onPress={() => setDoc(value)}
        activeOpacity={0.8}
        style={{
          flex: 1,
          paddingVertical: SPACING.sm + 2,
          borderRadius: BORDER_RADIUS.full,
          backgroundColor: active ? colors.primary : 'transparent',
          alignItems: 'center',
        }}
      >
        <Text style={{
          color: active ? colors.text.inverse : colors.text.secondary,
          ...TYPOGRAPHY.callout, fontWeight: '700',
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: LAYOUT.screenPadding, paddingVertical: SPACING.md,
        borderBottomWidth: 1, borderBottomColor: colors.borders,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginRight: SPACING.md }}
        >
          <Ionicons name="chevron-back" size={26} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, fontWeight: '700' }}>
          {ui.legal}
        </Text>
      </View>

      {/* Tab switch */}
      <View style={{
        flexDirection: 'row', gap: SPACING.xs,
        margin: LAYOUT.screenPadding, padding: 4,
        backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.full,
        borderWidth: 1, borderColor: colors.borders,
      }}>
        <Tab value="privacy" label={ui.privacy} />
        <Tab value="terms" label={ui.terms} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: LAYOUT.screenPadding,
          paddingBottom: insets.bottom + SPACING.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Meta */}
        <Text style={{ color: colors.text.tertiary, ...TYPOGRAPHY.caption, marginBottom: SPACING.md }}>
          {ui.version} {LEGAL_VERSION} · {ui.lastUpdated}: {LEGAL_LAST_UPDATED}
        </Text>

        {/* Translation notice for non-TH/EN languages */}
        {notice ? (
          <View style={{
            backgroundColor: `${colors.primary}10`,
            borderRadius: BORDER_RADIUS.medium,
            padding: SPACING.md, marginBottom: SPACING.lg,
          }}>
            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>
              ℹ️ {notice}
            </Text>
          </View>
        ) : null}

        {/* Sections */}
        {sections.map((s, i) => (
          <View key={i} style={{ marginBottom: SPACING.xl }}>
            <Text style={{
              color: colors.text.primary, ...TYPOGRAPHY.headline,
              fontWeight: '700', marginBottom: SPACING.sm,
            }}>
              {s.heading}
            </Text>
            <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.body, lineHeight: 24 }}>
              {s.body}
            </Text>
          </View>
        ))}

        {/* View online */}
        <TouchableOpacity
          onPress={() => Linking.openURL(LEGAL_ONLINE[doc]).catch(() => {})}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: SPACING.sm, paddingVertical: SPACING.md,
            borderRadius: BORDER_RADIUS.full,
            borderWidth: 1.5, borderColor: colors.primary,
          }}
        >
          <Ionicons name="open-outline" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, ...TYPOGRAPHY.callout, fontWeight: '700' }}>
            {ui.viewOnline}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
