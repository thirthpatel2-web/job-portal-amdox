import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed = JSON.parse(stored);

      setAuth(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = (data) => {

    setAuth(data.user);
    setToken(data.token);

    localStorage.setItem(
      "auth",
      JSON.stringify({
        user: data.user,
        token: data.token,
      })
    );
  };

  const logout = () => {
    setAuth(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
