import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { productionMonitoring, provinceData } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, AlertCircle, Leaf, MapPin, Calendar, BarChart3, Eye } from "lucide-react";

export default function MonitoringProduksiPage() {
  const { role } = useAuth();
  const [searchFarmer, setSearchFarmer] = useState("");
  const [filterCommodity, setFilterCommodity] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterRiskLevel, setFilterRiskLevel] = useState("all");
  const [selectedMonitoring, setSelectedMonitoring] = useState<typeof productionMonitoring[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    return productionMonitoring.filter((item) => {
      const matchSearch = item.farmer.toLowerCase().includes(searchFarmer.toLowerCase());
      const matchCommodity = filterCommodity === "all" || item.commodity === filterCommodity;
      const matchRegion = filterRegion === "all" || item.province === filterRegion;
      const matchRisk = filterRiskLevel === "all" || item.riskLevel === filterRiskLevel;
      return matchSearch && matchCommodity && matchRegion && matchRisk;
    });
  }, [searchFarmer, filterCommodity, filterRegion, filterRiskLevel]);

  // Get unique values for filters
  const uniqueCommodities = [...new Set(productionMonitoring.map((item) => item.commodity))];
  const uniqueRegions = [...new Set(productionMonitoring.map((item) => item.province))];

  // Calculate statistics
  const stats = {
    totalLand: productionMonitoring.reduce((sum, item) => sum + item.landArea, 0),
    estimatedHarvest: productionMonitoring.reduce((sum, item) => sum + item.estimatedHarvest, 0),
    lowRisk: productionMonitoring.filter((item) => item.riskLevel === "Rendah").length,
    highRisk: productionMonitoring.filter((item) => item.riskLevel === "Tinggi").length,
  };

  // Get status icon and color
  const getStatusIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Rendah":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Tinggi":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Rendah":
        return "bg-green-50 text-green-700 border-green-200";
      case "Tinggi":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getGrowthStageColor = (stage: string) => {
    switch (stage) {
      case "Vegetatif":
        return "bg-blue-50 text-blue-700";
      case "Pembungaan":
      case "Berbunga":
        return "bg-purple-50 text-purple-700";
      case "Berbuah":
        return "bg-orange-50 text-orange-700";
      case "Pemasakan":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const handleDetailClick = (item: typeof productionMonitoring[0]) => {
    setSelectedMonitoring(item);
    setIsDetailOpen(true);
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
          <h1 className="text-2xl font-bold font-display text-foreground">Monitoring Produksi</h1>
          <p className="text-sm text-muted-foreground">Pantau perkembangan tanaman dan kelayakan panen</p>
        </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Lahan Dipantau</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLand.toFixed(1)}</p>
              <p className="text-gray-500 text-xs mt-1">Hektar</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Estimasi Total Panen</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.estimatedHarvest}</p>
              <p className="text-gray-500 text-xs mt-1">Ton</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Risiko Rendah</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.lowRisk}</p>
              <p className="text-gray-500 text-xs mt-1">Petani</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Risiko Tinggi</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.highRisk}</p>
              <p className="text-gray-500 text-xs mt-1">Petani</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
            <label className="text-sm font-medium text-gray-700 block mb-2">Wilayah</label>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Semua wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Tingkat Risiko</label>
            <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Semua risiko" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Risiko</SelectItem>
                <SelectItem value="Rendah">Risiko Rendah</SelectItem>
                <SelectItem value="Sedang">Risiko Sedang</SelectItem>
                <SelectItem value="Tinggi">Risiko Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredData.length}</span> dari {productionMonitoring.length} hasil
          </div>
        </div>
      </Card>

      {/* Monitoring Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Petani</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Komoditas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Luas Lahan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tahap Tanam</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estimasi Panen</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Risiko</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.farmer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.commodity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.landArea.toFixed(1)} Ha</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant="outline" className={`${getGrowthStageColor(item.growthStage)}`}>
                        {item.growthStage}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.estimatedHarvest} Ton</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.riskLevel)}
                        <Badge variant="outline" className={getStatusColor(item.riskLevel)}>
                          {item.riskLevel}
                        </Badge>
                      </div>
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
          {selectedMonitoring && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Detail Monitoring Produksi</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Header Info */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMonitoring.farmer}</h3>
                    <p className="text-gray-600 text-sm mt-1">ID: {selectedMonitoring.id}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(selectedMonitoring.riskLevel)}>
                    {selectedMonitoring.riskLevel}
                  </Badge>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Komoditas</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{selectedMonitoring.commodity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Wilayah</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <p className="text-gray-900 font-semibold">{selectedMonitoring.province}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Luas Lahan</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{selectedMonitoring.landArea.toFixed(1)} Hektar</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Estimasi Panen</p>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{selectedMonitoring.estimatedHarvest} Ton</p>
                  </div>
                </div>

                {/* Pertumbuhan Tanaman */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">Tahap Pertumbuhan: {selectedMonitoring.growthStage}</p>
                      <span className="text-sm font-semibold text-gray-900">{selectedMonitoring.growthPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${selectedMonitoring.growthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Estimasi Panen */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-blue-700 text-sm font-medium">Estimasi Total Panen</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{selectedMonitoring.estimatedHarvest} Ton</p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Tanggal Panen */}
                <div>
                  <p className="text-gray-600 text-sm font-medium">Tanggal Estimasi Panen</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <p className="text-gray-900 font-semibold">
                      {new Date(selectedMonitoring.harvestDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Catatan Produksi */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-gray-600 text-sm font-medium mb-2">Catatan Produksi</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedMonitoring.notes}</p>
                </div>

                {/* Status & Update */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Status</p>
                    <p className="text-gray-900 font-semibold mt-1">{selectedMonitoring.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Update Terakhir</p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {new Date(selectedMonitoring.lastUpdate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
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
