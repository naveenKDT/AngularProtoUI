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

interface OffboardingDocument {
  name: string;
  status: string;
  issuedOn?: string;
}

interface OffboardingApproval {
  role: string;
  status: string;
  approvedBy?: string;
  approvedOn?: string;
}

interface OffboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  position: string;
  department: string;
  manager: string;
  managerEmail?: string;
  joiningDate: string;
  lastWorkingDay: string;
  separationType: 'Resignation' | 'Termination' | 'Contract End' | 'Retirement' | 'Mutual Separation';
  noticePeriod?: string;
  noticeStatus?: string;
  exitInterviewRequired?: boolean;
  resignationLetterReceived?: string;
  status: 'initiated' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled';
  initiatedOn: string;
  initiatedBy: string;
  progress: number;
  reason?: string;
  hrNotes?: string;
  tasks: OffboardingTask[];
  documents: OffboardingDocument[];
  approvals: OffboardingApproval[];
}

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  assignedTo: string;
  defaultChecked: boolean;
}

interface InitiateFormData {
  // Step 1
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  manager: string;
  managerEmail: string;
  joiningDate: string;
  // Step 2
  separationType: string;
  lastWorkingDay: string;
  noticePeriod: string;
  noticeStatus: string;
  reason: string;
  resignationLetterReceived: string;
  exitInterviewRequired: string;
  hrNotes: string;
  // Step 3
  selectedTasks: Record<string, boolean>;
}

const TASK_TEMPLATES: TaskTemplate[] = [
  { id: 'kt', title: 'Knowledge transfer', description: 'Complete documentation and KT sessions with the team', category: 'HR', assignedTo: 'Reporting Manager', defaultChecked: true },
  { id: 'ph', title: 'Project handover', description: 'Hand over all active projects, code, and ongoing work', category: 'HR', assignedTo: 'Reporting Manager', defaultChecked: true },
  { id: 'ei', title: 'Exit interview', description: 'Conduct structured exit interview and record feedback', category: 'HR', assignedTo: 'HR Team', defaultChecked: true },
  { id: 'ar', title: 'Asset recovery', description: 'Collect laptop, ID card, access cards, and peripherals', category: 'IT', assignedTo: 'IT Asset Team', defaultChecked: true },
  { id: 'ax', title: 'Access revocation', description: 'Revoke all system, email, app, and tool access', category: 'IT', assignedTo: 'IT Admin', defaultChecked: true },
  { id: 'fs', title: 'Final settlement', description: 'Process last payslip, PF, gratuity, and reimbursements', category: 'Finance', assignedTo: 'Finance Team', defaultChecked: true },
  { id: 'lh', title: 'LMS / HR portal deactivation', description: 'Deactivate all HR system accounts and subscriptions', category: 'IT', assignedTo: 'IT Admin', defaultChecked: false },
  { id: 'bg', title: 'Background verification closure', description: 'Close any open background verification cases', category: 'HR', assignedTo: 'HR Team', defaultChecked: false },
];

const STEP_LABELS = ['Employee info', 'Separation details', 'Task setup', 'Review & submit'];

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
    <div class="ob-page">

      <!-- Top bar -->
      <div class="ob-topbar">
        <div class="ob-topbar-left">
          <h1 class="ob-title">Employee offboarding</h1>
          <p class="ob-subtitle">HR workspace — manage exit lifecycle, tasks, approvals, and clearances</p>
        </div>
        <div class="ob-topbar-actions">
          <knod-button variant="outline" [icon]="downloadIcon" (click)="exportReport()">Export report</knod-button>
          <knod-button variant="primary" [icon]="plusIcon" (click)="openInitiateModal()">Initiate offboarding</knod-button>
        </div>
      </div>

      <!-- Stats -->
      <div class="ob-stats-row">
        <div class="ob-stat-card" (click)="quickFilter('initiated')">
          <div class="ob-stat-val">{{ initiatedCount() }}</div>
          <div class="ob-stat-lbl">Initiated</div>
          <div class="ob-stat-bar" style="background: var(--color-primary-500)"></div>
        </div>
        <div class="ob-stat-card" (click)="quickFilter('in_progress')">
          <div class="ob-stat-val">{{ inProgressCount() }}</div>
          <div class="ob-stat-lbl">In progress</div>
          <div class="ob-stat-bar" style="background: var(--color-amber-500)"></div>
        </div>
        <div class="ob-stat-card" (click)="quickFilter('pending_approval')">
          <div class="ob-stat-val">{{ pendingApprovalCount() }}</div>
          <div class="ob-stat-lbl">Pending approval</div>
          <div class="ob-stat-bar" style="background: var(--color-violet-500)"></div>
        </div>
        <div class="ob-stat-card" (click)="quickFilter('completed')">
          <div class="ob-stat-val">{{ completedCount() }}</div>
          <div class="ob-stat-lbl">Completed</div>
          <div class="ob-stat-bar" style="background: var(--color-success-500)"></div>
        </div>
      </div>

      <!-- Main layout -->
      <div class="ob-main">

        <!-- Sidebar list -->
        <div class="ob-sidebar">
          <div class="ob-sidebar-search">
            <knod-search
              placeholder="Search by name or ID…"
              [value]="searchQuery()"
              (valueChange)="searchQuery.set($event)">
            </knod-search>
          </div>
          <div class="ob-sidebar-filters">
            <button class="ob-fchip" [class.active]="statusFilter() === 'all'" (click)="statusFilter.set('all')">All</button>
            <button class="ob-fchip" [class.active]="statusFilter() === 'active'" (click)="statusFilter.set('active')">Active</button>
            <button class="ob-fchip" [class.active]="statusFilter() === 'completed'" (click)="statusFilter.set('completed')">Completed</button>
          </div>

          <div class="ob-emp-list">
            @for (record of filteredRecords(); track record.id) {
              <div
                class="ob-emp-item"
                [class.active]="selectedRecord()?.id === record.id"
                (click)="selectRecord(record)">
                <div class="ob-emp-top">
                  <knod-avatar [name]="record.employeeName" size="sm"></knod-avatar>
                  <div class="ob-emp-info">
                    <span class="ob-emp-name">{{ record.employeeName }}</span>
                    <span class="ob-emp-role">{{ record.position }} · {{ record.department }}</span>
                  </div>
                  <knod-badge [color]="getStatusColor(record.status)" size="sm">{{ formatStatus(record.status) }}</knod-badge>
                </div>
                <div class="ob-emp-meta">
                  <span class="ob-emp-lwd">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    LWD: {{ record.lastWorkingDay | date:'d MMM yyyy' }}
                  </span>
                  <knod-badge [color]="getSeparationColor(record.separationType)" size="sm">{{ record.separationType }}</knod-badge>
                </div>
                <div class="ob-emp-prog">
                  <div class="ob-prog-bar"><div class="ob-prog-fill" [style.width.%]="record.progress"></div></div>
                  <span class="ob-prog-text">{{ record.progress }}%</span>
                </div>
              </div>
            }
            @if (filteredRecords().length === 0) {
              <div class="ob-list-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                <p>No records match your filter.</p>
              </div>
            }
          </div>
        </div>

        <!-- Detail panel -->
        <div class="ob-detail">
          @if (selectedRecord(); as record) {

            <!-- Record header -->
            <div class="ob-rec-header">
              <knod-avatar [name]="record.employeeName" size="lg"></knod-avatar>
              <div class="ob-rec-header-info">
                <h2 class="ob-rec-name">{{ record.employeeName }}</h2>
                <p class="ob-rec-role">{{ record.position }} · {{ record.department }}</p>
                <div class="ob-rec-badges">
                  <knod-badge [color]="getStatusColor(record.status)">{{ formatStatus(record.status) }}</knod-badge>
                  <knod-badge [color]="getSeparationColor(record.separationType)">{{ record.separationType }}</knod-badge>
                </div>
                <div class="ob-rec-meta">
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    LWD: {{ record.lastWorkingDay | date:'d MMM yyyy' }}
                  </span>
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ record.manager }}
                  </span>
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {{ record.employeeEmail }}
                  </span>
                </div>
              </div>
              <div class="ob-rec-header-actions">
                <knod-button variant="outline" size="sm" [icon]="editIcon" (click)="editRecord(record)">Edit</knod-button>
                @if (record.status !== 'completed' && record.status !== 'cancelled') {
                  <knod-button variant="primary" size="sm" [icon]="checkIcon" (click)="completeOffboarding(record)">Mark complete</knod-button>
                }
              </div>
            </div>

            <!-- Sep band -->
            <div class="ob-sep-band">
              <div class="ob-sep-date">
                <label>Joining date</label>
                <span>{{ record.joiningDate | date:'d MMM yyyy' }}</span>
              </div>
              <div class="ob-sep-date">
                <label>Initiated</label>
                <span>{{ record.initiatedOn | date:'d MMM yyyy' }}</span>
              </div>
              <div class="ob-sep-date">
                <label>Last working day</label>
                <span [class.ob-lwd-urgent]="record.status !== 'completed'">{{ record.lastWorkingDay | date:'d MMM yyyy' }}</span>
              </div>
              <div class="ob-sep-spacer"></div>
              <div class="ob-sep-prog">
                <div class="ob-prog-bar ob-prog-bar-wide"><div class="ob-prog-fill" [style.width.%]="record.progress"></div></div>
                <span class="ob-sep-prog-text">{{ record.progress }}% done</span>
              </div>
            </div>

            <!-- Tabs -->
            <div class="ob-tabs-row">
              @for (tab of detailTabs; track tab.key) {
                <button
                  class="ob-tab-btn"
                  [class.active]="activeTab() === tab.key"
                  (click)="activeTab.set(tab.key)">
                  {{ tab.label }}
                </button>
              }
            </div>

            <!-- Tab content -->
            <div class="ob-tab-body">
              @switch (activeTab()) {
                @case ('overview') {
                  <ng-container *ngTemplateOutlet="overviewTab; context: { $implicit: record }"></ng-container>
                }
                @case ('tasks') {
                  <ng-container *ngTemplateOutlet="tasksTab; context: { $implicit: record }"></ng-container>
                }
                @case ('approvals') {
                  <ng-container *ngTemplateOutlet="approvalsTab; context: { $implicit: record }"></ng-container>
                }
                @case ('documents') {
                  <ng-container *ngTemplateOutlet="documentsTab; context: { $implicit: record }"></ng-container>
                }
                @case ('timeline') {
                  <ng-container *ngTemplateOutlet="timelineTab; context: { $implicit: record }"></ng-container>
                }
              }
            </div>

            <!-- Quick actions -->
            <div class="ob-quick-actions">
              <button class="ob-action-btn" (click)="sendReminder(record)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Send reminder
              </button>
              <button class="ob-action-btn" (click)="addNote(record)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Add note
              </button>
              <button class="ob-action-btn" (click)="downloadChecklist(record)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download checklist
              </button>
              @if (record.status !== 'completed' && record.status !== 'cancelled') {
                <button class="ob-action-btn ob-action-btn-danger" (click)="cancelOffboarding(record)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Cancel
                </button>
              }
            </div>

          } @else {
            <div class="ob-detail-empty">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <h3>No employee selected</h3>
              <p>Choose an employee from the list to view their offboarding details.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- ───────── TAB TEMPLATES ───────── -->

    <!-- Overview tab -->
    <ng-template #overviewTab let-record>
      <div class="ob-two-col">
        <knod-card title="Employee information">
          <div class="ob-info-grid">
            <div class="ob-info-item"><label>Employee ID</label><span>{{ record.employeeId }}</span></div>
            <div class="ob-info-item"><label>Department</label><span>{{ record.department }}</span></div>
            <div class="ob-info-item"><label>Manager</label><span>{{ record.manager }}</span></div>
            <div class="ob-info-item"><label>Email</label><span class="ob-small-text">{{ record.employeeEmail }}</span></div>
            <div class="ob-info-item"><label>Joining date</label><span>{{ record.joiningDate | date:'d MMM yyyy' }}</span></div>
            <div class="ob-info-item"><label>Last working day</label><span>{{ record.lastWorkingDay | date:'d MMM yyyy' }}</span></div>
            <div class="ob-info-item"><label>Initiated on</label><span>{{ record.initiatedOn | date:'d MMM yyyy' }}</span></div>
            <div class="ob-info-item"><label>Initiated by</label><span>{{ record.initiatedBy }}</span></div>
            @if (record.noticePeriod) {
              <div class="ob-info-item"><label>Notice period</label><span>{{ record.noticePeriod }}</span></div>
            }
            @if (record.noticeStatus) {
              <div class="ob-info-item"><label>Notice status</label><span>{{ record.noticeStatus }}</span></div>
            }
          </div>
          @if (record.reason) {
            <div class="ob-reason-box">
              <strong>Reason:</strong> {{ record.reason }}
            </div>
          }
          @if (record.hrNotes) {
            <div class="ob-reason-box ob-notes-box">
              <strong>HR notes:</strong> {{ record.hrNotes }}
            </div>
          }
        </knod-card>

        <knod-card title="Task progress by category">
          <div class="ob-progress-wrap">
            <div class="ob-circ-wrap">
              <div class="ob-circ">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-slate-200)" stroke-width="3"/>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-primary-500)" stroke-width="3"
                    [attr.stroke-dasharray]="record.progress + ',100'" stroke-linecap="round" transform="rotate(-90 18 18)"/>
                </svg>
                <span class="ob-circ-val">{{ record.progress }}%</span>
              </div>
            </div>
            <div class="ob-cat-rows">
              @for (cat of getCategoryProgress(record); track cat.name) {
                <div class="ob-cat-row">
                  <span class="ob-cat-label">{{ cat.name }}</span>
                  <div class="ob-cat-bar"><div class="ob-cat-fill" [style.width.%]="cat.progress"></div></div>
                  <span class="ob-cat-count">{{ cat.completed }}/{{ cat.total }}</span>
                </div>
              }
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Tasks tab -->
    <ng-template #tasksTab let-record>
      <div class="ob-section-bar">
        <span class="ob-section-title">{{ getCompletedTaskCount(record) }}/{{ record.tasks.length }} tasks completed</span>
        <div class="ob-filter-btns">
          <button class="ob-filter-btn" [class.active]="taskFilter() === 'all'" (click)="taskFilter.set('all')">All</button>
          <button class="ob-filter-btn" [class.active]="taskFilter() === 'pending'" (click)="taskFilter.set('pending')">Pending</button>
          <button class="ob-filter-btn" [class.active]="taskFilter() === 'completed'" (click)="taskFilter.set('completed')">Completed</button>
        </div>
      </div>
      @for (task of getFilteredTasks(record); track task.id) {
        <div class="ob-task-item" [class.ob-task-done]="task.status === 'completed'" [class.ob-task-blocked]="task.status === 'blocked'">
          <input type="checkbox" class="ob-task-cb" [checked]="task.status === 'completed'" (change)="toggleTask(task)">
          <div class="ob-task-body">
            <div class="ob-task-top">
              <span class="ob-task-title" [class.ob-strikethrough]="task.status === 'completed'">{{ task.title }}</span>
              <knod-badge [color]="getTaskCategoryColor(task.category)" size="sm">{{ task.category }}</knod-badge>
            </div>
            <p class="ob-task-desc">{{ task.description }}</p>
            <div class="ob-task-meta">
              <span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {{ task.assignedTo }}
              </span>
              <span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Due {{ task.dueDate | date:'d MMM yyyy' }}
              </span>
              @if (task.status === 'completed' && task.completedOn) {
                <span class="ob-task-done-label">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Done {{ task.completedOn | date:'d MMM yyyy' }}
                </span>
              } @else {
                <knod-badge [color]="getTaskStatusColor(task.status)" size="sm">{{ task.status | titlecase }}</knod-badge>
              }
            </div>
            @if (task.notes) {
              <div class="ob-task-notes">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                {{ task.notes }}
              </div>
            }
          </div>
        </div>
      }
    </ng-template>

    <!-- Approvals tab -->
    <ng-template #approvalsTab let-record>
      <div class="ob-section-title" style="margin-bottom: 14px">Approval workflow</div>
      @for (approval of record.approvals; track approval.role; let i = $index) {
        <div class="ob-appr-item" [class.ob-appr-done]="approval.status === 'completed'">
          <div class="ob-appr-icon" [class.done]="approval.status === 'completed'" [class.pending]="approval.status === 'pending'">
            @if (approval.status === 'completed') {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            } @else {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            }
          </div>
          <div class="ob-appr-content">
            <span class="ob-appr-role">{{ approval.role }}</span>
            <span class="ob-appr-sub">
              @if (approval.status === 'completed') {
                Approved by {{ approval.approvedBy }} · {{ approval.approvedOn | date:'d MMM yyyy' }}
              } @else {
                Awaiting approval
              }
            </span>
          </div>
          @if (approval.status === 'pending') {
            <knod-button variant="outline" size="sm" (click)="approveItem(record, i)">Approve</knod-button>
          } @else {
            <knod-badge color="green">Approved</knod-badge>
          }
        </div>
      }
    </ng-template>

    <!-- Documents tab -->
    <ng-template #documentsTab let-record>
      <div class="ob-section-bar">
        <span class="ob-section-title">Offboarding documents</span>
        <knod-button variant="outline" size="sm" [icon]="plusIcon" (click)="addDocument(record)">Add document</knod-button>
      </div>
      @for (doc of record.documents; track doc.name; let i = $index) {
        <div class="ob-doc-item" [class.ob-doc-issued]="doc.status === 'issued'">
          <div class="ob-doc-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="ob-doc-info">
            <span class="ob-doc-name">{{ doc.name }}</span>
            @if (doc.issuedOn) {
              <span class="ob-doc-date">Issued on {{ doc.issuedOn | date:'d MMM yyyy' }}</span>
            } @else {
              <span class="ob-doc-date">Not yet issued</span>
            }
          </div>
          <knod-badge [color]="doc.status === 'issued' ? 'green' : 'slate'">{{ doc.status | titlecase }}</knod-badge>
          @if (doc.status !== 'issued') {
            <knod-button variant="outline" size="sm" (click)="issueDocument(record, i)">Issue</knod-button>
          }
        </div>
      }
    </ng-template>

    <!-- Timeline tab -->
    <ng-template #timelineTab let-record>
      <div class="ob-section-title" style="margin-bottom: 14px">Offboarding timeline</div>
      <div class="ob-timeline">
        @for (step of getTimelineSteps(record); track step.title) {
          <div class="ob-tl-item">
            <div class="ob-tl-dot" [class.done]="step.done" [class.active]="step.active && !step.done">
              @if (step.done) {
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              } @else if (step.active) {
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
              } @else {
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              }
            </div>
            <div class="ob-tl-content">
              <span class="ob-tl-title">{{ step.title }}</span>
              @if (step.date) { <span class="ob-tl-date">{{ step.date | date:'d MMM yyyy' }}</span> }
              <span class="ob-tl-desc">{{ step.desc }}</span>
            </div>
          </div>
        }
      </div>
    </ng-template>

    <!-- ───────── INITIATE OFFBOARDING MODAL ───────── -->
    @if (showModal()) {
      <div class="ob-modal-overlay" (click)="closeModalOutside($event)">
        <div class="ob-modal" (click)="$event.stopPropagation()">

          <div class="ob-modal-header">
            <div class="ob-modal-header-content">
              <h2 class="ob-modal-title">Initiate Offboarding</h2>
              <span class="ob-modal-step-label">{{ stepLabels[modalStep() - 1] }}</span>
            </div>
            <button class="ob-modal-close-btn" (click)="closeModal()" aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Step indicator -->
          <div class="ob-step-bar">
            @for (label of stepLabels; track label; let i = $index) {
              <div class="ob-step-dot">
                <div class="ob-step-circle"
                  [class.done]="i + 1 < modalStep()"
                  [class.active]="i + 1 === modalStep()"
                  [class.inactive]="i + 1 > modalStep()">
                  @if (i + 1 < modalStep()) {
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else {
                    {{ i + 1 }}
                  }
                </div>
                <span class="ob-step-label" [class.active]="i + 1 === modalStep()">{{ label }}</span>
              </div>
              @if (i < stepLabels.length - 1) {
                <div class="ob-step-line" [class.done]="i + 1 < modalStep()"></div>
              }
            }
          </div>

          <div class="ob-modal-body">

            <!-- Step 1: Employee info -->
            @if (modalStep() === 1) {
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Employee ID <span class="ob-required">*</span></label>
                  <input [(ngModel)]="formData().employeeId" placeholder="e.g. EMP-0234">
                </div>
                <div class="ob-form-field">
                  <label>Full name <span class="ob-required">*</span></label>
                  <input [(ngModel)]="formData().employeeName" placeholder="Full legal name">
                </div>
              </div>
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Work email <span class="ob-required">*</span></label>
                  <input [(ngModel)]="formData().employeeEmail" placeholder="name@company.com" type="email">
                </div>
                <div class="ob-form-field">
                  <label>Department <span class="ob-required">*</span></label>
                  <select [(ngModel)]="formData().department">
                    <option value="">Select…</option>
                    @for (d of departments; track d) { <option [value]="d">{{ d }}</option> }
                  </select>
                </div>
              </div>
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Position / Role <span class="ob-required">*</span></label>
                  <input [(ngModel)]="formData().position" placeholder="Job title">
                </div>
                <div class="ob-form-field">
                  <label>Reporting manager <span class="ob-required">*</span></label>
                  <input [(ngModel)]="formData().manager" placeholder="Manager full name">
                </div>
              </div>
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Date of joining</label>
                  <input [(ngModel)]="formData().joiningDate" type="date">
                </div>
                <div class="ob-form-field">
                  <label>Manager email</label>
                  <input [(ngModel)]="formData().managerEmail" placeholder="manager@company.com" type="email">
                </div>
              </div>
            }

            <!-- Step 2: Separation details -->
            @if (modalStep() === 2) {
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Separation type <span class="ob-required">*</span></label>
                  <select [(ngModel)]="formData().separationType">
                    <option value="">Select…</option>
                    @for (t of separationTypes; track t) { <option [value]="t">{{ t }}</option> }
                  </select>
                </div>
                <div class="ob-form-field">
                  <label>Last working day <span class="ob-required">*</span></label>
                  <input [(ngModel)]="formData().lastWorkingDay" type="date">
                </div>
              </div>
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Notice period</label>
                  <input [(ngModel)]="formData().noticePeriod" placeholder="e.g. 60 days">
                </div>
                <div class="ob-form-field">
                  <label>Notice period status</label>
                  <select [(ngModel)]="formData().noticeStatus">
                    <option value="">Select…</option>
                    @for (s of noticeStatuses; track s) { <option [value]="s">{{ s }}</option> }
                  </select>
                </div>
              </div>
              <div class="ob-form-row ob-form-row-single">
                <div class="ob-form-field">
                  <label>Reason for separation</label>
                  <textarea [(ngModel)]="formData().reason" placeholder="Brief description of reason for leaving…" rows="3"></textarea>
                </div>
              </div>
              <div class="ob-form-row">
                <div class="ob-form-field">
                  <label>Resignation letter received</label>
                  <select [(ngModel)]="formData().resignationLetterReceived">
                    <option value="">Select…</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
                <div class="ob-form-field">
                  <label>Exit interview required</label>
                  <select [(ngModel)]="formData().exitInterviewRequired">
                    <option value="">Select…</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              <div class="ob-form-row ob-form-row-single">
                <div class="ob-form-field">
                  <label>Additional HR notes</label>
                  <textarea [(ngModel)]="formData().hrNotes" placeholder="Any additional context, instructions, or flags…" rows="2"></textarea>
                </div>
              </div>
            }

            <!-- Step 3: Task setup -->
            @if (modalStep() === 3) {
              <p class="ob-form-hint">Select tasks to include in this offboarding checklist. You can adjust assignees and due dates after creating the record.</p>
              @for (tmpl of taskTemplates; track tmpl.id) {
                <div class="ob-task-tmpl">
                  <input type="checkbox" [id]="'tmpl-' + tmpl.id" [checked]="formData().selectedTasks[tmpl.id]" (change)="toggleTemplate(tmpl.id, $any($event.target).checked)">
                  <label [for]="'tmpl-' + tmpl.id" class="ob-task-tmpl-label">
                    <span class="ob-task-tmpl-title">{{ tmpl.title }}</span>
                    <span class="ob-task-tmpl-meta">{{ tmpl.description }} · Assigned to: {{ tmpl.assignedTo }}</span>
                  </label>
                  <knod-badge [color]="getTaskCategoryColor(tmpl.category)" size="sm">{{ tmpl.category }}</knod-badge>
                </div>
              }
              <div class="ob-form-divider">
                <span>Approvals (auto-included in all workflows)</span>
              </div>
              @for (a of autoApprovals; track a) {
                <div class="ob-task-tmpl ob-task-tmpl-disabled">
                  <input type="checkbox" checked disabled>
                  <label class="ob-task-tmpl-label">
                    <span class="ob-task-tmpl-title">{{ a }}</span>
                    <span class="ob-task-tmpl-meta">Automatically added to every offboarding record</span>
                  </label>
                </div>
              }
            }

            <!-- Step 4: Review -->
            @if (modalStep() === 4) {
              <div class="ob-review-section">
                <div class="ob-review-label">Employee details</div>
                @for (row of getReviewEmployeeRows(); track row.key) {
                  <div class="ob-review-row">
                    <span>{{ row.key }}</span>
                    <span>{{ row.val || '—' }}</span>
                  </div>
                }
              </div>
              <div class="ob-review-section">
                <div class="ob-review-label">Separation details</div>
                @for (row of getReviewSeparationRows(); track row.key) {
                  <div class="ob-review-row">
                    <span>{{ row.key }}</span>
                    <span>{{ row.val || '—' }}</span>
                  </div>
                }
                @if (formData().reason) {
                  <div class="ob-reason-box" style="margin-top: 8px">{{ formData().reason }}</div>
                }
              </div>
              <div class="ob-review-section">
                <div class="ob-review-label">Tasks included</div>
                <div class="ob-review-tasks">
                  @for (tmpl of taskTemplates; track tmpl.id) {
                    @if (formData().selectedTasks[tmpl.id]) {
                      <knod-badge [color]="getTaskCategoryColor(tmpl.category)" size="sm">{{ tmpl.title }}</knod-badge>
                    }
                  }
                </div>
              </div>
              <div class="ob-submit-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Submitting will create the offboarding record, notify the manager and relevant stakeholders, and start the approval workflow.
              </div>
            }

          </div>

          <div class="ob-modal-footer">
            @if (modalStep() > 1) {
              <knod-button variant="outline" (click)="prevStep()">← Back</knod-button>
            } @else {
              <knod-button variant="outline" (click)="closeModal()">Cancel</knod-button>
            }
            @if (modalStep() < 4) {
              <knod-button variant="primary" (click)="nextStep()">Next →</knod-button>
            } @else {
              <knod-button variant="primary" [icon]="checkIcon" (click)="submitOffboarding()">Initiate offboarding</knod-button>
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    /* ─── Page shell ─── */
    .ob-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      background: #F3F6FB;
      padding: 32px;
    }

    /* ─── Top bar ─── */
    .ob-topbar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }
    .ob-title {
      font-size: 36px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 4px;
    }
    .ob-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }
    .ob-topbar-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* ─── Stats ─── */
    .ob-stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    @media (max-width: 1024px) {
      .ob-stats-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .ob-stats-row { grid-template-columns: 1fr; }
    }
    .ob-stat-card {
      background: white;
      border-radius: 24px;
      padding: 24px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
      transition: all 200ms ease;
    }
    .ob-stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
    }
    .ob-stat-val { font-size: 28px; font-weight: 700; color: #0F172A; }
    .ob-stat-lbl { font-size: 14px; color: #64748B; margin-top: 4px; }
    .ob-stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; }

    /* ─── Main layout ─── */
    .ob-main {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
      flex: 1;
      min-height: 0;
    }
    @media (max-width: 1200px) {
      .ob-main { grid-template-columns: 280px 1fr; gap: 16px; }
    }
    @media (max-width: 1024px) {
      .ob-main { grid-template-columns: 1fr; }
    }

    /* ─── Sidebar ─── */
    .ob-sidebar {
      background: white;
      border-radius: 24px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ob-sidebar-search { padding: 20px; border-bottom: 1px solid #E5EAF3; }
    .ob-sidebar-filters {
      display: flex;
      gap: 8px;
      padding: 16px 20px;
      border-bottom: 1px solid #E5EAF3;
    }
    .ob-fchip {
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
      background: #F1F5F9;
      color: #64748B;
      border: none;
      cursor: pointer;
      transition: all 200ms ease;
    }
    .ob-fchip:hover { background: #E5EAF3; color: #0F172A; }
    .ob-fchip.active { background: #3B82F6; color: white; }
    .ob-emp-list { flex: 1; overflow-y: auto; }
    .ob-emp-item {
      padding: 16px 20px;
      border-bottom: 1px solid #E5EAF3;
      cursor: pointer;
      transition: all 200ms ease;
    }
    .ob-emp-item:hover { background: #F8FAFC; }
    .ob-emp-item.active {
      background: #EFF6FF;
      border-left: 3px solid #3B82F6;
    }
    .ob-emp-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .ob-emp-info { flex: 1; min-width: 0; }
    .ob-emp-name { font-size: 14px; font-weight: 600; color: #0F172A; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ob-emp-role { font-size: 12px; color: #64748B; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ob-emp-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .ob-emp-lwd { font-size: 12px; color: #64748B; display: flex; align-items: center; gap: 6px; }
    .ob-emp-prog { display: flex; align-items: center; gap: 10px; }
    .ob-emp-prog-val { font-size: 12px; color: #64748B; }
    .ob-emp-prog-bar { flex: 1; height: 6px; background: #E5EAF3; border-radius: 3px; overflow: hidden; }
    .ob-emp-prog-fill { height: 100%; background: #3B82F6; border-radius: 3px; transition: width 300ms ease; }
    .ob-emp-tasks { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-top: 1px solid #E5EAF3; }
    .ob-emp-task-chip { font-size: 11px; padding: 4px 10px; border-radius: 999px; font-weight: 500; }
    .ob-emp-task-chip.hr { background: #EFF6FF; color: #3B82F6; }
    .ob-emp-task-chip.it { background: #F3E8FF; color: #8B5CF6; }
    .ob-emp-task-chip.finance { background: #DCFCE7; color: #22C55E; }

    /* ─── Detail panel ─── */
    .ob-detail {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: white;
      border-radius: 24px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }
    .ob-detail-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: var(--color-slate-400);
      text-align: center;
      padding: 60px 20px;
    }
    .ob-detail-empty h3 { font-size: 15px; font-weight: 600; color: var(--color-slate-700); margin: 0; }
    .ob-detail-empty p { font-size: 13px; color: var(--color-slate-500); margin: 0; }

    /* ─── Record header ─── */
    .ob-rec-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 20px;
      background: white;
      border-bottom: 1px solid var(--color-slate-100);
    }
    .ob-rec-header-info { flex: 1; min-width: 0; }
    .ob-rec-name { font-size: 17px; font-weight: 600; color: var(--color-slate-900); margin: 0 0 2px; }
    .ob-rec-role { font-size: 13px; color: var(--color-slate-500); margin: 0 0 8px; }
    .ob-rec-badges { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
    .ob-rec-meta {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .ob-rec-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--color-slate-500);
    }
    .ob-rec-header-actions { display: flex; gap: 6px; flex-shrink: 0; align-items: flex-start; }

    /* ─── Sep band ─── */
    .ob-sep-band {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      padding: 12px 20px;
      background: var(--color-slate-100);
      border-bottom: 1px solid var(--color-slate-200);
    }
    .ob-sep-date { display: flex; flex-direction: column; gap: 2px; }
    .ob-sep-date label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-slate-500); font-weight: 500; }
    .ob-sep-date span { font-size: 13px; font-weight: 500; color: var(--color-slate-700); }
    .ob-lwd-urgent { color: var(--color-red-600) !important; }
    .ob-sep-spacer { flex: 1; }
    .ob-sep-prog { display: flex; align-items: center; gap: 10px; }
    .ob-prog-bar-wide { width: 120px; height: 4px; background: var(--color-slate-300); border-radius: 2px; overflow: hidden; flex: none; }
    .ob-sep-prog-text { font-size: 12px; font-weight: 500; color: var(--color-slate-700); }

    /* ─── Tabs ─── */
    .ob-tabs-row {
      display: flex;
      gap: 0;
      background: white;
      border-bottom: 1px solid var(--color-slate-200);
      padding: 0 20px;
      overflow-x: auto;
    }
    .ob-tab-btn {
      padding: 10px 16px;
      font-size: 13px;
      color: var(--color-slate-500);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);
    }
    .ob-tab-btn:hover { color: var(--color-slate-700); }
    .ob-tab-btn.active { color: var(--color-primary-600); border-bottom-color: var(--color-primary-500); font-weight: 600; }

    /* ─── Tab body ─── */
    .ob-tab-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }

    /* ─── Overview tab ─── */
    .ob-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 900px) { .ob-two-col { grid-template-columns: 1fr; } }
    .ob-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ob-info-item label { font-size: 11px; color: var(--color-slate-500); display: block; margin-bottom: 3px; }
    .ob-info-item span { font-size: 13px; font-weight: 500; color: var(--color-slate-800); }
    .ob-small-text { font-size: 12px !important; }
    .ob-reason-box {
      margin-top: 12px;
      padding: 10px 12px;
      background: var(--color-slate-100);
      border-radius: 6px;
      font-size: 12px;
      color: var(--color-slate-600);
      font-style: italic;
    }
    .ob-notes-box { background: var(--color-amber-50); border: 1px solid var(--color-amber-200); }
    .ob-progress-wrap { display: flex; align-items: center; gap: 20px; }
    .ob-circ-wrap { flex-shrink: 0; }
    .ob-circ { width: 72px; height: 72px; position: relative; }
    .ob-circ svg { width: 100%; height: 100%; }
    .ob-circ-val {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: var(--color-slate-900);
    }
    .ob-cat-rows { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .ob-cat-row { display: flex; align-items: center; gap: 8px; }
    .ob-cat-label { width: 52px; font-size: 11px; color: var(--color-slate-500); text-align: right; }
    .ob-cat-bar { flex: 1; height: 5px; background: var(--color-slate-200); border-radius: 3px; overflow: hidden; }
    .ob-cat-fill { height: 100%; background: var(--color-primary-500); border-radius: 3px; }
    .ob-cat-count { font-size: 10px; color: var(--color-slate-500); width: 28px; }

    /* ─── Tasks tab ─── */
    .ob-section-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .ob-section-title { font-size: 13px; font-weight: 600; color: var(--color-slate-800); }
    .ob-filter-btns { display: flex; gap: 6px; }
    .ob-filter-btn {
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
      background: var(--color-slate-100);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .ob-filter-btn.active { background: var(--color-primary-500); color: white; }
    .ob-task-item {
      display: flex;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      margin-bottom: 8px;
      background: white;
      transition: all var(--transition-fast);
    }
    .ob-task-item:hover { background: var(--color-slate-50); }
    .ob-task-done { background: var(--color-success-50) !important; border-color: var(--color-success-200) !important; }
    .ob-task-blocked { background: var(--color-red-50) !important; border-color: var(--color-red-200) !important; }
    .ob-task-cb { width: 16px; height: 16px; margin-top: 2px; flex-shrink: 0; cursor: pointer; accent-color: var(--color-primary-500); }
    .ob-task-body { flex: 1; }
    .ob-task-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
    .ob-task-title { font-size: 13px; font-weight: 500; color: var(--color-slate-900); }
    .ob-strikethrough { text-decoration: line-through; color: var(--color-slate-400) !important; }
    .ob-task-desc { font-size: 12px; color: var(--color-slate-500); margin: 0 0 8px; }
    .ob-task-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .ob-task-meta span { font-size: 11px; color: var(--color-slate-500); display: flex; align-items: center; gap: 3px; }
    .ob-task-done-label { color: var(--color-success-600) !important; }
    .ob-task-notes {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      margin-top: 8px;
      padding: 7px 10px;
      background: var(--color-slate-100);
      border-radius: 5px;
      font-size: 11px;
      color: var(--color-slate-600);
    }

    /* ─── Approvals tab ─── */
    .ob-appr-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      margin-bottom: 8px;
      background: white;
    }
    .ob-appr-done { background: var(--color-success-50) !important; border-color: var(--color-success-200) !important; }
    .ob-appr-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ob-appr-icon.done { background: var(--color-success-100); color: var(--color-success-600); }
    .ob-appr-icon.pending { background: var(--color-slate-100); color: var(--color-slate-500); }
    .ob-appr-content { flex: 1; }
    .ob-appr-role { font-size: 13px; font-weight: 600; color: var(--color-slate-900); display: block; }
    .ob-appr-sub { font-size: 11px; color: var(--color-slate-500); display: block; margin-top: 2px; }

    /* ─── Documents tab ─── */
    .ob-doc-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      margin-bottom: 8px;
      background: white;
    }
    .ob-doc-issued { background: var(--color-success-50) !important; border-color: var(--color-success-200) !important; }
    .ob-doc-icon {
      width: 34px;
      height: 34px;
      border-radius: 6px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ob-doc-info { flex: 1; }
    .ob-doc-name { font-size: 13px; font-weight: 500; color: var(--color-slate-900); display: block; }
    .ob-doc-date { font-size: 11px; color: var(--color-slate-500); display: block; margin-top: 2px; }

    /* ─── Timeline tab ─── */
    .ob-timeline { padding-left: 20px; position: relative; }
    .ob-timeline::before {
      content: '';
      position: absolute;
      left: 11px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--color-slate-200);
    }
    .ob-tl-item { display: flex; gap: 12px; position: relative; padding-bottom: 20px; }
    .ob-tl-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--color-slate-200);
      color: var(--color-slate-500);
      position: relative;
      z-index: 1;
      border: 1px solid var(--color-slate-300);
    }
    .ob-tl-dot.done { background: var(--color-success-500); color: white; border-color: var(--color-success-600); }
    .ob-tl-dot.active { background: var(--color-primary-100); color: var(--color-primary-600); border-color: var(--color-primary-400); }
    .ob-tl-content { flex: 1; padding-top: 3px; }
    .ob-tl-title { font-size: 13px; font-weight: 600; color: var(--color-slate-900); display: block; }
    .ob-tl-date { font-size: 11px; color: var(--color-slate-500); display: block; margin-top: 2px; }
    .ob-tl-desc { font-size: 11px; color: var(--color-slate-400); display: block; margin-top: 2px; }

    /* ─── Quick actions ─── */
    .ob-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 20px;
      background: white;
      border-top: 1px solid var(--color-slate-100);
    }
    .ob-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
      background: white;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .ob-action-btn:hover { background: var(--color-slate-50); border-color: var(--color-slate-300); }
    .ob-action-btn-danger { color: var(--color-red-600); border-color: var(--color-red-300); }
    .ob-action-btn-danger:hover { background: var(--color-red-50); }

    /* ─── Modal ─── */
    .ob-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 24px;
    }

    .ob-modal {
      background: white;
      border-radius: 28px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: modalEntry 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalEntry {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .ob-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 28px;
      border-bottom: 1px solid #E5EAF3;
      flex-shrink: 0;
    }
    .ob-modal-title { font-size: 20px; font-weight: 700; color: #0F172A; margin: 0; }
    .ob-modal-step-label { font-size: 14px; color: #64748B; margin-top: 4px; }
    .ob-modal-header-content { display: flex; flex-direction: column; }
    .ob-modal-close-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F1F5F9;
      border: none;
      border-radius: 10px;
      color: #64748B;
      cursor: pointer;
      transition: all 200ms ease;
    }
    .ob-modal-close-btn:hover {
      background: #E5EAF3;
      color: #0F172A;
    }
    .ob-modal-body { flex: 1; overflow-y: auto; padding: 24px 28px; }
    .ob-modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 20px 28px;
      border-top: 1px solid #E5EAF3;
      background: #F3F6FB;
      flex-shrink: 0;
    }

    /* ─── Step bar ─── */
    .ob-step-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 28px;
      border-bottom: 1px solid #E5EAF3;
      flex-shrink: 0;
      flex-wrap: nowrap;
      gap: 8px;
    }
    .ob-step-dot { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .ob-step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
      transition: all 200ms ease;
    }
    .ob-step-circle.done { background: #DCFCE7; color: #22C55E; border: 2px solid #22C55E; }
    .ob-step-circle.active { background: #3B82F6; color: white; border: 2px solid #3B82F6; }
    .ob-step-circle.inactive { background: #F1F5F9; color: #64748B; border: 2px solid #E5EAF3; }
    .ob-step-label { font-size: 12px; color: #64748B; white-space: nowrap; font-weight: 500; }
    .ob-step-label.active { color: #0F172A; font-weight: 600; }
    .ob-step-line { flex: 1; height: 2px; background: #E5EAF3; max-width: 60px; transition: all 200ms ease; }
    .ob-step-line.done { background: #22C55E; }

    /* ─── Form fields ─── */
    .ob-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .ob-form-row-single { grid-template-columns: 1fr; }
    .ob-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #0F172A;
      margin-bottom: 6px;
    }
    .ob-required { color: #EF4444; }
    .ob-form-field input,
    .ob-form-field select,
    .ob-form-field textarea {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      font-size: 14px;
      color: #0F172A;
      background: white;
      border: 2px solid #CBD5E1;
      border-radius: 14px;
      font-family: inherit;
      transition: all 200ms ease;
      outline: none;
    }
    .ob-form-field input::placeholder,
    .ob-form-field textarea::placeholder {
      color: #94A3B8;
    }
    .ob-form-field input:hover,
    .ob-form-field select:hover,
    .ob-form-field textarea:hover {
      border-color: #94A3B8;
    }
    .ob-form-field input:focus,
    .ob-form-field select:focus,
    .ob-form-field textarea:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
    .ob-form-field textarea { 
      height: auto;
      min-height: 100px;
      padding: 12px 16px;
      resize: vertical; 
    }
    .ob-form-hint { font-size: 14px; color: #64748B; margin-bottom: 16px; line-height: 1.5; }
    .ob-form-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 20px 0 16px;
    }
    .ob-form-divider span { font-size: 12px; font-weight: 500; color: #64748B; white-space: nowrap; }
    .ob-form-divider::before,
    .ob-form-divider::after { content: ''; flex: 1; height: 1px; background: #E5EAF3; }

    /* ─── Task template picker ─── */
    .ob-task-tmpl {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border: 2px solid #E5EAF3;
      border-radius: 14px;
      margin-bottom: 8px;
      background: white;
      transition: all 200ms ease;
      cursor: pointer;
    }
    .ob-task-tmpl:hover {
      border-color: #CBD5E1;
      transform: translateY(-2px);
    }
    .ob-task-tmpl input[type="checkbox"] { 
      margin-top: 2px; 
      flex-shrink: 0; 
      width: 18px;
      height: 18px;
      accent-color: #3B82F6;
      cursor: pointer;
    }
    .ob-task-tmpl-label { flex: 1; cursor: pointer; }
    .ob-task-tmpl-title { font-size: 14px; font-weight: 500; color: #0F172A; display: block; margin-bottom: 4px; }
    .ob-task-tmpl-meta { font-size: 12px; color: #64748B; display: block; line-height: 1.4; }
    .ob-task-tmpl-disabled { opacity: 0.6; }
    .ob-task-tmpl-disabled input { cursor: not-allowed; }

    /* ─── Review step ─── */
    .ob-review-section { 
      margin-bottom: 20px;
      padding: 20px;
      background: #F3F6FB;
      border-radius: 16px;
    }
    .ob-review-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 12px;
    }
    .ob-review-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #E5EAF3;
      font-size: 14px;
    }
    .ob-review-row:last-child { border-bottom: none; }
    .ob-review-row span:first-child { color: #64748B; }
    .ob-review-row span:last-child { font-weight: 500; color: #0F172A; }
    .ob-review-tasks { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .ob-submit-notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-radius: 14px;
      font-size: 14px;
      color: #2563EB;
      margin-top: 8px;
    }
    .ob-submit-notice svg { flex-shrink: 0; margin-top: 2px; }
  `]
})
export class OffboardingComponent {
  private router: Router;

  readonly downloadIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  readonly plusIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  readonly editIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  readonly checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
  readonly closeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  readonly stepLabels = STEP_LABELS;
  readonly taskTemplates = TASK_TEMPLATES;
  readonly departments = ['Engineering', 'Design', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'Legal'];
  readonly separationTypes = ['Resignation', 'Termination', 'Contract End', 'Retirement', 'Mutual Separation'];
  readonly noticeStatuses = ['Fully served', 'Partially served', 'Buyout', 'Waived'];
  readonly autoApprovals = ['Manager approval', 'HR approval', 'Finance clearance', 'IT clearance'];

  readonly detailTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'approvals', label: 'Approvals' },
    { key: 'documents', label: 'Documents' },
    { key: 'timeline', label: 'Timeline' },
  ];

  readonly searchQuery = signal('');
  readonly statusFilter = signal('all');
  readonly activeTab = signal('overview');
  readonly taskFilter = signal('all');
  readonly showModal = signal(false);
  readonly modalStep = signal(1);

  private readonly _formData = signal<InitiateFormData>(this.emptyForm());
  readonly formData = this._formData.asReadonly();

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
      noticePeriod: '60 days',
      noticeStatus: 'Fully served',
      exitInterviewRequired: true,
      status: 'in_progress',
      initiatedOn: '2026-06-01',
      initiatedBy: 'HR Team',
      progress: 65,
      reason: 'Personal growth opportunity',
      tasks: [
        { id: 't1', title: 'Knowledge transfer', description: 'Complete documentation and knowledge transfer sessions', category: 'HR', assignedTo: 'Priya Patel', dueDate: '2026-06-10', status: 'completed', completedOn: '2026-06-09', completedBy: 'Priya Patel' },
        { id: 't2', title: 'Project handover', description: 'Hand over all ongoing projects and code repositories', category: 'HR', assignedTo: 'Amit Singh', dueDate: '2026-06-12', status: 'completed', completedOn: '2026-06-11', completedBy: 'Amit Singh' },
        { id: 't3', title: 'Access revocation', description: 'Revoke all system, email, and tool access', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-14', status: 'in_progress', notes: 'Waiting for manager sign-off' },
        { id: 't4', title: 'Asset recovery', description: 'Collect laptop, ID card, and peripherals', category: 'IT', assignedTo: 'IT Asset Team', dueDate: '2026-06-14', status: 'pending' },
        { id: 't5', title: 'Final settlement', description: 'Process last payslip, PF, and gratuity payout', category: 'Finance', assignedTo: 'Finance Team', dueDate: '2026-06-15', status: 'pending' },
        { id: 't6', title: 'Exit interview', description: 'Conduct structured exit interview and record feedback', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-06-15', status: 'pending' },
      ],
      documents: [
        { name: 'Experience letter', status: 'issued', issuedOn: '2026-06-10' },
        { name: 'Relieving letter', status: 'issued', issuedOn: '2026-06-10' },
        { name: 'Full & final settlement', status: 'pending' },
        { name: 'Exit interview form', status: 'pending' },
        { name: 'NOC from IT', status: 'pending' },
        { name: 'NOC from Finance', status: 'pending' },
      ],
      approvals: [
        { role: 'Manager approval', status: 'completed', approvedBy: 'Priya Patel', approvedOn: '2026-06-02' },
        { role: 'HR approval', status: 'completed', approvedBy: 'HR Team', approvedOn: '2026-06-03' },
        { role: 'Finance clearance', status: 'pending' },
        { role: 'IT clearance', status: 'pending' },
      ],
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
      noticePeriod: '30 days',
      noticeStatus: 'Fully served',
      exitInterviewRequired: true,
      status: 'initiated',
      initiatedOn: '2026-06-05',
      initiatedBy: 'HR Team',
      progress: 20,
      reason: 'Relocating to another city',
      tasks: [
        { id: 't1', title: 'Knowledge transfer', description: 'Complete design documentation and handover', category: 'HR', assignedTo: 'Rahul Verma', dueDate: '2026-06-15', status: 'completed', completedOn: '2026-06-07' },
        { id: 't2', title: 'Design file handover', description: 'Transfer all Figma/design files to team', category: 'HR', assignedTo: 'Sneha Gupta', dueDate: '2026-06-17', status: 'pending' },
        { id: 't3', title: 'Access revocation', description: 'Revoke all system and tool access', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-19', status: 'pending' },
        { id: 't4', title: 'Asset recovery', description: 'Collect laptop, ID card, and peripherals', category: 'IT', assignedTo: 'IT Asset Team', dueDate: '2026-06-19', status: 'pending' },
        { id: 't5', title: 'Final settlement', description: 'Process last payslip and payout', category: 'Finance', assignedTo: 'Finance Team', dueDate: '2026-06-20', status: 'pending' },
      ],
      documents: [
        { name: 'Experience letter', status: 'pending' },
        { name: 'Relieving letter', status: 'pending' },
        { name: 'Full & final settlement', status: 'pending' },
        { name: 'Exit interview form', status: 'pending' },
      ],
      approvals: [
        { role: 'Manager approval', status: 'pending' },
        { role: 'HR approval', status: 'pending' },
        { role: 'Finance clearance', status: 'pending' },
        { role: 'IT clearance', status: 'pending' },
      ],
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
      reason: 'Contract period concluded',
      tasks: [
        { id: 't1', title: 'Knowledge transfer', description: 'Complete knowledge handover documentation', category: 'HR', assignedTo: 'Director', dueDate: '2026-05-25', status: 'completed', completedOn: '2026-05-24', completedBy: 'Director' },
        { id: 't2', title: 'Access revocation', description: 'Revoke all system and tool access', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-05-28', status: 'completed', completedOn: '2026-05-27', completedBy: 'IT Admin' },
        { id: 't3', title: 'Asset recovery', description: 'Collect all IT assets', category: 'IT', assignedTo: 'IT Asset Team', dueDate: '2026-05-28', status: 'completed', completedOn: '2026-05-28', completedBy: 'IT Asset Team' },
        { id: 't4', title: 'Final settlement', description: 'Process final payslip and settlement', category: 'Finance', assignedTo: 'Finance Team', dueDate: '2026-05-30', status: 'completed', completedOn: '2026-05-29', completedBy: 'Finance Team' },
      ],
      documents: [
        { name: 'Experience letter', status: 'issued', issuedOn: '2026-05-29' },
        { name: 'Relieving letter', status: 'issued', issuedOn: '2026-05-29' },
        { name: 'Full & final settlement', status: 'issued', issuedOn: '2026-05-30' },
      ],
      approvals: [
        { role: 'Manager approval', status: 'completed', approvedBy: 'Director', approvedOn: '2026-05-16' },
        { role: 'HR approval', status: 'completed', approvedBy: 'HR Team', approvedOn: '2026-05-17' },
        { role: 'Finance clearance', status: 'completed', approvedBy: 'Finance Team', approvedOn: '2026-05-29' },
        { role: 'IT clearance', status: 'completed', approvedBy: 'IT Admin', approvedOn: '2026-05-28' },
      ],
    },
  ]);

  readonly selectedRecord = signal<OffboardingRecord | null>(null);

  readonly filteredRecords = computed(() => {
    let result = this.records();
    const query = this.searchQuery().toLowerCase();
    const filter = this.statusFilter();

    if (query) {
      result = result.filter(r =>
        r.employeeName.toLowerCase().includes(query) ||
        r.employeeEmail.toLowerCase().includes(query) ||
        r.employeeId.toLowerCase().includes(query)
      );
    }

    if (filter === 'active') {
      result = result.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
    } else if (filter === 'completed') {
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

  // ─── List actions ───

  selectRecord(record: OffboardingRecord): void {
    this.selectedRecord.set(record);
    this.activeTab.set('overview');
  }

  quickFilter(status: string): void {
    this.statusFilter.set(this.statusFilter() === status ? 'all' : status);
  }

  // ─── Detail helpers ───

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
        progress: tasks.length ? (completed / tasks.length) * 100 : 0,
      };
    });
  }

  getFilteredTasks(record: OffboardingRecord): OffboardingTask[] {
    const filter = this.taskFilter();
    if (filter === 'all') return record.tasks;
    if (filter === 'pending') return record.tasks.filter(t => t.status !== 'completed');
    return record.tasks.filter(t => t.status === filter);
  }

  getTimelineSteps(record: OffboardingRecord) {
    const doneApprovals = record.approvals.filter(a => a.status === 'completed').length;
    const doneDocs = record.documents.filter(d => d.status === 'issued').length;
    const doneTasks = this.getCompletedTaskCount(record);
    return [
      {
        title: 'Offboarding initiated',
        date: record.initiatedOn,
        desc: `Initiated by ${record.initiatedBy}`,
        done: true,
        active: false,
      },
      {
        title: 'Manager & HR approval',
        date: record.approvals.find(a => a.status === 'completed')?.approvedOn || null,
        desc: `${doneApprovals}/${record.approvals.length} approvals done`,
        done: record.approvals.every(a => a.status === 'completed'),
        active: doneApprovals > 0 && doneApprovals < record.approvals.length,
      },
      {
        title: 'Tasks & handover',
        date: null,
        desc: `${doneTasks}/${record.tasks.length} tasks completed`,
        done: doneTasks === record.tasks.length,
        active: doneTasks > 0 && doneTasks < record.tasks.length,
      },
      {
        title: 'Document issuance',
        date: null,
        desc: `${doneDocs}/${record.documents.length} documents issued`,
        done: record.documents.every(d => d.status === 'issued'),
        active: doneDocs > 0 && doneDocs < record.documents.length,
      },
      {
        title: 'Final clearance',
        date: record.lastWorkingDay,
        desc: 'All approvals and documents completed',
        done: record.status === 'completed',
        active: false,
      },
    ];
  }

  // ─── Inline actions ───

  toggleTask(task: OffboardingTask): void {
    const record = this.selectedRecord();
    if (!record) return;

    const records = this.records();
    const ri = records.findIndex(r => r.id === record.id);
    if (ri === -1) return;
    const ti = records[ri].tasks.findIndex(t => t.id === task.id);
    if (ti === -1) return;

    records[ri].tasks[ti].status = task.status === 'completed' ? 'pending' : 'completed';
    if (records[ri].tasks[ti].status === 'completed') {
      records[ri].tasks[ti].completedOn = new Date().toISOString().split('T')[0];
    }
    records[ri].progress = Math.round(
      (records[ri].tasks.filter(t => t.status === 'completed').length / records[ri].tasks.length) * 100
    );
    if (records[ri].progress === 100) records[ri].status = 'completed';

    this.records.set([...records]);
    this.selectedRecord.set(records[ri]);
  }

  approveItem(record: OffboardingRecord, index: number): void {
    const records = this.records();
    const ri = records.findIndex(r => r.id === record.id);
    if (ri === -1) return;

    records[ri].approvals[index] = {
      ...records[ri].approvals[index],
      status: 'completed',
      approvedBy: 'HR Admin',
      approvedOn: new Date().toISOString().split('T')[0],
    };
    if (records[ri].status === 'initiated') records[ri].status = 'in_progress';

    this.records.set([...records]);
    this.selectedRecord.set(records[ri]);
  }

  issueDocument(record: OffboardingRecord, index: number): void {
    const records = this.records();
    const ri = records.findIndex(r => r.id === record.id);
    if (ri === -1) return;

    records[ri].documents[index] = {
      ...records[ri].documents[index],
      status: 'issued',
      issuedOn: new Date().toISOString().split('T')[0],
    };

    this.records.set([...records]);
    this.selectedRecord.set(records[ri]);
  }

  addDocument(record: OffboardingRecord): void {
    const name = window.prompt('Document name:');
    if (!name?.trim()) return;

    const records = this.records();
    const ri = records.findIndex(r => r.id === record.id);
    if (ri === -1) return;

    records[ri].documents = [...records[ri].documents, { name: name.trim(), status: 'pending' }];
    this.records.set([...records]);
    this.selectedRecord.set(records[ri]);
  }

  completeOffboarding(record: OffboardingRecord): void {
    if (!window.confirm(`Mark offboarding for ${record.employeeName} as fully complete?`)) return;

    const records = this.records();
    const ri = records.findIndex(r => r.id === record.id);
    if (ri === -1) return;

    records[ri].status = 'completed';
    records[ri].progress = 100;
    records[ri].tasks.forEach(t => (t.status = 'completed'));

    this.records.set([...records]);
    this.selectedRecord.set(records[ri]);
  }

  cancelOffboarding(record: OffboardingRecord): void {
    if (!window.confirm(`Cancel offboarding for ${record.employeeName}? This cannot be undone.`)) return;

    const records = this.records();
    const ri = records.findIndex(r => r.id === record.id);
    if (ri === -1) return;

    records[ri].status = 'cancelled';
    this.records.set([...records]);
    this.selectedRecord.set(records[ri]);
  }

  editRecord(record: OffboardingRecord): void {
    // TODO: wire up edit form or navigate to edit route
    console.log('Edit record:', record.id);
  }

  sendReminder(record: OffboardingRecord): void {
    window.alert(`Reminder sent to stakeholders for ${record.employeeName}.`);
  }

  addNote(record: OffboardingRecord): void {
    const note = window.prompt('Add a note:');
    if (note?.trim()) window.alert('Note saved.');
  }

  downloadChecklist(record: OffboardingRecord): void {
    window.alert(`Checklist download triggered for ${record.employeeName}.`);
  }

  exportReport(): void {
    window.alert('Export report triggered. Connect to your reporting API.');
  }

  // ─── Color helpers ───

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'slate' | 'violet' | 'red' {
    const map: Record<string, 'green' | 'blue' | 'amber' | 'slate' | 'violet' | 'red'> = {
      initiated: 'blue',
      in_progress: 'amber',
      pending_approval: 'violet',
      completed: 'green',
      cancelled: 'slate',
    };
    return map[status] ?? 'slate';
  }

  getSeparationColor(type: string): 'blue' | 'amber' | 'violet' | 'red' {
    const map: Record<string, 'blue' | 'amber' | 'violet' | 'red'> = {
      Resignation: 'blue',
      Termination: 'red',
      'Contract End': 'violet',
      Retirement: 'amber',
      'Mutual Separation': 'amber',
    };
    return map[type] ?? 'blue';
  }

  getTaskCategoryColor(category: string): 'blue' | 'indigo' | 'green' {
    const map: Record<string, 'blue' | 'indigo' | 'green'> = {
      HR: 'blue',
      IT: 'indigo',
      Finance: 'green',
    };
    return map[category] ?? 'blue';
  }

  getTaskStatusColor(status: string): 'green' | 'amber' | 'red' | 'slate' {
    const map: Record<string, 'green' | 'amber' | 'red' | 'slate'> = {
      completed: 'green',
      in_progress: 'amber',
      blocked: 'red',
      pending: 'slate',
    };
    return map[status] ?? 'slate';
  }

  formatStatus(status: string): string {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // ─── Modal ───

  openInitiateModal(): void {
      console.log('OPEN MODAL CLICKED');
    this._formData.set(this.emptyForm());
    this.modalStep.set(1);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  closeModalOutside(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('ob-modal-overlay')) {
      this.closeModal();
    }
  }

  nextStep(): void {
    const fd = this._formData();
    if (this.modalStep() === 1) {
      if (!fd.employeeId || !fd.employeeName || !fd.employeeEmail || !fd.department || !fd.position || !fd.manager) {
        window.alert('Please fill all required fields before proceeding.');
        return;
      }
    }
    if (this.modalStep() === 2) {
      if (!fd.separationType || !fd.lastWorkingDay) {
        window.alert('Separation type and last working day are required.');
        return;
      }
    }
    if (this.modalStep() === 3) {
      if (!TASK_TEMPLATES.some(t => fd.selectedTasks[t.id])) {
        window.alert('Please select at least one task.');
        return;
      }
    }
    this.modalStep.update(s => s + 1);
  }

  prevStep(): void {
    this.modalStep.update(s => s - 1);
  }

  toggleTemplate(id: string, checked: boolean): void {
    const fd = this._formData();
    this._formData.set({
      ...fd,
      selectedTasks: { ...fd.selectedTasks, [id]: checked },
    });
  }

  submitOffboarding(): void {
    const fd = this._formData();
    const today = new Date().toISOString().split('T')[0];
    const newId = `OFF-${String(this.records().length + 1).padStart(3, '0')}`;

    const selectedTemplates = TASK_TEMPLATES.filter(t => fd.selectedTasks[t.id]);

    const newRecord: OffboardingRecord = {
      id: newId,
      employeeId: fd.employeeId,
      employeeName: fd.employeeName,
      employeeEmail: fd.employeeEmail,
      position: fd.position,
      department: fd.department,
      manager: fd.manager,
      managerEmail: fd.managerEmail,
      joiningDate: fd.joiningDate || today,
      lastWorkingDay: fd.lastWorkingDay,
      separationType: fd.separationType as OffboardingRecord['separationType'],
      noticePeriod: fd.noticePeriod,
      noticeStatus: fd.noticeStatus,
      exitInterviewRequired: fd.exitInterviewRequired === 'Yes',
      resignationLetterReceived: fd.resignationLetterReceived,
      status: 'initiated',
      initiatedOn: today,
      initiatedBy: 'HR Admin',
      progress: 0,
      reason: fd.reason,
      hrNotes: fd.hrNotes,
      tasks: selectedTemplates.map((t, i) => ({
        id: `t${i + 1}`,
        title: t.title,
        description: t.description,
        category: t.category,
        assignedTo: t.assignedTo,
        dueDate: fd.lastWorkingDay,
        status: 'pending',
      })),
      documents: [
        { name: 'Experience letter', status: 'pending' },
        { name: 'Relieving letter', status: 'pending' },
        { name: 'Full & final settlement', status: 'pending' },
        ...(fd.exitInterviewRequired === 'Yes' ? [{ name: 'Exit interview form', status: 'pending' }] : []),
      ],
      approvals: [
        { role: 'Manager approval', status: 'pending' },
        { role: 'HR approval', status: 'pending' },
        { role: 'Finance clearance', status: 'pending' },
        { role: 'IT clearance', status: 'pending' },
      ],
    };

    this.records.update(r => [newRecord, ...r]);
    this.selectedRecord.set(newRecord);
    this.activeTab.set('overview');
    this.closeModal();
    window.alert(`Offboarding initiated for ${fd.employeeName}. Record ID: ${newId}`);
  }

  // ─── Review rows ───

  getReviewEmployeeRows(): Array<{ key: string; val: string }> {
    const fd = this._formData();
    return [
      { key: 'Name', val: fd.employeeName },
      { key: 'Employee ID', val: fd.employeeId },
      { key: 'Email', val: fd.employeeEmail },
      { key: 'Department', val: fd.department },
      { key: 'Position', val: fd.position },
      { key: 'Manager', val: fd.manager },
    ];
  }

  getReviewSeparationRows(): Array<{ key: string; val: string }> {
    const fd = this._formData();
    return [
      { key: 'Type', val: fd.separationType },
      { key: 'Last working day', val: fd.lastWorkingDay },
      { key: 'Notice period', val: fd.noticePeriod },
      { key: 'Notice status', val: fd.noticeStatus },
      { key: 'Resignation letter', val: fd.resignationLetterReceived },
      { key: 'Exit interview', val: fd.exitInterviewRequired },
    ];
  }

  // ─── Helpers ───

  private emptyForm(): InitiateFormData {
    return {
      employeeId: '',
      employeeName: '',
      employeeEmail: '',
      department: '',
      position: '',
      manager: '',
      managerEmail: '',
      joiningDate: '',
      separationType: '',
      lastWorkingDay: '',
      noticePeriod: '',
      noticeStatus: '',
      reason: '',
      resignationLetterReceived: '',
      exitInterviewRequired: '',
      hrNotes: '',
      selectedTasks: Object.fromEntries(TASK_TEMPLATES.map(t => [t.id, t.defaultChecked])),
    };
  }
}