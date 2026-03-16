import { Injectable } from '@angular/core';
import { AgeGroup } from '../models/age-group.model';
import { CambraCalculationResult } from '../models/cambra-result.model';
import { PatientGroup, PatientRecord } from '../models/patient-group.model';

@Injectable({ providedIn: 'root' })
export class CambraStateService {
  private STORAGE_KEY = 'cambra_groups_data';

  // --- Current Evaluation Data ---
  private _ageGroup: AgeGroup | null = null;
  private _result: CambraCalculationResult | null = null;
  private _patientCode = '';
  private _patientDate = '';
  private _nextAppointmentDate = '';
  private _age: number | null = null;
  private _objectives = '';

  // New fields for group context
  private _strepLevel = '';
  private _lactoLevel = '';
  private _recommendationsGiven: boolean | null = null;

  // --- Groups and Global State ---
  private _groups: PatientGroup[] = [];
  private _currentGroupId: string | null = null;
  private _isIndividualMode = true; // True if started as "Individual Eval"

  constructor() {
    this.loadFromStorage();
  }

  // Setters for Evaluation
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

  setPatientCode(code: string) { this._patientCode = code; }
  setPatientDate(date: string) { this._patientDate = date; }
  setNextAppointmentDate(date: string) { this._nextAppointmentDate = date; }
  setObjectives(text: string) { this._objectives = text; }
  setStrepLevel(level: string) { this._strepLevel = level; }
  setLactoLevel(level: string) { this._lactoLevel = level; }
  setRecommendationsGiven(given: boolean | null) { this._recommendationsGiven = given; }

  // Getters for Evaluation
  get ageGroup(): AgeGroup | null { return this._ageGroup; }
  get age(): number | null { return this._age; }
  get result(): CambraCalculationResult | null { return this._result; }
  get patientCode(): string { return this._patientCode; }
  get patientDate(): string { return this._patientDate; }
  get nextAppointmentDate(): string { return this._nextAppointmentDate; }
  get objectives(): string { return this._objectives; }
  get strepLevel(): string { return this._strepLevel; }
  get lactoLevel(): string { return this._lactoLevel; }
  get recommendationsGiven(): boolean | null { return this._recommendationsGiven; }

  // --- Group Management ---
  get groups(): PatientGroup[] { return this._groups; }
  get currentGroupId(): string | null { return this._currentGroupId; }
  get isIndividualMode(): boolean { return this._isIndividualMode; }

  setIndividualMode(isIndividual: boolean) {
    this._isIndividualMode = isIndividual;
  }

  setCurrentGroup(groupId: string | null) {
    this._currentGroupId = groupId;
    this._isIndividualMode = false;
  }

  createGroup(name: string, description: string = ''): PatientGroup {
    const newGroup: PatientGroup = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      patients: []
    };
    this._groups.push(newGroup);
    this.saveToStorage();
    return newGroup;
  }

  deleteGroup(groupId: string) {
    this._groups = this._groups.filter(g => g.id !== groupId);
    if (this._currentGroupId === groupId) this._currentGroupId = null;
    this.saveToStorage();
  }

  saveCurrentEvaluationToGroup() {
    if (!this._currentGroupId || !this._result) return;

    const group = this._groups.find(g => g.id === this._currentGroupId);
    if (!group) return;

    const patientRecord: PatientRecord = {
      id: crypto.randomUUID(),
      code: this._patientCode,
      age: this._age || 0,
      date: this._patientDate,
      ageGroup: this._ageGroup!,
      result: this._result,
      objectives: this._objectives,
      nextAppointmentDate: this._nextAppointmentDate,
      recommendationsGiven: this._recommendationsGiven,
      strepLevel: this._strepLevel,
      lactoLevel: this._lactoLevel
    };

    group.patients.push(patientRecord);
    this.saveToStorage();
  }

  deletePatientFromGroup(groupId: string, patientId: string) {
    const group = this._groups.find(g => g.id === groupId);
    if (group) {
      group.patients = group.patients.filter(p => p.id !== patientId);
      this.saveToStorage();
    }
  }

  // --- Storage ---
  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._groups));
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this._groups = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing groups data', e);
        this._groups = [];
      }
    }
  }

  reset() {
    this._ageGroup = null;
    this._age = null;
    this._result = null;
    this._patientCode = '';
    this._patientDate = '';
    this._nextAppointmentDate = '';
    this._objectives = '';
    this._strepLevel = '';
    this._lactoLevel = '';
    this._recommendationsGiven = null;
    // We don't reset _groups or _currentGroupId here, 
    // as those are managed by navigation or explicit calls.
  }
}
