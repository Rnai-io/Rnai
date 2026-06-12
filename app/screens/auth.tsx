/**
 * Rnai.io — Auth Screen (Login / Register)
 * Shown at launch when the user is not signed in and hasn't skipped.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage, sendPasswordReset } from '../services/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const { signIn, signUp, skipAuth } = useAuth();
  const isVibrant = scheme === 'vibrant';
  const th = lang === 'th';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const gradientBg: [string, string, string] = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background, colors.background];

  const validate = (): string | null => {
    if (!EMAIL_RE.test(email.trim())) {
      return th ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email.';
    }
    if (password.length < 6) {
      return th ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters.';
    }
    if (mode === 'signup' && password !== confirm) {
      return th ? 'รหัสผ่านทั้งสองช่องไม่ตรงกัน' : 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    setFieldError(err);
    if (err || busy) return;
    setBusy(true);
    try {
      const action = mode === 'signin' ? signIn : signUp;
      const res = await action(email, password);
      Alert.alert(
        '✅',
        th
          ? `ยินดีต้อนรับ ${res.email}\nAPI Key ส่วนตัวถูกสร้างและบันทึกให้แล้ว`
          : `Welcome ${res.email}\nYour personal API key is ready.`,
      );
    } catch (e) {
      setFieldError(getAuthErrorMessage(e, lang));
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setFieldError(th ? 'กรอกอีเมลก่อน แล้วแตะลืมรหัสผ่านอีกครั้ง' : 'Enter your email first, then tap forgot password again.');
      return;
    }
    try {
      await sendPasswordReset(email);
      Alert.alert(
        th ? 'ส่งอีเมลแล้ว 📬' : 'Email sent 📬',
        th
          ? `ลิงก์ตั้งรหัสผ่านใหม่ถูกส่งไปที่ ${email.trim()} แล้ว — เช็คกล่องจดหมาย (และ Junk) ได้เลย`
          : `A password reset link was sent to ${email.trim()}. Check your inbox (and junk folder).`,
      );
    } catch (e) {
      setFieldError(getAuthErrorMessage(e, lang));
    }
  };

  const inputStyle = {
    backgroundColor: colors.surface,
    borderRadius: isVibrant ? 14 : 10,
    borderWidth: isVibrant ? 0 : 1,
    borderColor: colors.borders,
    padding: SPACING.lg,
    ...TYPOGRAPHY.body,
    color: colors.text.primary,
    ...(isVibrant && {
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
    }),
  } as const;

  const canSubmit = email.trim().length > 0 && password.length >= 6
    && (mode === 'signin' || confirm.length >= 6) && !busy;

  return (
    <LinearGradient
      colors={gradientBg}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1, justifyContent: 'center',
            paddingHorizontal: LAYOUT.screenPadding,
            paddingTop: insets.top + SPACING.xl,
            paddingBottom: insets.bottom + SPACING.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Language toggle (top-right) ── */}
          <View style={{ position: 'absolute', top: insets.top + SPACING.md, right: LAYOUT.screenPadding, flexDirection: 'row', gap: 6 }}>
            {(['th', 'en'] as const).map(code => (
              <TouchableOpacity
                key={code}
                onPress={() => setLang(code)}
                style={{
                  paddingHorizontal: SPACING.md, paddingVertical: 5,
                  borderRadius: BORDER_RADIUS.full,
                  backgroundColor: lang === code ? colors.primary : colors.surface,
                  borderWidth: lang === code ? 0 : 1, borderColor: colors.borders,
                }}
              >
                <Text style={{
                  fontSize: 12, fontWeight: '700',
                  color: lang === code ? '#FFF' : colors.text.secondary,
                }}>
                  {code === 'th' ? '🇹🇭 ไทย' : '🇺🇸 EN'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Brand hero ── */}
          <View style={{ alignItems: 'center', marginBottom: SPACING.xxl }}>
            <LinearGradient
              colors={[colors.primary, colors.secondary ?? colors.primary]}
              style={{
                width: 84, height: 84, borderRadius: 26,
                justifyContent: 'center', alignItems: 'center',
                marginBottom: SPACING.lg,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
              }}
            >
              <Text style={{ fontSize: 42 }}>⚡</Text>
            </LinearGradient>
            <Text style={{
              fontSize: 30, fontWeight: '800',
              color: isVibrant ? colors.primary : colors.text.primary,
            }}>
              Rnai.io
            </Text>
            <Text style={{ ...TYPOGRAPHY.subheadline, color: colors.text.secondary, marginTop: 4, textAlign: 'center' }}>
              {th ? 'สร้างทุกอย่างด้วย AI — ภาพ ข้อความ เว็บไซต์ เสียง' : 'Create anything with AI — images, text, websites, audio'}
            </Text>
          </View>

          {/* ── Mode toggle ── */}
          <View style={{
            flexDirection: 'row', backgroundColor: colors.borders,
            borderRadius: BORDER_RADIUS.full, padding: 3, marginBottom: SPACING.xl,
          }}>
            {(['signin', 'signup'] as const).map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => { setMode(m); setFieldError(null); }}
                style={{
                  flex: 1, paddingVertical: SPACING.sm + 2,
                  borderRadius: BORDER_RADIUS.full, alignItems: 'center',
                  backgroundColor: mode === m ? colors.surface : 'transparent',
                }}
              >
                <Text style={{
                  ...TYPOGRAPHY.callout, fontWeight: '700',
                  color: mode === m ? colors.primary : colors.text.tertiary,
                }}>
                  {m === 'signin' ? (th ? 'เข้าสู่ระบบ' : 'Sign In') : (th ? 'สมัครสมาชิก' : 'Sign Up')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Email ── */}
          <Text style={{ ...TYPOGRAPHY.caption, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
            {th ? 'อีเมล' : 'Email'}
          </Text>
          <TextInput
            value={email}
            onChangeText={txt => { setEmail(txt); setFieldError(null); }}
            style={{ ...inputStyle, marginBottom: SPACING.lg }}
            placeholder="you@example.com"
            placeholderTextColor={colors.text.tertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!busy}
            returnKeyType="next"
          />

          {/* ── Password ── */}
          <Text style={{ ...TYPOGRAPHY.caption, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
            {th ? 'รหัสผ่าน' : 'Password'}
          </Text>
          <View style={{ position: 'relative', marginBottom: mode === 'signup' ? SPACING.lg : SPACING.sm }}>
            <TextInput
              value={password}
              onChangeText={txt => { setPassword(txt); setFieldError(null); }}
              style={{ ...inputStyle, paddingRight: 48 }}
              placeholder={th ? 'อย่างน้อย 6 ตัวอักษร' : 'At least 6 characters'}
              placeholderTextColor={colors.text.tertiary}
              secureTextEntry={!showPassword}
              textContentType={mode === 'signup' ? 'newPassword' : 'password'}
              editable={!busy}
              returnKeyType={mode === 'signup' ? 'next' : 'go'}
              onSubmitEditing={mode === 'signin' ? handleSubmit : undefined}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: SPACING.md, top: 0, bottom: 0, justifyContent: 'center' }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          {/* ── Confirm password (signup) ── */}
          {mode === 'signup' && (
            <>
              <Text style={{ ...TYPOGRAPHY.caption, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>
                {th ? 'ยืนยันรหัสผ่าน' : 'Confirm password'}
              </Text>
              <TextInput
                value={confirm}
                onChangeText={txt => { setConfirm(txt); setFieldError(null); }}
                style={{ ...inputStyle, marginBottom: SPACING.sm }}
                placeholder={th ? 'พิมพ์รหัสผ่านอีกครั้ง' : 'Repeat your password'}
                placeholderTextColor={colors.text.tertiary}
                secureTextEntry={!showPassword}
                textContentType="newPassword"
                editable={!busy}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
            </>
          )}

          {/* ── Forgot password ── */}
          {mode === 'signin' && (
            <TouchableOpacity onPress={handleForgotPassword} disabled={busy} style={{ alignSelf: 'flex-end', marginBottom: SPACING.sm }}>
              <Text style={{ ...TYPOGRAPHY.caption, color: colors.primary, fontWeight: '600' }}>
                {th ? 'ลืมรหัสผ่าน?' : 'Forgot password?'}
              </Text>
            </TouchableOpacity>
          )}

          {/* ── Error ── */}
          {fieldError && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
              backgroundColor: `${colors.error}12`,
              borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.md,
            }}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <Text style={{ flex: 1, ...TYPOGRAPHY.caption, color: colors.error }}>{fieldError}</Text>
            </View>
          )}

          {/* ── Submit ── */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={{
              backgroundColor: colors.primary,
              borderRadius: BORDER_RADIUS.full,
              paddingVertical: 16, alignItems: 'center',
              marginTop: SPACING.md,
              opacity: canSubmit ? 1 : 0.5,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
            }}
          >
            {busy ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{ color: '#FFF', ...TYPOGRAPHY.callout, fontWeight: '700' }}>
                {mode === 'signin'
                  ? (th ? 'เข้าสู่ระบบ' : 'Sign In')
                  : (th ? 'สมัครฟรี — รับ 200 เครดิต 🎁' : 'Sign up free — get 200 credits 🎁')}
              </Text>
            )}
          </TouchableOpacity>

          {/* ── Benefits (signup) ── */}
          {mode === 'signup' && (
            <View style={{ marginTop: SPACING.xl, gap: SPACING.sm }}>
              {[
                th ? 'ใช้ AI ได้ครบทั้ง 11 ความสามารถ' : 'Access all 11 AI skills',
                th ? 'บัญชีเดียวใช้ได้ทั้งแอปและเว็บ rnai.io' : 'One account for app and rnai.io web',
                th ? 'API Key สร้างให้อัตโนมัติ ปลอดภัยใน Keychain' : 'API key auto-created, secured in Keychain',
              ].map(line => (
                <View key={line} style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success ?? '#10B981'} />
                  <Text style={{ ...TYPOGRAPHY.caption, color: colors.text.secondary }}>{line}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ── Guest skip ── */}
          <TouchableOpacity onPress={skipAuth} disabled={busy} style={{ alignItems: 'center', marginTop: SPACING.xxl }}>
            <Text style={{ ...TYPOGRAPHY.subheadline, color: colors.text.tertiary, textDecorationLine: 'underline' }}>
              {th ? 'ข้ามไปก่อน — ดูแอปแบบผู้เยี่ยมชม' : 'Skip for now — browse as guest'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
