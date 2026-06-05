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
        loadComponent: () => import('./knodtec/features/assets/asset-details.component').then(m => m.AssetDetailsComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./knodtec/features/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'requests/new',
        loadComponent: () => import('./knodtec/features/raise-request/raise-request.component').then(m => m.RaiseRequestComponent)
      },
      {
        path: 'requests/:id',
        loadComponent: () => import('./knodtec/features/requests/requests.component').then(m => m.RequestsComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./knodtec/features/tickets/tickets.component').then(m => m.TicketsComponent)
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./knodtec/features/raise-ticket/raise-ticket.component').then(m => m.RaiseTicketComponent)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./knodtec/features/tickets/tickets.component').then(m => m.TicketsComponent)
      },
      {
        path: 'raise-ticket',
        loadComponent: () => import('./knodtec/features/raise-ticket/raise-ticket.component').then(m => m.RaiseTicketComponent)
      },
      {
        path: 'raise-request',
        loadComponent: () => import('./knodtec/features/raise-request/raise-request.component').then(m => m.RaiseRequestComponent)
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
        path: 'onboarding',
        loadComponent: () => import('./knodtec/features/onboarding/onboarding.component').then(m => m.OnboardingComponent)
      },
      {
        path: 'offboarding',
        loadComponent: () => import('./knodtec/features/offboarding/offboarding.component').then(m => m.OffboardingComponent)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];