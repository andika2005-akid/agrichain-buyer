import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { plantingRecords } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function DaftarTanamPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<PlantingRecord[]>(plantingRecords);
  const [formData, setFormData] = useState({
    luasTanam: "",
    tanggalTanam: "",
    jenisBenih: "",
    komoditas: "",
    pakaiBsubsidi: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    const newRecord: PlantingRecord = {
      id: `T${String(records.length + 1).padStart(3, "0")}`,
      farmerId: "F001",
      farmerName: "Ahmad Suryadi",
      luasTanam: parseFloat(formData.luasTanam),
      tanggalTanam: formData.tanggalTanam,
      jenisBenih: formData.jenisBenih,
      komoditas: formData.komoditas,
      pakaiBsubsidi: formData.pakaiBsubsidi,
      createdAt: new Date().toLocaleString("id-ID"),
    };

    setRecords([newRecord, ...records]);
    setSubmitted(true);
    toast({
      title: "Pencatatan Tanam Berhasil!",
      description: "Data tanam Anda telah tersimpan dalam sistem.",
    });

    setFormData({
      luasTanam: "",
      tanggalTanam: "",
      jenisBenih: "",
      komoditas: "",
      pakaiBsubsidi: false,
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    toast({
      title: "Data Dihapus",
      description: "Pencatatan tanam telah dihapus.",
    });
  };

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-success-foreground" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground">Pencatatan Tanam Tersimpan!</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Data tanam Anda telah dicatat dan dapat dipantau di dashboard.
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
        <h1 className="text-2xl font-bold font-display text-foreground">Daftar Tanam</h1>
        <p className="text-sm text-muted-foreground">Catat informasi tanam Anda untuk monitoring hasil panen</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-xl p-6 shadow-card space-y-5"
      >
        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Informasi Tanam Baru</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Total Luas Ditanam (Ha)</Label>
            <Input type="number" step="0.1" placeholder="2.5" name="luasTanam" value={formData.luasTanam} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tanggal Tanam</Label>
            <Input type="date" name="tanggalTanam" value={formData.tanggalTanam} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Jenis Benih</Label>
            <Select value={formData.jenisBenih} onValueChange={(value) => handleSelectChange("jenisBenih", value)}>
              <SelectTrigger><SelectValue placeholder="Pilih jenis benih" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="benih-unggul">Benih Unggul Bersertifikat</SelectItem>
                <SelectItem value="benih-lokal">Benih Lokal</SelectItem>
                <SelectItem value="benih-hibrida">Benih Hibrida</SelectItem>
                <SelectItem value="benih-organik">Benih Organik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
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

        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border border-border">
          <Checkbox 
            id="subsidi" 
            checked={formData.pakaiBsubsidi} 
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pakaiBsubsidi: checked as boolean }))} 
          />
          <Label htmlFor="subsidi" className="text-sm cursor-pointer">
            Apakah menggunakan subsidi untuk tanam ini?
          </Label>
        </div>

        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
          Simpan Pencatatan Tanam
        </Button>
      </motion.form>

      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">Riwayat Pencatatan Tanam</h3>
            <p className="text-xs text-muted-foreground mt-1">Total: {records.length} pencatatan</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Tanggal Tanam</TableHead>
                  <TableHead>Luas (Ha)</TableHead>
                  <TableHead>Komoditas</TableHead>
                  <TableHead>Jenis Benih</TableHead>
                  <TableHead>Subsidi</TableHead>
                  <TableHead>Tgl Dicatat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, idx) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-xs">{idx + 1}</TableCell>
                    <TableCell className="text-xs">{record.tanggalTanam}</TableCell>
                    <TableCell className="text-xs">{record.luasTanam}</TableCell>
                    <TableCell className="text-xs font-medium">{record.komoditas}</TableCell>
                    <TableCell className="text-xs">{record.jenisBenih.replace("benih-", "").replace("-", " ")}</TableCell>
                    <TableCell className="text-xs">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${record.pakaiBsubsidi ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {record.pakaiBsubsidi ? "Ya" : "Tidak"}
                      </span>
                    </TableCell>
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
