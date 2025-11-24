import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryCardsComponent } from './salary-cards.component';

describe('SalaryCardsComponent', () => {
  let component: SalaryCardsComponent;
  let fixture: ComponentFixture<SalaryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
