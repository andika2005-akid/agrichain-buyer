import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Proposal {
  id: string;
  namaUsaha: string;
  komoditas: string;
  luasLahan: number;
  lokasiLahan: string;
  lamaUsaha: number;
  danaDibutuhkan: number;
  tujuanPendanaan: string;
  estimasiKeuntungan: number;
  estimasiWaktuPanen: string;
  musimTanam: string;
  targetProduksi: number;
  estimasiHasilPanen: number;
  deskripsiUsaha: string;
  tanggalPengajuan: string;
  status: "menunggu" | "ditinjau" | "diterima" | "ditolak";
  catatanInvestor?: string;
}

const mockProposals: Proposal[] = [
  {
    id: "PROP001",
    namaUsaha: "Pertanian Subur Jaya",
    komoditas: "Padi",
    luasLahan: 2.5,
    lokasiLahan: "Desa Sejahtera, Bandung",
    lamaUsaha: 5,
    danaDibutuhkan: 50000000,
    tujuanPendanaan: "Perluasan Lahan",
    estimasiKeuntungan: 75000000,
    estimasiWaktuPanen: "2026-05-15",
    musimTanam: "Padi MT I",
    targetProduksi: 15000,
    estimasiHasilPanen: 12500,
    deskripsiUsaha: "Pengembangan pertanian padi dengan teknologi irigasi modern",
    tanggalPengajuan: "2026-02-20",
    status: "ditinjau",
    catatanInvestor: "Sedang dalam tahap evaluasi kelayakan",
  },
  {
    id: "PROP002",
    namaUsaha: "Jagung Maju Bersama",
    komoditas: "Jagung",
    luasLahan: 1.8,
    lokasiLahan: "Desa Maju, Cirebon",
    lamaUsaha: 3,
    danaDibutuhkan: 35000000,
    tujuanPendanaan: "Pembelian Bibit",
    estimasiKeuntungan: 48000000,
    estimasiWaktuPanen: "2026-06-10",
    musimTanam: "Jagung MT II",
    targetProduksi: 12000,
    estimasiHasilPanen: 10800,
    deskripsiUsaha: "Budidaya jagung berkualitas tinggi untuk pasar ekspor",
    tanggalPengajuan: "2026-02-18",
    status: "diterima",
    catatanInvestor: "Proposal diterima dan siap untuk pendanaan",
  },
  {
    id: "PROP003",
    namaUsaha: "Kedelai Organik Nusantara",
    komoditas: "Kedelai",
    luasLahan: 1.2,
    lokasiLahan: "Desa Indah, Garut",
    lamaUsaha: 2,
    danaDibutuhkan: 28000000,
    tujuanPendanaan: "Pembelian Alat Pertanian",
    estimasiKeuntungan: 42000000,
    estimasiWaktuPanen: "2026-08-20",
    musimTanam: "Kedelai MT I",
    targetProduksi: 8000,
    estimasiHasilPanen: 7200,
    deskripsiUsaha: "Pertanian kedelai organik bersertifikat internasional",
    tanggalPengajuan: "2026-02-15",
    status: "menunggu",
    catatanInvestor: undefined,
  },
];

export default function PengajuanProposalPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [formData, setFormData] = useState({
    namaUsaha: "",
    komoditas: "",
    luasLahan: "",
    lokasiLahan: "",
    lamaUsaha: "",
    danaDibutuhkan: "",
    tujuanPendanaan: "",
    estimasiKeuntungan: "",
    estimasiWaktuPanen: "",
    musimTanam: "",
    targetProduksi: "",
    estimasiHasilPanen: "",
    deskripsiUsaha: "",
    uploadProposal: "",
    uploadFotoLahan: "",
    uploadFotoTanaman: "",
    uploadDokumenPendukung: "",
  });

  const [simulasiData, setSimulasiData] = useState({
    danaDiminta: "",
    estimasiKeuntungan: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaUsaha || !formData.komoditas || !formData.luasLahan || !formData.lokasiLahan ||
        !formData.lamaUsaha || !formData.danaDibutuhkan || !formData.tujuanPendanaan ||
        !formData.estimasiKeuntungan || !formData.estimasiWaktuPanen || !formData.musimTanam ||
        !formData.targetProduksi || !formData.estimasiHasilPanen || !formData.deskripsiUsaha) {
      toast({ title: "Validasi Gagal!", description: "Semua field harus diisi" });
      return;
    }

    const newProposal: Proposal = {
      id: `PROP${String(proposals.length + 1).padStart(3, "0")}`,
      namaUsaha: formData.namaUsaha,
      komoditas: formData.komoditas,
      luasLahan: parseFloat(formData.luasLahan),
      lokasiLahan: formData.lokasiLahan,
      lamaUsaha: parseFloat(formData.lamaUsaha),
      danaDibutuhkan: parseFloat(formData.danaDibutuhkan),
      tujuanPendanaan: formData.tujuanPendanaan,
      estimasiKeuntungan: parseFloat(formData.estimasiKeuntungan),
      estimasiWaktuPanen: formData.estimasiWaktuPanen,
      musimTanam: formData.musimTanam,
      targetProduksi: parseFloat(formData.targetProduksi),
      estimasiHasilPanen: parseFloat(formData.estimasiHasilPanen),
      deskripsiUsaha: formData.deskripsiUsaha,
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "menunggu",
      catatanInvestor: "Menunggu review dari investor",
    };

    setProposals([newProposal, ...proposals]);
    toast({ title: "Proposal Terkirim!", description: "Proposal Anda telah dikirim dan sedang menunggu review." });

    setFormData({
      namaUsaha: "", komoditas: "", luasLahan: "", lokasiLahan: "", lamaUsaha: "",
      danaDibutuhkan: "", tujuanPendanaan: "", estimasiKeuntungan: "", estimasiWaktuPanen: "",
      musimTanam: "", targetProduksi: "", estimasiHasilPanen: "", deskripsiUsaha: "",
      uploadProposal: "", uploadFotoLahan: "", uploadFotoTanaman: "", uploadDokumenPendukung: "",
    });
  };

  const handleDetailClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowDetailModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      menunggu: "bg-yellow-100 text-yellow-800",
      ditinjau: "bg-blue-100 text-blue-800",
      diterima: "bg-green-100 text-green-800",
      ditolak: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      menunggu: "Menunggu Review",
      ditinjau: "Sedang Ditinjau",
      diterima: "Diterima",
      ditolak: "Ditolak",
    };
    return labels[status] || status;
  };

  const calculateROI = () => {
    if (!simulasiData.danaDiminta || !simulasiData.estimasiKeuntungan) return 0;
    const dana = parseFloat(simulasiData.danaDiminta);
    const keuntungan = parseFloat(simulasiData.estimasiKeuntungan);
    return ((keuntungan - dana) / dana) * 100;
  };

  const roiValue = calculateROI();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Ajukan Proposal Pendanaan</h1>
        <p className="text-sm text-muted-foreground">Kirim proposal untuk mendapatkan dukungan pendanaan dari investor.</p>
      </div>

      {/* Form Pengajuan */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-6">Form Pengajuan Proposal</h2>
        <form onSubmit={handleSubmitProposal} className="space-y-6">
          {/* SECTION 1: Informasi Usaha */}
          <div className="border-b pb-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
              Informasi Usaha
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nama Usaha Pertanian</Label>
                <Input name="namaUsaha" placeholder="Nama usaha" value={formData.namaUsaha} onChange={handleInputChange} required />
              </div>
              <div>
                <Label>Komoditas Utama</Label>
                <Input name="komoditas" placeholder="Padi, Jagung, dll" value={formData.komoditas} onChange={handleInputChange} required />
              </div>
              <div>
                <Label>Luas Lahan (ha)</Label>
                <Input name="luasLahan" type="number" step="0.1" placeholder="2.5" value={formData.luasLahan} onChange={handleInputChange} required />
              </div>
              <div>
                <Label>Lokasi Lahan</Label>
                <Input name="lokasiLahan" placeholder="Desa X, Kec Y" value={formData.lokasiLahan} onChange={handleInputChange} required />
              </div>
              <div className="md:col-span-2">
                <Label>Lama Usaha (tahun)</Label>
                <Input name="lamaUsaha" type="number" placeholder="5" value={formData.lamaUsaha} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          {/* SECTION 2: Rencana Pendanaan */}
          <div className="border-b pb-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
              Rencana Pendanaan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Jumlah Dana yang Dibutuhkan (Rp)</Label>
                <Input name="danaDibutuhkan" type="number" placeholder="50000000" value={formData.danaDibutuhkan} onChange={handleInputChange} required />
              </div>
              <div>
                <Label>Tujuan Pendanaan</Label>
                <Select value={formData.tujuanPendanaan} onValueChange={(v) => handleSelectChange("tujuanPendanaan", v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih tujuan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perluasan Lahan">Perluasan Lahan</SelectItem>
                    <SelectItem value="Pembelian Bibit">Pembelian Bibit</SelectItem>
                    <SelectItem value="Pembelian Alat Pertanian">Pembelian Alat Pertanian</SelectItem>
                    <SelectItem value="Modal Operasional">Modal Operasional</SelectItem>
                    <SelectItem value="Teknologi Pertanian">Teknologi Pertanian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estimasi Keuntungan per Panen (Rp)</Label>
                <Input name="estimasiKeuntungan" type="number" placeholder="75000000" value={formData.estimasiKeuntungan} onChange={handleInputChange} required />
              </div>
              <div>
                <Label>Estimasi Waktu Panen</Label>
                <Input name="estimasiWaktuPanen" type="date" value={formData.estimasiWaktuPanen} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          {/* SECTION 3: Rencana Produksi */}
          <div className="border-b pb-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
              Rencana Produksi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Musim Tanam</Label>
                <Select value={formData.musimTanam} onValueChange={(v) => handleSelectChange("musimTanam", v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih musim tanam" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Padi MT I">Padi MT I (Oktober - Januari)</SelectItem>
                    <SelectItem value="Padi MT II">Padi MT II (Februari - Mei)</SelectItem>
                    <SelectItem value="Jagung MT I">Jagung MT I (Oktober - Januari)</SelectItem>
                    <SelectItem value="Jagung MT II">Jagung MT II (Maret - Juni)</SelectItem>
                    <SelectItem value="Kedelai MT I">Kedelai MT I (Mei - Agustus)</SelectItem>
                    <SelectItem value="Kedelai MT II">Kedelai MT II (Oktober - Januari)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Produksi (kg)</Label>
                <Input name="targetProduksi" type="number" placeholder="15000" value={formData.targetProduksi} onChange={handleInputChange} required />
              </div>
              <div className="md:col-span-2">
                <Label>Estimasi Hasil Panen (kg)</Label>
                <Input name="estimasiHasilPanen" type="number" placeholder="12500" value={formData.estimasiHasilPanen} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          {/* SECTION 4: Deskripsi Usaha */}
          <div className="border-b pb-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
              Deskripsi Usaha
            </h3>
            <div>
              <Label>Deskripsi Usaha</Label>
              <Textarea name="deskripsiUsaha" placeholder="Jelaskan gambaran usaha, rencana penggunaan dana, potensi keuntungan, dan strategi penjualan" value={formData.deskripsiUsaha} onChange={handleInputChange} className="min-h-[120px]" required />
              <p className="text-xs text-muted-foreground mt-2">Sertakan informasi: gambaran usaha, rencana penggunaan dana, potensi keuntungan, dan strategi penjualan</p>
            </div>
          </div>

          {/* SECTION 5: Upload Dokumen */}
          <div>
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">5</span>
              Upload Dokumen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Upload Proposal Usaha (PDF)</Label>
                <input type="file" accept=".pdf" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
              </div>
              <div>
                <Label>Upload Foto Lahan</Label>
                <input type="file" accept=".jpg,.jpeg,.png" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
              </div>
              <div>
                <Label>Upload Foto Tanaman</Label>
                <input type="file" accept=".jpg,.jpeg,.png" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
              </div>
              <div>
                <Label>Upload Dokumen Pendukung</Label>
                <input type="file" accept=".pdf,.doc,.docx" className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">Kirim Proposal</Button>
        </form>
      </motion.div>

      {/* Card Potensi ROI Investor */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-card border border-blue-200">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Simulasi ROI Investor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Dana yang Diminta (Rp)</Label>
            <Input type="number" name="danaDiminta" placeholder="50000000" value={simulasiData.danaDiminta} onChange={handleSimulasiChange} />
          </div>
          <div>
            <Label>Estimasi Keuntungan (Rp)</Label>
            <Input type="number" name="estimasiKeuntungan" placeholder="75000000" value={simulasiData.estimasiKeuntungan} onChange={handleSimulasiChange} />
          </div>
        </div>

        {roiValue > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-6 border-2 border-green-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Estimasi ROI</p>
            <p className="text-4xl font-bold text-green-600">{roiValue.toFixed(1)}%</p>
          </motion.div>
        )}
      </motion.div>

      {/* Riwayat Proposal */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="text-lg font-semibold mb-4">Riwayat Proposal</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Dana Diminta</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map(proposal => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">{proposal.namaUsaha}</TableCell>
                  <TableCell>{proposal.komoditas}</TableCell>
                  <TableCell>Rp {proposal.danaDibutuhkan.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{proposal.tanggalPengajuan}</TableCell>
                  <TableCell><Badge className={getStatusBadgeColor(proposal.status)}>{getStatusLabel(proposal.status)}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => handleDetailClick(proposal)} className="gap-1">
                      <Eye className="w-4 h-4" /> Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Detail Proposal</DialogTitle></DialogHeader>
          {selectedProposal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Nama Usaha</p>
                  <p className="text-sm font-medium">{selectedProposal.namaUsaha}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Komoditas</p>
                  <p className="text-sm font-medium">{selectedProposal.komoditas}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Luas Lahan</p>
                  <p className="text-sm font-medium">{selectedProposal.luasLahan} ha</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Dana Diminta</p>
                  <p className="text-sm font-medium">Rp {selectedProposal.danaDibutuhkan.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Estimasi Keuntungan</p>
                  <p className="text-sm font-medium">Rp {selectedProposal.estimasiKeuntungan.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Estimasi Panen</p>
                  <p className="text-sm font-medium">{selectedProposal.estimasiWaktuPanen}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Deskripsi Usaha</p>
                <p className="text-sm bg-gray-50 rounded p-3">{selectedProposal.deskripsiUsaha}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Status Proposal</p>
                <Badge className={getStatusBadgeColor(selectedProposal.status)}>{getStatusLabel(selectedProposal.status)}</Badge>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Catatan dari Investor</p>
                <p className="text-sm bg-gray-50 rounded p-3">{selectedProposal.catatanInvestor || "Tidak ada catatan"}</p>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}>Tutup</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
