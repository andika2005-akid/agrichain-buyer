import { farmerApplications, plantingRecords, harvestRecords, climateData, commodityIdeals, provinceData } from "@/data/mockData";
import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";


// replicate scoring logic from RecommendationPage
function scoreCommodity(
  ideal: any,
  rain: number,
  temp: number,
  droughtRisk: string,
  elNinoIndex: number
) {
  const rainScore = Math.max(
    0,
    100 -
      (Math.abs((ideal.rainMin + ideal.rainMax) / 2 - rain) /
        ((ideal.rainMax - ideal.rainMin) / 2 || 1)) *
        50
  );
  const tempScore = Math.max(
    0,
    100 -
      (Math.abs((ideal.tempMin + ideal.tempMax) / 2 - temp) /
        ((ideal.tempMax - ideal.tempMin) / 2 || 1)) *
        50
  );

  let droughtPenalty = 0;
  if (droughtRisk === "high") droughtPenalty = 30;
  else if (droughtRisk === "medium") droughtPenalty = 10;

  const elFactor = elNinoIndex > 0.5 ? -10 : elNinoIndex < -0.5 ? 5 : 0;

  const base = (rainScore + tempScore) / 2;
  const final = Math.max(0, Math.round(base + elFactor - droughtPenalty));
  return final;
}

function getRecommendationForProvince(province: string) {
  const prov = provinceData.find((p) => p.name === province);
  if (!prov) return { commodity: "-", score: 0 };
  const climate = climateData[prov.id] ?? {
    predictedRainNext3: 120,
    predictedTempNext3: 25,
    predictedSeason: "neutral",
    droughtRisk: "medium",
    elNinoIndex: 0,
  };
  const recs = Object.keys(commodityIdeals).map((c) => {
    const ideal = (commodityIdeals as any)[c];
    const score = scoreCommodity(
      ideal,
      climate.predictedRainNext3,
      climate.predictedTempNext3,
      climate.droughtRisk,
      climate.elNinoIndex
    );
    return { commodity: c, score };
  });
  const sorted = recs.sort((a, b) => b.score - a.score);
  return sorted[0] || { commodity: "-", score: 0 };
}

export default function ScoringPage() {
  // aggregate stats by commodity
  const submittedCounts = farmerApplications.reduce<Record<string, number>>(
    (acc, f) => {
      acc[f.commodity] = (acc[f.commodity] || 0) + 1;
      return acc;
    },
    {}
  );
  const plantedCounts = plantingRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.komoditas] = (acc[r.komoditas] || 0) + 1;
    return acc;
  }, {});
  const harvestedCounts = harvestRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.komoditas] = (acc[r.komoditas] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      {/* summary statistics */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">AI Scoring Kelayakan</h1>
        <p className="text-sm text-muted-foreground">Random Forest + K-Means clustering untuk analisis kelayakan subsidi</p>
      </div>
      <div className="bg-card rounded-xl p-4">
        <h3 className="font-semibold mb-2">Statistik Komoditas dari Data Petani</h3>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="py-1 px-2 text-left">Komoditas</th>
              <th className="py-1 px-2 text-right">Submitted</th>
              <th className="py-1 px-2 text-right">Tanam</th>
              <th className="py-1 px-2 text-right">Panen</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(submittedCounts).map((c) => (
              <tr key={c} className="border-t">
                <td className="py-1 px-2">{c}</td>
                <td className="py-1 px-2 text-right">{submittedCounts[c]}</td>
                <td className="py-1 px-2 text-right">{plantedCounts[c] || 0}</td>
                <td className="py-1 px-2 text-right">{harvestedCounts[c] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Model Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="gradient-primary rounded-xl p-5 text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-6 h-6" />
          <h3 className="font-semibold">AI Engine — Model Status</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="opacity-70">Model</p>
            <p className="font-bold">Random Forest</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="opacity-70">Akurasi</p>
            <p className="font-bold">90.2%</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="opacity-70">Data Training</p>
            <p className="font-bold">125,430</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="opacity-70">Last Updated</p>
            <p className="font-bold">2 jam lalu</p>
          </div>
        </div>
      </motion.div>

      {/* Scoring Cards */}
      <div className="space-y-4">
        {farmerApplications.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-5 shadow-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Score Circle */}
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold font-display border-4"
                  style={{
                    borderColor: f.eligibilityScore >= 75 ? "hsl(152, 60%, 42%)" : f.eligibilityScore >= 50 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)",
                    color: f.eligibilityScore >= 75 ? "hsl(152, 60%, 42%)" : f.eligibilityScore >= 50 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)",
                  }}
                >
                  {f.eligibilityScore}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Nama</p>
                  <p className="font-semibold text-foreground">{f.name}</p>
                  <p className="text-muted-foreground">{f.nik}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lahan & Komoditas</p>
                  <p className="font-semibold text-foreground">{f.area} Ha — {f.commodity}</p>
                  <p className="text-muted-foreground">{f.province}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rekomendasi Komoditas</p>
                  {(() => {
                    const rec = getRecommendationForProvince(f.province);
                    return (
                      <p className="font-semibold text-foreground">
                        {rec.commodity} ({rec.score}%)
                      </p>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-muted-foreground">Risiko Gagal Panen</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {f.riskLevel === "Rendah" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    ) : f.riskLevel === "Sedang" ? (
                      <TrendingUp className="w-3.5 h-3.5 text-warning" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span className="font-semibold">{f.riskLevel}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Rekomendasi Subsidi</p>
                  <p className="font-semibold text-foreground">{f.subsidyType}</p>
                  {f.amount > 0 && (
                    <p className="text-muted-foreground">Rp {f.amount.toLocaleString("id-ID")}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
