import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CAMBRA_6PLUS_DEFINITION } from '../../cambra-6plus.definition';
import { CambraItem } from '../../../../core/models/cambra-item.model';
import { CambraCalculationService } from '../../../../core/services/cambra-calculation.service';
import { CambraCalculationResult } from '../../../../core/models/cambra-result.model';
import { CambraStateService } from '../../../../core/services/cambra-state.service';


@Component({
  selector: 'app-cambra-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cambra-form">
      <div class="form-header">
        <div class="form-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM17 16H7V14H17V16ZM17 8H7V6H17V8Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="form-title">
          <h2>Cuestionario CAMBRA</h2>
          <p class="form-subtitle">Evaluación para pacientes ≥ 6 años</p>
        </div>
      </div>

      <form [formGroup]="form" class="assessment-form">
        <!-- Section A: Disease Indicators -->
        <div class="form-section disease-section">
          <div class="section-header">
            <div class="section-badge disease-badge">A</div>
            <div class="section-info">
              <h3 class="section-title">Indicadores de enfermedad</h3>
              <p class="section-description">Signos visibles de actividad de caries</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-item" *ngFor="let item of diseaseIndicators; let i = index">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  class="checkbox-input"
                  [formControl]="getFormControl(diseaseArray, i)"
                />
                <div class="checkbox-custom"></div>
                <div class="checkbox-content">
                  <span class="checkbox-text">{{ item.label }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Section B: Risk Factors -->
        <div class="form-section risk-section">
          <div class="section-header">
            <div class="section-badge risk-badge">B</div>
            <div class="section-info">
              <h3 class="section-title">Factores de riesgo</h3>
              <p class="section-description">Condiciones que aumentan el riesgo de caries</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-item" *ngFor="let item of riskFactors; let i = index">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  class="checkbox-input"
                  [formControl]="getFormControl(riskArray, i)"
                />
                <div class="checkbox-custom"></div>
                <div class="checkbox-content">
                  <span class="checkbox-text">{{ item.label }}</span>
                  <span class="checkbox-badge test-required" *ngIf="item.requiresTest">Requiere prueba</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Section C: Protective Factors -->
        <div class="form-section protective-section">
          <div class="section-header">
            <div class="section-badge protective-badge">C</div>
            <div class="section-info">
              <h3 class="section-title">Factores protectores</h3>
              <p class="section-description">Elementos que reducen el riesgo de caries</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-item" *ngFor="let item of protectiveFactors; let i = index">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  class="checkbox-input"
                  [formControl]="getFormControl(protectiveArray, i)"
                />
                <div class="checkbox-custom"></div>
                <div class="checkbox-content">
                  <span class="checkbox-text">{{ item.label }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./cambra-form.scss']
})
export class CambraForm implements OnInit {
  form!: FormGroup;
  result?: CambraCalculationResult;

  diseaseIndicators = CAMBRA_6PLUS_DEFINITION.diseaseIndicators;
  riskFactors = CAMBRA_6PLUS_DEFINITION.riskFactors;
  protectiveFactors = CAMBRA_6PLUS_DEFINITION.protectiveFactors;

  constructor(
    private fb: FormBuilder,
    private calculationService: CambraCalculationService,
    private cambraState: CambraStateService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      diseaseIndicators: this.buildArray(this.diseaseIndicators),
      riskFactors: this.buildArray(this.riskFactors),
      protectiveFactors: this.buildArray(this.protectiveFactors),
    });

    this.form.valueChanges.subscribe(() => {
      const result = this.calculationService.calculate(this.form);
      this.cambraState.setResult(result);
    });

  }

  private buildArray(items: CambraItem[]): FormArray {
    return this.fb.array(items.map(() => false));
  }

  get diseaseArray(): FormArray {
    return this.form.get('diseaseIndicators') as FormArray;
  }

  get riskArray(): FormArray {
    return this.form.get('riskFactors') as FormArray;
  }

  get protectiveArray(): FormArray {
    return this.form.get('protectiveFactors') as FormArray;
  }

  getFormControl(array: FormArray, index: number): FormControl {
    return array.at(index) as FormControl;
  }
}
