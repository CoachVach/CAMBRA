export interface CambraCalculationResult {
  diseaseScore: number;
  riskScore: number;
  protectiveScore: number;
  totalScore: number;
  riskLevel: 'BAJO' | 'ALTO';
}
