import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ongoingSubsidyPrograms, subsidyProgramApplications, SubsidyProgramApplication } from "@/data/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, AlertCircle, FileUp, Plus, ChevronRight, Shield, DollarSign, Eye } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { farmerApplications } from "@/data/mockData";

export default function PengajuanSubsidiPage() {
  const { toast } = useToast();
  const { role } = useAuth();
  const [selectedTab, setSelectedTab] = useState("tersedia");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showApplicationDetailModal, setShowApplicationDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<SubsidyProgramApplication | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [formData, setFormData] = useState({
    fotoKtp: "",
    fotoLahan: "",
    dokumenTambahan: "",
  });
  const fileRef = useState(null);

  const iPetani = role === "petani";
  const userFarmerId = "F001"; // Simulate logged-in farmer - Ahmad Suryadi
  const userFarmer = farmerApplications.find(f => f.id === userFarmerId);

  // Get available programs (status: active and available)
  const availablePrograms = ongoingSubsidyPrograms.filter(p => p.status === "active" && p.available);
  
  // Get user's applications
  const userApplications = subsidyProgramApplications.filter(app => app.farmerId === userFarmerId);
  
  // Get pending applications
  const pendingApplications = userApplications.filter(app => 
    ["submitted", "under_review"].includes(app.status)
  );
  
  // Get approved applications
  const approvedApplications = userApplications.filter(app => app.status === "approved");
  
  // Get rejected applications
  const rejectedApplications = userApplications.filter(app => app.status === "rejected");

  const stats = {
    totalApplications: userApplications.length,
    pendingCount: pendingApplications.length,
    approvedCount: approvedApplications.length,
    rejectedCount: rejectedApplications.length,
    totalDisbursed: approvedApplications.reduce((sum, app) => sum + app.requestedAmount, 0),
  };

  const handleApplyClick = (program: any) => {
    if (!userFarmer) {
      toast({
        title: "Error",
        description: "Data petani tidak ditemukan",
        variant: "destructive",
      });
      return;
    }
    setSelectedProgram(program);
    setShowApplyModal(true);
  };

  const checkEligibility = (program: any) => {
    if (!userFarmer) return { eligible: false, reasons: [] };
    
    const sc = program.smartContract;
    const issues: string[] = [];

    if (userFarmer.area < sc.minLandArea || userFarmer.area > sc.maxLandArea) {
      issues.push(`Luas lahan (${userFarmer.area} ha) di luar range ${sc.minLandArea}-${sc.maxLandArea} ha`);
    }
    if (userFarmer.eligibilityScore < sc.minEligibilityScore) {
      issues.push(`Skor kelayakan (${userFarmer.eligibilityScore}) di bawah minimum (${sc.minEligibilityScore})`);
    }
    if (!sc.allowedRiskLevels.includes(userFarmer.riskLevel)) {
      issues.push(`Tingkat risiko (${userFarmer.riskLevel}) tidak sesuai kriteria`);
    }
    if (!sc.allowedCommodities.includes(userFarmer.commodity)) {
      issues.push(`Komoditas (${userFarmer.commodity}) tidak termasuk dalam program`);
    }
    if (!sc.allowedProvinces.includes(userFarmer.province)) {
      issues.push(`Provinsi (${userFarmer.province}) tidak termasuk cakupan program`);
    }

    return {
      eligible: issues.length === 0,
      reasons: issues,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "disetujui":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
      case "ditolak":
        return "bg-red-100 text-red-800";
      case "under_review":
      case "submitted":
      case "diproses":
        return "bg-yellow-100 text-yellow-800";
      case "disbursed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Draft",
      submitted: "Terkirim",
      under_review: "Sedang Diproses",
      approved: "Disetujui",
      rejected: "Ditolak",
      disbursed: "Dicairkan",
      disetujui: "Disetujui",
      ditolak: "Ditolak",
      diproses: "Sedang Diproses",
    };
    return labels[status] || status;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0].name
      }));
    }
  };

  const handleDetailClick = (application: SubsidyProgramApplication) => {
    setSelectedApplication(application);
    setShowApplicationDetailModal(true);
  };

  if (!iPetani) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Halaman ini hanya tersedia untuk petani</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Pengajuan Program Subsidi
          </h1>
          <p className="text-sm text-muted-foreground">
            Ajukan permohonan subsidi untuk program yang sedang berjalan
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Profil Petani</p>
          <p className="font-semibold text-foreground">{userFarmer?.name}</p>
          <p className="text-xs text-muted-foreground">Skor: {userFarmer?.eligibilityScore}/100</p>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-3"
      >
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Total Pengajuan</p>
            <p className="text-3xl font-bold">{stats.totalApplications}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Menunggu</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingCount}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Disetujui</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.approvedCount}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Ditolak</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejectedCount}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Total Diterima</p>
            <p className="text-2xl font-bold">{(stats.totalDisbursed / 1000000).toFixed(0)}M</p>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tersedia">Program Tersedia ({availablePrograms.length})</TabsTrigger>
            <TabsTrigger value="pengajuan">Pengajuan Saya ({userApplications.length})</TabsTrigger>
            <TabsTrigger value="disetujui">Disetujui ({approvedApplications.length})</TabsTrigger>
            <TabsTrigger value="ditolak">Ditolak ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          {/* Tab: Program Tersedia */}
          <TabsContent value="tersedia" className="space-y-4 mt-6">
            {availablePrograms.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada program subsidi yang tersedia saat ini</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {availablePrograms.map((program) => {
                  const eligibility = checkEligibility(program);
                  return (
                    <Card key={program.id} className="p-5 transition hover:shadow-md hover:border-primary/50">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{program.name}</h3>
                              <Badge variant="default" className="text-xs">
                                Buka
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{program.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Tipe</p>
                            <Badge variant="outline">{program.smartContract.subsidyType}</Badge>
                          </div>
                        </div>

                        {/* Smart Contract Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Luas: {program.smartContract.minLandArea}-{program.smartContract.maxLandArea} ha</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Skor: ≥{program.smartContract.minEligibilityScore}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Max: {formatCurrency(program.smartContract.maxSubsidyAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{new Date(program.deadline).toLocaleDateString("id-ID")}</span>
                          </div>
                        </div>

                        {/* Eligibility Check */}
                        {!eligibility.eligible && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <p className="text-sm font-medium text-red-800 mb-2">Tidak Bisa Mengajukan:</p>
                            <ul className="space-y-1">
                              {eligibility.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-red-700 flex gap-2">
                                  <span>•</span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {eligibility.eligible && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                            <p className="text-sm text-emerald-800 font-medium">✓ Anda memenuhi syarat untuk mengajukan program ini</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleApplyClick(program)}
                            disabled={!eligibility.eligible}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Ajukan Sekarang
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Tab: Pengajuan Saya */}
          <TabsContent value="pengajuan" className="space-y-4 mt-6">
            {userApplications.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Anda belum mengajukan program subsidi apapun</p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Tgl Ajuan</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs">{app.id}</TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <p className="font-medium">{app.komoditas}</p>
                            <p className="text-xs text-muted-foreground">Program {app.programId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(app.submissionDate).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell className="text-sm font-medium">{formatCurrency(app.requestedAmount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(app.status)}>
                            {getStatusLabel(app.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowApplicationDetailModal(true);
                            }}
                            className="gap-1"
                          >
                            <ChevronRight className="w-4 h-4" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Tab: Disetujui */}
          <TabsContent value="disetujui" className="space-y-4 mt-6">
            {approvedApplications.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada program yang disetujui</p>
              </Card>
            ) : (
              approvedApplications.map((app) => (
                <Card key={app.id} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-green-700">✓ Disetujui</h3>
                      <p className="text-sm text-muted-foreground mt-1">Permohonan subsidi Anda telah disetujui</p>
                      <p className="text-sm font-medium mt-2">{formatCurrency(app.requestedAmount)}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">{app.status}</Badge>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Tab: Ditolak */}
          <TabsContent value="ditolak" className="space-y-4 mt-6">
            {rejectedApplications.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada program yang ditolak</p>
              </Card>
            ) : (
              rejectedApplications.map((app) => (
                <Card key={app.id} className="p-5 border-red-200 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-red-700">✗ Ditolak</h3>
                      <p className="text-sm text-muted-foreground mt-1">{app.notes || "Permohonan tidak memenuhi kriteria"}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">{app.status}</Badge>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

        </Tabs>
      </motion.div>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="text-sm text-emerald-800">
                  ✓ Profil Anda memenuhi syarat untuk mengajukan program ini
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Luas Lahan Anda</Label>
                  <p className="text-lg font-semibold">{userFarmer?.area} ha</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Skor Kelayakan</Label>
                  <p className="text-lg font-semibold">{userFarmer?.eligibilityScore}/100</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Komoditas Default</Label>
                  <p className="text-lg font-semibold">{userFarmer?.commodity}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Maksimal Subsidi</Label>
                  <p className="text-lg font-semibold">{formatCurrency(selectedProgram.smartContract.maxSubsidyAmount)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Komoditas yang Akan Ditanam *</Label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih komoditas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProgram.smartContract.allowedCommodities.map((commodity: string) => (
                      <SelectItem key={commodity} value={commodity}>
                        {commodity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Jumlah Subsidi yang Diminta (Rp) *</Label>
                <Input
                  type="number"
                  placeholder="Contoh: 5000000"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maksimal: {formatCurrency(selectedProgram.smartContract.maxSubsidyAmount)}
                </p>
              </div>


              <div className="bg-accent/10 border border-accent/20 rounded p-3">
                <div className="flex gap-2 items-start">
                  <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                  <p className="text-xs text-muted-foreground">
                    Data Anda akan divalidasi oleh smart contract. Jika skor kelayakan Anda mencapai threshold otomatis ({selectedProgram.smartContract.automaticApprovalThreshold}+), permohonan akan otomatis disetujui dan dicatat di blockchain.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    setShowApplyModal(false);
                    setSelectedCommodity("");
                    setRequestedAmount("");
                  }} 
                  variant="outline"
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedCommodity || !requestedAmount) {
                      toast({
                        title: "Form Belum Lengkap",
                        description: "Silakan isi semua field yang diperlukan.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    const amount = parseFloat(requestedAmount);
                    if (amount > selectedProgram.smartContract.maxSubsidyAmount) {
                      toast({
                        title: "Jumlah Melebihi Batas",
                        description: `Maksimal subsidi adalah ${formatCurrency(selectedProgram.smartContract.maxSubsidyAmount)}`,
                        variant: "destructive",
                      });
                      return;
                    }

                    toast({
                      title: "Pengajuan Terkirim",
                      description: `Pengajuan untuk ${selectedCommodity} senilai ${formatCurrency(amount)} telah terkirim. Silakan tunggu hasil verifikasi.`,
                    });
                    setShowApplyModal(false);
                    setSelectedCommodity("");
                    setRequestedAmount("");
                  }}
                  className="flex-1"
                  disabled={!selectedCommodity || !requestedAmount}
                >
                  Kirim Pengajuan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Detail Modal */}
      <Dialog open={showApplicationDetailModal} onOpenChange={setShowApplicationDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan - {selectedApplication?.id}</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Program</Label>
                  <p className="text-sm font-medium">{selectedApplication.programId}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {getStatusLabel(selectedApplication.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tanggal Ajuan</Label>
                  <p className="text-sm font-medium">{new Date(selectedApplication.submissionDate).toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Luas Lahan</Label>
                  <p className="text-sm font-medium">{selectedApplication.farmArea} ha</p>
                </div>
              </div>

              <Card className="p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Jumlah Diminta</p>
                <p className="text-2xl font-bold">{formatCurrency(selectedApplication.requestedAmount)}</p>
              </Card>

              {selectedApplication.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Catatan</Label>
                  <p className="text-sm text-foreground">{selectedApplication.notes}</p>
                </div>
              )}

              {selectedApplication.smartContractValidation && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Validasi Smart Contract</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {selectedApplication.smartContractValidation.totalValidation ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{selectedApplication.smartContractValidation.totalValidation ? "Semua kriteria terpenuhi" : "Beberapa kriteria tidak terpenuhi"}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowApplicationDetailModal(false)} variant="outline">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
