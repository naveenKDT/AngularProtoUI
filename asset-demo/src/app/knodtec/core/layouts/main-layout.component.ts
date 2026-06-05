import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  route: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
}

@Component({
  selector: 'knodtec-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <!-- Logo -->
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            @if (!sidebarCollapsed()) {
              <div class="logo-text">
                <span class="logo-brand">KNODTEC</span>
                <span class="logo-module">Asset Management</span>
              </div>
            }
          </div>
          <button class="collapse-btn" (click)="toggleSidebar()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (sidebarCollapsed()) {
                <path d="M9 18l6-6-6-6"/>
              } @else {
                <path d="M15 18l-6-6 6-6"/>
              }
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          @for (item of navItems(); track item.key) {
            <a 
              class="nav-item"
              [class.active]="activeRoute() === item.route"
              [routerLink]="item.route"
              (click)="setActiveRoute(item.route)">
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
              @if (item.key === 'requests' && pendingCount() > 0) {
                <span class="nav-badge">{{ pendingCount() }}</span>
              }
            </a>
          }
        </nav>

        <!-- User Section -->
        <div class="sidebar-footer">
          <div class="user-card" (click)="toggleUserMenu()">
            <div class="user-avatar">{{ currentUser().avatar }}</div>
            @if (!sidebarCollapsed()) {
              <div class="user-info">
                <span class="user-name">{{ currentUser().name }}</span>
                <span class="user-role">{{ currentUser().role }}</span>
              </div>
            }
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-area">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <div class="breadcrumb">
              <span class="breadcrumb-module">{{ moduleName() }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <span class="breadcrumb-page">{{ pageName() }}</span>
            </div>
          </div>
          <div class="header-right">
            <button class="header-action" title="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button class="header-action" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="notification-dot"></span>
            </button>
            <button class="header-action" title="Settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
      background: var(--color-slate-50);
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: white;
      border-right: 1px solid var(--color-slate-200);
      display: flex;
      flex-direction: column;
      transition: width var(--transition-normal);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 40;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-indigo-600));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-brand {
      font-size: 16px;
      font-weight: 800;
      color: var(--color-slate-900);
      letter-spacing: 0.5px;
    }

    .logo-module {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-slate-500);
    }

    .collapse-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: var(--color-slate-400);
      transition: all var(--transition-fast);
    }

    .collapse-btn:hover {
      background: var(--color-slate-100);
      color: var(--color-slate-600);
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--color-slate-600);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-fast);
      text-decoration: none;
    }

    .nav-item:hover {
      background: var(--color-slate-50);
      color: var(--color-slate-900);
    }

    .nav-item.active {
      background: var(--color-primary-50);
      color: var(--color-primary-600);
    }

    .nav-item.active .nav-icon {
      color: var(--color-primary-600);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-icon :deep(svg) {
      width: 18px;
      height: 18px;
    }

    .nav-label {
      flex: 1;
    }

    .nav-badge {
      background: var(--color-red-500);
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    /* Footer */
    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid var(--color-slate-100);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .user-card:hover {
      background: var(--color-slate-50);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-violet-500), var(--color-indigo-500));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .user-role {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Main Area */
    .main-area {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      transition: margin-left var(--transition-normal);
    }

    .sidebar.collapsed + .main-area {
      margin-left: 72px;
    }

    /* Header */
    .header {
      height: var(--header-height);
      background: white;
      border-bottom: 1px solid var(--color-slate-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }

    .breadcrumb-module {
      color: var(--color-slate-500);
      font-weight: 500;
    }

    .breadcrumb svg {
      color: var(--color-slate-300);
    }

    .breadcrumb-page {
      color: var(--color-slate-900);
      font-weight: 600;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-action {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: var(--color-slate-500);
      transition: all var(--transition-fast);
      position: relative;
    }

    .header-action:hover {
      background: var(--color-slate-100);
      color: var(--color-slate-700);
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: var(--color-red-500);
      border-radius: 50%;
      border: 2px solid white;
    }

    /* Content */
    .content {
      flex: 1;
      padding: 24px;
    }
  `]
})
export class MainLayoutComponent {
  readonly sidebarCollapsed = signal(false);
  readonly activeRoute = signal('/dashboard');
  readonly userMenuOpen = signal(false);
  readonly pendingCount = signal(12);

  readonly currentUser = signal<User>({
    id: 'EMP-2007',
    name: 'Nisha Sharma',
    email: 'nisha.sharma@knodtec.com',
    role: 'IT Asset Manager',
    avatar: 'NS',
    department: 'Information Technology'
  });

  readonly navItems = signal<NavItem[]>([
    {
      key: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
    },
    {
      key: 'assets',
      label: 'Asset Inventory',
      route: '/assets',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>'
    },
    {
      key: 'requests',
      label: 'Support & Requests',
      route: '/requests',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    },
    {
      key: 'reports',
      label: 'Reports',
      route: '/reports',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
    },
    {
      key: 'profile',
      label: 'My Profile',
      route: '/profile',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    },
    {
      key: 'exit',
      label: 'Exit Clearance',
      route: '/exit-clearance',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
    }
  ]);

  readonly moduleName = computed(() => {
    const route = this.activeRoute();
    if (route.includes('profile')) return 'HR';
    if (route.includes('exit')) return 'HR Operations';
    return 'Asset Management';
  });

  readonly pageName = computed(() => {
    const route = this.activeRoute();
    if (route === '/dashboard') return 'Dashboard';
    if (route === '/assets') return 'Asset Inventory';
    if (route === '/requests') return 'Support & Requests';
    if (route === '/reports') return 'Reports';
    if (route === '/profile') return 'My Profile';
    if (route === '/exit-clearance') return 'Exit Clearance';
    return '';
  });

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  setActiveRoute(route: string): void {
    this.activeRoute.set(route);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }
}