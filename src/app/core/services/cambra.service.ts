import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CambraService {
  diseaseScore = 0;
  riskScore = 0;
  protectiveScore = 0;

  get totalScore(): number {
    return this.diseaseScore * 2 + this.riskScore - this.protectiveScore;
  }

  get riskLevel(): 'BAJO' | 'ALTO' {
    return this.totalScore >= 5 ? 'ALTO' : 'BAJO';
  }
}
