import { useState } from "react";
import { plantingRecords, harvestRecords } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { farmerApplications } from "@/data/mockData";
import { motion } from "framer-motion";
import { fundingProposals } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Download,
  FileText,
  Image,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProposalAnalysis {
  id: string;
  farmerName: string;
  namaUsaha: string;
  lokasi: string;
  lamaUsaha: number;
  komoditas: string;
  luasLahan: number;
  musimTanam: string;
  estimasiPanen: string;
  danaDiminta: number;
  tujuanPendanaan: string;
  estimasiHasilPanen: number;
  estimasiProfit: number;
  roiInvestasi: number;
  skorKelayakan: number;
  faktorPenilaian: string[];
  risikoFaktor: { faktor: string; tingkat: string }[];
}

export default function AnalisisProposalPage() {
  const { toast } = useToast();
    const { role } = useAuth();

  // Mock data fallback jika fundingProposals kosong
  const mockProposalsData = fundingProposals.length > 0 ? fundingProposals : [
    { id: "PROP001", farmer: "Andi Pratama", commodity: "Padi", requestedAmount: 50000000, region: "Jawa Barat", harvestDate: "2026-06-15", notes: "Modal tanam" },
    { id: "PROP002", farmer: "Budi Santoso", commodity: "Jagung", requestedAmount: 35000000, region: "Jawa Tengah", harvestDate: "2026-07-20", notes: "Pembelian bibit" },
    { id: "PROP003", farmer: "Siti Nurhaliza", commodity: "Cabai", requestedAmount: 45000000, region: "Sulawesi Selatan", harvestDate: "2026-08-10", notes: "Modal operasional" },
  ];

  // Transform fundingProposals to analysis format
  const baseProposals: ProposalAnalysis[] = (mockProposalsData as unknown as Array<any>).map((proposal) => {
    // Support both older demo shape and current `fundingProposals` shape
    const farmerName = proposal.farmerName || proposal.farmer || "Petani"
    const requested = proposal.totalFundRequested ?? proposal.totalFundRequested ?? proposal.requestedAmount ?? 0
    const projectedProfit = proposal.projectedProfit ?? proposal.projected_profit ?? (proposal.projected || 0)
    const commodity = proposal.commodity || proposal.commodityType || proposal.commodityName || "N/A"
    const region = proposal.region || proposal.location?.label || proposal.location || "Jawa Barat"

    return {
      id: proposal.id,
      farmerName,
      namaUsaha: `Usaha ${farmerName}`,
      lokasi: region,
      lamaUsaha: 5,
      komoditas: commodity,
      luasLahan: proposal.areaHa ?? proposal.luasLahan ?? 2,
      musimTanam: commodity === "Padi" ? "Musim Hujan" : "Musim Kemarau",
      estimasiPanen: proposal.harvestPeriod ?? proposal.estimasiPanen ?? "3-4 Bulan",
      danaDiminta: requested,
      tujuanPendanaan: proposal.notes || proposal.tujuanPendanaan || "Modal produksi pertanian",
      estimasiHasilPanen: Math.round((requested / 1e6) * 5),
      estimasiProfit: Math.round(projectedProfit || requested * 0.4),
      roiInvestasi: Math.round((projectedProfit || requested * 0.4) / (requested || 1) * 100) || 0,
      skorKelayakan: proposal.skorKelayakan ?? 78,
      faktorPenilaian: proposal.faktorPenilaian ?? [
        "Luas lahan memadai",
        "Pengalaman petani baik",
        "Estimasi hasil panen tinggi",
        "Permintaan pasar stabil",
      ],
      risikoFaktor: proposal.risikoFaktor ?? [
        { faktor: "Cuaca", tingkat: "sedang" },
        { faktor: "Hama", tingkat: "rendah" },
        { faktor: "Harga Pasar", tingkat: "sedang" },
      ],
    }
  });

  // State
  const [selectedProposal, setSelectedProposal] = useState<ProposalAnalysis>(
    baseProposals[0] || {
      id: "N/A",
      farmerName: "Tidak ada proposal",
      namaUsaha: "N/A",
      lokasi: "N/A",
      lamaUsaha: 0,
      komoditas: "N/A",
      luasLahan: 0,
      musimTanam: "N/A",
      estimasiPanen: "N/A",
      danaDiminta: 0,
      tujuanPendanaan: "N/A",
      estimasiHasilPanen: 0,
      estimasiProfit: 0,
      roiInvestasi: 0,
      skorKelayakan: 0,
      faktorPenilaian: [],
      risikoFaktor: [],
    }
  );
  const [catatan, setCatatan] = useState("");
  const [keputusan, setKeputusan] = useState<"setuju" | "tolak" | null>(null);

  // Risk badge color
  const getRiskBadgeColor = (tingkat: string) => {
    const colors: Record<string, string> = {
      rendah: "bg-green-100 text-green-800",
      sedang: "bg-yellow-100 text-yellow-800",
      tinggi: "bg-red-100 text-red-800",
    };
    return colors[tingkat] || "bg-gray-100 text-gray-800";
  };

  const getRiskLabel = (tingkat: string) => {
    const labels: Record<string, string> = {
      rendah: "Rendah",
      sedang: "Sedang",
      tinggi: "Tinggi",
    };
    return labels[tingkat] || tingkat;
  };

  const handleSetujui = () => {
    setKeputusan("setuju");
    toast({
      title: "Investasi Disetujui",
      description: `Proposal dari ${selectedProposal.farmerName} telah disetujui`,
    });
  };

  const handleTolak = () => {
    setKeputusan("tolak");
    toast({
      title: "Proposal Ditolak",
      description: `Proposal dari ${selectedProposal.farmerName} telah ditolak`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Proposal",
      description: `Mengunduh dokumen untuk ${selectedProposal.farmerName}...`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Analisis Proposal
          </h1>
          <p className="text-sm text-muted-foreground">
            Analisis kelayakan investasi dari proposal usaha pertanian
          </p>
        </div>

        {/* Proposal Selector */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Pilih Proposal untuk Dianalisis
          </label>
          <Select
            value={selectedProposal.id}
            onValueChange={(id) => {
              const proposal = baseProposals.find((p) => p.id === id);
              if (proposal) setSelectedProposal(proposal);
            }}
          >
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {baseProposals.map((proposal) => (
                <SelectItem key={proposal.id} value={proposal.id}>
                  {proposal.farmerName} - {proposal.komoditas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* INFORMASI PETANI */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Petani</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Nama Petani</p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.farmerName}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Nama Usaha</p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.namaUsaha}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Lokasi Lahan
                </p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.lokasi}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Lama Usaha</p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.lamaUsaha} Tahun
                </p>
              </div>
            </div>
              {/* Riwayat Tani - Only for investor role */}
              {role === "investor" && (
                <div className="mt-6">
                  <h3 className="text-md font-bold mb-2">Riwayat Tanam & Panen</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-2 py-1">Tanggal Tanam</th>
                          <th className="px-2 py-1">Komoditas</th>
                          <th className="px-2 py-1">Luas Tanam</th>
                          <th className="px-2 py-1">Jenis Benih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const records = plantingRecords
                            .filter((r) => r.farmerName === selectedProposal.farmerName)
                            .sort((a, b) => new Date(b.tanggalTanam).getTime() - new Date(a.tanggalTanam).getTime());
                          const latest = records[0];
                          return latest ? (
                            <tr key={latest.id}>
                              <td className="px-2 py-1">{latest.tanggalTanam}</td>
                              <td className="px-2 py-1">{latest.komoditas}</td>
                              <td className="px-2 py-1">{latest.luasTanam} ha</td>
                              <td className="px-2 py-1">{latest.jenisBenih}</td>
                            </tr>
                          ) : null;
                        })()}
                      </tbody>
                    </table>
                  </div>
                  <div className="overflow-x-auto mt-4">
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </motion.div>

      {/* INFORMASI USAHA PERTANIAN */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Usaha Pertanian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Komoditas</p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.komoditas}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Luas Lahan</p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.luasLahan.toFixed(1)} Hektar
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Musim Tanam</p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.musimTanam}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  Estimasi Waktu Panen
                </p>
                <p className="font-semibold text-foreground">
                  {selectedProposal.estimasiPanen}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* INFORMASI PENDANAAN */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Pendanaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Dana Diminta</p>
                <p className="text-2xl font-bold text-blue-900">
                  Rp {(selectedProposal.danaDiminta.toLocaleString("id-ID"))}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  Tujuan Pendanaan
                </p>
                <p className="font-semibold text-green-900">
                  {selectedProposal.tujuanPendanaan}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  Estimasi Hasil Panen
                </p>
                <p className="text-xl font-bold text-purple-900">
                  {selectedProposal.estimasiHasilPanen} Ton
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  Estimasi Profit
                </p>
                <p className="text-xl font-bold text-orange-900">
                  Rp {(selectedProposal.estimasiProfit.toLocaleString("id-ID"))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ANALISIS KELAYAKAN INVESTASI */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analisis Kelayakan Investasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ROI Section */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">ROI Investasi</p>
                  <p className="text-4xl font-bold">{selectedProposal.roiInvestasi}%</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-70" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Skor Kelayakan</span>
                  <span>{selectedProposal.skorKelayakan}/100</span>
                </div>
                <Progress value={selectedProposal.skorKelayakan} className="bg-white/30" />
              </div>
            </div>

            {/* Faktor Penilaian */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Faktor Penilaian Positif
              </h3>
              <div className="space-y-2">
                {selectedProposal.faktorPenilaian.map((faktor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {faktor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PREDIKSI RISIKO */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prediksi Risiko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faktor Risiko</TableHead>
                    <TableHead>Tingkat Risiko</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProposal.risikoFaktor.map((risiko, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {risiko.faktor}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskBadgeColor(risiko.tingkat)}>
                          {getRiskLabel(risiko.tingkat)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* DOKUMEN PROPOSAL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dokumen Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  toast({
                    title: "Lihat Proposal",
                    description: "Membuka dokumen proposal...",
                  })
                }
              >
                <FileText className="w-4 h-4 mr-2" />
                Lihat Proposal
              </Button>
              <Button variant="outline" className="justify-start" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download Proposal
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  toast({
                    title: "Lihat Foto Lahan",
                    description: "Membuka galeri foto lahan...",
                  })
                }
              >
                <Image className="w-4 h-4 mr-2" />
                Lihat Foto Lahan
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  toast({
                    title: "Lihat Foto Tanaman",
                    description: "Membuka galeri foto tanaman...",
                  })
                }
              >
                <Image className="w-4 h-4 mr-2" />
                Lihat Foto Tanaman
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KEPUTUSAN INVESTOR */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keputusan Investor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Catatan Investor
              </label>
              <Textarea
                placeholder="Tuliskan catatan atau alasan keputusan Anda..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {/* Decision Status */}
            {keputusan && (
              <div
                className={`p-4 rounded-lg ${
                  keputusan === "setuju"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    keputusan === "setuju"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {keputusan === "setuju"
                    ? "✓ Investasi Disetujui"
                    : "✗ Proposal Ditolak"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSetujui}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Setujui Investasi
              </Button>
              <Button
                onClick={handleTolak}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Tolak Proposal
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
