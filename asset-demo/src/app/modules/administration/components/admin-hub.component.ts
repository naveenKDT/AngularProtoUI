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
        <h1 class="hub-title">Administration</h1>
          <p class="hub-subtitle">
            Configure organization structure and HRMS modules
          </p>
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
  padding: 20px 24px;
  max-width: 1280px;
  margin: 0 auto;
}

/* ===========================
   HEADER
=========================== */

.hub-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.hub-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg,#6366F1,#8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hub-icon svg {
  width: 22px;
  height: 22px;
  color: white;
}

.hub-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.hub-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

/* ===========================
   GRID
=========================== */

.modules-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* ===========================
   CARD
=========================== */

.module-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  min-height: 160px;
  cursor: pointer;
  transition: all .25s ease;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,.08);
  border-color: #c7d2fe;
}

.module-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    #6366F1,
    #8B5CF6
  );
  border-radius: 14px 14px 0 0;
  opacity: 0;
  transition: opacity .25s;
}

.module-card:hover::before {
  opacity: 1;
}

/* ===========================
   ICON
=========================== */

.module-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.module-icon :deep(svg) {
  width: 18px;
  height: 18px;
  color: white;
}

/* ===========================
   CONTENT
=========================== */

.module-name {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
}

.module-description {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

/* ===========================
   ARROW
=========================== */

.module-arrow {
  position: absolute;
  right: 16px;
  bottom: 16px;

  width: 28px;
  height: 28px;

  border-radius: 8px;
  background: #f8fafc;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transform: translateX(-4px);

  transition: all .25s ease;
}

.module-card:hover .module-arrow {
  opacity: 1;
  transform: translateX(0);
}

.module-arrow svg {
  width: 14px;
  height: 14px;
  color: #475569;
}

/* ===========================
   DISABLED
=========================== */

.module-card.disabled {
  opacity: .65;
  cursor: not-allowed;
}

.module-card.disabled:hover {
  transform: none;
  box-shadow: none;
}

.locked-badge {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

/* ===========================
   PURCHASE SECTION
=========================== */

.unavailable-section {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #64748b;
  margin-bottom: 16px;
}

/* ===========================
   RESPONSIVE
=========================== */

@media (max-width: 1200px) {
  .modules-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-hub {
    padding: 16px;
  }

  .hub-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .hub-title {
    font-size: 20px;
  }
}
`]
})
export class AdminHubComponent {
  constructor(private router: Router) { }

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