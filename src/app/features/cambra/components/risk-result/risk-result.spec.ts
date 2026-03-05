import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskResult } from './risk-result';

describe('RiskResult', () => {
  let component: RiskResult;
  let fixture: ComponentFixture<RiskResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
