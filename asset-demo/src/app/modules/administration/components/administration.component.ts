import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, BreadcrumbComponent, BadgeComponent, ModalComponent } from '../../../shared/components';

interface Department {
  id: number;
  name: string;
  code: string;
  head: string;
  employees: number;
  status: 'Active' | 'Inactive';
  statusType: 'success' | 'danger' | 'warning';
}

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, BadgeComponent, ModalComponent],
  template: `
    <div class="administration-page">
      <app-breadcrumb [items]="breadcrumbs" />
      
      <app-page-header
        title="Administration"
        description="Manage your organization's structure, users, and settings"
        [icon]="pageIcon"
        iconBg="#F3E8FF"
      >
        <div slot="actions">
          <button class="btn-primary" (click)="openAddModal()">
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
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">248</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Departments</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">8</span>
            <span class="stat-label">Roles</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">24</span>
            <span class="stat-label">Permissions</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Column - Table -->
        <div class="left-column">
          <div class="table-card">
            <div class="table-header">
              <div class="header-content">
                <h3 class="table-title">Departments</h3>
                <p class="table-subtitle">Manage your organization's departments</p>
              </div>
              <div class="search-box">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search departments..." class="search-input" />
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Code</th>
                    <th>Head</th>
                    <th>Employees</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (dept of departments; track dept.id) {
                    <tr [class.selected]="selectedDepartment()?.id === dept.id" (click)="selectDepartment(dept)">
                      <td>
                        <div class="department-info">
                          <div class="department-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                              <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                          </div>
                          <span class="department-name">{{ dept.name }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="code-badge">{{ dept.code }}</span>
                      </td>
                      <td>{{ dept.head }}</td>
                      <td>{{ dept.employees }}</td>
                      <td>
                        <app-badge [variant]="dept.statusType">{{ dept.status }}</app-badge>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button class="action-btn edit" title="Edit" (click)="editDepartment(dept); $event.stopPropagation()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="action-btn delete" title="Delete" (click)="deleteDepartment(dept); $event.stopPropagation()">
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
          <!-- Department Details Widget -->
          <div class="widget-card" [class.has-data]="selectedDepartment()">
            @if (selectedDepartment()) {
              <h3 class="widget-title">Department Details</h3>
              <div class="detail-item">
                <span class="detail-label">Name</span>
                <span class="detail-value">{{ selectedDepartment()!.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Code</span>
                <span class="detail-value">{{ selectedDepartment()!.code }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Department Head</span>
                <span class="detail-value">{{ selectedDepartment()!.head }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Total Employees</span>
                <span class="detail-value">{{ selectedDepartment()!.employees }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <app-badge [variant]="selectedDepartment()!.statusType">{{ selectedDepartment()!.status }}</app-badge>
              </div>
              <div class="widget-actions">
                <button class="btn-outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button class="btn-danger">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            } @else {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <p>Select a department to view details</p>
              </div>
            }
          </div>

          <!-- Quick Actions Widget -->
          <div class="widget-card">
            <h3 class="widget-title">Quick Actions</h3>
            <div class="quick-actions">
              <button class="quick-action-btn" (click)="openAddModal()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Department
              </button>
              <button class="quick-action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Import CSV
              </button>
              <button class="quick-action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <app-modal
        [isOpen]="showModal()"
        [title]="isEditing() ? 'Edit Department' : 'Add Department'"
        size="md"
        (closed)="closeModal()"
      >
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">Department Name</label>
            <input type="text" class="form-input" placeholder="Enter department name" [value]="formData().name" />
          </div>
          <div class="form-field">
            <label class="form-label">Department Code</label>
            <input type="text" class="form-input" placeholder="e.g., ENG, MKT" [value]="formData().code" />
          </div>
          <div class="form-field">
            <label class="form-label">Department Head</label>
            <input type="text" class="form-input" placeholder="Enter head name" [value]="formData().head" />
          </div>
          <div class="form-field">
            <label class="form-label">Employee Count</label>
            <input type="number" class="form-input" placeholder="0" [value]="formData().employees" />
          </div>
        </div>
        <div slot="footer">
          <button class="btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn-primary" (click)="saveDepartment()">
            {{ isEditing() ? 'Update' : 'Create' }} Department
          </button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
        .administration-page {
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

      &.green {
        background: #DCFCE7;
        color: var(--success);
      }

      &.purple {
        background: #F3E8FF;
        color: var(--purple);
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

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-lg);
      padding: 0 var(--spacing-4);
      height: 44px;
      min-width: 260px;
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

    .department-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .department-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .department-name {
      font-weight: var(--font-weight-semibold);
    }

    .code-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      background: var(--bg-main);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
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
      min-height: 200px;
    }

    .widget-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-5) 0;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-3) 0;
      border-bottom: 1px solid var(--bg-border);

      &:last-of-type {
        border-bottom: none;
        margin-bottom: var(--spacing-5);
      }
    }

    .detail-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .detail-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .widget-actions {
      display: flex;
      gap: var(--spacing-3);
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 40px;
      padding: 0 var(--spacing-5);
      background: transparent;
      color: var(--primary-blue);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border: 1px solid var(--primary-blue);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: rgba(var(--primary-blue), 0.05);
      }
    }

    .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 40px;
      padding: 0 var(--spacing-5);
      background: rgba(var(--danger), 0.1);
      color: var(--danger);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: rgba(var(--danger), 0.15);
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 150px;
      color: var(--text-secondary);
      text-align: center;

      p {
        margin: var(--spacing-4) 0 0 0;
      }
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-4);
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-normal);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);

      svg {
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
      }

      &:hover {
        border-color: var(--primary-blue);
        background: rgba(var(--primary-blue), 0.03);
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-5);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .form-input {
      width: 100%;
      height: 52px;
      padding: 0 var(--spacing-4);
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      outline: none;
      transition: all var(--transition-normal);

      &::placeholder {
        color: var(--text-secondary);
      }

      &:focus {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }
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

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdministrationComponent {
  breadcrumbs = [
    { label: 'Home', route: '/' },
    { label: 'Administration' }
  ];

  pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

  selectedDepartment = signal<Department | null>(null);
  showModal = signal(false);
  isEditing = signal(false);

  formData = signal({
    name: '',
    code: '',
    head: '',
    employees: 0
  });

  departments: Department[] = [
    { id: 1, name: 'Engineering', code: 'ENG', head: 'John Smith', employees: 86, status: 'Active', statusType: 'success' },
    { id: 2, name: 'Marketing', code: 'MKT', head: 'Sarah Johnson', employees: 42, status: 'Active', statusType: 'success' },
    { id: 3, name: 'Sales', code: 'SLS', head: 'Michael Brown', employees: 58, status: 'Active', statusType: 'success' },
    { id: 4, name: 'Human Resources', code: 'HR', head: 'Emily Davis', employees: 24, status: 'Active', statusType: 'success' },
    { id: 5, name: 'Finance', code: 'FIN', head: 'Robert Wilson', employees: 38, status: 'Active', statusType: 'success' },
    { id: 6, name: 'Operations', code: 'OPS', head: 'Jennifer Lee', employees: 32, status: 'Inactive', statusType: 'danger' }
  ];

  selectDepartment(dept: Department): void {
    this.selectedDepartment.set(dept);
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.formData.set({ name: '', code: '', head: '', employees: 0 });
    this.showModal.set(true);
  }

  editDepartment(dept: Department): void {
    this.isEditing.set(true);
    this.formData.set({ ...dept });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveDepartment(): void {
    console.log('Saving department:', this.formData());
    this.closeModal();
  }

  deleteDepartment(dept: Department): void {
    console.log('Deleting department:', dept);
  }
}