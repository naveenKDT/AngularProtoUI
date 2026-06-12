import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface OrganizationTab {
  id: string;
  name: string;
  route: string;
}

@Component({
  selector: 'app-manage-organization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="manage-org-page">

      <button class="back-btn" (click)="goBack()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Administration
      </button>

      <div class="page-header">
        <h1 class="header-title">Manage Organization</h1>
        <p class="header-subtitle">
          Configure organization structure, roles and permissions
        </p>
      </div>

      <div class="tabs-container">
        @for (tab of organizationTabs; track tab.id) {
          <button
            class="tab-button"
            [class.active]="selectedTab() === tab.id"
            (click)="selectTab(tab)">
            {{ tab.name }}
          </button>
        }
      </div>

      <div class="content-container">

        @switch (selectedTab()) {

          @case ('organisation-setup') {
            <div class="content-header">
              <h2>Organisation Setup</h2>
              <p>Manage company information and organization configuration.</p>
            </div>
          }

          @case ('departments') {
            <div class="content-header">
              <h2>Departments</h2>
              <p>Manage departments and reporting hierarchy.</p>
            </div>
          }

          @case ('designations') {
            <div class="content-header">
              <h2>Designations</h2>
              <p>Manage employee designations and titles.</p>
            </div>
          }

          @case ('levels') {
            <div class="content-header">
              <h2>Levels</h2>
              <p>Manage employee levels and career hierarchy.</p>
            </div>
          }

          @case ('roles') {
            <div class="content-header">
              <h2>Roles</h2>
              <p>Manage system roles and responsibilities.</p>
            </div>
          }

          @case ('permissions') {
            <div class="content-header">
              <h2>Permissions</h2>
              <p>Manage role-based access permissions.</p>
            </div>
          }

        }

        <div class="placeholder-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 20h9"/>
            <path d="M12 4h9"/>
            <path d="M4 9h16"/>
            <path d="M4 15h16"/>
          </svg>

          <h3>{{ getSelectedTabName() }}</h3>

          <p>
            Place your {{ getSelectedTabName() }} component/content here.
          </p>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .manage-org-page {
      padding: 20px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* =====================================
       BACK BUTTON
    ===================================== */

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;

      color: #64748b;
      font-size: 13px;
      font-weight: 500;

      margin-bottom: 20px;

      transition: all .2s ease;
    }

    .back-btn:hover {
      color: #0f172a;
    }

    /* =====================================
       HEADER
    ===================================== */

    .page-header {
      margin-bottom: 24px;
    }

    .header-title {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    .header-subtitle {
      margin-top: 6px;
      font-size: 13px;
      color: #64748b;
    }

    /* =====================================
       TABS
    ===================================== */

    .tabs-container {
      display: flex;
      align-items: center;
      gap: 28px;

      border-bottom: 1px solid #e2e8f0;

      margin-bottom: 24px;

      overflow-x: auto;
      overflow-y: hidden;

      scrollbar-width: none;
    }

    .tabs-container::-webkit-scrollbar {
      display: none;
    }

    .tab-button {
      position: relative;

      background: transparent;
      border: none;

      padding: 12px 0;

      cursor: pointer;
      white-space: nowrap;

      color: #64748b;
      font-size: 14px;
      font-weight: 500;

      transition: all .2s ease;
    }

    .tab-button:hover {
      color: #0f172a;
    }

    .tab-button.active {
      color: #4f46e5;
      font-weight: 600;
    }

    .tab-button.active::after {
      content: '';

      position: absolute;

      left: 0;
      right: 0;
      bottom: -1px;

      height: 2px;

      background: #4f46e5;
      border-radius: 999px;
    }

    /* =====================================
       CONTENT
    ===================================== */

    .content-container {
      min-height: 500px;
    }

    .content-header {
      margin-bottom: 20px;
    }

    .content-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }

    .content-header p {
      margin-top: 4px;
      font-size: 13px;
      color: #64748b;
    }

    .placeholder-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;

      padding: 40px;

      text-align: center;
    }

    .placeholder-card svg {
      width: 40px;
      height: 40px;

      color: #94a3b8;

      margin-bottom: 12px;
    }

    .placeholder-card h3 {
      margin: 0 0 8px;

      font-size: 18px;
      font-weight: 600;

      color: #0f172a;
    }

    .placeholder-card p {
      margin: 0;

      color: #64748b;
      font-size: 14px;
    }

    /* =====================================
       RESPONSIVE
    ===================================== */

    @media (max-width: 768px) {

      .manage-org-page {
        padding: 16px;
      }

      .header-title {
        font-size: 22px;
      }

      .tabs-container {
        gap: 20px;
      }

      .tab-button {
        font-size: 13px;
      }

      .placeholder-card {
        padding: 24px;
      }
    }
  `]
})
export class ManageOrganizationComponent {

  constructor(private router: Router) {}

  selectedTab = signal('organisation-setup');

  organizationTabs: OrganizationTab[] = [
    {
      id: 'organisation-setup',
      name: 'Organisation Setup',
      route: '/administration/organisation-setup'
    },
    {
      id: 'departments',
      name: 'Departments',
      route: '/administration/departments'
    },
    {
      id: 'designations',
      name: 'Designations',
      route: '/administration/designations'
    },
    {
      id: 'levels',
      name: 'Levels',
      route: '/administration/levels'
    },
    {
      id: 'roles',
      name: 'Roles',
      route: '/administration/roles'
    },
    {
      id: 'permissions',
      name: 'Permissions',
      route: '/administration/permissions'
    }
  ];

  selectTab(tab: OrganizationTab): void {
    this.selectedTab.set(tab.id);

    // Uncomment if each tab should navigate to separate routes
    // this.router.navigate([tab.route]);
  }

  getSelectedTabName(): string {
    return (
      this.organizationTabs.find(
        x => x.id === this.selectedTab()
      )?.name ?? ''
    );
  }

  goBack(): void {
    this.router.navigate(['/administration']);
  }
}