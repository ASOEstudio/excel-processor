import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivesFilesComponent } from './receives-files.component';

describe('ReceivesFilesComponent', () => {
  let component: ReceivesFilesComponent;
  let fixture: ComponentFixture<ReceivesFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivesFilesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivesFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
