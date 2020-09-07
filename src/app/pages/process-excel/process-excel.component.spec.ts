import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessExcelComponent } from './process-excel.component';

describe('ProcessExcelComponent', () => {
  let component: ProcessExcelComponent;
  let fixture: ComponentFixture<ProcessExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
