import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { AgeGroup } from '../../../../core/models/age-group.model';

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
          <h3 class="section-title">Puntuación Total del Riesgo de Caries</h3>
        </div>

        <!-- 0-5 Age Group Scoring -->
        <ng-container *ngIf="is0to5">
          <div class="score-metrics">
            <div class="score-item score-a">
              <div class="score-header">
                <div class="score-icon a-icon">A</div>
                <span class="score-label">Factores de riesgo (Sectores 1, 2, 5)</span>
              </div>
              <div class="score-detail">
                <span class="score-hint">2 pts por casilla roja, 1 pt por casilla blanca</span>
              </div>
              <div class="score-value">{{ result.scoreA }}</div>
              <div class="score-bar">
                <div class="score-progress a-progress" [style.width.%]="getScorePercentage(result.scoreA || 0, 18)"></div>
              </div>
            </div>

            <div class="score-item score-b">
              <div class="score-header">
                <div class="score-icon b-icon">B</div>
                <span class="score-label">Factores protectores (Sectores 3, 4)</span>
              </div>
              <div class="score-detail">
                <span class="score-hint">1 pt por cada factor protector</span>
              </div>
              <div class="score-value">{{ result.scoreB }}</div>
              <div class="score-bar">
                <div class="score-progress b-progress" [style.width.%]="getScorePercentage(result.scoreB || 0, 5)"></div>
              </div>
            </div>
          </div>

          <div class="total-score" [class]="getTotalScoreClass(result.totalScore)">
            <div class="total-formula">Total (A − B)</div>
            <div class="total-value">{{ result.totalScore }}</div>
            <div class="total-hint">Puntos</div>
          </div>

          <div class="risk-thresholds">
            <div class="threshold low">Bajo riesgo: −5 a 5 puntos</div>
            <div class="threshold high">Alto riesgo: 6 a 18 puntos</div>
          </div>
        </ng-container>

        <!-- 6+ Age Group Scoring -->
        <ng-container *ngIf="!is0to5">
          <div class="score-metrics">
            <div class="score-item disease">
              <div class="score-header">
                <div class="score-icon disease-icon">A</div>
                <span class="score-label">Indicadores de enfermedad (×2)</span>
              </div>
              <div class="score-value">{{ result.diseaseScore }}</div>
              <div class="score-bar">
                <div class="score-progress disease-progress" [style.width.%]="getScorePercentage(result.diseaseScore, 8)"></div>
              </div>
            </div>

            <div class="score-item risk">
              <div class="score-header">
                <div class="score-icon risk-icon">B</div>
                <span class="score-label">Factores de riesgo (×1)</span>
              </div>
              <div class="score-value">{{ result.riskScore }}</div>
              <div class="score-bar">
                <div class="score-progress risk-progress" [style.width.%]="getScorePercentage(result.riskScore, 10)"></div>
              </div>
            </div>

            <div class="score-item protective">
              <div class="score-header">
                <div class="score-icon protective-icon">C</div>
                <span class="score-label">Factores protectores (−1)</span>
              </div>
              <div class="score-value">−{{ result.protectiveScore }}</div>
              <div class="score-bar">
                <div class="score-progress protective-progress" [style.width.%]="getScorePercentage(result.protectiveScore, 9)"></div>
              </div>
            </div>
          </div>

          <div class="total-score" [class]="getTotalScoreClass(result.totalScore)">
            <div class="total-formula">A×2 + B − C</div>
            <div class="total-value">{{ result.totalScore }}</div>
            <div class="total-hint">Puntos</div>
          </div>

          <div class="risk-thresholds">
            <div class="threshold low">Bajo riesgo: −9 a 4 puntos</div>
            <div class="threshold high">Alto riesgo: 5 a 18 puntos</div>
          </div>
        </ng-container>
      </div>
    </ng-container>
  `,
  styleUrls: ['./score-summary.scss']
})
export class ScoreSummary {
  @Input() ageGroup: AgeGroup = 'AGE_6_PLUS';

  constructor(private cambraState: CambraStateService) { }

  get result() {
    return this.cambraState.result;
  }

  get is0to5(): boolean {
    return this.ageGroup === 'AGE_0_5';
  }

  getScorePercentage(score: number, maxScore: number): number {
    return Math.min((Math.abs(score) / maxScore) * 100, 100);
  }

  getTotalScoreClass(totalScore: number): string {
    if (this.is0to5) {
      return totalScore >= 6 ? 'total-score high-risk' : 'total-score low-risk';
    }
    return totalScore >= 5 ? 'total-score high-risk' : 'total-score low-risk';
  }
}
