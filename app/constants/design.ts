/**
 * Rnai.io Mobile Design System
 * iOS-first, accessible design tokens
 */

export type ColorScheme = 'brand' | 'modern' | 'vibrant';

export const COLORS = {
  brand: {
    primary: '#D77757',      // Brand Orange
    secondary: '#5769F7',    // Brand Blue
    accent: '#FFB81C',       // Gold
    background: '#FFFFFF',
    surface: '#F8F8F8',
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
      inverse: '#FFFFFF',
    },
    borders: '#E0E0E0',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    premium: '#FFB81C',
    gradient: ['#FFFFFF', '#FFF5F0'] as string[],
    cardShadow: 'transparent' as string,
  },
  modern: {
    primary: '#378ADD',      // Modern Blue
    secondary: '#639922',    // Modern Green
    accent: '#BA7517',       // Warm Amber
    background: '#FFFFFF',
    surface: '#F8F8F8',
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
      inverse: '#FFFFFF',
    },
    borders: '#E0E0E0',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    premium: '#FFB81C',
    gradient: ['#FFFFFF', '#F0F8FF'] as string[],
    cardShadow: 'transparent' as string,
  },
  vibrant: {
    primary: '#9333EA',      // Vibrant Purple
    secondary: '#0EA5E9',    // Sky Blue
    accent: '#F59E0B',       // Amber Gold
    background: '#FAFFFE',
    surface: '#FFFFFF',      // Pure white cards
    text: {
      primary: '#1E1B4B',    // Deep indigo
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    borders: '#F3F4F6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    premium: '#F59E0B',
    gradient: ['#DCFCE7', '#EDE9FE', '#DBEAFE'] as string[], // Green → Purple → Blue
    cardShadow: '#9333EA' as string,
  },
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  callout: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  full: 999,
};

export const TOUCH_TARGET_MIN = 44;

export const SAFE_AREA = {
  statusBar: 44,
  notch: 44,
  homeIndicator: 34,
};

export const LAYOUT = {
  screenPadding: SPACING.lg,
  cardRadius: BORDER_RADIUS.medium,
  tabBarHeight: 64,
};

export type ThemeType = typeof COLORS.vibrant;
