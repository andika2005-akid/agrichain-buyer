import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { plantingRecords, harvestRecords, farmerApplications } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import { Users, FileCheck, CheckCircle2, AlertCircle, FileText, Sprout, Leaf, Clock, XCircle, MapPin, Layers, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinancingRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  komoditas: string;
  jumlahPinjaman: number;
  tenor: number;
  bankName: string;
  tujuanPendanaan: string;
  jenisJaminan: string;
  status: "submitted" | "approved" | "rejected" | "disbursed";
  submissionDate: string;
  createdAt: string;
  history?: Array<{ status: string; date: string; note: string }>;
}

const mockFinancingRequests: FinancingRequest[] = [
  {
    id: "P001",
    farmerId: "F001",
    farmerName: "Ahmad Suryadi",
    komoditas: "Padi",
    jumlahPinjaman: 50000000,
    tenor: 24,
    bankName: "Bank Rakyat Indonesia",
    tujuanPendanaan: "Membeli mesin pengolahan",
    jenisJaminan: "",
    status: "approved",
    submissionDate: "2024-02-10",
    createdAt: "2024-02-10",
    history: [
      { status: "submitted", date: "2024-02-10", note: "Pengajuan diterima" },
      { status: "approved", date: "2024-02-12", note: "Disetujui oleh bank" },
    ],
  },
  {
    id: "P002",
    farmerId: "F003",
    farmerName: "Dewi Sartika",
    komoditas: "Jagung",
    jumlahPinjaman: 35000000,
    tenor: 12,
    bankName: "Bank Mandiri",
    tujuanPendanaan: "Modal tanam musim ini",
    jenisJaminan: "",
    status: "submitted",
    submissionDate: "2024-02-15",
    createdAt: "2024-02-15",
    history: [
      { status: "submitted", date: "2024-02-15", note: "Pengajuan diterima" },
    ],
  },
];

export default function BankKURAnalysisPage() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<FinancingRequest | null>(
    mockFinancingRequests[0]
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [requests, setRequests] = useState<FinancingRequest[]>(mockFinancingRequests);

  const selectedFarmer =
    selectedRequest &&
    farmerApplications.find((f) => f.id === selectedRequest.farmerId);

  // Get data tanam for selected farmer
  const farmerPlantingRecords = selectedRequest
    ? plantingRecords.filter((p) => p.farmerId === selectedRequest.farmerId)
    : [];

  // Get data panen for selected farmer
  const farmerHarvestRecords = selectedRequest
    ? harvestRecords.filter((h) => h.farmerId === selectedRequest.farmerId)
    : [];

  const handleApproveRequest = (id: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "approved",
              history: [
                ...(req.history || []),
                {
                  status: "approved",
                  date: new Date().toLocaleDateString("id-ID"),
                  note: "Disetujui oleh bank",
                },
              ],
            }
          : req
      )
    );
    toast({
      title: "Pengajuan Disetujui",
      description: "Pengajuan KUR telah disetujui dan siap untuk pencairan.",
    });
  };

  const handleDisburseRequest = (id: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "disbursed",
              history: [
                ...(req.history || []),
                {
                  status: "disbursed",
                  date: new Date().toLocaleDateString("id-ID"),
                  note: "Dana berhasil dicairkan",
                },
              ],
            }
          : req
      )
    );
    toast({
      title: "Dana Dicairkan",
      description: "Dana KUR berhasil dicairkan ke rekening petani.",
    });
  };

  const handleRejectRequest = (id: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected",
              history: [
                ...(req.history || []),
                {
                  status: "rejected",
                  date: new Date().toLocaleDateString("id-ID"),
                  note: "Pengajuan ditolak",
                },
              ],
            }
          : req
      )
    );
    toast({
      title: "Pengajuan Ditolak",
      description: "Pengajuan KUR telah ditolak.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-50";
      case "approved":
        return "bg-blue-50";
      case "disbursed":
        return "bg-green-50";
      case "rejected":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case "disbursed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const calculateRiskScore = (farmer: typeof farmerApplications[0] | undefined) => {
    if (!farmer) return 0;
    return farmer.eligibilityScore || 0;
  };

  const getRiskCategory = (score: number) => {
    if (score >= 75) return { label: "Low", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 50) return { label: "Medium", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "High", color: "text-red-600", bg: "bg-red-50" };
  };

  const predictHarvestYield = (farmer: typeof farmerApplications[0] | undefined, komoditas: string) => {
    if (!farmer) return "Data tidak tersedia";
    const baseYield = farmer.area * 5; // Asumsi 5 ton per hektar
    const scoreMultiplier = farmer.eligibilityScore / 100;
    const predictedYield = Math.round(baseYield * scoreMultiplier * 10) / 10;
    return `${predictedYield} ton`;
  };

  // Statistik ringkasan
  const total = requests.length;
  const menunggu = requests.filter(r => r.status === "submitted").length;
  const disetujui = requests.filter(r => r.status === "approved").length;
  const ditolak = requests.filter(r => r.status === "rejected").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Analisis Pengajuan KUR
        </h1>
        <p className="text-sm text-muted-foreground">
          Evaluasi kelayakan kredit petani berdasarkan data usaha tani
        </p>
      </div>

      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Pengajuan"
          value={total}
          icon={<Users className="w-5 h-5" />}
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
          value={disetujui}
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Ditolak"
          value={ditolak}
          icon={<XCircle className="w-5 h-5" />}
          variant="destructive"
        />
      </div>

      {/* Label Pengajuan KUR */}
      <h2 className="text-lg font-bold mb-2">Pengajuan KUR</h2>

      {/* Tabel Pengajuan */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto"
      >
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pengajuan</TableHead>
                <TableHead>Nama Petani</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Luas Lahan</TableHead>
                <TableHead>Jumlah Pinjaman</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => {
                const farmer = farmerApplications.find(f => f.id === req.farmerId);
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono">{req.id}</TableCell>
                    <TableCell>{req.farmerName}</TableCell>
                    <TableCell>{req.komoditas}</TableCell>
                    <TableCell>{farmer ? `${farmer.area} Ha` : '-'}</TableCell>
                    <TableCell>Rp {req.jumlahPinjaman.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{farmer ? (farmer.eligibilityScore >= 75 ? 'Low' : farmer.eligibilityScore >= 50 ? 'Medium' : 'High') : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'submitted' ? 'default' : req.status === 'approved' ? 'outline' : req.status === 'rejected' ? 'destructive' : 'outline'}>
                        {req.status === 'submitted' ? 'Menunggu' : req.status === 'approved' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Dicairkan'}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setDetailModalOpen(true); }}>Detail</Button>
                      {req.status === 'submitted' && (
                        <>
                          <Button size="sm" variant="default" onClick={() => handleApproveRequest(req.id)}>Setujui</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(req.id)}>Tolak</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Detail Pengajuan Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan KUR</DialogTitle>
          </DialogHeader>

          {selectedRequest && selectedFarmer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Data Petani */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> Data Petani
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Nama Petani</p>
                    <p className="text-sm font-semibold text-foreground">{selectedRequest.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lokasi Lahan</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {selectedFarmer.province || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Luas Lahan</p>
                    <p className="text-sm font-semibold text-foreground">{selectedFarmer.area} Ha</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Komoditas</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <Sprout className="w-4 h-4" /> {selectedRequest.komoditas}
                    </p>
                  </div>
                </div>
              </div>

              {/* Riwayat Panen */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Riwayat Panen
                </h3>
                {farmerHarvestRecords && farmerHarvestRecords.length > 0 ? (
                  <div className="pl-6 space-y-3">
                    {farmerHarvestRecords.map((harvest) => (
                      <div key={harvest.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Tanggal Panen</p>
                            <p className="text-sm font-semibold text-foreground">{new Date(harvest.tanggalPanen).toLocaleDateString("id-ID")}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Luas Panen</p>
                            <p className="text-sm font-semibold text-foreground">{harvest.luasPanen} Ha</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Hasil</p>
                            <p className="text-sm font-semibold text-foreground">{harvest.totalHasilPanen.toLocaleString("id-ID")} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Penjualan</p>
                            <p className="text-sm font-semibold text-green-600">Rp {harvest.totalPenjualan.toLocaleString("id-ID")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pl-6">Belum ada riwayat panen</p>
                )}
              </div>

              {/* Informasi Pinjaman */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Informasi Pinjaman
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Jumlah Pinjaman</p>
                    <p className="text-sm font-semibold text-foreground text-green-600">
                      Rp {selectedRequest.jumlahPinjaman.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durasi Pinjaman</p>
                    <p className="text-sm font-semibold text-foreground">{selectedRequest.tenor} bulan</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Tujuan Pinjaman</p>
                    <p className="text-sm font-semibold text-foreground">{selectedRequest.tujuanPendanaan}</p>
                  </div>
                </div>
              </div>

              {/* Analisis Risiko AI */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Analisis Risiko AI
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className="text-2xl font-bold text-foreground">{calculateRiskScore(selectedFarmer)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kategori Risiko</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskCategory(calculateRiskScore(selectedFarmer)).bg} ${getRiskCategory(calculateRiskScore(selectedFarmer)).color}`}>
                      {getRiskCategory(calculateRiskScore(selectedFarmer)).label}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Prediksi Hasil Panen</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      {predictHarvestYield(selectedFarmer, selectedRequest.komoditas)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-bold text-foreground">Status Pengajuan</h3>
                <div className="pl-6">
                  <Badge
                    variant={
                      selectedRequest.status === "submitted"
                        ? "default"
                        : selectedRequest.status === "approved"
                        ? "outline"
                        : selectedRequest.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {selectedRequest.status === "submitted"
                      ? "Menunggu Verifikasi"
                      : selectedRequest.status === "approved"
                      ? "Disetujui"
                      : selectedRequest.status === "rejected"
                      ? "Ditolak"
                      : "Dicairkan"}
                  </Badge>
                </div>
              </div>

              {/* Aksi */}
              <div className="flex gap-2 border-t pt-4">
                {selectedRequest.status === "submitted" && (
                  <>
                    <Button
                      className="flex-1"
                      variant="default"
                      onClick={() => {
                        handleApproveRequest(selectedRequest.id);
                        setDetailModalOpen(false);
                      }}
                    >
                      Setujui Pengajuan
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id);
                        setDetailModalOpen(false);
                      }}
                    >
                      Tolak Pengajuan
                    </Button>
                  </>
                )}
                {selectedRequest.status === "approved" && (
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => {
                      handleDisburseRequest(selectedRequest.id);
                      setDetailModalOpen(false);
                    }}
                  >
                    Cairkan Dana
                  </Button>
                )}
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Tutup
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
