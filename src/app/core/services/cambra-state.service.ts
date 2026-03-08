import { Injectable } from '@angular/core';
import { AgeGroup } from '../models/age-group.model';
import { CambraCalculationResult } from '../models/cambra-result.model';

@Injectable({ providedIn: 'root' })
export class CambraStateService {
  private _ageGroup: AgeGroup | null = null;
  private _result: CambraCalculationResult | null = null;
  private _patientName = '';
  private _patientDate = '';

  setAge(age: number | null) {
    if (age === null) {
      this._ageGroup = null;
    } else {
      this._ageGroup = age < 6 ? 'AGE_0_5' : 'AGE_6_PLUS';
    }
    this._result = null;
  }

  setResult(result: CambraCalculationResult) {
    this._result = result;
  }

  setPatientName(name: string) {
    this._patientName = name;
  }

  setPatientDate(date: string) {
    this._patientDate = date;
  }

  get ageGroup(): AgeGroup | null {
    return this._ageGroup;
  }

  get result(): CambraCalculationResult | null {
    return this._result;
  }

  get patientName(): string {
    return this._patientName;
  }

  get patientDate(): string {
    return this._patientDate;
  }

  reset() {
    this._ageGroup = null;
    this._result = null;
    this._patientName = '';
    this._patientDate = '';
  }
}
