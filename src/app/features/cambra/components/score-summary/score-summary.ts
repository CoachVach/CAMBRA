import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambraStateService } from '../../../../core/services/cambra-state.service';

@Component({
  selector: 'app-score-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="result">
      <div class="score-summary">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7V9H9V11ZM13 7H11V13H13V7ZM17 3H15V17H17V3ZM19.5 3V19.5C19.5 20.3 18.8 21 18 21H6C5.2 21 4.5 20.3 4.5 19.5V3C4.5 2.2 5.2 1.5 6 1.5H18C18.8 1.5 19.5 2.2 19.5 3Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="section-title">Resumen de Puntaje</h3>
        </div>
        
        <div class="score-metrics">
          <!-- Disease Indicators -->
          <div class="score-item disease">
            <div class="score-header">
              <div class="score-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
              </div>
              <span class="score-label">Indicadores de enfermedad</span>
            </div>
            <div class="score-value">{{ result.diseaseScore }}</div>
            <div class="score-bar">
              <div class="score-progress disease-progress" [style.width.%]="getScorePercentage(result.diseaseScore, 10)"></div>
            </div>
          </div>

          <!-- Risk Factors -->
          <div class="score-item risk">
            <div class="score-header">
              <div class="score-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20.62 8.26L15.03 12.35L16.12 18.61L12 15.24L7.88 18.61L8.97 12.35L3.38 8.26L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <span class="score-label">Factores de riesgo</span>
            </div>
            <div class="score-value">{{ result.riskScore }}</div>
            <div class="score-bar">
              <div class="score-progress risk-progress" [style.width.%]="getScorePercentage(result.riskScore, 15)"></div>
            </div>
          </div>

          <!-- Protective Factors -->
          <div class="score-item protective">
            <div class="score-header">
              <div class="score-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" fill="currentColor"/>
                </svg>
              </div>
              <span class="score-label">Factores protectores</span>
            </div>
            <div class="score-value">-{{ result.protectiveScore }}</div>
            <div class="score-bar">
              <div class="score-progress protective-progress" [style.width.%]="getScorePercentage(result.protectiveScore, 5)"></div>
            </div>
          </div>
        </div>

        <!-- Total Score -->
        <div class="total-score" [class]="getTotalScoreClass(result.totalScore)">
          <div class="total-header">
            <div class="total-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM16 14H18C18.6 14 19 14.4 19 15V22H17V16H15L13.5 7.5C13.1 5.6 11.4 4 9.5 4S5.9 5.6 5.5 7.5L4 16H2V22H0V15C0 14.4 0.4 14 1 14H3L4.9 4.4C5.5 1.8 7.9 0 10.5 0S15.5 1.8 16.1 4.4L18 14H16Z" fill="currentColor"/>
              </svg>
            </div>
            <span class="total-label">Puntaje Total</span>
          </div>
          <div class="total-value">{{ result.totalScore }}</div>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./score-summary.scss']
})
export class ScoreSummary {
  constructor(private cambraState: CambraStateService) {}

  get result() {
    return this.cambraState.result;
  }

  getScorePercentage(score: number, maxScore: number): number {
    return Math.min((score / maxScore) * 100, 100);
  }

  getTotalScoreClass(totalScore: number): string {
    if (totalScore <= -1) return 'low-risk';
    if (totalScore <= 1) return 'moderate-risk';
    return 'high-risk';
  }
}
