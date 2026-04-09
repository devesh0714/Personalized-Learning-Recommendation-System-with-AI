import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

// ✅ use SAME key everywhere
const storageKey = "token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // optional: if you have profile API
        if (api.getProfile) {
          const response = await api.getProfile(token);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth error:", error.message);

        // ❌ remove invalid token
        localStorage.removeItem(storageKey);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const handleAuth = (payload) => {
    // ✅ store token correctly
    localStorage.setItem(storageKey, payload.token);

    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        handleAuth,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);