import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  AvatarComponent,
  ButtonComponent,
  ProgressComponent,
  SearchComponent,
  TabsComponent
} from '../../../../shared/components/ui-components';

interface OffboardingTask {
  id: string;
  title: string;
  description: string;
  category: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  completedOn?: string;
  completedBy?: string;
  notes?: string;
}

interface OffboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  position: string;
  department: string;
  manager: string;
  joiningDate: string;
  lastWorkingDay: string;
  separationType: 'Resignation' | 'Termination' | 'Contract End' | 'Retirement';
  status: 'initiated' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled';
  initiatedOn: string;
  initiatedBy: string;
  progress: number;
  reason?: string;
  tasks: OffboardingTask[];
  documents: Array<{ name: string; status: string; issuedOn?: string }>;
  approvals: Array<{ role: string; status: string; approvedBy?: string; approvedOn?: string }>;
}

@Component({
  selector: 'knodtec-offboarding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ButtonComponent,
    ProgressComponent,
    SearchComponent,
    TabsComponent
  ],
  template: `
    <div class="offboarding-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Employee Offboarding</h1>
          <p class="page-subtitle">Manage complete employee offboarding lifecycle</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="reportIcon">Reports</knod-button>
          <knod-button variant="primary" [icon]="plusIcon" (click)="navigateToInitiate()">Initiate Offboarding</knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" (click)="filterByStatus('initiated')">
          <div class="stat-value">{{ initiatedCount() }}</div>
          <div class="stat-label">Initiated</div>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('in_progress')">
          <div class="stat-value">{{ inProgressCount() }}</div>
          <div class="stat-label">In Progress</div>
          <div class="stat-indicator amber"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('pending_approval')">
          <div class="stat-value">{{ pendingApprovalCount() }}</div>
          <div class="stat-label">Pending Approval</div>
          <div class="stat-indicator violet"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('completed')">
          <div class="stat-value">{{ completedCount() }}</div>
          <div class="stat-label">Completed</div>
          <div class="stat-indicator green"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left: Offboarding List -->
        <div class="list-panel">
          <!-- Filters -->
          <div class="filters-bar">
            <div class="search-wrapper">
              <knod-search 
                placeholder="Search employees..."
                [value]="searchQuery()"
                (valueChange)="searchQuery.set($event)">
              </knod-search>
            </div>
            <div class="filter-chips">
              <button 
                class="filter-chip" 
                [class.active]="statusFilter() === 'all'"
                (click)="statusFilter.set('all')">All</button>
              <button 
                class="filter-chip" 
                [class.active]="statusFilter() === 'active'"
                (click)="statusFilter.set('active')">Active</button>
              <button 
                class="filter-chip" 
                [class.active]="statusFilter() === 'completed'"
                (click)="statusFilter.set('completed')">Completed</button>
            </div>
          </div>

          <!-- Offboarding List -->
          <div class="offboarding-list">
            @for (record of filteredRecords(); track record.id) {
              <div 
                class="offboarding-item"
                [class.selected]="selectedRecord()?.id === record.id"
                (click)="selectRecord(record)">
                <div class="item-header">
                  <knod-avatar [name]="record.employeeName" size="md"></knod-avatar>
                  <div class="item-info">
                    <span class="item-name">{{ record.employeeName }}</span>
                    <span class="item-position">{{ record.position }}</span>
                  </div>
                  <knod-badge [color]="getStatusColor(record.status)">{{ formatStatus(record.status) }}</knod-badge>
                </div>
                <div class="item-meta">
                  <span class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    LWD: {{ record.lastWorkingDay | date:'mediumDate' }}
                  </span>
                  <span class="meta-separator">•</span>
                  <span class="meta-item">
                    <knod-badge [color]="getSeparationColor(record.separationType)" size="sm">{{ record.separationType }}</knod-badge>
                  </span>
                </div>
                <div class="item-progress">
                  <div class="progress-info">
                    <span>{{ record.progress }}% Complete</span>
                    <span class="task-count">{{ getCompletedTaskCount(record) }}/{{ record.tasks.length }} tasks</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="record.progress"></div>
                  </div>
                </div>
              </div>
            }

            @if (filteredRecords().length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                <h3>No records found</h3>
                <p>No offboarding records match your filters.</p>
              </div>
            }
          </div>
        </div>

        <!-- Right: Detail Panel -->
        <div class="detail-panel">
          @if (selectedRecord(); as record) {
            <!-- Employee Header -->
            <div class="record-header">
              <knod-avatar [name]="record.employeeName" size="xl"></knod-avatar>
              <div class="header-info">
                <h2 class="header-name">{{ record.employeeName }}</h2>
                <p class="header-position">{{ record.position }} • {{ record.department }}</p>
                <div class="header-meta">
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Last Working Day: {{ record.lastWorkingDay | date:'mediumDate' }}
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Manager: {{ record.manager }}
                  </span>
                </div>
              </div>
              <div class="header-actions">
                <knod-button variant="outline" size="sm" [icon]="editIcon">Edit</knod-button>
                <knod-button variant="primary" size="sm" [icon]="tasksIcon">Tasks</knod-button>
              </div>
            </div>

            <!-- Separation Info -->
            <div class="separation-info">
              <div class="separation-type">
                <knod-badge [color]="getSeparationColor(record.separationType)" size="lg">{{ record.separationType }}</knod-badge>
              </div>
              <div class="separation-dates">
                <div class="date-item">
                  <span class="date-label">Joined</span>
                  <span class="date-value">{{ record.joiningDate | date:'mediumDate' }}</span>
                </div>
                <div class="date-item">
                  <span class="date-label">Initiated</span>
                  <span class="date-value">{{ record.initiatedOn | date:'mediumDate' }}</span>
                </div>
                <div class="date-item">
                  <span class="date-label">Last Day</span>
                  <span class="date-value">{{ record.lastWorkingDay | date:'mediumDate' }}</span>
                </div>
              </div>
              @if (record.reason) {
                <div class="separation-reason">
                  <span class="reason-label">Reason:</span>
                  <span class="reason-text">{{ record.reason }}</span>
                </div>
              }
            </div>

            <!-- Progress Overview -->
            <div class="progress-overview">
              <div class="overall-progress">
                <div class="progress-circle">
                  <svg viewBox="0 0 36 36">
                    <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="ring-fill" [attr.stroke-dasharray]="record.progress + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <span class="progress-value">{{ record.progress }}%</span>
                </div>
                <span class="progress-label">Overall Progress</span>
              </div>
              <div class="category-progress">
                @for (cat of getCategoryProgress(record); track cat.name) {
                  <div class="category-item">
                    <span class="category-name">{{ cat.name }}</span>
                    <div class="category-bar">
                      <div class="category-fill" [style.width.%]="cat.progress"></div>
                    </div>
                    <span class="category-count">{{ cat.completed }}/{{ cat.total }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Detail Tabs -->
            <div class="detail-tabs">
              <knod-tabs 
                [tabs]="detailTabs" 
                [activeTab]="activeTab()"
                (tabChange)="activeTab.set($event)">
              </knod-tabs>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              @switch (activeTab()) {
                @case ('tasks') {
                  <ng-container *ngTemplateOutlet="tasksTab"></ng-container>
                }
                @case ('approvals') {
                  <ng-container *ngTemplateOutlet="approvalsTab"></ng-container>
                }
                @case ('documents') {
                  <ng-container *ngTemplateOutlet="documentsTab"></ng-container>
                }
                @case ('timeline') {
                  <ng-container *ngTemplateOutlet="timelineTab"></ng-container>
                }
              }
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <button class="action-btn" (click)="sendNotification(record)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Send Reminder
              </button>
              <button class="action-btn" (click)="addComment(record)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Add Comment
              </button>
              <button class="action-btn" (click)="completeOffboarding(record)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Complete Offboarding
              </button>
            </div>
          } @else {
            <div class="empty-detail">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <h3>Select an Employee</h3>
              <p>Choose an employee from the list to view their offboarding details.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Tasks Tab Template -->
    <ng-template #tasksTab>
      <div class="tasks-section">
        <div class="section-header">
          <h3>Offboarding Tasks</h3>
          <div class="filter-buttons">
            <button class="filter-btn" [class.active]="taskFilter() === 'all'" (click)="taskFilter.set('all')">All</button>
            <button class="filter-btn" [class.active]="taskFilter() === 'pending'" (click)="taskFilter.set('pending')">Pending</button>
            <button class="filter-btn" [class.active]="taskFilter() === 'completed'" (click)="taskFilter.set('completed')">Completed</button>
          </div>
        </div>
        <div class="tasks-list">
          @for (task of getFilteredTasks(); track task.id) {
            <div class="task-item" [class.completed]="task.status === 'completed'" [class.blocked]="task.status === 'blocked'">
              <div class="task-status">
                <input type="checkbox" [checked]="task.status === 'completed'" (change)="toggleTask(task)">
              </div>
              <div class="task-content">
                <div class="task-header">
                  <span class="task-title" [class.strikethrough]="task.status === 'completed'">{{ task.title }}</span>
                  <knod-badge [color]="getTaskCategoryColor(task.category)">{{ task.category }}</knod-badge>
                </div>
                <p class="task-desc">{{ task.description }}</p>
                <div class="task-meta">
                  <span class="task-assignee">
                    <knod-avatar [name]="task.assignedTo" size="sm"></knod-avatar>
                    {{ task.assignedTo }}
                  </span>
                  <span class="task-due">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ task.dueDate | date:'mediumDate' }}
                  </span>
                  @if (task.status === 'completed' && task.completedOn) {
                    <span class="task-completed">
                      Completed {{ task.completedOn | date:'short' }}
                    </span>
                  }
                </div>
                @if (task.notes) {
                  <div class="task-notes">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {{ task.notes }}
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </ng-template>

    <!-- Approvals Tab Template -->
    <ng-template #approvalsTab>
      <div class="approvals-section">
        <knod-card title="Approval Workflow">
          <div class="approval-timeline">
            @for (approval of selectedRecord()?.approvals; track approval.role) {
              <div class="approval-item" [class.completed]="approval.status === 'completed'" [class.pending]="approval.status === 'pending'">
                <div class="approval-icon">
                  @if (approval.status === 'completed') {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  } @else {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  }
                </div>
                <div class="approval-content">
                  <span class="approval-role">{{ approval.role }}</span>
                  <span class="approval-status">{{ approval.status === 'completed' ? 'Approved' : 'Pending Approval' }}</span>
                  @if (approval.approvedBy) {
                    <span class="approval-meta">By {{ approval.approvedBy }} on {{ approval.approvedOn | date:'short' }}</span>
                  }
                </div>
                @if (approval.status === 'pending') {
                  <knod-button variant="outline" size="sm">Approve</knod-button>
                }
              </div>
            }
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Documents Tab Template -->
    <ng-template #documentsTab>
      <div class="documents-section">
        <knod-card title="Offboarding Documents">
          <div class="document-list">
            @for (doc of selectedRecord()?.documents; track doc.name) {
              <div class="document-item" [class.issued]="doc.status === 'issued'">
                <div class="doc-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="doc-info">
                  <span class="doc-name">{{ doc.name }}</span>
                  @if (doc.issuedOn) {
                    <span class="doc-date">Issued on {{ doc.issuedOn | date:'mediumDate' }}</span>
                  }
                </div>
                <knod-badge [color]="doc.status === 'issued' ? 'green' : 'slate'">{{ doc.status | titlecase }}</knod-badge>
                @if (doc.status !== 'issued') {
                  <knod-button variant="outline" size="sm">Issue</knod-button>
                }
              </div>
            }
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Timeline Tab Template -->
    <ng-template #timelineTab>
      <div class="timeline-section">
        <knod-card title="Offboarding Timeline">
          <div class="timeline">
            <div class="timeline-item completed">
              <div class="timeline-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="timeline-content">
                <span class="timeline-title">Offboarding Initiated</span>
                <span class="timeline-date">{{ selectedRecord()?.initiatedOn | date:'mediumDate' }}</span>
                <span class="timeline-desc">By {{ selectedRecord()?.initiatedBy }}</span>
              </div>
            </div>
            <div class="timeline-item" [class.completed]="getCompletedTaskCount(selectedRecord()!) > 0">
              <div class="timeline-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div class="timeline-content">
                <span class="timeline-title">Tasks Progress</span>
                <span class="timeline-date">Ongoing</span>
                <span class="timeline-desc">{{ getCompletedTaskCount(selectedRecord()!) }} of {{ selectedRecord()?.tasks?.length ?? 0 }} tasks completed</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="timeline-content">
                <span class="timeline-title">Asset Clearance</span>
                <span class="timeline-date">Due: {{ selectedRecord()?.lastWorkingDay | date:'mediumDate' }}</span>
                <span class="timeline-desc">IT asset return verification</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="timeline-content">
                <span class="timeline-title">Final Clearance</span>
                <span class="timeline-date">{{ selectedRecord()?.lastWorkingDay | date:'mediumDate' }}</span>
                <span class="timeline-desc">All approvals and documents completed</span>
              </div>
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>
  `,
  styles: [`
    .offboarding-page {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 100%;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .offboarding-page {
        gap: 20px;
      }
    }

    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .header-content {
      flex: 1;
      min-width: 200px;
    }

    .page-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    @media (min-width: 768px) {
      .page-title {
        font-size: 24px;
      }
    }

    .page-subtitle {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 0;
    }

    .header-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    @media (min-width: 768px) {
      .stats-row {
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      border-color: var(--color-slate-200);
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .stat-label {
      font-size: 12px;
      color: var(--color-slate-500);
      margin-top: 4px;
    }

    .stat-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .stat-indicator.blue { background: var(--color-primary-500); }
    .stat-indicator.amber { background: var(--color-amber-500); }
    .stat-indicator.violet { background: var(--color-violet-500); }
    .stat-indicator.green { background: var(--color-success-500); }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      min-height: 600px;
    }

    @media (min-width: 1280px) {
      .content-layout {
        grid-template-columns: 380px 1fr;
      }
    }

    .list-panel {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }

    @media (min-width: 768px) {
      .list-panel {
        padding: 20px;
      }
    }

    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .filter-chips {
      display: flex;
      gap: 8px;
    }

    .filter-chip {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      background: var(--color-slate-100);
      color: var(--color-slate-600);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .filter-chip.active {
      background: var(--color-primary-500);
      color: white;
    }

    .offboarding-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      max-height: 500px;
    }

    .offboarding-item {
      padding: 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .offboarding-item:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .offboarding-item.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .item-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .item-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .item-position {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--color-slate-500);
      margin-bottom: 12px;
    }

    .meta-separator {
      color: var(--color-slate-300);
    }

    .item-progress {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .task-count {
      color: var(--color-slate-400);
    }

    .progress-bar {
      height: 4px;
      background: var(--color-slate-200);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--color-primary-500);
      border-radius: 2px;
    }

    .detail-panel {
      background: white;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }

    .record-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    @media (min-width: 768px) {
      .record-header {
        flex-direction: row;
        padding: 20px;
      }
    }

    .header-info {
      flex: 1;
      min-width: 0;
    }

    .header-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .header-position {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 4px 0 12px 0;
    }

    .header-meta {
      display: flex;
      gap: 16px;
    }

    .header-meta .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--color-slate-500);
      flex-wrap: wrap;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .separation-info {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--color-slate-50);
      border-bottom: 1px solid var(--color-slate-100);
    }

    @media (min-width: 768px) {
      .separation-info {
        gap: 24px;
        padding: 16px 20px;
      }
    }

    .separation-type {
      flex-shrink: 0;
    }

    .separation-dates {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .separation-dates {
        gap: 24px;
      }
    }

    .date-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date-label {
      font-size: 10px;
      color: var(--color-slate-500);
      text-transform: uppercase;
      font-weight: 500;
    }

    .date-value {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .separation-reason {
      width: 100%;
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-top: 8px;
    }

    @media (min-width: 768px) {
      .separation-reason {
        margin-left: auto;
        margin-top: 0;
        width: auto;
      }
    }

    .reason-label {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .reason-text {
      font-size: 12px;
      color: var(--color-slate-600);
    }

    .progress-overview {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    @media (min-width: 768px) {
      .progress-overview {
        flex-direction: row;
        gap: 24px;
        padding: 20px;
      }
    }

    .overall-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .progress-circle {
      width: 80px;
      height: 80px;
      position: relative;
    }

    .progress-circle svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .ring-bg {
      fill: none;
      stroke: var(--color-slate-200);
      stroke-width: 3;
    }

    .ring-fill {
      fill: none;
      stroke: var(--color-primary-500);
      stroke-width: 3;
      stroke-linecap: round;
    }

    .progress-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .progress-label {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .category-progress {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .category-name {
      width: 80px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .category-bar {
      flex: 1;
      height: 6px;
      background: var(--color-slate-200);
      border-radius: 3px;
      overflow: hidden;
    }

    .category-fill {
      height: 100%;
      background: var(--color-primary-500);
      border-radius: 3px;
    }

    .category-count {
      font-size: 11px;
      color: var(--color-slate-500);
      width: 40px;
      text-align: right;
    }

    .detail-tabs {
      padding: 0 16px;
      border-bottom: 1px solid var(--color-slate-100);
      overflow-x: auto;
    }

    @media (min-width: 768px) {
      .detail-tabs {
        padding: 0 20px;
      }
    }

    .tab-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      min-width: 0;
    }

    @media (min-width: 768px) {
      .tab-content {
        padding: 20px;
      }
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--color-slate-100);
      background: var(--color-slate-50);
    }

    @media (min-width: 768px) {
      .quick-actions {
        padding: 16px 20px;
      }
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
      background: white;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .action-btn:hover {
      background: var(--color-slate-50);
      border-color: var(--color-slate-300);
    }

    /* Tasks Section */
    .tasks-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-header h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
    }

    .filter-btn {
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
      background: var(--color-slate-100);
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .filter-btn.active {
      background: var(--color-primary-500);
      color: white;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      transition: all var(--transition-fast);
    }

    .task-item:hover {
      background: var(--color-slate-50);
    }

    .task-item.completed {
      background: var(--color-success-50);
      border-color: var(--color-success-200);
    }

    .task-item.blocked {
      background: var(--color-red-50);
      border-color: var(--color-red-200);
    }

    .task-status {
      padding-top: 2px;
    }

    .task-status input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .task-content {
      flex: 1;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .task-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .task-title.strikethrough {
      text-decoration: line-through;
      color: var(--color-slate-500);
    }

    .task-desc {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 0 0 10px 0;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .task-assignee {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .task-due {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .task-completed {
      font-size: 11px;
      color: var(--color-success-600);
    }

    .task-notes {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 8px 12px;
      background: var(--color-slate-100);
      border-radius: 6px;
      font-size: 11px;
      color: var(--color-slate-600);
    }

    /* Approvals Section */
    .approvals-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .approval-timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .approval-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .approval-item.completed {
      background: var(--color-success-50);
    }

    .approval-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .approval-item.completed .approval-icon {
      background: var(--color-success-100);
      color: var(--color-success-600);
    }

    .approval-item.pending .approval-icon {
      background: var(--color-slate-200);
      color: var(--color-slate-500);
    }

    .approval-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .approval-role {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .approval-status {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .approval-meta {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    /* Documents Section */
    .documents-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .document-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 6px;
    }

    .document-item.issued {
      background: var(--color-success-50);
    }

    .doc-icon {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .doc-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .doc-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .doc-date {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Timeline Section */
    .timeline-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      padding-left: 24px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--color-slate-200);
    }

    .timeline-item {
      display: flex;
      gap: 12px;
      position: relative;
    }

    .timeline-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--color-slate-200);
      color: var(--color-slate-500);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .timeline-item.completed .timeline-icon {
      background: var(--color-success-500);
      color: white;
    }

    .timeline-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-bottom: 8px;
    }

    .timeline-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .timeline-date {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .timeline-desc {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .empty-detail,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--color-slate-400);
      text-align: center;
      padding: 48px;
    }

    .empty-detail h3,
    .empty-state h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-700);
      margin: 0;
    }

    .empty-detail p,
    .empty-state p {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 0;
    }

    /* Icons */
    .reportIcon, .plusIcon, .editIcon, .tasksIcon {
      display: flex;
    }
  `]
})
export class OffboardingComponent {
  private router: Router;

  readonly reportIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly editIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  readonly tasksIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';

  readonly searchQuery = signal('');
  readonly statusFilter = signal('all');
  readonly activeTab = signal('tasks');
  readonly taskFilter = signal('all');

  readonly detailTabs = [
    { key: 'tasks', label: 'Tasks' },
    { key: 'approvals', label: 'Approvals' },
    { key: 'documents', label: 'Documents' },
    { key: 'timeline', label: 'Timeline' }
  ];

  readonly records = signal<OffboardingRecord[]>([
    {
      id: 'OFF-001',
      employeeId: 'EMP-2015',
      employeeName: 'Amit Singh',
      employeeEmail: 'amit.singh@knodtec.com',
      position: 'Senior Developer',
      department: 'Engineering',
      manager: 'Priya Patel',
      joiningDate: '2023-01-15',
      lastWorkingDay: '2026-06-15',
      separationType: 'Resignation',
      status: 'in_progress',
      initiatedOn: '2026-06-01',
      initiatedBy: 'HR Team',
      progress: 65,
      reason: 'Personal growth opportunity',
      tasks: [
        { id: 't1', title: 'Knowledge Transfer', description: 'Complete documentation and knowledge transfer', category: 'HR', assignedTo: 'Manager', dueDate: '2026-06-10', status: 'completed', completedOn: '2026-06-09', completedBy: 'Priya Patel' },
        { id: 't2', title: 'Project Handover', description: 'Complete ongoing project handover', category: 'HR', assignedTo: 'Manager', dueDate: '2026-06-12', status: 'completed', completedOn: '2026-06-11', completedBy: 'Amit Singh' },
        { id: 't3', title: 'Access Revocation', description: 'Revoke all system access and accounts', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-14', status: 'in_progress', notes: 'Waiting for manager approval' },
        { id: 't4', title: 'Asset Recovery', description: 'Collect all IT assets from employee', category: 'IT', assignedTo: 'IT Asset Team', dueDate: '2026-06-14', status: 'pending' },
        { id: 't5', title: 'Final Settlement', description: 'Process final salary and benefits settlement', category: 'Finance', assignedTo: 'Finance Team', dueDate: '2026-06-15', status: 'pending' },
        { id: 't6', title: 'Exit Interview', description: 'Conduct exit interview', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-06-15', status: 'pending' }
      ],
      documents: [
        { name: 'Experience Letter', status: 'issued', issuedOn: '2026-06-10' },
        { name: 'Relieving Letter', status: 'issued', issuedOn: '2026-06-10' },
        { name: 'Full & Final Settlement', status: 'pending' },
        { name: 'Exit Interview Form', status: 'pending' }
      ],
      approvals: [
        { role: 'Manager Approval', status: 'completed', approvedBy: 'Priya Patel', approvedOn: '2026-06-02' },
        { role: 'HR Approval', status: 'completed', approvedBy: 'HR Team', approvedOn: '2026-06-03' },
        { role: 'Finance Clearance', status: 'pending' },
        { role: 'IT Clearance', status: 'pending' }
      ]
    },
    {
      id: 'OFF-002',
      employeeId: 'EMP-2018',
      employeeName: 'Sneha Gupta',
      employeeEmail: 'sneha.gupta@knodtec.com',
      position: 'Product Designer',
      department: 'Design',
      manager: 'Rahul Verma',
      joiningDate: '2024-03-01',
      lastWorkingDay: '2026-06-20',
      separationType: 'Resignation',
      status: 'initiated',
      initiatedOn: '2026-06-05',
      initiatedBy: 'HR Team',
      progress: 20,
      reason: 'Relocating to another city',
      tasks: [
        { id: 't1', title: 'Knowledge Transfer', description: 'Complete documentation and knowledge transfer', category: 'HR', assignedTo: 'Manager', dueDate: '2026-06-15', status: 'pending' },
        { id: 't2', title: 'Design Handover', description: 'Hand over all design files and projects', category: 'HR', assignedTo: 'Manager', dueDate: '2026-06-17', status: 'pending' },
        { id: 't3', title: 'Access Revocation', description: 'Revoke all system access and accounts', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-19', status: 'pending' },
        { id: 't4', title: 'Asset Recovery', description: 'Collect all IT assets from employee', category: 'IT', assignedTo: 'IT Asset Team', dueDate: '2026-06-19', status: 'pending' }
      ],
      documents: [
        { name: 'Experience Letter', status: 'pending' },
        { name: 'Relieving Letter', status: 'pending' },
        { name: 'Full & Final Settlement', status: 'pending' }
      ],
      approvals: [
        { role: 'Manager Approval', status: 'pending' },
        { role: 'HR Approval', status: 'pending' },
        { role: 'Finance Clearance', status: 'pending' },
        { role: 'IT Clearance', status: 'pending' }
      ]
    },
    {
      id: 'OFF-003',
      employeeId: 'EMP-2010',
      employeeName: 'Vikram Patel',
      employeeEmail: 'vikram.patel@knodtec.com',
      position: 'Marketing Lead',
      department: 'Marketing',
      manager: 'Director',
      joiningDate: '2022-06-01',
      lastWorkingDay: '2026-05-30',
      separationType: 'Contract End',
      status: 'completed',
      initiatedOn: '2026-05-15',
      initiatedBy: 'HR Team',
      progress: 100,
      tasks: [
        { id: 't1', title: 'Knowledge Transfer', description: 'Complete documentation and knowledge transfer', category: 'HR', assignedTo: 'Manager', dueDate: '2026-05-25', status: 'completed', completedOn: '2026-05-24', completedBy: 'Manager' },
        { id: 't2', title: 'Access Revocation', description: 'Revoke all system access and accounts', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-05-28', status: 'completed', completedOn: '2026-05-27', completedBy: 'IT Admin' },
        { id: 't3', title: 'Asset Recovery', description: 'Collect all IT assets from employee', category: 'IT', assignedTo: 'IT Asset Team', dueDate: '2026-05-28', status: 'completed', completedOn: '2026-05-28', completedBy: 'IT Asset Team' },
        { id: 't4', title: 'Final Settlement', description: 'Process final salary and benefits settlement', category: 'Finance', assignedTo: 'Finance Team', dueDate: '2026-05-30', status: 'completed', completedOn: '2026-05-29', completedBy: 'Finance' }
      ],
      documents: [
        { name: 'Experience Letter', status: 'issued', issuedOn: '2026-05-29' },
        { name: 'Relieving Letter', status: 'issued', issuedOn: '2026-05-29' },
        { name: 'Full & Final Settlement', status: 'issued', issuedOn: '2026-05-30' }
      ],
      approvals: [
        { role: 'Manager Approval', status: 'completed', approvedBy: 'Director', approvedOn: '2026-05-16' },
        { role: 'HR Approval', status: 'completed', approvedBy: 'HR Team', approvedOn: '2026-05-17' },
        { role: 'Finance Clearance', status: 'completed', approvedBy: 'Finance Team', approvedOn: '2026-05-29' },
        { role: 'IT Clearance', status: 'completed', approvedBy: 'IT Admin', approvedOn: '2026-05-28' }
      ]
    }
  ]);

  readonly selectedRecord = signal<OffboardingRecord | null>(null);

  readonly filteredRecords = computed(() => {
    let result = this.records();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    if (query) {
      result = result.filter(r => 
        r.employeeName.toLowerCase().includes(query) ||
        r.employeeEmail.toLowerCase().includes(query) ||
        r.employeeId.toLowerCase().includes(query)
      );
    }

    if (status === 'active') {
      result = result.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
    } else if (status === 'completed') {
      result = result.filter(r => r.status === 'completed');
    }

    return result;
  });

  readonly initiatedCount = computed(() => this.records().filter(r => r.status === 'initiated').length);
  readonly inProgressCount = computed(() => this.records().filter(r => r.status === 'in_progress').length);
  readonly pendingApprovalCount = computed(() => this.records().filter(r => r.status === 'pending_approval').length);
  readonly completedCount = computed(() => this.records().filter(r => r.status === 'completed').length);

  constructor(router: Router) {
    this.router = router;
    this.selectedRecord.set(this.records()[0]);
  }

  selectRecord(record: OffboardingRecord): void {
    this.selectedRecord.set(record);
  }

  filterByStatus(status: string): void {
    this.statusFilter.set(this.statusFilter() === status ? 'all' : status);
  }

  getCompletedTaskCount(record: OffboardingRecord): number {
    return record.tasks.filter(t => t.status === 'completed').length;
  }

  getCategoryProgress(record: OffboardingRecord) {
    const categories = ['HR', 'IT', 'Finance'];
    return categories.map(cat => {
      const tasks = record.tasks.filter(t => t.category === cat);
      const completed = tasks.filter(t => t.status === 'completed').length;
      return {
        name: cat,
        total: tasks.length,
        completed,
        progress: tasks.length ? (completed / tasks.length) * 100 : 0
      };
    });
  }

  getFilteredTasks() {
    const record = this.selectedRecord();
    if (!record) return [];
    
    const filter = this.taskFilter();
    if (filter === 'all') return record.tasks;
    return record.tasks.filter(t => t.status === filter);
  }

  toggleTask(task: OffboardingTask): void {
    const record = this.selectedRecord();
    if (!record) return;

    const records = this.records();
    const recordIndex = records.findIndex(r => r.id === record.id);
    if (recordIndex !== -1) {
      const taskIndex = records[recordIndex].tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        records[recordIndex].tasks[taskIndex].status = task.status === 'completed' ? 'pending' : 'completed';
        if (records[recordIndex].tasks[taskIndex].status === 'completed') {
          records[recordIndex].tasks[taskIndex].completedOn = new Date().toISOString();
        }
        records[recordIndex].progress = Math.round(
          (records[recordIndex].tasks.filter(t => t.status === 'completed').length / records[recordIndex].tasks.length) * 100
        );
        this.records.set([...records]);
        this.selectedRecord.set(records[recordIndex]);
      }
    }
  }

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'slate' | 'violet' | 'red' {
    const colors: Record<string, 'green' | 'blue' | 'amber' | 'slate' | 'violet' | 'red'> = {
      'initiated': 'blue',
      'in_progress': 'amber',
      'pending_approval': 'violet',
      'completed': 'green',
      'cancelled': 'slate'
    };
    return colors[status] || 'slate';
  }

  getSeparationColor(type: string): 'blue' | 'amber' | 'violet' | 'red' {
    const colors: Record<string, 'blue' | 'amber' | 'violet' | 'red'> = {
      'Resignation': 'blue',
      'Termination': 'red',
      'Contract End': 'violet',
      'Retirement': 'amber'
    };
    return colors[type] || 'blue';
  }

  getTaskCategoryColor(category: string): 'blue' | 'indigo' | 'green' {
    const colors: Record<string, 'blue' | 'indigo' | 'green'> = {
      'HR': 'blue',
      'IT': 'indigo',
      'Finance': 'green'
    };
    return colors[category] || 'blue';
  }

  formatStatus(status: string): string {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  navigateToInitiate(): void {
    this.router.navigate(['/offboarding/initiate']);
  }

  sendNotification(record: OffboardingRecord): void {
    // Send notification
  }

  addComment(record: OffboardingRecord): void {
    // Add comment
  }

  completeOffboarding(record: OffboardingRecord): void {
    const records = this.records();
    const index = records.findIndex(r => r.id === record.id);
    if (index !== -1) {
      records[index].status = 'completed';
      records[index].progress = 100;
      this.records.set([...records]);
      this.selectedRecord.set(records[index]);
    }
  }
}