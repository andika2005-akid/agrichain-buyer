import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
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
import { Badge } from "@/components/ui/badge";
import { MapPin, Wheat, TrendingUp, AlertTriangle } from "lucide-react";

interface PotentialArea {
  id: string;
  provinsi: string;
  komoditasUtama: string;
  luasLahan: number;
  estimasiProduksi: number;
  tingkatRisiko: "Rendah" | "Sedang" | "Tinggi";
  lat: number;
  lng: number;
}

const potentialAreas: PotentialArea[] = [
  {
    id: "1",
    provinsi: "Jawa Barat",
    komoditasUtama: "Padi",
    luasLahan: 650000,
    estimasiProduksi: 3250000,
    tingkatRisiko: "Rendah",
    lat: -6.9147,
    lng: 107.6098,
  },
  {
    id: "2",
    provinsi: "Jawa Tengah",
    komoditasUtama: "Padi",
    luasLahan: 750000,
    estimasiProduksi: 3750000,
    tingkatRisiko: "Rendah",
    lat: -7.1505,
    lng: 110.1429,
  },
  {
    id: "3",
    provinsi: "Jawa Timur",
    komoditasUtama: "Jagung",
    luasLahan: 580000,
    estimasiProduksi: 2900000,
    tingkatRisiko: "Sedang",
    lat: -7.2504,
    lng: 112.7688,
  },
  {
    id: "4",
    provinsi: "Sumatera Utara",
    komoditasUtama: "Kelapa Sawit",
    luasLahan: 1200000,
    estimasiProduksi: 2400000,
    tingkatRisiko: "Sedang",
    lat: 2.1148,
    lng: 99.5501,
  },
  {
    id: "5",
    provinsi: "Sumatera Barat",
    komoditasUtama: "Kakao",
    luasLahan: 380000,
    estimasiProduksi: 152000,
    tingkatRisiko: "Sedang",
    lat: -0.9457,
    lng: 100.4172,
  },
  {
    id: "6",
    provinsi: "Riau",
    komoditasUtama: "Kelapa Sawit",
    luasLahan: 1800000,
    estimasiProduksi: 3600000,
    tingkatRisiko: "Tinggi",
    lat: 0.2934,
    lng: 101.6964,
  },
  {
    id: "7",
    provinsi: "Sulawesi Selatan",
    komoditasUtama: "Jagung",
    luasLahan: 450000,
    estimasiProduksi: 2250000,
    tingkatRisiko: "Tinggi",
    lat: -3.6675,
    lng: 119.4345,
  },
  {
    id: "8",
    provinsi: "Sulawesi Utara",
    komoditasUtama: "Kakao",
    luasLahan: 290000,
    estimasiProduksi: 116000,
    tingkatRisiko: "Sedang",
    lat: 1.3521,
    lng: 124.8252,
  },
  {
    id: "9",
    provinsi: "Kalimantan Tengah",
    komoditasUtama: "Kelapa Sawit",
    luasLahan: 920000,
    estimasiProduksi: 1840000,
    tingkatRisiko: "Tinggi",
    lat: -1.6789,
    lng: 113.3807,
  },
  {
    id: "10",
    provinsi: "Papua",
    komoditasUtama: "Kakao",
    luasLahan: 340000,
    estimasiProduksi: 136000,
    tingkatRisiko: "Tinggi",
    lat: -3.595,
    lng: 138.8022,
  },
];

const commodities = ["Semua", "Padi", "Jagung", "Cabai", "Kopi", "Kakao", "Kelapa Sawit"];
const riskLevels = ["Semua", "Rendah", "Sedang", "Tinggi"];

export default function PetaPotensiPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState("Semua");
  const [selectedCommodity, setSelectedCommodity] = useState("Semua");
  const [selectedRisk, setSelectedRisk] = useState("Semua");

  // Get unique provinces and commodities from data
  const uniqueProvinces = ["Semua", ...Array.from(new Set(potentialAreas.map((a) => a.provinsi)))];
  const uniqueCommodities = ["Semua", ...Array.from(new Set(potentialAreas.map((a) => a.komoditasUtama)))];

  const filteredAreas = potentialAreas.filter((area) => {
    const matchProvince =
      selectedProvince === "Semua" || area.provinsi === selectedProvince;
    const matchCommodity =
      selectedCommodity === "Semua" || area.komoditasUtama === selectedCommodity;
    const matchRisk = selectedRisk === "Semua" || area.tingkatRisiko === selectedRisk;
    return matchProvince && matchCommodity && matchRisk;
  });

  // Calculate statistics
  const totalWilayah = potentialAreas.length;
  const wilayahRisikoTinggi = potentialAreas.filter(
    (a) => a.tingkatRisiko === "Tinggi"
  ).length;
  const komoditasTerbanyak = potentialAreas.reduce((prev, current) =>
    prev.luasLahan > current.luasLahan ? prev : current
  ).komoditasUtama;
  const luasLahanNasional = potentialAreas.reduce(
    (sum, a) => sum + a.luasLahan,
    0
  );

  const riskColors = useMemo(
    () => ({
      Rendah: "#22c55e",
      Sedang: "#f59e0b",
      Tinggi: "#ef4444",
    }),
    []
  );

  const getRiskBadgeColor = (risk: string) => {
    const colors: Record<string, string> = {
      Rendah: "bg-green-100 text-green-800",
      Sedang: "bg-yellow-100 text-yellow-800",
      Tinggi: "bg-red-100 text-red-800",
    };
    return colors[risk] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) {
      // Remove existing markers
      markersRef.current.forEach((marker) => {
        mapInstance.current?.removeLayer(marker);
      });
      markersRef.current = [];
    } else {
      // Initialize map only once
      const map = L.map(mapRef.current).setView([-2.5, 113.9213], 4);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OSM</a>',
      }).addTo(map);
    }

    // Add filtered markers
    filteredAreas.forEach((area) => {
      const color = riskColors[area.tingkatRisiko] || "#888";
      const marker = L.circleMarker([area.lat, area.lng], {
        radius: 12,
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 2,
      })
        .addTo(mapInstance.current!)
        .bindPopup(
          `<div style="font-size:12px">
            <strong>${area.provinsi}</strong><br/>
            Komoditas: <strong>${area.komoditasUtama}</strong><br/>
            Luas: ${area.luasLahan.toLocaleString("id-ID")} Ha<br/>
            Risiko: <strong>${area.tingkatRisiko}</strong>
          </div>`
        );
      markersRef.current.push(marker);
    });
  }, [filteredAreas, riskColors]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Peta Potensi Wilayah
        </h1>
        <p className="text-sm text-muted-foreground">
          Pemetaan potensi pertanian dan clustering wilayah Indonesia
        </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Provinsi */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Provinsi
                </label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Komoditas */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Komoditas
                </label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCommodities.map((commodity) => (
                      <SelectItem key={commodity} value={commodity}>
                        {commodity}
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
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih risiko" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((risk) => (
                      <SelectItem key={risk} value={risk}>
                        {risk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PETA INTERAKTIF */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peta Potensi Indonesia</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="w-full h-96 rounded-lg border border-border/50" />
          </CardContent>
        </Card>
      </motion.div>

      {/* STATISTIK WILAYAH - 4 Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Wilayah Terdata
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalWilayah}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Wilayah Risiko Tinggi
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {wilayahRisikoTinggi}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Komoditas Terbanyak
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {komoditasTerbanyak}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wheat className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Luas Lahan Nasional
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {(luasLahanNasional / 1e6).toFixed(1)}M Ha
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABEL POTENSI WILAYAH */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tabel Potensi Wilayah ({filteredAreas.length} Wilayah)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provinsi</TableHead>
                    <TableHead>Komoditas Utama</TableHead>
                    <TableHead>Luas Lahan</TableHead>
                    <TableHead>Estimasi Produksi</TableHead>
                    <TableHead>Tingkat Risiko</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">
                          {area.provinsi}
                        </TableCell>
                        <TableCell>{area.komoditasUtama}</TableCell>
                        <TableCell>
                          {area.luasLahan.toLocaleString("id-ID")} Ha
                        </TableCell>
                        <TableCell>
                          {area.estimasiProduksi.toLocaleString("id-ID")} Ton
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskBadgeColor(area.tingkatRisiko)}>
                            {area.tingkatRisiko}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
