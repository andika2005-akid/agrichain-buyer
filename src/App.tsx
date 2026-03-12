import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PetaPotensiPage from "@/pages/PetaPotensiPage";
import RegistrasiPage from "@/pages/RegistrasiPage";
import DaftarTanamPanenPage from "@/pages/DaftarTanamPanenPage";
import ScoringPage from "@/pages/ScoringPage";
import BlockchainPage from "@/pages/BlockchainPage";
import FraudDetectionPage from "@/pages/FraudDetectionPage";
import MonitoringPage from "@/pages/MonitoringPage";
import NotFound from "@/pages/NotFound";
import RekomendasiKomoditasPage from "@/pages/RekomendasiKomoditasPage";
import PengajuanKURPage from "@/pages/PengajuanKURPage";
import ProfilePetaniPage from "@/pages/ProfilePetaniPage";
import PengajuanProposalPage from "@/pages/PengajuanProposalPage";
import DaftarInvestorProposalsPage from "@/pages/DaftarInvestorProposalsPage";
import AnalisisProposalPage from "@/pages/AnalisisProposalPage";
import PengajuanBuyerPage from "@/pages/PengajuanBuyerPage";
import RiwayatInvestasiPage from "@/pages/RiwayatInvestasiPage";
import InvestorPortfolioPage from "@/pages/InvestorPortfolioPage";
import KementerianRiskPredictionPage from "@/pages/KementerianRiskPredictionPage";
import ProgramSubsidiPage from "@/pages/ProgramSubsidiPage";
import MarketplaceHasilPanenPage from "@/pages/MarketplaceHasilPanenPage";
import PetaniAjukanJualPage from "@/pages/PetaniAjukanJualPage";
import KontrakPembelianPage from "@/pages/KontrakPembelianPage";
import MonitoringProduksiPage from "@/pages/MonitoringProduksiPage";
import MonitoringProyekPage from "@/pages/MonitoringProyekPage";
import RiwayatPembelianPage from "@/pages/RiwayatPembelianPage";
import BuyerRekomendasiKomoditasPage from "@/pages/BuyerRekomendasiKomoditasPage";

const queryClient = new QueryClient();

function AppRoutes() {
    {/* MonitoringProyekPage removed, now integrated in proposal detail */}
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // Redirect ke menu paling atas berdasarkan role
  const getFirstMenuPath = (userRole: string) => {
    switch (userRole) {
      case "petani":
        return "/profile"; // Profil Petani - menu pertama
      case "investor":
        return "/daftar-proposals"; // Daftar Proposal - menu pertama (skip Dashboard)
      case "standby_buyer":
        return "/marketplace"; // Marketplace - menu pertama (skip Dashboard)
      case "kementerian":
        return "/peta-potensi"; // Peta Potensi - menu pertama (skip Dashboard)
      default:
        return "/dashboard";
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getFirstMenuPath(role)} replace />} />
      <Route element={<DashboardLayout />}>
          <Route path="/monitoring-proyek" element={<MonitoringProyekPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Role PETANI */}
        <Route path="/profile" element={<ProfilePetaniPage />} />
        <Route path="/catatan-pertanian" element={<DaftarTanamPanenPage />} />
        <Route path="/program-subsidi" element={<ProgramSubsidiPage />} />
        <Route path="/pengajuan-KUR" element={<PengajuanKURPage />} />
        <Route path="/pengajuan-proposal" element={<PengajuanProposalPage />} />
        <Route path="/rekomendasi-komoditas" element={<RekomendasiKomoditasPage />} />
        <Route path="/pengajuan-buyer" element={<PengajuanBuyerPage />} />
        <Route path="/ajukan-penjualan" element={<PetaniAjukanJualPage />} />

        {/* Role INVESTOR */}
        <Route path="/daftar-proposals" element={<DaftarInvestorProposalsPage />} />
        <Route path="/analisis-proposals" element={<AnalisisProposalPage />} />
        <Route path="/investor-portfolio" element={<InvestorPortfolioPage />} />
        <Route path="/riwayat-investasi" element={<RiwayatInvestasiPage />} />

        {/* Role STANDBY BUYER */}
        <Route path="/marketplace" element={<MarketplaceHasilPanenPage />} />
        <Route path="/kontrak-pembelian" element={<KontrakPembelianPage />} />
        <Route path="/monitoring-produksi" element={<MonitoringProduksiPage />} />
          <Route path="/monitoring-produksi" element={<MonitoringProduksiPage />} />
        <Route path="/riwayat-pembelian" element={<RiwayatPembelianPage />} />
        <Route path="/rekomendasi-komoditas-pembeli" element={<BuyerRekomendasiKomoditasPage />} />

        {/* Role KEMENTAN */}
        <Route path="/peta-potensi" element={<PetaPotensiPage />} />
        <Route path="/fraud" element={<FraudDetectionPage />} />
        <Route path="/blockchain" element={<BlockchainPage />} />
        <Route path="/risk-kementerian" element={<KementerianRiskPredictionPage />} />

        
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
