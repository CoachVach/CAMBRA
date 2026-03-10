import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { PatientGroup } from '../../../../core/models/patient-group.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="groups-container">
      <header class="app-header">
        <div class="header-content">
          <div class="header-back">
            <button class="header-back-btn" routerLink="/cambra/dashboard">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div class="header-text">
            <h1 class="app-title">Caries Risk ES</h1>
            <p class="app-subtitle">Mis Grupos de Pacientes</p>
          </div>
          <div class="header-actions">
            <a href="/docs/SEOP-Cuestionario-Cambra-1-y-2.pdf" download="Cuestionario-CAMBRA-SEOP.pdf" class="header-doc-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
              <span>Documentación</span>
            </a>
          </div>
        </div>
      </header>

      <main class="groups-main">
        <div class="groups-grid" *ngIf="groups.length > 0; else emptyState">
          <div class="group-card" *ngFor="let group of groups" (click)="goToGroup(group.id)">
            <div class="group-info">
              <h3>{{ group.name }}</h3>
              <p class="group-desc">{{ group.description || 'Análisis de riesgo colectivo' }}</p>
              <div class="group-meta">
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                  </svg>
                  {{ group.patients.length }} pacientes
                </span>
                <span class="meta-item date">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                  </svg>
                  {{ group.createdAt | date:'dd/MM/yyyy' }}
                </span>
              </div>
            </div>
            <div class="group-actions">
              <button class="btn-delete" (click)="deleteGroup($event, group.id)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
              </button>
              <div class="btn-enter">
                Entrar
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.33 2.99-3S17.66 5 16 5c-1.66 0-3 1.33-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.33 2.99-3S9.66 5 8 5C6.34 5 5 6.67 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
              </svg>
            </div>
            <h3>No hay grupos creados</h3>
            <p>Comienza creando un nuevo grupo desde el panel principal.</p>
            <button class="btn-create" routerLink="/cambra/dashboard">Ir al Panel</button>
          </div>
        </ng-template>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <img src="docs/logo.png" alt="Logo" class="footer-logo">
        <p>Universidad Evangélica de El Salvador</p>
        <p class="app-footer-brand">Caries Risk ES · Evaluación de Riesgo de Caries</p>
      </footer>
    </div>
  `,
  styleUrls: ['./group-list.scss']
})
export class GroupList {
  constructor(private state: CambraStateService, private router: Router) { }

  get groups() {
    return this.state.groups;
  }

  goToGroup(id: string) {
    this.router.navigate(['/cambra/groups', id]);
  }

  deleteGroup(event: Event, id: string) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar este grupo y todas sus evaluaciones?')) {
      this.state.deleteGroup(id);
    }
  }
}
