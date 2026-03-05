import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CambraCalculationResult } from '../models/cambra-result.model';

@Injectable({ providedIn: 'root' })
export class CambraCalculationService {
  calculate(form: FormGroup): CambraCalculationResult {
    const disease = this.countTrue(form.value.diseaseIndicators);
    const risk = this.countTrue(form.value.riskFactors);
    const protective = this.countTrue(form.value.protectiveFactors);

    const diseaseScore = disease * 2;
    const riskScore = risk;
    const protectiveScore = protective;

    const totalScore = diseaseScore + riskScore - protectiveScore;

    const riskLevel: 'BAJO' | 'ALTO' =
      totalScore >= 5 ? 'ALTO' : 'BAJO';

    return {
      diseaseScore,
      riskScore,
      protectiveScore,
      totalScore,
      riskLevel,
    };
  }

  private countTrue(values: boolean[]): number {
    return values.filter(Boolean).length;
  }
}
