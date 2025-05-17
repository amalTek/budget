import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { authGuard } from './Guard/authGuard';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';

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
      { path: 'invoicing', component: InvoicingComponent },
      { path: 'contactUs', component: ContactUsComponent }
    ]

  }
];