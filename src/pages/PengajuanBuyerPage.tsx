import { useState } from "react";
import { buyers, purchaseContracts, productionMonitoring } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// framer-motion removed to avoid runtime DOM removal issues

type Contract = (typeof purchaseContracts)[number];

export default function PengajuanBuyerPage() {
  const { role, userName } = useAuth();
  // Hanya tampilkan kontrak yang ditujukan ke petani yang sedang login
  const currentFarmer = (userName || "").split(" (")[0];
  const initial = purchaseContracts
    .filter((c) => c.farmer === currentFarmer)
    .map((c) => ({ ...c, status: c.status || "Menunggu Konfirmasi" }));
  const [submissions, setSubmissions] = useState<Contract[]>(initial as Contract[]);

  const handleUpdateStatus = (id: string, status: string) => {
    setSubmissions((subs) =>
      (subs || []).map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  if (role !== "petani") {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Halaman ini hanya untuk role petani.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold font-display text-foreground mb-2">
          Pengajuan dari Buyer
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Daftar pengajuan kontrak pembelian dari buyer. Silakan terima atau tolak.
        </p>
        {!submissions || submissions.length === 0 ? (
          <div className="text-muted-foreground">Tidak ada pengajuan.</div>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => {
              const monitor = productionMonitoring.find(
                (m) => m.farmer === s.farmer || m.farmerId === (s as any).farmerId
              );
              return (
                <Card key={s.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {s.buyer} - {s.commodity}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-2">
                      <Badge>{s.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium">Detail Kontrak</h3>
                        <div className="text-sm text-muted-foreground">
                          <div>Komoditas: {s.commodity}</div>
                          <div>Jumlah: {s.quantity ?? "-"}</div>
                          <div>Harga / Kg: {(s.pricePerKg ?? 0).toLocaleString()}</div>
                          <div>Total Nilai: {(s.totalValue ?? 0).toLocaleString()}</div>
                          <div>Tanggal Panen: {s.harvestDate ?? "-"}</div>
                          <div>Petani: {s.farmer}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">Status Tanaman (Monitoring)</h3>
                        <div className="text-sm text-muted-foreground">
                          {monitor ? (
                            <>
                              <div>Stage: {monitor.growthStage}</div>
                              <div>Persentase Tumbuh: {monitor.growthPercentage}%</div>
                              <div>Luas: {monitor.landArea} Ha</div>
                              <div>Perkiraan Panen: {monitor.estimatedHarvest} Ton</div>
                            </>
                          ) : (
                            <div>Tidak ada data monitoring untuk petani ini.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        disabled={s.status === "Diterima"}
                        onClick={() => handleUpdateStatus(s.id, "Diterima")}
                        className="bg-green-600 text-white"
                      >
                        Terima
                      </Button>
                      <Button
                        disabled={s.status === "Ditolak"}
                        onClick={() => handleUpdateStatus(s.id, "Ditolak")}
                        className="bg-red-600 text-white"
                      >
                        Tolak
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
  );
}
