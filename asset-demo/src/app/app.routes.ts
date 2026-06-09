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
        loadComponent: () => import('./modules/dashboard/components/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/components/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'administration',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/users',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/departments',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/designations',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/roles',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/permissions',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'administration/levels',
        loadComponent: () => import('./modules/administration/components/administration.component').then(m => m.AdministrationComponent)
      },
      {
        path: 'leaves',
        loadComponent: () => import('./modules/leaves/components/leaves.component').then(m => m.LeavesComponent)
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./modules/onboarding-offboarding/components/onboarding/onboarding.component').then(m => m.OnboardingComponent)
      },
      {
        path: 'offboarding',
        loadComponent: () => import('./modules/onboarding-offboarding/components/offboarding/offboarding.component').then(m => m.OffboardingComponent)
      },
      // Asset Management Routes
      {
        path: 'assets',
        loadComponent: () => import('./modules/asset-management/components/assets/assets.component').then(m => m.AssetsComponent)
      },
      {
        path: 'assets/new',
        loadComponent: () => import('./modules/asset-management/components/add-asset/add-asset.component').then(m => m.AddAssetComponent)
      },
      {
        path: 'assets/:id',
        loadComponent: () => import('./modules/asset-management/components/assets/asset-details.component').then(m => m.AssetDetailsComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./modules/asset-management/components/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'requests/new',
        loadComponent: () => import('./modules/asset-management/components/raise-request/raise-request.component').then(m => m.RaiseRequestComponent)
      },
      {
        path: 'requests/:id',
        loadComponent: () => import('./modules/asset-management/components/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./modules/asset-management/components/tickets/tickets.component').then(m => m.TicketsComponent)
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./modules/asset-management/components/raise-ticket/raise-ticket.component').then(m => m.RaiseTicketComponent)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./modules/asset-management/components/tickets/tickets.component').then(m => m.TicketsComponent)
      },
      {
        path: 'raise-ticket',
        loadComponent: () => import('./modules/asset-management/components/raise-ticket/raise-ticket.component').then(m => m.RaiseTicketComponent)
      },
      {
        path: 'raise-request',
        loadComponent: () => import('./modules/asset-management/components/raise-request/raise-request.component').then(m => m.RaiseRequestComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./modules/asset-management/components/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'it-clearance',
        loadComponent: () => import('./modules/asset-management/components/it-clearance/it-clearance.component').then(m => m.ITClearnaceComponent)
      },
      {
        path: 'it-clearance/:id',
        loadComponent: () => import('./modules/asset-management/components/it-clearance/it-clearance.component').then(m => m.ITClearnaceComponent)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];