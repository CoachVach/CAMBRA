import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambraForm } from './cambra-form';

describe('CambraForm', () => {
  let component: CambraForm;
  let fixture: ComponentFixture<CambraForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambraForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambraForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
