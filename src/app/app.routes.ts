import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoicingComponent } from './pages/invoicing/invoicing.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { authGuard } from './Guard/authGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [

      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]  },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'invoicing', component: InvoicingComponent }
    ]

  }
];