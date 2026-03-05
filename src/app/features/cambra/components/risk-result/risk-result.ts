import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambraStateService } from '../../../../core/services/cambra-state.service';

@Component({
  selector: 'app-risk-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="result">
      <div class="risk-result">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="section-title">Evaluación del Riesgo</h3>
        </div>
        
        <div class="risk-display" [class]="getRiskClass(result.riskLevel)">
          <div class="risk-icon">
            <ng-container [ngSwitch]="getRiskClass(result.riskLevel)">
              <!-- Low Risk Icon -->
              <svg *ngSwitchCase="'risk-low'" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" fill="currentColor"/>
              </svg>
              <!-- Moderate Risk Icon -->
              <svg *ngSwitchCase="'risk-moderate'" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
              <!-- High Risk Icon -->
              <svg *ngSwitchCase="'risk-high'" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
              </svg>
              <!-- Unknown Risk Icon -->
              <svg *ngSwitchDefault width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
              </svg>
            </ng-container>
          </div>
          <div class="risk-content">
            <div class="risk-level">{{ result.riskLevel }}</div>
            <div class="risk-description">{{ getRiskDescription(result.riskLevel) }}</div>
          </div>
        </div>

        <div class="risk-recommendations">
          <h4 class="recommendations-title">Recomendaciones</h4>
          <ul class="recommendations-list">
            <li *ngFor="let recommendation of getRiskRecommendations(result.riskLevel)">
              <div class="recommendation-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <span>{{ recommendation }}</span>
            </li>
          </ul>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./risk-result.scss']
})
export class RiskResult {
  constructor(private cambraState: CambraStateService) {}

  get result() {
    return this.cambraState.result;
  }

  getRiskClass(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case 'bajo':
      case 'low':
        return 'risk-low';
      case 'moderado':
      case 'moderate':
        return 'risk-moderate';
      case 'alto':
      case 'high':
        return 'risk-high';
      default:
        return 'risk-unknown';
    }
  }

  getRiskDescription(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case 'bajo':
      case 'low':
        return 'Riesgo mínimo de desarrollar caries en el próximo período de evaluación.';
      case 'moderado':
      case 'moderate':
        return 'Riesgo moderado. Se requiere intervención preventiva y seguimiento.';
      case 'alto':
      case 'high':
        return 'Riesgo alto. Se requiere intervención inmediata y seguimiento intensivo.';
      default:
        return 'Nivel de riesgo no determinado.';
    }
  }

  getRiskRecommendations(riskLevel: string): string[] {
    switch (riskLevel?.toLowerCase()) {
      case 'bajo':
      case 'low':
        return [
          'Mantener rutina de higiene oral diaria',
          'Cepillado con pasta dental fluorada',
          'Consultas dentales cada 6-12 meses',
          'Dieta equilibrada baja en azúcares'
        ];
      case 'moderado':
      case 'moderate':
        return [
          'Reforzar técnicas de higiene oral',
          'Uso de enjuague bucal con flúor',
          'Consultas dentales cada 3-6 meses',
          'Reducir frecuencia de consumo de azúcares',
          'Considerar selladores dentales'
        ];
      case 'alto':
      case 'high':
        return [
          'Supervisión profesional intensiva',
          'Tratamientos preventivos adicionales',
          'Consultas dentales cada 1-3 meses',
          'Modificación estricta de la dieta',
          'Aplicación de flúor profesional',
          'Evaluación de medicamentos xerógenos'
        ];
      default:
        return ['Consulte con su profesional de la salud dental'];
    }
  }
}
