import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  const { colors, scheme } = useTheme();
  const isVibrant = scheme === 'vibrant';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: isVibrant ? BORDER_RADIUS.large : BORDER_RADIUS.medium,
      padding: SPACING.lg,
      borderWidth: isVibrant ? 0 : 1,
      borderColor: colors.borders,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 88,
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }),
    },
    value: {
      color: colors.primary,
      fontSize: isVibrant ? 24 : 17,
      lineHeight: isVibrant ? 30 : 22,
      fontWeight: '700',
      marginBottom: SPACING.xs,
    },
    label: {
      color: colors.text.secondary,
      ...TYPOGRAPHY.caption,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
