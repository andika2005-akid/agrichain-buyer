import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Wheat, Building2, Landmark, TrendingUp, ShoppingCart } from "lucide-react";
import { useState } from "react";

const roles: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: "petani", label: "Petani", icon: Wheat, desc: "Tanam & Ajukan proposal" },
  { role: "investor", label: "Investor", icon: TrendingUp, desc: "Analisis & pendanaan proyek" },
  { role: "standby_buyer", label: "Standby Buyer", icon: ShoppingCart, desc: "Kontrak pembelian hasil panen" },
  { role: "kementerian", label: "Kementerian", icon: Landmark, desc: "Monitoring & audit sistem" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>("petani");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // simulasi API call
      await new Promise((res) => setTimeout(res, 1000));

      if (!email || !password) {
        throw new Error("Email dan password wajib diisi");
      }

      login(selectedRole);
      // Navigate ke home page, yang akan redirect berdasarkan role
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass p-8 rounded-2xl"
      >
        <div className="text-center mb-8">
          <img src="/taralink.png" alt="TaraLink Logo" className="w-32 h-33 mx-auto mb-2 object-contain" />
          <p className="text-sm text-black mt-1">Menghubungkan Petani dan Industri</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div>
            <label className="text-xs font-semibold text-black/80 mb-3 block">Pilih Peran Anda:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    type="button"
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-3 rounded-lg text-center transition flex flex-col items-center gap-1 ${
                      selectedRole === r.role
                        ? "bg-accent text-accent-foreground shadow-lg scale-105"
                        : "bg-white/10 text-primary-foreground/70 hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{r.label}</span>
                    <span className="text-[10px] opacity-75">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 text-foreground placeholder:text-muted-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 text-foreground placeholder:text-muted-foreground"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground py-2 rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}