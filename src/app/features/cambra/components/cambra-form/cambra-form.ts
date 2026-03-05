import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CAMBRA_6PLUS_DEFINITION } from '../../cambra-6plus.definition';
import { CAMBRA_0TO5_DEFINITION } from '../../cambra-0to5.definition';
import { CambraItem } from '../../../../core/models/cambra-item.model';
import { CambraFormDefinition } from '../../../../core/models/cambra-form.model';
import { CambraCalculationService } from '../../../../core/services/cambra-calculation.service';
import { CambraCalculationResult } from '../../../../core/models/cambra-result.model';
import { CambraStateService } from '../../../../core/services/cambra-state.service';
import { AgeGroup } from '../../../../core/models/age-group.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cambra-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambra-form.html',
  styleUrls: ['./cambra-form.scss'],
})
export class CambraForm implements OnInit, OnChanges, OnDestroy {
  @Input() ageGroup: AgeGroup = 'AGE_6_PLUS';
  @Input() isReadOnly: boolean = false;

  form!: FormGroup;
  result?: CambraCalculationResult;
  definition!: CambraFormDefinition;

  diseaseIndicators: CambraItem[] = [];
  riskFactors: CambraItem[] = [];
  protectiveFactors: CambraItem[] = [];

  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private calculationService: CambraCalculationService,
    private cambraState: CambraStateService,
  ) { }

  ngOnInit() {
    this.loadDefinition();
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ageGroup'] && !changes['ageGroup'].firstChange) {
      this.loadDefinition();
      this.buildForm();
    }

    if (changes['isReadOnly'] && this.form) {
      if (this.isReadOnly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private loadDefinition() {
    this.definition =
      this.ageGroup === 'AGE_0_5'
        ? CAMBRA_0TO5_DEFINITION
        : CAMBRA_6PLUS_DEFINITION;

    this.diseaseIndicators = this.definition.diseaseIndicators;
    this.riskFactors = this.definition.riskFactors;
    this.protectiveFactors = this.definition.protectiveFactors;
  }

  private buildForm() {
    this.sub?.unsubscribe();

    this.form = this.fb.group({
      diseaseIndicators: this.buildArray(this.diseaseIndicators),
      riskFactors: this.buildArray(this.riskFactors),
      protectiveFactors: this.buildArray(this.protectiveFactors),
    });

    this.sub = this.form.valueChanges.subscribe(() => {
      this.recalculate();
    });

    if (this.isReadOnly) {
      this.form.disable();
    }

    // Initial calculation
    this.recalculate();
  }

  private recalculate() {
    const result = this.calculationService.calculate(
      this.form,
      this.ageGroup,
      this.diseaseIndicators,
      this.riskFactors,
      this.protectiveFactors,
    );
    this.result = result;
    this.cambraState.setResult(result);
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

  resetForm() {
    this.form.reset();
    Object.values(this.form.controls).forEach(control => {
      if (control instanceof FormArray) {
        control.controls.forEach(c => c.setValue(false));
      }
    });
  }

  get is0to5(): boolean {
    return this.ageGroup === 'AGE_0_5';
  }

  get formTitle(): string {
    return this.is0to5
      ? 'Cuestionario CAMBRA modificado para edades de 0 a 5 años'
      : 'Cuestionario CAMBRA modificado para edades a partir de 6 años';
  }

  get diseaseSectionTitle(): string {
    return this.is0to5
      ? 'Factores de riesgo de caries (Sectores 1 y 5)'
      : '(A) Indicadores de la enfermedad';
  }

  get diseaseSectionDescription(): string {
    return this.is0to5
      ? 'Antecedentes de caries e indicadores clínicos'
      : 'Signos visibles de actividad de caries (2 puntos cada uno)';
  }

  get riskSectionTitle(): string {
    return this.is0to5
      ? 'Factores de riesgo (Sector 2)'
      : '(B) Factores de riesgo';
  }

  get riskSectionDescription(): string {
    return this.is0to5
      ? 'Hábitos y condiciones que aumentan el riesgo'
      : 'Efectuar "Pruebas" si existe algún indicador de enfermedad (1 punto cada uno)';
  }

  get protectiveSectionTitle(): string {
    return this.is0to5
      ? 'Factores protectores (Sectores 3 y 4)'
      : '(C) Factores protectores';
  }

  get protectiveSectionDescription(): string {
    return this.is0to5
      ? 'Elementos que reducen el riesgo de caries'
      : 'Hábitos y tratamientos protectores (se resta 1 punto cada uno)';
  }
}
