import { CambraItem } from './cambra-item.model';

export interface CambraFormDefinition {
  diseaseIndicators: CambraItem[];
  riskFactors: CambraItem[];
  protectiveFactors: CambraItem[];
}
