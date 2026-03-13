import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Users, DollarSign, CheckCircle2, Calendar, FileText, Eye } from "lucide-react";

interface BuyerContract {
  contractId: string;
  buyerName: string;
  commodity: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  status: "aktif" | "selesai" | "dibatalkan";
  startDate: string;
  endDate: string;
  deliveryStatus: string;
  contactBuyer?: string;
}

// Mock data - filter kontrak berdasarkan petani yang login
// Dalam real app, ini akan dari database berdasarkan petani yang login
const mockBuyerContracts: BuyerContract[] = [
  {
    contractId: "KNT-001",
    buyerName: "PT. Agro Jaya Indonesia",
    commodity: "Padi",
    quantity: 50,
    pricePerUnit: 7500000,
    totalValue: 375000000,
    status: "aktif",
    startDate: "2026-01-15",
    endDate: "2026-06-30",
    deliveryStatus: "Berjalan",
    contactBuyer: "Ir. Bambang Kusuma (0812-3456-7890)",
  },
  {
    contractId: "KNT-002",
    buyerName: "CV. Mitra Tani Sukses",
    commodity: "Padi",
    quantity: 30,
    pricePerUnit: 7200000,
    totalValue: 216000000,
    status: "aktif",
    startDate: "2026-02-01",
    endDate: "2026-05-30",
    deliveryStatus: "Akan dimulai",
    contactBuyer: "Budi Santoso (0813-2345-6789)",
  },
  {
    contractId: "KNT-003",
    buyerName: "PT. Pertanian Maju",
    commodity: "Padi",
    quantity: 25,
    pricePerUnit: 7400000,
    totalValue: 185000000,
    status: "selesai",
    startDate: "2025-10-15",
    endDate: "2025-12-31",
    deliveryStatus: "Selesai",
    contactBuyer: "Siti Nurhaliza (0811-9876-5432)",
  },
  {
    contractId: "KNT-004",
    buyerName: "Koperasi Tani Maju",
    commodity: "Padi",
    quantity: 40,
    pricePerUnit: 7300000,
    totalValue: 292000000,
    status: "aktif",
    startDate: "2026-01-20",
    endDate: "2026-07-31",
    deliveryStatus: "Berjalan",
    contactBuyer: "Ahmad Hidayat (0815-5555-5555)",
  },
];

export default function DaftarBuyerKontrakPage() {
  const { role, userName } = useAuth();
  const [searchBuyer, setSearchBuyer] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [filterCommodity, setFilterCommodity] = useState("semua");
  const [selectedContract, setSelectedContract] = useState<BuyerContract | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Calculate statistics
  const totalContracts = mockBuyerContracts.length;
  const activeContracts = mockBuyerContracts.filter((c) => c.status === "aktif").length;
  const totalContractValue = mockBuyerContracts.reduce((sum, c) => sum + c.totalValue, 0);
  const completedContracts = mockBuyerContracts.filter((c) => c.status === "selesai").length;

  // Filter data
  const filteredContracts = useMemo(() => {
    return mockBuyerContracts.filter((contract) => {
      const matchSearch = contract.buyerName.toLowerCase().includes(searchBuyer.toLowerCase());
      const matchStatus = filterStatus === "semua" || contract.status === filterStatus;
      const matchCommodity = filterCommodity === "semua" || contract.commodity === filterCommodity;
      return matchSearch && matchStatus && matchCommodity;
    });
  }, [searchBuyer, filterStatus, filterCommodity]);

  // Get unique commodities
  const commodities = Array.from(new Set(mockBuyerContracts.map((c) => c.commodity)));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      aktif: { bg: "bg-green-100", text: "text-green-700", label: "Aktif" },
      selesai: { bg: "bg-blue-100", text: "text-blue-700", label: "Selesai" },
      dibatalkan: { bg: "bg-red-100", text: "text-red-700", label: "Dibatalkan" },
    };
    const style = variants[status] || variants.aktif;
    return <Badge className={`${style.bg} ${style.text}`}>{style.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daftar Buyer Kontrak</h1>
          <p className="text-sm text-muted-foreground">
            Lihat daftar buyer yang telah mengontrak hasil pertanian Anda
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Kontrak"
          value={totalContracts}
          icon={<FileText className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Kontrak Aktif"
          value={activeContracts}
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Selesai"
          value={completedContracts}
          icon={<Users className="w-5 h-5" />}
          variant="accent"
        />
        <StatCard
          title="Total Nilai Kontrak"
          value={formatCurrency(totalContractValue)}
          subtitle="Seluruh periode"
          icon={<DollarSign className="w-5 h-5" />}
          variant="primary"
        />
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="text-xs font-semibold text-foreground/70 mb-2 block">Cari Nama Buyer</label>
          <Input
            placeholder="Nama buyer..."
            value={searchBuyer}
            onChange={(e) => setSearchBuyer(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-48">
          <label className="text-xs font-semibold text-foreground/70 mb-2 block">Status</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
              <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <label className="text-xs font-semibold text-foreground/70 mb-2 block">Komoditas</label>
          <Select value={filterCommodity} onValueChange={setFilterCommodity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Komoditas</SelectItem>
              {commodities.map((commodity) => (
                <SelectItem key={commodity} value={commodity}>
                  {commodity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Contracts Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kontrak Buyer</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContracts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada kontrak yang sesuai dengan filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Kontrak</TableHead>
                      <TableHead>Nama Buyer</TableHead>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Kuantitas</TableHead>
                      <TableHead>Harga/Unit</TableHead>
                      <TableHead>Total Nilai</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow key={contract.contractId}>
                        <TableCell className="font-mono text-xs font-semibold">
                          {contract.contractId}
                        </TableCell>
                        <TableCell className="font-medium">{contract.buyerName}</TableCell>
                        <TableCell>{contract.commodity}</TableCell>
                        <TableCell>{contract.quantity} ton</TableCell>
                        <TableCell>{formatCurrency(contract.pricePerUnit)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(contract.totalValue)}</TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedContract(contract);
                              setIsDetailOpen(true);
                            }}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Kontrak</DialogTitle>
            <DialogDescription>Informasi lengkap kontrak pembelian dengan buyer</DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              {/* Informasi Buyer */}
              <div className="bg-accent/10 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Informasi Buyer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Nama Buyer</p>
                    <p className="font-semibold">{selectedContract.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ID Kontrak</p>
                    <p className="font-mono text-sm font-semibold">{selectedContract.contractId}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Kontak Buyer</p>
                    <p className="font-semibold">{selectedContract.contactBuyer}</p>
                  </div>
                </div>
              </div>

              {/* Detail Komoditas & Harga */}
              <div className="bg-primary/10 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Detail Pembelian</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Komoditas</p>
                    <p className="font-semibold">{selectedContract.commodity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kuantitas</p>
                    <p className="font-semibold">{selectedContract.quantity} ton</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Harga per Unit</p>
                    <p className="font-semibold">{formatCurrency(selectedContract.pricePerUnit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Nilai Kontrak</p>
                    <p className="font-semibold text-accent">{formatCurrency(selectedContract.totalValue)}</p>
                  </div>
                </div>
              </div>

              {/* Periode & Status */}
              <div className="bg-warning/10 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Periode & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Tanggal Mulai</p>
                    <p className="font-semibold">{selectedContract.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tanggal Berakhir</p>
                    <p className="font-semibold">{selectedContract.endDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status Kontrak</p>
                    <div className="mt-1">{getStatusBadge(selectedContract.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status Pengiriman</p>
                    <p className="font-semibold text-sm">{selectedContract.deliveryStatus}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Tutup
                </Button>
                {selectedContract.status === "aktif" && (
                  <>
                    <Button variant="outline" className="gap-1">
                      📞 Hubungi Buyer
                    </Button>
                    <Button className="gap-1">
                      ✓ Upload Bukti Pengiriman
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
