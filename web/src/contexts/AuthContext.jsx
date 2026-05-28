import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao montar
  const normalizeRole = (role) => {
    if (!role) return role;
    const value = role.toLowerCase();
    if (value === 'adm' || value === 'admin') return 'admin';
    if (value === 'usuario' || value === 'user') return 'user';
    return value;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        parsed.role = normalizeRole(parsed.role)
        setUser(parsed);
      } catch (err) {
        console.error("Erro ao restaurar usuário:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  const signin = (token, userData) => {
    const normalized = { ...userData, role: normalizeRole(userData.role) }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}