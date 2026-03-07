import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/StatCard";
import { provinceData, monthlySubsidyData, commodityDistribution, farmerApplications, fraudAlerts, kurApplications, KURApplication } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LabelList } from "recharts";
import { Users, Wheat, MapPin, AlertTriangle, TrendingUp, DollarSign, FileText, CheckCircle2, FileCheck2, FileCheck } from "lucide-react";
import { predictCropRisk, RiskInput } from "@/lib/risk";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

// Komponen Peta Indonesia
function IndonesiaMapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Indonesia
    const map = L.map(mapRef.current).setView([-2.5489, 113.9213], 4);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Data provinsi dengan koordinat (lat, lng)
    const provinceMarkers = [
      { name: "Jawa Barat", lat: -6.9147, lng: 107.6098, value: 35 },
      { name: "Jawa Tengah", lat: -7.1505, lng: 110.1429, value: 28 },
      { name: "Jawa Timur", lat: -7.2504, lng: 112.7688, value: 35 },
      { name: "Sumatera Utara", lat: 2.1148, lng: 99.5501, value: 42 },
      { name: "Sumatera Barat", lat: -0.9457, lng: 100.4172, value: 38 },
      { name: "Riau", lat: 0.2934, lng: 101.6964, value: 40 },
      { name: "Sulawesi Selatan", lat: -3.6675, lng: 119.4345, value: 45 },
      { name: "Sulawesi Utara", lat: 1.3521, lng: 124.8252, value: 32 },
      { name: "Kalimantan Tengah", lat: -1.6789, lng: 113.3807, value: 50 },
      { name: "Papua", lat: -3.595, lng: 138.8022, value: 55 },
    ];

    // Add markers untuk setiap provinsi
    provinceMarkers.forEach((province) => {
      // Determine color based on risk value
      let circleColor = "#22c55e"; // green
      if (province.value > 40) {
        circleColor = "#ef4444"; // red
      } else if (province.value > 30) {
        circleColor = "#f59e0b"; // orange
      }

      // Add circle marker
      L.circleMarker([province.lat, province.lng], {
        radius: 8 + (province.value / 10),
        fillColor: circleColor,
        color: "#000",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup(
          `<div class="text-xs"><strong>${province.name}</strong><br/>Risiko: ${province.value}%</div>`
        );
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div ref={mapRef} className="w-full h-80 rounded-lg border border-border/50" />
  );
}

export default function DashboardPage() {
  const { role } = useAuth();

  // for investor role we render a dedicated investor dashboard
  if (role === "investor") {
    // Use kurApplications from mockData, aligned with bank dashboard
    const investorProposals = kurApplications.map((kur) => ({
      id: kur.id,
      farmerName: kur.farmerName,
      komoditas: kur.komoditas,
      danaDiminta: kur.jumlahPinjaman,
      estimasiProfit: Math.round(kur.jumlahPinjaman * 0.4), // Estimate 40% profit
      status: kur.status === "approved" ? "disetujui" : kur.status === "submitted" ? "ditinjau" : "menunggu",
    }));

    const investmentByComodity = [
      { name: "Padi", value: 35, fill: "hsl(210, 80%, 25%)" },
      { name: "Jagung", value: 25, fill: "hsl(42, 90%, 55%)" },
      { name: "Cabai", value: 20, fill: "hsl(152, 60%, 42%)" },
      { name: "Kopi", value: 20, fill: "hsl(175, 45%, 40%)" },
    ];

    const popularCommodities = ["Padi", "Jagung", "Cabai"];

    const totalProposals = investorProposals.length;
    const proposalDitinjau = investorProposals.filter((p) => p.status === "ditinjau").length;
    const investasiAktif = investorProposals.filter((p) => p.status === "disetujui").length;
    const potensialProfit = investorProposals.reduce((s, p) => s + p.estimasiProfit, 0);

    const getStatusBadgeColor = (status: string) => {
      const colors: Record<string, string> = {
        menunggu: "bg-yellow-100 text-yellow-800",
        ditinjau: "bg-blue-100 text-blue-800",
        disetujui: "bg-green-100 text-green-800",
        ditolak: "bg-red-100 text-red-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: string) => {
      const labels: Record<string, string> = {
        menunggu: "Menunggu",
        ditinjau: "Ditinjau",
        disetujui: "Disetujui",
        ditolak: "Ditolak",
      };
      return labels[status] || status;
    };

    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Investor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Kelola investasi dan monitor proposal pertanian</p>
        </div>

        {/* 4 Card Statistik */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Proposal"
            value={totalProposals}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Proposal Ditinjau"
            value={proposalDitinjau}
            icon={<FileCheck className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            title="Investasi Aktif"
            value={investasiAktif}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Potensi Profit"
            value={`Rp ${(potensialProfit / 1e6).toFixed(0)}M`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="accent"
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Investment Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Distribusi Investasi Berdasarkan Komoditas</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={investmentByComodity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {investmentByComodity.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Popular Commodities */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Komoditas Populer</h3>
            <div className="space-y-3">
              {popularCommodities.map((commodity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium text-foreground">{commodity}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Notifikasi Investor */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 shadow-card border border-blue-200"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Notifikasi Investor
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-foreground">3 proposal baru menunggu review</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-foreground">1 investasi telah disetujui</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-foreground">2 proposal sedang dianalisis</p>
            </div>
          </div>
        </motion.div>

        {/* Proposal Terbaru Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Proposal Terbaru</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nama Petani</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Dana Diminta</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Estimasi Profit</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {investorProposals.map((proposal) => (
                <tr key={proposal.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{proposal.farmerName}</td>
                  <td className="py-2.5 px-3">{proposal.komoditas}</td>
                  <td className="py-2.5 px-3 text-right">Rp {proposal.danaDiminta.toLocaleString("id-ID")}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-green-600">Rp {proposal.estimasiProfit.toLocaleString("id-ID")}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(proposal.status)}`}>
                      {getStatusLabel(proposal.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    );
  }

  // Dashboard Kementerian
  if (role === "kementerian") {
    // Statistik Nasional
    const totalPetaniTerdaftar = farmerApplications.length;
    const totalPengajuanSubsidi = farmerApplications.length;
    const subsidiBerhasil = farmerApplications.filter((f) => f.status === "approved").length;
    const totalDanaDisalurkan = subsidiBerhasil * 50000000; // Dummy: Rp 50M per subsidi
    const fraudDetected = fraudAlerts.length;
    const wilayahRisikoTinggi = provinceData.filter((p) => p.score < 40).length;

    // Data untuk chart penyaluran subsidi per bulan - dari monthlySubsidyData
    const subsidyDistribution = monthlySubsidyData.map((item) => ({
      bulan: item.month.substring(0, 3),
      dana: (item.pupuk + item.benih + item.irigasi + item.alat + item.tunai) * 1000000, // Convert to total amount
    }));

    // Data untuk prediksi risiko per wilayah - dari provinceData
    const riskPredictionData = provinceData.slice(0, 4).map((prov) => ({
      wilayah: prov.name,
      risikoGagalPanen: `${Math.max(0, 100 - prov.score)}%`,
    }));

    // Data untuk blockchain transactions - dari kurApplications
    const blockchainData = kurApplications.slice(0, 4).map((kur, idx) => ({
      txId: `0x${(idx + 1).toString().padStart(6, "0")}`,
      petani: kur.farmerName,
      dana: (kur.jumlahPinjaman / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ".000",
    }));

    // Data untuk notifikasi sistem - dari fraudAlerts dan data kalkulasi
    const duplicateNIKCount = fraudAlerts.filter((f) => f.type === "Duplikasi NIK").length;
    const highRiskCount = provinceData.filter((p) => p.score < 50).length;
    const budgetUsagePercent = Math.round((totalDanaDisalurkan / 100000000000) * 100); // Asumsi total budget 100B
    
    const systemAlerts = [
      { icon: "⚠️", title: "Duplikasi NIK Terdeteksi", desc: `${duplicateNIKCount} petani dengan NIK ganda ditemukan`, color: "text-red-600" },
      { icon: "🌾", title: "Risiko Gagal Panen Tinggi", desc: `Prediksi gagal panen tinggi di ${highRiskCount} wilayah`, color: "text-orange-600" },
      { icon: "💰", title: "Anggaran Program Hampir Habis", desc: `${budgetUsagePercent}% anggaran tahun ini sudah disalurkan`, color: "text-yellow-600" },
    ];

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold font-display text-foreground">Dashboard Kementerian</h1>
          <p className="text-sm text-muted-foreground">Monitoring Subsidi Pertanian Nasional</p>
        </motion.div>

        {/* STATISTIK NASIONAL - 6 Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <StatCard
            title="Total Petani Terdaftar"
            value={totalPetaniTerdaftar}
            icon={<Users className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Total Pengajuan Subsidi"
            value={totalPengajuanSubsidi}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Subsidi Disetujui"
            value={subsidiBerhasil}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Total Dana Disalurkan"
            value={`Rp ${(totalDanaDisalurkan.toLocaleString("id-ID"))}`}
            icon={<DollarSign className="w-5 h-5" />}
            variant="accent"
          />
          <StatCard
            title="Kasus Fraud Terdeteksi"
            value={fraudDetected}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="destructive"
          />
          <StatCard
            title="Wilayah Risiko Tinggi"
            value={wilayahRisikoTinggi}
            icon={<MapPin className="w-5 h-5" />}
            variant="warning"
          />
        </motion.div>

        {/* ROW 2: Chart Penyaluran & Notifikasi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Penyaluran Subsidi */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Grafik Penyaluran Subsidi per Bulan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subsidyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number | string) => {
                  const num = typeof value === "string" ? parseInt(value) : value;
                  return `Rp ${num.toLocaleString("id-ID")}`;
                }} />
                <Bar dataKey="dana" fill="hsl(210, 80%, 25%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Notifikasi Sistem */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Notifikasi Sistem</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {systemAlerts.map((alert, idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded-lg border-l-4 border-orange-400">
                  <p className={`text-xs font-bold mb-1 ${alert.color}`}>{alert.icon} {alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ROW 3: Mini Peta & Pengajuan Terbaru */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mini Peta Nasional */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Peta Distribusi Subsidi Indonesia</h3>
            <IndonesiaMapComponent />
          </motion.div>

          {/* Pengajuan Subsidi Terbaru */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Pengajuan Subsidi Terbaru</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Petani</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Provinsi</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {farmerApplications.slice(0, 5).map((f) => (
                  <tr key={f.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium">{f.name}</td>
                    <td className="py-2.5 px-3">{f.province}</td>
                    <td className="py-2.5 px-3">{f.commodity}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        f.status === "approved" ? "bg-green-100 text-green-800" :
                        f.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {f.status === "approved" ? "Disetujui" : f.status === "pending" ? "Menunggu" : "Ditolak"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* ROW 4: Ringkasan Prediksi Risiko & Blockchain */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ringkasan Prediksi Risiko */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Ringkasan Prediksi Risiko Gagal Panen</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Wilayah</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Risiko Gagal Panen</th>
                </tr>
              </thead>
              <tbody>
                {riskPredictionData.map((risk, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium">{risk.wilayah}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-semibold ${
                        parseFloat(risk.risikoGagalPanen) > 40 ? "text-red-600" :
                        parseFloat(risk.risikoGagalPanen) > 30 ? "text-orange-600" :
                        "text-green-600"
                      }`}>
                        {risk.risikoGagalPanen}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Aktivitas Blockchain Terbaru */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Aktivitas Blockchain Terbaru</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Petani</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Dana</th>
                </tr>
              </thead>
              <tbody>
                {blockchainData.map((tx) => (
                  <tr key={tx.txId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-blue-600">{tx.txId}</td>
                    <td className="py-2.5 px-3 font-medium">{tx.petani}</td>
                    <td className="py-2.5 px-3 text-green-600 font-medium">Rp {tx.dana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    );
  }

  // for bank role we render a dedicated KUR receipt dashboard
  if (role === "bank") {
    // compute simple stats
    const totalApps = kurApplications.length;
    const approved = kurApplications.filter((a) => a.status === "approved").length;
    const rejected = kurApplications.filter((a) => a.status === "rejected").length;
    const menunggu = kurApplications.filter((a) => a.status === "submitted").length;
  const totalLoan = kurApplications.reduce((s, a) => s + (a.jumlahPinjaman || 0), 0);

    // compute risk predictions for each commodity from farmerApplications
    const predictions = farmerApplications.map((f) => {
      const input: RiskInput = {
        soilType: "",
        soilPH: 0,
        moisture: 0,
        historicalRain: 0,
        predictedTemp3m: 0,
        cropType: f.commodity,
        area: f.area,
      };
      return { commodity: f.commodity, score: predictCropRisk(input).riskScore };
    });
    const avgRiskByCommodity: Record<string, number> = {};
    const countsByCommodity: Record<string, number> = {};
    predictions.forEach((p) => {
      avgRiskByCommodity[p.commodity] = (avgRiskByCommodity[p.commodity] || 0) + p.score;
      countsByCommodity[p.commodity] = (countsByCommodity[p.commodity] || 0) + 1;
    });
    Object.keys(avgRiskByCommodity).forEach((c) => {
      avgRiskByCommodity[c] = Math.round(avgRiskByCommodity[c] / countsByCommodity[c]);
    });

    // Prepare bar chart data sorted by score (desc) and color palette
    const barData = Object.entries(avgRiskByCommodity).map(([commodity, score]) => ({ commodity, score })).sort((a, b) => b.score - a.score);
    const palette = ["#60A5FA", "#F97316", "#F59E0B", "#34D399", "#FB7185", "#A78BFA"];

    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Bank KUR Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitoring dan analisis pengajuan kredit usaha rakyat sektor pertanian
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Pengajuan"
            value={totalApps}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
          title="Menunggu Verifikasi"
          value={menunggu}
          icon={<FileCheck className="w-5 h-5" />}
          variant="warning"
          />
          <StatCard
            title="Disetujui"
            value={approved}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Ditolak"
            value={rejected}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="destructive"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <StatCard
            title="Total Dana Pinjaman"
            value={`Rp ${totalLoan.toLocaleString("id-ID")}`}
            icon={<DollarSign className="w-5 h-5" />}
            variant="accent"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Risiko Rata-rata per Komoditas</h3>
          {barData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada data komoditas.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis dataKey="commodity" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => `${value}`} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
                    ))}
                    <LabelList dataKey="score" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Detail Pengajuan KUR</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nama Petani</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Alamat</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Jumlah Pinjaman</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {kurApplications.map((app) => (
                <tr key={app.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono">{app.id}</td>
                  <td className="py-2.5 px-3 font-medium">{app.farmerName}</td>
                  <td className="py-2.5 px-3 text-xs">
                    {farmerApplications.find((f) => f.id === app.farmerId)?.address || "-"}
                  </td>
                  <td className="py-2.5 px-3">{app.komoditas}</td>
                  <td className="py-2.5 px-3 text-right">Rp {app.jumlahPinjaman.toLocaleString("id-ID")}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      app.status === "approved"
                        ? "bg-success/10 text-success"
                        : app.status === "rejected"
                        ? "bg-destructive/10 text-destructive"
                        : app.status === "disbursed"
                        ? "bg-primary/10 text-primary"
                        : "bg-warning/10 text-warning"
                    }`}>{
                      app.status === "submitted" ? "Menunggu" : app.status === "disbursed" ? "Dana Cair" : app.status === "approved" ? "Disetujui" : "Ditolak"
                    }</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    );
  }

  const totalFarmers = provinceData.reduce((s, p) => s + p.farmers, 0);
  const totalSubsidy = provinceData.reduce((s, p) => s + p.subsidyTotal, 0);
  const approvedCount = farmerApplications.filter((f) => f.status === "approved").length;
  const pendingCount = farmerApplications.filter((f) => f.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {role === "petani" ? "Status pengajuan subsidi Anda" : "Monitoring sistem subsidi pertanian nasional"}
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Petani"
          value={totalFarmers.toLocaleString("id-ID")}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, label: "bulan ini" }}
          variant="primary"
        />
        <StatCard
          title="Total Subsidi"
          value={`Rp ${(totalSubsidy / 1e9).toFixed(1)}M`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 8.5, label: "vs bulan lalu" }}
          variant="accent"
        />
        <StatCard
          title="Disetujui"
          value={approvedCount}
          subtitle={`${pendingCount} menunggu review`}
          icon={<Wheat className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Alert Fraud"
          value={fraudAlerts.length}
          subtitle="2 kritis perlu tindakan"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="default"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subsidy distribution chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribusi Subsidi Bulanan (Juta Rp)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlySubsidyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="pupuk" stackId="1" fill="hsl(210, 80%, 25%)" stroke="hsl(210, 80%, 25%)" fillOpacity={0.8} />
              <Area type="monotone" dataKey="benih" stackId="1" fill="hsl(42, 90%, 55%)" stroke="hsl(42, 90%, 55%)" fillOpacity={0.8} />
              <Area type="monotone" dataKey="irigasi" stackId="1" fill="hsl(152, 60%, 42%)" stroke="hsl(152, 60%, 42%)" fillOpacity={0.8} />
              <Area type="monotone" dataKey="alat" stackId="1" fill="hsl(175, 45%, 40%)" stroke="hsl(175, 45%, 40%)" fillOpacity={0.8} />
              <Area type="monotone" dataKey="tunai" stackId="1" fill="hsl(210, 70%, 45%)" stroke="hsl(210, 70%, 45%)" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Commodity pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-5 shadow-card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribusi Komoditas</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={commodityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {commodityDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {commodityDistribution.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ background: c.fill }} />
                {c.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Province Rankings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl p-5 shadow-card"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Peringkat Potensi Wilayah</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={provinceData.sort((a, b) => b.score - a.score).slice(0, 8)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="hsl(210, 80%, 25%)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Applications Table */}
      {role !== "petani" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Pengajuan Terbaru</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nama</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Provinsi</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Skor</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {farmerApplications.slice(0, 6).map((f) => (
                <tr key={f.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono">{f.id}</td>
                  <td className="py-2.5 px-3 font-medium">{f.name}</td>
                  <td className="py-2.5 px-3">{f.province}</td>
                  <td className="py-2.5 px-3">{f.commodity}</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-semibold ${f.eligibilityScore >= 75 ? "text-success" : f.eligibilityScore >= 50 ? "text-warning" : "text-destructive"}`}>
                      {f.eligibilityScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    rejected: "bg-destructive/10 text-destructive",
    review: "bg-info/10 text-info",
  };
  const labels: Record<string, string> = {
    approved: "Disetujui",
    pending: "Menunggu",
    rejected: "Ditolak",
    review: "Review",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[status] || ""}`}>
      {labels[status] || status}
    </span>
  );
}
