export interface CambraCalculationResult {
  diseaseScore: number;
  riskScore: number;
  protectiveScore: number;
  totalScore: number;
  riskLevel: 'BAJO' | 'ALTO';
  scoreA?: number;  // For 0-5: sum of risk sectors (1,2,5)
  scoreB?: number;  // For 0-5: sum of protective sectors (3,4)
}
