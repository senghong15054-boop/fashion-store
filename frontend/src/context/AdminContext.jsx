import { createContext, useContext, useMemo, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem("premium-admin") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("premium-token"));

  const login = (payload) => {
    setAdmin(payload.admin);
    setToken(payload.token);
    localStorage.setItem("premium-admin", JSON.stringify(payload.admin));
    localStorage.setItem("premium-token", payload.token);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("premium-admin");
    localStorage.removeItem("premium-token");
  };

  const value = useMemo(() => ({ admin, token, login, logout }), [admin, token]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);
