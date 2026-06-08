import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <!-- Toggle Button -->
      <button class="toggle-btn" (click)="toggleSidebar.emit()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <!-- Search Box -->
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search anything..."
        />
        <span class="search-shortcut">
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </span>
      </div>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Help Icon -->
        <button class="icon-btn" title="Help">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <!-- Notifications -->
        <button class="icon-btn notification-btn" title="Notifications" (click)="toggleNotifications()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>

        <!-- User Profile -->
        <div class="user-profile" (click)="toggleUserMenu()">
          <div class="user-avatar">
            <span>JD</span>
          </div>
          <div class="user-info">
            <span class="user-name">John Doe</span>
            <span class="user-role">Admin</span>
          </div>
          <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="userMenuOpen()">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <!-- User Dropdown Menu -->
        @if (userMenuOpen()) {
          <div class="dropdown-menu user-dropdown">
            <div class="dropdown-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>My Profile</span>
            </div>
            <div class="dropdown-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Settings</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item text-danger">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Sign Out</span>
            </div>
          </div>
        }

        <!-- Notifications Dropdown -->
        @if (notificationsOpen()) {
          <div class="dropdown-menu notifications-dropdown">
            <div class="dropdown-header">
              <span>Notifications</span>
              <button class="mark-read-btn">Mark all read</button>
            </div>
            <div class="notification-list">
              <div class="notification-item">
                <div class="notification-icon success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div class="notification-content">
                  <p class="notification-text">New employee onboarded successfully</p>
                  <span class="notification-time">2 minutes ago</span>
                </div>
              </div>
              <div class="notification-item">
                <div class="notification-icon warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div class="notification-content">
                  <p class="notification-text">Leave request pending approval</p>
                  <span class="notification-time">15 minutes ago</span>
                </div>
              </div>
              <div class="notification-item">
                <div class="notification-icon info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                <div class="notification-content">
                  <p class="notification-text">System update available</p>
                  <span class="notification-time">1 hour ago</span>
                </div>
              </div>
            </div>
            <div class="dropdown-footer">
              <a href="#">View all notifications</a>
            </div>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
        .header {
      position: fixed;
      top: 0;
      left: var(--sidebar-width-expanded);
      right: 0;
      height: var(--header-height);
      background: var(--bg-card);
      border-bottom: 1px solid var(--bg-border);
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-8);
      gap: var(--spacing-6);
      z-index: var(--z-sticky);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: left var(--transition-normal);
    }

    .toggle-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(229, 234, 243, 0.5);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      border: none;
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: var(--bg-border);
        color: var(--text-primary);
      }
    }

    .search-box {
      flex: 1;
      max-width: 450px;
      height: 48px;
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-2xl);
      padding: 0 var(--spacing-5);
      transition: all var(--transition-normal);

      &:focus-within {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(var(--primary-blue), 0.1);
      }
    }

    .search-icon {
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: transparent;

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .search-shortcut {
      display: flex;
      gap: var(--spacing-1);
      flex-shrink: 0;

      kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 22px;
        padding: 0 var(--spacing-2);
        background: var(--bg-main);
        border: 1px solid var(--bg-border);
        border-radius: 6px;
        font-size: 11px;
        font-weight: var(--font-weight-medium);
        color: var(--text-secondary);
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-left: auto;
      position: relative;
    }

    .icon-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: var(--text-secondary);
      position: relative;
      border: none;
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: rgba(229, 234, 243, 0.5);
        color: var(--text-primary);
      }
    }

    .notification-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      min-width: 18px;
      height: 18px;
      background: var(--danger);
      color: white;
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-2) var(--spacing-4);
      background: transparent;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover {
        background: rgba(var(--bg-border), 0.5);
      }
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .dropdown-arrow {
      color: var(--text-secondary);
      transition: transform var(--transition-normal);

      &.rotated {
        transform: rotate(180deg);
      }
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-card);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-dropdown);
      border: 1px solid var(--bg-border);
      animation: slideDown 200ms ease;
      z-index: var(--z-dropdown);
    }

    .user-dropdown {
      min-width: 200px;
      padding: var(--spacing-2);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: background var(--transition-fast);
      color: var(--text-primary);
      font-size: var(--font-size-sm);

      &:hover {
        background: rgba(var(--primary-blue), 0.05);
      }

      &.text-danger {
        color: var(--danger);
      }

      svg {
        color: var(--text-secondary);
        flex-shrink: 0;
      }

      &.text-danger svg {
        color: var(--danger);
      }
    }

    .dropdown-divider {
      height: 1px;
      background: var(--bg-border);
      margin: var(--spacing-2) 0;
    }

    .notifications-dropdown {
      width: 360px;
      padding: 0;
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4) var(--spacing-5);
      border-bottom: 1px solid var(--bg-border);

      span {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
      }
    }

    .mark-read-btn {
      background: none;
      border: none;
      color: var(--primary-blue);
      font-size: var(--font-size-sm);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: var(--spacing-3);
      padding: var(--spacing-4) var(--spacing-5);
      border-bottom: 1px solid var(--bg-border);
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover {
        background: rgba(var(--primary-blue), 0.03);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.success {
        background: var(--success)-light;
        color: var(--success);
      }

      &.warning {
        background: var(--warning)-light;
        color: var(--warning);
      }

      &.info {
        background: var(--info)-light;
        color: var(--info);
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-text {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-1) 0;
    }

    .notification-time {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .dropdown-footer {
      padding: var(--spacing-3) var(--spacing-5);
      border-top: 1px solid var(--bg-border);
      text-align: center;

      a {
        font-size: var(--font-size-sm);
        color: var(--primary-blue);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 1024px) {
      .header {
        left: var(--sidebar-width-collapsed);
      }

      .search-box {
        max-width: 300px;
      }

      .search-shortcut {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .header {
        left: 0;
        padding: 0 var(--spacing-4);
      }

      .search-box {
        display: none;
      }

      .user-info {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  toggleSidebar = output<void>();

  userMenuOpen = signal(false);
  notificationsOpen = signal(false);

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
    this.notificationsOpen.set(false);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
    this.userMenuOpen.set(false);
  }
}