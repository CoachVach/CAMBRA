export interface CambraItem {
  id: string;
  label: string;
  requiresTest?: boolean;
  isHighlighted?: boolean; // Red-box items worth 2 pts in 0-5 scoring
  sector?: number;         // Sector grouping for 0-5 form (1-5)
}
