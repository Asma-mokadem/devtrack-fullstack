
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // chargement initial
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    userAPI
      .getProfile()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);
  const login = useCallback(async (credentials) => {
    const data = await authAPI.login(credentials); 
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return { ok: true };
  }, []);
  const register = useCallback(async (payload) => {
    const data = await authAPI.register(payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return { ok: true };
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);
  const updateUser = useCallback(async (updates) => {
    const data = await userAPI.updateProfile(updates);
    setUser(data.user);
    return { ok: true };
  }, []);
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    await userAPI.updateProfile({ oldPassword, newPassword });
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}