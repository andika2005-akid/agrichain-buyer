import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, MapPin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegistrasiPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Registrasi Berhasil!",
      description: "Data Anda sedang diverifikasi oleh Admin Dinas Pertanian.",
    });
  };

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-success-foreground" />
          </div>
          <h2 className="text-xl font-bold font-display text-foreground">Registrasi Terkirim!</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Pengajuan Anda sedang diproses.
          </p>
          <Button onClick={() => setSubmitted(false)} className="gradient-primary text-primary-foreground">
            Ajukan Lagi
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Registrasi Petani</h1>
        <p className="text-sm text-muted-foreground">Lengkapi data untuk pengajuan subsidi pertanian</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-xl p-6 shadow-card space-y-5"
      >
        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Data Identitas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nama Lengkap</Label>
            <Input placeholder="Masukkan nama lengkap" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">NIK (16 digit)</Label>
            <Input placeholder="3201xxxxxxxxxxxx" maxLength={16} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">NPWP</Label>
            <Input placeholder="12.345.678.9-123.000" maxLength={15} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kode Negara</Label>
            <Input placeholder="ID" maxLength={2} defaultValue="ID" required />
          </div>
        </div>

        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2 pt-2">Alamat & Lokasi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nama Desa</Label>
            <Input placeholder="Masukkan nama desa" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kecamatan</Label>
            <Input placeholder="Masukkan nama kecamatan" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kota</Label>
            <Input placeholder="Masukkan nama kota" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kode Pos</Label>
            <Input placeholder="40123" maxLength={5} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Provinsi</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Pilih provinsi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jabar">Jawa Barat</SelectItem>
                <SelectItem value="jateng">Jawa Tengah</SelectItem>
                <SelectItem value="jatim">Jawa Timur</SelectItem>
                <SelectItem value="sulsel">Sulawesi Selatan</SelectItem>
                <SelectItem value="sumut">Sumatera Utara</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2 pt-2">Data Rekening</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Nomor Rekening (10-16 digit)</Label>
            <Input placeholder="Masukkan nomor rekening" maxLength={16} required />
          </div>
        </div>



        <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
          Daftar
        </Button>
      </motion.form>
    </div>
  );
}
