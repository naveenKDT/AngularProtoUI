import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        @if (!collapsed()) { <span class="logo-text">HRMS Pro</span> }
      </div>
      <div class="decorative-shapes"><div class="shape shape-1"></div><div class="shape shape-2"></div><div class="shape shape-3"></div></div>
      <nav class="sidebar-nav">
        @for (item of navItems; track item.label) {
          <div class="nav-section">
            @if (item.children?.length) {
              <div class="nav-item has-children" [class.active]="expandedMenus().has(item.label)" (click)="toggleMenu(item.label)">
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                @if (!collapsed()) {
                  <span class="nav-label">{{ item.label }}</span>
                  <span class="nav-chevron" [class.expanded]="expandedMenus().has(item.label)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </span>
                }
              </div>
              @if (!collapsed() && expandedMenus().has(item.label)) {
                <div class="nav-children">
                  @for (child of item.children; track child.label) {
                    <a class="nav-item child-item" [class.active]="activeRoute() === child.route" [routerLink]="child.route" (click)="navigate.emit(child.route!)">
                      <span class="nav-icon" [innerHTML]="child.icon"></span>
                      <span class="nav-label">{{ child.label }}</span>
                    </a>
                  }
                </div>
              }
            } @else {
              <a class="nav-item" [class.active]="activeRoute() === item.route" [routerLink]="item.route" (click)="navigate.emit(item.route!)">
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                @if (!collapsed()) { <span class="nav-label">{{ item.label }}</span> }
              </a>
            }
          </div>
        }
      </nav>
      <div class="sidebar-footer">
        @if (!collapsed()) {
          <div class="user-info">
            <div class="user-avatar"><span>JD</span></div>
            <div class="user-details">
              <span class="user-name">John Doe</span>
              <span class="user-role">Administrator</span>
            </div>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar { position: fixed; top: 0; left: 0; width: var(--sidebar-width-expanded); height: 100vh; background: linear-gradient(180deg, var(--sidebar-gradient-start) 0%, var(--sidebar-gradient-mid) 50%, var(--sidebar-gradient-end) 100%); display: flex; flex-direction: column; z-index: var(--z-fixed); transition: width var(--transition-normal); overflow: hidden; }
    .sidebar.collapsed { width: var(--sidebar-width-collapsed); }
    .sidebar.collapsed .logo-text, .sidebar.collapsed .nav-label, .sidebar.collapsed .nav-chevron, .sidebar.collapsed .user-info { display: none; }
    .sidebar.collapsed .nav-item { justify-content: center; padding: 0; }
    .sidebar-logo { display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-4); border-bottom: 1px solid rgba(white, 0.1); }
    .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .logo-text { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: white; letter-spacing: -0.02em; }
    .decorative-shapes { position: absolute; top: 0; right: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
    .shape { position: absolute; border-radius: 50%; opacity: 0.1; }
    .shape-1 { width: 200px; height: 200px; background: var(--primary-blue); top: -80px; right: -80px; }
    .shape-2 { width: 150px; height: 150px; background: white; bottom: 20%; right: -50px; }
    .shape-3 { width: 100px; height: 100px; background: var(--primary-hover); bottom: -30px; left: -30px; }
    .sidebar-nav { flex: 1; padding: var(--spacing-3); overflow-y: auto; }
    .nav-section { margin-bottom: var(--spacing-1); }
    .nav-item { display: flex; align-items: center; gap: var(--spacing-3); height: 44px; padding: 0 var(--spacing-4); color: rgba(white,0.8); border-radius: var(--radius-lg); cursor: pointer; transition: all var(--transition-normal); text-decoration: none; position: relative; }
    .nav-item:hover { background: rgba(white,0.1); color: white; }
    .nav-item.active { background: rgba(white,0.15); color: white; }
    .nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 24px; background: var(--primary-blue); border-radius: 0 4px 4px 0; }
    .nav-item.has-children { justify-content: flex-start; }
    .nav-icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .nav-icon :deep(svg) { width: 20px; height: 20px; }
    .nav-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); white-space: nowrap; }
    .nav-chevron { margin-left: auto; transition: transform var(--transition-normal); }
    .nav-chevron.expanded { transform: rotate(180deg); }
    .nav-children { padding-left: var(--spacing-5); animation: slideDown 200ms ease; }
    .child-item { height: 40px; font-size: var(--font-size-xs); }
    .sidebar-footer { padding: var(--spacing-3); border-top: 1px solid rgba(white,0.1); }
    .user-info { display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-2) var(--spacing-3); background: rgba(white,0.1); border-radius: var(--radius-lg); }
    .user-avatar { width: 36px; height: 36px; background: var(--primary-blue); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: white; }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: white; }
    .user-role { font-size: var(--font-size-xs); color: rgba(white,0.6); }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 1024px) { .sidebar { width: var(--sidebar-width-collapsed); } }
  `]
})
export class SidebarComponent {
  collapsed = input(false);
  navigate = output<string>();
  activeRoute = signal('/dashboard');
  expandedMenus = signal(new Set<string>());
  navItems: NavItem[] = [
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>', label: 'Dashboard', route: '/dashboard' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>', label: 'Assets',
      children: [
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', label: 'All Assets', route: '/assets' },
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>', label: 'Requests', route: '/requests' },
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', label: 'Tickets', route: '/tickets' },
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', label: 'Reports', route: '/reports' },
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>', label: 'IT Clearance', route: '/it-clearance' }
      ]
    },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>', label: 'My Profile', route: '/profile' },
    // { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83"/></svg>', label: 'Administration',
    //   children: [
    //     { icon: '', label: 'User Management', route: '/administration/users' },
    //     { icon: '', label: 'Organization Setup', route: '/administration/organization' },
    //     { icon: '', label: 'Roles', route: '/administration/roles' },
    //     { icon: '', label: 'Permissions', route: '/administration/permissions' },
    //     { icon: '', label: 'Departments', route: '/administration/departments' },
    //     { icon: '', label: 'Designations', route: '/administration/designations' },
    //     { icon: '', label: 'Levels', route: '/administration/levels' }
    //   ]
    // },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>', label: 'Leaves', route: '/leaves' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', label: 'Workforce',
      children: [
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>', label: 'Employees', route: '/workforce/employees' },
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>', label: 'Onboarding', route: '/workforce/onboarding' },
        { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>', label: 'Offboarding', route: '/workforce/offboarding' }
      ]
    }
  ];
  toggleMenu(label: string): void {
    const current = new Set(this.expandedMenus());
    if (current.has(label)) current.delete(label);
    else current.add(label);
    this.expandedMenus.set(current);
  }
}