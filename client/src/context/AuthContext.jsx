import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth.js";
import { tokenStore } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  // If a token is saved, find out who it belongs to.
  useEffect(() => {
    if (!tokenStore.get()) return;
    authApi
      .getCurrentUser()
      .then(({ user }) => setUser(user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(apiCall, credentials) {
    const { token, user } = await apiCall(credentials);
    tokenStore.set(token);
    setUser(user);
  }

  const value = {
    user,
    loading,
    login: (credentials) => authenticate(authApi.login, credentials),
    signup: (credentials) => authenticate(authApi.signup, credentials),
    logout: () => {
      tokenStore.clear();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
