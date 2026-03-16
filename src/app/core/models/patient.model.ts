import { AgeGroup } from './age-group.model';

export interface PatientInfo {
  code: string;
  age: number;
  date: string;
  ageGroup: AgeGroup;
}
