import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { harvestRecords } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function DaftarPanenPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<HarvestRecord[]>(harvestRecords);
  const [formData, setFormData] = useState({
    luasPanen: "",
    tanggalPanen: "",
    totalHasilPanen: "",
    hargaJual: "",
    komoditas: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const luasPanen = parseFloat(formData.luasPanen);
    const totalHasilPanen = parseFloat(formData.totalHasilPanen);
    const hargaJual = parseFloat(formData.hargaJual);
    const totalPenjualan = totalHasilPanen * hargaJual;

    const newRecord: HarvestRecord = {
      id: `H${String(records.length + 1).padStart(3, "0")}`,
      farmerId: "F001",
      farmerName: "Ahmad Suryadi",
      luasPanen,
      tanggalPanen: formData.tanggalPanen,
      totalHasilPanen,
      hargaJual,
      komoditas: formData.komoditas,
      totalPenjualan,
      createdAt: new Date().toLocaleString("id-ID"),
    };

    setRecords([newRecord, ...records]);
    setSubmitted(true);
    toast({
      title: "Pencatatan Panen Berhasil!",
      description: "Data panen Anda telah tersimpan dalam sistem.",
    });

    setFormData({
      luasPanen: "",
      tanggalPanen: "",
      totalHasilPanen: "",
      hargaJual: "",
      komoditas: "",
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    toast({
      title: "Data Dihapus",
      description: "Pencatatan panen telah dihapus.",
    });
  };

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-success-foreground" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground">Pencatatan Panen Tersimpan!</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Data panen Anda telah dicatat dan dapat diakses kapan saja.
          </p>
          <Button onClick={() => setSubmitted(false)} className="gradient-primary text-primary-foreground">
            Catat Lagi
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Daftar Panen</h1>
        <p className="text-sm text-muted-foreground">Catat hasil panen dan informasi penjualan Anda</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-xl p-6 shadow-card space-y-5"
      >
        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Informasi Panen Baru</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Luas Dipanen (Ha)</Label>
            <Input type="number" step="0.1" placeholder="2.5" name="luasPanen" value={formData.luasPanen} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tanggal Panen</Label>
            <Input type="date" name="tanggalPanen" value={formData.tanggalPanen} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Total Hasil Panen (Kg)</Label>
            <Input type="number" step="0.01" placeholder="Contoh: 5000" name="totalHasilPanen" value={formData.totalHasilPanen} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Harga Jual per Kg (Rp)</Label>
            <Input type="number" step="0.01" placeholder="Contoh: 5000" name="hargaJual" value={formData.hargaJual} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Komoditas</Label>
            <Select value={formData.komoditas} onValueChange={(value) => handleSelectChange("komoditas", value)}>
              <SelectTrigger><SelectValue placeholder="Pilih komoditas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="padi">Padi</SelectItem>
                <SelectItem value="jagung">Jagung</SelectItem>
                <SelectItem value="kedelai">Kedelai</SelectItem>
                <SelectItem value="sayuran">Sayuran</SelectItem>
                <SelectItem value="buah">Buah-buahan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
          Simpan Pencatatan Panen
        </Button>
      </motion.form>

      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">Riwayat Pencatatan Panen</h3>
            <p className="text-xs text-muted-foreground mt-1">Total: {records.length} pencatatan</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Tanggal Panen</TableHead>
                  <TableHead>Luas (Ha)</TableHead>
                  <TableHead>Komoditas</TableHead>
                  <TableHead>Hasil (Kg)</TableHead>
                  <TableHead>Harga/Kg (Rp)</TableHead>
                  <TableHead>Total Penjualan (Rp)</TableHead>
                  <TableHead>Tgl Dicatat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, idx) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-xs">{idx + 1}</TableCell>
                    <TableCell className="text-xs">{record.tanggalPanen}</TableCell>
                    <TableCell className="text-xs">{record.luasPanen}</TableCell>
                    <TableCell className="text-xs font-medium">{record.komoditas}</TableCell>
                    <TableCell className="text-xs">{record.totalHasilPanen.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-xs">{record.hargaJual.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-xs font-semibold text-green-600">{record.totalPenjualan.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{record.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
