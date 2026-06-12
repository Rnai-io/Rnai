import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, FlatList, Modal, Share, Alert, Dimensions, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { TYPOGRAPHY, SPACING, LAYOUT, BORDER_RADIUS } from '../constants/design';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useLibrary, LibraryItem, ItemType, formatBytes, timeAgo } from '../context/LibraryContext';

const { width: W } = Dimensions.get('window');
const IMG_CARD_W = (W - LAYOUT.screenPadding * 2 - SPACING.md) / 2;

// ── Filter tabs ────────────────────────────────────────────────────────────
const FILTER_TABS: { key: ItemType | 'all'; icon: string }[] = [
  { key: 'all',     icon: 'grid-outline' },
  { key: 'image',   icon: 'image-outline' },
  { key: 'text',    icon: 'document-text-outline' },
  { key: 'website', icon: 'laptop-outline' },
  { key: 'audio',   icon: 'volume-high-outline' },
];

// ── Cloud storage providers ────────────────────────────────────────────────
const CLOUD_PROVIDERS = [
  { id: 'rnai',    label: 'Rnai Cloud',    icon: '⚡', color: '#9333EA', bg: '#F3E8FF', status: 'upgrade' },
  { id: 'icloud',  label: 'iCloud Drive',  icon: '☁️', color: '#0EA5E9', bg: '#E0F2FE', status: 'soon' },
  { id: 'gdrive',  label: 'Google Drive',  icon: '🔵', color: '#10B981', bg: '#D1FAE5', status: 'soon' },
  { id: 'dropbox', label: 'Dropbox',       icon: '📦', color: '#3B82F6', bg: '#DBEAFE', status: 'soon' },
  { id: 'onedrive',label: 'OneDrive',      icon: '🟦', color: '#6366F1', bg: '#E0E7FF', status: 'soon' },
];

// ── Social share targets ───────────────────────────────────────────────────
const SOCIAL_TARGETS = [
  { id: 'native', label: 'Share',      icon: 'share-outline',         color: '#374151', bg: '#F3F4F6' },
  { id: 'copy',   label: 'Copy',       icon: 'copy-outline',          color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'save',   label: 'Save',       icon: 'download-outline',      color: '#10B981', bg: '#D1FAE5' },
  { id: 'ig',     label: 'Instagram',  icon: 'logo-instagram',        color: '#E1306C', bg: '#FEE2E2' },
  { id: 'twitter',label: 'X/Twitter', icon: 'logo-twitter',           color: '#1DA1F2', bg: '#DBEAFE' },
  { id: 'fb',     label: 'Facebook',   icon: 'logo-facebook',         color: '#1877F2', bg: '#EFF6FF' },
  { id: 'line',   label: 'LINE',       icon: 'chatbubble-outline',    color: '#06C755', bg: '#DCFCE7' },
  { id: 'wa',     label: 'WhatsApp',   icon: 'logo-whatsapp',         color: '#25D366', bg: '#DCFCE7' },
];

// ── Main Screen ─────────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t } = useLanguage();
  const { items, isHydrated, deleteItem, toggleFavorite, getItemsByType, totalItems, totalSizeBytes } = useLibrary();
  const isVibrant = scheme === 'vibrant';

  const [activeFilter, setActiveFilter] = useState<ItemType | 'all'>('all');
  const [shareItem, setShareItem] = useState<LibraryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = getItemsByType(activeFilter);
  const LOCAL_LIMIT_BYTES = 100 * 1024 * 1024; // 100MB
  const usedPercent = Math.min(totalSizeBytes / LOCAL_LIMIT_BYTES, 1);

  const gradientBg = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background] as [string, string];

  const L = t.library; // shorthand

  // ── Filter label helper ──
  const filterLabel = (key: ItemType | 'all') => {
    const map: Record<string, string> = {
      all:     L?.filters?.all     ?? 'All',
      image:   L?.filters?.images  ?? 'Images',
      text:    L?.filters?.text    ?? 'Text',
      website: L?.filters?.website ?? 'Website',
      audio:   L?.filters?.audio   ?? 'Audio',
    };
    return map[key] ?? key;
  };

  // ── Share handler ──
  const handleShareAction = async (action: string, item: LibraryItem) => {
    switch (action) {
      case 'native': {
        const msg = item.type === 'image' ? item.content : item.content.substring(0, 500);
        await Share.share({ message: msg, url: item.type === 'image' ? item.content : undefined });
        break;
      }
      case 'copy':
        await Share.share({ message: item.content.substring(0, 1000) });
        break;
      case 'save':
        if (item.type === 'image') {
          try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
              await MediaLibrary.saveToLibraryAsync(item.content);
              Alert.alert('✅', L?.alerts?.savedToRoll ?? 'Saved to Camera Roll');
            } else {
              Alert.alert(L?.alerts?.permDenied ?? 'Permission denied', L?.alerts?.permDenied ?? 'Please allow access to your photos in Settings');
            }
          } catch {
            await Share.share({ message: item.title, url: item.content });
          }
        } else {
          await Share.share({ message: item.content.substring(0, 1000) });
        }
        break;
      case 'ig':
        Linking.openURL('instagram://').catch(() => Linking.openURL('https://www.instagram.com'));
        break;
      case 'twitter':
        Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.type === 'text' ? item.content.substring(0, 280) : item.title + ' - made with Rnai.io')}`);
        break;
      case 'fb':
        Linking.openURL('https://www.facebook.com/sharer/sharer.php?u=https://rnai.io');
        break;
      case 'line':
        Linking.openURL(`https://line.me/R/msg/text/?${encodeURIComponent(item.title)}`);
        break;
      case 'wa':
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(item.title + ' - made with Rnai.io')}`);
        break;
    }
    setShareItem(null);
  };

  const confirmDelete = (item: LibraryItem) => {
    Alert.alert(L?.alerts?.deleteTitle ?? 'Delete', `${L?.alerts?.deleteMsg ?? 'Delete'} "${item.title}"?`, [
      { text: t.common?.cancel ?? 'Cancel', style: 'cancel' },
      { text: L?.alerts?.deleteTitle ?? 'Delete', style: 'destructive', onPress: () => deleteItem(item.id) },
    ]);
  };

  // ── Image grid card ──
  const ImageCard = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setPreviewItem(item)}
      style={{
        width: IMG_CARD_W,
        borderRadius: isVibrant ? 18 : 12,
        overflow: 'hidden',
        marginBottom: SPACING.md,
        ...(isVibrant && {
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12, shadowRadius: 12, elevation: 5,
        }),
      }}
    >
      <Image source={{ uri: item.thumbnail || item.content }} style={{ width: '100%', height: IMG_CARD_W * 1.1 }} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.sm }}
      >
        <Text style={{ color: '#FFF', ...TYPOGRAPHY.caption, fontWeight: '700' }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>{timeAgo(item.createdAt)}</Text>
      </LinearGradient>
      {/* Action buttons */}
      <View style={{ position: 'absolute', top: SPACING.sm, right: SPACING.sm, flexDirection: 'row', gap: 4 }}>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name={item.isFavorite ? 'heart' : 'heart-outline'} size={14} color={item.isFavorite ? '#F87171' : '#FFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShareItem(item)}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="share-outline" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/* Skill badge */}
      <View style={{
        position: 'absolute', top: SPACING.sm, left: SPACING.sm,
        backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 8,
        paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 3,
      }}>
        <Text style={{ fontSize: 10 }}>{item.skillIcon}</Text>
      </View>
    </TouchableOpacity>
  );

  // ── List row (text/website/audio) ──
  const ListRow = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setPreviewItem(item)}
      style={{
        backgroundColor: colors.surface,
        borderRadius: isVibrant ? 16 : 12,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        flexDirection: 'row', alignItems: 'center',
        ...(isVibrant ? {
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
        } : { borderWidth: 1, borderColor: colors.borders }),
      }}
    >
      <View style={{
        width: 48, height: 48, borderRadius: 14,
        backgroundColor: `${colors.primary}15`,
        justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg,
      }}>
        <Text style={{ fontSize: 24 }}>{item.skillIcon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, marginTop: 2 }} numberOfLines={2}>{item.content.replace(/<[^>]+>/g, '').substring(0, 80)}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: SPACING.sm }}>
          <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>{timeAgo(item.createdAt)}</Text>
          {item.sizeBytes && <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>· {formatBytes(item.sizeBytes)}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginLeft: SPACING.sm }}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Ionicons name={item.isFavorite ? 'heart' : 'heart-outline'} size={18} color={item.isFavorite ? '#F87171' : colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShareItem(item)}>
          <Ionicons name="share-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item)}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const showImages = activeFilter === 'all' || activeFilter === 'image';
  const showList = activeFilter !== 'image';

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientBg as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + LAYOUT.tabBarHeight + SPACING.xl }}
        >
          {/* ── Header ── */}
          <View style={{ paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.xl, paddingBottom: SPACING.lg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {L?.subtitle ?? 'My Workspace'}
                </Text>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 28, fontWeight: '800', marginTop: 2 }}>
                  {L?.title ?? 'Library'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: isVibrant ? `${colors.primary}15` : colors.surface,
                    justifyContent: 'center', alignItems: 'center',
                    borderWidth: isVibrant ? 0 : 1, borderColor: colors.borders,
                  }}
                >
                  <Ionicons name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'} size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Item count chips */}
            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg }}>
              {[
                { label: `${totalItems} ${L?.items ?? 'Items'}`, icon: 'folder-outline', color: colors.primary },
                { label: formatBytes(totalSizeBytes), icon: 'hardware-chip-outline', color: colors.secondary ?? '#0EA5E9' },
                { label: `${items.filter(i => i.isFavorite).length} ${L?.favorites ?? 'Favorites'}`, icon: 'heart-outline', color: '#F87171' },
              ].map(chip => (
                <View key={chip.label} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: isVibrant ? colors.surface : `${chip.color}12`,
                  borderRadius: BORDER_RADIUS.full,
                  paddingHorizontal: SPACING.md, paddingVertical: 6,
                  ...(isVibrant && { shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }),
                }}>
                  <Ionicons name={chip.icon as any} size={12} color={chip.color} />
                  <Text style={{ color: chip.color, fontSize: 12, fontWeight: '700' }}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Storage Bar ── */}
          <View style={{
            marginHorizontal: LAYOUT.screenPadding, marginBottom: SPACING.lg,
            backgroundColor: colors.surface, borderRadius: isVibrant ? 16 : 12,
            padding: SPACING.lg,
            ...(isVibrant ? {
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
            } : { borderWidth: 1, borderColor: colors.borders }),
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="phone-portrait-outline" size={14} color={colors.primary} />
                <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.caption, fontWeight: '700' }}>{L?.localStorage ?? 'Local Storage'}</Text>
              </View>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>
                {formatBytes(totalSizeBytes)} / 100 MB
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: colors.borders, borderRadius: 3 }}>
              <LinearGradient
                colors={[colors.primary, colors.secondary ?? '#0EA5E9']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ height: '100%', width: `${Math.max(usedPercent * 100, 2)}%`, borderRadius: 3 }}
              />
            </View>
          </View>

          {/* ── Filter Tabs ── */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: LAYOUT.screenPadding, gap: SPACING.sm, paddingBottom: SPACING.lg }}
          >
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.key;
              const count = tab.key === 'all' ? totalItems : getItemsByType(tab.key).length;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveFilter(tab.key)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderRadius: BORDER_RADIUS.full,
                    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
                    borderWidth: isActive || isVibrant ? 0 : 1, borderColor: colors.borders,
                    ...(isVibrant && !isActive && {
                      shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
                    }),
                    ...(isActive && {
                      shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
                    }),
                  }}
                >
                  <Ionicons name={tab.icon as any} size={14} color={isActive ? '#FFF' : colors.text.secondary} />
                  <Text style={{ color: isActive ? '#FFF' : colors.text.primary, ...TYPOGRAPHY.caption, fontWeight: '700' }}>
                    {filterLabel(tab.key)}
                  </Text>
                  <View style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : `${colors.primary}20`,
                    borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1,
                  }}>
                    <Text style={{ color: isActive ? '#FFF' : colors.primary, fontSize: 10, fontWeight: '800' }}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Empty State ── */}
          {filtered.length === 0 && isHydrated && (
            <View style={{ alignItems: 'center', paddingVertical: SPACING.xxxl * 2, paddingHorizontal: LAYOUT.screenPadding }}>
              <View style={{
                width: 80, height: 80, borderRadius: 24,
                backgroundColor: `${colors.primary}12`,
                justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl,
              }}>
                <Ionicons name="folder-open-outline" size={40} color={colors.primary} />
              </View>
              <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, textAlign: 'center' }}>
                {L?.noItems ?? 'No items yet'}
              </Text>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.subheadline, textAlign: 'center', marginTop: SPACING.sm }}>
                {L?.noItemsDesc ?? 'Create something and save it to see it here'}
              </Text>
            </View>
          )}

          {/* ── Image Grid ── */}
          {(activeFilter === 'all' || activeFilter === 'image') && filtered.filter(i => i.type === 'image').length > 0 && (
            <View style={{ paddingHorizontal: LAYOUT.screenPadding }}>
              {activeFilter === 'all' && (
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, marginBottom: SPACING.lg }}>
                  {L?.sections?.images ?? '🖼️ Images'}
                </Text>
              )}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'space-between' }}>
                {filtered.filter(i => i.type === 'image').map(item => (
                  <ImageCard key={item.id} item={item} />
                ))}
              </View>
            </View>
          )}

          {/* ── List Items (text/website/audio) ── */}
          {filtered.filter(i => i.type !== 'image').length > 0 && (
            <View style={{ paddingHorizontal: LAYOUT.screenPadding, marginTop: activeFilter === 'all' ? SPACING.xl : 0 }}>
              {activeFilter === 'all' && (
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, marginBottom: SPACING.lg }}>
                  {L?.sections?.docs ?? '📄 Documents & More'}
                </Text>
              )}
              {filtered.filter(i => i.type !== 'image').map(item => (
                <ListRow key={item.id} item={item} />
              ))}
            </View>
          )}

          {/* ── Cloud Storage Section ── */}
          <View style={{ paddingHorizontal: LAYOUT.screenPadding, marginTop: SPACING.xxl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
              <View>
                <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {L?.cloudStorage ?? 'Cloud Storage'}
                </Text>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 20, fontWeight: '800' }}>
                  {L?.connectSync ?? 'Connect & Sync'}
                </Text>
              </View>
            </View>

            {CLOUD_PROVIDERS.map(provider => (
              <TouchableOpacity
                key={provider.id}
                onPress={() => {
                  if (provider.id === 'rnai') {
                    Alert.alert('Rnai Cloud ⚡', L?.alerts?.rnaiCloud ?? 'Upgrade to Pro for unlimited storage', [
                      { text: L?.alerts?.rnaiLater ?? 'Later', style: 'cancel' },
                      { text: L?.alerts?.rnaiUpgrade ?? 'Upgrade', style: 'default' },
                    ]);
                  } else {
                    Alert.alert(`${provider.label}`, L?.alerts?.comingSoon ?? "Coming soon!", [{ text: L?.alerts?.comingOk ?? 'OK' }]);
                  }
                }}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: colors.surface,
                  borderRadius: isVibrant ? 16 : 12,
                  padding: SPACING.lg, marginBottom: SPACING.md,
                  ...(isVibrant ? {
                    shadowColor: colors.cardShadow,
                    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
                  } : { borderWidth: 1, borderColor: colors.borders }),
                }}
              >
                <View style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: provider.bg,
                  justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg,
                }}>
                  <Text style={{ fontSize: 22 }}>{provider.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }}>{provider.label}</Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, marginTop: 2 }}>
                    {provider.id === 'rnai' ? (L?.cloud?.rnaiDesc ?? 'Unlimited storage · Auto backup · Share links') : (L?.cloud?.otherDesc ?? 'Sync your creations automatically')}
                  </Text>
                </View>
                <View style={{
                  paddingHorizontal: SPACING.md, paddingVertical: 4,
                  backgroundColor: provider.id === 'rnai' ? colors.primary : `${colors.primary}15`,
                  borderRadius: BORDER_RADIUS.full,
                }}>
                  <Text style={{
                    color: provider.id === 'rnai' ? '#FFF' : colors.primary,
                    fontSize: 11, fontWeight: '700',
                  }}>
                    {provider.id === 'rnai' ? (L?.cloud?.upgrade ?? 'Upgrade') : (L?.cloud?.soon ?? 'Soon')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </LinearGradient>

      {/* ══════════════════════════════════════════════════════
          Modal: Share
      ══════════════════════════════════════════════════════ */}
      <Modal visible={!!shareItem} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShareItem(null)}>
        {shareItem && (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
            </View>

            {/* Share modal header */}
            <View style={{ padding: LAYOUT.screenPadding, borderBottomWidth: 1, borderBottomColor: colors.borders }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>
                  {L?.share?.title ?? 'Share'}
                </Text>
                <TouchableOpacity onPress={() => setShareItem(null)}>
                  <Ionicons name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              {/* Preview of item */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.lg, gap: SPACING.md }}>
                {shareItem.type === 'image' ? (
                  <Image source={{ uri: shareItem.thumbnail || shareItem.content }} style={{ width: 56, height: 56, borderRadius: 12 }} />
                ) : (
                  <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 28 }}>{shareItem.skillIcon}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }} numberOfLines={1}>{shareItem.title}</Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>
                    {shareItem.skillName} · {timeAgo(shareItem.createdAt)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Social grid */}
            <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding }}>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.lg }}>
                {L?.share?.via ?? 'Share Via'}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
                {SOCIAL_TARGETS.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => handleShareAction(s.id, shareItem)}
                    activeOpacity={0.7}
                    style={{ alignItems: 'center', width: (W - LAYOUT.screenPadding * 2 - SPACING.md * 3) / 4 }}
                  >
                    <View style={{
                      width: 56, height: 56, borderRadius: 16,
                      backgroundColor: s.bg, justifyContent: 'center', alignItems: 'center',
                      marginBottom: 6,
                      ...(isVibrant && {
                        shadowColor: s.color, shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
                      }),
                    }}>
                      <Ionicons name={s.icon as any} size={26} color={s.color} />
                    </View>
                    <Text style={{ color: colors.text.secondary, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Danger: Delete */}
              <TouchableOpacity
                onPress={() => { setShareItem(null); setTimeout(() => confirmDelete(shareItem), 300); }}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  marginTop: SPACING.xxl, gap: SPACING.sm,
                  backgroundColor: '#FEE2E2', borderRadius: BORDER_RADIUS.large,
                  paddingVertical: SPACING.lg,
                }}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={{ color: colors.error, ...TYPOGRAPHY.callout, fontWeight: '700' }}>{L?.share?.deleteFromLib ?? 'Delete from Library'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* ══════════════════════════════════════════════════════
          Modal: Full Preview
      ══════════════════════════════════════════════════════ */}
      <Modal visible={!!previewItem} animationType="fade" onRequestClose={() => setPreviewItem(null)}>
        {previewItem && (
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Close + share header */}
            <View style={{
              position: 'absolute', top: insets.top + SPACING.md, left: 0, right: 0, zIndex: 10,
              flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: LAYOUT.screenPadding,
            }}>
              <TouchableOpacity
                onPress={() => setPreviewItem(null)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="chevron-back" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setPreviewItem(null); setTimeout(() => setShareItem(previewItem), 300); }}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="share-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {previewItem.type === 'image' ? (
              <Image source={{ uri: previewItem.content }} style={{ flex: 1 }} resizeMode="contain" />
            ) : (
              <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding, paddingTop: insets.top + 80 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl }}>
                  <Text style={{ fontSize: 36 }}>{previewItem.skillIcon}</Text>
                  <View>
                    <Text style={{ color: '#FFF', ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>{previewItem.title}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', ...TYPOGRAPHY.caption }}>{previewItem.skillName}</Text>
                  </View>
                </View>
                <Text style={{ color: '#FFF', ...TYPOGRAPHY.body, lineHeight: 26 }}>
                  {previewItem.content.replace(/<[^>]+>/g, '')}
                </Text>
              </ScrollView>
            )}

            {/* Bottom info bar */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                paddingHorizontal: LAYOUT.screenPadding,
                paddingBottom: insets.bottom + SPACING.xl, paddingTop: SPACING.xxl,
              }}
            >
              <Text style={{ color: '#FFF', ...TYPOGRAPHY.headline }}>{previewItem.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.65)', ...TYPOGRAPHY.caption }}>{timeAgo(previewItem.createdAt)}</Text>
                {previewItem.sizeBytes && <Text style={{ color: 'rgba(255,255,255,0.65)', ...TYPOGRAPHY.caption }}>· {formatBytes(previewItem.sizeBytes)}</Text>}
              </View>
            </LinearGradient>
          </View>
        )}
      </Modal>
    </View>
  );
}
