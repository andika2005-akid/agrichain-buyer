import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Eye, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface KURApplication {
  id: string;
  komoditas: string;
  luasLahan: number;
  lokasiLahan: string;
  lamaUsaha: number;
  jumlahPinjaman: number;
  tujuanPenggunaan: string;
  estimasiPendapatan: number;
  estimasiBiayaProduksi: number;
  musimTanam: string;
  estimasiWaktuPanen: string;
  tanggalPengajuan: string;
  status: "menunggu" | "dianalisis" | "disetujui" | "ditolak";
  catatanBank?: string;
}

const mockApplications: KURApplication[] = [
  {
    id: "KUR001",
    komoditas: "Padi",
    luasLahan: 2.0,
    lokasiLahan: "Desa Sejahtera, Bandung",
    lamaUsaha: 5,
    jumlahPinjaman: 50000000,
    tujuanPenggunaan: "Pembelian Alat Pertanian",
    estimasiPendapatan: 75000000,
    estimasiBiayaProduksi: 35000000,
    musimTanam: "Padi Sawah Musim Tanam I",
    estimasiWaktuPanen: "2024-05-15",
    tanggalPengajuan: "2024-02-20",
    status: "dianalisis",
    catatanBank: "Sedang dalam proses penilaian",
  },
  {
    id: "KUR002",
    komoditas: "Jagung",
    luasLahan: 1.5,
    lokasiLahan: "Desa Maju, Cirebon",
    lamaUsaha: 3,
    jumlahPinjaman: 30000000,
    tujuanPenggunaan: "Pembelian Bibit",
    estimasiPendapatan: 45000000,
    estimasiBiayaProduksi: 20000000,
    musimTanam: "Jagung Musim Tanam II",
    estimasiWaktuPanen: "2024-06-10",
    tanggalPengajuan: "2024-02-18",
    status: "disetujui",
    catatanBank: "Pengajuan disetujui.",
  },
  {
    id: "KUR003",
    komoditas: "Cabai Merah",
    luasLahan: 0.5,
    lokasiLahan: "Desa Indah, Garut",
    lamaUsaha: 2,
    jumlahPinjaman: 20000000,
    tujuanPenggunaan: "Modal Operasional",
    estimasiPendapatan: 35000000,
    estimasiBiayaProduksi: 15000000,
    musimTanam: "Cabai Musim Tanam I",
    estimasiWaktuPanen: "2024-04-20",
    tanggalPengajuan: "2024-02-15",
    status: "ditolak",
    catatanBank: "Lama usaha kurang dari 3 tahun.",
  },
  {
    id: "KUR004",
    komoditas: "Kedelai",
    luasLahan: 1.8,
    lokasiLahan: "Desa Murni, Sukabumi",
    lamaUsaha: 4,
    jumlahPinjaman: 40000000,
    tujuanPenggunaan: "Pembelian Pupuk",
    estimasiPendapatan: 60000000,
    estimasiBiayaProduksi: 28000000,
    musimTanam: "Kedelai Musim Tanam I",
    estimasiWaktuPanen: "2024-05-25",
    tanggalPengajuan: "2024-02-12",
    status: "menunggu",
    catatanBank: "Menunggu verifikasi lapangan",
  },
];

export default function PengajuanKURPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<KURApplication[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<KURApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [formData, setFormData] = useState({
    komoditas: "",
    luasLahan: "",
    lokasiLahan: "",
    lamaUsaha: "",
    jumlahPinjaman: "",
    tujuanPenggunaan: "",
    estimasiPendapatan: "",
    estimasiBiayaProduksi: "",
    musimTanam: "",
    estimasiWaktuPanen: "",
  });

  const [simulasiData, setSimulasiData] = useState({
    jumlahPinjaman: "",
    tenor: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulasiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSimulasiData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.komoditas || !formData.luasLahan || !formData.lokasiLahan || !formData.lamaUsaha ||
        !formData.jumlahPinjaman || !formData.tujuanPenggunaan || !formData.estimasiPendapatan ||
        !formData.estimasiBiayaProduksi || !formData.musimTanam || !formData.estimasiWaktuPanen) {
      toast({ title: "Validasi Gagal!", description: "Semua field harus diisi" });
      return;
    }

    const newApp: KURApplication = {
      id: `KUR${String(applications.length + 1).padStart(3, "0")}`,
      komoditas: formData.komoditas,
      luasLahan: parseFloat(formData.luasLahan),
      lokasiLahan: formData.lokasiLahan,
      lamaUsaha: parseFloat(formData.lamaUsaha),
      jumlahPinjaman: parseFloat(formData.jumlahPinjaman),
      tujuanPenggunaan: formData.tujuanPenggunaan,
      estimasiPendapatan: parseFloat(formData.estimasiPendapatan),
      estimasiBiayaProduksi: parseFloat(formData.estimasiBiayaProduksi),
      musimTanam: formData.musimTanam,
      estimasiWaktuPanen: formData.estimasiWaktuPanen,
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "menunggu",
      catatanBank: "Menunggu untuk diproses",
    };

    setApplications([newApp, ...applications]);
    toast({ title: "Pengajuan KUR Berhasil!", description: "Pengajuan Anda telah diterima." });

    setFormData({
      komoditas: "", luasLahan: "", lokasiLahan: "", lamaUsaha: "", jumlahPinjaman: "",
      tujuanPenggunaan: "", estimasiPendapatan: "", estimasiBiayaProduksi: "",
      musimTanam: "", estimasiWaktuPanen: "",
    });
  };

  const handleDetailClick = (app: KURApplication) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      menunggu: "bg-yellow-100 text-yellow-800",
      dianalisis: "bg-blue-100 text-blue-800",
      disetujui: "bg-green-100 text-green-800",
      ditolak: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      menunggu: "Menunggu Verifikasi",
      dianalisis: "Sedang Dianalisis",
      disetujui: "Disetujui",
      ditolak: "Ditolak",
    };
    return labels[status] || status;
  };

  const calculateCicilan = () => {
    if (!simulasiData.jumlahPinjaman || !simulasiData.tenor) return 0;
    const bunga = 6;
    const pinjamanAmount = parseFloat(simulasiData.jumlahPinjaman);
    const tenorMonths = parseFloat(simulasiData.tenor);
    const bungaBulan = (bunga / 100) / 12;
    return (pinjamanAmount * bungaBulan * Math.pow(1 + bungaBulan, tenorMonths)) / (Math.pow(1 + bungaBulan, tenorMonths) - 1);
  };

  const cicilanAmount = calculateCicilan();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Pengajuan KUR</h1>
        <p className="text-sm text-muted-foreground">Ajukan kredit untuk modal usaha pertanian Anda.</p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="form">Form Pengajuan</TabsTrigger>
          <TabsTrigger value="simulasi">Simulasi Kredit</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold mb-6">Form Pengajuan KUR</h2>
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                  Data Usaha
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Komoditas</Label>
                    <Select value={formData.komoditas || "Padi"} onValueChange={(v) => handleSelectChange("komoditas", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Padi">Padi</SelectItem>
                        <SelectItem value="Jagung">Jagung</SelectItem>
                        <SelectItem value="Kedelai">Kedelai</SelectItem>
                        <SelectItem value="Bawang">Bawang</SelectItem>
                        <SelectItem value="Cabai">Cabai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Luas Lahan (ha)</Label>
                    <Input name="luasLahan" type="number" step="0.1" placeholder="2.5" value={formData.luasLahan} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Lokasi Lahan</Label>
                    <Input name="lokasiLahan" placeholder="Desa X, Kec Y" value={formData.lokasiLahan} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Lama Usaha (tahun)</Label>
                    <Input name="lamaUsaha" type="number" placeholder="5" value={formData.lamaUsaha} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                  Data Pembiayaan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Jumlah Pinjaman (Rp)</Label>
                    <Input name="jumlahPinjaman" type="number" placeholder="50000000" value={formData.jumlahPinjaman} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Tujuan Penggunaan Dana</Label>
                    <Select value={formData.tujuanPenggunaan} onValueChange={(v) => handleSelectChange("tujuanPenggunaan", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pembelian Bibit">Pembelian Bibit</SelectItem>
                        <SelectItem value="Pembelian Pupuk">Pembelian Pupuk</SelectItem>
                        <SelectItem value="Pembelian Alat Pertanian">Pembelian Alat Pertanian</SelectItem>
                        <SelectItem value="Modal Operasional">Modal Operasional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estimasi Pendapatan Panen (Rp)</Label>
                    <Input name="estimasiPendapatan" type="number" placeholder="100000000" value={formData.estimasiPendapatan} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Estimasi Biaya Produksi (Rp)</Label>
                    <Input name="estimasiBiayaProduksi" type="number" placeholder="40000000" value={formData.estimasiBiayaProduksi} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                  Data Panen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Musim Tanam</Label>
                    <Select value={formData.musimTanam || (formData.komoditas === "Padi" ? "Padi Musim Tanam I (Oktober - Januari)" : formData.komoditas === "Jagung" ? "Jagung Musim Tanam I (Oktober - Januari)" : formData.komoditas === "Kedelai" ? "Kedelai Musim Tanam I (Mei - Agustus)" : formData.komoditas === "Bawang" ? "Bawang Musim Tanam I (Agustus - November)" : formData.komoditas === "Cabai" ? "Cabai Musim Tanam I (April - Juli)" : "Padi Musim Tanam I (Oktober - Januari)")} onValueChange={(v) => handleSelectChange("musimTanam", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(formData.komoditas === "Padi" || !formData.komoditas) && (
                          <>
                            <SelectItem value="Padi Musim Tanam I (Oktober - Januari)">Padi MT I (Oktober - Januari)</SelectItem>
                            <SelectItem value="Padi Musim Tanam II (Februari - Mei)">Padi MT II (Februari - Mei)</SelectItem>
                          </>
                        )}
                        {formData.komoditas === "Jagung" && (
                          <>
                            <SelectItem value="Jagung Musim Tanam I (Oktober - Januari)">Jagung MT I (Oktober - Januari)</SelectItem>
                            <SelectItem value="Jagung Musim Tanam II (Maret - Juni)">Jagung MT II (Maret - Juni)</SelectItem>
                          </>
                        )}
                        {formData.komoditas === "Kedelai" && (
                          <>
                            <SelectItem value="Kedelai Musim Tanam I (Mei - Agustus)">Kedelai MT I (Mei - Agustus)</SelectItem>
                            <SelectItem value="Kedelai Musim Tanam II (Oktober - Januari)">Kedelai MT II (Oktober - Januari)</SelectItem>
                          </>
                        )}
                        {formData.komoditas === "Bawang" && (
                          <>
                            <SelectItem value="Bawang Musim Tanam I (Agustus - November)">Bawang MT I (Agustus - November)</SelectItem>
                            <SelectItem value="Bawang Musim Tanam II (Februari - Mei)">Bawang MT II (Februari - Mei)</SelectItem>
                          </>
                        )}
                        {formData.komoditas === "Cabai" && (
                          <>
                            <SelectItem value="Cabai Musim Tanam I (April - Juli)">Cabai MT I (April - Juli)</SelectItem>
                            <SelectItem value="Cabai Musim Tanam II (Oktober - Januari)">Cabai MT II (Oktober - Januari)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estimasi Waktu Panen</Label>
                    <Input name="estimasiWaktuPanen" type="date" value={formData.estimasiWaktuPanen} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
                  Upload Dokumen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Upload KTP</Label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                  </div>
                  <div>
                    <Label>Upload Foto Lahan</Label>
                    <input type="file" accept=".jpg,.jpeg,.png" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                  </div>
                  <div>
                    <Label>Upload Proposal Usaha</Label>
                    <input type="file" accept=".pdf,.doc,.docx" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Ajukan KUR</Button>
            </form>
          </motion.div>
        </TabsContent>

        <TabsContent value="simulasi" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calculator className="w-5 h-5" /> Simulasi Kredit</h2>
            <p className="text-sm text-muted-foreground mb-6">Suku bunga 6% per tahun</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label>Jumlah Pinjaman (Rp)</Label>
                <Input name="jumlahPinjaman" type="number" placeholder="50000000" value={simulasiData.jumlahPinjaman} onChange={handleSimulasiChange} />
              </div>
              <div>
                <Label>Tenor (Bulan)</Label>
                <Select value={simulasiData.tenor} onValueChange={(v) => setSimulasiData(prev => ({ ...prev, tenor: v }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 Bulan</SelectItem>
                    <SelectItem value="24">24 Bulan</SelectItem>
                    <SelectItem value="36">36 Bulan</SelectItem>
                    <SelectItem value="48">48 Bulan</SelectItem>
                    <SelectItem value="60">60 Bulan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {cicilanAmount > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 text-center">
                <p className="text-sm text-gray-600 mb-2">Estimasi Cicilan per Bulan</p>
                <p className="text-4xl font-bold text-primary mb-4">Rp {cicilanAmount.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="riwayat" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold mb-4">Riwayat Pengajuan KUR</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Jumlah Pinjaman</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.komoditas}</TableCell>
                      <TableCell>Rp {app.jumlahPinjaman.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{app.tanggalPengajuan}</TableCell>
                      <TableCell><Badge className={getStatusBadgeColor(app.status)}>{getStatusLabel(app.status)}</Badge></TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => handleDetailClick(app)} className="gap-1">
                          <Eye className="w-4 h-4" /> Detail
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

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Detail Pengajuan KUR</DialogTitle></DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Komoditas</p>
                  <p className="text-sm font-medium">{selectedApplication.komoditas}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Luas Lahan</p>
                  <p className="text-sm font-medium">{selectedApplication.luasLahan} ha</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Jumlah Pinjaman</p>
                  <p className="text-sm font-medium">Rp {selectedApplication.jumlahPinjaman.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Tujuan Penggunaan</p>
                  <p className="text-sm font-medium">{selectedApplication.tujuanPenggunaan}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Estimasi Pendapatan</p>
                  <p className="text-sm font-medium">Rp {selectedApplication.estimasiPendapatan.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Estimasi Panen</p>
                  <p className="text-sm font-medium">{selectedApplication.estimasiWaktuPanen}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <Badge className={getStatusBadgeColor(selectedApplication.status)}>{getStatusLabel(selectedApplication.status)}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Catatan dari Bank</p>
                <p className="text-sm bg-gray-50 rounded p-3">{selectedApplication.catatanBank || "Belum ada"}</p>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}>Tutup</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}