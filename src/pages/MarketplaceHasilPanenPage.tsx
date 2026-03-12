import { useState, useMemo } from "react";
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
import { marketplaceCommodities, commodityRecommendations, provinceData, purchaseContracts } from "@/data/mockData";
import { Wheat, MapPin, Calendar, DollarSign, Eye, ShoppingCart, TrendingUp } from "lucide-react";

export default function MarketplaceHasilPanenPage() {
  const { role, userName } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCommodity, setSelectedCommodity] = useState<typeof marketplaceCommodities[0] | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Calculate statistics
  const totalCommodities = marketplaceCommodities.length;
  const totalEstimatedHarvest = marketplaceCommodities.reduce((sum, com) => {
    const harvestQty = parseInt(com.estimatedHarvest.split(" ")[0]);
    return sum + harvestQty * 1000; // Convert to kg
  }, 0);
  const avgPrice = Math.round(
    marketplaceCommodities.reduce((sum, com) => sum + com.estimatedPrice, 0) /
      marketplaceCommodities.length
  );
  const uniqueProvinces = new Set(marketplaceCommodities.map((c) => c.location)).size;

  // Filter logic
  const filteredData = useMemo(() => {
    return marketplaceCommodities.filter((item) => {
      // Search filter
      if (
        searchTerm &&
        !item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Province filter
      if (selectedProvince !== "all" && item.location !== selectedProvince) {
        return false;
      }

      // Price range filter
      if (priceRange !== "all") {
        const price = item.estimatedPrice;
        switch (priceRange) {
          case "low":
            if (price > 10000) return false;
            break;
          case "medium":
            if (price <= 10000 || price > 20000) return false;
            break;
          case "high":
            if (price <= 20000) return false;
            break;
        }
      }

      return true;
    });
  }, [searchTerm, selectedProvince, priceRange]);

  const handleDetailClick = (commodity: typeof marketplaceCommodities[0]) => {
    setSelectedCommodity(commodity);
    setDetailModalOpen(true);
  };

  const handleAjukanKontrak = () => {
    if (!selectedCommodity) return;
    if (role !== "standby_buyer") {
      alert("Hanya buyer yang dapat mengajukan kontrak pembelian.");
      return;
    }
    const buyerName = (userName || "Buyer");
    const id = `CTR${(purchaseContracts.length + 1).toString().padStart(3, "0")}`;
    purchaseContracts.push({
      id,
      buyer: buyerName,
      farmer: selectedCommodity.farmerName,
      commodity: selectedCommodity.commodity,
      quantity: selectedCommodity.estimatedHarvest,
      pricePerKg: selectedCommodity.estimatedPrice,
      totalValue:
        (parseInt(selectedCommodity.estimatedHarvest.split(" ")[0]) || 0) * 1000 * selectedCommodity.estimatedPrice,
      harvestDate: selectedCommodity.harvestDate,
      status: "Pending",
    } as any);
    alert(`Kontrak untuk ${selectedCommodity.commodity} dari ${selectedCommodity.farmerName} telah diajukan`);
    setDetailModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Marketplace Hasil Panen
        </h1>
        <p className="text-sm text-muted-foreground">
          Jelajahi dan beli langsung hasil pertanian dari petani lokal
        </p>
      </div>

      {/* STATISTIK - 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Komoditas"
          value={totalCommodities}
          icon={<Wheat className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Estimasi Total Panen"
          value={`${(totalEstimatedHarvest / 1000).toFixed(0)}K Kg`}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="accent"
        />
        <StatCard
          title="Harga Rata-rata"
          value={`Rp ${avgPrice.toLocaleString("id-ID")}`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Wilayah Aktif"
          value={uniqueProvinces}
          icon={<MapPin className="w-5 h-5" />}
          variant="primary"
        />
      </div>

      {/* FILTER SECTION */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Filter Komoditas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Komoditas */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Cari Komoditas / Petani
            </label>
            <Input
              placeholder="Ketik nama komoditas atau petani..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Filter Provinsi */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Provinsi
            </label>
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Provinsi</SelectItem>
                {Array.from(
                  new Set(marketplaceCommodities.map((c) => c.location))
                ).map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Harga */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Harga per Kg
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Harga</SelectItem>
                <SelectItem value="low">Rp 1.000 - Rp 10.000</SelectItem>
                <SelectItem value="medium">Rp 10.000 - Rp 20.000</SelectItem>
                <SelectItem value="high">Rp 20.000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredData.length}</span> komoditas ditemukan
            </div>
          </div>
        </div>
      </div>

      {/* TABEL MARKETPLACE */}
      <div className="bg-card rounded-xl p-5 shadow-card overflow-x-auto">
        <h3 className="text-sm font-semibold text-foreground mb-4">Daftar Komoditas Tersedia</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Petani</th>
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Komoditas</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Estimasi Panen</th>
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Tanggal Panen</th>
              <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Lokasi</th>
              <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Harga/Kg</th>
              <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium">{item.farmerName}</td>
                  <td className="py-2.5 px-3">{item.commodity}</td>
                  <td className="py-2.5 px-3 text-right">{item.estimatedHarvest}</td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">
                    {new Date(item.harvestDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2.5 px-3">{item.location}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-green-600">
                    Rp {item.estimatedPrice.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleDetailClick(item)}
                      className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1 justify-center"
                    >
                      <Eye className="w-3 h-3" />
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  Tidak ada komoditas yang sesuai dengan filter Anda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* REKOMENDASI KOMODITAS */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Rekomendasi Komoditas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commodityRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 shadow-card border border-emerald-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <Wheat className="w-4 h-4" />
                    {rec.commodity}
                  </h4>
                  <p className="text-xs text-muted-foreground">Rekomendasi Komoditas</p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {rec.demandLevel}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Harga Rata-rata</span>
                  <span className="font-semibold text-foreground">
                    Rp {rec.averagePrice.toLocaleString("id-ID")}/Kg
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Wilayah Potensial</span>
                  <span className="font-semibold text-foreground">{rec.potentialRegion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Detail Komoditas</DialogTitle>
          </DialogHeader>

          {selectedCommodity && (
            <div className="overflow-y-auto flex-1 pr-4">
              <div className="space-y-4">
                {/* Header Info */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-green-600" />
                    {selectedCommodity.commodity}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Petani</p>
                      <p className="font-medium text-foreground">{selectedCommodity.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Komoditas</p>
                      <p className="font-medium text-foreground">{selectedCommodity.commodity}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Info */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Estimasi Panen
                    </p>
                    <p className="font-semibold text-foreground">{selectedCommodity.estimatedHarvest}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Harga per Kg
                    </p>
                    <p className="font-semibold text-green-600">
                      Rp {selectedCommodity.estimatedPrice.toLocaleString("id-ID")}
                    </p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Lokasi
                    </p>
                    <p className="font-semibold text-foreground">{selectedCommodity.location}</p>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">Tanggal Panen</p>
                    <p className="font-semibold text-foreground">
                      {new Date(selectedCommodity.harvestDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </Card>
                </div>

                {/* Estimasi Total Nilai */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-muted-foreground mb-2">Estimasi Total Nilai</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {(
                      parseInt(selectedCommodity.estimatedHarvest.split(" ")[0]) *
                      1000 *
                      selectedCommodity.estimatedPrice
                    ).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedCommodity.estimatedHarvest} × Rp {selectedCommodity.estimatedPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 border-t border-border pt-4">
            <button
              onClick={handleAjukanKontrak}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Ajukan Kontrak
            </button>
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
