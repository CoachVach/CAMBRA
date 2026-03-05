import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CambraStateService } from '../../../../core/services/cambra-state.service';

@Component({
  selector: 'app-patient-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="patient-info">
      <div class="section-header">
        <div class="section-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21ZM17 12V10L20 13L17 16V14H13V12H17Z" fill="currentColor"/>
          </svg>
        </div>
        <h2 class="section-title">Información del Paciente</h2>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="age-input">
          <span class="label-text">Edad del paciente</span>
          <span class="label-description">Ingrese la edad en años completos</span>
        </label>
        <div class="input-wrapper">
          <input
            id="age-input"
            class="form-input"
            type="number"
            min="0"
            max="120"
            placeholder="Ej: 25"
            [(ngModel)]="age"
            (change)="onAgeChange()"
          />
          <div class="input-suffix">años</div>
        </div>
        <div class="form-hint" *ngIf="age && age < 6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          Nota: Para pacientes menores de 6 años, utilice el formulario CAMBRA 0-5 años.
        </div>
        <div class="form-hint success" *ngIf="age && age >= 6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
          Edad válida para el formulario CAMBRA ≥ 6 años.
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./patient-info.scss']
})
export class PatientInfo {
  age?: number;

  constructor(private cambraState: CambraStateService) {}

  onAgeChange() {
    if (this.age !== undefined) {
      this.cambraState.setAge(this.age);
    }
  }
}
