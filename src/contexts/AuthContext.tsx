import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "petani" | "investor" | "standby_buyer" | "kementerian";

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

const roleNames: Record<UserRole, string> = {
  petani: "Ahmad Suryadi (Petani)",
  investor: "Budi Wijaya (Investor)",
  standby_buyer: "Ir. Bambang Kusuma (Standby Buyer)",
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
