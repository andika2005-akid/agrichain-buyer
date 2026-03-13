import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { subsidyProgramApplications } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MonitoringProyekPage() {
  const { role } = useAuth();
  const userFarmerId = "F001"; // Demo: Ahmad Suryadi
  const approvedProposals = subsidyProgramApplications.filter(
    (app) => app.farmerId === userFarmerId && app.status === "approved"
  );

  // State for updates
  const [updates, setUpdates] = useState({});
  const [harvestReports, setHarvestReports] = useState({});

  if (role !== "petani") {
    return (
      <div className="p-6">Hanya petani yang dapat mengakses halaman ini.</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monitoring Proyek Pertanian</h1>
          <p className="text-sm text-muted-foreground">
            Update progres tanam, kondisi tanaman, foto perkembangan, penggunaan dana, dan laporan panen.
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {approvedProposals.length === 0 ? (
        <Card className="p-6 text-center">Belum ada proyek yang disetujui.</Card>
      ) : (
        approvedProposals.map((proposal) => (
          <Card key={proposal.id} className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">{proposal.komoditas} - {proposal.programId}</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">Progres Tanam</label>
              <Textarea
                value={updates[proposal.id]?.progresTanam || ""}
                onChange={e => setUpdates({ ...updates, [proposal.id]: { ...updates[proposal.id], progresTanam: e.target.value } })}
                placeholder="Contoh: Sudah tanam 80% lahan, bibit tumbuh baik"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Kondisi Tanaman</label>
              <Textarea
                value={updates[proposal.id]?.kondisiTanaman || ""}
                onChange={e => setUpdates({ ...updates, [proposal.id]: { ...updates[proposal.id], kondisiTanaman: e.target.value } })}
                placeholder="Contoh: Tanaman sehat, tidak ada hama"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Foto Perkembangan Tanaman</label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => setUpdates({ ...updates, [proposal.id]: { ...updates[proposal.id], foto: e.target.files?.[0] } })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Penggunaan Dana</label>
              <Textarea
                value={updates[proposal.id]?.penggunaanDana || ""}
                onChange={e => setUpdates({ ...updates, [proposal.id]: { ...updates[proposal.id], penggunaanDana: e.target.value } })}
                placeholder="Contoh: Pembelian pupuk, benih, alat pertanian"
              />
            </div>
            <hr className="my-4" />
            <h3 className="text-md font-bold mb-2">Laporan Panen</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Jumlah Produksi (kg)</label>
              <Input
                type="number"
                value={harvestReports[proposal.id]?.jumlahProduksi || ""}
                onChange={e => setHarvestReports({ ...harvestReports, [proposal.id]: { ...harvestReports[proposal.id], jumlahProduksi: e.target.value } })}
                placeholder="Contoh: 12000"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Harga Jual (Rp/kg)</label>
              <Input
                type="number"
                value={harvestReports[proposal.id]?.hargaJual || ""}
                onChange={e => setHarvestReports({ ...harvestReports, [proposal.id]: { ...harvestReports[proposal.id], hargaJual: e.target.value } })}
                placeholder="Contoh: 5000"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Keuntungan (Rp)</label>
              <Input
                type="number"
                value={harvestReports[proposal.id]?.keuntungan || ""}
                onChange={e => setHarvestReports({ ...harvestReports, [proposal.id]: { ...harvestReports[proposal.id], keuntungan: e.target.value } })}
                placeholder="Contoh: 20000000"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Laporan Bagi Hasil</label>
              <Textarea
                value={harvestReports[proposal.id]?.bagiHasil || ""}
                onChange={e => setHarvestReports({ ...harvestReports, [proposal.id]: { ...harvestReports[proposal.id], bagiHasil: e.target.value } })}
                placeholder="Contoh: Investor mendapat 40%, petani 60%"
              />
            </div>
            <Button className="mt-4">Simpan Update</Button>
          </Card>
        ))
      )}
      </motion.div>
    </div>
  );
}
