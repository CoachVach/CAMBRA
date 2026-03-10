import { PatientInfo } from './patient.model';
import { CambraCalculationResult } from './cambra-result.model';

export interface PatientRecord extends PatientInfo {
    id: string;
    result: CambraCalculationResult;
    objectives: string;
    nextAppointmentDate?: string;
    recommendationsGiven?: boolean | null;
    strepLevel?: string;
    lactoLevel?: string;
}

export interface PatientGroup {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    patients: PatientRecord[];
}
