import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./pages/expenses/expenses.component').then(
            (m) => m.ExpensesComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./pages/contact-us/contact-us.component').then(
            (m) => m.ContactUsComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./pages/user-management/user-management.component').then(
            (m) => m.UserManagementComponent
          ),
        canActivate: [AuthGuard],
        data: { requiresAdmin: true },
      },
      {
        path: 'invoicing',
        loadComponent: () =>
          import('./invoicing/invoicing.component').then(
            (m) => m.InvoicingComponent
          ),
        canActivate: [AuthGuard],
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
