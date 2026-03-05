import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgeGroup } from '../models/age-group.model';
import { CambraCalculationResult } from '../models/cambra-result.model';
import { CambraItem } from '../models/cambra-item.model';

@Injectable({ providedIn: 'root' })
export class CambraCalculationService {

  calculate(
    form: FormGroup,
    ageGroup: AgeGroup,
    diseaseItems: CambraItem[],
    riskItems: CambraItem[],
    protectiveItems: CambraItem[],
  ): CambraCalculationResult {
    if (ageGroup === 'AGE_0_5') {
      return this.calculate0to5(form, diseaseItems, riskItems, protectiveItems);
    }
    return this.calculate6Plus(form);
  }

  /**
   * 0-5 scoring:
   *  A = sum of checked items in sectors 1, 2, 5
   *      (isHighlighted items = 2 pts, normal = 1 pt)
   *  B = sum of checked items in sectors 3, 4 (1 pt each)
   *  Total = A - B
   *  Low risk: -5 to 5 | High risk: 6 to 18
   */
  private calculate0to5(
    form: FormGroup,
    diseaseItems: CambraItem[],
    riskItems: CambraItem[],
    protectiveItems: CambraItem[],
  ): CambraCalculationResult {
    const diseaseValues: boolean[] = form.value.diseaseIndicators || [];
    const riskValues: boolean[] = form.value.riskFactors || [];
    const protectiveValues: boolean[] = form.value.protectiveFactors || [];

    // A = disease indicators (sectors 1,5) + risk factors (sector 2)
    let scoreA = 0;
    diseaseItems.forEach((item, i) => {
      if (diseaseValues[i]) {
        scoreA += item.isHighlighted ? 2 : 1;
      }
    });
    riskItems.forEach((_, i) => {
      if (riskValues[i]) {
        scoreA += 1;
      }
    });

    // B = protective factors (sectors 3,4)
    let scoreB = 0;
    protectiveItems.forEach((_, i) => {
      if (protectiveValues[i]) {
        scoreB += 1;
      }
    });

    const totalScore = scoreA - scoreB;
    const riskLevel: 'BAJO' | 'ALTO' = totalScore >= 6 ? 'ALTO' : 'BAJO';

    return {
      diseaseScore: scoreA,
      riskScore: 0,
      protectiveScore: scoreB,
      totalScore,
      riskLevel,
      scoreA,
      scoreB,
    };
  }

  /**
   * 6+ scoring:
   *  A (disease indicators) × 2 pts each
   *  B (risk factors) × 1 pt each
   *  C (protective factors) × 1 pt each (subtracted)
   *  Total = A×2 + B - C
   *  Low risk: -9 to 4 | High risk: 5 to 18
   */
  private calculate6Plus(form: FormGroup): CambraCalculationResult {
    const disease = this.countTrue(form.value.diseaseIndicators);
    const risk = this.countTrue(form.value.riskFactors);
    const protective = this.countTrue(form.value.protectiveFactors);

    const diseaseScore = disease * 2;
    const riskScore = risk;
    const protectiveScore = protective;
    const totalScore = diseaseScore + riskScore - protectiveScore;
    const riskLevel: 'BAJO' | 'ALTO' = totalScore >= 5 ? 'ALTO' : 'BAJO';

    return {
      diseaseScore,
      riskScore,
      protectiveScore,
      totalScore,
      riskLevel,
    };
  }

  private countTrue(values: boolean[]): number {
    return (values || []).filter(Boolean).length;
  }
}
