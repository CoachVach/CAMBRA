import { AgeGroup } from './age-group.model';

export interface PatientInfo {
  name: string;
  age: number;
  date: string;
  ageGroup: AgeGroup;
}
