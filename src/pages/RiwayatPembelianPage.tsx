import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { purchaseHistory } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, ShoppingCart, Leaf, Users, Calendar, Eye, TrendingUp } from "lucide-react";

export default function RiwayatPembelianPage() {
  const { role } = useAuth();
  const [searchFarmer, setSearchFarmer] = useState("");
  const [filterCommodity, setFilterCommodity] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterValueRange, setFilterValueRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof purchaseHistory[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    return purchaseHistory.filter((item) => {
      const matchSearch = item.farmer.toLowerCase().includes(searchFarmer.toLowerCase());
      const matchCommodity = filterCommodity === "all" || item.commodity === filterCommodity;

      // Date filter
      let matchDate = filterDateRange === "all";
      if (filterDateRange !== "all") {
        const itemDate = new Date(item.date);
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 60));
        const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

        switch (filterDateRange) {
          case "7days":
            matchDate = itemDate >= new Date(new Date().setDate(new Date().getDate() - 7));
            break;
          case "30days":
            matchDate = itemDate >= thirtyDaysAgo;
            break;
          case "90days":
            matchDate = itemDate >= ninetyDaysAgo;
            break;
          case "6months":
            matchDate = itemDate >= sixMonthsAgo;
            break;
        }
      }

      // Value filter
      let matchValue = filterValueRange === "all";
      switch (filterValueRange) {
        case "low":
          matchValue = item.total < 30000000;
          break;
        case "medium":
          matchValue = item.total >= 30000000 && item.total < 60000000;
          break;
        case "high":
          matchValue = item.total >= 60000000;
          break;
      }

      return matchSearch && matchCommodity && matchDate && matchValue;
    });
  }, [searchFarmer, filterCommodity, filterDateRange, filterValueRange]);

  // Get unique values for filters
  const uniqueCommodities = [...new Set(purchaseHistory.map((item) => item.commodity))];

  // Calculate statistics
  const stats = {
    totalTransactions: purchaseHistory.length,
    totalPurchase: purchaseHistory.reduce((sum, item) => sum + item.total, 0),
    mostCommodity: getMostCommonCommodity(),
    partnerFarmers: [...new Set(purchaseHistory.map((item) => item.farmer))].length,
  };

  function getMostCommonCommodity() {
    const commodities: Record<string, number> = {};
    purchaseHistory.forEach((item) => {
      commodities[item.commodity] = (commodities[item.commodity] || 0) + 1;
    });
    const mostCommon = Object.entries(commodities).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? mostCommon[0] : "-";
  }

  // Prepare chart data - monthly purchases by commodity
  const getChartData = () => {
    const monthlyData: Record<string, Record<string, number>> = {};

    purchaseHistory.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = date.toLocaleString("id-ID", { month: "short", year: "numeric" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      monthlyData[monthKey][item.commodity] = (monthlyData[monthKey][item.commodity] || 0) + item.quantity;
    });

    return Object.entries(monthlyData).map(([month, commodities]) => ({
      month,
      ...commodities,
    }));
  };

  const chartData = getChartData();
  const allCommoditiesInChart = [...new Set(purchaseHistory.map((item) => item.commodity))];

  // Color palette for chart
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Dibatalkan":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleDetailClick = (item: typeof purchaseHistory[0]) => {
    setSelectedTransaction(item);
    setIsDetailOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Riwayat Pembelian</h1>
          <p className="text-sm text-muted-foreground">Kelola dan pantau semua transaksi pembelian komoditas</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Transaksi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTransactions}</p>
                <p className="text-gray-500 text-xs mt-1">Transaksi</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pembelian</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{(stats.totalPurchase / 1000000000).toFixed(1)}</p>
              <p className="text-gray-500 text-xs mt-1">Miliar Rupiah</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Komoditas Terbanyak</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.mostCommodity}</p>
              <p className="text-gray-500 text-xs mt-1">Paling banyak dibeli</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
              <Leaf className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Petani Mitra</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.partnerFarmers}</p>
              <p className="text-gray-500 text-xs mt-1">Petani aktif</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Cari Petani</label>
            <Input
              placeholder="Nama petani..."
              value={searchFarmer}
              onChange={(e) => setSearchFarmer(e.target.value)}
              className="border-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Komoditas</label>
            <Select value={filterCommodity} onValueChange={setFilterCommodity}>
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Semua komoditas" />
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

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Tanggal Transaksi</label>
            <Select value={filterDateRange} onValueChange={setFilterDateRange}>
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Semua tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tanggal</SelectItem>
                <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                <SelectItem value="90days">90 Hari Terakhir</SelectItem>
                <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Nilai Transaksi</label>
            <Select value={filterValueRange} onValueChange={setFilterValueRange}>
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Semua nilai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Nilai</SelectItem>
                <SelectItem value="low">Rendah (&lt; 30 Juta)</SelectItem>
                <SelectItem value="medium">Menengah (30-60 Juta)</SelectItem>
                <SelectItem value="high">Tinggi (&gt; 60 Juta)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">{filteredData.length}</span> dari {purchaseHistory.length} hasil
        </div>
      </Card>

      {/* Chart - Pembelian Komoditas per Bulan */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Grafik Pembelian Komoditas per Bulan
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" label={{ value: "Jumlah (Ton)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
                formatter={(value) => `${value} Ton`}
              />
              <Legend />
              {allCommoditiesInChart.map((commodity, index) => (
                <Bar key={commodity} dataKey={commodity} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Purchase History Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID Transaksi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Petani</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Komoditas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Jumlah</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Harga/Kg</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.farmer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.commodity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.quantity} {item.quantityUnit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(item.pricePerKg)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(item.total)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDetailClick(item)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data yang sesuai dengan filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Detail Transaksi Pembelian</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Header Info */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedTransaction.id}</h3>
                    <p className="text-gray-600 text-sm mt-1">Transaksi Pembelian</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>

                {/* Buyer & Farmer Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pembeli</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{selectedTransaction.buyer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Petani</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{selectedTransaction.farmer}</p>
                  </div>
                </div>

                {/* Commodity & Quantity */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Komoditas</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{selectedTransaction.commodity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Jumlah</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">
                      {selectedTransaction.quantity} {selectedTransaction.quantityUnit}
                    </p>
                  </div>
                </div>

                {/* Price Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Harga per Kg</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">
                      {formatCurrency(selectedTransaction.pricePerKg)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Subtotal</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">
                      {formatCurrency(selectedTransaction.quantity * selectedTransaction.pricePerKg)}
                    </p>
                  </div>
                </div>

                {/* Total Value Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <p className="text-green-700 text-sm font-medium">Total Nilai Transaksi</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{formatCurrency(selectedTransaction.total)}</p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Tanggal Transaksi</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <p className="text-gray-900 font-semibold">{formatDate(selectedTransaction.date)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Metode Pembayaran</p>
                      <p className="text-gray-900 font-semibold mt-2">{selectedTransaction.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-sm font-medium mb-2">Informasi Tambahan</p>
                  <ul className="space-y-2 text-sm text-blue-900">
                    <li>• Transaksi ID: {selectedTransaction.id}</li>
                    <li>• Status: {selectedTransaction.status}</li>
                    <li>• Pembayaran: {selectedTransaction.paymentMethod}</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </motion.div>
    </div>
  );
}
