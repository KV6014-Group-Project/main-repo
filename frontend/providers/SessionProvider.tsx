import React from 'react';
import { getSession, setSession, type Session, type Role, signIn, signUp, signOut } from '@/lib/auth';

type SessionContextValue = {
  session: Session;
  status: 'loading' | 'ready';
  setSession: (next: Session) => Promise<void>;
  signIn: (email: string, password: string, roleHint?: Role) => Promise<Session>;
  signUp: (params: { email?: string; password?: string; role: Role; firstName?: string; lastName?: string; phone?: string }) => Promise<Session>;
  signOut: () => Promise<void>;
};

const SessionContext = React.createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = React.useState<Session>(null);
  const [status, setStatus] = React.useState<'loading' | 'ready'>('loading');

  React.useEffect(() => {
    (async () => {
      const s = await getSession();
      setSessionState(s);
      setStatus('ready');
    })();
  }, []);

  const setSessionAndPersist = React.useCallback(async (next: Session) => {
    setSessionState(next);
    await setSession(next);
  }, []);

  const doSignIn = React.useCallback(async (email: string, password: string, roleHint?: Role) => {
    // use signIn stub, then optionally override role with hint
    let s = await signIn(email, password);
    if (roleHint) {
      s = s ? { ...s, role: roleHint } : s;
    }
    await setSessionAndPersist(s);
    return s;
  }, [setSessionAndPersist]);

  const doSignUp = React.useCallback(async (params: { email?: string; password?: string; role: Role; firstName?: string; lastName?: string; phone?: string }) => {
    const s = await signUp(params);
    await setSessionAndPersist(s);
    return s;
  }, [setSessionAndPersist]);

  const doSignOut = React.useCallback(async () => {
    await signOut();
    setSessionState(null);
  }, []);

  const value: SessionContextValue = React.useMemo(
    () => ({ session, status, setSession: setSessionAndPersist, signIn: doSignIn, signUp: doSignUp, signOut: doSignOut }),
    [session, status, setSessionAndPersist, doSignIn, doSignUp, doSignOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}


