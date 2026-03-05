import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientInfo } from '../../components/patient-info/patient-info';
import { CambraForm } from '../../components/cambra-form/cambra-form';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { ScoreSummary } from '../../components/score-summary/score-summary';
import { RiskResult } from '../../components/risk-result/risk-result';


@Component({
  standalone: true,
  imports: [CommonModule, PatientInfo, CambraForm, ScoreSummary, RiskResult],
  template: `
    <div class="cambra-container">
      <!-- Header Section -->
      <header class="app-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20.62 8.26L15.03 12.35L16.12 18.61L12 15.24L7.88 18.61L8.97 12.35L3.38 8.26L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="app-title">CAMBRA</h1>
            <p class="app-subtitle">Evaluación de Riesgo de Caries</p>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Patient Information Card -->
        <div class="assessment-card patient-card">
          <app-patient-info></app-patient-info>
        </div>

        <ng-container *ngIf="ageGroup === 'AGE_6_PLUS'">
          <!-- Assessment Form Card -->
          <div class="assessment-card form-card">
            <app-cambra-form></app-cambra-form>
          </div>

          <!-- Results Section -->
          <div class="results-section">
            <div class="results-grid">
              <!-- Score Summary Card -->
              <div class="result-card score-card">
                <app-score-summary></app-score-summary>
              </div>

              <!-- Risk Result Card -->
              <div class="result-card risk-card">
                <app-risk-result></app-risk-result>
              </div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="ageGroup === 'AGE_0_5'">
          <div class="assessment-card info-card">
            <div class="info-content">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Formulario CAMBRA 0–5 años</h3>
              <p>Esta versión del formulario está siendo desarrollada. Por favor, seleccione una edad de 6 años o mayor para continuar con la evaluación.</p>
            </div>
          </div>
        </ng-container>
      </main>
    </div>
  `,
  styleUrls: ['./cambra-page.scss']
})
export class CambraPage {
  constructor(public cambraState: CambraStateService) {}

  get ageGroup() {
    return this.cambraState.ageGroup;
  }
}
