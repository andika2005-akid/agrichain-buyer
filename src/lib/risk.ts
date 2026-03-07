// Simple heuristic "AI" risk prediction for crop failure

export type SoilType = "alluvial" | "latosol" | "grumosol" | "podsolik" | string;

export interface RiskInput {
  soilType: SoilType;
  soilPH: number;
  moisture: number; // percentage
  historicalRain: number; // mm per month average
  predictedTemp3m: number; // average °C
  cropType: string;
  area: number; // hectares
}

export interface RiskResult {
  riskScore: number; // 0-100
  riskLevel: "Low" | "Medium" | "High";
  probability: number; // 0-1
  topCauses: string[];
  recommendations: string[];
}

export function predictCropRisk(input: RiskInput): RiskResult {
  // very naive scoring logic just for UI demo
  let score = 0;

  // soil type risk factor
  const typeRisks: Record<string, number> = {
    alluvial: 20,
    latosol: 10,
    grumosol: 15,
    podsolik: 25,
  };
  score += typeRisks[input.soilType] ?? 15;

  // pH ideal between 6.0 and 7.5
  if (input.soilPH < 6) score += (6 - input.soilPH) * 8;
  if (input.soilPH > 7.5) score += (input.soilPH - 7.5) * 8;

  // moisture: optimal 30-40
  if (input.moisture < 30) score += (30 - input.moisture) * 1.5;
  if (input.moisture > 45) score += (input.moisture - 45) * 1.5;

  // rainfall: ideal 150-250
  if (input.historicalRain < 150) score += (150 - input.historicalRain) * 0.2;
  if (input.historicalRain > 250) score += (input.historicalRain - 250) * 0.2;

  // temperature: too hot (>30) adds risk
  if (input.predictedTemp3m > 30) score += (input.predictedTemp3m - 30) * 2;

  // area: very small or very large adds minor risk
  if (input.area < 1) score += 5;
  if (input.area > 10) score += 5;

  // normalize
  const riskScore = Math.min(100, Math.round(score));
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (riskScore >= 70) riskLevel = "High";
  else if (riskScore >= 40) riskLevel = "Medium";

  const probability = Math.min(1, riskScore / 100 + Math.random() * 0.1);

  const causes: string[] = [];
  if ((typeRisks[input.soilType] ?? 15) > 20) causes.push("Soil type not ideal");
  if (input.soilPH < 6 || input.soilPH > 7.5) causes.push("pH tidak optimal");
  if (input.moisture < 30 || input.moisture > 45) causes.push("Kelembaban ekstrim");
  if (input.historicalRain < 150 || input.historicalRain > 250) causes.push("Curah hujan tidak normal");
  if (input.predictedTemp3m > 30) causes.push("Suhu tinggi");

  const recommendations: string[] = [];
  if (input.soilPH < 6) recommendations.push("Tambahkan kapur untuk menaikkan pH");
  if (input.soilPH > 7.5) recommendations.push("Gunakan sulfur untuk menurunkan pH");
  if (input.moisture < 30) recommendations.push("Tingkatkan irigasi");
  if (input.moisture > 45) recommendations.push("Perbaiki drainase");
  if (input.historicalRain < 150) recommendations.push("Simpan air hujan");
  if (input.predictedTemp3m > 30) recommendations.push("Gunakan varietas tahan panas");

  // safe fallback
  if (recommendations.length === 0) recommendations.push("Lakukan pemantauan rutin dan jaga praktek pertanian baik");

  return {
    riskScore,
    riskLevel,
    probability: Math.round(probability * 100) / 100,
    topCauses: causes.length ? causes : ["Tidak ada faktor risiko dominan"],
    recommendations,
  };
}
