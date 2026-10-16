import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { AuthContext } from "./authContextInstance";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("adminToken")
  );

  const [admin, setAdmin] = useState(() => {
    const savedAdmin = sessionStorage.getItem("adminUser");

    try {
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((token, admin) => {
    sessionStorage.setItem("adminToken", token);
    sessionStorage.setItem("adminUser", JSON.stringify(admin));
    localStorage.removeItem("adminToken");
    setToken(token);
    setAdmin(admin);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ token, admin, login, logout, isAuthenticated: Boolean(token) }),
    [token, admin, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}