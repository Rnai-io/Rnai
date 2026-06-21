import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, Modal, Share, Alert, Dimensions, Linking,
  ActivityIndicator, Clipboard,
} from 'react-native';
import WebView from 'react-native-webview';
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
type CloudProvider = {
  id: string;
  label: string;
  desc: string;
  descTh: string;
  ionIcon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg: string;
  bgDark: string;
  status: 'available' | 'soon';
};

const CLOUD_PROVIDERS: CloudProvider[] = [
  {
    id: 'rnai',     label: 'Rnai Cloud',
    desc: 'Unlimited storage · Auto backup · Share links',
    descTh: 'พื้นที่ไม่จำกัด · สำรองอัตโนมัติ · ลิงก์แชร์',
    ionIcon: 'flash',         color: '#9333EA', bg: '#F3E8FF', bgDark: '#3B0764', status: 'available',
  },
  {
    id: 'icloud',   label: 'iCloud Drive',
    desc: 'Sync your creations automatically',
    descTh: 'ซิงค์งานสร้างของคุณอัตโนมัติ',
    ionIcon: 'logo-apple',    color: '#0EA5E9', bg: '#E0F2FE', bgDark: '#0C4A6E', status: 'soon',
  },
  {
    id: 'gdrive',   label: 'Google Drive',
    desc: 'Sync your creations automatically',
    descTh: 'ซิงค์งานสร้างของคุณอัตโนมัติ',
    ionIcon: 'logo-google',   color: '#10B981', bg: '#D1FAE5', bgDark: '#064E3B', status: 'soon',
  },
  {
    id: 'dropbox',  label: 'Dropbox',
    desc: 'Sync your creations automatically',
    descTh: 'ซิงค์งานสร้างของคุณอัตโนมัติ',
    ionIcon: 'logo-dropbox',  color: '#3B82F6', bg: '#DBEAFE', bgDark: '#1E3A8A', status: 'soon',
  },
  {
    id: 'onedrive', label: 'OneDrive',
    desc: 'Sync your creations automatically',
    descTh: 'ซิงค์งานสร้างของคุณอัตโนมัติ',
    ionIcon: 'cloud-upload-outline', color: '#6366F1', bg: '#E0E7FF', bgDark: '#1E1B4B', status: 'soon',
  },
];

// ── Social share targets ───────────────────────────────────────────────────
const SOCIAL_TARGETS = [
  { id: 'native', label: 'Share',     icon: 'share-outline',      color: '#374151', bg: '#F3F4F6' },
  { id: 'copy',   label: 'Copy',      icon: 'copy-outline',       color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'save',   label: 'Save',      icon: 'download-outline',   color: '#10B981', bg: '#D1FAE5' },
  { id: 'ig',     label: 'Instagram', icon: 'logo-instagram',     color: '#E1306C', bg: '#FEE2E2' },
  { id: 'twitter',label: 'X/Twitter', icon: 'logo-twitter',       color: '#1DA1F2', bg: '#DBEAFE' },
  { id: 'fb',     label: 'Facebook',  icon: 'logo-facebook',      color: '#1877F2', bg: '#EFF6FF' },
  { id: 'line',   label: 'LINE',      icon: 'chatbubble-outline', color: '#06C755', bg: '#DCFCE7' },
  { id: 'wa',     label: 'WhatsApp',  icon: 'logo-whatsapp',      color: '#25D366', bg: '#DCFCE7' },
];

// ── HTML helpers ──────────────────────────────────────────────────────────

function extractHtmlTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

function lineCount(str: string): number {
  return str.split('\n').length;
}

// ── Syntax-colored code line ──────────────────────────────────────────────

function TagColoredLine({ line }: { line: string }) {
  const parts: React.ReactNode[] = [];
  let key = 0;
  const tagMatch = line.match(/^(\s*)(<\/?)([a-zA-Z][a-zA-Z0-9]*)(.*)$/s);
  if (!tagMatch) return <>{line}</>;
  const [, indent, opening, tagName, afterTag] = tagMatch;
  if (indent) parts.push(<Text key={key++} style={{ color: 'rgba(255,255,255,0.4)' }}>{indent}</Text>);
  parts.push(<Text key={key++} style={{ color: '#C084FC' }}>{opening}</Text>);
  parts.push(<Text key={key++} style={{ color: '#F472B6' }}>{tagName}</Text>);
  const attrRegex = /\s+([a-zA-Z_:][a-zA-Z0-9_:.-]*)(?:=("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s>]+))?/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = attrRegex.exec(afterTag)) !== null) {
    if (m.index > lastIndex)
      parts.push(<Text key={key++} style={{ color: 'rgba(255,255,255,0.4)' }}>{afterTag.slice(lastIndex, m.index)}</Text>);
    parts.push(<Text key={key++} style={{ color: '#FCD34D' }}>{' ' + m[1]}</Text>);
    if (m[2]) {
      parts.push(<Text key={key++} style={{ color: 'rgba(255,255,255,0.3)' }}>{'='}</Text>);
      parts.push(<Text key={key++} style={{ color: '#86EFAC' }}>{m[2]}</Text>);
    }
    lastIndex = m.index + m[0].length;
  }
  const tail = afterTag.slice(lastIndex);
  if (tail) {
    const closeMatch = tail.match(/^([/\s>]*)(.*)/s);
    if (closeMatch) {
      parts.push(<Text key={key++} style={{ color: '#C084FC' }}>{closeMatch[1]}</Text>);
      parts.push(<Text key={key++} style={{ color: 'rgba(255,255,255,0.8)' }}>{closeMatch[2]}</Text>);
    } else {
      parts.push(<Text key={key++} style={{ color: 'rgba(255,255,255,0.7)' }}>{tail}</Text>);
    }
  }
  return <>{parts}</>;
}

function CodeLine({ line }: { line: string }) {
  const isTag     = /<[/!]?[a-zA-Z]/.test(line);
  const isComment = /<!--/.test(line) || /-->/.test(line);
  const isCss     = !isTag && (/^\s*[\w-]+\s*:/.test(line) || /^\s*[.#]?[\w-]+\s*\{/.test(line));
  let color = 'rgba(255,255,255,0.75)';
  if (isComment)       color = '#6B7280';
  else if (isCss)      color = '#93C5FD';
  return (
    <Text style={{ color, fontSize: 12, fontFamily: 'Courier', lineHeight: 20 }} selectable>
      {isTag ? <TagColoredLine line={line} /> : (line || ' ')}
    </Text>
  );
}

// ── Website Detail Modal ──────────────────────────────────────────────────

interface WebsiteDetailModalProps {
  item: LibraryItem;
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  colors: any;
  insets: any;
  lang: string;
}

function WebsiteDetailModal({ item, visible, onClose, onShare, colors, insets, lang }: WebsiteDetailModalProps) {
  const [tab, setTab]           = useState<'preview' | 'code'>('preview');
  const [webLoading, setWebLoading] = useState(true);
  const [copied, setCopied]     = useState(false);

  const htmlTitle = extractHtmlTitle(item.content) ?? item.title;
  const lines     = lineCount(item.content);
  const sizeLabel = item.sizeBytes ? formatBytes(item.sizeBytes) : `${(item.content.length / 1024).toFixed(1)} KB`;

  const handleCopy = () => {
    try {
      Clipboard.setString(item.content);
    } catch {
      Share.share({ message: item.content });
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    if (visible) { setTab('preview'); setWebLoading(true); setCopied(false); }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0F0F1A' }}>

        {/* ── Header ── */}
        <View style={{
          paddingTop: insets.top + SPACING.sm,
          paddingBottom: SPACING.md,
          paddingHorizontal: LAYOUT.screenPadding,
          backgroundColor: '#1A1A2E',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.08)',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="chevron-back" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }} numberOfLines={1}>{htmlTitle}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 1 }}>
                {item.skillName} · {timeAgo(item.createdAt)} · {sizeLabel}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCopy}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={copied ? '#10B981' : '#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShare}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="share-outline" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Tab switcher */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 3, marginTop: SPACING.md,
          }}>
            {([
              { key: 'preview' as const, label: lang === 'th' ? '🌐 ตัวอย่าง' : '🌐 Preview' },
              { key: 'code'    as const, label: lang === 'th' ? '</> โค้ด HTML' : '</> HTML Code' },
            ]).map(t => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTab(t.key)}
                activeOpacity={0.7}
                style={{
                  flex: 1, paddingVertical: SPACING.sm + 2, borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: tab === t.key ? '#7C3AED' : 'transparent',
                }}
              >
                <Text style={{ color: tab === t.key ? '#FFF' : 'rgba(255,255,255,0.45)', fontWeight: '700', fontSize: 13 }}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Preview Tab ── */}
        {tab === 'preview' && (
          <View style={{ flex: 1 }}>
            {webLoading && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F1A' }}>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: SPACING.md, fontSize: 13 }}>
                  {lang === 'th' ? 'กำลังโหลดเว็บไซต์...' : 'Loading website...'}
                </Text>
              </View>
            )}
            <WebView
              source={{ html: item.content }}
              style={{ flex: 1, backgroundColor: '#FFF' }}
              onLoadEnd={() => setWebLoading(false)}
              onError={() => setWebLoading(false)}
              scalesPageToFit
              javaScriptEnabled
              startInLoadingState={false}
            />
            {/* Floating code button */}
            <TouchableOpacity
              onPress={() => setTab('code')}
              style={{
                position: 'absolute',
                bottom: insets.bottom + SPACING.xl,
                right: LAYOUT.screenPadding,
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: 'rgba(15,15,26,0.85)',
                paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2,
                borderRadius: BORDER_RADIUS.full,
                borderWidth: 1, borderColor: 'rgba(124,58,237,0.4)',
              }}
            >
              <Ionicons name="code-slash-outline" size={14} color="#A78BFA" />
              <Text style={{ color: '#A78BFA', fontWeight: '700', fontSize: 13 }}>
                {lang === 'th' ? 'ดูโค้ด' : 'View Code'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Code Tab ── */}
        {tab === 'code' && (
          <View style={{ flex: 1 }}>
            {/* Stats bar */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: LAYOUT.screenPadding, paddingVertical: SPACING.sm,
              backgroundColor: '#111124',
              borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
              gap: SPACING.lg,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' }} />
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>HTML</Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                {lines} {lang === 'th' ? 'บรรทัด' : 'lines'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{sizeLabel}</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={handleCopy}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 5,
                  paddingHorizontal: SPACING.md, paddingVertical: 4,
                  backgroundColor: copied ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.2)',
                  borderRadius: 8, borderWidth: 1,
                  borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(124,58,237,0.4)',
                }}
              >
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={12} color={copied ? '#10B981' : '#A78BFA'} />
                <Text style={{ color: copied ? '#10B981' : '#A78BFA', fontWeight: '700', fontSize: 11 }}>
                  {copied ? (lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!') : (lang === 'th' ? 'คัดลอก HTML' : 'Copy HTML')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Code viewer */}
            <ScrollView
              style={{ flex: 1, backgroundColor: '#0D0D1F' }}
              contentContainerStyle={{ paddingVertical: SPACING.md }}
              showsVerticalScrollIndicator
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                  {/* Line numbers */}
                  <View style={{
                    paddingHorizontal: SPACING.md,
                    borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.06)',
                    minWidth: 48, alignItems: 'flex-end',
                  }}>
                    {item.content.split('\n').map((_, i) => (
                      <Text key={i} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Courier', lineHeight: 20 }}>
                        {i + 1}
                      </Text>
                    ))}
                  </View>
                  {/* Code */}
                  <View style={{ paddingHorizontal: SPACING.lg, paddingRight: SPACING.xxl }}>
                    {item.content.split('\n').map((line, i) => (
                      <CodeLine key={i} line={line} />
                    ))}
                  </View>
                </View>
              </ScrollView>
            </ScrollView>

            {/* Bottom action bar */}
            <View style={{
              paddingHorizontal: LAYOUT.screenPadding,
              paddingVertical: SPACING.lg,
              paddingBottom: insets.bottom + SPACING.lg,
              backgroundColor: '#111124',
              borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
              flexDirection: 'row', gap: SPACING.md,
            }}>
              <TouchableOpacity
                onPress={handleCopy}
                activeOpacity={0.8}
                style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: SPACING.sm, paddingVertical: SPACING.md,
                  backgroundColor: copied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                  borderRadius: BORDER_RADIUS.large,
                  borderWidth: 1, borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(124,58,237,0.4)',
                }}
              >
                <Ionicons name={copied ? 'checkmark-circle' : 'copy-outline'} size={18} color={copied ? '#10B981' : '#A78BFA'} />
                <Text style={{ color: copied ? '#10B981' : '#A78BFA', fontWeight: '700', fontSize: 14 }}>
                  {copied ? (lang === 'th' ? '✓ คัดลอกแล้ว' : '✓ Copied') : (lang === 'th' ? 'คัดลอก HTML' : 'Copy HTML')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                activeOpacity={0.8}
                style={{
                  flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: SPACING.sm, paddingVertical: SPACING.md,
                  backgroundColor: '#7C3AED', borderRadius: BORDER_RADIUS.large,
                }}
              >
                <Ionicons name="share-outline" size={18} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>
                  {lang === 'th' ? 'แชร์ไฟล์' : 'Share File'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t, lang } = useLanguage();
  const { items, isHydrated, deleteItem, toggleFavorite, getItemsByType, totalItems, totalSizeBytes } = useLibrary();
  const isVibrant = scheme === 'vibrant';

  const [activeFilter, setActiveFilter] = useState<ItemType | 'all'>('all');
  const [shareItem,    setShareItem]    = useState<LibraryItem | null>(null);
  const [previewItem,  setPreviewItem]  = useState<LibraryItem | null>(null);
  const [websiteItem,  setWebsiteItem]  = useState<LibraryItem | null>(null);
  const [viewMode,     setViewMode]     = useState<'grid' | 'list'>('grid');

  const filtered = getItemsByType(activeFilter);
  const LOCAL_LIMIT_BYTES = 100 * 1024 * 1024;
  const usedPercent = Math.min(totalSizeBytes / LOCAL_LIMIT_BYTES, 1);

  const gradientBg = isVibrant
    ? [colors.gradient[0], colors.gradient[1], colors.gradient[2]]
    : [colors.background, colors.background] as [string, string];

  const L = t.library;

  const filterLabel = (key: ItemType | 'all') => {
    const map: Record<string, string> = {
      all: L?.filters?.all ?? 'All', image: L?.filters?.images ?? 'Images',
      text: L?.filters?.text ?? 'Text', website: L?.filters?.website ?? 'Website',
      audio: L?.filters?.audio ?? 'Audio',
    };
    return map[key] ?? key;
  };

  const handleItemPress = (item: LibraryItem) => {
    if (item.type === 'website') setWebsiteItem(item);
    else setPreviewItem(item);
  };

  const handleShareAction = async (action: string, item: LibraryItem) => {
    switch (action) {
      case 'native': await Share.share({ message: item.type === 'image' ? item.content : item.content.substring(0, 500), url: item.type === 'image' ? item.content : undefined }); break;
      case 'copy':   await Share.share({ message: item.content.substring(0, 1000) }); break;
      case 'save':
        if (item.type === 'image') {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') { await MediaLibrary.saveToLibraryAsync(item.content); Alert.alert('✅', L?.alerts?.savedToRoll ?? 'Saved to Camera Roll'); }
          else Alert.alert('Permission denied', 'Allow photo access in Settings');
        } else { await Share.share({ message: item.content.substring(0, 1000) }); }
        break;
      case 'ig':      Linking.openURL('instagram://').catch(() => Linking.openURL('https://www.instagram.com')); break;
      case 'twitter': Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.type === 'text' ? item.content.substring(0, 280) : item.title + ' - made with Rnai.io')}`); break;
      case 'fb':      Linking.openURL('https://www.facebook.com/sharer/sharer.php?u=https://rnai.io'); break;
      case 'line':    Linking.openURL(`https://line.me/R/msg/text/?${encodeURIComponent(item.title)}`); break;
      case 'wa':      Linking.openURL(`whatsapp://send?text=${encodeURIComponent(item.title + ' - made with Rnai.io')}`); break;
    }
    setShareItem(null);
  };

  const confirmDelete = (item: LibraryItem) => {
    Alert.alert(L?.alerts?.deleteTitle ?? 'Delete', `${L?.alerts?.deleteMsg ?? 'Delete'} "${item.title}"?`, [
      { text: t.common?.cancel ?? 'Cancel', style: 'cancel' },
      { text: L?.alerts?.deleteTitle ?? 'Delete', style: 'destructive', onPress: () => deleteItem(item.id) },
    ]);
  };

  // ── Image card ──
  const ImageCard = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity
      activeOpacity={0.85} onPress={() => handleItemPress(item)}
      style={{
        width: IMG_CARD_W, borderRadius: isVibrant ? 18 : 12,
        overflow: 'hidden', marginBottom: SPACING.md,
        ...(isVibrant && { shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5 }),
      }}
    >
      <Image source={{ uri: item.thumbnail || item.content }} style={{ width: '100%', height: IMG_CARD_W * 1.1 }} resizeMode="cover" />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.sm }}>
        <Text style={{ color: '#FFF', ...TYPOGRAPHY.caption, fontWeight: '700' }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>{timeAgo(item.createdAt)}</Text>
      </LinearGradient>
      <View style={{ position: 'absolute', top: SPACING.sm, right: SPACING.sm, flexDirection: 'row', gap: 4 }}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name={item.isFavorite ? 'heart' : 'heart-outline'} size={14} color={item.isFavorite ? '#F87171' : '#FFF'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShareItem(item)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="share-outline" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ── List row ──
  const ListRow = ({ item }: { item: LibraryItem }) => {
    const previewText = React.useMemo(() => {
      if (item.type !== 'website') return item.content.replace(/<[^>]+>/g, '').substring(0, 80);
      const pageTitle = extractHtmlTitle(item.content);
      const bodyText = item.content
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ').trim().substring(0, 90);
      return pageTitle ? `${pageTitle} — ${bodyText}` : bodyText;
    }, [item]);

    return (
      <TouchableOpacity
        activeOpacity={0.85} onPress={() => handleItemPress(item)}
        style={{
          backgroundColor: colors.surface, borderRadius: isVibrant ? 16 : 12,
          padding: SPACING.lg, marginBottom: SPACING.md,
          flexDirection: 'row', alignItems: 'center',
          ...(isVibrant
            ? { shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 }
            : { borderWidth: 1, borderColor: colors.borders }),
        }}
      >
        {/* Thumbnail / icon */}
        <View style={{
          width: 52, height: 52, borderRadius: 14,
          backgroundColor: item.type === 'website' ? 'rgba(124,58,237,0.1)' : `${colors.primary}15`,
          justifyContent: 'center', alignItems: 'center',
          marginRight: SPACING.lg, overflow: 'hidden',
        }}>
          {item.type === 'website' ? (
            // Mini browser window thumbnail
            <View style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden' }}>
              {/* Browser chrome bar */}
              <View style={{ height: 10, backgroundColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, gap: 2 }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#F87171' }} />
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#FCD34D' }} />
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#34D399' }} />
              </View>
              {/* Page content preview */}
              <LinearGradient
                colors={['#7C3AED', '#5B21B6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 18 }}>🌐</Text>
              </LinearGradient>
            </View>
          ) : (
            <Text style={{ fontSize: 26 }}>{item.skillIcon}</Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            {item.type === 'website' && (
              <View style={{ backgroundColor: 'rgba(124,58,237,0.12)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                <Text style={{ color: '#7C3AED', fontSize: 9, fontWeight: '800' }}>HTML</Text>
              </View>
            )}
            <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, flex: 1 }} numberOfLines={1}>{item.title}</Text>
          </View>
          <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, marginTop: 1 }} numberOfLines={2}>
            {previewText}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: SPACING.sm }}>
            <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>{timeAgo(item.createdAt)}</Text>
            {item.sizeBytes != null && <Text style={{ color: colors.text.tertiary, fontSize: 11 }}>· {formatBytes(item.sizeBytes)}</Text>}
            {item.type === 'website' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="open-outline" size={10} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '600' }}>
                  {lang === 'th' ? 'แตะเพื่อดู' : 'Tap to view'}
                </Text>
              </View>
            )}
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
  };

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
            {/* Chips */}
            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg }}>
              {[
                { label: `${totalItems} ${L?.items ?? 'Items'}`, icon: 'folder-outline', color: colors.primary },
                { label: formatBytes(totalSizeBytes), icon: 'hardware-chip-outline', color: colors.secondary ?? '#0EA5E9' },
                { label: `${items.filter(i => i.isFavorite).length} ${L?.favorites ?? 'Favorites'}`, icon: 'heart-outline', color: '#F87171' },
              ].map(chip => (
                <View key={chip.label} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: isVibrant ? colors.surface : `${chip.color}12`,
                  borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 6,
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
            backgroundColor: colors.surface, borderRadius: isVibrant ? 16 : 12, padding: SPACING.lg,
            ...(isVibrant ? { shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 } : { borderWidth: 1, borderColor: colors.borders }),
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="phone-portrait-outline" size={14} color={colors.primary} />
                <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.caption, fontWeight: '700' }}>{L?.localStorage ?? 'Local Storage'}</Text>
              </View>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>{formatBytes(totalSizeBytes)} / 100 MB</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: LAYOUT.screenPadding, gap: SPACING.sm, paddingBottom: SPACING.lg }}>
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.key;
              const count = tab.key === 'all' ? totalItems : getItemsByType(tab.key).length;
              return (
                <TouchableOpacity
                  key={tab.key} onPress={() => setActiveFilter(tab.key)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
                    borderWidth: isActive || isVibrant ? 0 : 1, borderColor: colors.borders,
                    ...(isVibrant && !isActive && { shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }),
                    ...(isActive && { shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }),
                  }}
                >
                  <Ionicons name={tab.icon as any} size={14} color={isActive ? '#FFF' : colors.text.secondary} />
                  <Text style={{ color: isActive ? '#FFF' : colors.text.primary, ...TYPOGRAPHY.caption, fontWeight: '700' }}>{filterLabel(tab.key)}</Text>
                  <View style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : `${colors.primary}20`, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 }}>
                    <Text style={{ color: isActive ? '#FFF' : colors.primary, fontSize: 10, fontWeight: '800' }}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Empty State ── */}
          {filtered.length === 0 && isHydrated && (
            <View style={{ alignItems: 'center', paddingVertical: SPACING.xxxl * 2, paddingHorizontal: LAYOUT.screenPadding }}>
              <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: `${colors.primary}12`, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl }}>
                <Ionicons name="folder-open-outline" size={40} color={colors.primary} />
              </View>
              <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, textAlign: 'center' }}>{L?.noItems ?? 'No items yet'}</Text>
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
                {filtered.filter(i => i.type === 'image').map(item => <ImageCard key={item.id} item={item} />)}
              </View>
            </View>
          )}

          {/* ── List Items ── */}
          {filtered.filter(i => i.type !== 'image').length > 0 && (
            <View style={{ paddingHorizontal: LAYOUT.screenPadding, marginTop: activeFilter === 'all' ? SPACING.xl : 0 }}>
              {activeFilter === 'all' && (
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, marginBottom: SPACING.lg }}>
                  {L?.sections?.docs ?? '📄 Documents & More'}
                </Text>
              )}
              {filtered.filter(i => i.type !== 'image').map(item => <ListRow key={item.id} item={item} />)}
            </View>
          )}

          {/* ── Cloud Storage ── */}
          <View style={{ paddingHorizontal: LAYOUT.screenPadding, marginTop: SPACING.xxl, marginBottom: SPACING.xxl }}>
            {/* Section header */}
            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={{
                color: colors.text.secondary, fontSize: 11, fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4,
              }}>
                {lang === 'th' ? 'จัดเก็บบนคลาวด์' : 'Cloud Storage'}
              </Text>
              <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, fontSize: 22, fontWeight: '800' }}>
                {lang === 'th' ? 'เชื่อมต่อและซิงค์' : 'Connect & Sync'}
              </Text>
            </View>

            {CLOUD_PROVIDERS.map((provider, idx) => {
              const isRnai = provider.id === 'rnai';
              return (
                <TouchableOpacity
                  key={provider.id}
                  onPress={() => {
                    if (isRnai) {
                      Alert.alert(
                        'Rnai Cloud ⚡',
                        lang === 'th'
                          ? 'อัปเกรดเป็นโปรเพื่อใช้พื้นที่ไม่จำกัด และเชื่อมต่อ Rnai Cloud'
                          : 'Upgrade to Pro for unlimited storage and Rnai Cloud sync',
                        [
                          { text: lang === 'th' ? 'ภายหลัง' : 'Later', style: 'cancel' },
                          { text: lang === 'th' ? 'อัปเกรด' : 'Upgrade', onPress: () => Linking.openURL('https://rnai.io/billing') },
                        ],
                      );
                    } else {
                      Alert.alert(
                        provider.label,
                        lang === 'th' ? 'การเชื่อมต่อนี้จะพร้อมใช้งานเร็วๆ นี้!' : 'This integration is coming soon!',
                        [{ text: 'OK' }],
                      );
                    }
                  }}
                  activeOpacity={0.82}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: colors.surface,
                    borderRadius: isVibrant ? 18 : 14,
                    padding: SPACING.lg,
                    marginBottom: idx === CLOUD_PROVIDERS.length - 1 ? 0 : SPACING.md,
                    ...(isVibrant
                      ? { shadowColor: isRnai ? provider.color : colors.cardShadow, shadowOffset: { width: 0, height: isRnai ? 4 : 2 }, shadowOpacity: isRnai ? 0.18 : 0.07, shadowRadius: isRnai ? 12 : 8, elevation: isRnai ? 6 : 3 }
                      : { borderWidth: 1, borderColor: isRnai ? `${provider.color}40` : colors.borders }),
                  }}
                >
                  {/* Provider icon */}
                  <View style={{
                    width: 48, height: 48, borderRadius: 14,
                    backgroundColor: isVibrant ? provider.bg : `${provider.color}15`,
                    justifyContent: 'center', alignItems: 'center',
                    marginRight: SPACING.lg,
                  }}>
                    <Ionicons name={provider.ionIcon} size={24} color={provider.color} />
                  </View>

                  {/* Label + description */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline, marginBottom: 2 }}>
                      {provider.label}
                    </Text>
                    <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, lineHeight: 16 }}>
                      {lang === 'th' ? provider.descTh : provider.desc}
                    </Text>
                  </View>

                  {/* Action badge */}
                  {isRnai ? (
                    <LinearGradient
                      colors={['#9333EA', '#7C3AED']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={{ paddingHorizontal: SPACING.lg, paddingVertical: 7, borderRadius: BORDER_RADIUS.full }}
                    >
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>
                        {lang === 'th' ? 'อัปเกรด' : 'Upgrade'}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={{
                      paddingHorizontal: SPACING.md, paddingVertical: 6,
                      backgroundColor: `${provider.color}12`, borderRadius: BORDER_RADIUS.full,
                      borderWidth: 1, borderColor: `${provider.color}25`,
                    }}>
                      <Text style={{ color: provider.color, fontSize: 11, fontWeight: '700' }}>
                        {lang === 'th' ? 'เร็วๆ นี้' : 'Soon'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
      </LinearGradient>

      {/* ══ Website Detail Modal ══ */}
      {websiteItem && (
        <WebsiteDetailModal
          item={websiteItem}
          visible={!!websiteItem}
          onClose={() => setWebsiteItem(null)}
          onShare={() => { setWebsiteItem(null); setTimeout(() => setShareItem(websiteItem), 300); }}
          colors={colors}
          insets={insets}
          lang={lang ?? 'th'}
        />
      )}

      {/* ══ Share Modal ══ */}
      <Modal visible={!!shareItem} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShareItem(null)}>
        {shareItem && (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ alignItems: 'center', paddingTop: SPACING.lg }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borders }} />
            </View>
            <View style={{ padding: LAYOUT.screenPadding, borderBottomWidth: 1, borderBottomColor: colors.borders }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: isVibrant ? colors.primary : colors.text.primary, ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>
                  {L?.share?.title ?? 'Share'}
                </Text>
                <TouchableOpacity onPress={() => setShareItem(null)}>
                  <Ionicons name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.lg, gap: SPACING.md }}>
                {shareItem.type === 'image'
                  ? <Image source={{ uri: shareItem.thumbnail || shareItem.content }} style={{ width: 56, height: 56, borderRadius: 12 }} />
                  : <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 28 }}>{shareItem.skillIcon}</Text>
                    </View>}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, ...TYPOGRAPHY.headline }} numberOfLines={1}>{shareItem.title}</Text>
                  <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption }}>{shareItem.skillName} · {timeAgo(shareItem.createdAt)}</Text>
                </View>
              </View>
            </View>
            <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding }}>
              <Text style={{ color: colors.text.secondary, ...TYPOGRAPHY.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.lg }}>
                {L?.share?.via ?? 'Share Via'}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
                {SOCIAL_TARGETS.map(s => (
                  <TouchableOpacity key={s.id} onPress={() => handleShareAction(s.id, shareItem)} activeOpacity={0.7}
                    style={{ alignItems: 'center', width: (W - LAYOUT.screenPadding * 2 - SPACING.md * 3) / 4 }}>
                    <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: s.bg, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
                      ...(isVibrant && { shadowColor: s.color, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }) }}>
                      <Ionicons name={s.icon as any} size={26} color={s.color} />
                    </View>
                    <Text style={{ color: colors.text.secondary, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => { setShareItem(null); setTimeout(() => confirmDelete(shareItem), 300); }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xxl, gap: SPACING.sm, backgroundColor: '#FEE2E2', borderRadius: BORDER_RADIUS.large, paddingVertical: SPACING.lg }}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={{ color: colors.error, ...TYPOGRAPHY.callout, fontWeight: '700' }}>{L?.share?.deleteFromLib ?? 'Delete from Library'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* ══ Full Preview Modal (image / text / audio) ══ */}
      <Modal visible={!!previewItem} animationType="fade" onRequestClose={() => setPreviewItem(null)}>
        {previewItem && (
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={{ position: 'absolute', top: insets.top + SPACING.md, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: LAYOUT.screenPadding }}>
              <TouchableOpacity onPress={() => setPreviewItem(null)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="chevron-back" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setPreviewItem(null); setTimeout(() => setShareItem(previewItem), 300); }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="share-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            {previewItem.type === 'image'
              ? <Image source={{ uri: previewItem.content }} style={{ flex: 1 }} resizeMode="contain" />
              : (
                <ScrollView contentContainerStyle={{ padding: LAYOUT.screenPadding, paddingTop: insets.top + 80 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl }}>
                    <Text style={{ fontSize: 36 }}>{previewItem.skillIcon}</Text>
                    <View>
                      <Text style={{ color: '#FFF', ...TYPOGRAPHY.headline, fontSize: 20, fontWeight: '800' }}>{previewItem.title}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.6)', ...TYPOGRAPHY.caption }}>{previewItem.skillName}</Text>
                    </View>
                  </View>
                  <Text style={{ color: '#FFF', ...TYPOGRAPHY.body, lineHeight: 26 }}>{previewItem.content}</Text>
                </ScrollView>
              )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: LAYOUT.screenPadding, paddingBottom: insets.bottom + SPACING.xl, paddingTop: SPACING.xxl }}
            >
              <Text style={{ color: '#FFF', ...TYPOGRAPHY.headline }}>{previewItem.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.65)', ...TYPOGRAPHY.caption }}>{timeAgo(previewItem.createdAt)}</Text>
                {previewItem.sizeBytes != null && <Text style={{ color: 'rgba(255,255,255,0.65)', ...TYPOGRAPHY.caption }}>· {formatBytes(previewItem.sizeBytes)}</Text>}
              </View>
            </LinearGradient>
          </View>
        )}
      </Modal>
    </View>
  );
}
