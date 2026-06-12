import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ModuleAdminCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  route: string;
}

interface ModuleConfig {
  name: string;
  subtitle: string;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-module-administration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-admin-page">
      <div class="page-header">
        <button class="back-btn" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Hub
        </button>
        <div class="header-content">
          <div class="header-icon" [style.background]="moduleConfig.iconBg">
            <span [innerHTML]="moduleConfig.icon"></span>
          </div>
          <div class="header-text">
            <h1 class="header-title">{{ moduleConfig.name }}</h1>
            <p class="header-subtitle">{{ moduleConfig.subtitle }}</p>
          </div>
        </div>
      </div>

      <div class="admin-cards-grid">
        @for (card of adminCards; track card.id) {
          <div class="admin-card" (click)="navigateTo(card)">
            <div class="admin-card-icon" [style.background]="card.iconBg">
              <span [innerHTML]="card.icon"></span>
            </div>
            <div class="admin-card-content">
              <h3 class="admin-card-name">{{ card.name }}</h3>
              <p class="admin-card-description">{{ card.description }}</p>
            </div>
            <div class="admin-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .module-admin-page {
      padding: var(--spacing-8);
      max-width: 1000px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
    }

    .header-icon :deep(svg) {
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

    .admin-cards-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-5);
    }

    .admin-card {
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: 20px;
      padding: var(--spacing-7);
      cursor: pointer;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
      position: relative;
      overflow: hidden;
    }

    .admin-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 4px;
      background: var(--card-accent);
      transform: scaleY(0);
      transition: transform 300ms ease;
    }

    .admin-card:hover {
      transform: translateX(8px);
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.1);
      border-color: rgba(99, 102, 241, 0.2);
    }

    .admin-card:hover::before {
      transform: scaleY(1);
    }

    .admin-card:hover .admin-card-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .admin-card-icon {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transition: transform 300ms ease;
    }

    .admin-card:hover .admin-card-icon {
      transform: scale(1.05);
    }

    .admin-card-icon :deep(svg) {
      width: 32px;
      height: 32px;
      color: white;
    }

    .admin-card-content {
      flex: 1;
    }

    .admin-card-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-2) 0;
    }

    .admin-card-description {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .admin-card-arrow {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--bg-main);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 300ms ease;
      color: var(--primary-blue);
    }

    .admin-card:hover .admin-card-arrow {
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: white;
    }

    @media (max-width: 768px) {
      .module-admin-page {
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

      .header-icon :deep(svg) {
        width: 28px;
        height: 28px;
      }

      .header-title {
        font-size: 24px;
      }

      .admin-card {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }

      .admin-card-arrow {
        display: none;
      }
    }
  `]
})
export class ModuleAdministrationComponent {
  moduleType = input<string>('workforce');

  constructor(private router: Router) {}

  get moduleConfig(): ModuleConfig {
    const configs: Record<string, ModuleConfig> = {
      workforce: {
        name: 'Workforce Management',
        subtitle: 'Configure workforce management settings and access permissions',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        iconBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
      },
      leave: {
        name: 'Leave Management',
        subtitle: 'Configure leave management settings and access permissions',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="16" y1="2" x2="16" y2="4"/></svg>',
        iconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
      },
      asset: {
        name: 'Asset Management',
        subtitle: 'Configure asset management settings and access permissions',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        iconBg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
      }
    };
    return configs[this.moduleType()] || configs['workforce'];
  }

  get adminCards(): ModuleAdminCard[] {
    const type = this.moduleType();
    return [
      {
        id: 'configuration',
        name: 'Configuration',
        description: 'Configure module settings and master data',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        iconBg: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        route: `/administration/${type}/configuration`
      },
      {
        id: 'permissions',
        name: 'Permissions',
        description: 'Manage module-specific access and permissions',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        iconBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        route: `/administration/${type}/permissions`
      }
    ];
  }

  navigateTo(card: ModuleAdminCard): void {
    this.router.navigate([card.route]);
  }

  goBack(): void {
    this.router.navigate(['/administration']);
  }
}