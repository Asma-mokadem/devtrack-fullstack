import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });

  const login = useCallback((credentials) => {
    const stored = JSON.parse(localStorage.getItem("registeredUser"));
    if (!stored) return { ok: false, error: "No account found. Please register first." };
    if (credentials.email !== stored.email) return { ok: false, error: "Invalid email or password." };
    if (credentials.password !== stored.password) return { ok: false, error: "Invalid email or password." };
    localStorage.setItem("user", JSON.stringify(stored));
    setUser(stored);
    return { ok: true };
  }, []);

  const register = useCallback((data) => {
    const existing = JSON.parse(localStorage.getItem("registeredUser"));
    if (existing && existing.email === data.email) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = { name: data.name, email: data.email, password: data.password, username: data.name.toLowerCase().replace(/\s+/g, "") };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const current = JSON.parse(localStorage.getItem("registeredUser")) || {};
    const updated = { ...current, ...updates };
    localStorage.setItem("registeredUser", JSON.stringify(updated));
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  }, []);

  const changePassword = useCallback((oldPass, newPass) => {
    const stored = JSON.parse(localStorage.getItem("registeredUser"));
    if (!stored || stored.password !== oldPass) return { ok: false, error: "Current password is incorrect." };
    const updated = { ...stored, password: newPass };
    localStorage.setItem("registeredUser", JSON.stringify(updated));
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}