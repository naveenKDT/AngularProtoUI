import { Routes } from '@angular/router';
import { MainLayoutComponent } from './knodtec/core/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./knodtec/features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'assets',
        loadComponent: () => import('./knodtec/features/assets/assets.component').then(m => m.AssetsComponent)
      },
      {
        path: 'assets/:id',
        loadComponent: () => import('./knodtec/features/assets/assets.component').then(m => m.AssetsComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./knodtec/features/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'requests/new',
        loadComponent: () => import('./knodtec/features/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'requests/:id',
        loadComponent: () => import('./knodtec/features/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./knodtec/features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./knodtec/features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'exit-clearance',
        loadComponent: () => import('./knodtec/features/exit-clearance/exit-clearance.component').then(m => m.ExitClearanceComponent)
      },
      {
        path: 'exit-clearance/:id',
        loadComponent: () => import('./knodtec/features/exit-clearance/exit-clearance.component').then(m => m.ExitClearanceComponent)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];