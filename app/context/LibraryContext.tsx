import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ──────────────────────────────────────────────────────────────────

export type ItemType = 'image' | 'text' | 'website' | 'audio';

export interface LibraryItem {
  id: string;
  type: ItemType;
  skillId: string;
  skillName: string;
  skillIcon: string;
  title: string;
  content: string;       // image URL / text content / HTML / audio URL
  thumbnail?: string;    // For image items
  createdAt: Date;
  isFavorite: boolean;
  tags: string[];
  sizeBytes?: number;
}

interface LibraryContextType {
  items: LibraryItem[];
  isHydrated: boolean;
  saveItem: (item: Omit<LibraryItem, 'id' | 'createdAt' | 'isFavorite' | 'tags'>) => string;
  deleteItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAll: () => void;
  getItemsByType: (type: ItemType | 'all') => LibraryItem[];
  totalItems: number;
  totalSizeBytes: number;
}

// ── Context ────────────────────────────────────────────────────────────────

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// Demo seed items so the screen doesn't look empty on first launch
const SEED_ITEMS: LibraryItem[] = [
  {
    id: 'seed-1',
    type: 'image',
    skillId: 'image-gen',
    skillName: 'Generate Image',
    skillIcon: '🎨',
    title: 'Cyberpunk City',
    content: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=70',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isFavorite: true,
    tags: ['cyberpunk', 'city'],
    sizeBytes: 245000,
  },
  {
    id: 'seed-2',
    type: 'image',
    skillId: 'stylize',
    skillName: 'Stylize Image',
    skillIcon: '🖌️',
    title: 'Ghibli Forest',
    content: 'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=300&q=70',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isFavorite: false,
    tags: ['anime', 'forest'],
    sizeBytes: 312000,
  },
  {
    id: 'seed-3',
    type: 'text',
    skillId: 'text-gen',
    skillName: 'Generate Text',
    skillIcon: '📝',
    title: 'LinkedIn Post',
    content: 'AI is transforming the creative industry at an unprecedented pace. Here are 3 key insights every creator should know in 2025...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isFavorite: false,
    tags: ['linkedin', 'ai'],
    sizeBytes: 1200,
  },
  {
    id: 'seed-4',
    type: 'website',
    skillId: 'website-gen',
    skillName: 'Generate Website',
    skillIcon: '💻',
    title: 'Portfolio Website',
    content: '<html>...</html>',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isFavorite: true,
    tags: ['portfolio', 'design'],
    sizeBytes: 45000,
  },
  {
    id: 'seed-5',
    type: 'image',
    skillId: 'remove-bg',
    skillName: 'Remove Background',
    skillIcon: '✂️',
    title: 'Product Shot',
    content: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=70',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isFavorite: false,
    tags: ['product', 'ecommerce'],
    sizeBytes: 189000,
  },
];

// ── Provider ───────────────────────────────────────────────────────────────

const STORAGE_KEY = '@rnai/library-items';

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // ── Load persisted items on launch (seed only on very first launch) ──
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          const parsed: LibraryItem[] = JSON.parse(raw).map((i: any) => ({
            ...i,
            createdAt: new Date(i.createdAt),
          }));
          setItems(parsed);
        } else {
          setItems(SEED_ITEMS); // first launch — show demo content
        }
      } catch {
        setItems(SEED_ITEMS); // corrupted storage — fall back gracefully
      } finally {
        hydratedRef.current = true;
        setIsHydrated(true);
      }
    })();
  }, []);

  // ── Persist on every change (after hydration) ──
  // Cap at 300 newest items to stay well under AsyncStorage limits.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const toPersist = items.length > 300 ? items.slice(0, 300) : items;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist)).catch(() => {
      // Storage full or unavailable — keep in-memory copy, fail silently
    });
  }, [items]);

  const saveItem = useCallback((item: Omit<LibraryItem, 'id' | 'createdAt' | 'isFavorite' | 'tags'>): string => {
    const id = `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newItem: LibraryItem = {
      ...item,
      id,
      createdAt: new Date(),
      isFavorite: false,
      tags: [],
    };
    setItems(prev => [newItem, ...prev]);
    return id;
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const getItemsByType = useCallback((type: ItemType | 'all') =>
    type === 'all' ? items : items.filter(i => i.type === type),
  [items]);

  const totalItems = items.length;
  const totalSizeBytes = items.reduce((sum, i) => sum + (i.sizeBytes ?? 0), 0);

  return (
    <LibraryContext.Provider value={{ items, isHydrated, saveItem, deleteItem, toggleFavorite, clearAll, getItemsByType, totalItems, totalSizeBytes }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be inside LibraryProvider');
  return ctx;
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Real usage stats derived from library items. */
export function computeLibraryStats(items: LibraryItem[]): { monthly: number; total: number; streak: number } {
  const now = new Date();
  const monthly = items.filter(i =>
    i.createdAt.getMonth() === now.getMonth() && i.createdAt.getFullYear() === now.getFullYear()
  ).length;

  // Day streak: consecutive days (ending today or yesterday) with at least one creation
  const days = new Set(items.map(i => {
    const d = i.createdAt;
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }));
  const keyOf = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let streak = 0;
  const cursor = new Date();
  if (!days.has(keyOf(cursor))) cursor.setDate(cursor.getDate() - 1); // allow streak to survive until end of today
  while (days.has(keyOf(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { monthly, total: items.length, streak };
}

export function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
