import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ongoingSubsidyPrograms } from "@/data/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, FileUp, Badge as BadgeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SubsidyApplication {
  id: string;
  programSubsidi: string;
  komoditas: string;
  luasLahan: number;
  lokasiLahan: string;
  jenisBantuan: string;
  jumlahDibutuhkan: number;
  estimasiBiaya: number;
  alasanPengajuan: string;
  tanggalPengajuan: string;
  status: "menunggu" | "diproses" | "disetujui" | "ditolak";
  catatanPetugas?: string;
  dokumenFile?: string;
  fotoKtp?: string;
  fotoLahan?: string;
}

const mockApplications: SubsidyApplication[] = [
  {
    id: "PEN001",
    programSubsidi: "Program Subsidi Padi Organik",
    komoditas: "Padi",
    luasLahan: 1.5,
    lokasiLahan: "Desa Maju, Cirebon",
    jenisBantuan: "Bibit",
    jumlahDibutuhkan: 100,
    estimasiBiaya: 5000000,
    alasanPengajuan: "Membutuhkan bibit padi berkualitas untuk musim tanam berikutnya",
    tanggalPengajuan: "2024-02-20",
    status: "diproses",
    catatanPetugas: "Sedang dalam tahap verifikasi data",
    fotoKtp: "ktp_ahmad.jpg",
    fotoLahan: "lahan_padi.jpg",
  },
  {
    id: "PEN002",
    programSubsidi: "Program Subsidi Jagung Berkelanjutan",
    komoditas: "Jagung",
    luasLahan: 2.0,
    lokasiLahan: "Desa Sejahtera, Bandung",
    jenisBantuan: "Pupuk",
    jumlahDibutuhkan: 500,
    estimasiBiaya: 3500000,
    alasanPengajuan: "Pupuk organik untuk meningkatkan produktivitas tanah",
    tanggalPengajuan: "2024-02-18",
    status: "disetujui",
    catatanPetugas: "Permohonan disetujui. Subsidi dapat diambil di kantor UPTD.",
    fotoKtp: "ktp_dewi.jpg",
    fotoLahan: "lahan_jagung.jpg",
  },
  {
    id: "PEN003",
    programSubsidi: "Program Subsidi Kedelai Premium",
    komoditas: "Kedelai",
    luasLahan: 1.0,
    lokasiLahan: "Desa Murni, Sukabumi",
    jenisBantuan: "Alat Pertanian",
    jumlahDibutuhkan: 1,
    estimasiBiaya: 8000000,
    alasanPengajuan: "Pembelian mesin pengolah kedelai untuk meningkatkan efisiensi",
    tanggalPengajuan: "2024-02-15",
    status: "ditolak",
    catatanPetugas: "Aset yang diminta tidak sesuai dengan kriteria program ini.",
    fotoKtp: "ktp_budi.jpg",
    fotoLahan: "lahan_kedelai.jpg",
  },
  {
    id: "PEN004",
    programSubsidi: "Program Subsidi Cabai Merah",
    komoditas: "Cabai",
    luasLahan: 0.5,
    lokasiLahan: "Desa Indah, Garut",
    jenisBantuan: "Dana Bantuan",
    jumlahDibutuhkan: 1,
    estimasiBiaya: 4000000,
    alasanPengajuan: "Dana untuk membeli sarana produksi dan biaya operasional",
    tanggalPengajuan: "2024-02-10",
    status: "menunggu",
    catatanPetugas: "Menunggu jadwal verifikasi lapangan",
    fotoKtp: "ktp_siti.jpg",
    fotoLahan: "lahan_cabai.jpg",
  },
];

export default function PengajuanSubsidiPage() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [applications, setApplications] = useState<SubsidyApplication[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<SubsidyApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [formData, setFormData] = useState({
    programSubsidi: "",
    komoditas: "",
    luasLahan: "",
    lokasiLahan: "",
    jenisBantuan: "",
    jumlahDibutuhkan: "",
    estimasiBiaya: "",
    alasanPengajuan: "",
    dokumenFile: "",
    fotoKtp: "",
    fotoLahan: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        dokumenFile: file.name,
      }));
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!formData.programSubsidi || !formData.komoditas || !formData.luasLahan || !formData.lokasiLahan || 
        !formData.jenisBantuan || !formData.jumlahDibutuhkan || !formData.estimasiBiaya || !formData.alasanPengajuan) {
      toast({
        title: "Validasi Gagal!",
        description: "Semua field harus diisi",
      });
      return;
    }

    const newApp: SubsidyApplication = {
      id: `PEN${String(applications.length + 1).padStart(3, "0")}`,
      programSubsidi: formData.programSubsidi,
      komoditas: formData.komoditas,
      luasLahan: parseFloat(formData.luasLahan),
      lokasiLahan: formData.lokasiLahan,
      jenisBantuan: formData.jenisBantuan,
      jumlahDibutuhkan: parseFloat(formData.jumlahDibutuhkan),
      estimasiBiaya: parseFloat(formData.estimasiBiaya),
      alasanPengajuan: formData.alasanPengajuan,
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "menunggu",
      catatanPetugas: "Menunggu untuk diproses",
      dokumenFile: formData.dokumenFile,
      fotoKtp: formData.fotoKtp,
      fotoLahan: formData.fotoLahan,
    };

    setApplications([newApp, ...applications]);
    toast({
      title: "Pengajuan Subsidi Berhasil!",
      description: "Pengajuan Anda telah diterima dan akan diproses segera.",
    });

    setFormData({
      programSubsidi: "",
      komoditas: "",
      luasLahan: "",
      lokasiLahan: "",
      jenisBantuan: "",
      jumlahDibutuhkan: "",
      estimasiBiaya: "",
      alasanPengajuan: "",
      dokumenFile: "",
      fotoKtp: "",
      fotoLahan: "",
    });
  };

  const handleDetailClick = (app: SubsidyApplication) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "disetujui":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "menunggu":
        return "Menunggu Verifikasi";
      case "diproses":
        return "Diproses";
      case "disetujui":
        return "Disetujui";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Pengajuan Subsidi Pertanian</h1>
        <p className="text-sm text-muted-foreground">Ajukan permohonan subsidi untuk mendukung usaha pertanian Anda.</p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="form">Form Pengajuan</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Pengajuan</TabsTrigger>
        </TabsList>

        {/* Form Pengajuan Tab */}
        <TabsContent value="form" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold mb-4">Form Pengajuan Subsidi</h2>
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Program Subsidi */}
                <div>
                  <Label htmlFor="programSubsidi">Program Subsidi</Label>
                  <Select value={formData.programSubsidi} onValueChange={(value) => handleSelectChange("programSubsidi", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program subsidi" />
                    </SelectTrigger>
                    <SelectContent>
                      {ongoingSubsidyPrograms.map(p => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Komoditas */}
                <div>
                  <Label htmlFor="komoditas">Komoditas</Label>
                  <Select value={formData.komoditas} onValueChange={(value) => handleSelectChange("komoditas", value)}>
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

                {/* Luas Lahan */}
                <div>
                  <Label htmlFor="luasLahan">Luas Lahan (ha)</Label>
                  <Input
                    id="luasLahan"
                    name="luasLahan"
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 1.5"
                    value={formData.luasLahan}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Lokasi Lahan */}
                <div>
                  <Label htmlFor="lokasiLahan">Lokasi Lahan</Label>
                  <Input
                    id="lokasiLahan"
                    name="lokasiLahan"
                    type="text"
                    placeholder="Contoh: Desa X, Kecamatan Y, Kab. Z"
                    value={formData.lokasiLahan}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Jenis Bantuan */}
                <div>
                  <Label htmlFor="jenisBantuan">Jenis Bantuan</Label>
                  <Select value={formData.jenisBantuan} onValueChange={(value) => handleSelectChange("jenisBantuan", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis bantuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bibit">Bibit</SelectItem>
                      <SelectItem value="Pupuk">Pupuk</SelectItem>
                      <SelectItem value="Alat Pertanian">Alat Pertanian</SelectItem>
                      <SelectItem value="Dana Bantuan">Dana Bantuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Jumlah yang Dibutuhkan */}
                <div>
                  <Label htmlFor="jumlahDibutuhkan">Jumlah yang Dibutuhkan</Label>
                  <Input
                    id="jumlahDibutuhkan"
                    name="jumlahDibutuhkan"
                    type="number"
                    placeholder="Contoh: 100"
                    value={formData.jumlahDibutuhkan}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Estimasi Biaya */}
                <div>
                  <Label htmlFor="estimasiBiaya">Estimasi Biaya (Rp)</Label>
                  <Input
                    id="estimasiBiaya"
                    name="estimasiBiaya"
                    type="number"
                    placeholder="Contoh: 5000000"
                    value={formData.estimasiBiaya}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Alasan Pengajuan */}
              <div>
                <Label htmlFor="alasanPengajuan">Alasan Pengajuan</Label>
                <Textarea
                  id="alasanPengajuan"
                  name="alasanPengajuan"
                  placeholder="Jelaskan alasan pengajuan subsidi ini dengan detail..."
                  value={formData.alasanPengajuan}
                  onChange={handleInputChange}
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Upload Dokumen Pendukung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Foto KTP */}
                <div>
                  <Label htmlFor="fotoKtp">Foto KTP</Label>
                  <div className="space-y-2">
                    <input
                      id="fotoKtp"
                      name="fotoKtp"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.fotoKtp && (
                      <span className="text-sm text-green-600">✓ {formData.fotoKtp}</span>
                    )}
                    <p className="text-xs text-muted-foreground">Format: JPG / PNG</p>
                  </div>
                </div>

                {/* Foto Lahan */}
                <div>
                  <Label htmlFor="fotoLahan">Foto Lahan</Label>
                  <div className="space-y-2">
                    <input
                      id="fotoLahan"
                      name="fotoLahan"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.fotoLahan && (
                      <span className="text-sm text-green-600">✓ {formData.fotoLahan}</span>
                    )}
                    <p className="text-xs text-muted-foreground">Format: JPG / PNG</p>
                  </div>
                </div>
              </div>

              {/* Dokumen Pendukung */}
              <div>
                <Label htmlFor="dokumen">Dokumen Pendukung (Opsional)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileRef}
                      id="dokumen"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                      <FileUp className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    {formData.dokumenFile && (
                      <span className="text-sm text-green-600">✓ {formData.dokumenFile}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Format: PDF / JPG / PNG</p>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit Pengajuan
              </Button>
            </form>
          </motion.div>
        </TabsContent>

        {/* Riwayat Pengajuan Tab */}
        <TabsContent value="riwayat" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold mb-4">Riwayat Pengajuan Subsidi</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.programSubsidi}</TableCell>
                      <TableCell>{app.komoditas}</TableCell>
                      <TableCell className="text-sm">{app.tanggalPengajuan}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(app.status)}>
                          {getStatusLabel(app.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDetailClick(app)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan Subsidi</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Program Subsidi</p>
                  <p className="text-sm font-medium">{selectedApplication.programSubsidi}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Komoditas</p>
                  <p className="text-sm font-medium">{selectedApplication.komoditas}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Luas Lahan</p>
                  <p className="text-sm font-medium">{selectedApplication.luasLahan} ha</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Lokasi Lahan</p>
                  <p className="text-sm font-medium">{selectedApplication.lokasiLahan}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Jenis Bantuan</p>
                  <p className="text-sm font-medium">{selectedApplication.jenisBantuan}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Estimasi Biaya</p>
                  <p className="text-sm font-medium">Rp {selectedApplication.estimasiBiaya.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground">Alasan Pengajuan</p>
                <p className="text-sm font-medium">{selectedApplication.alasanPengajuan}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <Badge className={getStatusBadgeColor(selectedApplication.status)}>
                    {getStatusLabel(selectedApplication.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Foto KTP</p>
                  <p className="text-sm text-gray-600">{selectedApplication.fotoKtp || "Tidak ada"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Foto Lahan</p>
                  <p className="text-sm text-gray-600">{selectedApplication.fotoLahan || "Tidak ada"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground">Catatan dari Petugas</p>
                <p className="text-sm bg-gray-50 rounded p-3">{selectedApplication.catatanPetugas || "Belum ada catatan"}</p>
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}>
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

