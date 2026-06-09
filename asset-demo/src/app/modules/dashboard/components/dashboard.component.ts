import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, BreadcrumbComponent, StatCardComponent, BadgeComponent, CardComponent } from '../../shared/components';

interface QuickAction {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
}

interface HierarchyItem {
  title: string;
  level: string;
  levelColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, StatCardComponent, BadgeComponent, CardComponent],
  template: `
    <div class="dashboard">
      <app-breadcrumb [items]="breadcrumbs" />
      
      <app-page-header
        title="Dashboard"
        description="Welcome back! Here's what's happening with your organization."
        [icon]="pageIcon"
        iconBg="#EFF6FF"
      >
        <div slot="actions">
          <button class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New
          </button>
        </div>
      </app-page-header>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <app-stat-card
          [icon]="departmentIcon"
          iconBg="#EFF6FF"
          value="12"
          label="Departments"
          change="+2 this month"
          changeType="positive"
        />
        <app-stat-card
          [icon]="employeeIcon"
          iconBg="#DCFCE7"
          value="248"
          label="Employees"
          change="+15 this month"
          changeType="positive"
        />
        <app-stat-card
          [icon]="activeIcon"
          iconBg="#F3E8FF"
          value="186"
          label="Active Projects"
          change="-3 from last week"
          changeType="negative"
        />
        <app-stat-card
          [icon]="hierarchyIcon"
          iconBg="#FFEDD5"
          value="8"
          label="Hierarchy Levels"
          change="+1 this quarter"
          changeType="positive"
        />
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Left Column - Recent Employees Table -->
        <div class="left-column">
          <div class="card">
            <div class="card-header">
              <div class="header-content">
                <h3 class="card-title">Recent Employees</h3>
                <p class="card-subtitle">Latest team members added to your organization</p>
              </div>
              <div class="search-box">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search employees..." class="search-input" />
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (employee of recentEmployees; track employee.id) {
                    <tr>
                      <td>
                        <div class="employee-info">
                          <div class="employee-avatar">
                            <span>{{ employee.initials }}</span>
                          </div>
                          <div class="employee-details">
                            <span class="employee-name">{{ employee.name }}</span>
                            <span class="employee-email">{{ employee.email }}</span>
                          </div>
                        </div>
                      </td>
                      <td>{{ employee.designation }}</td>
                      <td>{{ employee.department }}</td>
                      <td>
                        <app-badge [variant]="employee.statusType">{{ employee.status }}</app-badge>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button class="action-btn view" title="View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button class="action-btn edit" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="action-btn delete" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - Widgets -->
        <div class="right-column">
          <!-- Quick Actions Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Quick Actions</h3>
            <div class="quick-actions-grid">
              @for (action of quickActions; track action.label) {
                <div class="quick-action-item" [style.background]="action.bgColor">
                  <div class="action-icon" [innerHTML]="action.icon"></div>
                  <span class="action-label">{{ action.label }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Organization Hierarchy Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Organization Hierarchy</h3>
            <div class="hierarchy-timeline">
              @for (item of hierarchyItems; track item.title; let last = $last) {
                <div class="hierarchy-item">
                  <div class="hierarchy-node" [style.background]="item.levelColor">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  @if (!last) {
                    <div class="hierarchy-line"></div>
                  }
                  <div class="hierarchy-content">
                    <span class="hierarchy-title">{{ item.title }}</span>
                    <span class="hierarchy-level" [style.color]="item.levelColor">{{ item.level }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Department Distribution Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Department Distribution</h3>
            <div class="distribution-list">
              @for (dept of departmentStats; track dept.name) {
                <div class="distribution-item">
                  <div class="distribution-header">
                    <span class="distribution-name">{{ dept.name }}</span>
                    <span class="distribution-value">{{ dept.count }} ({{ dept.percentage }}%)</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width]="dept.percentage + '%'" [style.background]="dept.color"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
        .dashboard {
      animation: fadeIn 300ms ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: var(--spacing-6);
    }

    .left-column {
      min-width: 0;
    }

    .right-column {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-6) var(--spacing-6);
      border-bottom: 1px solid var(--bg-border);
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .card-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-lg);
      padding: 0 var(--spacing-4);
      height: 44px;
      min-width: 240px;
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
      background: transparent;

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

      th, td {
        padding: var(--spacing-4) var(--spacing-5);
        text-align: left;
      }

      th {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--text-secondary);
        background: rgba(var(--bg-border), 0.3);
        border-bottom: 1px solid var(--bg-border);
      }

      td {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        border-bottom: 1px solid var(--bg-border);
      }

      tbody tr {
        height: 88px;
        transition: background var(--transition-fast);

        &:hover {
          background: rgba(var(--primary-blue), 0.03);
        }

        &:last-child td {
          border-bottom: none;
        }
      }
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .employee-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: white;
      flex-shrink: 0;
    }

    .employee-details {
      display: flex;
      flex-direction: column;
    }

    .employee-name {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .employee-email {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-2);
    }

    .action-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        transform: scale(1.05);
      }

      &.view {
        background: rgba(var(--purple), 0.1);
        color: var(--purple);
      }

      &.edit {
        background: rgba(var(--primary-blue), 0.1);
        color: var(--primary-blue);
      }

      &.delete {
        background: rgba(var(--danger), 0.1);
        color: var(--danger);
      }
    }

    .widget-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      padding: var(--spacing-6);
    }

    .widget-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-5) 0;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-4);
    }

    .quick-action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-5);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }
    }

    .action-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: var(--radius-lg);
      color: var(--text-primary);

      :deep(svg) {
        width: 24px;
        height: 24px;
      }
    }

    .action-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      text-align: center;
    }

    .hierarchy-timeline {
      display: flex;
      flex-direction: column;
    }

    .hierarchy-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
      position: relative;
    }

    .hierarchy-node {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      z-index: 1;
    }

    .hierarchy-line {
      position: absolute;
      left: 19px;
      top: 40px;
      width: 2px;
      height: calc(100% - 8px);
      background: linear-gradient(to bottom, var(--primary-blue), rgba(var(--primary-blue), 0.2));
    }

    .hierarchy-content {
      display: flex;
      flex-direction: column;
      padding-bottom: var(--spacing-5);
    }

    .hierarchy-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .hierarchy-level {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .distribution-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .distribution-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .distribution-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .distribution-name {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .distribution-value {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .progress-bar {
      height: 10px;
      background: var(--bg-main);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.5s ease;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 52px;
      padding: 0 var(--spacing-8);
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      color: white;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: 0 4px 14px rgba(var(--primary-blue), 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(var(--primary-blue), 0.4);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1280px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .main-content {
        grid-template-columns: 1fr;
      }

      .right-column {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .right-column {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .search-box {
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent {
  breadcrumbs = [
    { label: 'Home', route: '/' },
    { label: 'Dashboard' }
  ];

  pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>';

  departmentIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  
  employeeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  
  activeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  
  hierarchyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';

  quickActions = [
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>', label: 'Add Employee', color: '#3B82F6', bgColor: '#EFF6FF' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', label: 'Add Department', color: '#22C55E', bgColor: '#DCFCE7' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', label: 'Request Leave', color: '#8B5CF6', bgColor: '#F3E8FF' },
    { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', label: 'Settings', color: '#F97316', bgColor: '#FFEDD5' }
  ];

  hierarchyItems: HierarchyItem[] = [
    { title: 'Chief Executive Officer', level: 'Level 1 - Executive', levelColor: '#3B82F6' },
    { title: 'VP of Operations', level: 'Level 2 - VP', levelColor: '#8B5CF6' },
    { title: 'Senior Manager', level: 'Level 3 - Senior', levelColor: '#22C55E' },
    { title: 'Team Lead', level: 'Level 4 - Mid', levelColor: '#F97316' },
    { title: 'Team Member', level: 'Level 5 - Junior', levelColor: '#06B6D4' }
  ];

  departmentStats = [
    { name: 'Engineering', count: 86, percentage: 35, color: '#3B82F6' },
    { name: 'Marketing', count: 42, percentage: 17, color: '#8B5CF6' },
    { name: 'Sales', count: 58, percentage: 23, color: '#22C55E' },
    { name: 'HR', count: 24, percentage: 10, color: '#F97316' },
    { name: 'Finance', count: 38, percentage: 15, color: '#06B6D4' }
  ];

  recentEmployees = [
    { id: 1, name: 'Sarah Mitchell', email: 'sarah.m@company.com', initials: 'SM', designation: 'Senior Developer', department: 'Engineering', status: 'Active', statusType: 'success' as const },
    { id: 2, name: 'Michael Chen', email: 'michael.c@company.com', initials: 'MC', designation: 'Product Manager', department: 'Product', status: 'Active', statusType: 'success' as const },
    { id: 3, name: 'Emily Johnson', email: 'emily.j@company.com', initials: 'EJ', designation: 'UX Designer', department: 'Design', status: 'On Leave', statusType: 'warning' as const },
    { id: 4, name: 'David Wilson', email: 'david.w@company.com', initials: 'DW', designation: 'DevOps Engineer', department: 'Engineering', status: 'Active', statusType: 'success' as const },
    { id: 5, name: 'Jessica Brown', email: 'jessica.b@company.com', initials: 'JB', designation: 'Marketing Lead', department: 'Marketing', status: 'Active', statusType: 'success' as const }
  ];
}