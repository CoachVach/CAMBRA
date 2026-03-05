import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSummary } from './score-summary';

describe('ScoreSummary', () => {
  let component: ScoreSummary;
  let fixture: ComponentFixture<ScoreSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
