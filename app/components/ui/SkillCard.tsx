import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface SkillCardProps {
  icon: string;
  name: string;
  description: string;
  onPress: () => void;
  badge?: string;
}

export function SkillCard({ icon, name, description, onPress, badge }: SkillCardProps) {
  const { colors, scheme } = useTheme();
  const isVibrant = scheme === 'vibrant';

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? BORDER_RADIUS.large : BORDER_RADIUS.medium,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      alignItems: 'center',
      minHeight: TOUCH_TARGET_MIN,
      borderWidth: isVibrant ? 0 : 1,
      borderColor: colors.borders,
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }),
    },
    iconContainer: {
      marginRight: SPACING.lg,
      width: 48,
      height: 48,
      borderRadius: isVibrant ? 12 : 0,
      backgroundColor: isVibrant ? `${colors.primary}15` : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    name: {
      color: colors.text.primary,
      ...TYPOGRAPHY.headline,
      marginBottom: SPACING.xs,
    },
    description: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.caption,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={28} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
          <Text style={styles.name}>{name}</Text>
          {badge ? (
            <View style={{
              backgroundColor: `${colors.warning ?? '#F59E0B'}18`,
              borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
              marginBottom: SPACING.xs,
            }}>
              <Text style={{ color: colors.warning ?? '#F59E0B', fontSize: 10, fontWeight: '800' }}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} style={{ marginLeft: SPACING.md }} />
    </TouchableOpacity>
  );
}
