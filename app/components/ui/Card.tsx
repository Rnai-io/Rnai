import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../../constants/design';
import { useTheme } from '../../context/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
  backgroundColor?: string;
}

export function Card({
  children,
  padding = SPACING.lg,
  backgroundColor,
  style,
  ...props
}: CardProps) {
  const { colors, scheme } = useTheme();
  const isVibrant = scheme === 'vibrant';

  const styles = StyleSheet.create({
    card: {
      backgroundColor: backgroundColor || colors.surface,
      borderRadius: isVibrant ? BORDER_RADIUS.large : BORDER_RADIUS.medium,
      padding,
      borderWidth: isVibrant ? 0 : 1,
      borderColor: colors.borders,
      ...(isVibrant && {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      }),
    },
  });

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}
