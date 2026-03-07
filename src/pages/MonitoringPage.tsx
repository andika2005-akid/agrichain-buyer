import { provinceData, monthlySubsidyData, farmerApplications } from "@/data/mockData";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Shield, Eye, TrendingUp, Activity } from "lucide-react";
import { useState } from "react";
import ProgramControlPage from "@/pages/ProgramControlPage";

export default function MonitoringPage() {
  const [tab, setTab] = useState<"overview" | "program">("overview");

  const totalSubsidy = provinceData.reduce((s, p) => s + p.subsidyTotal, 0);
  const approvalRate = Math.round((farmerApplications.filter(f => f.status === "approved").length / farmerApplications.length) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Monitoring Bank</h1>
          <p className="text-sm text-muted-foreground">Oversight distribusi subsidi dan pendanaan oleh bank</p>
        </div>
        <div className="bg-card rounded-full p-1 flex items-center"> 
          <button onClick={() => setTab("overview")} className={`px-3 py-1 rounded-full text-sm ${tab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Overview
          </button>
          <button onClick={() => setTab("program")} className={`ml-1 px-3 py-1 rounded-full text-sm ${tab === "program" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            Kontrol Program
          </button>
        </div>
      </div>

      {tab === "overview" ? (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Tersalurkan" value={`Rp ${(totalSubsidy / 1e9).toFixed(0)}M`} icon={<TrendingUp className="w-5 h-5" />} variant="primary" />
            <StatCard title="Tingkat Approval" value={`${approvalRate}%`} icon={<Shield className="w-5 h-5" />} variant="success" />
            <StatCard title="Provinsi Aktif" value={provinceData.length} icon={<Eye className="w-5 h-5" />} variant="accent" />
            <StatCard title="Real-time Status" value="Live" icon={<Activity className="w-5 h-5" />} variant="default" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-5 shadow-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Subsidi per Provinsi (Miliar Rp)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={provinceData.sort((a, b) => b.subsidyTotal - a.subsidyTotal)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1e9).toFixed(0)}`} />
                  <Tooltip formatter={(v: number) => `Rp ${(v / 1e9).toFixed(1)} M`} />
                  <Bar dataKey="subsidyTotal" fill="hsl(210, 80%, 25%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-5 shadow-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Tren Subsidi Bulanan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySubsidyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pupuk" stroke="hsl(210, 80%, 25%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="benih" stroke="hsl(42, 90%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="irigasi" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      ) : (
        <div>
          <ProgramControlPage />
        </div>
      )}
    </div>
  );
}
