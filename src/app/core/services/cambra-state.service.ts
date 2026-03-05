import { Injectable } from '@angular/core';
import { AgeGroup } from '../models/age-group.model';
import { CambraCalculationResult } from '../models/cambra-result.model';

@Injectable({ providedIn: 'root' })
export class CambraStateService {
  private _ageGroup: AgeGroup | null = null;
  private _result: CambraCalculationResult | null = null;

  setAge(age: number) {
    this._ageGroup = age < 6 ? 'AGE_0_5' : 'AGE_6_PLUS';
    this._result = null;
  }

  setResult(result: CambraCalculationResult) {
    this._result = result;
  }

  get ageGroup(): AgeGroup | null {
    return this._ageGroup;
  }

  get result(): CambraCalculationResult | null {
    return this._result;
  }

  reset() {
    this._ageGroup = null;
    this._result = null;
  }
}
