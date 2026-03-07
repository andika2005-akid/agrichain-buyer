import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { provinceData, climateData, commodityIdeals } from "@/data/mockData";
import { CloudRain, Thermometer, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecommendedCommodity {
  name: string;
  suitabilityScore: number;
  estimatedHarvestTime: string;
  potentialYield: number;
}

const commodityRecommendations: Record<string, RecommendedCommodity> = {
  Padi: {
    name: "Padi",
    suitabilityScore: 90,
    estimatedHarvestTime: "3-4 bulan",
    potentialYield: 5,
  },
  Jagung: {
    name: "Jagung",
    suitabilityScore: 75,
    estimatedHarvestTime: "2-3 bulan",
    potentialYield: 4.5,
  },
  Cabai: {
    name: "Cabai",
    suitabilityScore: 65,
    estimatedHarvestTime: "4-5 bulan",
    potentialYield: 3,
  },
};

const analysisFactors = [
  "Curah hujan tinggi",
  "Suhu stabil",
  "Musim tanam cocok",
  "Risiko gagal panen rendah",
];

const riskPredictions = [
  { commodity: "Padi", riskLevel: "rendah" as const },
  { commodity: "Jagung", riskLevel: "sedang" as const },
  { commodity: "Cabai", riskLevel: "tinggi" as const },
];

export default function RekomendasiKomoditasPage() {
  const { toast } = useToast();
  const [selectedProvince, setSelectedProvince] = useState<number>(provinceData[0].id);

  const selectedProvinceData = provinceData.find((p) => p.id === selectedProvince);
  const climate = climateData[selectedProvince] ?? {
    predictedRainNext3: 200,
    predictedTempNext3: 26,
    predictedSeason: "wet",
    droughtRisk: "low",
    elNinoIndex: -0.2,
  };

  const seasonMap: Record<string, string> = {
    wet: "Musim Hujan",
    dry: "Musim Kemarau",
    neutral: "Musim Sedang",
  };

  const getRainLevel = (rain: number): string => {
    if (rain > 250) return "Tinggi";
    if (rain > 150) return "Sedang";
    return "Rendah";
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      rendah: "bg-green-100 text-green-800",
      sedang: "bg-yellow-100 text-yellow-800",
      tinggi: "bg-red-100 text-red-800",
    };
    return colors[risk] || "bg-gray-100 text-gray-800";
  };

  const handleUseRecommendation = (commodity: string) => {
    toast({
      title: "Rekomendasi Diterima",
      description: `${commodity} telah dipilih sebagai komoditas rekomendasi.`,
    });
  };

  const handleRequestKUR = (commodity: string) => {
    toast({
      title: "Navigasi KUR",
      description: `Buka halaman Pengajuan KUR untuk ${commodity}`,
    });
  };

  const handleRecordPlanting = (commodity: string) => {
    toast({
      title: "Catat Rencana Tanam",
      description: `Rencana tanam ${commodity} telah dicatat.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Rekomendasi Komoditas</h1>
        <p className="text-sm text-muted-foreground">Dapatkan rekomendasi komoditas berdasarkan data iklim dan kondisi lahan Anda.</p>
      </div>

      {/* Lokasi & Filter */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Select value={String(selectedProvince)} onValueChange={(v) => setSelectedProvince(Number(v))}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Pilih Provinsi" />
          </SelectTrigger>
          <SelectContent>
            {provinceData.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* CARD INFORMASI IKLIM */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 shadow-card border border-blue-200">
        <h2 className="text-lg font-semibold mb-4">Informasi Iklim</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Lokasi Lahan</p>
            <p className="text-sm font-medium text-foreground">{selectedProvinceData?.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Musim</p>
            <p className="text-sm font-medium text-foreground">{seasonMap[climate.predictedSeason] || "Sedang"}</p>
          </div>
          <div className="flex items-start gap-2">
            <CloudRain className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Curah Hujan</p>
              <p className="text-sm font-medium text-foreground">{getRainLevel(climate.predictedRainNext3)}</p>
              <p className="text-xs text-muted-foreground">{climate.predictedRainNext3} mm/bulan</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Thermometer className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Suhu Rata-rata</p>
              <p className="text-sm font-medium text-foreground">{climate.predictedTempNext3}°C</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD REKOMENDASI KOMODITAS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Rekomendasi Komoditas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(commodityRecommendations).map((commodity) => (
            <motion.div
              key={commodity.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">{commodity.name}</h3>
              </div>

              {/* Skor Kesesuaian dengan Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Kesesuaian</p>
                  <p className="text-sm font-bold text-primary">{commodity.suitabilityScore}%</p>
                </div>
                <Progress value={commodity.suitabilityScore} className="h-2" />
              </div>

              {/* Info Lainnya */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Estimasi Waktu Panen</p>
                  <p className="text-sm text-foreground">{commodity.estimatedHarvestTime}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Potensi Hasil</p>
                  <p className="text-sm text-foreground">{commodity.potentialYield} ton/hektar</p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="space-y-2 pt-4 border-t">
                <Button onClick={() => handleUseRecommendation(commodity.name)} className="w-full" size="sm">
                  Gunakan Rekomendasi
                </Button>
                <Button onClick={() => handleRequestKUR(commodity.name)} variant="outline" className="w-full" size="sm">
                  Ajukan KUR
                </Button>
                <Button onClick={() => handleRecordPlanting(commodity.name)} variant="ghost" className="w-full" size="sm">
                  Catat Rencana Tanam
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CARD FAKTOR ANALISIS */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-4">Faktor Analisis</h2>
        <div className="space-y-3">
          {analysisFactors.map((factor, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-foreground">{factor}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* TABEL PREDIKSI RISIKO */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-4">Prediksi Risiko Tanaman</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Komoditas</TableHead>
                <TableHead>Tingkat Risiko</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskPredictions.map((prediction) => (
                <TableRow key={prediction.commodity}>
                  <TableCell className="font-medium">{prediction.commodity}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(prediction.riskLevel)}>
                      {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
