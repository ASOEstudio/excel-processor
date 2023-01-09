import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBackComponent } from './page-back.component';

describe('PageBackComponent', () => {
  let component: PageBackComponent;
  let fixture: ComponentFixture<PageBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageBackComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
