// Mock data for the agricultural subsidy system

export const provinceData = [
  { id: 1, name: "Jawa Barat", lat: -6.9175, lng: 107.6191, potential: "Tinggi", score: 87, commodity: "Padi", area: 125000, production: 11200000, farmers: 45000, subsidyTotal: 15200000000 },
  { id: 2, name: "Jawa Tengah", lat: -7.1510, lng: 110.1403, potential: "Tinggi", score: 92, commodity: "Padi", area: 142000, production: 12500000, farmers: 52000, subsidyTotal: 18500000000 },
  { id: 3, name: "Jawa Timur", lat: -7.5361, lng: 112.2384, potential: "Tinggi", score: 90, commodity: "Jagung", area: 135000, production: 10800000, farmers: 48000, subsidyTotal: 17200000000 },
  { id: 4, name: "Sulawesi Selatan", lat: -5.1477, lng: 119.4327, potential: "Sedang", score: 75, commodity: "Kakao", area: 85000, production: 5200000, farmers: 28000, subsidyTotal: 9800000000 },
  { id: 5, name: "Sumatera Utara", lat: 3.5952, lng: 98.6722, potential: "Sedang", score: 72, commodity: "Sawit", area: 95000, production: 6800000, farmers: 32000, subsidyTotal: 11000000000 },
  { id: 6, name: "Kalimantan Barat", lat: -0.0263, lng: 109.3425, potential: "Sedang", score: 68, commodity: "Karet", area: 72000, production: 3500000, farmers: 18000, subsidyTotal: 6500000000 },
  { id: 7, name: "NTB", lat: -8.6529, lng: 116.3249, potential: "Rawan", score: 55, commodity: "Tembakau", area: 45000, production: 1800000, farmers: 12000, subsidyTotal: 4200000000 },
  { id: 8, name: "NTT", lat: -10.1772, lng: 123.6070, potential: "Rawan", score: 42, commodity: "Jagung", area: 38000, production: 1200000, farmers: 15000, subsidyTotal: 5100000000 },
  { id: 9, name: "Papua", lat: -4.2699, lng: 138.0804, potential: "Rawan", score: 38, commodity: "Sagu", area: 25000, production: 800000, farmers: 8000, subsidyTotal: 3200000000 },
  { id: 10, name: "Bali", lat: -8.3405, lng: 115.0920, potential: "Sedang", score: 70, commodity: "Padi", area: 32000, production: 2100000, farmers: 9000, subsidyTotal: 3800000000 },
];

export const farmerApplications = [
  {
    id: "F001",
    name: "Ahmad Suryadi",
    nik: "3201****1234",
    province: "Jawa Barat",
    area: 2.5,
    commodity: "Padi",
    soilType: "alluvial",
    soilPH: 6.8,
    moisture: 32, // %
    historicalRain: 220, // mm/month
    predictedTemp3m: 26,
    address: "Desa Sukamaju, Kecamatan Sukatani, Kabupaten Sukamulya",
    phone: "081234567890",
    eligibilityScore: 85,
    riskLevel: "Rendah",
    status: "approved",
    subsidyType: "Pupuk + Benih",
    amount: 3500000,
    date: "2024-01-15",
  },
  {
    id: "F002",
    name: "Budi Hartono",
    nik: "3301****5678",
    province: "Jawa Tengah",
    area: 1.8,
    commodity: "Padi",
    soilType: "latosol",
    soilPH: 5.9,
    moisture: 28,
    historicalRain: 205,
    predictedTemp3m: 27,
    address: "Desa Karang, Kecamatan Banyumas, Kabupaten Banyumas",
    phone: "081298765432",
    eligibilityScore: 78,
    riskLevel: "Sedang",
    status: "approved",
    subsidyType: "Pupuk",
    amount: 2200000,
    date: "2024-01-18",
  },
  {
    id: "F003",
    name: "Dewi Sartika",
    nik: "3501****9012",
    province: "Jawa Timur",
    area: 3.2,
    commodity: "Jagung",
    soilType: "grumosol",
    soilPH: 6.2,
    moisture: 25,
    historicalRain: 180,
    predictedTemp3m: 27,
    address: "Desa Tegalwangi, Kecamatan Sidoarjo, Kabupaten Sidoarjo",
    phone: "08125551234",
    eligibilityScore: 92,
    riskLevel: "Rendah",
    status: "approved",
    subsidyType: "Pupuk + Alat",
    amount: 5800000,
    date: "2024-01-20",
  },
  {
    id: "F004",
    name: "Eko Prasetyo",
    nik: "7301****3456",
    province: "Sulawesi Selatan",
    area: 1.5,
    commodity: "Kakao",
    soilType: "podsolik",
    soilPH: 5.3,
    moisture: 22,
    historicalRain: 130,
    predictedTemp3m: 25,
    address: "Desa Maros, Kecamatan Makassar, Kabupaten Maros",
    phone: "08124443322",
    eligibilityScore: 65,
    riskLevel: "Sedang",
    status: "pending",
    subsidyType: "Benih",
    amount: 1800000,
    date: "2024-02-01",
  },
  {
    id: "F005",
    name: "Fatimah Zahra",
    nik: "5201****7890",
    province: "NTB",
    area: 0.8,
    commodity: "Tembakau",
    soilType: "alluvial",
    soilPH: 7.2,
    moisture: 18,
    historicalRain: 90,
    predictedTemp3m: 29,
    address: "Desa Bayan, Kecamatan Bayan, Kabupaten Lombok Utara",
    phone: "081277788899",
    eligibilityScore: 45,
    riskLevel: "Tinggi",
    status: "rejected",
    subsidyType: "-",
    amount: 0,
    date: "2024-02-05",
  },
  {
    id: "F006",
    name: "Gunawan Wibowo",
    nik: "6101****2345",
    province: "Kalimantan Barat",
    area: 4.0,
    commodity: "Karet",
    soilType: "latosol",
    soilPH: 6.0,
    moisture: 35,
    historicalRain: 210,
    predictedTemp3m: 26,
    address: "Desa Pontianak, Kecamatan Pontianak Kota, Kabupaten Pontianak",
    phone: "081299900011",
    eligibilityScore: 88,
    riskLevel: "Rendah",
    status: "approved",
    subsidyType: "Alat + Irigasi",
    amount: 7200000,
    date: "2024-02-10",
  },
  {
    id: "F007",
    name: "Hendra Saputra",
    nik: "1201****6789",
    province: "Sumatera Utara",
    area: 5.5,
    commodity: "Sawit",
    soilType: "grumosol",
    soilPH: 5.7,
    moisture: 30,
    historicalRain: 220,
    predictedTemp3m: 26,
    address: "Desa Medan, Kecamatan Medan Petisah, Kabupaten Medan",
    phone: "081266655544",
    eligibilityScore: 72,
    riskLevel: "Sedang",
    status: "pending",
    subsidyType: "Pupuk",
    amount: 3000000,
    date: "2024-02-15",
  },
  {
    id: "F008",
    name: "Indah Permata",
    nik: "3201****0123",
    province: "Jawa Barat",
    area: 1.2,
    commodity: "Padi",
    soilType: "latosol",
    soilPH: 6.9,
    moisture: 20,
    historicalRain: 200,
    predictedTemp3m: 26,
    address: "Desa Bandung, Kecamatan Bandung Wetan, Kabupaten Bandung",
    phone: "081233344455",
    eligibilityScore: 58,
    riskLevel: "Tinggi",
    status: "review",
    subsidyType: "Bantuan Tunai",
    amount: 1500000,
    date: "2024-02-18",
  },
];

export const blockchainRecords = [
  { txHash: "0x7a3f...e2b1", farmer: "Ahmad Suryadi", subsidyType: "Pupuk + Benih", amount: 3500000, timestamp: "2024-01-16 08:23:45", block: 18234567, status: "confirmed" },
  { txHash: "0x9c1d...f4a8", farmer: "Budi Hartono", subsidyType: "Pupuk", amount: 2200000, timestamp: "2024-01-19 14:12:33", block: 18234890, status: "confirmed" },
  { txHash: "0x2b8e...a7c3", farmer: "Dewi Sartika", subsidyType: "Pupuk + Alat", amount: 5800000, timestamp: "2024-01-21 09:45:12", block: 18235102, status: "confirmed" },
  { txHash: "0x5d4f...c9e2", farmer: "Gunawan Wibowo", subsidyType: "Alat + Irigasi", amount: 7200000, timestamp: "2024-02-11 11:30:22", block: 18236421, status: "confirmed" },
  { txHash: "0x1e6a...b3d5", farmer: "Hendra Saputra", subsidyType: "Pupuk", amount: 3000000, timestamp: "2024-02-16 16:55:08", block: 18237001, status: "pending" },
];

export const fraudAlerts = [
  { id: 1, type: "Duplikasi NIK", severity: "critical", description: "NIK 3201****1234 terdeteksi digunakan di 2 pengajuan berbeda", location: "Jawa Barat", date: "2024-02-20", status: "investigating" },
  { id: 2, type: "Lahan Tidak Wajar", severity: "warning", description: "Luas lahan 50 Ha tidak sesuai rata-rata wilayah (2.3 Ha)", location: "NTT", date: "2024-02-19", status: "flagged" },
  { id: 3, type: "Pengajuan Massal", severity: "critical", description: "15 pengajuan dari IP yang sama dalam 30 menit", location: "Sulawesi Selatan", date: "2024-02-18", status: "blocked" },
  { id: 4, type: "Pola Distribusi Abnormal", severity: "warning", description: "Subsidi pupuk 5x lipat dari rata-rata kecamatan", location: "Jawa Tengah", date: "2024-02-17", status: "investigating" },
];

export const monthlySubsidyData = [
  { month: "Jan", pupuk: 4200, benih: 2800, irigasi: 1500, alat: 900, tunai: 600 },
  { month: "Feb", pupuk: 3800, benih: 3200, irigasi: 1200, alat: 1100, tunai: 800 },
  { month: "Mar", pupuk: 5100, benih: 2500, irigasi: 1800, alat: 700, tunai: 500 },
  { month: "Apr", pupuk: 4600, benih: 3000, irigasi: 2100, alat: 1300, tunai: 900 },
  { month: "Mei", pupuk: 5500, benih: 3400, irigasi: 1600, alat: 1000, tunai: 700 },
  { month: "Jun", pupuk: 4800, benih: 2900, irigasi: 1900, alat: 1200, tunai: 1100 },
];

export const commodityDistribution = [
  { name: "Padi", value: 35, fill: "hsl(210, 80%, 25%)" },
  { name: "Jagung", value: 20, fill: "hsl(42, 90%, 55%)" },
  { name: "Sawit", value: 18, fill: "hsl(152, 60%, 42%)" },
  { name: "Kakao", value: 12, fill: "hsl(175, 45%, 40%)" },
  { name: "Karet", value: 8, fill: "hsl(210, 70%, 45%)" },
  { name: "Lainnya", value: 7, fill: "hsl(220, 15%, 70%)" },
];

export interface SubsidyProgram {
  id: string;
  name: string;
  description: string;
  deadline: string;
  available: boolean;
  createdBy: string;
  createdDate: string;
  maxBudget: number;
  allocatedBudget: number;
  smartContract: {
    minLandArea: number; // in hectare
    maxLandArea: number;
    minEligibilityScore: number; // 0-100
    maxEligibilityScore: number;
    allowedRiskLevels: string[]; // 'Rendah', 'Sedang', 'Tinggi'
    allowedCommodities: string[];
    allowedProvinces: string[];
    subsidyType: string; // Pupuk, Benih, Alat, Irigasi, Tunai, or combination
    maxSubsidyAmount: number;
    automaticApprovalThreshold: number; // eligibility score threshold for auto-approval
  };
  requirements: string[];
  status: "draft" | "active" | "closed" | "suspended";
  totalApplicants: number;
  approvedApplicants: number;
}

export const ongoingSubsidyPrograms: SubsidyProgram[] = [
  {
    id: "P2026-01",
    name: "Subsidi Pupuk Musim Tanam 2026",
    description: "Program subsidi pupuk untuk musim tanam awal 2026. Penerima: petani kecil dan menengah dengan lahan di bawah 5 hektar.",
    deadline: "2026-04-30",
    available: true,
    createdBy: "Dr. Siti Rahayu",
    createdDate: "2026-01-15",
    maxBudget: 500000000000, // 500 Miliar
    allocatedBudget: 350000000000,
    smartContract: {
      minLandArea: 0.5,
      maxLandArea: 5,
      minEligibilityScore: 60,
      maxEligibilityScore: 100,
      allowedRiskLevels: ["Rendah", "Sedang"],
      allowedCommodities: ["Padi", "Jagung", "Kacang"],
      allowedProvinces: ["Jawa Barat", "Jawa Tengah", "Jawa Timur"],
      subsidyType: "Pupuk",
      maxSubsidyAmount: 5000000,
      automaticApprovalThreshold: 80,
    },
    requirements: [
      "Memiliki lahan pertanian 0.5 - 5 hektar",
      "Skor kelayakan minimal 60",
      "Tingkat risiko Rendah atau Sedang",
      "Menanam komoditas: Padi, Jagung, atau Kacang",
      "Lokasi di Jawa Barat, Jawa Tengah, atau Jawa Timur",
      "Melampirkan sertifikat tanah atau bukti kepemilikan",
      "Tidak pernah melakukan kecurangan subsidi sebelumnya",
    ],
    status: "active",
    totalApplicants: 2450,
    approvedApplicants: 2187,
  },
  {
    id: "P2026-02",
    name: "Bantuan Benih Unggul 2026",
    description: "Distribusi benih unggul bersertifikat untuk komoditas pilihan dengan dukungan teknologi pertanian modern.",
    deadline: "2026-05-15",
    available: true,
    createdBy: "Dr. Siti Rahayu",
    createdDate: "2026-01-20",
    maxBudget: 300000000000,
    allocatedBudget: 180000000000,
    smartContract: {
      minLandArea: 0.3,
      maxLandArea: 10,
      minEligibilityScore: 55,
      maxEligibilityScore: 100,
      allowedRiskLevels: ["Rendah", "Sedang"],
      allowedCommodities: ["Padi", "Jagung", "Kacang", "Kedelai"],
      allowedProvinces: ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sulawesi Selatan"],
      subsidyType: "Benih",
      maxSubsidyAmount: 3000000,
      automaticApprovalThreshold: 75,
    },
    requirements: [
      "Memiliki lahan pertanian 0.3 - 10 hektar",
      "Skor kelayakan minimal 55",
      "Tingkat risiko tidak Tinggi",
      "Bersedia mengikuti program pelatihan pertanian",
      "Melaporkan hasil panen pada akhir musim tanam",
      "Menyetujui monitoring dan verifikasi lapangan",
    ],
    status: "active",
    totalApplicants: 1850,
    approvedApplicants: 1523,
  },
  {
    id: "P2026-03",
    name: "Skema Irigasi Mikro 2026",
    description: "Dukungan fasilitas irigasi mikro untuk kawasan prioritas dengan durabilitas jangka panjang.",
    deadline: "2026-06-01",
    available: false,
    createdBy: "Dr. Siti Rahayu",
    createdDate: "2025-12-10",
    maxBudget: 800000000000,
    allocatedBudget: 800000000000,
    smartContract: {
      minLandArea: 2,
      maxLandArea: 20,
      minEligibilityScore: 70,
      maxEligibilityScore: 100,
      allowedRiskLevels: ["Rendah", "Sedang"],
      allowedCommodities: ["Padi", "Jagung", "Sayuran"],
      allowedProvinces: ["NTB", "NTT", "Sulawesi Selatan", "Kalimantan Barat"],
      subsidyType: "Irigasi",
      maxSubsidyAmount: 25000000,
      automaticApprovalThreshold: 85,
    },
    requirements: [
      "Memiliki lahan pertanian 2 - 20 hektar",
      "Skor kelayakan minimal 70",
      "Tingkat risiko Rendah atau Sedang",
      "Lokasi di kawasan rawan kekeringan",
      "Bersedia berkontribusi dana pribadi minimal 20%",
      "Melakukan pemeliharaan fasilitas irigasi",
    ],
    status: "closed",
    totalApplicants: 856,
    approvedApplicants: 756,
  },
  {
    id: "P2026-04",
    name: "Bantuan Alat & Mesin Pertanian 2026",
    description: "Program subsidi alat dan mesin pertanian modern untuk meningkatkan produktivitas pertanian berkelanjutan.",
    deadline: "2026-07-30",
    available: true,
    createdBy: "Dr. Siti Rahayu",
    createdDate: "2026-02-01",
    maxBudget: 1000000000000, // 1 Triliun
    allocatedBudget: 500000000000,
    smartContract: {
      minLandArea: 1,
      maxLandArea: 50,
      minEligibilityScore: 65,
      maxEligibilityScore: 100,
      allowedRiskLevels: ["Rendah", "Sedang"],
      allowedCommodities: ["Padi", "Jagung", "Kacang", "KDelai", "Karet", "Sawit"],
      allowedProvinces: ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatera Utara", "Kalimantan Barat"],
      subsidyType: "Alat",
      maxSubsidyAmount: 50000000,
      automaticApprovalThreshold: 80,
    },
    requirements: [
      "Memiliki lahan pertanian 1 - 50 hektar",
      "Skor kelayakan minimal 65",
      "Tingkat risiko Rendah atau Sedang",
      "Memiliki rencana penggunaan alat yang jelas",
      "Bersedia mengikuti pelatihan penggunaan alat",
      "Melakukan pelaporan penggunaan alat setiap bulan",
      "Menjaga dan merawat alat dengan baik",
    ],
    status: "active",
    totalApplicants: 1200,
    approvedApplicants: 920,
  },
];
export const plantingRecords = [
  { id: "T001", farmerId: "F001", farmerName: "Ahmad Suryadi", luasTanam: 2.5, tanggalTanam: "2024-02-01", jenisBenih: "Benih Unggul Bersertifikat", komoditas: "Padi", pakaiBsubsidi: true, subsidiAccepted: false, createdAt: "2024-02-01 08:00:00" },
  { id: "T002", farmerId: "F003", farmerName: "Dewi Sartika", luasTanam: 3.2, tanggalTanam: "2024-02-05", jenisBenih: "Benih Hibrida", komoditas: "Jagung", pakaiBsubsidi: true, subsidiAccepted: false, createdAt: "2024-02-05 10:30:00" },
  { id: "T003", farmerId: "F006", farmerName: "Gunawan Wibowo", luasTanam: 4.0, tanggalTanam: "2024-02-08", jenisBenih: "Benih Lokal", komoditas: "Karet", pakaiBsubsidi: false, subsidiAccepted: false, createdAt: "2024-02-08 09:15:00" },
];

// KUR / financing application mocks used by bank dashboard
export interface KURApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  komoditas: string;
  jumlahPinjaman: number;
  tenor: number;
  bankName: string;
  tujuanPendanaan: string;
  status: "submitted" | "approved" | "rejected" | "disbursed";
  submissionDate: string;
  createdAt: string;
}

export const kurApplications: KURApplication[] = [
  {
    id: "P001",
    farmerId: "F001",
    farmerName: "Ahmad Suryadi",
    komoditas: "Padi",
    jumlahPinjaman: 50000000,
    tenor: 24,
    bankName: "Bank Rakyat Indonesia",
    tujuanPendanaan: "Membeli mesin pengolahan",
    status: "approved",
    submissionDate: "2024-02-10",
    createdAt: "2024-02-10",
  },
  {
    id: "P002",
    farmerId: "F002",
    farmerName: "Budi Hartono",
    komoditas: "Jagung",
    jumlahPinjaman: 75000000,
    tenor: 18,
    bankName: "Bank Mandiri",
    tujuanPendanaan: "Biaya input pertanian",
    status: "submitted",
    submissionDate: "2024-02-11",
    createdAt: "2024-02-11",
  },
  {
    id: "P003",
    farmerId: "F003",
    farmerName: "Dewi Sartika",
    komoditas: "Jagung",
    jumlahPinjaman: 35000000,
    tenor: 36,
    bankName: "Bank Negara Indonesia",
    tujuanPendanaan: "Pengembangan lahan dan irigasi",
    status: "approved",
    submissionDate: "2024-02-05",
    createdAt: "2024-02-05",
  },
];

// Subsidy Program Applications
export interface SubsidyProgramApplication {
  id: string;
  programId: string;
  farmerId: string;
  farmerName: string;
  farmArea: number;
  komoditas: string;
  province: string;
  eligibilityScore: number;
  riskLevel: string;
  requestedAmount: number;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "disbursed";
  submissionDate: string;
  reviewDate?: string;
  approvalDate?: string;
  notes?: string;
  smartContractValidation: {
    landAreaValid: boolean;
    eligibilityScoreValid: boolean;
    riskLevelValid: boolean;
    commodityValid: boolean;
    provinceValid: boolean;
    totalValidation: boolean;
  };
  blockchainHash?: string;
  createdAt: string;
}

export const subsidyProgramApplications: SubsidyProgramApplication[] = [
  {
    id: "SPA001",
    programId: "P2026-01",
    farmerId: "F001",
    farmerName: "Ahmad Suryadi",
    farmArea: 2.5,
    komoditas: "Padi",
    province: "Jawa Barat",
    eligibilityScore: 85,
    riskLevel: "Rendah",
    requestedAmount: 4500000,
    status: "approved",
    submissionDate: "2026-02-01",
    reviewDate: "2026-02-05",
    approvalDate: "2026-02-08",
    notes: "Otomatis disetujui sistem berdasarkan skor eligibilitas > 80",
    smartContractValidation: {
      landAreaValid: true,
      eligibilityScoreValid: true,
      riskLevelValid: true,
      commodityValid: true,
      provinceValid: true,
      totalValidation: true,
    },
    blockchainHash: "0x7a3f...e2b1",
    createdAt: "2026-02-01",
  },
  {
    id: "SPA002",
    programId: "P2026-01",
    farmerId: "F003",
    farmerName: "Dewi Sartika",
    farmArea: 3.2,
    komoditas: "Jagung",
    province: "Jawa Timur",
    eligibilityScore: 92,
    riskLevel: "Rendah",
    requestedAmount: 5000000,
    status: "approved",
    submissionDate: "2026-02-02",
    reviewDate: "2026-02-03",
    approvalDate: "2026-02-05",
    notes: "Aplikasi berkualitas tinggi, semua syarat terpenuhi dengan sempurna",
    smartContractValidation: {
      landAreaValid: true,
      eligibilityScoreValid: true,
      riskLevelValid: true,
      commodityValid: true,
      provinceValid: true,
      totalValidation: true,
    },
    blockchainHash: "0x2b8e...a7c3",
    createdAt: "2026-02-02",
  },
  {
    id: "SPA003",
    programId: "P2026-02",
    farmerId: "F006",
    farmerName: "Gunawan Wibowo",
    farmArea: 4.0,
    komoditas: "Karet",
    province: "Kalimantan Barat",
    eligibilityScore: 88,
    riskLevel: "Rendah",
    requestedAmount: 2800000,
    status: "submitted",
    submissionDate: "2026-02-10",
    notes: "Menunggu verifikasi lapangan",
    smartContractValidation: {
      landAreaValid: true,
      eligibilityScoreValid: true,
      riskLevelValid: true,
      commodityValid: false,
      provinceValid: true,
      totalValidation: false,
    },
    createdAt: "2026-02-10",
  },
  {
    id: "SPA004",
    programId: "P2026-01",
    farmerId: "F002",
    farmerName: "Budi Hartono",
    farmArea: 1.8,
    komoditas: "Padi",
    province: "Jawa Tengah",
    eligibilityScore: 78,
    riskLevel: "Sedang",
    requestedAmount: 3200000,
    status: "rejected",
    submissionDate: "2026-01-28",
    reviewDate: "2026-02-06",
    notes: "Ditolak: Skor eligibilitas di bawah threshold otomatis (78 < 80), memerlukan review manual",
    smartContractValidation: {
      landAreaValid: true,
      eligibilityScoreValid: false,
      riskLevelValid: true,
      commodityValid: true,
      provinceValid: true,
      totalValidation: false,
    },
    createdAt: "2026-01-28",
  },
  {
    id: "SPA005",
    programId: "P2026-04",
    farmerId: "F001",
    farmerName: "Ahmad Suryadi",
    farmArea: 2.5,
    komoditas: "Padi",
    province: "Jawa Barat",
    eligibilityScore: 85,
    riskLevel: "Rendah",
    requestedAmount: 15000000,
    status: "under_review",
    submissionDate: "2026-02-12",
    notes: "Sedang dalam review oleh petugas kementerian",
    smartContractValidation: {
      landAreaValid: true,
      eligibilityScoreValid: true,
      riskLevelValid: true,
      commodityValid: true,
      provinceValid: true,
      totalValidation: true,
    },
    createdAt: "2026-02-12",
  },
];

export const harvestRecords = [
  { id: "H001", farmerId: "F001", farmerName: "Ahmad Suryadi", luasPanen: 2.5, tanggalPanen: "2024-05-15", totalHasilPanen: 12500, hargaJual: 5000, komoditas: "Padi", totalPenjualan: 62500000, subsidiAccepted: false, createdAt: "2024-05-15 11:00:00" },
  { id: "H002", farmerId: "F003", farmerName: "Dewi Sartika", luasPanen: 3.0, tanggalPanen: "2024-05-20", totalHasilPanen: 16200, hargaJual: 4500, komoditas: "Jagung", totalPenjualan: 72900000, subsidiAccepted: false, createdAt: "2024-05-20 14:30:00" },
];

// Funding proposals submitted by farmers (mutable mock store)
export type FundingProposal = {
  id: string;
  farmerId?: string;
  farmerName?: string;
  projectName: string;
  commodity: string;
  location: { lat?: number; lng?: number; label?: string };
  areaHa: number;
  totalSeed: number;
  plantingPeriod: string;
  harvestPeriod: string;
  totalFundRequested: number;
  fundBreakdown: Record<string, number>;
  estimatedYieldKg: number;
  estimatedPricePerKg: number;
  projectedProfit: number;
  revenueSharePercent: number;
  attachments?: { photos?: string[]; documents?: string[] };
  previousHarvests?: Array<{ year: number; yieldKg: number }>;
  status: "Draft" | "Menunggu review" | "Disetujui investor" | "Didanai" | "Berjalan" | "Selesai";
  createdAt: string;
};

export const fundingProposals: FundingProposal[] = [
  {
    id: "FP001",
    farmerId: "F001",
    farmerName: "Ahmad Suryadi",
    projectName: "Usaha Padi Sukamaju",
    commodity: "Padi",
    location: { label: "Jawa Barat" },
    areaHa: 2.5,
    totalSeed: 500,
    plantingPeriod: "2026-03",
    harvestPeriod: "2026-06",
    totalFundRequested: 50000000,
    fundBreakdown: { pupuk: 20000000, benih: 15000000, alat: 15000000 },
    estimatedYieldKg: 12000,
    estimatedPricePerKg: 5000,
    projectedProfit: 20000000,
    revenueSharePercent: 10,
    status: "Menunggu review",
    createdAt: "2026-03-10",
  },
  {
    id: "FP002",
    farmerId: "F002",
    farmerName: "Budi Hartono",
    projectName: "Jagung Banyumas",
    commodity: "Jagung",
    location: { label: "Jawa Tengah" },
    areaHa: 1.8,
    totalSeed: 300,
    plantingPeriod: "2026-03",
    harvestPeriod: "2026-07",
    totalFundRequested: 35000000,
    fundBreakdown: { pupuk: 12000000, benih: 10000000, alat: 13000000 },
    estimatedYieldKg: 8000,
    estimatedPricePerKg: 4000,
    projectedProfit: 14000000,
    revenueSharePercent: 8,
    status: "Menunggu review",
    createdAt: "2026-03-10",
  },
  {
    id: "FP003",
    farmerId: "F003",
    farmerName: "Dewi Sartika",
    projectName: "Jagung Sidoarjo",
    commodity: "Jagung",
    location: { label: "Jawa Timur" },
    areaHa: 3.2,
    totalSeed: 700,
    plantingPeriod: "2026-04",
    harvestPeriod: "2026-08",
    totalFundRequested: 45000000,
    fundBreakdown: { pupuk: 18000000, benih: 12000000, alat: 15000000 },
    estimatedYieldKg: 15000,
    estimatedPricePerKg: 4200,
    projectedProfit: 22000000,
    revenueSharePercent: 12,
    status: "Menunggu review",
    createdAt: "2026-03-10",
  },
];

// Mock climate data (simplified) per province id - used for recommendation engine
export const climateData = {
  1: { // Jawa Barat
    predictedRainNext3: 240, // mm/month average
    predictedTempNext3: 26, // °C
    predictedSeason: "wet",
    droughtRisk: "low",
    elNinoIndex: -0.2,
  },
  2: { // Jawa Tengah
    predictedRainNext3: 210,
    predictedTempNext3: 27,
    predictedSeason: "wet",
    droughtRisk: "low",
    elNinoIndex: -0.1,
  },
  3: { // Jawa Timur
    predictedRainNext3: 190,
    predictedTempNext3: 27,
    predictedSeason: "neutral",
    droughtRisk: "medium",
    elNinoIndex: 0.1,
  },
  4: { // Sulsel
    predictedRainNext3: 130,
    predictedTempNext3: 25,
    predictedSeason: "dry",
    droughtRisk: "medium",
    elNinoIndex: 0.3,
  },
  5: { // Sumut
    predictedRainNext3: 220,
    predictedTempNext3: 26,
    predictedSeason: "wet",
    droughtRisk: "low",
    elNinoIndex: -0.3,
  },
  // fallback defaults for other provinces
};

// Commodity ideal ranges used by rule-based recommender
export const commodityIdeals: Record<string, { rainMin: number; rainMax: number; tempMin: number; tempMax: number }> = {
  Padi: { rainMin: 200, rainMax: 300, tempMin: 22, tempMax: 30 },
  Jagung: { rainMin: 100, rainMax: 200, tempMin: 21, tempMax: 27 },
  Kedelai: { rainMin: 100, rainMax: 150, tempMin: 24, tempMax: 30 },
  Bawang: { rainMin: 20, rainMax: 80, tempMin: 18, tempMax: 25 },
  Cabai: { rainMin: 80, rainMax: 160, tempMin: 22, tempMax: 30 },
};

// mock data for buyers
export const buyers = [
  {
    id: "BUY001",
    companyName: "PT Nusantara Food",
    contactPerson: "Budi Santoso",
    email: "buyer@nusantarafood.com",
    phone: "081234567890",
    location: "Jakarta",
    commoditiesNeeded: ["Jagung", "Padi", "Cabai"],
    contractActive: 3
  },
  {
    id: "BUY002",
    companyName: "CV Agro Sejahtera",
    contactPerson: "Siti Aminah",
    email: "contact@agrosejahtera.com",
    phone: "082345678901",
    location: "Surabaya",
    commoditiesNeeded: ["Tomat", "Bawang"],
    contractActive: 2
  }
];

export const marketplaceCommodities = [
  {
    id: "COM001",
    farmerName: "Andi Pratama",
    commodity: "Jagung",
    estimatedHarvest: "20 Ton",
    harvestDate: "2026-08-12",
    location: "NTB",
    estimatedPrice: 4500
  },
  {
    id: "COM002",
    farmerName: "Rahmat Hidayat",
    commodity: "Cabai",
    estimatedHarvest: "5 Ton",
    harvestDate: "2026-07-25",
    location: "Jawa Barat",
    estimatedPrice: 32000
  }
];

export const purchaseContracts = [
  {
    id: "CTR001",
    buyer: "PT Nusantara Food",
    farmer: "Andi Pratama",
    commodity: "Jagung",
    quantity: "10 Ton",
    pricePerKg: 4500,
    totalValue: 45000000,
    harvestDate: "2026-08-12",
    status: "Berjalan"
  },
  {
    id: "CTR002",
    buyer: "CV Agro Sejahtera",
    farmer: "Rahmat Hidayat",
    commodity: "Cabai",
    quantity: "3 Ton",
    pricePerKg: 32000,
    totalValue: 96000000,
    harvestDate: "2026-07-25",
    status: "Pending"
  }
  ,
  {
    id: "CTR003",
    buyer: "PT Nusantara Food",
    farmer: "Ahmad Suryadi",
    farmerId: "F001",
    commodity: "Padi",
    quantity: "5 Ton",
    pricePerKg: 6800,
    totalValue: 34000000,
    harvestDate: "2026-06-20",
    status: "Pending"
  }
];

export const productionMonitoring = [
  {
    id: "PRD001",
    farmer: "Andi Pratama",
    farmerId: "F001",
    commodity: "Jagung",
    landArea: 2.5,
    province: "Jawa Barat",
    growthStage: "Vegetatif",
    growthPercentage: 25,
    estimatedHarvest: 20,
    harvestDate: "2026-05-15",
    riskLevel: "Rendah",
    notes: "Kondisi tanah sangat baik, kelembaban optimal",
    status: "Berjalan",
    lastUpdate: "2026-03-08"
  },
  {
    id: "PRD002",
    farmer: "Rahmat Hidayat",
    farmerId: "F002",
    commodity: "Cabai",
    landArea: 1.8,
    province: "Jawa Tengah",
    growthStage: "Berbunga",
    growthPercentage: 55,
    estimatedHarvest: 5,
    harvestDate: "2026-04-20",
    riskLevel: "Sedang",
    notes: "Serangan hama minor, sudah diberikan pestisida organik",
    status: "Berjalan",
    lastUpdate: "2026-03-07"
  },
  {
    id: "PRD003",
    farmer: "Dewi Sartika",
    farmerId: "F003",
    commodity: "Jagung",
    landArea: 3.2,
    province: "Jawa Timur",
    growthStage: "Pembungaan",
    growthPercentage: 65,
    estimatedHarvest: 32,
    harvestDate: "2026-04-10",
    riskLevel: "Rendah",
    notes: "Tanaman tumbuh optimal, hasil panen diproyeksikan meningkat 15%",
    status: "Berjalan",
    lastUpdate: "2026-03-08"
  },
  {
    id: "PRD004",
    farmer: "Eko Prasetyo",
    farmerId: "F004",
    commodity: "Kakao",
    landArea: 1.5,
    province: "Sulawesi Selatan",
    growthStage: "Berbuah",
    growthPercentage: 45,
    estimatedHarvest: 3.5,
    harvestDate: "2026-06-01",
    riskLevel: "Tinggi",
    notes: "Deteksi penyakit jamur, memerlukan perawatan intensif",
    status: "Berjalan",
    lastUpdate: "2026-03-06"
  },
  {
    id: "PRD005",
    farmer: "Siti Nurhaliza",
    farmerId: "F005",
    commodity: "Padi",
    landArea: 2.0,
    province: "Jawa Barat",
    growthStage: "Pemasakan",
    growthPercentage: 85,
    estimatedHarvest: 18,
    harvestDate: "2026-03-20",
    riskLevel: "Rendah",
    notes: "Siap panen dalam 2 minggu, kualitas butir sangat baik",
    status: "Berjalan",
    lastUpdate: "2026-03-08"
  },
  {
    id: "PRD006",
    farmer: "Bambang Suryanto",
    farmerId: "F006",
    commodity: "Kacang Tanah",
    landArea: 1.2,
    province: "Jawa Tengah",
    growthStage: "Vegetatif",
    growthPercentage: 30,
    estimatedHarvest: 4.5,
    harvestDate: "2026-05-01",
    riskLevel: "Sedang",
    notes: "Kebutuhan air terpenuhi, monitor pertumbuhan akar",
    status: "Berjalan",
    lastUpdate: "2026-03-07"
  }
];

export const purchaseHistory = [
  {
    id: "TRX001",
    buyer: "PT Nusantara Food",
    farmer: "Andi Pratama",
    farmerId: "F001",
    commodity: "Jagung",
    quantity: 8,
    quantityUnit: "Ton",
    pricePerKg: 4400,
    total: 35200000,
    date: "2026-02-10",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX002",
    buyer: "PT Sukses Makmur",
    farmer: "Rahmat Hidayat",
    farmerId: "F002",
    commodity: "Cabai",
    quantity: 2.5,
    quantityUnit: "Ton",
    pricePerKg: 32000,
    total: 80000000,
    date: "2026-02-15",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX003",
    buyer: "PT Nusantara Food",
    farmer: "Dewi Sartika",
    farmerId: "F003",
    commodity: "Jagung",
    quantity: 12,
    quantityUnit: "Ton",
    pricePerKg: 4500,
    total: 54000000,
    date: "2026-02-20",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX004",
    buyer: "PT Sukses Makmur",
    farmer: "Andi Pratama",
    farmerId: "F001",
    commodity: "Padi",
    quantity: 6,
    quantityUnit: "Ton",
    pricePerKg: 6500,
    total: 39000000,
    date: "2026-03-01",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX005",
    buyer: "PT Berkah Pertanian",
    farmer: "Siti Nurhaliza",
    farmerId: "F005",
    commodity: "Padi",
    quantity: 7,
    quantityUnit: "Ton",
    pricePerKg: 6800,
    total: 47600000,
    date: "2026-03-05",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX006",
    buyer: "PT Nusantara Food",
    farmer: "Bambang Suryanto",
    farmerId: "F006",
    commodity: "Kacang Tanah",
    quantity: 3,
    quantityUnit: "Ton",
    pricePerKg: 18000,
    total: 54000000,
    date: "2026-03-08",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX007",
    buyer: "PT Sukses Makmur",
    farmer: "Rahmat Hidayat",
    farmerId: "F002",
    commodity: "Cabai",
    quantity: 3,
    quantityUnit: "Ton",
    pricePerKg: 30000,
    total: 90000000,
    date: "2026-01-15",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TRX008",
    buyer: "PT Berkah Pertanian",
    farmer: "Andi Pratama",
    farmerId: "F001",
    commodity: "Jagung",
    quantity: 5,
    quantityUnit: "Ton",
    pricePerKg: 4200,
    total: 21000000,
    date: "2026-01-20",
    status: "Selesai",
    paymentMethod: "Bank Transfer"
  }
];

export const commodityRecommendations = [
  {
    commodity: "Jagung",
    demandLevel: "Tinggi",
    averagePrice: 4500,
    potentialRegion: "NTB",
    demand: 95,
    trend: "up",
    trendPercentage: 12.5,
    insight: "Permintaan tinggi dari industri pakan dan pangan",
    marketPotential: "Sangat Besar",
    badge: "Trending"
  },
  {
    commodity: "Cabai",
    demandLevel: "Tinggi",
    averagePrice: 32000,
    potentialRegion: "Jawa Barat",
    demand: 88,
    trend: "up",
    trendPercentage: 8.3,
    insight: "Komoditas strategis dengan permintaan konsisten tinggi",
    marketPotential: "Sangat Besar",
    badge: "Permintaan Tinggi"
  },
  {
    commodity: "Padi",
    demandLevel: "Tinggi",
    averagePrice: 6800,
    potentialRegion: "Jawa Tengah",
    demand: 92,
    trend: "up",
    trendPercentage: 5.2,
    insight: "Komoditas utama dengan stabilitas harga baik",
    marketPotential: "Sangat Besar",
    badge: "Permintaan Tinggi"
  },
  {
    commodity: "Kacang Tanah",
    demandLevel: "Sedang",
    averagePrice: 18000,
    potentialRegion: "Jawa Barat",
    demand: 72,
    trend: "up",
    trendPercentage: 6.8,
    insight: "Permintaan meningkat dari industri minyak nabati",
    marketPotential: "Besar",
    badge: "Potensi Tinggi"
  },
  {
    commodity: "Karet",
    demandLevel: "Sedang",
    averagePrice: 12500,
    potentialRegion: "Sumatera Utara",
    demand: 68,
    trend: "down",
    trendPercentage: -2.1,
    insight: "Komoditas ekspor dengan harga internasional",
    marketPotential: "Besar",
    badge: "Ekspor"
  },
  {
    commodity: "Sawit",
    demandLevel: "Tinggi",
    averagePrice: 8200,
    potentialRegion: "Sumatera Utara",
    demand: 85,
    trend: "up",
    trendPercentage: 9.7,
    insight: "Permintaan global tinggi untuk produk CPO",
    marketPotential: "Sangat Besar",
    badge: "Trending"
  },
  {
    commodity: "Tembakau",
    demandLevel: "Sedang",
    averagePrice: 28000,
    potentialRegion: "NTB",
    demand: 65,
    trend: "down",
    trendPercentage: -3.4,
    insight: "Permintaan domestik relatif stabil",
    marketPotential: "Menengah",
    badge: "Stabil"
  },
  {
    commodity: "Kakao",
    demandLevel: "Tinggi",
    averagePrice: 45000,
    potentialRegion: "Sulawesi Selatan",
    demand: 82,
    trend: "up",
    trendPercentage: 11.2,
    insight: "Permintaan global tinggi, harga premium",
    marketPotential: "Sangat Besar",
    badge: "Trending"
  }
];
