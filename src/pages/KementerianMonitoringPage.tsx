import { useState } from "react";
import { motion } from "framer-motion";
import { farmerApplications } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Users, MapPin, TrendingUp, FileText, Eye, Check, X } from "lucide-react";

interface SubsidiRequest {
  id: string;
  namaPetani: string;
  provinsi: string;
  komoditas: string;
  luasLahan: number;
  danaDiminta: number;
  status: "pending" | "approved" | "rejected";
  tanggalPengajuan: string;
  lokasiLahan: string;
  dokumen: string[];
}

// Transform farmerApplications to SubsidiRequest format
const subsidyRequests: SubsidiRequest[] = farmerApplications.map((app, idx) => ({
  id: `SUB${String(idx + 1).padStart(3, "0")}`,
  namaPetani: app.name,
  provinsi: app.province,
  komoditas: app.commodity,
  luasLahan: app.area,
  danaDiminta: app.amount,
  status: app.status as "pending" | "approved" | "rejected",
  tanggalPengajuan: app.date,
  lokasiLahan: app.address,
  dokumen: ["Proposal.pdf", "FotoLahan.jpg", "NIK.pdf"],
}));

export default function KementerianMonitoringPage() {
  const [filterProvinsi, setFilterProvinsi] = useState("Semua");
  const [filterKomoditas, setFilterKomoditas] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedRequest, setSelectedRequest] = useState<SubsidiRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [approveItems, setApproveItems] = useState<Set<string>>(new Set());
  const [rejectItems, setRejectItems] = useState<Set<string>>(new Set());

  // Get unique values for filters
  const uniqueProvinces = ["Semua", ...Array.from(new Set(subsidyRequests.map((r) => r.provinsi)))];
  const uniqueKomoditas = ["Semua", ...Array.from(new Set(subsidyRequests.map((r) => r.komoditas)))];

  // Calculate statistics
  const totalPengajuan = subsidyRequests.length;
  const pendingApproval = subsidyRequests.filter((r) => r.status === "pending").length;
  const disetujui = subsidyRequests.filter((r) => r.status === "approved").length;
  const ditolak = subsidyRequests.filter((r) => r.status === "rejected").length;

  // Filter data
  const filteredRequests = subsidyRequests.filter((req) => {
    const matchProvinsi = filterProvinsi === "Semua" || req.provinsi === filterProvinsi;
    const matchKomoditas = filterKomoditas === "Semua" || req.komoditas === filterKomoditas;
    const matchStatus = filterStatus === "Semua" || req.status === filterStatus.toLowerCase().replace(" ", "");
    return matchProvinsi && matchKomoditas && matchStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pending",
      approved: "Disetujui",
      rejected: "Ditolak",
    };
    return labels[status] || status;
  };

  const handleApprove = (id: string) => {
    setApproveItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    setRejectItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleReject = (id: string) => {
    setRejectItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    setApproveItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleDetail = (request: SubsidiRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Monitoring Subsidi
        </h1>
        <p className="text-sm text-muted-foreground">
          Pantau pengajuan subsidi dan lakukan persetujuan atau penolakan
        </p>
      </motion.div>

      {/* STATISTIK RINGKASAN - 4 Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Total Pengajuan
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalPengajuan}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingApproval}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Disetujui
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {disetujui}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Ditolak
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {ditolak}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Provinsi */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Provinsi
                </label>
                <Select value={filterProvinsi} onValueChange={setFilterProvinsi}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueProvinces.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
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
                <Select value={filterKomoditas} onValueChange={setFilterKomoditas}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueKomoditas.map((kom) => (
                      <SelectItem key={kom} value={kom}>
                        {kom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua">Semua</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tanggal Pengajuan */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tanggal Pengajuan
                </label>
                <Select value="semua" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua tanggal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Tanggal</SelectItem>
                    <SelectItem value="7hari">7 Hari Terakhir</SelectItem>
                    <SelectItem value="30hari">30 Hari Terakhir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABEL PENGAJUAN SUBSIDI */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tabel Pengajuan Subsidi ({filteredRequests.length} Pengajuan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pengajuan</TableHead>
                    <TableHead>Nama Petani</TableHead>
                    <TableHead>Provinsi</TableHead>
                    <TableHead>Komoditas</TableHead>
                    <TableHead>Luas Lahan</TableHead>
                    <TableHead>Dana Diminta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-sm">
                          {request.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.namaPetani}
                        </TableCell>
                        <TableCell>{request.provinsi}</TableCell>
                        <TableCell>{request.komoditas}</TableCell>
                        <TableCell>{request.luasLahan} ha</TableCell>
                        <TableCell>
                          Rp {request.danaDiminta.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(request.status)}>
                            {getStatusLabel(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {request.tanggalPengajuan}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            {/* Detail Button */}
                            <Dialog
                              open={isDetailOpen && selectedRequest?.id === request.id}
                              onOpenChange={setIsDetailOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDetail(request)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                                <DialogHeader>
                                  <DialogTitle>Detail Pengajuan Subsidi</DialogTitle>
                                  <DialogDescription>
                                    Informasi lengkap pengajuan {selectedRequest?.namaPetani}
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedRequest && (
                                  <div className="space-y-4 overflow-y-auto pr-4">
                                    {/* Informasi Petani */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Informasi Petani
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-2">
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              Nama Petani
                                            </p>
                                            <p className="font-medium">
                                              {selectedRequest.namaPetani}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              Lokasi Lahan
                                            </p>
                                            <p className="font-medium">
                                              {selectedRequest.lokasiLahan}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Informasi Lahan */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Informasi Lahan
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              Luas Lahan
                                            </p>
                                            <p className="font-medium">
                                              {selectedRequest.luasLahan} ha
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                              Komoditas
                                            </p>
                                            <p className="font-medium">
                                              {selectedRequest.komoditas}
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
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Dana Diminta
                                          </p>
                                          <p className="font-medium text-lg">
                                            Rp {selectedRequest.danaDiminta.toLocaleString("id-ID")}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Dokumen Pengajuan */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">
                                          Dokumen Pengajuan
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-2">
                                          {selectedRequest.dokumen.map((doc, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                                            >
                                              <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{doc}</span>
                                              </div>
                                              <Button variant="ghost" size="sm">
                                                Download
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* ACC Button */}
                            <Button
                              variant={approveItems.has(request.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className={approveItems.has(request.id) ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              ACC
                            </Button>

                            {/* Tolak Button */}
                            <Button
                              variant={rejectItems.has(request.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              className={rejectItems.has(request.id) ? "bg-red-600 hover:bg-red-700" : ""}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Tolak
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
