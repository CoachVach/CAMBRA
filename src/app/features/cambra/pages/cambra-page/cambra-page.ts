import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientInfo } from '../../components/patient-info/patient-info';
import { CambraForm } from '../../components/cambra-form/cambra-form';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { ScoreSummary } from '../../components/score-summary/score-summary';
import { RiskResult } from '../../components/risk-result/risk-result';

type Step = 'patient' | 'questionnaire' | 'results';

@Component({
  standalone: true,
  imports: [CommonModule, PatientInfo, CambraForm, ScoreSummary, RiskResult],
  template: `
    <div class="cambra-container">
      <!-- Header Section -->
      <header class="app-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM10 22V13H8V7H16V13H14V22H10Z" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="app-title">CAMBRA</h1>
            <p class="app-subtitle">Caries Management by Risk Assessment</p>
          </div>
          <div class="header-actions">
            <a href="/docs/SEOP-Cuestionario-Cambra-1-y-2.pdf" download="Cuestionario-CAMBRA-SEOP.pdf" class="header-doc-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
              <span>Documentación</span>
            </a>
            <button class="header-reset-btn" *ngIf="currentStep !== 'patient'" (click)="onReset()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12S8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
              </svg>
              Nueva evaluación
            </button>
          </div>
        </div>
      </header>

      <!-- Step Indicator -->
      <div class="step-indicator-wrapper" *ngIf="ageGroup">
        <div class="step-indicator">
          <div class="step" [class.active]="currentStep === 'patient'" [class.done]="currentStep !== 'patient'">
            <div class="step-number">1</div>
            <span class="step-label">Paciente</span>
          </div>
          <div class="step-line" [class.active]="currentStep !== 'patient'"></div>
          <div class="step" [class.active]="currentStep === 'questionnaire'" [class.done]="currentStep === 'results'">
            <div class="step-number">2</div>
            <span class="step-label">Cuestionario</span>
          </div>
          <div class="step-line" [class.active]="currentStep === 'results'"></div>
          <div class="step" [class.active]="currentStep === 'results'">
            <div class="step-number">3</div>
            <span class="step-label">Resultados</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <!-- ═══════ STEP 1: Patient Information ═══════ -->
        <div class="assessment-card patient-card">
          <app-patient-info [isReadOnly]="currentStep !== 'patient'"></app-patient-info>

          <!-- If editing from a later step, show a notice -->
          <div class="edit-notice" *ngIf="currentStep !== 'patient' && ageGroup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <span>Si modifica la edad, pulse "Continuar" para actualizar el formulario.</span>
          </div>

          <!-- Continuar button for Step 1 -->
          <div class="step-actions" *ngIf="currentStep === 'patient'">
            <button
              class="btn-continue"
              [disabled]="!canProceedToQuestionnaire"
              (click)="goToQuestionnaire()"
            >
              Continuar al cuestionario
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <!-- "Edit patient" button when on step 2 or 3 -->
          <div class="step-actions" *ngIf="currentStep !== 'patient'">
            <button class="btn-edit" (click)="goBackToPatient()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
              </svg>
              Editar datos del paciente
            </button>
          </div>
        </div>

        <!-- ═══════ STEP 2: Questionnaire ═══════ -->
        <div [style.display]="(currentStep === 'questionnaire' || currentStep === 'results') ? 'block' : 'none'">
          <div class="assessment-card form-card">
            <app-cambra-form 
              [ageGroup]="ageGroup!" 
              [isReadOnly]="currentStep === 'results'"
            ></app-cambra-form>

            <!-- Finalizar button for Step 2 -->
            <div class="step-actions" *ngIf="currentStep === 'questionnaire'">
              <button class="btn-back" (click)="goBackToPatient()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                </svg>
                Volver
              </button>
              <button class="btn-finish" (click)="goToResults()">
                Finalizar y ver resultados
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <!-- Edit questionnaire button when on results -->
            <div class="step-actions" *ngIf="currentStep === 'results'">
              <button class="btn-edit" (click)="goBackToQuestionnaire()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
                Editar cuestionario
              </button>
            </div>
          </div>
        </div>

        <!-- ═══════ STEP 3: Results ═══════ -->
        <div [style.display]="currentStep === 'results' ? 'block' : 'none'">
          <div class="results-section">
            <div class="results-grid">
              <div class="result-card score-card">
                <app-score-summary [ageGroup]="ageGroup!"></app-score-summary>
              </div>
              <div class="result-card risk-card">
                <app-risk-result [ageGroup]="ageGroup!"></app-risk-result>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State (no age entered yet) -->
        <ng-container *ngIf="!ageGroup && currentStep === 'patient'">
          <div class="assessment-card empty-card">
            <div class="empty-content">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Ingrese la edad del paciente</h3>
              <p>El formulario CAMBRA se mostrará automáticamente según la edad ingresada (0-5 años o ≥ 6 años).</p>
            </div>
          </div>
        </ng-container>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <p>Realizado por <strong>Marjorie Armida Herrera</strong></p>
        <p>Universidad Evangélica de El Salvador</p>
        <p class="app-footer-brand">CAMBRA · Cuestionario de Evaluación de Riesgo de Caries</p>
      </footer>
    </div>
  `,
  styleUrls: ['./cambra-page.scss']
})
export class CambraPage {
  currentStep: Step = 'patient';

  constructor(public cambraState: CambraStateService) { }

  get ageGroup() {
    return this.cambraState.ageGroup;
  }

  get canProceedToQuestionnaire(): boolean {
    return this.ageGroup !== null;
  }

  goToQuestionnaire() {
    if (this.canProceedToQuestionnaire) {
      this.currentStep = 'questionnaire';
    }
  }

  goToResults() {
    this.currentStep = 'results';
  }

  goBackToPatient() {
    this.currentStep = 'patient';
  }

  goBackToQuestionnaire() {
    this.currentStep = 'questionnaire';
  }

  onReset() {
    this.cambraState.reset();
    this.currentStep = 'patient';
  }
}
