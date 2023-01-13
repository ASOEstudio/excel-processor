import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultConsolidatedComponent } from './result-consolidated.component';

describe('ResultProcessComponent', () => {
  let component: ResultConsolidatedComponent;
  let fixture: ComponentFixture<ResultConsolidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultConsolidatedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
