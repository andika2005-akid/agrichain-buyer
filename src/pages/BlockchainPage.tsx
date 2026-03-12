import { blockchainRecords, farmerApplications, ongoingSubsidyPrograms } from "@/data/mockData";
import { motion } from "framer-motion";
import { Link2, Shield, TrendingUp, CheckCircle2, Clock, Database, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { getGoodsDistributionFromAmount } from "@/lib/subsidyDistribution";
import { getSubsidyReceiptConfirmationByBlockchainHash } from "@/lib/subsidyReceiptConfirmation";

interface AuditRecord {
  id: string;
  txHash: string;
  farmer: string;
  nik: string;
  province: string;
  programId: string;
  programName: string;
  subsidyType: string;
  amount: number;
  goodsDistribution: string;
  goodsEquivalent: number;
  timestamp: string;
  status: "approved" | "rejected";
  block: number;
  blockHash: string;
  receiptConfirmedAt?: string;
  receiptConfirmedBy?: string;
  proofMethod?: "camera";
}

export default function BlockchainPage() {
  const [selectedProvince, setSelectedProvince] = useState("Semua");
  const [selectedProgram, setSelectedProgram] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedDate, setSelectedDate] = useState("Semua");
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Transform blockchain records and align them with active subsidy programs
  const auditRecords: AuditRecord[] = blockchainRecords.map((record, idx) => {
    const farmer = farmerApplications[idx % farmerApplications.length];
    const matchedProgram =
      ongoingSubsidyPrograms.find((program) => program.smartContract.subsidyType === record.subsidyType) ??
      ongoingSubsidyPrograms[idx % ongoingSubsidyPrograms.length];
    const goods = getGoodsDistributionFromAmount(matchedProgram.smartContract.subsidyType, record.amount);
    const receiptConfirmation = getSubsidyReceiptConfirmationByBlockchainHash(record.txHash);

    return {
      id: `BR${idx + 1}`,
      txHash: record.txHash,
      farmer: record.farmer,
      nik: farmer.nik,
      province: farmer.province,
      programId: matchedProgram.id,
      programName: matchedProgram.name,
      subsidyType: matchedProgram.smartContract.subsidyType,
      amount: record.amount,
      goodsDistribution: goods.label,
      goodsEquivalent: goods.equivalent,
      timestamp: record.timestamp,
      status: record.status === "confirmed" ? "approved" : "rejected",
      block: record.block,
      blockHash: `0x${Math.random().toString(16).substring(2, 10)}`,
      receiptConfirmedAt: receiptConfirmation?.confirmedAt,
      receiptConfirmedBy: receiptConfirmation?.farmerName,
      proofMethod: receiptConfirmation?.proofMethod,
    };
  });

  // Calculate statistics
  const totalTransactions = auditRecords.length;
  const totalDisalurkan = auditRecords.reduce((sum, r) => sum + r.goodsEquivalent, 0);
  const todayTransactions = auditRecords.filter(
    (r) => r.timestamp.startsWith("2024-02")
  ).length;
  const confirmedLogs = auditRecords.filter((r) => r.status === "approved").length;

  // Get unique values for filters
  const provinces = ["Semua", ...Array.from(new Set(auditRecords.map((r) => r.province)))];
  const subsidyPrograms = ["Semua", ...Array.from(new Set(auditRecords.map((r) => r.programName)))];
  const statuses = ["Semua", "approved", "rejected"];
  const dates = ["Semua", ...Array.from(new Set(auditRecords.map((r) => r.timestamp.split(" ")[0])))];

  // Filter records
  const filteredRecords = auditRecords.filter((record) => {
    const provinceMatch = selectedProvince === "Semua" || record.province === selectedProvince;
    const programMatch = selectedProgram === "Semua" || record.programName === selectedProgram;
    const statusMatch = selectedStatus === "Semua" || record.status === selectedStatus;
    const dateMatch = selectedDate === "Semua" || record.timestamp.startsWith(selectedDate);
    return provinceMatch && programMatch && statusMatch && dateMatch;
  });

  // Chart data - distribution by province
  const distributionByProvince = auditRecords.reduce<Array<{ name: string; amount: number }>>((acc, record) => {
    const existing = acc.find((item) => item.name === record.province);
    if (existing) {
      existing.amount += record.goodsEquivalent;
    } else {
      acc.push({ name: record.province, amount: record.goodsEquivalent });
    }
    return acc;
  }, []);

  // Chart data - subsidy type distribution
  const subsidyTypeDistribution = auditRecords.reduce<Array<{ name: string; value: number; fill: string }>>((acc, record) => {
    const existing = acc.find((item) => item.name === record.subsidyType);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ 
        name: record.subsidyType,
        value: 1,
        fill: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    return acc;
  }, []);

  // Status badge color
  const getStatusColor = (status: string) => {
    return status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleViewDetail = (record: AuditRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Audit Transparansi</h1>
        <p className="text-sm text-muted-foreground">Audit trail distribusi subsidi menggunakan blockchain untuk memastikan transparansi</p>
      </motion.div>

      {/* Statistik Distribusi */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="text-2xl font-bold mt-2">{totalTransactions}</p>
            </div>
            <Link2 className="w-8 h-8 text-primary/50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Barang Disalurkan</p>
              <p className="text-2xl font-bold mt-2">{totalDisalurkan.toFixed(1)} ton-ekv</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500/50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
              <p className="text-2xl font-bold mt-2">{todayTransactions}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500/50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Audit Log Tersimpan</p>
              <p className="text-2xl font-bold mt-2">{confirmedLogs}</p>
            </div>
            <Database className="w-8 h-8 text-purple-500/50" />
          </div>
        </Card>
      </motion.div>

      {/* Filter Data */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-foreground">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Provinsi</label>
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Program Subsidi</label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subsidyPrograms.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Semua" ? "Semua" : status === "approved" ? "Disetujui" : "Ditolak"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Tanggal Transaksi</label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Tabel Transaksi */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-lg p-4 overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-4">Audit Log Transaksi</h3>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-muted-foreground">
              <th className="text-left py-2 px-2">Transaction ID</th>
              <th className="text-left py-2 px-2">Nama Petani</th>
              <th className="text-left py-2 px-2">Provinsi</th>
              <th className="text-left py-2 px-2">Program Subsidi</th>
              <th className="text-left py-2 px-2">Barang Disalurkan</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Timestamp</th>
              <th className="text-left py-2 px-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, idx) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-2">
                  <code className="text-xs font-mono text-primary">{record.txHash}</code>
                </td>
                <td className="py-3 px-2 font-medium">{record.farmer}</td>
                <td className="py-3 px-2">{record.province}</td>
                <td className="py-3 px-2">{record.programName}</td>
                <td className="py-3 px-2 font-semibold">{record.goodsDistribution}</td>
                <td className="py-3 px-2">
                  <Badge className={getStatusColor(record.status)}>
                    {record.status === "approved" ? "✓ Disetujui" : "✕ Ditolak"}
                  </Badge>
                </td>
                <td className="py-3 px-2 text-xs">{record.timestamp}</td>
                <td className="py-3 px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetail(record)}
                    className="h-7 text-xs"
                  >
                    Lihat Detail
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada data transaksi yang sesuai dengan filter
          </div>
        )}
      </motion.div>

      {/* Grafik Distribusi Subsidi */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Distribusi Barang Subsidi per Provinsi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionByProvince.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                formatter={(value) => `${(value as number).toFixed(1)} ton-ekv`}
                contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
              />
              <Bar dataKey="amount" fill="hsl(210, 80%, 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Distribusi Jenis Subsidi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subsidyTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {subsidyTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} transaksi`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Panel Informasi Blockchain */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
        <div className="flex gap-4">
          <Shield className="w-12 h-12 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Sistem Audit Berbasis Blockchain</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Setiap transaksi distribusi subsidi dicatat secara permanen dalam blockchain untuk memastikan transparansi dan mencegah fraud. 
              Semua audit log bersifat immutable (tidak dapat diubah) dan dapat diverifikasi oleh publik kapan saja.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Setiap transaksi mendapat hash unik (TX Hash) yang tidak dapat dipalsukan</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Sistem memastikan double-claim tidak mungkin terjadi</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Transparansi penuh: Semua data audit dapat diakses dan diverifikasi</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Modal Detail Transaksi */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Detail Transaksi Blockchain</DialogTitle>
            <DialogDescription>
              Informasi lengkap dan verifikasi audit log transaksi subsidi
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 overflow-y-auto pr-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono text-sm text-primary">{selectedRecord.txHash}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nama Petani</p>
                    <p className="font-semibold">{selectedRecord.farmer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">NIK</p>
                    <p className="font-mono text-sm">{selectedRecord.nik}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Provinsi</p>
                    <p className="font-semibold">{selectedRecord.province}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Program Subsidi</p>
                    <p className="font-semibold">{selectedRecord.programName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedRecord.subsidyType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Barang Disalurkan</p>
                    <p className="font-bold text-sm text-green-600">{selectedRecord.goodsDistribution}</p>
                    <p className="text-xs text-muted-foreground mt-1">Volume: {selectedRecord.goodsEquivalent.toFixed(1)} ton-ekv</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(selectedRecord.status)}>
                      {selectedRecord.status === "approved" ? "✓ Disetujui" : "✕ Ditolak"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Konfirmasi Penerimaan Petani</p>
                  {selectedRecord.receiptConfirmedAt ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-700">
                        Diterima oleh {selectedRecord.receiptConfirmedBy || "petani"} pada {new Date(selectedRecord.receiptConfirmedAt).toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Metode bukti: {selectedRecord.proofMethod ? "Foto Kamera" : "-"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada konfirmasi penerimaan dari petani</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                  <p className="font-semibold">{selectedRecord.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Block Number</p>
                  <p className="font-mono text-sm">#{selectedRecord.block}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Block Hash</p>
                  <p className="font-mono text-sm text-primary">{selectedRecord.blockHash}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
