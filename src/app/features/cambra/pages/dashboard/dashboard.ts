import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Standardized Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM10 22V13H8V7H16V13H14V22H10Z" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="app-title">CARIES-RISK-ES</h1>
            <p class="app-subtitle">Panel de Control</p>
          </div>
          <div class="header-actions">
            <a href="/docs/Caries Risk ES.pdf" download="Caries Risk ES.pdf" class="header-doc-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
              </svg>
              <span>Documentación</span>
            </a>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="options-grid">
          <!-- Card: Individual Assessment -->
          <div class="option-card" (click)="startIndividual()">
            <div class="option-icon individual">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Evaluación Individual</h3>
            <p>Realiza una evaluación de riesgo para un paciente nuevo sin asociarlo a un grupo.</p>
            <button class="btn-action">Empezar</button>
          </div>

          <!-- Card: Create Group -->
          <div class="option-card" (click)="showNewGroupModal = true">
            <div class="option-icon group-new">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Crear Nuevo Grupo</h3>
            <p>Organiza a tus pacientes en grupos para un análisis colectivo profesional.</p>
            <button class="btn-action">Añadir grupo</button>
          </div>

          <!-- Card: View Groups -->
          <div class="option-card" routerLink="/cambra/groups">
            <div class="option-icon groups-view">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Ver Mis Grupos</h3>
            <div class="group-count">{{ groups.length }} grupos guardados</div>
            <p>Accede a tus grupos existentes, ve resultados y descarga reportes.</p>
            <button class="btn-action">Ver listado</button>
          </div>
        </div>

        <!-- Recent Groups Section -->
        <div class="recent-section" *ngIf="recentGroups.length > 0">
          <h2>Recientes</h2>
          <div class="recent-list">
            <div class="recent-item" *ngFor="let group of recentGroups" (click)="goToGroup(group.id)">
              <div class="recent-info">
                <span class="recent-name">{{ group.name }}</span>
                <span class="recent-date">{{ group.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="recent-patients">
                {{ group.patients.length }} pacientes
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <img src="docs/logo.png" alt="Logo" class="footer-logo">
        <p>Universidad Evangélica de El Salvador</p>
        <p class="app-footer-brand">CARIES-RISK-ES · Evaluación de Riesgo de Caries</p>
      </footer>

      <!-- Create Group Modal -->
      <div class="modal-overlay" *ngIf="showNewGroupModal" (click)="showNewGroupModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Nuevo Grupo de Pacientes</h2>
          <p>Ingresa un nombre para identificar este grupo de evaluaciones.</p>
          
          <div class="form-group">
            <label>Nombre del Grupo</label>
            <input 
              type="text" 
              placeholder="Ej: Clínica Central - Mañana" 
              [(ngModel)]="newGroupName"
              (keyup.enter)="newGroupName.trim() ? createGroup() : null"
              focus
            >
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="showNewGroupModal = false">Cancelar</button>
            <button class="btn-create" [disabled]="!newGroupName.trim()" (click)="createGroup()">
              Crear Grupo
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  showNewGroupModal = false;
  newGroupName = '';

  constructor(
    private state: CambraStateService,
    private router: Router
  ) { }

  get groups() {
    return this.state.groups;
  }

  get recentGroups() {
    return [...this.state.groups]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }

  startIndividual() {
    this.state.reset();
    this.state.setIndividualMode(true);
    this.state.setCurrentGroup(null);
    this.router.navigate(['/cambra/evaluation']);
  }

  viewGroups() {
    this.router.navigate(['/cambra/groups']);
  }

  createGroup() {
    if (!this.newGroupName) return;
    const group = this.state.createGroup(this.newGroupName);
    this.newGroupName = '';
    this.showNewGroupModal = false;
    this.goToGroup(group.id);
  }

  goToGroup(id: string) {
    this.router.navigate(['/cambra/groups', id]);
  }
}
