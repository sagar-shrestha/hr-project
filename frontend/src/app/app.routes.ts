import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', loadComponent: () => import('./pages/signup.component').then(m => m.SignupComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./pages/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'users/:id', loadComponent: () => import('./pages/user-details.component').then(m => m.UserDetailsComponent) },
      { path: 'attendance', loadComponent: () => import('./pages/attendance.component').then(m => m.AttendanceComponent) },
      { path: 'jobs', loadComponent: () => import('./pages/jobs.component').then(m => m.JobsComponent) },
      { path: 'reports', loadComponent: () => import('./pages/reports.component').then(m => m.ReportsComponent) },
    ]
  },
  { path: 'permissions', canActivate: [authGuard], loadComponent: () => import('./pages/permissions.component').then(m => m.PermissionsComponent) },
  { path: '', loadComponent: () => import('./pages/index.component').then(m => m.IndexComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found.component').then(m => m.NotFoundComponent) }
];
