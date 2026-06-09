import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, BreadcrumbComponent, BadgeComponent, CardComponent } from '../../shared/components';

interface LeaveRequest {
  id: number;
  employee: string;
  initials: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  statusType: 'warning' | 'success' | 'danger';
}

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, BadgeComponent, CardComponent],
  template: `
    <div class="leaves-page">
      <app-breadcrumb [items]="breadcrumbs" />
      
      <app-page-header
        title="Leave Management"
        description="Track and manage employee leave requests efficiently"
        [icon]="pageIcon"
        iconBg="#DCFCE7"
      >
        <div slot="actions">
          <button class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Request Leave
          </button>
        </div>
      </app-page-header>

      <!-- Leave Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">156</span>
            <span class="stat-label">Total Leave Days</span>
            <span class="stat-change positive">+12 from last month</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Pending Requests</span>
            <span class="stat-change negative">3 urgent</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">89</span>
            <span class="stat-label">Approved This Month</span>
            <span class="stat-change positive">+5 from last month</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">24</span>
            <span class="stat-label">On Leave Today</span>
          </div>
        </div>
      </div>

      <!-- Leave Type Cards -->
      <div class="leave-types-grid">
        <div class="leave-type-card">
          <div class="leave-type-header">
            <div class="leave-type-icon annual">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <div class="leave-type-info">
              <span class="leave-type-name">Annual Leave</span>
              <span class="leave-type-remaining">12 days remaining</span>
            </div>
          </div>
          <div class="leave-type-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 60%;"></div>
            </div>
            <span class="progress-label">18 of 30 days used</span>
          </div>
        </div>

        <div class="leave-type-card">
          <div class="leave-type-header">
            <div class="leave-type-icon sick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div class="leave-type-info">
              <span class="leave-type-name">Sick Leave</span>
              <span class="leave-type-remaining">8 days remaining</span>
            </div>
          </div>
          <div class="leave-type-progress">
            <div class="progress-bar">
              <div class="progress-fill sick" style="width: 40%;"></div>
            </div>
            <span class="progress-label">2 of 10 days used</span>
          </div>
        </div>

        <div class="leave-type-card">
          <div class="leave-type-header">
            <div class="leave-type-icon personal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="leave-type-info">
              <span class="leave-type-name">Personal Leave</span>
              <span class="leave-type-remaining">3 days remaining</span>
            </div>
          </div>
          <div class="leave-type-progress">
            <div class="progress-bar">
              <div class="progress-fill personal" style="width: 30%;"></div>
            </div>
            <span class="progress-label">2 of 5 days used</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Column - Leave Requests Table -->
        <div class="left-column">
          <div class="table-card">
            <div class="table-header">
              <div class="header-content">
                <h3 class="table-title">Leave Requests</h3>
                <p class="table-subtitle">Recent leave applications from employees</p>
              </div>
              <div class="header-actions">
                <div class="search-box">
                  <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input type="text" placeholder="Search requests..." class="search-input" />
                </div>
                <div class="filter-tabs">
                  <button class="filter-tab active">All</button>
                  <button class="filter-tab">Pending</button>
                  <button class="filter-tab">Approved</button>
                  <button class="filter-tab">Rejected</button>
                </div>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (request of leaveRequests; track request.id) {
                    <tr>
                      <td>
                        <div class="employee-info">
                          <div class="employee-avatar">
                            <span>{{ request.initials }}</span>
                          </div>
                          <div class="employee-details">
                            <span class="employee-name">{{ request.employee }}</span>
                            <span class="employee-reason">{{ request.reason }}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="leave-type-badge">{{ request.type }}</span>
                      </td>
                      <td>
                        <div class="duration-info">
                          <span class="date-range">{{ request.startDate }} - {{ request.endDate }}</span>
                          <span class="days-count">{{ request.days }} days</span>
                        </div>
                      </td>
                      <td>
                        <app-badge [variant]="request.statusType">{{ request.status }}</app-badge>
                      </td>
                      <td>
                        <div class="action-buttons">
                          @if (request.status === 'Pending') {
                            <button class="action-btn approve" title="Approve">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </button>
                            <button class="action-btn reject" title="Reject">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          } @else {
                            <button class="action-btn view" title="View Details">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                          }
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
          <!-- Calendar Preview Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Upcoming Leaves</h3>
            <div class="upcoming-leaves">
              <div class="leave-item">
                <div class="leave-date">
                  <span class="date-day">15</span>
                  <span class="date-month">Jun</span>
                </div>
                <div class="leave-info">
                  <span class="leave-name">Sarah Mitchell</span>
                  <span class="leave-type">Annual Leave - 3 days</span>
                </div>
              </div>
              <div class="leave-item">
                <div class="leave-date warning">
                  <span class="date-day">18</span>
                  <span class="date-month">Jun</span>
                </div>
                <div class="leave-info">
                  <span class="leave-name">Michael Chen</span>
                  <span class="leave-type">Sick Leave - 2 days</span>
                </div>
              </div>
              <div class="leave-item">
                <div class="leave-date">
                  <span class="date-day">22</span>
                  <span class="date-month">Jun</span>
                </div>
                <div class="leave-info">
                  <span class="leave-name">Emily Johnson</span>
                  <span class="leave-type">Personal Leave - 1 day</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Availability Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Team Availability</h3>
            <div class="availability-chart">
              <div class="availability-item">
                <div class="availability-bar">
                  <div class="bar-fill high" style="width: 85%;"></div>
                </div>
                <span class="availability-label">Engineering</span>
                <span class="availability-value">85%</span>
              </div>
              <div class="availability-item">
                <div class="availability-bar">
                  <div class="bar-fill medium" style="width: 72%;"></div>
                </div>
                <span class="availability-label">Marketing</span>
                <span class="availability-value">72%</span>
              </div>
              <div class="availability-item">
                <div class="availability-bar">
                  <div class="bar-fill high" style="width: 90%;"></div>
                </div>
                <span class="availability-label">Sales</span>
                <span class="availability-value">90%</span>
              </div>
              <div class="availability-item">
                <div class="availability-bar">
                  <div class="bar-fill low" style="width: 45%;"></div>
                </div>
                <span class="availability-label">HR</span>
                <span class="availability-value">45%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
        .leaves-page {
      animation: fadeIn 300ms ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-6);
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

      &.warning {
        background: #FEF3C7;
        color: var(--warning);
      }

      &.green {
        background: #DCFCE7;
        color: var(--success);
      }

      &.red {
        background: #FEE2E2;
        color: var(--danger);
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

      &.negative {
        color: var(--danger);
      }
    }

    .leave-types-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .leave-type-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      padding: var(--spacing-6);
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-card)-hover;
        transform: translateY(-4px);
      }
    }

    .leave-type-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-5);
    }

    .leave-type-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 28px;
        height: 28px;
      }

      &.annual {
        background: #EFF6FF;
        color: var(--primary-blue);
      }

      &.sick {
        background: #FEE2E2;
        color: var(--danger);
      }

      &.personal {
        background: #F3E8FF;
        color: var(--purple);
      }
    }

    .leave-type-info {
      display: flex;
      flex-direction: column;
    }

    .leave-type-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .leave-type-remaining {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .leave-type-progress {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .progress-bar {
      height: 10px;
      background: var(--bg-main);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-blue);
      border-radius: var(--radius-full);
      transition: width 0.5s ease;

      &.sick {
        background: var(--danger);
      }

      &.personal {
        background: var(--purple);
      }
    }

    .progress-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
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

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
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
      min-width: 200px;
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

    .filter-tabs {
      display: flex;
      gap: var(--spacing-2);
    }

    .filter-tab {
      padding: var(--spacing-2) var(--spacing-4);
      background: transparent;
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        border-color: var(--primary-blue);
        color: var(--primary-blue);
      }

      &.active {
        background: var(--primary-blue);
        border-color: var(--primary-blue);
        color: white;
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
    }

    .employee-reason {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .leave-type-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      background: var(--bg-main);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .duration-info {
      display: flex;
      flex-direction: column;
    }

    .date-range {
      font-weight: var(--font-weight-medium);
    }

    .days-count {
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

      &.approve {
        background: rgba(var(--success), 0.1);
        color: var(--success);
      }

      &.reject {
        background: rgba(var(--danger), 0.1);
        color: var(--danger);
      }

      &.view {
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

    .widget-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-5) 0;
    }

    .upcoming-leaves {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .leave-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-3);
      background: var(--bg-main);
      border-radius: var(--radius-lg);
    }

    .leave-date {
      width: 52px;
      height: 52px;
      background: var(--primary-blue);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.warning {
        background: var(--warning);
      }
    }

    .date-day {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: white;
      line-height: 1;
    }

    .date-month {
      font-size: var(--font-size-xs);
      color: rgba(white, 0.8);
      text-transform: uppercase;
    }

    .leave-info {
      display: flex;
      flex-direction: column;
    }

    .leave-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .leave-type {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .availability-chart {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .availability-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: var(--spacing-3);
    }

    .availability-bar {
      height: 8px;
      background: var(--bg-main);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: var(--radius-full);

      &.high {
        background: var(--success);
      }

      &.medium {
        background: var(--warning);
      }

      &.low {
        background: var(--danger);
      }
    }

    .availability-label {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      min-width: 100px;
    }

    .availability-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      min-width: 40px;
      text-align: right;
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

      .leave-types-grid {
        grid-template-columns: 1fr;
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

      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-tabs {
        overflow-x: auto;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LeavesComponent {
  breadcrumbs = [
    { label: 'Home', route: '/' },
    { label: 'Leaves' }
  ];

  pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

  leaveRequests: LeaveRequest[] = [
    { id: 1, employee: 'Sarah Mitchell', initials: 'SM', type: 'Annual', startDate: 'Jun 15', endDate: 'Jun 17', days: 3, reason: 'Family vacation', status: 'Pending', statusType: 'warning' },
    { id: 2, employee: 'Michael Chen', initials: 'MC', type: 'Sick', startDate: 'Jun 18', endDate: 'Jun 19', days: 2, reason: 'Medical appointment', status: 'Pending', statusType: 'warning' },
    { id: 3, employee: 'Emily Johnson', initials: 'EJ', type: 'Personal', startDate: 'Jun 22', endDate: 'Jun 22', days: 1, reason: 'Personal work', status: 'Approved', statusType: 'success' },
    { id: 4, employee: 'David Wilson', initials: 'DW', type: 'Annual', startDate: 'Jun 25', endDate: 'Jun 30', days: 4, reason: 'Wedding attendance', status: 'Approved', statusType: 'success' },
    { id: 5, employee: 'Jessica Brown', initials: 'JB', type: 'Sick', startDate: 'Jun 10', endDate: 'Jun 11', days: 2, reason: 'Flu', status: 'Rejected', statusType: 'danger' }
  ];
}