import { Injectable } from '@angular/core';
import { AgeGroup } from '../models/age-group.model';
import { CambraCalculationResult } from '../models/cambra-result.model';

@Injectable({ providedIn: 'root' })
export class CambraStateService {
  private _ageGroup: AgeGroup | null = null;
  private _result: CambraCalculationResult | null = null;
  private _patientName = '';
  private _patientDate = '';

  private _nextAppointmentDate = '';
  private _age: number | null = null;
  private _objectives = '';

  setAge(age: number | null) {
    this._age = age;
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

  setNextAppointmentDate(date: string) {
    this._nextAppointmentDate = date;
  }

  setObjectives(text: string) {
    this._objectives = text;
  }

  get ageGroup(): AgeGroup | null {
    return this._ageGroup;
  }

  get age(): number | null {
    return this._age;
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

  get nextAppointmentDate(): string {
    return this._nextAppointmentDate;
  }

  get objectives(): string {
    return this._objectives;
  }

  reset() {
    this._ageGroup = null;
    this._age = null;
    this._result = null;
    this._patientName = '';
    this._patientDate = '';
    this._nextAppointmentDate = '';
    this._objectives = '';
  }
}
