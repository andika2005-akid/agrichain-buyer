import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { kurApplications } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Search, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Proposal {
  id: string;
  farmerName: string;
  namaUsaha: string;
  komoditas: string;
  luasLahan: number;
  lokasi: string;
  lamaUsaha: number;
  danaDiminta: number;
  estimasiKeuntungan: number;
  estimasiPanen: string;
  status: string;
  dokumen: {
    proposal: string;
    fotoLahan: string;
    fotoTanaman: string;
  };
}

export default function DaftarInvestorProposalsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Transform kurApplications ke format proposal investor
  const baseProposals: Proposal[] = kurApplications.map((kur) => ({
    id: kur.id,
    farmerName: kur.farmerName,
    namaUsaha: `Usaha ${kur.farmerName}`,
    komoditas: kur.komoditas,
    luasLahan: kur.tenor / 12, // Simulate area based on tenor
    lokasi: "Jawa Barat",
    lamaUsaha: 3,
    danaDiminta: kur.jumlahPinjaman,
    estimasiKeuntungan: Math.round(kur.jumlahPinjaman * 0.4),
    estimasiPanen: "2024-06-15",
    status:
      kur.status === "approved"
        ? "disetujui"
        : kur.status === "submitted"
          ? "ditinjau"
          : "menunggu",
    dokumen: {
      proposal: `proposal_${kur.id}.pdf`,
      fotoLahan: `lahan_${kur.id}.jpg`,
      fotoTanaman: `tanaman_${kur.id}.jpg`,
    },
  }));

  // Filter states
  const [filterKomoditas, setFilterKomoditas] = useState("semua");
  const [filterLokasi, setFilterLokasi] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [searchNama, setSearchNama] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Detail modal state
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Items per page
  const itemsPerPage = 5;

  // Filter logic
  const filteredProposals = baseProposals.filter((proposal) => {
    const matchKomoditas =
      filterKomoditas === "semua" || proposal.komoditas === filterKomoditas;
    const matchLokasi = filterLokasi === "semua" || proposal.lokasi === filterLokasi;
    const matchStatus = filterStatus === "semua" || proposal.status === filterStatus;
    const matchNama = !searchNama ||
      proposal.farmerName.toLowerCase().includes(searchNama.toLowerCase());

    return matchKomoditas && matchLokasi && matchStatus && matchNama;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique values for dropdowns
  const komoditasList = Array.from(new Set(baseProposals.map((p) => p.komoditas)));
  const lokasiList = Array.from(new Set(baseProposals.map((p) => p.lokasi)));

  // Reset pagination when filters change
  const handleFilter = () => {
    setCurrentPage(1);
  };

  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      menunggu: "bg-yellow-100 text-yellow-800",
      ditinjau: "bg-blue-100 text-blue-800",
      disetujui: "bg-green-100 text-green-800",
      ditolak: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      menunggu: "Menunggu",
      ditinjau: "Ditinjau",
      disetujui: "Disetujui",
      ditolak: "Ditolak",
    };
    return labels[status] || status;
  };

  const handleDetail = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsDetailOpen(true);
  };

  const handleAnalisis = (proposal: Proposal) => {
    navigate("/analisis-proposals", { state: { proposal } });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Daftar Proposal Petani
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola dan analisis proposal pendanaan dari petani
        </p>
      </motion.div>

      {/* FILTER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Komoditas Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Komoditas
                </label>
                <Select value={filterKomoditas} onValueChange={setFilterKomoditas}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Komoditas</SelectItem>
                    {komoditasList.map((komoditas) => (
                      <SelectItem key={komoditas} value={komoditas}>
                        {komoditas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lokasi Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Lokasi
                </label>
                <Select value={filterLokasi} onValueChange={setFilterLokasi}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Lokasi</SelectItem>
                    {lokasiList.map((lokasi) => (
                      <SelectItem key={lokasi} value={lokasi}>
                        {lokasi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status Proposal
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Status</SelectItem>
                    <SelectItem value="menunggu">Menunggu</SelectItem>
                    <SelectItem value="ditinjau">Ditinjau</SelectItem>
                    <SelectItem value="disetujui">Disetujui</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Nama Petani */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cari Nama Petani
                </label>
                <Input
                  placeholder="Nama petani..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
              </div>

              {/* Tombol Cari */}
              <div className="flex items-end">
                <Button
                  onClick={handleFilter}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Cari
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABLE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Daftar Proposal ({filteredProposals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Petani</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Luas Lahan</TableHead>
                    <TableHead>Dana Diminta</TableHead>
                    <TableHead>Estimasi Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProposals.length > 0 ? (
                    paginatedProposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">
                          {proposal.farmerName}
                        </TableCell>
                        <TableCell>{proposal.komoditas}</TableCell>
                        <TableCell>{proposal.luasLahan.toFixed(1)} ha</TableCell>
                        <TableCell>
                          Rp {proposal.danaDiminta.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          Rp {proposal.estimasiKeuntungan.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(proposal.status)}>
                            {getStatusLabel(proposal.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={isDetailOpen && selectedProposal?.id === proposal.id} onOpenChange={setIsDetailOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDetail(proposal)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Detail Proposal</DialogTitle>
                                  <DialogDescription>
                                    Informasi lengkap proposal dari {selectedProposal?.farmerName}
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedProposal && (
                                  <div className="space-y-4">
                                    {/* Informasi Petani */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Informasi Petani
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Nama Petani
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.farmerName}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Nama Usaha
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.namaUsaha}
                                            </p>
                                          </div>
                                          <div className="sm:col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                              Lokasi
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.lokasi}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Informasi Usaha */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Informasi Usaha
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Komoditas
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.komoditas}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Luas Lahan
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.luasLahan.toFixed(1)} ha
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Lama Usaha
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.lamaUsaha} tahun
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Informasi Pendanaan */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Informasi Pendanaan
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Dana Diminta
                                            </p>
                                            <p className="font-medium">
                                              Rp {selectedProposal.danaDiminta.toLocaleString("id-ID")}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Estimasi Keuntungan
                                            </p>
                                            <p className="font-medium">
                                              Rp {selectedProposal.estimasiKeuntungan.toLocaleString("id-ID")}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">
                                              Estimasi Panen
                                            </p>
                                            <p className="font-medium">
                                              {selectedProposal.estimasiPanen}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Dokumen */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Dokumen
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <FileText className="w-4 h-4 text-blue-600" />
                                              <span className="text-sm font-medium">
                                                {selectedProposal.dokumen.proposal}
                                              </span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                              Unduh
                                            </Button>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Image className="w-4 h-4 text-green-600" />
                                              <span className="text-sm font-medium">
                                                {selectedProposal.dokumen.fotoLahan}
                                              </span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                              Lihat
                                            </Button>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Image className="w-4 h-4 text-purple-600" />
                                              <span className="text-sm font-medium">
                                                {selectedProposal.dokumen.fotoTanaman}
                                              </span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                              Lihat
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Tombol Analisis */}
                                    <Button
                                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                      onClick={() => {
                                        handleAnalisis(selectedProposal);
                                        setIsDetailOpen(false);
                                      }}
                                    >
                                      Analisis Proposal
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAnalisis(proposal)}
                            >
                              Analisis
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">
                          Tidak ada proposal yang sesuai dengan filter
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={
                            currentPage === page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
