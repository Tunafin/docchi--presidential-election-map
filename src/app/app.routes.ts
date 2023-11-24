import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/start/start.page.component').then(c => c.StartPageComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.page.component').then(c => c.DashboardPageComponent) },
];
