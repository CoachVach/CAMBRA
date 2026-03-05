import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambraPage } from './cambra-page';

describe('CambraPage', () => {
  let component: CambraPage;
  let fixture: ComponentFixture<CambraPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambraPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
