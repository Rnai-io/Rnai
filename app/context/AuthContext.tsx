import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthResult,
  signInAndProvisionKey,
  loadAuthProfile,
  signOut as serviceSignOut,
  setAuthSkipped,
  wasAuthSkipped,
} from '../services/auth';

interface AuthContextType {
  /** Signed-in user, or null. */
  user: AuthResult | null;
  /** True once stored session has been loaded. */
  isHydrated: boolean;
  /** True if the user chose "continue as guest". */
  skipped: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  skipAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResult | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [profile, skippedFlag] = await Promise.all([
          loadAuthProfile(),
          wasAuthSkipped(),
        ]);
        if (profile) setUser(profile);
        setSkipped(skippedFlag);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await signInAndProvisionKey(email, password, 'signin');
    setUser(res);
    return res;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const res = await signInAndProvisionKey(email, password, 'signup');
    setUser(res);
    return res;
  }, []);

  const signOut = useCallback(async () => {
    await serviceSignOut();
    setUser(null);
    setSkipped(false); // auth gate reappears
  }, []);

  const skipAuth = useCallback(() => {
    setSkipped(true);
    setAuthSkipped(); // fire-and-forget persist
  }, []);

  return (
    <AuthContext.Provider value={{ user, isHydrated, skipped, signIn, signUp, signOut, skipAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
