import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FinancialService } from '../../services/financial.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { FinancialPieChartComponent } from '../financial-pie-chart/financial-pie-chart.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,FinancialPieChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private financialService: FinancialService) {}

  currentChartData: any;

 

  public financialSummary: any[] = [];
  public selectedMonth: Date = new Date(); // Initialize with current date

  ngOnInit() {
    this.loadData();
  }

  // Format the month for display
  get formattedMonth(): string {
    return this.selectedMonth.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Handle month selection
  chooseMonth(normalizedMonth: Date, datepicker: any): void {
    this.selectedMonth = new Date(
      normalizedMonth.getFullYear(),
      normalizedMonth.getMonth(),
      1
    );
    datepicker.close();
    this.loadData(); // Reload data when month changes
  }

  loadData() {
    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth();
    
    this.financialService.loadDashboardData(year, month).subscribe({
      next: (response) => {
        this.financialSummary = response;
        
        this.currentChartData = response && response.length > 0 
          ? response[0] 
          : { totalInvoicing: 0, totalExpenses: 0, currentBalance: 0 };
      },
      error: (err) => {
        console.error('Failed to load financial data:', err);
      }
    });
  }
  get currentCurrency(): string {
  return 'TND'; // Or make this dynamic if you have currency selection
}

formatCurrency(value: number): string {
  if (!value && value !== 0) return `0.000 ${this.currentCurrency}`;
  return value.toFixed(3) + ' ' + this.currentCurrency;

}
}