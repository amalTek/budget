import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPieChartComponent } from './financial-pie-chart.component';

describe('FinancialPieChartComponent', () => {
  let component: FinancialPieChartComponent;
  let fixture: ComponentFixture<FinancialPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
