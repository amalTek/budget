import { Component } from '@angular/core';
import { SidenavbarComponent } from '../sidenavbar/sidenavbar.component';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ExpensesComponent } from '../expenses/expenses.component';

@Component({
  selector: 'app-layout',
  standalone: true,  
  imports: [RouterOutlet,SidenavbarComponent,DashboardComponent,ExpensesComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
