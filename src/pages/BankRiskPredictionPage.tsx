import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { farmerApplications, plantingRecords, harvestRecords as mockHarvestRecords, provinceData, climateData, commodityIdeals } from "@/data/mockData";
import { predictCropRisk, RiskInput, RiskResult } from "@/lib/risk";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, TrendingUp, CheckCircle2, AlertCircle, Leaf, MapPin, Activity } from "lucide-react";

export default function RiskPredictionPage() {
  const { role } = useAuth();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  // run prediction for each farmer record
  const predictions = farmerApplications.map((f) => {
    const farmer = f as typeof farmerApplications[0] & {
      soilType?: string;
      soilPH?: number;
      moisture?: number;
      historicalRain?: number;
      predictedTemp3m?: number;
    };
    const input: RiskInput = {
      soilType: farmer.soilType || "alluvial",
      soilPH: farmer.soilPH || 6.5,
      moisture: farmer.moisture || 30,
      historicalRain: farmer.historicalRain || 200,
      predictedTemp3m: farmer.predictedTemp3m || 26,
      cropType: f.commodity,
      area: f.area,
    };
    return { farmer: f, result: predictCropRisk(input) };
  });

  const selectedPrediction = selectedFarmerId
    ? predictions.find((p) => p.farmer.id === selectedFarmerId)
    : predictions[0];

  const selectedFarmer = selectedPrediction?.farmer;
  const riskResult = selectedPrediction?.result;

  // Get planting and harvest records for selected farmer
  const farmerPlanting = selectedFarmer
    ? plantingRecords?.filter((p) => p.farmerId === selectedFarmer.id) || []
    : [];

  const farmerHarvests = selectedFarmer
    ? mockHarvestRecords?.filter((h) => h.farmerId === selectedFarmer.id) || []
    : [];

  // Combine planting and harvest data for history table
  const farmingHistory = farmerPlanting.map((p) => {
    const harvest = farmerHarvests.find((h) => h.komoditas === p.komoditas);
    return {
      tahun: new Date(p.tanggalTanam).getFullYear(),
      komoditas: p.komoditas,
      luasLahan: p.luasTanam,
      hasilPanen: harvest?.totalHasilPanen || 0,
      pendapatan: harvest?.totalPenjualan || 0,
    };
  });

  // Risk factors analysis
  const getRiskFactors = () => {
    if (!riskResult) return [];
    return [
      { name: "Risiko Cuaca", value: 40, level: "Sedang" },
      { name: "Risiko Hama", value: 30, level: "Rendah" },
      { name: "Risiko Produksi", value: riskResult.riskScore, level: riskResult.riskLevel },
      { name: "Risiko Pasar", value: 45, level: "Sedang" },
    ];
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { label: "Rendah", color: "bg-green-500", badge: "default" as const };
    if (score <= 60) return { label: "Sedang", color: "bg-yellow-500", badge: "secondary" as const };
    return { label: "Tinggi", color: "bg-red-500", badge: "destructive" as const };
  };

  const getRecommendation = (score: number) => {
    if (score <= 30) return { label: "Layak Didanai", color: "bg-green-50", icon: CheckCircle2 };
    if (score <= 60) return { label: "Layak dengan Pengawasan", color: "bg-yellow-50", icon: AlertCircle };
    return { label: "Tidak Direkomendasikan", color: "bg-red-50", icon: AlertTriangle };
  };

  // Chart data for failure probability
  const failureChartData = [
    { month: "Bulan 1", probability: 5, risk: 20 },
    { month: "Bulan 2", probability: 8, risk: 25 },
    { month: "Bulan 3", probability: 15, risk: 35 },
    { month: "Bulan 4", probability: 28, risk: 45 },
  ];

  // Risk factors chart
  const riskFactorsChart = getRiskFactors();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Prediksi Risiko Pertanian AI
        </h1>
        <p className="text-sm text-muted-foreground">
          Analisis risiko usaha tani menggunakan model AI untuk memprediksi kemungkinan gagal panen
        </p>
      </div>

      {/* Selector untuk petani */}
      {(role === "bank" || role === "investor" || role === "kementerian") && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Pilih Petani untuk Analisis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {predictions.map(({ farmer }) => (
              <button
                key={farmer.id}
                onClick={() => setSelectedFarmerId(farmer.id)}
                className={`p-2 rounded-lg border transition text-xs font-medium ${
                  selectedFarmerId === farmer.id
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                {farmer.name}
              </button>
            ))}
          </div>
        </Card>
      )}

      {selectedFarmer && riskResult && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 1. Informasi Petani */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5" /> Informasi Petani
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Nama Petani</p>
                <p className="text-sm font-semibold">{selectedFarmer.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lokasi Lahan</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {selectedFarmer.province}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Luas Lahan</p>
                <p className="text-sm font-semibold">{selectedFarmer.area} Ha</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jenis Tanaman</p>
                <p className="text-sm font-semibold">{selectedFarmer.commodity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Musim Tanam</p>
                <p className="text-sm font-semibold">Musim Hujan 2024</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tipe Tanah</p>
                <p className="text-sm font-semibold">
                  {selectedFarmer && (selectedFarmer as typeof farmerApplications[0] & { soilType?: string }).soilType ? (selectedFarmer as typeof farmerApplications[0] & { soilType?: string }).soilType : "Tidak diketahui"}
                </p>
              </div>
            </div>
          </Card>

          {/* 2. Riwayat Tanam dan Panen */}
          {farmingHistory.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Riwayat Tanam dan Panen
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Tahun</th>
                      <th className="text-left p-3">Komoditas</th>
                      <th className="text-left p-3">Luas Lahan</th>
                      <th className="text-left p-3">Hasil Panen (kg)</th>
                      <th className="text-left p-3">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmingHistory.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-3">{item.tahun}</td>
                        <td className="p-3 font-semibold">{item.komoditas}</td>
                        <td className="p-3">{item.luasLahan} Ha</td>
                        <td className="p-3">{item.hasilPanen.toLocaleString("id-ID")}</td>
                        <td className="p-3 text-green-600 font-semibold">
                          Rp {item.pendapatan.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* 3. Analisis Risiko AI */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Analisis Risiko AI
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Faktor Risiko</th>
                    <th className="text-center p-3">Skor</th>
                    <th className="text-center p-3">Kategori</th>
                  </tr>
                </thead>
                <tbody>
                  {riskFactorsChart.map((factor, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-semibold">{factor.name}</td>
                      <td className="p-3 text-center">
                        <span className="font-bold">{factor.value}</span>
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            factor.level === "Rendah"
                              ? "default"
                              : factor.level === "Sedang"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {factor.level}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 4. Skor Risiko */}
          <Card className={`p-6 ${getRiskLevel(riskResult.riskScore).color}/10`}>
            <h2 className="text-lg font-bold mb-4">Skor Risiko</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Risk Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-accent">{riskResult.riskScore}</span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Kategori Risiko</p>
                <Badge variant={getRiskLevel(riskResult.riskScore).badge} className="text-base px-3 py-1">
                  {getRiskLevel(riskResult.riskScore).label}
                </Badge>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg text-xs text-muted-foreground">
              <p>
                <strong>Interpretasi:</strong> 0–30 = Risiko Rendah | 31–60 = Risiko Sedang | 61–100 = Risiko Tinggi
              </p>
            </div>
          </Card>

          {/* 5. Rekomendasi Sistem */}
          <Card className={`p-6 ${getRecommendation(riskResult.riskScore).color}`}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Rekomendasi Sistem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/50">
                <p className="text-xs text-muted-foreground mb-2">Status Rekomendasi</p>
                <p className="text-lg font-bold text-foreground">
                  {getRecommendation(riskResult.riskScore).label}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50">
                <p className="text-xs text-muted-foreground mb-2">Probabilitas Gagal Panen</p>
                <p className="text-lg font-bold text-accent">
                  {(riskResult.probability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50">
                <p className="text-xs text-muted-foreground mb-2">Confidence Score</p>
                <p className="text-lg font-bold text-accent">
                  {(riskResult.probability * 100 + 20).toFixed(0)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Rekomendasi Detail:</p>
              <ul className="space-y-2 text-sm">
                {riskResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* 6. Grafik Prediksi Risiko */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grafik Kemungkinan Gagal Panen */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Grafik Kemungkinan Gagal Panen</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={failureChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="probability"
                    stroke="#ef4444"
                    name="Probabilitas Gagal (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Grafik Perbandingan Faktor Risiko */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Perbandingan Faktor Risiko</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskFactorsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" name="Skor Risiko" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
