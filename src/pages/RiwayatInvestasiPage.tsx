import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, Eye } from "lucide-react";

interface InvestmentHistory {
  id: string;
  namaPetani: string;
  komoditas: string;
  danaInvestasi: number;
  profit: number;
  roi: number;
  status: string;
  tanggalSelesai: string;
  luasLahan: number;
  tanggalMulai: string;
}

const historyData: InvestmentHistory[] = [
  {
    id: "1",
    namaPetani: "Andi",
    komoditas: "Padi",
    danaInvestasi: 50000000,
    profit: 20000000,
    roi: 40,
    status: "Selesai",
    tanggalSelesai: "10 Mei 2025",
    luasLahan: 2,
    tanggalMulai: "10 Februari 2025",
  },
  {
    id: "2",
    namaPetani: "Budi",
    komoditas: "Jagung",
    danaInvestasi: 30000000,
    profit: 12000000,
    roi: 35,
    status: "Selesai",
    tanggalSelesai: "20 Juni 2025",
    luasLahan: 1.5,
    tanggalMulai: "20 Maret 2025",
  },
  {
    id: "3",
    namaPetani: "Siti",
    komoditas: "Cabai",
    danaInvestasi: 25000000,
    profit: 10000000,
    roi: 32,
    status: "Selesai",
    tanggalSelesai: "5 Juli 2025",
    luasLahan: 1,
    tanggalMulai: "5 April 2025",
  },
  {
    id: "4",
    namaPetani: "Ahmad",
    komoditas: "Padi",
    danaInvestasi: 45000000,
    profit: 18000000,
    roi: 40,
    status: "Selesai",
    tanggalSelesai: "15 Agustus 2025",
    luasLahan: 2.5,
    tanggalMulai: "15 Mei 2025",
  },
  {
    id: "5",
    namaPetani: "Dewi",
    komoditas: "Jagung",
    danaInvestasi: 35000000,
    profit: 13000000,
    roi: 35,
    status: "Selesai",
    tanggalSelesai: "25 September 2025",
    luasLahan: 2,
    tanggalMulai: "25 Juni 2025",
  },
  {
    id: "6",
    namaPetani: "Rudi",
    komoditas: "Cabai",
    danaInvestasi: 28000000,
    profit: 11000000,
    roi: 34,
    status: "Selesai",
    tanggalSelesai: "10 Oktober 2025",
    luasLahan: 1.2,
    tanggalMulai: "10 Juli 2025",
  },
  {
    id: "7",
    namaPetani: "Maya",
    komoditas: "Padi",
    danaInvestasi: 55000000,
    profit: 22000000,
    roi: 40,
    status: "Selesai",
    tanggalSelesai: "20 November 2025",
    luasLahan: 3,
    tanggalMulai: "20 Agustus 2025",
  },
  {
    id: "8",
    namaPetani: "Hendra",
    komoditas: "Kopi",
    danaInvestasi: 40000000,
    profit: 14000000,
    roi: 33,
    status: "Selesai",
    tanggalSelesai: "5 Januari 2026",
    luasLahan: 2.8,
    tanggalMulai: "5 Oktober 2025",
  },
];

// Data untuk chart
const chartData = [
  { name: "Padi", profit: 60000000 },
  { name: "Jagung", profit: 35000000 },
  { name: "Cabai", profit: 21000000 },
  { name: "Kopi", profit: 14000000 },
];

export default function RiwayatInvestasi() {
  // State
  const [selectedHistory, setSelectedHistory] =
    useState<InvestmentHistory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterKomoditas, setFilterKomoditas] = useState("semua");
  const [filterTahun, setFilterTahun] = useState("semua");
  const [filterNamaPetani, setFilterNamaPetani] = useState("");

  // Calculate statistics
  const totalInvestasiSelesai = historyData.length;
  const totalProfitDidapat = historyData.reduce(
    (sum, inv) => sum + inv.profit,
    0
  );
  const roiRataRata =
    historyData.reduce((sum, inv) => sum + inv.roi, 0) / historyData.length;

  // Filter data
  const filteredData = historyData.filter((item) => {
    const matchKomoditas =
      filterKomoditas === "semua" || item.komoditas === filterKomoditas;
    const matchTahun =
      filterTahun === "semua" || item.tanggalSelesai.includes(filterTahun);
    const matchNama = item.namaPetani
      .toLowerCase()
      .includes(filterNamaPetani.toLowerCase());
    return matchKomoditas && matchTahun && matchNama;
  });

  // Get unique komoditas
  const uniqueKomoditas = Array.from(
    new Set(historyData.map((item) => item.komoditas))
  );

  // Get unique years
  const uniqueYears = Array.from(
    new Set(
      historyData.map((item) => {
        const parts = item.tanggalSelesai.split(" ");
        return parts[parts.length - 1];
      })
    )
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const handleDetail = (history: InvestmentHistory) => {
    setSelectedHistory(history);
    setIsDetailOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      Selesai: "bg-green-100 text-green-800",
      Gagal: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Riwayat Investasi
        </h1>
        <p className="text-sm text-muted-foreground">
          Lihat riwayat investasi pertanian yang telah selesai
        </p>
      </motion.div>

      {/* 3 STAT CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Total Investasi Selesai */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Investasi Selesai
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalInvestasiSelesai} Proyek
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Profit Didapat */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Profit Didapat
                </p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {(totalProfitDidapat.toLocaleString("id-ID"))}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Rata-rata */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  ROI Rata-rata
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {roiRataRata.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FILTER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Riwayat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Komoditas */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Komoditas
                </label>
                <Select value={filterKomoditas} onValueChange={setFilterKomoditas}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Komoditas</SelectItem>
                    {uniqueKomoditas.map((komoditas) => (
                      <SelectItem key={komoditas} value={komoditas}>
                        {komoditas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tahun Investasi */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tahun Investasi
                </label>
                <Select value={filterTahun} onValueChange={setFilterTahun}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Tahun</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pencarian Nama Petani */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nama Petani
                </label>
                <Input
                  placeholder="Cari nama petani..."
                  value={filterNamaPetani}
                  onChange={(e) => setFilterNamaPetani(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {/* Tombol Cari */}
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Cari
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABEL RIWAYAT INVESTASI */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Riwayat Investasi ({filteredData.length} Proyek)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Petani</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Dana Investasi</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Selesai</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="font-medium">
                          {history.namaPetani}
                        </TableCell>
                        <TableCell>{history.komoditas}</TableCell>
                        <TableCell>
                          Rp {history.danaInvestasi.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          Rp {history.profit.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {history.roi}%
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(history.status)}>
                            {history.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {history.tanggalSelesai}
                        </TableCell>
                        <TableCell>
                          <Dialog
                            open={
                              isDetailOpen &&
                              selectedHistory?.id === history.id
                            }
                            onOpenChange={setIsDetailOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDetail(history)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail Investasi</DialogTitle>
                                <DialogDescription>
                                  Informasi detail investasi untuk{" "}
                                  {selectedHistory?.namaPetani}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedHistory && (
                                <div className="space-y-4">
                                  {/* Informasi Petani */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Informasi Petani
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Nama Petani
                                          </p>
                                          <p className="font-medium">
                                            {selectedHistory.namaPetani}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Komoditas
                                          </p>
                                          <p className="font-medium">
                                            {selectedHistory.komoditas}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Luas Lahan
                                          </p>
                                          <p className="font-medium">
                                            {selectedHistory.luasLahan} ha
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Informasi Investasi */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">
                                        Informasi Investasi
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Dana Investasi
                                          </p>
                                          <p className="font-medium">
                                            Rp{" "}
                                            {selectedHistory.danaInvestasi.toLocaleString(
                                              "id-ID"
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Profit yang Didapat
                                          </p>
                                          <p className="font-medium text-green-600">
                                            Rp{" "}
                                            {selectedHistory.profit.toLocaleString(
                                              "id-ID"
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            ROI Investasi
                                          </p>
                                          <p className="font-medium">
                                            {selectedHistory.roi}%
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Tanggal Mulai
                                          </p>
                                          <p className="font-medium">
                                            {selectedHistory.tanggalMulai}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Tanggal Selesai
                                          </p>
                                          <p className="font-medium">
                                            {selectedHistory.tanggalSelesai}
                                          </p>
                                        </div>
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
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
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
    </div>
  );
}
