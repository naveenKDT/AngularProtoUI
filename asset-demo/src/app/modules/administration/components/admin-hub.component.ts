import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ModuleCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  route: string;
  purchased: boolean;
}

@Component({
  selector: 'app-admin-hub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-hub">
      <div class="hub-header">
        <div class="hub-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div class="hub-title-section">
          <h1 class="hub-title">Administration Hub</h1>
          <p class="hub-subtitle">Manage your organization's modules and settings</p>
        </div>
      </div>

      <div class="modules-grid">
        @for (module of purchasedModules(); track module.id) {
          <div class="module-card" (click)="navigateToModule(module)">
            <div class="module-icon" [style.background]="module.iconBg">
              <span [innerHTML]="module.icon"></span>
            </div>
            <h3 class="module-name">{{ module.name }}</h3>
            <p class="module-description">{{ module.description }}</p>
            <div class="module-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        }
      </div>

      @if (unpurchasedModules().length > 0) {
        <div class="unavailable-section">
          <h2 class="section-title">Available for Purchase</h2>
          <div class="modules-grid unavailable">
            @for (module of unpurchasedModules(); track module.id) {
              <div class="module-card disabled">
                <div class="module-icon" [style.background]="module.iconBg">
                  <span [innerHTML]="module.icon"></span>
                </div>
                <h3 class="module-name">{{ module.name }}</h3>
                <p class="module-description">{{ module.description }}</p>
                <div class="locked-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Not Purchased
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-hub {
      padding: var(--spacing-8);
      max-width: 1400px;
      margin: 0 auto;
      animation: fadeIn 400ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hub-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-10);
      padding-bottom: var(--spacing-8);
      border-bottom: 1px solid var(--bg-border);
    }

    .hub-icon {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
      flex-shrink: 0;
    }

    .hub-icon svg {
      width: 40px;
      height: 40px;
      color: white;
    }

    .hub-title-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .hub-title {
      font-size: 36px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hub-subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      margin: 0;
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-6);
    }

    .module-card {
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: 24px;
      padding: var(--spacing-8);
      cursor: pointer;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .module-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      transform: scaleX(0);
      transition: transform 300ms ease;
    }

    .module-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .module-card:hover::before {
      transform: scaleX(1);
    }

    .module-card:hover .module-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .module-card.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .module-card.disabled:hover {
      transform: none;
      box-shadow: none;
      border-color: var(--bg-border);
    }

    .module-icon {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-5);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: transform 300ms ease;
    }

    .module-card:hover .module-icon {
      transform: scale(1.05);
    }

    .module-icon :deep(svg) {
      width: 32px;
      height: 32px;
      color: white;
    }

    .module-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-3) 0;
      letter-spacing: -0.01em;
    }

    .module-description {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    .module-arrow {
      position: absolute;
      bottom: var(--spacing-8);
      right: var(--spacing-8);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 300ms ease;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }

    .module-arrow svg {
      color: white;
    }

    .locked-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background: var(--bg-main);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-top: var(--spacing-4);
    }

    .unavailable-section {
      margin-top: var(--spacing-12);
      padding-top: var(--spacing-8);
      border-top: 1px solid var(--bg-border);
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-6) 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modules-grid.unavailable {
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .admin-hub {
        padding: var(--spacing-5);
      }

      .hub-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-4);
      }

      .hub-icon {
        width: 64px;
        height: 64px;
      }

      .hub-icon svg {
        width: 32px;
        height: 32px;
      }

      .hub-title {
        font-size: 28px;
      }

      .modules-grid {
        grid-template-columns: 1fr;
      }

      .module-card {
        padding: var(--spacing-6);
      }
    }
  `]
})
export class AdminHubComponent {
  constructor(private router: Router) {}

  modules = signal<ModuleCard[]>([
    {
      id: 'organization',
      name: 'Manage Organization',
      description: 'Manage company structure, roles, permissions and organization setup.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      iconBg: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      route: '/administration/organization',
      purchased: true
    },
    {
      id: 'workforce',
      name: 'Workforce Management',
      description: 'Module configuration and permissions.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      iconBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      route: '/administration/workforce',
      purchased: true
    },
    {
      id: 'leave',
      name: 'Leave Management',
      description: 'Module configuration and permissions.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" y1="2" x2="8" y2="4"/><line x1="16" y1="2" x2="16" y2="4"/></svg>',
      iconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      route: '/administration/leave',
      purchased: true
    },
    {
      id: 'asset',
      name: 'Asset Management',
      description: 'Module configuration and permissions.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      iconBg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      route: '/administration/asset',
      purchased: true
    },
    {
      id: 'payroll',
      name: 'Payroll',
      description: 'Manage payroll, salaries, and compensation.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      iconBg: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      route: '/administration/payroll',
      purchased: false
    }
  ]);

  purchasedModules = signal<ModuleCard[]>(this.modules().filter(m => m.purchased));
  unpurchasedModules = signal<ModuleCard[]>(this.modules().filter(m => !m.purchased));

  navigateToModule(module: ModuleCard): void {
    if (module.purchased) {
      this.router.navigate([module.route]);
    }
  }
}