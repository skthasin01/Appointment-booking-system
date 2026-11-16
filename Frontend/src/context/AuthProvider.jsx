import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import * as authApi from '../api/auth';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'appointease.token';
const USER_KEY = 'appointease.user';

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem(TOKEN_KEY))
  );

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    setToken(nextToken || null);
    setUser(nextUser || null);
  }, []);

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      persist(data.access_token, data.user);
      return data.user;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      await authApi.register(payload);
      return login(payload.email, payload.password);
    },
    [login]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      return undefined;
    }

    let active = true;

    authApi
      .me()
      .then((profile) => {
        if (active) {
          persist(storedToken, profile);
        }
      })
      .catch(() => {
        if (active) {
          persist(null, null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [persist]);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('appointease:unauthorized', handleUnauthorized);
    return () =>
      window.removeEventListener('appointease:unauthorized', handleUnauthorized);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isCustomer: user?.role === 'customer',
      isProvider: user?.role === 'provider',
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
