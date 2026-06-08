import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, BreadcrumbComponent, BadgeComponent } from '../../shared/components';

interface OnboardingTask {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignee: string;
}

interface NewHire {
  id: number;
  name: string;
  initials: string;
  position: string;
  department: string;
  startDate: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, BadgeComponent],
  template: `
    <div class="onboarding-page">
      <app-breadcrumb [items]="breadcrumbs" />
      
      <app-page-header
        title="Onboarding"
        description="Track and manage new employee onboarding process"
        [icon]="pageIcon"
        iconBg="#FFEDD5"
      >
        <div slot="actions">
          <button class="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
          </button>
          <button class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Hire
          </button>
        </div>
      </app-page-header>

      <!-- Onboarding Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">8</span>
            <span class="stat-label">New Hires This Month</span>
            <span class="stat-change positive">+3 from last month</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">5</span>
            <span class="stat-label">In Progress</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Completed This Quarter</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">92%</span>
            <span class="stat-label">Avg. Completion Rate</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Column - New Hires List -->
        <div class="left-column">
          <div class="table-card">
            <div class="table-header">
              <div class="header-content">
                <h3 class="table-title">New Hires</h3>
                <p class="table-subtitle">Active onboarding employees</p>
              </div>
              <div class="search-box">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search new hires..." class="search-input" />
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Start Date</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (hire of newHires; track hire.id) {
                    <tr [class.selected]="selectedHire()?.id === hire.id" (click)="selectHire(hire)">
                      <td>
                        <div class="employee-info">
                          <div class="employee-avatar" [style.background]="getAvatarColor(hire.department)">
                            <span>{{ hire.initials }}</span>
                          </div>
                          <div class="employee-details">
                            <span class="employee-name">{{ hire.name }}</span>
                            <span class="employee-dept">{{ hire.department }}</span>
                          </div>
                        </div>
                      </td>
                      <td>{{ hire.position }}</td>
                      <td>{{ hire.startDate }}</td>
                      <td>
                        <div class="progress-cell">
                          <div class="progress-bar">
                            <div class="progress-fill" [style.width]="hire.progress + '%'"></div>
                          </div>
                          <span class="progress-text">{{ hire.tasksCompleted }}/{{ hire.totalTasks }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button class="action-btn view" title="View" (click)="viewHire(hire); $event.stopPropagation()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button class="action-btn edit" title="Edit" (click)="editHire(hire); $event.stopPropagation()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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

        <!-- Right Column - Onboarding Tasks -->
        <div class="right-column">
          <!-- Onboarding Checklist Widget -->
          <div class="widget-card">
            <div class="widget-header">
              <h3 class="widget-title">Onboarding Checklist</h3>
              @if (selectedHire()) {
                <app-badge variant="info">{{ selectedHire()!.name }}</app-badge>
              }
            </div>
            <div class="task-list">
              @for (task of onboardingTasks; track task.id) {
                <div class="task-item" [class.completed]="task.status === 'completed'" [class.in-progress]="task.status === 'in_progress'">
                  <div class="task-checkbox">
                    @if (task.status === 'completed') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    } @else if (task.status === 'in_progress') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    }
                  </div>
                  <div class="task-content">
                    <span class="task-title">{{ task.title }}</span>
                    <span class="task-desc">{{ task.description }}</span>
                    <div class="task-meta">
                      <span class="task-due">Due: {{ task.dueDate }}</span>
                      <span class="task-assignee">{{ task.assignee }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Documents Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Required Documents</h3>
            <div class="document-list">
              <div class="document-item completed">
                <div class="document-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="document-info">
                  <span class="document-name">Employment Contract</span>
                  <span class="document-status completed">Signed</span>
                </div>
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="document-item completed">
                <div class="document-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="document-info">
                  <span class="document-name">ID Proof</span>
                  <span class="document-status completed">Verified</span>
                </div>
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="document-item pending">
                <div class="document-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div class="document-info">
                  <span class="document-name">Bank Details</span>
                  <span class="document-status pending">Pending</span>
                </div>
              </div>
              <div class="document-item pending">
                <div class="document-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div class="document-info">
                  <span class="document-name">NDA Agreement</span>
                  <span class="document-status pending">Awaiting Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
        .onboarding-page {
      animation: fadeIn 300ms ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      padding: 28px;
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-5);
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-card)-hover;
        transform: translateY(-4px);
      }
    }

    .stat-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 32px;
        height: 32px;
      }

      &.blue {
        background: #EFF6FF;
        color: var(--primary-blue);
      }

      &.purple {
        background: #F3E8FF;
        color: var(--purple);
      }

      &.green {
        background: #DCFCE7;
        color: var(--success);
      }

      &.orange {
        background: #FFEDD5;
        color: var(--orange);
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .stat-value {
      font-size: 32px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .stat-change {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      margin-top: var(--spacing-1);

      &.positive {
        color: var(--success);
      }
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 400px;
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

    .table-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      overflow: hidden;
    }

    .table-header {
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

    .table-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .table-subtitle {
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
        transition: all var(--transition-fast);
        cursor: pointer;

        &:hover {
          background: rgba(var(--primary-blue), 0.03);
        }

        &.selected {
          background: rgba(var(--primary-blue), 0.08);
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
    }

    .employee-dept {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .progress-cell {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .progress-bar {
      width: 100px;
      height: 8px;
      background: var(--bg-main);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-blue);
      border-radius: var(--radius-full);
      transition: width 0.5s ease;
    }

    .progress-text {
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
    }

    .widget-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      padding: var(--spacing-6);
    }

    .widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-5);
    }

    .widget-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .task-item {
      display: flex;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background: var(--bg-main);
      border-radius: var(--radius-lg);
      transition: all var(--transition-normal);

      &.completed {
        opacity: 0.7;

        .task-checkbox {
          background: var(--success);
          color: white;
        }

        .task-title {
          text-decoration: line-through;
        }
      }

      &.in-progress {
        .task-checkbox {
          background: var(--warning);
          color: white;
        }
      }
    }

    .task-checkbox {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--bg-border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--text-secondary);

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .task-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .task-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .task-desc {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .task-meta {
      display: flex;
      gap: var(--spacing-4);
      margin-top: var(--spacing-1);
    }

    .task-due,
    .task-assignee {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .document-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background: var(--bg-main);
      border-radius: var(--radius-lg);
      transition: all var(--transition-normal);

      &.completed {
        .document-icon {
          background: var(--success)-light;
          color: var(--success);
        }

        .document-status {
          color: var(--success);
        }

        .check-icon {
          color: var(--success);
        }
      }

      &.pending {
        .document-icon {
          background: var(--warning)-light;
          color: var(--warning);
        }

        .document-status {
          color: var(--warning);
        }
      }
    }

    .document-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .document-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .document-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .document-status {
      font-size: var(--font-size-xs);

      &.completed {
        color: var(--success);
      }

      &.pending {
        color: var(--warning);
      }
    }

    .check-icon {
      width: 20px;
      height: 20px;
      color: var(--success);
      flex-shrink: 0;
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

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 52px;
      padding: 0 var(--spacing-6);
      background: var(--bg-card);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: rgba(var(--primary-blue), 0.05);
        border-color: var(--primary-blue);
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

      .table-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .search-box {
        width: 100%;
      }
    }
  `]
})
export class OnboardingComponent {
  breadcrumbs = [
    { label: 'Home', route: '/' },
    { label: 'Onboarding' }
  ];

  pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>';

  selectedHire = signal<NewHire | null>(null);

  newHires: NewHire[] = [
    { id: 1, name: 'Alex Thompson', initials: 'AT', position: 'Senior Developer', department: 'Engineering', startDate: 'Jun 10, 2026', progress: 75, tasksCompleted: 12, totalTasks: 16 },
    { id: 2, name: 'Rachel Green', initials: 'RG', position: 'Marketing Manager', department: 'Marketing', startDate: 'Jun 12, 2026', progress: 50, tasksCompleted: 8, totalTasks: 16 },
    { id: 3, name: 'James Wilson', initials: 'JW', position: 'UX Designer', department: 'Design', startDate: 'Jun 15, 2026', progress: 25, tasksCompleted: 4, totalTasks: 16 },
    { id: 4, name: 'Lisa Anderson', initials: 'LA', position: 'Product Manager', department: 'Product', startDate: 'Jun 18, 2026', progress: 10, tasksCompleted: 2, totalTasks: 16 }
  ];

  onboardingTasks: OnboardingTask[] = [
    { id: 1, title: 'Complete IT Setup', description: 'Laptop, accounts, and access credentials', dueDate: 'Jun 10', status: 'completed', assignee: 'IT Team' },
    { id: 2, title: 'Review Company Policies', description: 'Read and acknowledge handbook', dueDate: 'Jun 11', status: 'completed', assignee: 'HR Team' },
    { id: 3, title: 'Meet with Team Lead', description: 'Introduction and project overview', dueDate: 'Jun 12', status: 'in_progress', assignee: 'Team Lead' },
    { id: 4, title: 'Complete Training Modules', description: 'Mandatory compliance training', dueDate: 'Jun 15', status: 'pending', assignee: 'Self' },
    { id: 5, title: 'Set up 1:1 Schedule', description: 'Weekly sync with manager', dueDate: 'Jun 18', status: 'pending', assignee: 'Manager' }
  ];

  selectHire(hire: NewHire): void {
    this.selectedHire.set(hire);
  }

  viewHire(hire: NewHire): void {
    console.log('View hire:', hire);
  }

  editHire(hire: NewHire): void {
    console.log('Edit hire:', hire);
  }

  getAvatarColor(department: string): string {
    const colors: Record<string, string> = {
      'Engineering': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      'Marketing': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      'Design': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      'Product': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
    };
    return colors[department] || colors['Engineering'];
  }
}