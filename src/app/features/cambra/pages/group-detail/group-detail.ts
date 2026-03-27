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

  exportGroupPdf() {
    if (!this.group) return;
    this.pdfExport.exportToPdf('group-report-template', `Reporte_Grupal_${this.group.name.replace(/\s+/g, '_')}.pdf`);
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
