import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { PatientGroup, PatientRecord } from '../../../../core/models/patient-group.model';
import { PdfExportService } from '../../../../core/services/pdf-export.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container" *ngIf="group; else notFound">
      <header class="app-header">
        <div class="header-content">
          <div class="header-back">
            <button class="header-back-btn" routerLink="/cambra/groups">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div class="header-text">
            <h1 class="app-title">Caries Risk ES</h1>
            <p class="app-subtitle">{{ group.name }}</p>
          </div>
          <div class="header-actions">
            <a href="/docs/Caries Risk ES.pdf" download="Caries Risk ES.pdf" class="header-doc-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
              <span>Documentación</span>
            </a>
            <button class="header-doc-btn btn-export-header" (click)="exportGroupCsv()" [disabled]="group.patients.length === 0" title="Descargar como Excel (CSV)">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1.8 14H10v-3.2L8.7 16H7l2.1-4.2L7 7.6h1.7l1.3 3.2 1.3-3.2h1.7l-2.1 4.2L14 16h-1.8v-2z" fill="currentColor"/>
              </svg>
              <span>Excel</span>
            </button>
            <button class="header-doc-btn btn-export-header" (click)="exportGroupPdf()" [disabled]="group.patients.length === 0" title="Descargar como PDF">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
              </svg>
              <span>PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main class="detail-main">
        <!-- Analytics Section -->
        <div class="analytics-section" *ngIf="group.patients.length > 0">
          <div class="analytics-card main-risk" [class]="'risk-' + averageRiskLevel.toLowerCase()">
            <div class="risk-info">
              <span class="analytics-label">Riesgo Promedio del Grupo</span>
              <span class="risk-value">{{ averageScore }} - {{ averageRiskLevel }}</span>
            </div>
            <div class="risk-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="averageRiskScorePercent"></div>
              </div>
              <span class="score-avg">Promedio: {{ averageScore }} pts</span>
            </div>
          </div>
          
          <div class="analytics-card stats-mini">
            <span class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.33 2.99-3S17.66 5 16 5c-1.66 0-3 1.33-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.33 2.99-3S9.66 5 8 5C6.34 5 5 8 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
              </svg>
            </span>
            <div class="stat-text">
              <span class="stat-val">{{ group.patients.length }}</span>
              <span class="stat-lab">Pacientes Evaluados</span>
            </div>
          </div>
        </div>

        <div class="section-header">
          <div class="title-group">
            <h2>Evaluaciones Individuales</h2>
            <p>Listado detallado de pacientes en este grupo</p>
          </div>
          <button class="btn-new-eval" (click)="addNewPatient()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Nueva Evaluación
          </button>
        </div>

        <div class="patients-list" *ngIf="group.patients.length > 0; else noPatients">
          <div class="patient-card" *ngFor="let p of group.patients">
            <div class="p-main">
              <div class="p-info">
                <span class="p-name">{{ p.code }}</span>
                <span class="p-meta">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                  {{ p.age }} años · 
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="currentColor"/>
                  </svg>
                  {{ p.date | date:'dd/MM/yyyy' }}
                </span>
              </div>
              <div class="p-results">
                <span class="risk-badge" [class]="'risk-' + p.result.riskLevel.toLowerCase()">
                  {{ p.result.riskLevel }}
                </span>
                <span class="score-tag">Puntaje: {{ p.result.totalScore }}</span>
              </div>
            </div>
            <div class="p-actions">
              <button class="btn-pdf-p" (click)="exportPatientPdf(p)" title="Descargar PDF individual" [class.pdf-loading]="exportingPatientId === p.id">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                </svg>
              </button>
              <button class="btn-delete-p" (click)="deletePatient(p.id)" title="Eliminar evaluación">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <ng-template #noPatients>
          <div class="no-data-card">
            <div class="nd-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Sin evaluaciones</h3>
            <p>Todavía no se han registrado pacientes en este grupo.</p>
            <button class="btn-primary-ghost" (click)="addNewPatient()">Empezar evaluación ahora</button>
          </div>
        </ng-template>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <img src="docs/logo.png" alt="Logo" class="footer-logo">
        <p>Universidad Evangélica de El Salvador</p>
        <p class="app-footer-brand">Caries Risk ES · Evaluación de Riesgo de Caries</p>
      </footer>

      <!-- Hidden Per-Patient PDF Templates -->
      <ng-container *ngFor="let p of (group?.patients || [])">
        <div [id]="'pdf-patient-' + p.id" class="pdf-template" style="display: none;">
          <div class="pdf-header">
            <div class="pdf-logo-container">
              <img src="docs/logo.png" alt="Logo">
            </div>
            <div class="pdf-header-text">
              <h1>Reporte de Riesgo de Caries</h1>
              <p>Clínica Odontológica · Caries Risk ES</p>
            </div>
          </div>

          <div class="pdf-section">
            <h2 class="pdf-section-title">Información del Paciente</h2>
            <div class="pdf-info-grid">
              <div class="pdf-info-item">
                <span class="pdf-info-label">Código:</span>
                <span class="pdf-info-value">{{ p.code || 'No indicado' }}</span>
              </div>
              <div class="pdf-info-item">
                <span class="pdf-info-label">Edad:</span>
                <span class="pdf-info-value">{{ p.age ? p.age + ' años' : 'No indicada' }}</span>
              </div>
              <div class="pdf-info-item">
                <span class="pdf-info-label">Fecha de Evaluación:</span>
                <span class="pdf-info-value">{{ p.date | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="pdf-info-item" *ngIf="p.nextAppointmentDate">
                <span class="pdf-info-label">Próximo Control:</span>
                <span class="pdf-info-value">{{ p.nextAppointmentDate | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>

          <div class="pdf-section">
            <h2 class="pdf-section-title">Resultado de Evaluación (CAMBRA)</h2>
            <div class="pdf-result-card">
              <div class="pdf-risk-badge" [class]="'risk-' + p.result.riskLevel.toLowerCase()">
                {{ p.result.riskLevel === 'BAJO' ? 'BAJO RIESGO' : 'ALTO RIESGO' }}
              </div>
              <div class="pdf-score-details">
                <p><strong>Puntaje Total:</strong> {{ p.result.totalScore }} puntos</p>
                <p class="pdf-risk-desc">Esta evaluación se basa en el balance entre indicadores de enfermedad, factores de riesgo y factores protectores.</p>
              </div>
            </div>
          </div>

          <div class="pdf-section">
            <h2 class="pdf-section-title">Desglose de Puntuación</h2>
            <!-- 0-5 years breakdown -->
            <ng-container *ngIf="p.ageGroup === 'AGE_0_5'">
              <div class="pdf-score-breakdown">
                <div class="pdf-score-row">
                  <div class="pdf-score-row-label">
                    <span class="pdf-score-badge pdf-badge-a">A</span>
                    <span>Factores de riesgo (Sectores 1, 2, 5)</span>
                  </div>
                  <div class="pdf-score-row-hint">2 pts por casilla roja, 1 pt por casilla blanca</div>
                  <div class="pdf-score-row-value">{{ p.result.scoreA ?? 0 }}</div>
                </div>
                <div class="pdf-score-row">
                  <div class="pdf-score-row-label">
                    <span class="pdf-score-badge pdf-badge-b">B</span>
                    <span>Factores protectores (Sectores 3, 4)</span>
                  </div>
                  <div class="pdf-score-row-hint">1 pt por cada factor protector</div>
                  <div class="pdf-score-row-value">{{ p.result.scoreB ?? 0 }}</div>
                </div>
                <div class="pdf-score-total-row">
                  <span class="pdf-score-total-formula">Total (A &minus; B)</span>
                  <span class="pdf-score-total-value" [class.pdf-total-alto]="p.result.totalScore >= 6">{{ p.result.totalScore }} puntos</span>
                </div>
                <div class="pdf-score-thresholds">
                  <span>Bajo riesgo: &minus;5 a 5 puntos</span>
                  <span>Alto riesgo: 6 a 18 puntos</span>
                </div>
              </div>
            </ng-container>
            <!-- 6+ years breakdown -->
            <ng-container *ngIf="p.ageGroup !== 'AGE_0_5'">
              <div class="pdf-score-breakdown">
                <div class="pdf-score-row">
                  <div class="pdf-score-row-label">
                    <span class="pdf-score-badge pdf-badge-a">A</span>
                    <span>Indicadores de enfermedad (&times;2)</span>
                  </div>
                  <div class="pdf-score-row-hint"></div>
                  <div class="pdf-score-row-value">{{ p.result.diseaseScore }}</div>
                </div>
                <div class="pdf-score-row">
                  <div class="pdf-score-row-label">
                    <span class="pdf-score-badge pdf-badge-b">B</span>
                    <span>Factores de riesgo (&times;1)</span>
                  </div>
                  <div class="pdf-score-row-hint"></div>
                  <div class="pdf-score-row-value">{{ p.result.riskScore }}</div>
                </div>
                <div class="pdf-score-row">
                  <div class="pdf-score-row-label">
                    <span class="pdf-score-badge pdf-badge-c">C</span>
                    <span>Factores protectores (&minus;1)</span>
                  </div>
                  <div class="pdf-score-row-hint"></div>
                  <div class="pdf-score-row-value">&minus;{{ p.result.protectiveScore }}</div>
                </div>
                <div class="pdf-score-total-row">
                  <span class="pdf-score-total-formula">A&times;2 + B &minus; C</span>
                  <span class="pdf-score-total-value" [class.pdf-total-alto]="p.result.totalScore >= 5">{{ p.result.totalScore }} puntos</span>
                </div>
                <div class="pdf-score-thresholds">
                  <span>Bajo riesgo: &minus;9 a 4 puntos</span>
                  <span>Alto riesgo: 5 a 18 puntos</span>
                </div>
              </div>
            </ng-container>
          </div>

          <div class="pdf-section" *ngIf="p.objectives">
            <h2 class="pdf-section-title">Objetivos de Autocuidado</h2>
            <div class="pdf-objectives">
              <p>{{ p.objectives }}</p>
            </div>
          </div>

          <div class="pdf-section">
            <h2 class="pdf-section-title">Recomendaciones</h2>
            <ul class="pdf-recommendations-list">
              <li *ngFor="let rec of getPatientRecommendations(p)" class="pdf-recommendation-item">
                <span class="pdf-rec-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
                </span>
                <span>{{ rec }}</span>
              </li>
            </ul>
          </div>

          <div class="pdf-footer">
            <p>Universidad Evangélica de El Salvador · Proyecto de Evaluación de Riesgo</p>
            <p class="pdf-footer-brand">Caries Risk ES</p>
          </div>
        </div>
      </ng-container>

      <!-- Hidden Template for Group PDF -->
      <div id="group-report-template" class="pdf-template" style="display: none;">
        <div class="pdf-header">
          <div class="pdf-logo-container">
            <img src="docs/logo.png" alt="Logo">
          </div>
          <div class="pdf-header-text">
            <h1>Reporte Grupal de Riesgo</h1>
            <p>Clínica Odontológica · Caries Risk ES</p>
          </div>
        </div>

        <div class="pdf-section">
          <h2 class="pdf-section-title">Resumen del Grupo</h2>
          <div class="pdf-info-grid">
            <div class="pdf-info-item">
              <span class="pdf-info-label">Nombre del Grupo:</span>
              <span class="pdf-info-value">{{ group.name }}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Fecha Emisión:</span>
              <span class="pdf-info-value">{{ generationDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Total Pacientes:</span>
              <span class="pdf-info-value">{{ group.patients.length }}</span>
            </div>
            <div class="pdf-info-item">
              <span class="pdf-info-label">Riesgo Promedio:</span>
              <span class="pdf-info-value" [class]="'risk-text-' + averageRiskLevel.toLowerCase()">{{ averageScore }} - {{ averageRiskLevel }}</span>
            </div>
          </div>
        </div>

        <div class="pdf-section">
          <h2 class="pdf-section-title">Detalle de Pacientes</h2>
          <table class="pdf-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Edad</th>
                <th>Revisión</th>
                <th>Riesgo</th>
                <th>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of group.patients">
                <td>{{ p.code }}</td>
                <td>{{ p.age }} años</td>
                <td>{{ p.date | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span class="pdf-risk-badge" [class]="'risk-' + p.result.riskLevel.toLowerCase()">
                    {{ p.result.riskLevel }}
                  </span>
                </td>
                <td>{{ p.result.totalScore }} pts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pdf-footer">
          <p>Universidad Evangélica de El Salvador · Proyecto de Evaluación de Riesgo</p>
          <p class="pdf-footer-brand">Caries Risk ES</p>
        </div>
      </div>
    </div>

    <ng-template #notFound>
      <div class="not-found-screen">
        <h3>Grupo no encontrado</h3>
        <p>Es posible que el grupo haya sido eliminado o el ID sea incorrecto.</p>
        <button class="btn-primary" routerLink="/cambra/groups">Volver al listado</button>
      </div>
    </ng-template>
  `,
  styleUrls: ['./group-detail.scss']
})
export class GroupDetail implements OnInit {
  group: PatientGroup | null = null;
  generationDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: CambraStateService,
    private pdfExport: PdfExportService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.group = this.state.groups.find(g => g.id === id) || null;
      if (this.group) {
        this.state.setCurrentGroup(this.group.id);
      }
    });
  }

  get averageScore(): number {
    if (!this.group || this.group.patients.length === 0) return 0;
    const total = this.group.patients.reduce((sum, p) => sum + p.result.totalScore, 0);
    return Math.round((total / this.group.patients.length) * 10) / 10;
  }

  get averageRiskLevel(): string {
    if (!this.group || this.group.patients.length === 0) return 'N/A';

    // Simplistic average: count occurrences or average scores
    // Let's use average absolute scores if available, or just most frequent
    const scores = this.group.patients.map(p => p.result.totalScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Basic threshold logic (adjust based on CAMBRA rules)
    if (avgScore >= 5) return 'ALTO';
    return 'BAJO';
  }

  get averageRiskScorePercent(): number {
    if (!this.group || this.group.patients.length === 0) return 0;
    const maxPossibleScore = 18; // Approx max for CAMBRA
    return Math.min(100, (this.averageScore / maxPossibleScore) * 100);
  }

  addNewPatient() {
    this.state.reset();
    this.state.setIndividualMode(false);
    // currentGroupId is already set in ngOnInit
    this.router.navigate(['/cambra/evaluation']);
  }

  deletePatient(patientId: string) {
    if (this.group && confirm('¿Eliminar esta evaluación?')) {
      this.state.deletePatientFromGroup(this.group.id, patientId);
      // Refresh local view
      this.group.patients = this.group.patients.filter(p => p.id !== patientId);
    }
  }

  exportingPatientId: string | null = null;

  exportGroupPdf() {
    if (!this.group) return;
    this.pdfExport.exportToPdf('group-report-template', `Reporte_Grupal_${this.group.name.replace(/\s+/g, '_')}.pdf`);
  }

  async exportPatientPdf(p: PatientRecord) {
    this.exportingPatientId = p.id;
    const fileName = `Reporte_${p.code.replace(/\s+/g, '_') || 'Paciente'}`;
    await this.pdfExport.exportToPdf(`pdf-patient-${p.id}`, fileName);
    this.exportingPatientId = null;
  }

  getPatientRecommendations(p: PatientRecord): string[] {
    const isAlto = p.result.riskLevel === 'ALTO';
    const is0to5 = p.ageGroup === 'AGE_0_5';
    if (!isAlto) {
      return is0to5
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
    return is0to5
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

  exportGroupCsv() {
    if (!this.group || this.group.patients.length === 0) return;

    // BOM for UTF-8 Excel support
    const BOM = '\uFEFF';

    // Config headers
    const headers = ['Código,Edad,Fecha,Riesgo,Puntaje\n'];

    // Rows
    const rows = this.group.patients.map(p => {
      const date = new Intl.DateTimeFormat('es-SV').format(new Date(p.date));
      // Escape commas inside code just in case
      const code = `"${p.code.replace(/"/g, '""')}"`;
      return `${code},${p.age},${date},${p.result.riskLevel},${p.result.totalScore}`;
    });

    // Add extra info below
    rows.push('', '', `Riesgo Promedio del Grupo:,${this.averageScore} - ${this.averageRiskLevel}`);
    rows.push(`Total de Evaluaciones:,${this.group.patients.length}`);

    const csvContent = BOM + headers.join('') + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Grupal_${this.group.name.replace(/\s+/g, '_')}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
