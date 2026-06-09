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

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'high' | 'medium' | 'low';
}

interface OnboardingCandidate {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  joiningDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  assignedTo: string;
  tasks: OnboardingTask[];
}

@Component({
  selector: 'knodtec-onboarding',
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
    <div class="onboarding-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Employee Onboarding</h1>
          <p class="page-subtitle">Manage new employee onboarding and asset provisioning</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="templateIcon">Templates</knod-button>
          <knod-button variant="primary" [icon]="plusIcon">New Onboarding</knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" (click)="filterByStatus('pending')">
          <div class="stat-value">{{ pendingCount() }}</div>
          <div class="stat-label">Pending</div>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('in_progress')">
          <div class="stat-value">{{ inProgressCount() }}</div>
          <div class="stat-label">In Progress</div>
          <div class="stat-indicator amber"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('completed')">
          <div class="stat-value">{{ completedCount() }}</div>
          <div class="stat-label">Completed</div>
          <div class="stat-indicator green"></div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ thisWeekCount() }}</div>
          <div class="stat-label">This Week</div>
          <div class="stat-indicator violet"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left: Candidate List -->
        <div class="list-panel">
          <!-- Filters -->
          <div class="filters-bar">
            <div class="search-wrapper">
              <knod-search 
                placeholder="Search candidates..."
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
                [class.active]="statusFilter() === 'pending'"
                (click)="statusFilter.set('pending')">Pending</button>
              <button 
                class="filter-chip" 
                [class.active]="statusFilter() === 'in_progress'"
                (click)="statusFilter.set('in_progress')">Active</button>
            </div>
          </div>

          <!-- Candidate List -->
          <div class="candidate-list">
            @for (candidate of filteredCandidates(); track candidate.id) {
              <div 
                class="candidate-item"
                [class.selected]="selectedCandidate()?.id === candidate.id"
                (click)="selectCandidate(candidate)">
                <div class="candidate-header">
                  <knod-avatar [name]="candidate.name" size="md"></knod-avatar>
                  <div class="candidate-info">
                    <span class="candidate-name">{{ candidate.name }}</span>
                    <span class="candidate-position">{{ candidate.position }}</span>
                  </div>
                  <knod-badge [color]="getStatusColor(candidate.status)">{{ candidate.status | titlecase }}</knod-badge>
                </div>
                <div class="candidate-meta">
                  <span class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ candidate.joiningDate | date:'mediumDate' }}
                  </span>
                  <span class="meta-separator">•</span>
                  <span class="meta-item">{{ candidate.department }}</span>
                </div>
                <div class="candidate-progress">
                  <div class="progress-info">
                    <span>{{ candidate.progress }}% Complete</span>
                    <span class="task-count">{{ getTaskCount(candidate) }} tasks</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="candidate.progress"></div>
                  </div>
                </div>
              </div>
            }

            @if (filteredCandidates().length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                <h3>No candidates found</h3>
                <p>No onboarding records match your filters.</p>
              </div>
            }
          </div>
        </div>

        <!-- Right: Detail Panel -->
        <div class="detail-panel">
          @if (selectedCandidate(); as candidate) {
            <!-- Candidate Header -->
            <div class="candidate-detail-header">
              <knod-avatar [name]="candidate.name" size="xl"></knod-avatar>
              <div class="detail-info">
                <h2 class="detail-name">{{ candidate.name }}</h2>
                <p class="detail-position">{{ candidate.position }} • {{ candidate.department }}</p>
                <div class="detail-meta">
                  <span class="meta-badge">
                    <knod-badge [color]="getStatusColor(candidate.status)">{{ candidate.status | titlecase }}</knod-badge>
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Joining: {{ candidate.joiningDate | date:'mediumDate' }}
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {{ candidate.email }}
                  </span>
                </div>
              </div>
              <div class="detail-actions">
                <knod-button variant="outline" size="sm" [icon]="editIcon">Edit</knod-button>
                <knod-button variant="primary" size="sm" [icon]="checklistIcon">Checklist</knod-button>
              </div>
            </div>

            <!-- Progress Overview -->
            <div class="progress-overview">
              <div class="progress-stat">
                <span class="stat-value">{{ candidate.progress }}%</span>
                <span class="stat-label">Complete</span>
                <div class="progress-ring">
                  <svg viewBox="0 0 36 36">
                    <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="ring-fill" [attr.stroke-dasharray]="candidate.progress + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                </div>
              </div>
              <div class="category-progress">
                @for (cat of getCategoryProgress(candidate); track cat.name) {
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

            <!-- Tasks Tabs -->
            <div class="tasks-tabs">
              <knod-tabs 
                [tabs]="taskTabs" 
                [activeTab]="activeTaskTab()"
                (tabChange)="activeTaskTab.set($event)">
              </knod-tabs>
            </div>

            <!-- Tasks List -->
            <div class="tasks-list">
              @for (task of getFilteredTasks(candidate); track task.id) {
                <div class="task-item" [class.completed]="task.status === 'completed'" [class.blocked]="task.status === 'blocked'">
                  <div class="task-checkbox">
                    <input type="checkbox" [checked]="task.status === 'completed'" (change)="toggleTask(candidate, task)">
                  </div>
                  <div class="task-content">
                    <div class="task-header">
                      <span class="task-title">{{ task.title }}</span>
                      <div class="task-badges">
                        <knod-badge [color]="getTaskPriorityColor(task.priority)">{{ task.priority }}</knod-badge>
                        <knod-badge [color]="getTaskStatusColor(task.status)">{{ task.status | titlecase }}</knod-badge>
                      </div>
                    </div>
                    <p class="task-description">{{ task.description }}</p>
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
                        Due: {{ task.dueDate | date:'mediumDate' }}
                      </span>
                    </div>
                  </div>
                  <button class="task-action">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <button class="action-btn" (click)="allocateAsset(candidate)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Allocate Asset
              </button>
              <button class="action-btn" (click)="createAccess(candidate)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Create Access
              </button>
              <button class="action-btn" (click)="sendWelcome(candidate)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Send Welcome Email
              </button>
            </div>
          } @else {
            <div class="empty-detail">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <h3>Select a Candidate</h3>
              <p>Choose a candidate from the list to view their onboarding details.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
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
    .stat-indicator.green { background: var(--color-success-500); }
    .stat-indicator.violet { background: var(--color-violet-500); }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 20px;
      min-height: 600px;
    }

    .list-panel {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
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

    .candidate-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      max-height: 500px;
    }

    .candidate-item {
      padding: 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .candidate-item:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .candidate-item.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .candidate-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .candidate-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .candidate-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .candidate-position {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .candidate-meta {
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

    .candidate-progress {
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
    }

    .candidate-detail-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .detail-info {
      flex: 1;
    }

    .detail-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .detail-position {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 4px 0 12px 0;
    }

    .detail-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .meta-badge {
      display: flex;
    }

    .detail-meta .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .detail-actions {
      display: flex;
      gap: 8px;
    }

    .progress-overview {
      display: flex;
      gap: 24px;
      padding: 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .progress-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    .progress-ring {
      width: 80px;
      height: 80px;
    }

    .progress-ring svg {
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

    .progress-stat .stat-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 18px;
      font-weight: 700;
    }

    .progress-stat .stat-label {
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
      width: 100px;
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

    .tasks-tabs {
      padding: 0 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .tasks-list {
      flex: 1;
      padding: 16px 20px;
      overflow-y: auto;
    }

    .task-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      margin-bottom: 12px;
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

    .task-checkbox {
      padding-top: 2px;
    }

    .task-checkbox input {
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
      align-items: flex-start;
      margin-bottom: 6px;
    }

    .task-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .task-item.completed .task-title {
      text-decoration: line-through;
      color: var(--color-slate-500);
    }

    .task-badges {
      display: flex;
      gap: 6px;
    }

    .task-description {
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

    .task-assignee knod-avatar {
      --avatar-size: 20px;
    }

    .task-due {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .task-action {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--color-slate-400);
      cursor: pointer;
    }

    .task-action:hover {
      background: var(--color-slate-100);
      color: var(--color-slate-600);
    }

    .quick-actions {
      display: flex;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--color-slate-100);
      background: var(--color-slate-50);
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
    .templateIcon, .plusIcon, .editIcon, .checklistIcon {
      display: flex;
    }
  `]
})
export class OnboardingComponent {
  private router: Router;

  readonly templateIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly editIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  readonly checklistIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';

  readonly searchQuery = signal('');
  readonly statusFilter = signal('all');
  readonly activeTaskTab = signal('pending');

  readonly taskTabs = [
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'all', label: 'All Tasks' }
  ];

  readonly candidates = signal<OnboardingCandidate[]>([
    {
      id: 'OB-001',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@knodtec.com',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      joiningDate: '2026-06-10',
      status: 'in_progress',
      progress: 65,
      assignedTo: 'HR Team',
      tasks: [
        { id: 't1', title: 'Prepare workstation', description: 'Setup laptop with required software', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-09', status: 'completed', priority: 'high' },
        { id: 't2', title: 'Create email account', description: 'Setup email and communication tools', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-09', status: 'completed', priority: 'high' },
        { id: 't3', title: 'Provision system access', description: 'Setup GitHub, Jira, and other tools access', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-10', status: 'in_progress', priority: 'high' },
        { id: 't4', title: 'Prepare onboarding documents', description: 'Prepare offer letter, NDA, and other HR documents', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-06-08', status: 'completed', priority: 'high' },
        { id: 't5', title: 'Assign mentor', description: 'Assign a team mentor for first week', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-06-10', status: 'pending', priority: 'medium' },
        { id: 't6', title: 'Setup desk and equipment', description: 'Prepare desk with monitors, keyboard, etc.', category: 'Admin', assignedTo: 'Admin', dueDate: '2026-06-10', status: 'pending', priority: 'medium' }
      ]
    },
    {
      id: 'OB-002',
      name: 'Priya Sharma',
      email: 'priya.sharma@knodtec.com',
      position: 'Product Designer',
      department: 'Design',
      joiningDate: '2026-06-12',
      status: 'pending',
      progress: 25,
      assignedTo: 'HR Team',
      tasks: [
        { id: 't1', title: 'Prepare workstation', description: 'Setup laptop with design software', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-11', status: 'pending', priority: 'high' },
        { id: 't2', title: 'Create email account', description: 'Setup email and communication tools', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-11', status: 'pending', priority: 'high' },
        { id: 't3', title: 'Prepare onboarding documents', description: 'Prepare offer letter, NDA, and other HR documents', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-06-10', status: 'in_progress', priority: 'high' },
        { id: 't4', title: 'Setup Figma access', description: 'Provision Figma team workspace access', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-12', status: 'pending', priority: 'medium' }
      ]
    },
    {
      id: 'OB-003',
      name: 'Rahul Verma',
      email: 'rahul.verma@knodtec.com',
      position: 'Data Analyst',
      department: 'Analytics',
      joiningDate: '2026-06-15',
      status: 'pending',
      progress: 10,
      assignedTo: 'HR Team',
      tasks: [
        { id: 't1', title: 'Prepare workstation', description: 'Setup laptop with required software', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-14', status: 'pending', priority: 'high' },
        { id: 't2', title: 'Create email account', description: 'Setup email and communication tools', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-06-14', status: 'pending', priority: 'high' }
      ]
    },
    {
      id: 'OB-004',
      name: 'Sneha Patel',
      email: 'sneha.patel@knodtec.com',
      position: 'Marketing Manager',
      department: 'Marketing',
      joiningDate: '2026-05-28',
      status: 'completed',
      progress: 100,
      assignedTo: 'HR Team',
      tasks: [
        { id: 't1', title: 'Prepare workstation', description: 'Setup laptop with required software', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-05-27', status: 'completed', priority: 'high' },
        { id: 't2', title: 'Create email account', description: 'Setup email and communication tools', category: 'IT', assignedTo: 'IT Admin', dueDate: '2026-05-27', status: 'completed', priority: 'high' },
        { id: 't3', title: 'Prepare onboarding documents', description: 'Prepare offer letter, NDA, and other HR documents', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-05-26', status: 'completed', priority: 'high' },
        { id: 't4', title: 'Assign mentor', description: 'Assign a team mentor for first week', category: 'HR', assignedTo: 'HR Team', dueDate: '2026-05-28', status: 'completed', priority: 'medium' }
      ]
    }
  ]);

  readonly selectedCandidate = signal<OnboardingCandidate | null>(null);

  readonly filteredCandidates = computed(() => {
    let result = this.candidates();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    if (query) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.position.toLowerCase().includes(query)
      );
    }

    if (status !== 'all') {
      result = result.filter(c => c.status === status);
    }

    return result;
  });

  readonly pendingCount = computed(() => this.candidates().filter(c => c.status === 'pending').length);
  readonly inProgressCount = computed(() => this.candidates().filter(c => c.status === 'in_progress').length);
  readonly completedCount = computed(() => this.candidates().filter(c => c.status === 'completed').length);
  readonly thisWeekCount = computed(() => {
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return this.candidates().filter(c => {
      const joining = new Date(c.joiningDate);
      return joining >= today && joining <= weekEnd;
    }).length;
  });

  constructor(router: Router) {
    this.router = router;
    this.selectedCandidate.set(this.candidates()[0]);
  }

  selectCandidate(candidate: OnboardingCandidate): void {
    this.selectedCandidate.set(candidate);
  }

  filterByStatus(status: string): void {
    this.statusFilter.set(this.statusFilter() === status ? 'all' : status);
  }

  getTaskCount(candidate: OnboardingCandidate): string {
    return `${candidate.tasks.filter(t => t.status === 'completed').length}/${candidate.tasks.length}`;
  }

  getCategoryProgress(candidate: OnboardingCandidate) {
    const categories = ['IT', 'HR', 'Admin'];
    return categories.map(cat => {
      const tasks = candidate.tasks.filter(t => t.category === cat);
      const completed = tasks.filter(t => t.status === 'completed').length;
      return {
        name: cat,
        total: tasks.length,
        completed,
        progress: tasks.length ? (completed / tasks.length) * 100 : 0
      };
    });
  }

  getFilteredTasks(candidate: OnboardingCandidate) {
    const tab = this.activeTaskTab();
    if (tab === 'all') return candidate.tasks;
    return candidate.tasks.filter(t => t.status === tab);
  }

  toggleTask(candidate: OnboardingCandidate, task: OnboardingTask): void {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const candidates = this.candidates();
    const candidateIndex = candidates.findIndex(c => c.id === candidate.id);
    if (candidateIndex !== -1) {
      const taskIndex = candidates[candidateIndex].tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        candidates[candidateIndex].tasks[taskIndex].status = newStatus;
        candidates[candidateIndex].progress = Math.round(
          (candidates[candidateIndex].tasks.filter(t => t.status === 'completed').length / candidates[candidateIndex].tasks.length) * 100
        );
        this.candidates.set([...candidates]);
        this.selectedCandidate.set(candidates[candidateIndex]);
      }
    }
  }

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'slate' {
    const colors: Record<string, 'green' | 'blue' | 'amber' | 'slate'> = {
      'pending': 'blue',
      'in_progress': 'amber',
      'completed': 'green'
    };
    return colors[status] || 'slate';
  }

  getTaskPriorityColor(priority: string): 'red' | 'amber' | 'blue' {
    const colors: Record<string, 'red' | 'amber' | 'blue'> = {
      'high': 'red',
      'medium': 'amber',
      'low': 'blue'
    };
    return colors[priority] || 'blue';
  }

  getTaskStatusColor(status: string): 'green' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'green' | 'amber' | 'blue' | 'slate'> = {
      'completed': 'green',
      'in_progress': 'amber',
      'pending': 'blue',
      'blocked': 'slate'
    };
    return colors[status] || 'blue';
  }

  allocateAsset(candidate: OnboardingCandidate): void {
    this.router.navigate(['/assets'], { queryParams: { onboarding: candidate.id } });
  }

  createAccess(candidate: OnboardingCandidate): void {
    // Create access
  }

  sendWelcome(candidate: OnboardingCandidate): void {
    // Send welcome email
  }
}