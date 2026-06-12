import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface OrganizationCard {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  route: string;
  count?: number;
}

@Component({
  selector: 'app-manage-organization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="manage-org-page">
      <div class="page-header">
        <button class="back-btn" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Hub
        </button>
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="header-title">Manage Organization</h1>
            <p class="header-subtitle">Configure your organization's structure, roles, and permissions</p>
          </div>
        </div>
      </div>

      <div class="org-cards-grid">
        @for (card of organizationCards; track card.id) {
          <div class="org-card" (click)="navigateTo(card)">
            <div class="org-card-icon" [style.background]="card.iconBg">
              <span [innerHTML]="card.icon"></span>
            </div>
            <h3 class="org-card-name">{{ card.name }}</h3>
            @if (card.count !== undefined) {
              <span class="org-card-count">{{ card.count }} items</span>
            }
            <div class="org-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .manage-org-page {
      padding: var(--spacing-8);
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 400ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      margin-bottom: var(--spacing-10);
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background: transparent;
      border: 1px solid var(--bg-border);
      border-radius: 100px;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms ease;
      margin-bottom: var(--spacing-6);
    }

    .back-btn:hover {
      background: var(--bg-main);
      color: var(--text-primary);
      border-color: var(--text-secondary);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
    }

    .header-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25);
      flex-shrink: 0;
    }

    .header-icon svg {
      width: 36px;
      height: 36px;
      color: white;
    }

    .header-text {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .header-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      font-size: 15px;
      color: var(--text-secondary);
      margin: 0;
    }

    .org-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-5);
    }

    .org-card {
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: 20px;
      padding: var(--spacing-7);
      cursor: pointer;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .org-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--card-accent, linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%));
      border-radius: 20px 20px 0 0;
      transform: scaleX(0);
      transition: transform 300ms ease;
    }

    .org-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(15, 23, 42, 0.1);
      border-color: rgba(99, 102, 241, 0.2);
    }

    .org-card:hover::before {
      transform: scaleX(1);
    }

    .org-card:hover .org-card-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .org-card-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-5);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .org-card-icon :deep(svg) {
      width: 28px;
      height: 28px;
      color: white;
    }

    .org-card-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-2) 0;
    }

    .org-card-count {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: auto;
    }

    .org-card-arrow {
      position: absolute;
      top: 50%;
      right: var(--spacing-5);
      transform: translateY(-50%) translateX(-10px);
      opacity: 0;
      transition: all 300ms ease;
      color: var(--primary-blue);
    }

    @media (max-width: 768px) {
      .manage-org-page {
        padding: var(--spacing-5);
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-icon {
        width: 56px;
        height: 56px;
      }

      .header-icon svg {
        width: 28px;
        height: 28px;
      }

      .header-title {
        font-size: 24px;
      }

      .org-cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ManageOrganizationComponent {
  constructor(private router: Router) {}

  organizationCards: OrganizationCard[] = [
    {
      id: 'organisation-setup',
      name: 'Organisation Setup',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      iconBg: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      route: '/administration/organisation-setup',
      count: 1
    },
    {
      id: 'departments',
      name: 'Departments',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      iconBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      route: '/administration/departments',
      count: 12
    },
    {
      id: 'designations',
      name: 'Designations',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
      iconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      route: '/administration/designations',
      count: 24
    },
    {
      id: 'levels',
      name: 'Levels',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      iconBg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      route: '/administration/levels',
      count: 8
    },
    {
      id: 'roles',
      name: 'Roles',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      iconBg: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      route: '/administration/roles',
      count: 8
    },
    {
      id: 'permissions',
      name: 'Permissions',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      iconBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      route: '/administration/permissions',
      count: 24
    }
  ];

  navigateTo(card: OrganizationCard): void {
    this.router.navigate([card.route]);
  }

  goBack(): void {
    this.router.navigate(['/administration']);
  }
}