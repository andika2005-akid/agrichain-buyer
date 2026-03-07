import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PetaPotensiPage from "@/pages/PetaPotensiPage";
import RegistrasiPage from "@/pages/RegistrasiPage";
import DaftarTanamPanenPage from "@/pages/DaftarTanamPanenPage";
import PengajuanSubsidiPage from "@/pages/PengajuanSubsidiPage";
import ScoringPage from "@/pages/ScoringPage";
import BlockchainPage from "@/pages/BlockchainPage";
import FraudDetectionPage from "@/pages/FraudDetectionPage";
import MonitoringPage from "@/pages/MonitoringPage";
import NotFound from "@/pages/NotFound";
import RekomendasiKomoditasPage from "@/pages/RekomendasiKomoditasPage";
import PengajuanKURPage from "@/pages/PengajuanKURPage";
import ProfilePetaniPage from "@/pages/ProfilePetaniPage";
import BankMonitoringPembiayaanPage from "@/pages/BankMonitoringPembiayaanPage";
import PengajuanProposalPage from "@/pages/PengajuanProposalPage";
import DaftarInvestorProposalsPage from "@/pages/DaftarInvestorProposalsPage";
import AnalisisProposalPage from "@/pages/AnalisisProposalPage";
import RiwayatInvestasiPage from "@/pages/RiwayatInvestasiPage";
import InvestorPortfolioPage from "@/pages/InvestorPortfolioPage";
import BankKelayakanPage from "@/pages/BankKelayakanPage";
import KementerianMonitoringPage from "@/pages/KementerianMonitoringPage";
import BankKURAnalysisPage from "@/pages/BankKURAnalysisPage";
import BankRiskPredictionPage from "@/pages/BankRiskPredictionPage";
import KementerianRiskPredictionPage from "@/pages/KementerianRiskPredictionPage";
import ProgramSubsidiPage from "@/pages/ProgramSubsidiPage";
import ProgramControlPage from "@/pages/ProgramControlPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Role PETANI */}
        <Route path="/profile" element={<ProfilePetaniPage />} />
        <Route path="/catatan-pertanian" element={<DaftarTanamPanenPage />} />
        <Route path="/program-subsidi" element={<ProgramSubsidiPage />} />
        <Route path="/pengajuan-subsidi" element={<PengajuanSubsidiPage />} />
        <Route path="/pengajuan-KUR" element={<PengajuanKURPage />} />
        <Route path="/pengajuan-proposal" element={<PengajuanProposalPage />} />
        <Route path="/rekomendasi-komoditas" element={<RekomendasiKomoditasPage />} />

        {/* Role INVESTOR */}
        <Route path="/daftar-proposals" element={<DaftarInvestorProposalsPage />} />
        <Route path="/analisis-proposals" element={<AnalisisProposalPage />} />
        <Route path="/investor-portfolio" element={<InvestorPortfolioPage />} />
        <Route path="/riwayat-investasi" element={<RiwayatInvestasiPage />} />

        {/* Role BANK */}
        <Route path="/bank-kur-analysis" element={<BankKURAnalysisPage />} />
        <Route path="/bank-kelayakan" element={<BankKelayakanPage />} />
        <Route path="/risk-bank" element={<BankRiskPredictionPage />} />
        <Route path="/bank-monitoring-pembiayaan" element={<BankMonitoringPembiayaanPage />} />

        {/* Role KEMENTAN */}
        <Route path="/peta-potensi" element={<PetaPotensiPage />} />
        <Route path="/kementerian-monitoring" element={<KementerianMonitoringPage />} />
        <Route path="/fraud" element={<FraudDetectionPage />} />
        <Route path="/blockchain" element={<BlockchainPage />} />
        <Route path="/risk-kementerian" element={<KementerianRiskPredictionPage />} />
        <Route path="/program-control" element={<ProgramControlPage />} />

        
        <Route path="/registrasi" element={<RegistrasiPage />} />
        <Route path="/panen" element={<DaftarTanamPanenPage />} />
        <Route path="/scoring" element={<ScoringPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />  
        
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
