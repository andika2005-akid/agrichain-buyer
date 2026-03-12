import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ongoingSubsidyPrograms, SubsidyProgram, subsidyProgramApplications, SubsidyProgramApplication, farmerApplications } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertCircle, Calendar, Plus, ChevronDown, Shield, DollarSign, Users, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { getGoodsDistributionFromAmount } from "@/lib/subsidyDistribution";
import {
  getSubsidyReceiptConfirmationByApplicationId,
  getSubsidyReceiptConfirmations,
  upsertSubsidyReceiptConfirmation,
} from "@/lib/subsidyReceiptConfirmation";

type SmartContractFinalStatus = "approved" | "rejected";

const toFinalSmartContractStatus = (
  application: SubsidyProgramApplication
): SmartContractFinalStatus => {
  if (application.status === "approved") {
    return "approved";
  }
  return "rejected";
};

const buildFinalSmartContractApplication = (
  application: SubsidyProgramApplication
): SubsidyProgramApplication => {
  const finalStatus = toFinalSmartContractStatus(application);
  return {
    ...application,
    status: finalStatus,
    approvalDate: finalStatus === "approved" ? application.approvalDate || application.submissionDate : undefined,
    notes:
      application.notes ||
      (finalStatus === "approved"
        ? "Disetujui otomatis oleh smart contract"
        : "Ditolak otomatis oleh smart contract"),
  };
};

export default function ProgramSubsidiPage() {
  // Defensive: Ensure modals are closed before parent unmounts
  useEffect(() => {
    return () => {
      setShowDetailModal(false);
      setShowSmartContractModal(false);
      setShowCreateModal(false);
      setShowApplyModal(false);
      setShowManageApplicationsModal(false);
      setShowApplicationHistoryModal(false);
      setShowReceiptProofModal(false);
    };
  }, []);
  const SUBSIDY_MAX_LAND_AREA = 2.5;
  const { toast } = useToast();
  const { role } = useAuth();
  const [selectedTab, setSelectedTab] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState<SubsidyProgram | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSmartContractModal, setShowSmartContractModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showManageApplicationsModal, setShowManageApplicationsModal] = useState(false);
  const [showApplicationHistoryModal, setShowApplicationHistoryModal] = useState(false);
  const [showReceiptProofModal, setShowReceiptProofModal] = useState(false);
  const [applicationHistoryTab, setApplicationHistoryTab] = useState("aktif");
  const [expandedSmartContract, setExpandedSmartContract] = useState<string | null>(null);
  const [selectedManageProgram, setSelectedManageProgram] = useState<SubsidyProgram | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedReceiptApplication, setSelectedReceiptApplication] =
    useState<SubsidyProgramApplication | null>(null);
  const [receiptProofImageDataUrl, setReceiptProofImageDataUrl] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    subsidyType: "",
    maxBudget: 0,
    deadline: "",
  });

  const isKementerian = role === "kementerian";
  const isPetani = role === "petani";
  const userFarmerId = "F001"; // Ahmad Suryadi
  const userFarmer = farmerApplications.find(f => f.id === userFarmerId);
  const [programs, setPrograms] = useState<SubsidyProgram[]>(ongoingSubsidyPrograms);
  const [allApplications, setAllApplications] = useState<SubsidyProgramApplication[]>(
    subsidyProgramApplications.map(buildFinalSmartContractApplication)
  );
  const [receiptConfirmations, setReceiptConfirmations] = useState(
    getSubsidyReceiptConfirmations()
  );

  const [userApplications, setUserApplications] = useState<SubsidyProgramApplication[]>(
    subsidyProgramApplications
      .filter((app) => app.farmerId === userFarmerId)
      .map(buildFinalSmartContractApplication)
  );

  // Get all user's applications across all programs
  const userApplicationsAll = userApplications;

  const approvedApplications = userApplicationsAll.filter(
    (app) => app.status === "approved"
  );
  const rejectedApplications = userApplicationsAll.filter(
    (app) => app.status === "rejected"
  );
  const smartContractApplications = userApplicationsAll.filter(
    (app) => app.status === "approved" || app.status === "rejected"
  );

  const petaniStats = {
    totalApplications: userApplicationsAll.length,
    approved: approvedApplications.length,
    rejected: rejectedApplications.length,
    totalReceived: approvedApplications.reduce(
      (sum, app) => sum + app.requestedAmount,
      0
    ),
  };

  const filteredPrograms =
    selectedTab === "semua"
      ? programs
      : selectedTab === "berjalan"
        ? programs.filter((p) => p.status === "active")
        : selectedTab === "tertutup"
          ? programs.filter((p) => p.status === "closed")
          : programs.filter((p) => p.status === "draft");

  const handleDetailClick = (program: SubsidyProgram) => {
    setSelectedProgram(program);
    setShowDetailModal(true);
  };

  const handleSmartContractClick = (program: SubsidyProgram) => {
    setSelectedProgram(program);
    setShowSmartContractModal(true);
  };

  const handleApplyClick = (program: SubsidyProgram) => {
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

  const checkEligibility = (program: SubsidyProgram, commodityOverride?: string) => {
    if (!userFarmer) return { eligible: false, reasons: [], percentage: 0 };
    
    const sc = program.smartContract;
    const effectiveMaxLandArea = Math.min(sc.maxLandArea, SUBSIDY_MAX_LAND_AREA);
    const issues: string[] = [];
    let passedCriteria = 0;
    const totalCriteria = 5; // land area, score, risk, commodity, province

    // Check land area
    if (userFarmer.area < sc.minLandArea || userFarmer.area > effectiveMaxLandArea) {
      issues.push(`Luas lahan (${userFarmer.area} ha) di luar range ${sc.minLandArea}-${effectiveMaxLandArea} ha`);
    } else {
      passedCriteria++;
    }

    // Check eligibility score
    if (userFarmer.eligibilityScore < sc.minEligibilityScore) {
      issues.push(`Skor kelayakan (${userFarmer.eligibilityScore}) di bawah minimum (${sc.minEligibilityScore})`);
    } else {
      passedCriteria++;
    }

    // Check risk level
    if (!sc.allowedRiskLevels.includes(userFarmer.riskLevel)) {
      issues.push(`Tingkat risiko (${userFarmer.riskLevel}) tidak sesuai kriteria`);
    } else {
      passedCriteria++;
    }

    // Check commodity
    const commodityToCheck = commodityOverride || userFarmer.commodity;
    if (!sc.allowedCommodities.includes(commodityToCheck)) {
      issues.push(`Komoditas (${commodityToCheck}) tidak termasuk dalam program`);
    } else {
      passedCriteria++;
    }

    // Check province
    if (!sc.allowedProvinces.includes(userFarmer.province)) {
      issues.push(`Provinsi (${userFarmer.province}) tidak termasuk cakupan program`);
    } else {
      passedCriteria++;
    }

    // Prevent duplicate subsidy in the same period/program
    const hasApprovedInSamePeriod = userApplicationsAll.some(
      (app) => app.status === "approved" && app.programId === program.id
    );
    if (hasApprovedInSamePeriod) {
      issues.push("Sudah menerima subsidi pada periode program yang sama");
    }

    const percentage = Math.round((passedCriteria / totalCriteria) * 100);

    return {
      eligible: issues.length === 0,
      reasons: issues,
      percentage: percentage,
    };
  };


  const stats = {
    totalProgram: programs.length,
    programAktif: programs.filter((p) => p.status === "active").length,
    programTertutup: programs.filter((p) => p.status === "closed").length,
    totalBudget: programs.reduce((sum, p) => sum + p.maxBudget, 0),
    totalApplicants: programs.reduce((sum, p) => sum + p.totalApplicants, 0),
    subsidyTypeCount: new Set(
      programs
        .flatMap((p) => p.smartContract.subsidyType.split("+"))
        .map((type) => type.trim())
    ).size,
  };

  const handleManageApplications = (program: SubsidyProgram) => {
    setSelectedManageProgram(program);
    setShowManageApplicationsModal(true);
  };

  const handleCloseProgram = (programId: string) => {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === programId
          ? {
              ...program,
              status: "closed",
              available: false,
            }
          : program
      )
    );

    toast({
      title: "Program Ditutup",
      description: `Program ${programId} telah ditutup dan tidak menerima pengajuan baru.`,
    });
  };

  const runSmartContractEvaluation = (applicationId: string) => {
    setAllApplications((prev) =>
      prev.map((application) => {
        if (application.id !== applicationId) {
          return application;
        }
        const finalStatus = toFinalSmartContractStatus(application);
        return {
          ...application,
          status: finalStatus,
          notes:
            finalStatus === "approved"
              ? "Disetujui otomatis oleh smart contract"
              : "Ditolak otomatis oleh smart contract",
          approvalDate: finalStatus === "approved" ? application.approvalDate || application.submissionDate : undefined,
        };
      })
    );
    toast({
      title: "Evaluasi Smart Contract Selesai",
      description: `Status aplikasi ${applicationId} diperbarui menjadi keputusan final smart contract.`,
    });
  };

  const handleCreateProgram = () => {
    if (!newProgram.name || !newProgram.description || !newProgram.subsidyType || !newProgram.maxBudget || !newProgram.deadline) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon isikan semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Program Berhasil Dibuat",
      description: `Program "${newProgram.name}" telah dibuat dan tersimpan di blockchain`,
    });
    
    setShowCreateModal(false);
    setNewProgram({
      name: "",
      description: "",
      subsidyType: "",
      maxBudget: 0,
      deadline: "",
    });
  };

  const getSmartContractInfo = (program: SubsidyProgram) => {
    const sc = program.smartContract;
    const effectiveMaxLandArea = Math.min(sc.maxLandArea, SUBSIDY_MAX_LAND_AREA);
    return [
      { label: "Luas Lahan", value: `${sc.minLandArea} - ${effectiveMaxLandArea} ha` },
      { label: "Skor Kelayakan", value: `${sc.minEligibilityScore} - ${sc.maxEligibilityScore}` },
      { label: "Tingkat Risiko", value: sc.allowedRiskLevels.join(", ") },
      { label: "Komoditas", value: sc.allowedCommodities.join(", ") },
      { label: "Provinsi", value: sc.allowedProvinces.join(", ") },
      {
        label: "Barang Disalurkan",
        value: getGoodsDistributionFromAmount(sc.subsidyType, sc.maxSubsidyAmount).label,
      },
      { label: "Threshold Otomatis", value: `Score ≥ ${sc.automaticApprovalThreshold}` },
    ];
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "approved" || status === "disetujui" ? "Disetujui" : "Ditolak";
  };

  const getPickupLocation = (application: SubsidyProgramApplication) => {
    if (application.status !== "approved") {
      return "Tidak tersedia (pengajuan ditolak)";
    }
    return `UPTD Pertanian ${application.province}`;
  };

  const openApplicationHistoryModal = (tab: "aktif" | "tertutup" | "riwayat" = "riwayat") => {
    setApplicationHistoryTab(tab);
    setShowApplicationHistoryModal(true);
  };

  const openReceiptProofModal = (application: SubsidyProgramApplication) => {
    setSelectedReceiptApplication(application);
    setReceiptProofImageDataUrl(null);
    setShowReceiptProofModal(true);
  };

  const handleProofImageChange = (file: File | null) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptProofImageDataUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmReceipt = (application: SubsidyProgramApplication) => {
    if (application.status !== "approved") {
      return;
    }

    if (getSubsidyReceiptConfirmationByApplicationId(application.id)) {
      toast({
        title: "Sudah Dikonfirmasi",
        description: "Penerimaan subsidi untuk pengajuan ini sudah pernah dikonfirmasi.",
      });
      return;
    }

    const isProofValid = !!receiptProofImageDataUrl;

    if (!isProofValid) {
      toast({
        title: "Bukti Belum Valid",
        description: "Bukti foto kamera wajib diunggah sebelum konfirmasi subsidi diterima.",
        variant: "destructive",
      });
      return;
    }

    const next = upsertSubsidyReceiptConfirmation({
      applicationId: application.id,
      programId: application.programId,
      farmerId: application.farmerId,
      farmerName: application.farmerName,
      blockchainHash: application.blockchainHash,
      confirmedAt: new Date().toISOString(),
      proofMethod: "camera",
      proofImageDataUrl: receiptProofImageDataUrl || undefined,
    });

    setReceiptConfirmations(next);
    setShowReceiptProofModal(false);
    setSelectedReceiptApplication(null);
    toast({
      title: "Subsidi Dikonfirmasi Diterima",
      description: "Konfirmasi berhasil tersimpan dan dapat dicek di Blockchain Audit.",
    });
  };

  const getReceiptConfirmation = (applicationId: string) => {
    return receiptConfirmations.find((item) => item.applicationId === applicationId);
  };

  const selectedProgramApplications = selectedManageProgram
    ? allApplications
        .filter((app) => app.programId === selectedManageProgram.id)
        .sort(
          (a, b) =>
            new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        )
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {isKementerian ? "Kelola Program Subsidi" : isPetani ? "Pengajuan Subsidi Pertanian" : "Program Subsidi Pertanian"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isKementerian
              ? "Buat, kelola, dan pantau program subsidi dengan smart contract"
              : isPetani
                ? "Lihat dan ajukan subsidi yang sedang berjalan"
                : "Lihat daftar program subsidi yang sedang berjalan"}
          </p>
        </div>
        <div className="flex gap-2">
          {isKementerian && (
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Program Baru
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards - Show different stats for petani */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`grid ${isPetani ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"} gap-3`}
      >
        {isPetani ? (
          <>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Total Pengajuan</p>
                <p className="text-3xl font-bold">{petaniStats.totalApplications}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 h-7 text-xs"
                  onClick={() => openApplicationHistoryModal("riwayat")}
                >
                  Lihat Riwayat
                </Button>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Disetujui</p>
                <p className="text-3xl font-bold text-emerald-600">{petaniStats.approved}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Ditolak</p>
                <p className="text-3xl font-bold text-red-600">{petaniStats.rejected}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Total Diterima</p>
                <p className="text-2xl font-bold">{(petaniStats.totalReceived / 1000000).toFixed(0)}M</p>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Total Program</p>
                <p className="text-3xl font-bold">{stats.totalProgram}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Program Aktif</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.programAktif}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Total Pemohon</p>
                <p className="text-3xl font-bold">{stats.totalApplicants.toLocaleString("id-ID")}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Jenis Disalurkan</p>
                <p className="text-2xl font-bold">{stats.subsidyTypeCount} Jenis</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Approval Rate</p>
                <p className="text-3xl font-bold">
                  {stats.totalApplicants > 0 
                    ? ((stats.programAktif / stats.totalProgram) * 100).toFixed(0)
                    : 0}%
                </p>
              </div>
            </Card>
          </>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className={`grid w-full ${isPetani || isKementerian ? "grid-cols-4" : "grid-cols-3"}`}>
            <TabsTrigger value="semua">Semua ({programs.length})</TabsTrigger>
            <TabsTrigger value="berjalan">Aktif ({stats.programAktif})</TabsTrigger>
            <TabsTrigger value="tertutup">Tertutup ({stats.programTertutup})</TabsTrigger>
            {isPetani && <TabsTrigger value="riwayat">Riwayat Pengajuan ({smartContractApplications.length})</TabsTrigger>}
            {isKementerian && <TabsTrigger value="draft">Draft</TabsTrigger>}
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4 mt-6">
            {selectedTab === "riwayat" ? (
              smartContractApplications.length === 0 ? (
                <Card className="p-12 text-center">
                  <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada keputusan smart contract</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {smartContractApplications
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
                    )
                    .map((application) => {
                      const program = programs.find((p) => p.id === application.programId);
                      const receiptConfirmation = getReceiptConfirmation(application.id);

                      return (
                        <Card key={application.id} className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-semibold text-foreground">
                                  {program?.name || application.programId}
                                </h3>
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusLabel(application.status)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">ID Pengajuan</p>
                                  <p className="font-mono text-xs font-medium">{application.id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Komoditas</p>
                                  <p className="font-medium">{application.komoditas}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Detail</p>
                                  <p className="font-medium">
                                    {application.notes ||
                                      (application.status === "approved"
                                        ? "Lolos validasi smart contract"
                                        : "Tidak lolos validasi smart contract")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tempat Ambil Subsidi</p>
                                  <p className="font-medium">{getPickupLocation(application)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tanggal Ajuan</p>
                                  <p className="font-medium">
                                    {new Date(application.submissionDate).toLocaleDateString("id-ID")}
                                  </p>
                                </div>
                              </div>

                              {application.notes && (
                                <p className="text-xs text-muted-foreground mt-2">{application.notes}</p>
                              )}
                              {application.status === "approved" && (
                                <div className="mt-3 flex items-center gap-2">
                                  {receiptConfirmation ? (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      Subsidi diterima pada {new Date(receiptConfirmation.confirmedAt).toLocaleDateString("id-ID")}
                                    </Badge>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                        onClick={() => openReceiptProofModal(application)}
                                    >
                                      Konfirmasi Subsidi Diterima
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              )
            ) : (
              <>
            {filteredPrograms.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada program dalam kategori ini</p>
              </Card>
            ) : (
              filteredPrograms.map((program) => (
                <div key={program.id} className="border rounded-lg p-5 transition hover:shadow-md hover:border-primary/50">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{program.name}</h3>
                          <Badge
                            variant={program.available ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {program.status === "active" && "Aktif"}
                            {program.status === "closed" && "Tertutup"}
                            {program.status === "draft" && "Draft"}
                            {program.status === "suspended" && "Suspended"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">ID</p>
                        <p className="font-mono text-sm font-semibold">{program.id}</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="text-foreground">{new Date(program.deadline).toLocaleDateString("id-ID")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Barang Disalurkan</p>
                          <p className="text-foreground">
                            {
                              getGoodsDistributionFromAmount(
                                program.smartContract.subsidyType,
                                program.allocatedBudget
                              ).label
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Pemohon</p>
                          <p className="text-foreground">{program.totalApplicants.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Disetujui</p>
                          <p className="text-foreground">{program.approvedApplicants.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Smart Contract Terms */}
                    <div className="bg-muted/30 rounded p-3 space-y-2">
                      <button
                        onClick={() =>
                          setExpandedSmartContract(
                            expandedSmartContract === program.id ? null : program.id
                          )
                        }
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition"
                      >
                        <Shield className="w-4 h-4" />
                        Syarat Smart Contract
                        <ChevronDown
                          className={`w-4 h-4 transition ${
                            expandedSmartContract === program.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedSmartContract === program.id && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-xs">
                          {getSmartContractInfo(program).map((item, idx) => (
                            <div key={idx} className="bg-background rounded p-2">
                              <p className="text-muted-foreground">{item.label}</p>
                              <p className="text-foreground font-medium">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => handleDetailClick(program)}>
                        Detail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSmartContractClick(program)}
                        className="gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Smart Contract
                      </Button>
                      {isPetani && program.status === "active" && (
                        <Button
                          size="sm"
                          onClick={() => handleApplyClick(program)}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Ajukan
                        </Button>
                      )}
                      {isKementerian && program.status === "active" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleManageApplications(program)}>
                            Kelola Aplikasi
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleCloseProgram(program.id)}
                          >
                            Tutup Program
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Deskripsi</p>
                <p className="text-sm text-muted-foreground">{selectedProgram.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Persyaratan Program</p>
                <ul className="space-y-1">
                  {selectedProgram.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowDetailModal(false)} variant="outline">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Smart Contract Modal */}
      <Dialog open={showSmartContractModal} onOpenChange={setShowSmartContractModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Syarat Smart Contract - {selectedProgram?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              <div className="bg-accent/10 border border-accent/20 rounded p-3">
                <p className="text-sm text-foreground">
                  Smart contract akan secara otomatis memvalidasi setiap aplikasi berdasarkan syarat-syarat di bawah.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSmartContractInfo(selectedProgram).map((item, idx) => (
                  <Card key={idx} className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowSmartContractModal(false)} variant="outline">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Applications Modal - For Kementerian */}
      {isKementerian && (
        <Dialog open={showManageApplicationsModal} onOpenChange={setShowManageApplicationsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Kelola Aplikasi - {selectedManageProgram?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedManageProgram && (
              <div className="space-y-4">
                <div className="bg-accent/10 border border-accent/20 rounded p-3">
                  <p className="text-sm text-muted-foreground">
                    Status aplikasi menggunakan keputusan final smart contract: hanya Disetujui atau Ditolak.
                  </p>
                </div>

                {selectedProgramApplications.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Belum ada aplikasi untuk program ini.</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {selectedProgramApplications.map((application) => (
                      <Card key={application.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{application.farmerName}</p>
                              <Badge className={getStatusColor(application.status)}>
                                {getStatusLabel(application.status)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">ID Aplikasi</p>
                                <p className="font-mono text-xs font-medium">{application.id}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Komoditas</p>
                                <p className="font-medium">{application.komoditas}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Lahan</p>
                                <p className="font-medium">{application.farmArea} ha</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Tanggal Ajuan</p>
                                <p className="font-medium">
                                  {new Date(application.submissionDate).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                              <div className="bg-muted/40 rounded p-2">Lahan: {application.smartContractValidation.landAreaValid ? "Valid" : "Tidak"}</div>
                              <div className="bg-muted/40 rounded p-2">Skor: {application.smartContractValidation.eligibilityScoreValid ? "Valid" : "Tidak"}</div>
                              <div className="bg-muted/40 rounded p-2">Risiko: {application.smartContractValidation.riskLevelValid ? "Valid" : "Tidak"}</div>
                              <div className="bg-muted/40 rounded p-2">Komoditas: {application.smartContractValidation.commodityValid ? "Valid" : "Tidak"}</div>
                              <div className="bg-muted/40 rounded p-2">Provinsi: {application.smartContractValidation.provinceValid ? "Valid" : "Tidak"}</div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              {application.notes || "Keputusan otomatis berdasarkan smart contract."}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runSmartContractEvaluation(application.id)}
                          >
                            Evaluasi Ulang
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowManageApplicationsModal(false)}
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Create Program Modal */}
      {isKementerian && (
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Program Subsidi Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Nama Program</Label>
                <Input
                  placeholder="Contoh: Program Subsidi Pupuk 2026"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Deskripsi Program</Label>
                <Textarea
                  placeholder="Jelaskan tujuan dan detail program subsidi..."
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="mt-1 min-h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipe Subsidi</Label>
                  <Select value={newProgram.subsidyType} onValueChange={(v) => setNewProgram({ ...newProgram, subsidyType: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pupuk">Pupuk</SelectItem>
                      <SelectItem value="Benih">Benih</SelectItem>
                      <SelectItem value="Alat">Alat & Mesin</SelectItem>
                      <SelectItem value="Irigasi">Irigasi</SelectItem>
                      <SelectItem value="Tunai">Bantuan Tunai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Estimasi Barang Disalurkan (ekuivalen miliar)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={newProgram.maxBudget / 1000000000}
                    onChange={(e) => setNewProgram({ ...newProgram, maxBudget: parseFloat(e.target.value) * 1000000000 })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Deadline Pendaftaran</Label>
                <Input
                  type="date"
                  value={newProgram.deadline}
                  onChange={(e) => setNewProgram({ ...newProgram, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowCreateModal(false)} variant="outline">
                  Batal
                </Button>
                <Button onClick={handleCreateProgram} className="flex-1">
                  Buat Program & Deploy Smart Contract
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Apply Program Modal - For Petani */}
      {isPetani && (
        <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedProgram?.name}</DialogTitle>
            </DialogHeader>
            {selectedProgram && (
              <div className="space-y-4">
                {/* Eligibility Check */}
                {(() => {
                  const eligibility = checkEligibility(selectedProgram);
                  return eligibility.eligible ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                      <p className="text-sm text-emerald-800">
                        ✓ Profil Anda memenuhi syarat ({eligibility.percentage}% memenuhi kriteria)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm font-medium text-red-800 mb-2">Tidak Bisa Mengajukan ({eligibility.percentage}% memenuhi kriteria):</p>
                      <ul className="space-y-1">
                        {eligibility.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-red-700 flex gap-2">
                            <span>•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Luas Lahan Anda</Label>
                    <p className="text-lg font-semibold">{userFarmer?.area} ha</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Skor Kelayakan</Label>
                    <p className="text-lg font-semibold">{userFarmer?.eligibilityScore}/100</p>
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
                    }}
                    variant="outline"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedCommodity) {
                        toast({
                          title: "Form Belum Lengkap",
                          description: "Silakan pilih komoditas yang akan ditanam.",
                          variant: "destructive",
                        });
                        return;
                      }

                      if (!selectedProgram || !userFarmer) {
                        toast({
                          title: "Gagal Mengajukan",
                          description: "Data program atau profil petani tidak ditemukan.",
                          variant: "destructive",
                        });
                        return;
                      }

                      const eligibility = checkEligibility(selectedProgram, selectedCommodity);
                      const isApproved =
                        eligibility.eligible &&
                        userFarmer.eligibilityScore >=
                          selectedProgram.smartContract.automaticApprovalThreshold;

                      if (!eligibility.eligible) {
                        toast({
                          title: "Pengajuan Ditolak",
                          description: eligibility.reasons.join("; "),
                          variant: "destructive",
                        });
                      }

                      const submissionDate = new Date().toISOString().slice(0, 10);
                      const newApplication: SubsidyProgramApplication = {
                        id: `SPA${Date.now().toString().slice(-6)}`,
                        programId: selectedProgram.id,
                        farmerId: userFarmer.id,
                        farmerName: userFarmer.name,
                        farmArea: userFarmer.area,
                        komoditas: selectedCommodity,
                        province: userFarmer.province,
                        eligibilityScore: userFarmer.eligibilityScore,
                        riskLevel: userFarmer.riskLevel,
                        requestedAmount: selectedProgram.smartContract.maxSubsidyAmount,
                        status: isApproved ? "approved" : "rejected",
                        submissionDate,
                        approvalDate: isApproved ? submissionDate : undefined,
                        notes: isApproved
                          ? "Disetujui otomatis oleh smart contract"
                          : `Ditolak otomatis oleh smart contract: ${
                              eligibility.reasons.length > 0
                                ? eligibility.reasons.join("; ")
                                : "Skor belum memenuhi threshold otomatis"
                            }`,
                        smartContractValidation: {
                          landAreaValid:
                            userFarmer.area >= selectedProgram.smartContract.minLandArea &&
                            userFarmer.area <=
                              Math.min(
                                selectedProgram.smartContract.maxLandArea,
                                SUBSIDY_MAX_LAND_AREA
                              ),
                          eligibilityScoreValid:
                            userFarmer.eligibilityScore >=
                            selectedProgram.smartContract.minEligibilityScore,
                          riskLevelValid: selectedProgram.smartContract.allowedRiskLevels.includes(
                            userFarmer.riskLevel
                          ),
                          commodityValid: selectedProgram.smartContract.allowedCommodities.includes(
                            selectedCommodity
                          ),
                          provinceValid: selectedProgram.smartContract.allowedProvinces.includes(
                            userFarmer.province
                          ),
                          totalValidation: isApproved,
                        },
                        createdAt: submissionDate,
                        blockchainHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
                      };

                      setUserApplications((prev) => [newApplication, ...prev]);
                      setAllApplications((prev) => [newApplication, ...prev]);

                      toast({
                        title: "Keputusan Smart Contract",
                        description: `Pengajuan ${selectedCommodity} ${isApproved ? "disetujui" : "ditolak"} dan tersimpan di riwayat.`,
                      });
                      setShowApplyModal(false);
                      setSelectedCommodity("");
                    }}
                    className="flex-1"
                    disabled={!selectedCommodity}
                  >
                    Kirim Pengajuan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Application History Modal - For Petani */}
      {isPetani && (
        <Dialog
          open={showApplicationHistoryModal}
          onOpenChange={(open) => {
            setShowApplicationHistoryModal(open);
            if (!open) {
              setApplicationHistoryTab("aktif");
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <Tabs value={applicationHistoryTab} onValueChange={(v) => setApplicationHistoryTab(v as "aktif" | "tertutup" | "riwayat")} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="aktif">
                    Aktif ({programs.filter((p) => p.status === "active").length})
                  </TabsTrigger>
                  <TabsTrigger value="tertutup">
                    Tertutup ({programs.filter((p) => p.status === "closed").length})
                  </TabsTrigger>
                  <TabsTrigger value="riwayat">
                    Riwayat Pengajuan ({smartContractApplications.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="aktif" className="mt-4">
                  <div className="space-y-3">
                    {programs
                      .filter((p) => p.status === "active")
                      .map((program) => {
                        const eligibility = checkEligibility(program);
                        return (
                          <Card key={program.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-foreground">{program.name}</h3>
                                  <Badge className="bg-emerald-100 text-emerald-800">Aktif</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{program.description}</p>

                                <div className="flex items-center gap-2 mb-3">
                                  <div
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      eligibility.eligible
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {eligibility.percentage}% Memenuhi Syarat
                                  </div>
                                  {eligibility.eligible && (
                                    <Badge variant="outline" className="text-xs">
                                      Bisa Ajukan
                                    </Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Luas Lahan</p>
                                    <p className="font-medium">
                                      {program.smartContract.minLandArea}-
                                      {Math.min(program.smartContract.maxLandArea, SUBSIDY_MAX_LAND_AREA)} ha
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Komoditas</p>
                                    <p className="font-medium">
                                      {program.smartContract.allowedCommodities.join(", ")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Deadline</p>
                                    <p className="font-medium">
                                      {new Date(program.deadline).toLocaleDateString("id-ID")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Max Subsidi</p>
                                    <p className="font-medium text-emerald-600">
                                      {formatCurrency(program.smartContract.maxSubsidyAmount)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyClick(program)}
                                  disabled={!eligibility.eligible}
                                  className="gap-1"
                                >
                                  <Plus className="w-4 h-4" />
                                  Ajukan
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDetailClick(program)}>
                                  Detail
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="tertutup" className="mt-4">
                  <div className="space-y-3">
                    {programs
                      .filter((p) => p.status === "closed")
                      .map((program) => (
                        <Card key={program.id} className="p-4 border-gray-200">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">{program.name}</h3>
                                <Badge variant="secondary">Tertutup</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{program.description}</p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">Luas Lahan</p>
                                  <p className="font-medium">
                                    {program.smartContract.minLandArea}-
                                    {Math.min(program.smartContract.maxLandArea, SUBSIDY_MAX_LAND_AREA)} ha
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Komoditas</p>
                                  <p className="font-medium">
                                    {program.smartContract.allowedCommodities.join(", ")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Deadline</p>
                                  <p className="font-medium">
                                    {new Date(program.deadline).toLocaleDateString("id-ID")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Total Pemohon</p>
                                  <p className="font-medium">{program.totalApplicants.toLocaleString("id-ID")}</p>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleDetailClick(program)}>
                              Detail
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="riwayat" className="mt-4">
                  {smartContractApplications.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Belum ada keputusan smart contract</p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {smartContractApplications
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
                        )
                        .map((application) => {
                          const program = programs.find(
                            (p) => p.id === application.programId
                          );
                          const receiptConfirmation = getReceiptConfirmation(application.id);

                          return (
                            <Card key={application.id} className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-sm font-semibold text-foreground">
                                      {program?.name || application.programId}
                                    </h3>
                                    <Badge className={getStatusColor(application.status)}>
                                      {getStatusLabel(application.status)}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                    <div>
                                      <p className="text-xs text-muted-foreground">ID Pengajuan</p>
                                      <p className="font-mono text-xs font-medium">{application.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Komoditas</p>
                                      <p className="font-medium">{application.komoditas}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Detail</p>
                                      <p className="font-medium">
                                        {application.notes ||
                                          (application.status === "approved"
                                            ? "Lolos validasi smart contract"
                                            : "Tidak lolos validasi smart contract")}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Tempat Ambil Subsidi</p>
                                      <p className="font-medium">{getPickupLocation(application)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Tanggal Ajuan</p>
                                      <p className="font-medium">
                                        {new Date(application.submissionDate).toLocaleDateString("id-ID")}
                                      </p>
                                    </div>
                                  </div>

                                  {application.notes && (
                                    <p className="text-xs text-muted-foreground mt-2">{application.notes}</p>
                                  )}
                                  {application.status === "approved" && (
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                      {receiptConfirmation ? (
                                        <>
                                          <Badge className="bg-blue-100 text-blue-800">
                                            Subsidi diterima pada {new Date(receiptConfirmation.confirmedAt).toLocaleDateString("id-ID")}
                                          </Badge>
                                          {/* Cair Dana button */}
                                          <Button
                                            size="sm"
                                            variant="default"
                                            className="bg-gradient-to-r from-green-500 to-green-700 text-white"
                                            onClick={() => toast({ title: "Cair Dana", description: "Dana dari investor berhasil dicairkan ke rekening Anda." })}
                                          >
                                            Cair Dana
                                          </Button>
                                          {/* Update Berkala button */}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toast({ title: "Update Berkala", description: "Update berkala berhasil dikirim ke investor." })}
                                          >
                                            Update Berkala
                                          </Button>
                                        </>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => openReceiptProofModal(application)}
                                        >
                                          Konfirmasi Subsidi Diterima
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </TabsContent>

              </Tabs>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowApplicationHistoryModal(false)}
                variant="outline"
                className="w-full"
              >
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Receipt Proof Modal - For Petani */}
      {isPetani && (
        <Dialog
          open={showReceiptProofModal}
          onOpenChange={(open) => {
            setShowReceiptProofModal(open);
            if (!open) {
              setSelectedReceiptApplication(null);
            }
          }}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Bukti Penerimaan Subsidi</DialogTitle>
            </DialogHeader>

            {selectedReceiptApplication && (
              <div className="space-y-4">
                <div className="bg-accent/10 border border-accent/20 rounded p-3">
                  <p className="text-sm text-muted-foreground">
                    Untuk konfirmasi subsidi diterima, wajib lampirkan bukti foto kamera.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Foto Bukti Diterima *</Label>
                  <Input
                    className="mt-1"
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleProofImageChange(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Gunakan kamera perangkat untuk mengambil foto terbaru sebagai bukti.
                  </p>
                </div>

                {receiptProofImageDataUrl && (
                  <div className="border rounded-md p-2">
                    <img
                      src={receiptProofImageDataUrl}
                      alt="Bukti penerimaan subsidi"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReceiptProofModal(false);
                      setSelectedReceiptApplication(null);
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleConfirmReceipt(selectedReceiptApplication)}
                    disabled={!receiptProofImageDataUrl}
                  >
                    Konfirmasi Diterima
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
