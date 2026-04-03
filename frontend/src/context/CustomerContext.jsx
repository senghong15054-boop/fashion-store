import { createContext, useContext, useMemo, useState } from "react";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => JSON.parse(localStorage.getItem("premium-customer") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("premium-customer-token"));

  const login = (payload) => {
    setCustomer(payload.customer);
    setToken(payload.token);
    localStorage.setItem("premium-customer", JSON.stringify(payload.customer));
    localStorage.setItem("premium-customer-token", payload.token);
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem("premium-customer");
    localStorage.removeItem("premium-customer-token");
  };

  const value = useMemo(() => ({ customer, token, login, logout }), [customer, token]);

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export const useCustomer = () => useContext(CustomerContext);
