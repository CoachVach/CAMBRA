import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { AgeGroup } from '../../../../core/models/age-group.model';

@Component({
  selector: 'app-risk-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="result">
      <div class="risk-result">
        <!-- Risk Display -->
        <div class="risk-display" [class]="getRiskClass(result.riskLevel)">
          <div class="risk-icon">
            <svg *ngIf="result.riskLevel === 'BAJO'" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" fill="currentColor"/>
            </svg>
            <svg *ngIf="result.riskLevel === 'ALTO'" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
            </svg>
          </div>
          <div class="risk-content">
            <div class="risk-level">RIESGO {{ result.riskLevel }}</div>
            <div class="risk-description">{{ getRiskDescription(result.riskLevel) }}</div>
          </div>
        </div>

        <!-- Bacterial Cultures -->
        <div class="cultures-section">
          <h4 class="cultures-title">Cultivos Bacterianos</h4>
          <p class="cultures-note">
            <ng-container *ngIf="is0to5">
              Si en una casilla (1A, 1B, 5A, 5B) o dos casillas del sector 1, 2, ó 5 se marca "Sí", valorar realización de cultivos bacterianos.
            </ng-container>
            <ng-container *ngIf="!is0to5">
              Conviene valorar la utilidad real de este tipo de cultivos y el coste asociado a su realización.
            </ng-container>
          </p>
          <div class="culture-row">
            <div class="culture-group">
              <span class="culture-label">Estreptococos</span>
              <div class="culture-options">
                <label class="culture-option" *ngFor="let level of cultureLevels">
                  <input type="radio" name="strep" [value]="level" [(ngModel)]="strepLevel" />
                  <span class="culture-chip">{{ level }}</span>
                </label>
              </div>
            </div>
            <div class="culture-group">
              <span class="culture-label">Lactobacilos</span>
              <div class="culture-options">
                <label class="culture-option" *ngFor="let level of cultureLevels">
                  <input type="radio" name="lacto" [value]="level" [(ngModel)]="lactoLevel" />
                  <span class="culture-chip">{{ level }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Follow-up -->
        <div class="followup-section">
          <h4 class="followup-title">Seguimiento</h4>
          <div class="followup-row">
            <div class="followup-group">
              <label class="followup-label">
                <span class="followup-text">¿Se han dado recomendaciones escritas?</span>
                <div class="toggle-group">
                  <label class="toggle-option">
                    <input type="radio" name="recommendations" [value]="true" [(ngModel)]="recommendationsGiven" />
                    <span class="toggle-chip">Sí</span>
                  </label>
                  <label class="toggle-option">
                    <input type="radio" name="recommendations" [value]="false" [(ngModel)]="recommendationsGiven" />
                    <span class="toggle-chip">No</span>
                  </label>
                </div>
              </label>
            </div>
            <div class="followup-group">
              <label class="followup-label">
                <span class="followup-text">Próximo control</span>
                <input type="date" class="followup-date" [(ngModel)]="nextControlDate" />
              </label>
            </div>
          </div>

          <div class="objectives-group">
            <label class="followup-label">
              <span class="followup-text">Objetivos de autocuidado</span>
              <textarea
                class="objectives-input"
                rows="2"
                placeholder="1. &#10;2. "
                [(ngModel)]="objectives"
              ></textarea>
            </label>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="risk-recommendations">
          <h4 class="recommendations-title">Recomendaciones</h4>
          <ul class="recommendations-list">
            <li *ngFor="let rec of getRiskRecommendations(result.riskLevel)">
              <div class="recommendation-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./risk-result.scss']
})
export class RiskResult {
  @Input() ageGroup: AgeGroup = 'AGE_6_PLUS';

  cultureLevels = ['Alto', 'Medio', 'Bajo'];
  strepLevel = '';
  lactoLevel = '';
  recommendationsGiven: boolean | null = null;
  nextControlDate = '';
  objectives = '';

  constructor(private cambraState: CambraStateService) { }

  get result() {
    return this.cambraState.result;
  }

  get is0to5(): boolean {
    return this.ageGroup === 'AGE_0_5';
  }

  getRiskClass(riskLevel: string): string {
    return riskLevel === 'ALTO' ? 'risk-high' : 'risk-low';
  }

  getRiskDescription(riskLevel: string): string {
    if (riskLevel === 'BAJO') {
      return this.is0to5
        ? 'Riesgo bajo de caries. Reevaluar a los 12 meses.'
        : 'Riesgo bajo de caries (-9 a 4 puntos). Reevaluar a los 12 meses.';
    }
    return this.is0to5
      ? 'Riesgo alto de caries. Reevaluar a los 6 meses.'
      : 'Riesgo alto de caries (5 a 18 puntos). Reevaluar a los 6 meses.';
  }

  getRiskRecommendations(riskLevel: string): string[] {
    if (riskLevel === 'BAJO') {
      return this.is0to5
        ? [
          'Mantener hábitos de higiene oral supervisados por los padres',
          'Cepillado con pasta fluorada (tamaño lenteja/guisante)',
          'Consultas dentales periódicas cada 12 meses',
          'Dieta equilibrada con control de azúcares',
        ]
        : [
          'Mantener rutina de higiene oral diaria',
          'Cepillado con pasta dental fluorada',
          'Consultas dentales cada 6-12 meses',
          'Dieta equilibrada baja en azúcares',
        ];
    }
    return this.is0to5
      ? [
        'Valorar realización de cultivos bacterianos',
        'Supervisión intensiva de higiene oral por padres/cuidadores',
        'Eliminar el uso del biberón nocturno',
        'Reducir la frecuencia de consumo de azúcares',
        'Consultas dentales cada 3-6 meses',
        'Aplicación profesional de flúor',
        'Reevaluar a los 6 meses',
      ]
      : [
        'Supervisión profesional intensiva',
        'Tratamientos preventivos adicionales con flúor',
        'Consultas dentales cada 1-3 meses',
        'Modificación estricta de la dieta',
        'Aplicación semestral de barniz de flúor',
        'Considerar cultivos bacterianos complementarios',
        'Utilizar la Guía de Práctica Clínica para el tratamiento no invasivo',
        'Reevaluar a los 6 meses',
      ];
  }
}
