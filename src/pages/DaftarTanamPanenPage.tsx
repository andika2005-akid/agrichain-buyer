import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Trash2, Edit2, Eye, Wheat, TrendingUp, Zap, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { plantingRecords, harvestRecords } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PlantingRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  luasTanam: number;
  tanggalTanam: string;
  jenisBenih: string;
  komoditas: string;
  pakaiBsubsidi: boolean;
  createdAt: string;
}

interface HarvestRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  luasPanen: number;
  tanggalPanen: string;
  totalHasilPanen: number;
  hargaJual: number;
  komoditas: string;
  totalPenjualan: number;
  createdAt: string;
}

export default function DaftarTanamPanenPage() {
  const { toast } = useToast();
  const [plantingRecordsList, setPlantingRecordsList] = useState<PlantingRecord[]>(plantingRecords);
  const [harvestRecordsList, setHarvestRecordsList] = useState<HarvestRecord[]>(harvestRecords);
  const [plantingSubmitted, setPlantingSubmitted] = useState(false);
  const [harvestSubmitted, setHarvestSubmitted] = useState(false);

  const [plantingFormData, setPlantingFormData] = useState({
    luasTanam: "",
    tanggalTanam: "",
    jenisBenih: "",
    komoditas: "",
    pakaiBsubsidi: false,
  });

  const [harvestFormData, setHarvestFormData] = useState({
    plantingRecordId: "",
    tanggalPanen: "",
    totalHasilPanen: "",
    hargaJual: "",
  });

  const [selectedPlantingRecord, setSelectedPlantingRecord] = useState<PlantingRecord | null>(null);

  // Compute statistics
  const totalPenanaman = plantingRecordsList.length;
  const totalPanen = harvestRecordsList.length;
  const totalProduksi = harvestRecordsList.reduce((sum, h) => sum + h.totalHasilPanen, 0);
  const totalPendapatan = harvestRecordsList.reduce((sum, h) => sum + h.totalPenjualan, 0);

  // Chart data
  const productionChartData = [
    ...new Set(harvestRecordsList.map(h => h.komoditas))
  ].map(komoditas => ({
    komoditas,
    produksi: harvestRecordsList.filter(h => h.komoditas === komoditas).reduce((sum, h) => sum + h.totalHasilPanen, 0)
  }));

  const incomeChartData = [
    { bulan: "Jan", pendapatan: 2500000 },
    { bulan: "Feb", pendapatan: 3200000 },
    { bulan: "Mar", pendapatan: 2800000 },
    { bulan: "Apr", pendapatan: 4100000 },
    { bulan: "Mei", pendapatan: 3600000 },
    { bulan: "Jun", pendapatan: totalPendapatan / 6 },
  ];

  // Planting handlers
  const handlePlantingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPlantingFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlantingSelectChange = (name: string, value: string) => {
    setPlantingFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlantingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PlantingRecord = {
      id: `T${String(plantingRecordsList.length + 1).padStart(3, "0")}`,
      farmerId: "F001",
      farmerName: "Ahmad Suryadi",
      luasTanam: parseFloat(plantingFormData.luasTanam),
      tanggalTanam: plantingFormData.tanggalTanam,
      jenisBenih: plantingFormData.jenisBenih,
      komoditas: plantingFormData.komoditas,
      pakaiBsubsidi: plantingFormData.pakaiBsubsidi,
      createdAt: new Date().toLocaleString("id-ID"),
    };

    setPlantingRecordsList([newRecord, ...plantingRecordsList]);
    setPlantingSubmitted(true);
    toast({
      title: "Pencatatan Tanam Berhasil!",
      description: "Data tanam Anda telah tersimpan dalam sistem.",
    });

    setPlantingFormData({
      luasTanam: "",
      tanggalTanam: "",
      jenisBenih: "",
      komoditas: "",
      pakaiBsubsidi: false,
    });
  };

  const handlePlantingDelete = (id: string) => {
    setPlantingRecordsList(plantingRecordsList.filter(r => r.id !== id));
    toast({
      title: "Data Dihapus",
      description: "Pencatatan tanam telah dihapus.",
    });
  };

  // Harvest handlers
  const handleHarvestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHarvestFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHarvestSelectChange = (name: string, value: string) => {
    if (name === "plantingRecordId") {
      const selected = plantingRecordsList.find(p => p.id === value);
      setSelectedPlantingRecord(selected || null);
    }
    setHarvestFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHarvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantingRecord) {
      toast({
        title: "Error",
        description: "Silakan pilih data tanam terlebih dahulu",
      });
      return;
    }

    const totalHasilPanen = parseFloat(harvestFormData.totalHasilPanen);
    const hargaJual = parseFloat(harvestFormData.hargaJual);
    const totalPenjualan = totalHasilPanen * hargaJual;

    const newRecord: HarvestRecord = {
      id: `H${String(harvestRecordsList.length + 1).padStart(3, "0")}`,
      farmerId: "F001",
      farmerName: "Ahmad Suryadi",
      luasPanen: selectedPlantingRecord.luasTanam,
      tanggalPanen: harvestFormData.tanggalPanen,
      totalHasilPanen,
      hargaJual,
      komoditas: selectedPlantingRecord.komoditas,
      totalPenjualan,
      createdAt: new Date().toLocaleString("id-ID"),
    };

    setHarvestRecordsList([newRecord, ...harvestRecordsList]);
    setHarvestSubmitted(true);
    toast({
      title: "Pencatatan Panen Berhasil!",
      description: "Data panen Anda telah tersimpan dalam sistem.",
    });

    setHarvestFormData({
      plantingRecordId: "",
      tanggalPanen: "",
      totalHasilPanen: "",
      hargaJual: "",
    });
    setSelectedPlantingRecord(null);
  };

  const handleHarvestDelete = (id: string) => {
    setHarvestRecordsList(harvestRecordsList.filter(r => r.id !== id));
    toast({
      title: "Data Dihapus",
      description: "Pencatatan panen telah dihapus.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Pencatatan Pertanian</h1>
        <p className="text-sm text-muted-foreground">Kelola data penanaman dan panen Anda</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="tanam" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tanam">Daftar Tanam</TabsTrigger>
            <TabsTrigger value="panen">Daftar Panen</TabsTrigger>
          </TabsList>

          {/* Daftar Tanam Tab */}
          <TabsContent value="tanam" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-semibold mb-4">Form Pencatatan Tanam</h2>
              <form onSubmit={handlePlantingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="luasTanam">Luas Tanam (Ha)</Label>
                    <Input
                      id="luasTanam"
                      name="luasTanam"
                      type="number"
                      step="0.1"
                      placeholder="Contoh: 2.5"
                      value={plantingFormData.luasTanam}
                      onChange={handlePlantingInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggalTanam">Tanggal Tanam</Label>
                    <Input
                      id="tanggalTanam"
                      name="tanggalTanam"
                      type="date"
                      value={plantingFormData.tanggalTanam}
                      onChange={handlePlantingInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jenisBenih">Jenis Benih</Label>
                    <Select value={plantingFormData.jenisBenih} onValueChange={(value) => handlePlantingSelectChange("jenisBenih", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis benih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benih Unggul Bersertifikat">Benih Unggul Bersertifikat</SelectItem>
                        <SelectItem value="Benih Hibrida">Benih Hibrida</SelectItem>
                        <SelectItem value="Benih Lokal">Benih Lokal</SelectItem>
                        <SelectItem value="Benih Organik">Benih Organik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="komoditas">Komoditas</Label>
                    <Select value={plantingFormData.komoditas} onValueChange={(value) => handlePlantingSelectChange("komoditas", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih komoditas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Padi">Padi</SelectItem>
                        <SelectItem value="Jagung">Jagung</SelectItem>
                        <SelectItem value="Kedelai">Kedelai</SelectItem>
                        <SelectItem value="Cabai">Cabai</SelectItem>
                        <SelectItem value="Bawang">Bawang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pakaiBsubsidi"
                    name="pakaiBsubsidi"
                    checked={plantingFormData.pakaiBsubsidi}
                    onCheckedChange={(checked) =>
                      setPlantingFormData(prev => ({
                        ...prev,
                        pakaiBsubsidi: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="pakaiBsubsidi" className="cursor-pointer">Menggunakan Subsidi</Label>
                </div>

                <Button type="submit" className="w-full">Simpan Pencatatan Tanam</Button>
              </form>
            </motion.div>

            {plantingSubmitted && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 bg-success/10 rounded-lg">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-sm text-success">Pencatatan tanam berhasil disimpan!</p>
              </motion.div>
            )}

            {plantingRecordsList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4">Riwayat Pencatatan Tanam</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Luas Tanam</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jenis Benih</TableHead>
                      <TableHead>Komoditas</TableHead>
                      <TableHead>Subsidi</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plantingRecordsList.map(record => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs">{record.id}</TableCell>
                        <TableCell>{record.luasTanam} Ha</TableCell>
                        <TableCell>{record.tanggalTanam}</TableCell>
                        <TableCell>{record.jenisBenih}</TableCell>
                        <TableCell>{record.komoditas}</TableCell>
                        <TableCell>{record.pakaiBsubsidi ? "Ya" : "Tidak"}</TableCell>
                        <TableCell>
                          <button onClick={() => handlePlantingDelete(record.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </TabsContent>

          {/* Daftar Panen Tab */}
          <TabsContent value="panen" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-semibold mb-4">Form Pencatatan Panen</h2>
              <form onSubmit={handleHarvestSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="plantingRecordId">Pilih Data Tanam</Label>
                  <Select value={harvestFormData.plantingRecordId} onValueChange={(value) => handleHarvestSelectChange("plantingRecordId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih data tanam untuk panen" />
                    </SelectTrigger>
                    <SelectContent>
                      {plantingRecordsList.map(record => (
                        <SelectItem key={record.id} value={record.id}>
                          {record.id} - {record.komoditas} ({record.luasTanam} Ha)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPlantingRecord && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Komoditas</p>
                        <p className="font-semibold">{selectedPlantingRecord.komoditas}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Luas Tanam</p>
                        <p className="font-semibold">{selectedPlantingRecord.luasTanam} Ha</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tanggal Tanam</p>
                        <p className="font-semibold">{selectedPlantingRecord.tanggalTanam}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Jenis Benih</p>
                        <p className="font-semibold">{selectedPlantingRecord.jenisBenih}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tanggalPanen">Tanggal Panen</Label>
                    <Input
                      id="tanggalPanen"
                      name="tanggalPanen"
                      type="date"
                      value={harvestFormData.tanggalPanen}
                      onChange={handleHarvestInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalHasilPanen">Total Hasil Panen (Kg)</Label>
                    <Input
                      id="totalHasilPanen"
                      name="totalHasilPanen"
                      type="number"
                      step="100"
                      placeholder="Contoh: 12500"
                      value={harvestFormData.totalHasilPanen}
                      onChange={handleHarvestInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hargaJual">Harga Jual per Kg (Rp)</Label>
                  <Input
                    id="hargaJual"
                    name="hargaJual"
                    type="number"
                    step="100"
                    placeholder="Contoh: 5000"
                    value={harvestFormData.hargaJual}
                    onChange={handleHarvestInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={!selectedPlantingRecord}>Simpan Pencatatan Panen</Button>
              </form>
            </motion.div>

            {harvestSubmitted && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-6 bg-success/10 rounded-lg">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-sm text-success">Pencatatan panen berhasil disimpan!</p>
              </motion.div>
            )}

            {harvestRecordsList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4">Riwayat Pencatatan Panen</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Luas Panen</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Hasil (Kg)</TableHead>
                      <TableHead>Harga (Rp/Kg)</TableHead>
                      <TableHead>Total Penjualan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {harvestRecordsList.map(record => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs">{record.id}</TableCell>
                        <TableCell>{record.luasPanen} Ha</TableCell>
                        <TableCell>{record.tanggalPanen}</TableCell>
                        <TableCell>{record.totalHasilPanen.toLocaleString()}</TableCell>
                        <TableCell>Rp {record.hargaJual.toLocaleString()}</TableCell>
                        <TableCell>Rp {record.totalPenjualan.toLocaleString()}</TableCell>
                        <TableCell>
                          <button onClick={() => handleHarvestDelete(record.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
