import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultProcessComponent } from './result-process.component';

describe('ResultProcessComponent', () => {
  let component: ResultProcessComponent;
  let fixture: ComponentFixture<ResultProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultProcessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
