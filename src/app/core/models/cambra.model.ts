export interface CambraForm {
  diseaseIndicators: CambraItem[];
  riskFactors: CambraItem[];
  protectiveFactors: CambraItem[];
}

export interface CambraItem {
  id: string;
  label: string;
  checked: boolean;
  requiresTest?: boolean;
}
