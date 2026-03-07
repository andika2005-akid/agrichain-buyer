import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "petani" | "investor" | "bank" | "kementerian";

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleNames: Record<UserRole, string> = {
  petani: "Ahmad Suryadi (Petani)",
  investor: "Budi Wijaya (Investor)",
  bank: "Ir. Bambang Kusuma (Bank)",
  kementerian: "Dr. Siti Rahayu (Kementerian Pertanian)",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("petani");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (r: UserRole) => {
    setRole(r);
    setIsLoggedIn(true);
  };
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ role, setRole, userName: roleNames[role], isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
