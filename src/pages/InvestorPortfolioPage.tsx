import { useState } from "react";
import { motion } from "framer-motion";
import { kurApplications } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Eye,
} from "lucide-react";

interface Investment {
  id: string;
  namaPetani: string;
  komoditas: string;
  danaInvestasi: number;
  estimasiProfit: number;
  status: string;
  luasLahan: number;
  estimasiPanen: string;
  progressTanaman: number;
}

export default function InvestorPortfolioPage() {
  // Transform kurApplications to investment format
  const baseInvestments: Investment[] = kurApplications.map((kur, idx) => ({
    id: kur.id,
    namaPetani: kur.farmerName,
    komoditas: kur.komoditas,
    danaInvestasi: kur.jumlahPinjaman,
    estimasiProfit: Math.round(kur.jumlahPinjaman * 0.4),
    status: idx === 0 ? "berjalan" : idx === 1 ? "panen" : "berjalan",
    luasLahan: kur.tenor / 12,
    estimasiPanen: "2024-06-15",
    progressTanaman: idx === 0 ? 70 : idx === 1 ? 90 : 50,
  }));

  // State
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Calculate statistics
  const totalInvestasi = baseInvestments.reduce(
    (sum, inv) => sum + inv.danaInvestasi,
    0
  );
  const investasiAktif = baseInvestments.filter(
    (inv) => inv.status === "berjalan"
  ).length;
  const totalProfit = baseInvestments.reduce(
    (sum, inv) => sum + inv.estimasiProfit,
    0
  );
  const proyekSelesai = baseInvestments.filter(
    (inv) => inv.status === "panen"
  ).length;
  const avgRoi = 38; // Average ROI

  // Distribution data for chart
  const distributionData = [
    { name: "Padi", value: 40 },
    { name: "Jagung", value: 30 },
    { name: "Cabai", value: 20 },
    { name: "Kopi", value: 10 },
  ];

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#fbbf24", "#34d399", "#f87171"];

  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      berjalan: "bg-blue-100 text-blue-800",
      panen: "bg-green-100 text-green-800",
      risiko: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      berjalan: "Berjalan",
      panen: "Panen",
      risiko: "Risiko",
    };
    return labels[status] || status;
  };

  const handleDetail = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Portofolio Investasi
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola dan monitor investasi pertanian Anda
        </p>
      </motion.div>

      {/* 4 STAT CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Investasi */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Investasi
                </p>
                <p className="text-xl font-bold text-foreground">
                  Rp {(totalInvestasi.toLocaleString("id-ID"))}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investasi Aktif */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Investasi Aktif
                </p>
                <p className="text-xl font-bold text-foreground">
                  {investasiAktif} Proyek
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Profit */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Profit
                </p>
                <p className="text-xl font-bold text-green-600">
                  Rp {(totalProfit.toLocaleString("id-ID"))}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proyek Selesai */}
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Proyek Selesai
                </p>
                <p className="text-xl font-bold text-foreground">
                  {proyekSelesai} Proyek
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Distribusi Portofolio Investasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Investment by Commodity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Investasi Berdasarkan Komoditas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ROI CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm opacity-90 mb-2">ROI Investasi</p>
                <p className="text-4xl font-bold">{avgRoi}%</p>
              </div>
              <div className="flex items-end">
                <div>
                  <p className="text-sm opacity-90 mb-2">Kategori</p>
                  <p className="text-lg font-semibold">Menguntungkan</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABEL INVESTASI */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Investasi Berjalan ({investasiAktif} Proyek)
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
                    <TableHead>Estimasi Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {baseInvestments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">
                        {investment.namaPetani}
                      </TableCell>
                      <TableCell>{investment.komoditas}</TableCell>
                      <TableCell>
                        Rp {investment.danaInvestasi.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        Rp {investment.estimasiProfit.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(investment.status)}
                        >
                          {getStatusLabel(investment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={
                            isDetailOpen &&
                            selectedInvestment?.id === investment.id
                          }
                          onOpenChange={setIsDetailOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDetail(investment)}
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
                                {selectedInvestment?.namaPetani}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedInvestment && (
                              <div className="space-y-4">
                                {/* Informasi Proyek */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      Informasi Proyek
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Nama Petani
                                        </p>
                                        <p className="font-medium">
                                          {selectedInvestment.namaPetani}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Komoditas
                                        </p>
                                        <p className="font-medium">
                                          {selectedInvestment.komoditas}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Luas Lahan
                                        </p>
                                        <p className="font-medium">
                                          {selectedInvestment.luasLahan.toFixed(
                                            1
                                          )}{" "}
                                          ha
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
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Dana Investasi
                                        </p>
                                        <p className="font-medium">
                                          Rp{" "}
                                          {selectedInvestment.danaInvestasi.toLocaleString(
                                            "id-ID"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Estimasi Profit
                                        </p>
                                        <p className="font-medium text-green-600">
                                          Rp{" "}
                                          {selectedInvestment.estimasiProfit.toLocaleString(
                                            "id-ID"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Estimasi Panen
                                        </p>
                                        <p className="font-medium">
                                          {selectedInvestment.estimasiPanen}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Progress Proyek */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">
                                      Progress Proyek
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div>
                                        <div className="flex justify-between items-center mb-2">
                                          <p className="text-sm font-medium text-foreground">
                                            Progress Tanaman
                                          </p>
                                          <span className="text-sm font-semibold text-blue-600">
                                            {selectedInvestment.progressTanaman}%
                                          </span>
                                        </div>
                                        <Progress
                                          value={
                                            selectedInvestment.progressTanaman
                                          }
                                          className="h-3"
                                        />
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
