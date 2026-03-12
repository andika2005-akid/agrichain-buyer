import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { commodityRecommendations } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, ShoppingCart, Leaf, DollarSign, MapPin, Zap, Target } from "lucide-react";

export default function BuyerRekomendasiKomoditasPage() {
  const { role } = useAuth();
  const [selectedDemand, setSelectedDemand] = useState("all");

  // Filter data berdasarkan demand level
  const filteredData = useMemo(() => {
    if (selectedDemand === "all") {
      return commodityRecommendations;
    }
    return commodityRecommendations.filter((item) => item.demandLevel === selectedDemand);
  }, [selectedDemand]);

  // Calculate statistics
  const stats = {
    highDemand: commodityRecommendations.filter((item) => item.demandLevel === "Tinggi").length,
    averagePrice:
      Math.round(
        commodityRecommendations.reduce((sum, item) => sum + item.averagePrice, 0) /
          commodityRecommendations.length
      ),
    potentialRegions: [...new Set(commodityRecommendations.map((item) => item.potentialRegion))].length,
    trendingCount: commodityRecommendations.filter((item) => item.badge === "Trending").length,
  };

  // Prepare chart data - demand trend
  const chartData = commodityRecommendations.map((item) => ({
    name: item.commodity.slice(0, 6),
    demand: item.demand,
    price: Math.round(item.averagePrice / 100),
  }));

  // Get badge color and styling
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "Trending":
        return "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 border-pink-200";
      case "Permintaan Tinggi":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-green-200";
      case "Potensi Tinggi":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200";
      case "Ekspor":
        return "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200";
      case "Stabil":
        return "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Get demand badge color
  const getDemandColor = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "bg-red-50 text-red-700 border-red-200";
      case "Sedang":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Rendah":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Get trend icon and color
  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
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
          <h1 className="text-2xl font-bold font-display text-foreground">Rekomendasi Komoditas</h1>
          <p className="text-sm text-muted-foreground">Analisis pasar dan rekomendasi komoditas dengan potensi tinggi untuk pembelian</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Komoditas Permintaan Tinggi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.highDemand}</p>
                <p className="text-gray-500 text-xs mt-1">Komoditas</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Harga Rata-rata Pasar</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.averagePrice)}</p>
                <p className="text-gray-500 text-xs mt-1">per Kg</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Wilayah Produksi Potensial</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.potentialRegions}</p>
                <p className="text-gray-500 text-xs mt-1">Wilayah aktif</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
              <p className="text-gray-600 text-sm font-medium">Komoditas Trending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.trendingCount}</p>
              <p className="text-gray-500 text-xs mt-1">Sedang trending</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg">
              <Zap className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">Filter berdasarkan Tingkat Permintaan</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDemand("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDemand === "all"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semua Komoditas
              </button>
              <button
                onClick={() => setSelectedDemand("Tinggi")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDemand === "Tinggi"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Permintaan Tinggi
              </button>
              <button
                onClick={() => setSelectedDemand("Sedang")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDemand === "Sedang"
                    ? "bg-yellow-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Permintaan Sedang
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-medium">{filteredData.length}</span> dari{" "}
            <span className="font-medium">{commodityRecommendations.length}</span> komoditas
          </div>
        </div>
      </Card>

      {/* Chart - Demand Trend */}
      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Grafik Permintaan Komoditas
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Bar dataKey="demand" fill="#3b82f6" name="Tingkat Permintaan (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Rekomendasi Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Komoditas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Permintaan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Harga Rata-rata</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Wilayah Potensial</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Potensi Pasar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tren</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.commodity}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant="outline" className={getDemandColor(item.demandLevel)}>
                        {item.demandLevel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(item.averagePrice)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      {item.potentialRegion}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.marketPotential}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        <span className={`font-medium ${getTrendColor(item.trend)}`}>
                          {item.trend === "up" ? "+" : ""}{item.trendPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada komoditas yang sesuai dengan filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insight Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Insight Komoditas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">{item.commodity}</h4>
                    <Badge variant="outline" className={getBadgeStyle(item.badge)}>
                      {item.badge}
                    </Badge>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Permintaan</p>
                      <div className="mt-1">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${item.demand}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-900 font-semibold mt-1">{item.demand}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Harga</p>
                      <p className="text-green-600 font-semibold">{formatCurrency(item.averagePrice)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Tren</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(item.trend)}
                        <span className={`font-semibold ${getTrendColor(item.trend)}`}>
                          {item.trend === "up" ? "+" : ""}{item.trendPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insight Text */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 leading-relaxed">{item.insight}</p>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-gray-600">Wilayah: {item.potentialRegion}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.marketPotential}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        </div>
      </motion.div>
    </div>
  );
}
