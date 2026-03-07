import { provinceData, farmerApplications, climateData, commodityIdeals } from "@/data/mockData";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Wind, Bug, Leaf, TrendingDown, BarChart3, MapPin } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskAnalysis {
  province: string;
  commodity: string;
  rainfall: number;
  area: number;
  riskPercent: number;
  riskLevel: string;
  temperature: number;
  soilHealth: number;
}

export default function KementerianRiskPredictionPage() {
  // Generate risk analysis data from provinceData, farmerApplications, and climateData
  const riskAnalysisData: RiskAnalysis[] = provinceData.map((prov, idx) => {
    const farmers = farmerApplications.filter((f) => f.province === prov.name);
    const climate = climateData[prov.id as keyof typeof climateData] || { predictedRainNext3: 200, predictedTempNext3: 26, droughtRisk: "medium" };
    
    const avgRainfall = climate.predictedRainNext3;
    const avgTemp = climate.predictedTempNext3;
    const avgSoilHealth = farmers.length > 0 ? farmers.reduce((sum, f) => sum + f.moisture, 0) / farmers.length : 28;

    // Calculate risk percentage based on drought risk and rainfall
    let riskPercent = 0;
    if (climate.droughtRisk === "high") {
      riskPercent = 75 + (avgRainfall < 100 ? 20 : 0);
    } else if (climate.droughtRisk === "medium") {
      riskPercent = 45 + (avgRainfall < 150 ? 15 : 0);
    } else {
      riskPercent = Math.max(0, 25 - (avgRainfall / 20));
    }
    
    riskPercent = Math.min(100, Math.max(0, Math.round(riskPercent)));
    
    // Determine risk level
    let riskLevel = "Rendah";
    if (riskPercent >= 60) riskLevel = "Tinggi";
    else if (riskPercent >= 30) riskLevel = "Sedang";

    return {
      province: prov.name,
      commodity: prov.commodity,
      rainfall: avgRainfall,
      area: prov.area,
      riskPercent: riskPercent,
      riskLevel: riskLevel,
      temperature: avgTemp,
      soilHealth: Math.round(avgSoilHealth),
    };
  });

  // Calculate statistics
  const highRiskProvinces = riskAnalysisData.filter((r) => r.riskLevel === "Tinggi").length;
  const mediumRiskProvinces = riskAnalysisData.filter((r) => r.riskLevel === "Sedang").length;
  const lowRiskProvinces = riskAnalysisData.filter((r) => r.riskLevel === "Rendah").length;
  const totalProduction = provinceData.reduce((sum, p) => sum + p.production, 0);

  // Chart data - Risk distribution
  const riskChartData = riskAnalysisData.map((r) => ({
    name: r.province.substring(0, 12),
    riskPercent: r.riskPercent,
    rainfall: Math.round(r.rainfall / 10),
  }));

  // Chart data - Risk factor radar
  const radarData = [
    { factor: "Curah Hujan", tinggi: 45, sedang: 65, rendah: 85 },
    { factor: "Kekeringan", tinggi: 75, sedang: 55, rendah: 30 },
    { factor: "Hama/Penyakit", tinggi: 65, sedang: 45, rendah: 25 },
    { factor: "Kondisi Tanah", tinggi: 40, sedang: 60, rendah: 80 },
    { factor: "Temperatur", tinggi: 70, sedang: 55, rendah: 45 },
  ];

  // Get risk badge color
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "bg-red-100 text-red-800";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800";
      case "Rendah":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Risk factor data for risk factors panel
  const riskFactors = [
    {
      icon: Droplets,
      title: "Curah Hujan Rendah",
      description: "Daerah dengan curah hujan < 150mm/bulan berisiko tinggi mengalami kekeringan",
      color: "text-blue-500",
    },
    {
      icon: Wind,
      title: "Kekeringan",
      description: "Prediksi kekeringan pada musim kemarau dengan evapotranspirasi tinggi",
      color: "text-orange-500",
    },
    {
      icon: Bug,
      title: "Serangan Hama & Penyakit",
      description: "Kondisi temperatur dan kelembaban tinggi meningkatkan risiko serangan hama",
      color: "text-red-500",
    },
    {
      icon: Leaf,
      title: "Kondisi Tanah Buruk",
      description: "pH tanah tidak optimal dan kandungan organik rendah menurunkan produktivitas",
      color: "text-green-600",
    },
  ];

  // Recommendations
  const recommendations = [
    {
      title: "Implementasi Irigasi Terukur",
      description: "Gunakan sistem irigasi tetes atau sprinkler untuk daerah dengan curah hujan rendah",
      priority: "Tinggi",
    },
    {
      title: "Pemilihan Varietas Tahan Kekeringan",
      description: "Tanam varietas komoditas yang tahan terhadap kekeringan dan iklim ekstrem",
      priority: "Tinggi",
    },
    {
      title: "Pengelolaan Hama Terintegrasi (PHT)",
      description: "Terapkan PHT untuk mengurangi penggunaan pestisida dan meningkatkan efisiensi",
      priority: "Sedang",
    },
    {
      title: "Perbaikan Kesehatan Tanah",
      description: "Lakukan pemupukan berimbang dan penambahan bahan organik secara berkala",
      priority: "Sedang",
    },
    {
      title: "Diversifikasi Komoditas",
      description: "Tanam komoditas alternatif yang lebih cocok dengan kondisi iklim lokal",
      priority: "Sedang",
    },
    {
      title: "Asuransi Pertanian",
      description: "Ikuti program asuransi pertanian untuk melindungi dari risiko gagal panen",
      priority: "Rendah",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Analisis Risiko Pertanian</h1>
        <p className="text-sm text-muted-foreground">Prediksi risiko usaha tani menggunakan model AI berdasarkan data wilayah, cuaca, dan komoditas</p>
      </motion.div>

      {/* Statistik Risiko */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Wilayah Risiko Tinggi</p>
              <p className="text-2xl font-bold mt-2">{highRiskProvinces}</p>
              <p className="text-xs text-red-600 mt-1">Membutuhkan intervensi</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500/50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Wilayah Risiko Sedang</p>
              <p className="text-2xl font-bold mt-2">{mediumRiskProvinces}</p>
              <p className="text-xs text-yellow-600 mt-1">Perlu monitoring</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500/50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Wilayah Risiko Rendah</p>
              <p className="text-2xl font-bold mt-2">{lowRiskProvinces}</p>
              <p className="text-xs text-green-600 mt-1">Kondisi optimal</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500/50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Prediksi Produksi Nasional</p>
              <p className="text-2xl font-bold mt-2">{(totalProduction / 1e6).toFixed(1)}Jt</p>
              <p className="text-xs text-blue-600 mt-1">Ton per tahun</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500/50" />
          </div>
        </Card>
      </motion.div>

      {/* Grafik Risiko */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Distribusi Risiko Per Provinsi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
              />
              <Legend />
              <Bar dataKey="riskPercent" fill="hsl(0, 80%, 60%)" name="Risiko (%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="rainfall" fill="hsl(210, 80%, 60%)" name="Curah Hujan (x10 mm)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Faktor Risiko Usaha Tani</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis />
              <Radar
                name="Risiko Tinggi"
                dataKey="tinggi"
                stroke="hsl(0, 80%, 60%)"
                fill="hsl(0, 80%, 60%)"
                fillOpacity={0.6}
              />
              <Radar
                name="Risiko Sedang"
                dataKey="sedang"
                stroke="hsl(42, 90%, 50%)"
                fill="hsl(42, 90%, 50%)"
                fillOpacity={0.6}
              />
              <Radar
                name="Risiko Rendah"
                dataKey="rendah"
                stroke="hsl(120, 80%, 50%)"
                fill="hsl(120, 80%, 50%)"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Peta Risiko */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-lg p-6 border">
        <h3 className="font-semibold text-foreground mb-4">Peta Risiko Indonesia</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {riskAnalysisData.map((analysis, idx) => {
            const bgColor =
              analysis.riskLevel === "Tinggi"
                ? "bg-red-100 border-red-300"
                : analysis.riskLevel === "Sedang"
                  ? "bg-yellow-100 border-yellow-300"
                  : "bg-green-100 border-green-300";

            const textColor =
              analysis.riskLevel === "Tinggi"
                ? "text-red-800"
                : analysis.riskLevel === "Sedang"
                  ? "text-yellow-800"
                  : "text-green-800";

            return (
              <motion.div
                key={analysis.province}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-lg p-3 border-2 text-center ${bgColor}`}
              >
                <p className={`text-xs font-semibold ${textColor} mb-1`}>{analysis.province}</p>
                <p className={`text-sm font-bold ${textColor}`}>{analysis.riskPercent}%</p>
                <p className={`text-xs ${textColor} opacity-75`}>{analysis.riskLevel}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tabel Analisis Risiko */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-lg p-4 overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-4">Analisis Risiko Per Provinsi</h3>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-muted-foreground">
              <th className="text-left py-2 px-2">Provinsi</th>
              <th className="text-left py-2 px-2">Komoditas</th>
              <th className="text-left py-2 px-2">Curah Hujan (mm)</th>
              <th className="text-left py-2 px-2">Luas Lahan (Ha)</th>
              <th className="text-left py-2 px-2">Temp (°C)</th>
              <th className="text-left py-2 px-2">Kesehatan Tanah (%)</th>
              <th className="text-left py-2 px-2">Risiko Gagal Panen (%)</th>
              <th className="text-left py-2 px-2">Tingkat Risiko</th>
            </tr>
          </thead>
          <tbody>
            {riskAnalysisData.map((analysis, idx) => (
              <motion.tr
                key={analysis.province}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-2 font-medium">{analysis.province}</td>
                <td className="py-3 px-2">{analysis.commodity}</td>
                <td className="py-3 px-2">{analysis.rainfall}</td>
                <td className="py-3 px-2">{analysis.area.toLocaleString("id-ID")}</td>
                <td className="py-3 px-2">{analysis.temperature}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${analysis.soilHealth}%` }}
                      />
                    </div>
                    <span className="text-xs">{analysis.soilHealth}%</span>
                  </div>
                </td>
                <td className="py-3 px-2 font-semibold">{analysis.riskPercent}%</td>
                <td className="py-3 px-2">
                  <Badge className={getRiskColor(analysis.riskLevel)}>
                    {analysis.riskLevel}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Panel Faktor Risiko */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskFactors.map((factor, idx) => {
          const Icon = factor.icon;
          return (
            <motion.div
              key={factor.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className="bg-card rounded-lg p-4 border-l-4 border-primary"
            >
              <div className="flex gap-3">
                <Icon className={`w-6 h-6 flex-shrink-0 ${factor.color}`} />
                <div>
                  <h4 className="font-semibold text-foreground">{factor.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Panel Rekomendasi */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          Rekomendasi Sistem untuk Mengurangi Risiko Pertanian
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => {
            const priorityColor =
              rec.priority === "Tinggi"
                ? "bg-red-100 text-red-800"
                : rec.priority === "Sedang"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800";

            return (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                className="bg-background rounded-lg p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground flex-1">{rec.title}</h4>
                  <Badge className={priorityColor}>{rec.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
