import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/StatCard";
import { provinceData, monthlySubsidyData, commodityDistribution, farmerApplications, fraudAlerts, marketplaceCommodities, purchaseContracts, productionMonitoring, purchaseHistory, commodityRecommendations, blockchainRecords, fundingProposals } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LabelList } from "recharts";
import { Legend } from "recharts";
import { Users, Wheat, MapPin, AlertTriangle, TrendingUp, DollarSign, FileText, CheckCircle2, FileCheck2, FileCheck } from "lucide-react";
import { predictCropRisk, RiskInput } from "@/lib/risk";
import { getGoodsDistributionFromAmount } from "@/lib/subsidyDistribution";
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
    // Use fundingProposals from mockData
    const investorProposals = fundingProposals.length > 0 ? fundingProposals.map((proposal) => ({
      id: proposal.id,
      farmerName: proposal.farmerName || "Petani",
      komoditas: proposal.commodity,
      danaDiminta: proposal.totalFundRequested,
      estimasiProfit: proposal.projectedProfit,
      status: proposal.status === "Disetujui investor" ? "disetujui" : proposal.status === "Menunggu review" ? "ditinjau" : "menunggu",
    })) : [
      { id: "P001", farmerName: "Ahmad Suryadi", komoditas: "Padi", danaDiminta: 50000000, estimasiProfit: 20000000, status: "disetujui" },
      { id: "P002", farmerName: "Budi Hartono", komoditas: "Jagung", danaDiminta: 75000000, estimasiProfit: 30000000, status: "ditinjau" },
      { id: "P003", farmerName: "Dewi Sartika", komoditas: "Jagung", danaDiminta: 35000000, estimasiProfit: 14000000, status: "disetujui" },
    ];

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
    const totalPupukTon = monthlySubsidyData.reduce((sum, item) => sum + item.pupuk, 0);
    const totalBenihTon = monthlySubsidyData.reduce((sum, item) => sum + item.benih, 0);
    const totalAlatUnit = monthlySubsidyData.reduce((sum, item) => sum + item.alat, 0);
    const totalIrigasiPaket = monthlySubsidyData.reduce((sum, item) => sum + item.irigasi, 0);
    const totalTunaiPaket = monthlySubsidyData.reduce((sum, item) => sum + item.tunai, 0);
    const fraudDetected = fraudAlerts.length;
    const wilayahRisikoTinggi = provinceData.filter((p) => p.score < 40).length;

    // Data untuk chart penyaluran barang subsidi per bulan
    const subsidyDistribution = monthlySubsidyData.map((item) => ({
      bulan: item.month.substring(0, 3),
      pupuk: item.pupuk,
      benih: item.benih,
      alat: item.alat,
      irigasi: item.irigasi,
    }));

    // Data untuk prediksi risiko per wilayah - dari provinceData
    const riskPredictionData = provinceData.slice(0, 4).map((prov) => ({
      wilayah: prov.name,
      risikoGagalPanen: `${Math.max(0, 100 - prov.score)}%`,
    }));

    // Data untuk blockchain transactions - dari blockchainRecords
    const blockchainData = blockchainRecords.slice(0, 4).map((tx) => ({
      txId: tx.txHash,
      petani: tx.farmer,
      barang: getGoodsDistributionFromAmount(tx.subsidyType, tx.amount).label,
    }));

    // Data untuk notifikasi sistem - dari fraudAlerts dan data kalkulasi
    const duplicateNIKCount = fraudAlerts.filter((f) => f.type === "Duplikasi NIK").length;
    const highRiskCount = provinceData.filter((p) => p.score < 50).length;
    const goodsDistributionPercent = Math.min(
      100,
      Math.round(((totalPupukTon + totalBenihTon) / 50000) * 100)
    );
    
    const systemAlerts = [
      { icon: "⚠️", title: "Duplikasi NIK Terdeteksi", desc: `${duplicateNIKCount} petani dengan NIK ganda ditemukan`, color: "text-red-600" },
      { icon: "🌾", title: "Risiko Gagal Panen Tinggi", desc: `Prediksi gagal panen tinggi di ${highRiskCount} wilayah`, color: "text-orange-600" },
      { icon: "📦", title: "Distribusi Barang Subsidi", desc: `${goodsDistributionPercent}% target distribusi pupuk & benih telah tercapai`, color: "text-yellow-600" },
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
            title="Barang Disalurkan"
            value={`${totalPupukTon.toLocaleString("id-ID")}T Pupuk`}
            subtitle={`${totalBenihTon.toLocaleString("id-ID")}T Benih • ${totalAlatUnit.toLocaleString("id-ID")} Unit Alat • ${totalIrigasiPaket.toLocaleString("id-ID")} Paket Irigasi • ${totalTunaiPaket.toLocaleString("id-ID")} Paket Bantuan`}
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
            <h3 className="text-sm font-semibold text-foreground mb-4">Grafik Penyaluran Barang Subsidi per Bulan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subsidyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number | string, name: string) => {
                  const num = typeof value === "string" ? parseFloat(value) : value;
                  if (name === "alat") return [`${num.toLocaleString("id-ID")} unit`, "Alat"];
                  if (name === "irigasi") return [`${num.toLocaleString("id-ID")} paket`, "Irigasi"];
                  return [`${num.toLocaleString("id-ID")} ton`, name === "pupuk" ? "Pupuk" : "Benih"];
                }} />
                <Legend />
                <Bar dataKey="pupuk" stackId="a" fill="hsl(210, 80%, 35%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="benih" stackId="a" fill="hsl(152, 60%, 42%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="alat" stackId="a" fill="hsl(42, 90%, 55%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="irigasi" stackId="a" fill="hsl(25, 85%, 55%)" radius={[6, 6, 0, 0]} />
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
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Barang Disalurkan</th>
                </tr>
              </thead>
              <tbody>
                {blockchainData.map((tx) => (
                  <tr key={tx.txId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-blue-600">{tx.txId}</td>
                    <td className="py-2.5 px-3 font-medium">{tx.petani}</td>
                    <td className="py-2.5 px-3 text-green-600 font-medium">{tx.barang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    );
  }

  // for standby_buyer role we render a marketplace dashboard
  if (role === "standby_buyer") {
    // Statistik untuk Standby Buyer
    const totalCommodities = marketplaceCommodities.length;
    const activeContracts = purchaseContracts.filter((c) => c.status === "Berjalan").length;
    const totalEstimatedHarvest = marketplaceCommodities.reduce((sum, com) => {
      const harvestQty = parseInt(com.estimatedHarvest.split(" ")[0]);
      return sum + harvestQty * 1000; // Convert ton to kg
    }, 0);
    const totalPurchaseHistory = purchaseHistory.reduce((sum, h) => sum + h.total, 0);

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Dashboard Standby Buyer
          </h1>
          <p className="text-sm text-muted-foreground">
            Marketplace dan monitoring kontrak pembelian hasil pertanian
          </p>
        </div>

        {/* STATISTIK - 4 Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Komoditas Tersedia"
            value={totalCommodities}
            icon={<Wheat className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Kontrak Aktif"
            value={activeContracts}
            icon={<FileCheck className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Estimasi Total Panen"
            value={`${(totalEstimatedHarvest / 1000).toFixed(0)}K Kg`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="accent"
          />
          <StatCard
            title="Riwayat Pembelian"
            value={`Rp ${(totalPurchaseHistory / 1e9).toFixed(1)}M`}
            icon={<DollarSign className="w-5 h-5" />}
            variant="primary"
          />
        </motion.div>

        {/* PREVIEW MARKETPLACE - Tabel Kecil */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Preview Marketplace</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Petani</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Estimasi Panen</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Lokasi</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Harga/Kg</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceCommodities.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{item.farmerName}</td>
                  <td className="py-2.5 px-3">{item.commodity}</td>
                  <td className="py-2.5 px-3">{item.estimatedHarvest}</td>
                  <td className="py-2.5 px-3">{item.location}</td>
                  <td className="py-2.5 px-3 text-right">Rp {item.estimatedPrice.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* KONTRAK AKTIF */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Kontrak Aktif</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID Kontrak</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Petani</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Jumlah</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Total Nilai</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseContracts.map((contract) => (
                <tr key={contract.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-blue-600">{contract.id}</td>
                  <td className="py-2.5 px-3 font-medium">{contract.farmer}</td>
                  <td className="py-2.5 px-3">{contract.commodity}</td>
                  <td className="py-2.5 px-3 text-right">{contract.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-green-600">Rp {contract.totalValue.toLocaleString("id-ID")}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      contract.status === "Berjalan"
                        ? "bg-blue-100 text-blue-800"
                        : contract.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* MONITORING PRODUKSI */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Monitoring Produksi</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Petani</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Komoditas</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Luas Lahan</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tahap Pertumbuhan</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Estimasi Panen</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">Risiko</th>
              </tr>
            </thead>
            <tbody>
              {productionMonitoring.map((prod) => (
                <tr key={prod.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{prod.farmer}</td>
                  <td className="py-2.5 px-3">{prod.commodity}</td>
                  <td className="py-2.5 px-3">{prod.landArea}</td>
                  <td className="py-2.5 px-3">{prod.growthStage}</td>
                  <td className="py-2.5 px-3">{prod.estimatedHarvest}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      prod.riskLevel === "Rendah"
                        ? "bg-green-100 text-green-800"
                        : prod.riskLevel === "Sedang"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {prod.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* REKOMENDASI KOMODITAS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {commodityRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-card border border-blue-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{rec.commodity}</h3>
                  <p className="text-xs text-muted-foreground">Rekomendasi Komoditas</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                  {rec.demandLevel}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Harga Rata-rata</span>
                  <span className="font-semibold text-foreground">Rp {rec.averagePrice.toLocaleString("id-ID")}/Kg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Wilayah Potensial</span>
                  <span className="font-semibold text-foreground">{rec.potentialRegion}</span>
                </div>
              </div>
            </div>
          ))}
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
