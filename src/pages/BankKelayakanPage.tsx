import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { kurApplications, farmerApplications, harvestRecords as mockHarvestRecords, KURApplication } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import { Users, TrendingUp, CheckCircle2, AlertCircle, FileText, Leaf, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisForm {
  kemampuanBayar: number; // 0-100
  produktivitasLahan: number; // 0-100
  risikoUsahaTani: number; // 0-100
  catatan: string;
}

interface KURAnalysisRecord {
  kurId: string;
  analysis: AnalysisForm;
  totalScore: number;
  status: "Layak" | "Dipertimbangkan" | "Tidak Layak";
  analyzedAt: string;
}

const mockAnalyses: KURAnalysisRecord[] = [];

export default function BankKelayakanPage() {
  const { toast } = useToast();
  const [selectedKUR, setSelectedKUR] = useState<KURApplication | null>(null);
  const [analyses, setAnalyses] = useState<KURAnalysisRecord[]>(mockAnalyses);
  const [analysisForm, setAnalysisForm] = useState<AnalysisForm>({
    kemampuanBayar: 50,
    produktivitasLahan: 50,
    risikoUsahaTani: 50,
    catatan: "",
  });

  const getKURListForAnalysis = () => {
    return kurApplications || [];
  };

  const getSelectedFarmer = () => {
    if (!selectedKUR) return null;
    return farmerApplications?.find((f) => f.id === selectedKUR.farmerId);
  };

  const getFarmerHarvestRecords = () => {
    if (!selectedKUR) return [];
    return mockHarvestRecords?.filter((h) => h.farmerId === selectedKUR.farmerId) || [];
  };

  const calculateTotalScore = (form: AnalysisForm): number => {
    return Math.round((form.kemampuanBayar + form.produktivitasLahan + form.risikoUsahaTani) / 3);
  };

  const getKelayakanStatus = (score: number): "Layak" | "Dipertimbangkan" | "Tidak Layak" => {
    if (score >= 75) return "Layak";
    if (score >= 50) return "Dipertimbangkan";
    return "Tidak Layak";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Layak":
        return { bg: "bg-green-50", text: "text-green-700", badge: "default" as const };
      case "Dipertimbangkan":
        return { bg: "bg-yellow-50", text: "text-yellow-700", badge: "secondary" as const };
      case "Tidak Layak":
        return { bg: "bg-red-50", text: "text-red-700", badge: "destructive" as const };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", badge: "outline" as const };
    }
  };

  const handleSaveAnalysis = () => {
    if (!selectedKUR) return;

    const totalScore = calculateTotalScore(analysisForm);
    const status = getKelayakanStatus(totalScore);

    const newAnalysis: KURAnalysisRecord = {
      kurId: selectedKUR.id,
      analysis: analysisForm,
      totalScore,
      status,
      analyzedAt: new Date().toLocaleDateString("id-ID"),
    };

    setAnalyses([...analyses.filter((a) => a.kurId !== selectedKUR.id), newAnalysis]);
    toast({
      title: "Analisis Disimpan",
      description: `Analisis kelayakan untuk ${selectedKUR.farmerName} telah disimpan.`,
    });
  };

  const existingAnalysis = selectedKUR ? analyses.find((a) => a.kurId === selectedKUR.id) : null;
  const selectedFarmer = getSelectedFarmer();
  const farmerHarvests = getFarmerHarvestRecords();
  const kurList = getKURListForAnalysis();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Analisis Kelayakan KUR
        </h1>
        <p className="text-sm text-muted-foreground">
          Analisis kelayakan pengajuan KUR berdasarkan data petani, riwayat panen, dan risiko usaha tani
        </p>
      </div>

      {/* Layout dua kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Daftar KUR */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-4 text-foreground">Daftar Pengajuan KUR</h3>
            <div className="space-y-2 max-h-[700px] overflow-y-auto">
              {kurList.length === 0 ? (
                <p className="text-xs text-muted-foreground">Tidak ada pengajuan KUR</p>
              ) : (
                kurList.map((kur) => {
                  const analysis = analyses.find((a) => a.kurId === kur.id);
                  return (
                    <button
                      key={kur.id}
                      onClick={() => {
                        setSelectedKUR(kur);
                        if (analysis) {
                          setAnalysisForm(analysis.analysis);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        selectedKUR?.id === kur.id
                          ? "ring-2 ring-primary bg-primary/10 border-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground truncate">
                        {kur.farmerName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{kur.komoditas}</p>
                      {analysis && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-accent">{analysis.totalScore}%</span>
                          <Badge variant={getStatusColor(analysis.status).badge} className="text-[9px]">
                            {analysis.status}
                          </Badge>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </motion.div>

        {/* Kolom Kanan: Detail dan Analisis */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {selectedKUR && selectedFarmer ? (
            <div className="space-y-6">
              {/* 1. Data Pengajuan KUR */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Data Pengajuan KUR
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Nama Petani</p>
                    <p className="text-sm font-semibold">{selectedKUR.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Luas Lahan</p>
                    <p className="text-sm font-semibold">{selectedFarmer.area} Ha</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Jenis Tanaman</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Leaf className="w-4 h-4" /> {selectedKUR.komoditas}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Jumlah Pinjaman</p>
                    <p className="text-sm font-semibold text-green-600">
                      Rp {selectedKUR.jumlahPinjaman.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Estimasi Hasil Panen</p>
                    <p className="text-sm font-semibold">
                      {Math.round(selectedFarmer.area * 5)} ton (asumsi {selectedFarmer.area} Ha × 5 ton/Ha)
                    </p>
                  </div>
                </div>
              </Card>

              {/* 2. Riwayat Hasil Panen */}
              {farmerHarvests.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Riwayat Hasil Panen
                  </h2>
                  <div className="space-y-3">
                    {farmerHarvests.map((harvest) => (
                      <div
                        key={harvest.id}
                        className="bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Tanggal Panen</p>
                            <p className="text-sm font-semibold">
                              {new Date(harvest.tanggalPanen).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Hasil</p>
                            <p className="text-sm font-semibold">{harvest.totalHasilPanen.toLocaleString("id-ID")} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Harga Jual</p>
                            <p className="text-sm font-semibold">Rp {harvest.hargaJual.toLocaleString("id-ID")}/kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Penjualan</p>
                            <p className="text-sm font-semibold text-green-600">
                              Rp {harvest.totalPenjualan.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 3. Form Analisis Kelayakan */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Form Analisis Kelayakan
                </h2>
                <div className="space-y-6">
                  {/* Kemampuan Bayar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Analisis Kemampuan Bayar</label>
                      <span className="text-sm font-bold text-accent">{analysisForm.kemampuanBayar}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={analysisForm.kemampuanBayar}
                      onChange={(e) =>
                        setAnalysisForm({
                          ...analysisForm,
                          kemampuanBayar: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Evaluasi kemampuan petani membayar pinjaman berdasarkan riwayat pendapatan
                    </p>
                  </div>

                  {/* Produktivitas Lahan */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Analisis Produktivitas Lahan</label>
                      <span className="text-sm font-bold text-accent">{analysisForm.produktivitasLahan}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={analysisForm.produktivitasLahan}
                      onChange={(e) =>
                        setAnalysisForm({
                          ...analysisForm,
                          produktivitasLahan: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Evaluasi kualitas lahan dan potensi hasil panen berdasarkan data agronomis
                    </p>
                  </div>

                  {/* Risiko Usaha Tani */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Analisis Risiko Usaha Tani</label>
                      <span className="text-sm font-bold text-accent">{analysisForm.risikoUsahaTani}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={analysisForm.risikoUsahaTani}
                      onChange={(e) =>
                        setAnalysisForm({
                          ...analysisForm,
                          risikoUsahaTani: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Evaluasi risiko iklim, hama, dan faktor eksternal lainnya (semakin tinggi = risiko lebih rendah)
                    </p>
                  </div>

                  {/* Catatan Analis */}
                  <div>
                    <label className="text-sm font-semibold block mb-2">Catatan Analis</label>
                    <textarea
                      value={analysisForm.catatan}
                      onChange={(e) =>
                        setAnalysisForm({
                          ...analysisForm,
                          catatan: e.target.value,
                        })
                      }
                      placeholder="Masukkan catatan atau observasi penting..."
                      className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              {/* 4. Sistem Penilaian */}
              <Card
                className={`p-6 ${getStatusColor(getKelayakanStatus(calculateTotalScore(analysisForm))).bg}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Target className="w-5 h-5" /> Hasil Penilaian
                  </h2>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-accent">
                      {calculateTotalScore(analysisForm)}
                    </div>
                    <p className="text-xs text-muted-foreground">Skor Kelayakan (0-100)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Kemampuan Bayar</p>
                    <p className="text-sm font-semibold">{analysisForm.kemampuanBayar}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Produktivitas Lahan</p>
                    <p className="text-sm font-semibold">{analysisForm.produktivitasLahan}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Risiko Usaha Tani</p>
                    <p className="text-sm font-semibold">{analysisForm.risikoUsahaTani}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status Kelayakan</p>
                    <Badge
                      variant={getStatusColor(getKelayakanStatus(calculateTotalScore(analysisForm))).badge}
                    >
                      {getKelayakanStatus(calculateTotalScore(analysisForm))}
                    </Badge>
                  </div>
                </div>

                <div className="bg-white/50 border border-border rounded-lg p-3 text-xs text-muted-foreground mb-4">
                  <p>
                    <strong>Interpretasi Status:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• <strong>Layak (≥75)</strong>: Pengajuan memenuhi kriteria dan direkomendasikan untuk disetujui</li>
                    <li>• <strong>Dipertimbangkan (50-74)</strong>: Pengajuan memiliki potensi namun perlu verifikasi lebih lanjut</li>
                    <li>• <strong>Tidak Layak (&lt;50)</strong>: Pengajuan tidak memenuhi kriteria kelayakan</li>
                  </ul>
                </div>

                <Button
                  onClick={handleSaveAnalysis}
                  className="w-full"
                  variant="default"
                >
                  Simpan Analisis
                </Button>

                {existingAnalysis && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Terakhir dianalisis: {existingAnalysis.analyzedAt}
                  </p>
                )}
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pilih pengajuan KUR untuk melakukan analisis kelayakan</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
