import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CambraStateService } from '../../../../core/services/cambra-state.service';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="patient-info" [class.readonly]="isReadOnly">
      <div class="section-header">
        <div class="section-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
        </div>
        <h2 class="section-title">Información del Paciente</h2>
      </div>

      <div class="form-row">
        <div class="form-group name-group">
          <label class="form-label" for="code-input">
            <span class="label-text">Código del paciente</span>
          </label>
          <input
            id="code-input"
            class="form-input"
            type="text"
            placeholder="Código"
            [(ngModel)]="patientCode"
            (input)="onCodeChange()"
            [disabled]="isReadOnly"
          />
        </div>

        <div class="form-group age-group">
          <label class="form-label" for="age-input">
            <span class="label-text">Edad</span>
          </label>
          <div class="input-wrapper">
            <input
              id="age-input"
              class="form-input age-input"
              type="number"
              min="0"
              max="120"
              placeholder="Ej: 4"
              [(ngModel)]="age"
              (input)="onAgeChange()"
              [disabled]="isReadOnly"
            />
            <div class="input-suffix">años</div>
          </div>
        </div>

        <div class="form-group date-group">
          <label class="form-label" for="date-input">
            <span class="label-text">Fecha</span>
          </label>
          <input
            id="date-input"
            class="form-input"
            type="date"
            [(ngModel)]="patientDate"
            (change)="onDateChange()"
            [disabled]="isReadOnly"
          />
        </div>
      </div>

      <div class="age-indicator" *ngIf="age !== undefined && age !== null">
        <div class="age-badge" [class.age-young]="age < 6" [class.age-older]="age >= 6">
          <svg *ngIf="age < 6" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM10 22V13H8V7H16V13H14V22H10Z" fill="currentColor"/>
          </svg>
          <svg *ngIf="age >= 6" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
          <span *ngIf="age < 6">Formulario CAMBRA 0–5 años</span>
          <span *ngIf="age >= 6">Formulario CAMBRA ≥ 6 años</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./patient-info.scss']
})
export class PatientInfo {
  @Input() isReadOnly: boolean = false;

  constructor(private cambraState: CambraStateService) {
    if (!this.cambraState.patientDate) {
      const today = new Date();
      this.cambraState.setPatientDate(today.toISOString().split('T')[0]);
    }
  }

  get patientCode(): string { return this.cambraState.patientCode; }
  set patientCode(val: string) { this.cambraState.setPatientCode(val); }

  get patientDate(): string { return this.cambraState.patientDate; }
  set patientDate(val: string) { this.cambraState.setPatientDate(val); }

  get age(): number | undefined {
    return this.cambraState.age ?? undefined;
  }

  set age(val: number | undefined) {
    this.cambraState.setAge(val ?? null);
  }

  onAgeChange() { /* logic handled by setter */ }
  onCodeChange() { /* logic handled by setter */ }
  onDateChange() { /* logic handled by setter */ }
}
