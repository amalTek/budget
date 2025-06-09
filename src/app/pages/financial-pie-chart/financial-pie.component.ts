import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

@Component({
  selector: 'app-financial-pie-chart',
  template: '<canvas #pieChart></canvas>',
  styles: [`
    canvas {
      max-width: 100%;
      height: auto;
    }
  `]
})
export class FinancialPieChartComponent implements OnChanges {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @Input() financialData: any;
  
  private chart: Chart<'pie'> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['financialData'] && this.financialData) {
      this.renderChart();
    }
  }

  private renderChart() {
    // Register required Chart.js components
    Chart.register(PieController, ArcElement, Tooltip, Legend);

    // Destroy previous chart if exists
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Facturation', 'Dépenses', 'Solde'],
        datasets: [{
          data: [
            this.financialData.totalInvoicing || 0,
            this.financialData.totalExpenses || 0,
            this.financialData.currentBalance || 0
          ],
          backgroundColor: [
            '#FFC107', // Invoicing - yellow
            '#E53935', // Expenses - red
            '#388E3C'  // Balance - green
          ],
          hoverBackgroundColor: [
            '#FFD54F',
            '#EF5350',
            '#66BB6A'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value:any = context.raw || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} DT (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}