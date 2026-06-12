import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <button class="toggle-btn" (click)="toggleSidebar.emit()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" class="search-input" placeholder="Search..." />
        <span class="search-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span>
      </div>
      <div class="header-right">
        <button class="admin-btn" title="Administration" (click)="navigateToAdmin()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="admin-label">Administration</span>
        </button>
        <button class="icon-btn" title="Help">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
        <button class="icon-btn notification-btn" title="Notifications" (click)="toggleNotifications()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>
        <div class="user-profile" (click)="toggleUserMenu()">
          <div class="user-avatar"><span>JD</span></div>
          <div class="user-info">
            <span class="user-name">John Doe</span>
            <span class="user-role">Admin</span>
          </div>
          <svg class="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="userMenuOpen()">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        @if (userMenuOpen()) {
          <div class="dropdown-menu user-dropdown">
            <div class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg><span>My Profile</span>
            </div>
            <div class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg><span>Settings</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item text-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg><span>Sign Out</span>
            </div>
          </div>
        }
        @if (notificationsOpen()) {
          <div class="dropdown-menu notifications-dropdown">
            <div class="dropdown-header"><span>Notifications</span><button class="mark-read-btn">Mark all read</button></div>
            <div class="notification-list">
              <div class="notification-item">
                <div class="notification-icon success"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div class="notification-content"><p class="notification-text">New employee onboarded successfully</p><span class="notification-time">2 min ago</span></div>
              </div>
              <div class="notification-item">
                <div class="notification-icon warning"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="notification-content"><p class="notification-text">Leave request pending approval</p><span class="notification-time">15 min ago</span></div>
              </div>
            </div>
            <div class="dropdown-footer"><a href="#">View all</a></div>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .header { position: fixed; top: 0; left: var(--sidebar-width-expanded); right: 0; height: var(--header-height); background: var(--bg-card); border-bottom: 1px solid var(--bg-border); display: flex; align-items: center; padding: 0 var(--spacing-5); gap: var(--spacing-4); z-index: var(--z-sticky); box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: left var(--transition-normal); }
    .toggle-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(229,234,243,0.5); border-radius: var(--radius-lg); color: var(--text-secondary); border: none; cursor: pointer; transition: all var(--transition-normal); }
    .toggle-btn:hover { background: var(--bg-border); color: var(--text-primary); }
    .admin-btn { display: flex; align-items: center; gap: var(--spacing-2); padding: var(--spacing-2) var(--spacing-4); background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; border: none; border-radius: var(--radius-xl); cursor: pointer; transition: all var(--transition-normal); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3); }
    .admin-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4); }
    .admin-label { margin-left: var(--spacing-1); }
    .search-box { flex: 1; max-width: 360px; height: 40px; display: flex; align-items: center; gap: var(--spacing-2); background: var(--bg-card); border: 1px solid var(--bg-border); border-radius: var(--radius-xl); padding: 0 var(--spacing-4); transition: all var(--transition-normal); }
    .search-box:focus-within { border-color: var(--primary-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .search-icon { color: var(--text-secondary); flex-shrink: 0; }
    .search-input { flex: 1; border: none; outline: none; font-size: var(--font-size-sm); color: var(--text-primary); background: transparent; }
    .search-input::placeholder { color: var(--text-secondary); }
    .search-shortcut { display: flex; gap: var(--spacing-1); flex-shrink: 0; }
    .search-shortcut kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 20px; padding: 0 var(--spacing-1); background: var(--bg-main); border: 1px solid var(--bg-border); border-radius: 4px; font-size: 10px; font-weight: var(--font-weight-medium); color: var(--text-secondary); }
    .header-right { display: flex; align-items: center; gap: var(--spacing-2); margin-left: auto; position: relative; }
    .icon-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: transparent; color: var(--text-secondary); position: relative; border: none; cursor: pointer; transition: all var(--transition-normal); }
    .icon-btn:hover { background: rgba(229,234,243,0.5); color: var(--text-primary); }
    .notification-badge { position: absolute; top: 6px; right: 6px; min-width: 16px; height: 16px; background: var(--danger); color: white; font-size: 10px; font-weight: var(--font-weight-semibold); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; padding: 0 4px; }
    .user-profile { display: flex; align-items: center; gap: var(--spacing-2); padding: var(--spacing-1) var(--spacing-3); background: transparent; border-radius: var(--radius-lg); cursor: pointer; transition: background var(--transition-fast); }
    .user-profile:hover { background: rgba(229,234,243,0.5); }
    .user-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: white; }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); }
    .user-role { font-size: var(--font-size-xs); color: var(--text-secondary); }
    .dropdown-arrow { color: var(--text-secondary); transition: transform var(--transition-normal); }
    .dropdown-arrow.rotated { transform: rotate(180deg); }
    .dropdown-menu { position: absolute; top: calc(100% + 8px); right: 0; background: var(--bg-card); border-radius: var(--radius-2xl); box-shadow: var(--shadow-dropdown); border: 1px solid var(--bg-border); animation: slideDown 200ms ease; z-index: var(--z-dropdown); }
    .user-dropdown { min-width: 200px; padding: var(--spacing-2); }
    .dropdown-item { display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-lg); cursor: pointer; transition: background var(--transition-fast); color: var(--text-primary); font-size: var(--font-size-sm); }
    .dropdown-item:hover { background: rgba(59,130,246,0.05); }
    .dropdown-item.text-danger { color: var(--danger); }
    .dropdown-item svg { color: var(--text-secondary); flex-shrink: 0; }
    .dropdown-item.text-danger svg { color: var(--danger); }
    .dropdown-divider { height: 1px; background: var(--bg-border); margin: var(--spacing-2) 0; }
    .notifications-dropdown { width: 320px; padding: 0; }
    .dropdown-header { display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-4) var(--spacing-5); border-bottom: 1px solid var(--bg-border); }
    .dropdown-header span { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary); }
    .mark-read-btn { background: none; border: none; color: var(--primary-blue); font-size: var(--font-size-sm); cursor: pointer; }
    .mark-read-btn:hover { text-decoration: underline; }
    .notification-list { max-height: 300px; overflow-y: auto; }
    .notification-item { display: flex; gap: var(--spacing-3); padding: var(--spacing-4) var(--spacing-5); border-bottom: 1px solid var(--bg-border); cursor: pointer; transition: background var(--transition-fast); }
    .notification-item:last-child { border-bottom: none; }
    .notification-icon { width: 36px; height: 36px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .notification-icon.success { background: var(--success-light); color: var(--success); }
    .notification-icon.warning { background: var(--warning-light); color: var(--warning); }
    .notification-icon.info { background: var(--info-light); color: var(--info); }
    .notification-content { flex: 1; min-width: 0; }
    .notification-text { font-size: var(--font-size-sm); color: var(--text-primary); margin: 0 0 var(--spacing-1) 0; }
    .notification-time { font-size: var(--font-size-xs); color: var(--text-secondary); }
    .dropdown-footer { padding: var(--spacing-3) var(--spacing-5); border-top: 1px solid var(--bg-border); text-align: center; }
    .dropdown-footer a { font-size: var(--font-size-sm); color: var(--primary-blue); text-decoration: none; }
    .dropdown-footer a:hover { text-decoration: underline; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 1280px) { .user-info, .dropdown-arrow, .search-shortcut { display: none; } .user-profile { padding: 0; } }
    @media (max-width: 1024px) { .header { left: var(--sidebar-width-collapsed); } .search-box { max-width: 280px; } .search-shortcut { display: none; } }
    @media (max-width: 768px) { .header { left: 0; padding: 0 var(--spacing-4); } .search-box { display: none; } }
  `]
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  userMenuOpen = signal(false);
  notificationsOpen = signal(false);

  constructor(private router: Router) {}

  navigateToAdmin(): void {
    this.router.navigate(['/administration']);
  }

  toggleUserMenu(): void { this.userMenuOpen.update(v => !v); this.notificationsOpen.set(false); }
  toggleNotifications(): void { this.notificationsOpen.update(v => !v); this.userMenuOpen.set(false); }
}