import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fraudAlerts, farmerApplications } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  ShieldAlert,
  User,
  MapPin,
  Eye,
  TrendingUp,
} from "lucide-react";

interface FraudCase {
  id: string;
  namaPetani: string;
  nik: string;
  provinsi: string;
  jenisFraud: "Duplikasi NIK" | "Lahan Tidak Valid" | "Pengajuan Ganda" | "Data Palsu" | "Pola Distribusi Abnormal" | "Lahan Tidak Wajar";
  tingkatRisiko: "Tinggi" | "Sedang" | "Rendah";
  status: "Terdeteksi" | "Verifikasi" | "Ditolak";
  tanggalDeteksi: string;
  lokasiLahan: string;
  penjelasanSistem: string;
  riwayatPengajuan: string[];
}

// Transform fraudAlerts dari mockData dan combine dengan farmerApplications
const fraudCases: FraudCase[] = fraudAlerts.map((alert, idx) => {
  const farmer = farmerApplications[idx % farmerApplications.length];
  const riskSeverity = alert.severity === "critical" ? "Tinggi" : "Sedang";
  const fraudTypeMap: Record<string, FraudCase["jenisFraud"]> = {
    "Duplikasi NIK": "Duplikasi NIK",
    "Lahan Tidak Valid": "Lahan Tidak Valid",
    "Lahan Tidak Wajar": "Lahan Tidak Wajar",
    "Pengajuan Massal": "Pengajuan Ganda",
    "Pola Distribusi Abnormal": "Pola Distribusi Abnormal",
    "Data Palsu": "Data Palsu",
  };
  const fraudType = fraudTypeMap[alert.type] || "Data Palsu";
  
  return {
    id: `FRAUD${String(idx + 1).padStart(3, "0")}`,
    namaPetani: farmer.name,
    nik: farmer.nik,
    provinsi: farmer.province,
    jenisFraud: fraudType,
    tingkatRisiko: riskSeverity,
    status: alert.status === "blocked" ? "Ditolak" : alert.status === "investigating" ? "Verifikasi" : "Terdeteksi",
    tanggalDeteksi: alert.date,
    lokasiLahan: farmer.address,
    penjelasanSistem: alert.description,
    riwayatPengajuan: [`${farmer.id} (${farmer.commodity})`],
  };
});

// Generate chart data dari fraudCases yang sudah di-transform
const fraudChartData = fraudCases.reduce<Array<{ provinsi: string; count: number }>>((acc, cas) => {
  const existing = acc.find((item) => item.provinsi === cas.provinsi);
  if (existing) {
    existing.count++;
  } else {
    acc.push({ provinsi: cas.provinsi, count: 1 });
  }
  return acc;
}, []);

export default function FraudDetectionPage() {
  const [filterProvinsi, setFilterProvinsi] = useState("Semua");
  const [filterJenisFraud, setFilterJenisFraud] = useState("Semua");
  const [filterTingkatRisiko, setFilterTingkatRisiko] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Get unique values for filters
  const uniqueProvinces = ["Semua", ...Array.from(new Set(fraudCases.map((f) => f.provinsi)))];
  const uniqueJenisFraud = ["Semua", ...Array.from(new Set(fraudCases.map((f) => f.jenisFraud)))];
  const uniqueTingkatRisiko = ["Semua", ...Array.from(new Set(fraudCases.map((f) => f.tingkatRisiko)))];
  const uniqueStatus = ["Semua", ...Array.from(new Set(fraudCases.map((f) => f.status)))];

  // Calculate statistics
  const totalFraud = fraudCases.length;
  const duplikasiNIK = fraudCases.filter((f) => f.jenisFraud === "Duplikasi NIK").length;
  const lahanTidakValid = fraudCases.filter((f) => f.jenisFraud === "Lahan Tidak Valid").length;
  const pengajuanGanda = fraudCases.filter((f) => f.jenisFraud === "Pengajuan Ganda").length;

  // Filter data
  const filteredCases = useMemo(() => {
    return fraudCases.filter((cas) => {
      const matchProvinsi = filterProvinsi === "Semua" || cas.provinsi === filterProvinsi;
      const matchJenisFraud = filterJenisFraud === "Semua" || cas.jenisFraud === filterJenisFraud;
      const matchTingkatRisiko = filterTingkatRisiko === "Semua" || cas.tingkatRisiko === filterTingkatRisiko;
      const matchStatus = filterStatus === "Semua" || cas.status === filterStatus;
      return matchProvinsi && matchJenisFraud && matchTingkatRisiko && matchStatus;
    });
  }, [filterProvinsi, filterJenisFraud, filterTingkatRisiko, filterStatus]);

  const getRisikoBadgeColor = (tingkat: string) => {
    const colors: Record<string, string> = {
      Tinggi: "bg-red-100 text-red-800",
      Sedang: "bg-yellow-100 text-yellow-800",
      Rendah: "bg-green-100 text-green-800",
    };
    return colors[tingkat] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      Terdeteksi: "bg-red-100 text-red-800",
      Verifikasi: "bg-yellow-100 text-yellow-800",
      Ditolak: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleDetail = (fraudCase: FraudCase) => {
    setSelectedCase(fraudCase);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Deteksi Fraud
        </h1>
        <p className="text-sm text-muted-foreground">
          Sistem deteksi otomatis anomali dan duplikasi pengajuan subsidi
        </p>
      </motion.div>

      {/* STATISTIK FRAUD - 4 Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Kasus Fraud
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalFraud}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Duplikasi NIK
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {duplikasiNIK}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Lahan Tidak Valid
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {lahanTidakValid}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Pengajuan Ganda
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {pengajuanGanda}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FILTER DATA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Provinsi */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Provinsi
                </label>
                <Select value={filterProvinsi} onValueChange={setFilterProvinsi}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueProvinces.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Jenis Fraud */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Jenis Fraud
                </label>
                <Select value={filterJenisFraud} onValueChange={setFilterJenisFraud}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis fraud" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueJenisFraud.map((jenis) => (
                      <SelectItem key={jenis} value={jenis}>
                        {jenis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tingkat Risiko */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tingkat Risiko
                </label>
                <Select value={filterTingkatRisiko} onValueChange={setFilterTingkatRisiko}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat risiko" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTingkatRisiko.map((risiko) => (
                      <SelectItem key={risiko} value={risiko}>
                        {risiko}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueStatus.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABEL KASUS FRAUD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tabel Kasus Fraud ({filteredCases.length} Kasus)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Kasus</TableHead>
                    <TableHead>Nama Petani</TableHead>
                    <TableHead>Provinsi</TableHead>
                    <TableHead>Jenis Fraud</TableHead>
                    <TableHead>Tingkat Risiko</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.length > 0 ? (
                    filteredCases.map((fraudCase) => (
                      <TableRow key={fraudCase.id}>
                        <TableCell className="font-mono text-sm">
                          {fraudCase.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {fraudCase.namaPetani}
                        </TableCell>
                        <TableCell>{fraudCase.provinsi}</TableCell>
                        <TableCell>{fraudCase.jenisFraud}</TableCell>
                        <TableCell>
                          <Badge className={getRisikoBadgeColor(fraudCase.tingkatRisiko)}>
                            {fraudCase.tingkatRisiko}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(fraudCase.status)}>
                            {fraudCase.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog
                            open={isDetailOpen && selectedCase?.id === fraudCase.id}
                            onOpenChange={setIsDetailOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDetail(fraudCase)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                              <DialogHeader>
                                <DialogTitle>Detail Kasus Fraud</DialogTitle>
                                <DialogDescription>
                                  Informasi lengkap kasus fraud untuk {selectedCase?.namaPetani}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedCase && (
                                <div className="space-y-4 overflow-y-auto pr-4">
                                  {/* Informasi Petani */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Informasi Petani
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Nama Petani
                                        </p>
                                        <p className="font-medium">
                                          {selectedCase.namaPetani}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          NIK
                                        </p>
                                        <p className="font-mono font-medium">
                                          {selectedCase.nik}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Informasi Lahan */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Informasi Lahan
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Lokasi Lahan
                                        </p>
                                        <p className="font-medium">
                                          {selectedCase.lokasiLahan}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Jenis Fraud & Penjelasan */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Jenis Fraud
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <Badge className={getRisikoBadgeColor(selectedCase.tingkatRisiko)}>
                                          {selectedCase.jenisFraud} - {selectedCase.tingkatRisiko}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          Penjelasan Sistem
                                        </p>
                                        <p className="text-sm bg-muted/50 p-3 rounded">
                                          {selectedCase.penjelasanSistem}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Riwayat Pengajuan */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Riwayat Pengajuan Subsidi
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {selectedCase.riwayatPengajuan.map((history, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm"
                                          >
                                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                            {history}
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Tidak ada data yang cocok dengan filter Anda
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* GRAFIK FRAUD PER PROVINSI */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grafik Fraud Per Provinsi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fraudChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="provinsi" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: unknown) => {
                      if (typeof value === "number") {
                        return [`${value}`, "Jumlah Kasus"];
                      }
                      return `${value}`;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#ef4444" name="Jumlah Kasus Fraud" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
