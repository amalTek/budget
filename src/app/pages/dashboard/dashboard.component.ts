import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartOptions } from 'chart.js';
import { FinancialService } from '../../services/financial.service';
import { CommonModule } from '@angular/common';
// import { ChartsModule } from 'ng2-charts';
@Component({
  standalone:true,
  selector: 'app-dashboard',
  imports: [MatCardModule,MatIconModule ,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private financialService:FinancialService ){}
  public financialSummary:any[]=[];
ngOnInit(){
this.loadData();
}
  loadData() {
    this.financialService.loadDashboardData().subscribe(
      response => {
        console.log("testtt",response)
        this.financialSummary = response

      });

  }
  public pieChartLabels: string[] = ['Category A', 'Category B', 'Category C']; // Labels as an array of strings
  public pieChartData: number[] = [120, 150, 180]; // Chart data
  public pieChartType: string = 'pie'; // Chart type
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
}
