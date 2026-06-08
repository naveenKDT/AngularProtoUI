import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout.component';

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
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'administration',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/users',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/departments',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/designations',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/roles',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/permissions',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/levels',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'leaves',
        loadComponent: () => import('./features/leaves/leaves.component').then(m => m.LeavesComponent)
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];