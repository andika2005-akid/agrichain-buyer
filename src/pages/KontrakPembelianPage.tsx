import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { purchaseContracts, marketplaceCommodities } from "@/data/mockData";
import { FileText, MapPin, Calendar, DollarSign, Eye, CheckCircle, Clock, XCircle } from "lucide-react";

export default function KontrakPembelianPage() {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedContract, setSelectedContract] = useState<typeof purchaseContracts[0] | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Calculate statistics
  const totalContracts = purchaseContracts.length;
  const contractsRunning = purchaseContracts.filter((c) => c.status === "Berjalan").length;
  const contractsPending = purchaseContracts.filter((c) => c.status === "Pending").length;
  const contractsCompleted = purchaseContracts.filter((c) => c.status === "Selesai").length;

  // Get unique commodities
  const uniqueCommodities = Array.from(
    new Set(purchaseContracts.map((c) => c.commodity))
  );

  // Filter logic
  const filteredData = useMemo(() => {
    return purchaseContracts.filter((item) => {
      // Search filter
      if (
        searchTerm &&
        !item.farmer.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Commodity filter
      if (selectedCommodity !== "all" && item.commodity !== selectedCommodity) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCommodity, selectedStatus]);

  const handleDetailClick = (contract: typeof purchaseContracts[0]) => {
    setSelectedContract(contract);
    setDetailModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Berjalan":
        return <Clock className="w-4 h-4" />;
      case "Pending":
        return <FileText className="w-4 h-4" />;
      case "Selesai":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Berjalan":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getTimelineStatus = (status: string) => {
    if (status === "Selesai") {
      return [
        { step: "Diajukan", status: "completed", date: "2026-01-15" },
        { step: "Disetujui", status: "completed", date: "2026-01-20" },
        { step: "Sedang Berjalan", status: "completed", date: "2026-02-01" },
        { step: "Selesai", status: "completed", date: "2026-03-08" },
      ];
    } else if (status === "Berjalan") {
      return [
        { step: "Diajukan", status: "completed", date: "2026-01-15" },
        { step: "Disetujui", status: "completed", date: "2026-01-20" },
        { step: "Sedang Berjalan", status: "current", date: "2026-02-01" },
        { step: "Selesai", status: "pending", date: "-" },
      ];
    } else {
      return [
        { step: "Diajukan", status: "completed", date: "2026-01-15" },
        { step: "Disetujui", status: "current", date: "2026-01-20" },
        { step: "Sedang Berjalan", status: "pending", date: "-" },
        { step: "Selesai", status: "pending", date: "-" },
      ];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-display text-foreground">
          Kontrak Pembelian
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola dan monitor semua kontrak pembelian hasil pertanian
        </p>
      </motion.div>

      {/* STATISTIK - 4 Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Kontrak"
          value={totalContracts}
          icon={<FileText className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Kontrak Berjalan"
          value={contractsRunning}
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        />
        <StatCard
          title="Kontrak Pending"
          value={contractsPending}
          icon={<FileText className="w-5 h-5" />}
          variant="accent"
        />
        <StatCard
          title="Kontrak Selesai"
          value={contractsCompleted}
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
      </motion.div>

      {/* FILTER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-5 shadow-card"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Filter Kontrak</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Petani */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Cari Petani / ID Kontrak
            </label>
            <Input
              placeholder="Ketik nama petani atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Filter Komoditas */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Komoditas
            </label>
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Komoditas</SelectItem>
                {uniqueCommodities.map((commodity) => (
                  <SelectItem key={commodity} value={commodity}>
                    {commodity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Status Kontrak
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Berjalan">Berjalan</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredData.length}</span> kontrak ditemukan
            </div>
          </div>
        </div>
      </motion.div>

      {/* TABEL KONTRAK */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl p-5 shadow-card overflow-x-auto"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Daftar Kontrak Pembelian</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">ID Kontrak</th>
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Petani</th>
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Komoditas</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Jumlah</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Harga/Kg</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Total Nilai</th>
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Tanggal Panen</th>
              <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Status</th>
              <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold">{contract.id}</td>
                  <td className="py-2.5 px-3 font-medium">{contract.farmer}</td>
                  <td className="py-2.5 px-3">{contract.commodity}</td>
                  <td className="py-2.5 px-3 text-right">{contract.quantity}</td>
                  <td className="py-2.5 px-3 text-right">
                    Rp {contract.pricePerKg.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-green-600">
                    Rp {contract.totalValue.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">
                    {new Date(contract.harvestDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center justify-center gap-1 w-fit mx-auto ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleDetailClick(contract)}
                      className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1 justify-center"
                    >
                      <Eye className="w-3 h-3" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                  Tidak ada kontrak yang sesuai dengan filter Anda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* DETAIL MODAL */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Detail Kontrak Pembelian</DialogTitle>
          </DialogHeader>

          {selectedContract && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-y-auto flex-1 pr-4 space-y-4"
            >
              {/* Header Info */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-blue-600" />
                      {selectedContract.id}
                    </h3>
                    <p className="text-xs text-muted-foreground">ID Kontrak Pembelian</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(selectedContract.status)}`}>
                    {getStatusIcon(selectedContract.status)}
                    {selectedContract.status}
                  </span>
                </div>
              </div>

              {/* Main Info */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">Petani</p>
                  <p className="font-semibold text-foreground">{selectedContract.farmer}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">Komoditas</p>
                  <p className="font-semibold text-foreground">{selectedContract.commodity}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">Jumlah</p>
                  <p className="font-semibold text-foreground">{selectedContract.quantity}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">Harga per Kg</p>
                  <p className="font-semibold text-green-600">
                    Rp {selectedContract.pricePerKg.toLocaleString("id-ID")}
                  </p>
                </Card>
              </div>

              {/* Value Info */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-muted-foreground mb-2">Total Nilai Kontrak</p>
                <p className="text-3xl font-bold text-blue-600">
                  Rp {selectedContract.totalValue.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Timeline */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-4">Timeline Proses Kontrak</h4>
                <div className="space-y-3">
                  {getTimelineStatus(selectedContract.status).map((timeline, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs ${
                            timeline.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : timeline.status === "current"
                              ? "bg-blue-100 text-blue-800 ring-2 ring-blue-300"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {timeline.status === "completed" ? "✓" : timeline.status === "current" ? "→" : "-"}
                        </div>
                        {idx < getTimelineStatus(selectedContract.status).length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              timeline.status === "completed"
                                ? "bg-green-200"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-foreground">{timeline.step}</p>
                        <p className="text-xs text-muted-foreground">{timeline.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Informasi Panen</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tanggal Panen</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedContract.harvestDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pembeli</p>
                    <p className="font-medium text-foreground">{selectedContract.buyer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 border-t border-border pt-4">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="flex-1 px-4 py-2 border border-border text-foreground text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
            >
              Tutup
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
