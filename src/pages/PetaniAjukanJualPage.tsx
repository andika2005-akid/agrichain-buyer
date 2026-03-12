import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { marketplaceCommodities } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PetaniAjukanJualPage() {
  const { role, userName } = useAuth();
  const currentFarmer = (userName || "").split(" (")[0];

  const [commodity, setCommodity] = useState("");
  const [estimatedHarvest, setEstimatedHarvest] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [location, setLocation] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  if (role !== "petani") {
    return <div className="p-6 text-muted-foreground">Halaman ini hanya untuk petani.</div>;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const id = `MKT${(marketplaceCommodities.length + 1).toString().padStart(3, "0")}`;
    marketplaceCommodities.push({
      id,
      farmerName: currentFarmer,
      commodity,
      estimatedHarvest: estimatedHarvest || "-",
      harvestDate: harvestDate || new Date().toISOString().slice(0, 10),
      location: location || "-",
      estimatedPrice: Number(estimatedPrice) || 0,
    });
    setCommodity("");
    setEstimatedHarvest("");
    setHarvestDate("");
    setLocation("");
    setEstimatedPrice("");
    alert("Pengajuan penjualan berhasil ditambahkan ke marketplace.");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ajukan Penjualan Hasil Panen</h1>
      <Card className="p-4 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Komoditas</label>
            <Input value={commodity} onChange={(e) => setCommodity(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Estimasi Panen (mis. 5 Ton)</label>
            <Input value={estimatedHarvest} onChange={(e) => setEstimatedHarvest(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Tanggal Panen</label>
            <Input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Lokasi</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Estimasi Harga / Kg</label>
            <Input type="number" value={estimatedPrice} onChange={(e) => setEstimatedPrice(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Ajukan</Button>
            <Button variant="ghost" onClick={() => { setCommodity(""); setEstimatedHarvest(""); setHarvestDate(""); setLocation(""); setEstimatedPrice(""); }}>Reset</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
