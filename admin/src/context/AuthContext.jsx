import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

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

  const login = (token, admin) => {
    sessionStorage.setItem("adminToken", token);
    sessionStorage.setItem("adminUser", JSON.stringify(admin));
    setToken(token);
    setAdmin(admin);
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, admin, login, logout, isAuthenticated: Boolean(token) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}