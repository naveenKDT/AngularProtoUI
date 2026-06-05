import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  AvatarComponent,
  ProgressComponent,
  TabsComponent,
  ButtonComponent,
  SearchComponent
} from '../../shared/components/ui/ui-components';

interface AssetClearance {
  assetId: string;
  assetTag: string;
  assetName: string;
  category: string;
  status: string;
  returnedOn?: string;
  verifiedBy?: string;
  condition?: string;
  actionRequired: string;
  remarks: string;
}

interface StageStatus {
  status: 'completed' | 'active' | 'waiting' | 'blocked';
  completedOn?: string;
  completedBy?: string;
  notes?: string;
}

interface ExitCase {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDept: string;
  employeeDesignation: string;
  lastWorkingDay: string;
  separationType: 'Resignation' | 'Termination' | 'Contract End';
  triggeredAt: string;
  triggeredBy: string;
  status: 'in_progress' | 'blocked' | 'ready' | 'completed';
  hrOwner: string;
  managerApproval: StageStatus;
  knowledgeTransfer: StageStatus;
  accessRevocation: StageStatus;
  payrollSettlement: StageStatus;
  documentsIssued: StageStatus;
  assetClearance: StageStatus;
  assets: AssetClearance[];
}

@Component({
  selector: 'knodtec-exit-clearance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ProgressComponent,
    TabsComponent,
    ButtonComponent,
    SearchComponent
  ],
  template: `
    <div class="exit-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Exit Clearance</h1>
          <p class="page-subtitle">Manage employee offboarding and asset recovery</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="exportIcon">Export Report</knod-button>
          <knod-button variant="primary" [icon]="plusIcon">Initiate Exit</knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" (click)="filterByStatus('in_progress')">
          <div class="stat-value">8</div>
          <div class="stat-label">In Progress</div>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('blocked')">
          <div class="stat-value">3</div>
          <div class="stat-label">Blocked</div>
          <div class="stat-indicator red"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('ready')">
          <div class="stat-value">5</div>
          <div class="stat-label">Ready to Close</div>
          <div class="stat-indicator green"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('completed')">
          <div class="stat-value">42</div>
          <div class="stat-label">Completed</div>
          <div class="stat-indicator slate"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left: Case List -->
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
                [class.active]="statusFilter() === 'in_progress'"
                (click)="statusFilter.set('in_progress')">In Progress</button>
              <button 
                class="filter-chip" 
                [class.active]="statusFilter() === 'blocked'"
                (click)="statusFilter.set('blocked')">Blocked</button>
            </div>
          </div>

          <!-- Case List -->
          <div class="case-list">
            @for (caseItem of filteredCases(); track caseItem.id) {
              <div 
                class="case-item"
                [class.selected]="selectedCase()?.id === caseItem.id"
                [class.blocked]="caseItem.status === 'blocked'"
                (click)="selectCase(caseItem)">
                <div class="case-header">
                  <knod-avatar [name]="caseItem.employeeName" size="sm"></knod-avatar>
                  <div class="case-info">
                    <span class="case-name">{{ caseItem.employeeName }}</span>
                    <span class="case-dept">{{ caseItem.employeeDept }}</span>
                  </div>
                  <knod-badge [color]="getStatusColor(caseItem.status)">{{ caseItem.status | titlecase }}</knod-badge>
                </div>
                <div class="case-meta">
                  <span class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Last Day: {{ caseItem.lastWorkingDay | date:'mediumDate' }}
                  </span>
                  <span class="meta-separator">•</span>
                  <span class="meta-item">{{ caseItem.separationType }}</span>
                </div>
                <div class="case-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="getCaseProgress(caseItem)"></div>
                  </div>
                  <span class="progress-text">{{ getCompletedStages(caseItem) }} / 6 stages</span>
                </div>
                @if (caseItem.status === 'blocked') {
                  <div class="blocker-warning">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Action required from {{ getBlockerOwner(caseItem) }}
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Right: Case Detail -->
        <div class="detail-panel">
          @if (selectedCase(); as exitCase) {
            <!-- Employee Header -->
            <div class="employee-header">
              <knod-avatar [name]="exitCase.employeeName" size="xl"></knod-avatar>
              <div class="employee-info">
                <h2 class="employee-name">{{ exitCase.employeeName }}</h2>
                <p class="employee-title">{{ exitCase.employeeDesignation }} • {{ exitCase.employeeDept }}</p>
                <div class="employee-meta">
                  <span class="meta-badge">
                    <knod-badge [color]="getSeparationColor(exitCase.separationType)">
                      {{ exitCase.separationType }}
                    </knod-badge>
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Last Working Day: {{ exitCase.lastWorkingDay | date:'mediumDate' }}
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Initiated by {{ exitCase.triggeredBy }}
                  </span>
                </div>
              </div>
              <div class="employee-status">
                <knod-badge [color]="getStatusColor(exitCase.status)" [customClass]="'badge-lg'">
                  {{ exitCase.status | titlecase }}
                </knod-badge>
              </div>
            </div>

            <!-- Stage Tabs -->
            <div class="stage-tabs">
              <knod-tabs 
                [tabs]="stageTabs" 
                [activeTab]="activeStage()"
                (tabChange)="activeStage.set($event)">
              </knod-tabs>
            </div>

            <!-- Stage Content -->
            <div class="stage-content">
              @switch (activeStage()) {
                @case ('clearance') {
                  <ng-container *ngTemplateOutlet="clearanceStage"></ng-container>
                }
                @case ('workflow') {
                  <ng-container *ngTemplateOutlet="workflowStage"></ng-container>
                }
                @case ('assets') {
                  <ng-container *ngTemplateOutlet="assetsStage"></ng-container>
                }
                @case ('documents') {
                  <ng-container *ngTemplateOutlet="documentsStage"></ng-container>
                }
              }
            </div>
          } @else {
            <div class="no-selection">
              <div class="no-selection-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Select an Exit Case</h3>
              <p>Choose an employee from the list to view clearance details</p>
            </div>
          }
        </div>
      </div>

      <!-- Clearance Stage Template -->
      <ng-template #clearanceStage>
        @if (selectedCase(); as exitCase) {
          <div class="clearance-container">
            <!-- Stage Overview -->
            <div class="stage-overview">
              <h4>Clearance Progress</h4>
              <div class="stage-progress-grid">
                @for (stage of getStages(exitCase); track stage.name) {
                  <div class="stage-card" [ngClass]="'stage-' + stage.status">
                    <div class="stage-icon">
                      @if (stage.status === 'completed') {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else if (stage.status === 'active') {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      } @else if (stage.status === 'blocked') {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      } @else {
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      }
                    </div>
                    <div class="stage-info">
                      <span class="stage-name">{{ stage.name }}</span>
                      @if (stage.completedOn) {
                        <span class="stage-date">Completed {{ stage.completedOn | date:'short' }}</span>
                      } @else if (stage.status === 'blocked') {
                        <span class="stage-blocker">Requires attention</span>
                      } @else if (stage.status === 'active') {
                        <span class="stage-active">In progress</span>
                      } @else {
                        <span class="stage-pending">Pending</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Action Summary -->
            <div class="action-summary">
              <div class="summary-card pending">
                <span class="summary-value">{{ getPendingActions(exitCase) }}</span>
                <span class="summary-label">Pending Actions</span>
              </div>
              <div class="summary-card blocked">
                <span class="summary-value">{{ getBlockedItems(exitCase) }}</span>
                <span class="summary-label">Blocked Items</span>
              </div>
              <div class="summary-card completed">
                <span class="summary-value">{{ getCompletedItems(exitCase) }}</span>
                <span class="summary-label">Completed</span>
              </div>
            </div>
          </div>
        }
      </ng-template>

      <!-- Workflow Stage Template -->
      <ng-template #workflowStage>
        @if (selectedCase(); as exitCase) {
          <div class="workflow-container">
            <div class="workflow-timeline">
              @for (item of getWorkflowItems(exitCase); track item.id) {
                <div class="workflow-item" [ngClass]="'status-' + item.status">
                  <div class="workflow-marker">
                    @if (item.status === 'completed') {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    } @else if (item.status === 'blocked') {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    } @else {
                      <span>{{ item.step }}</span>
                    }
                  </div>
                  <div class="workflow-content">
                    <div class="workflow-header">
                      <span class="workflow-title">{{ item.title }}</span>
                      <knod-badge [color]="getWorkflowStatusColor(item.status)">{{ item.status | titlecase }}</knod-badge>
                    </div>
                    <p class="workflow-description">{{ item.description }}</p>
                    <div class="workflow-meta">
                      @if (item.assignedTo) {
                        <span>Assigned to: {{ item.assignedTo }}</span>
                      }
                      @if (item.completedBy) {
                        <span>Completed by: {{ item.completedBy }}</span>
                      }
                      @if (item.dueDate) {
                        <span class="due-date" [class.overdue]="isOverdue(item.dueDate)">Due: {{ item.dueDate | date:'short' }}</span>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </ng-template>

      <!-- Assets Stage Template -->
      <ng-template #assetsStage>
        @if (selectedCase(); as exitCase) {
          <div class="assets-container">
            <div class="assets-header">
              <h4>Asset Recovery</h4>
              <knod-button variant="outline" size="sm" [icon]="refreshIcon">Refresh Status</knod-button>
            </div>
            <div class="assets-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Tag</th>
                    <th>Status</th>
                    <th>Condition</th>
                    <th>Action Required</th>
                    <th>Verified By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (asset of exitCase.assets; track asset.assetId) {
                    <tr>
                      <td>
                        <div class="asset-cell">
                          <span class="asset-name">{{ asset.assetName }}</span>
                          <span class="asset-category">{{ asset.category }}</span>
                        </div>
                      </td>
                      <td><span class="asset-tag">{{ asset.assetTag }}</span></td>
                      <td>
                        <knod-badge [color]="getAssetStatusColor(asset.status)">
                          {{ formatAssetStatus(asset.status) }}
                        </knod-badge>
                      </td>
                      <td>
                        @if (asset.condition) {
                          <knod-badge [color]="getConditionColor(asset.condition)">
                            {{ asset.condition | titlecase }}
                          </knod-badge>
                        } @else {
                          <span class="text-muted">—</span>
                        }
                      </td>
                      <td>
                        <span class="action-text" [class.action-needed]="needsAction(asset.status)">
                          {{ asset.actionRequired }}
                        </span>
                      </td>
                      <td>
                        @if (asset.verifiedBy) {
                          <knod-avatar [name]="asset.verifiedBy" size="sm"></knod-avatar>
                        } @else {
                          <span class="text-muted">—</span>
                        }
                      </td>
                      <td>
                        <knod-button variant="ghost" size="sm" (click)="openAssetOutcome(asset)">
                          Update
                        </knod-button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </ng-template>

      <!-- Documents Stage Template -->
      <ng-template #documentsStage>
        @if (selectedCase(); as exitCase) {
          <div class="documents-container">
            <h4>Exit Documents</h4>
            <div class="documents-list">
              @for (doc of exitDocuments(); track doc.name) {
                <div class="document-item">
                  <div class="document-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div class="document-info">
                    <span class="document-name">{{ doc.name }}</span>
                    <span class="document-meta">Issued {{ doc.issuedOn | date:'mediumDate' }}</span>
                  </div>
                  <div class="document-status">
                    <knod-badge [color]="doc.status === 'issued' ? 'green' : 'amber'">
                      {{ doc.status | titlecase }}
                    </knod-badge>
                  </div>
                  <knod-button variant="ghost" size="sm" [icon]="downloadIcon">Download</knod-button>
                </div>
              }
            </div>
          </div>
        }
      </ng-template>
    </div>
  `,
  styles: [`
    .exit-page {
      max-width: 1440px;
      margin: 0 auto;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 0;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .stat-label {
      font-size: 13px;
      color: var(--color-slate-500);
    }

    .stat-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .stat-indicator.blue { background: var(--color-primary-500); }
    .stat-indicator.red { background: var(--color-red-500); }
    .stat-indicator.green { background: var(--color-success-500); }
    .stat-indicator.slate { background: var(--color-slate-400); }

    /* Content Layout */
    .content-layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 24px;
      min-height: 600px;
    }

    @media (max-width: 1024px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
    }

    /* List Panel */
    .list-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .filters-bar {
      padding: 16px;
      border-bottom: 1px solid var(--color-slate-100);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .filter-chips {
      display: flex;
      gap: 6px;
    }

    .filter-chip {
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
      background: var(--color-slate-100);
      border-radius: 6px;
      transition: all var(--transition-fast);
    }

    .filter-chip:hover {
      background: var(--color-slate-200);
    }

    .filter-chip.active {
      background: var(--color-primary-500);
      color: white;
    }

    .case-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .case-item {
      padding: 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
      margin-bottom: 4px;
      border: 1px solid transparent;
    }

    .case-item:hover {
      background: var(--color-slate-50);
    }

    .case-item.selected {
      background: var(--color-primary-50);
      border-color: var(--color-primary-200);
    }

    .case-item.blocked {
      border-left: 3px solid var(--color-red-500);
    }

    .case-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .case-info {
      flex: 1;
    }

    .case-name {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .case-dept {
      display: block;
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .case-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .meta-separator {
      color: var(--color-slate-300);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .case-progress {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-bar {
      flex: 1;
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

    .progress-text {
      font-size: 11px;
      color: var(--color-slate-500);
      white-space: nowrap;
    }

    .blocker-warning {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 8px;
      background: var(--color-red-50);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      color: var(--color-red-600);
    }

    /* Detail Panel */
    .detail-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Employee Header */
    .employee-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-bottom: 1px solid var(--color-slate-100);
      background: var(--color-slate-50);
    }

    .employee-info {
      flex: 1;
    }

    .employee-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 2px 0;
    }

    .employee-title {
      font-size: 13px;
      color: var(--color-slate-600);
      margin: 0 0 8px 0;
    }

    .employee-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .meta-badge {
      display: inline-flex;
    }

    .employee-status :deep(.badge-lg) {
      padding: 6px 14px;
      font-size: 12px;
    }

    /* Stage Tabs */
    .stage-tabs {
      padding: 0 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .stage-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }

    /* No Selection */
    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: var(--color-slate-500);
    }

    .no-selection-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-slate-100);
      border-radius: 16px;
      color: var(--color-slate-400);
      margin-bottom: 16px;
    }

    .no-selection h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-700);
      margin: 0 0 4px 0;
    }

    .no-selection p {
      font-size: 13px;
      margin: 0;
    }

    /* Stage Overview */
    .stage-overview h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 16px 0;
    }

    .stage-progress-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .stage-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: var(--color-slate-50);
      border-radius: 8px;
      border-left: 3px solid var(--color-slate-300);
    }

    .stage-card.stage-completed {
      background: var(--color-success-50);
      border-left-color: var(--color-success-500);
    }

    .stage-card.stage-active {
      background: var(--color-primary-50);
      border-left-color: var(--color-primary-500);
    }

    .stage-card.stage-blocked {
      background: var(--color-red-50);
      border-left-color: var(--color-red-500);
    }

    .stage-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: white;
      color: var(--color-slate-400);
    }

    .stage-card.stage-completed .stage-icon {
      color: var(--color-success-600);
    }

    .stage-card.stage-active .stage-icon {
      color: var(--color-primary-600);
    }

    .stage-card.stage-blocked .stage-icon {
      color: var(--color-red-600);
    }

    .stage-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stage-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .stage-date, .stage-active, .stage-pending {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .stage-blocker {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-red-600);
    }

    /* Action Summary */
    .action-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 20px;
    }

    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .summary-card.pending {
      background: var(--color-amber-50);
    }

    .summary-card.blocked {
      background: var(--color-red-50);
    }

    .summary-card.completed {
      background: var(--color-success-50);
    }

    .summary-value {
      font-size: 24px;
      font-weight: 700;
    }

    .summary-card.pending .summary-value { color: var(--color-amber-600); }
    .summary-card.blocked .summary-value { color: var(--color-red-600); }
    .summary-card.completed .summary-value { color: var(--color-success-600); }

    .summary-label {
      font-size: 11px;
      color: var(--color-slate-600);
      margin-top: 4px;
    }

    /* Workflow */
    .workflow-timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
    }

    .workflow-timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 24px;
      bottom: 24px;
      width: 2px;
      background: var(--color-slate-200);
    }

    .workflow-item {
      display: flex;
      gap: 16px;
      padding: 16px 0;
      position: relative;
    }

    .workflow-marker {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 2px solid var(--color-slate-200);
      z-index: 1;
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-500);
    }

    .workflow-item.status-completed .workflow-marker {
      background: var(--color-success-500);
      border-color: var(--color-success-500);
      color: white;
    }

    .workflow-item.status-active .workflow-marker {
      background: var(--color-primary-500);
      border-color: var(--color-primary-500);
      color: white;
    }

    .workflow-item.status-blocked .workflow-marker {
      background: var(--color-red-500);
      border-color: var(--color-red-500);
      color: white;
    }

    .workflow-content {
      flex: 1;
    }

    .workflow-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .workflow-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .workflow-description {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 0 0 8px 0;
    }

    .workflow-meta {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .due-date.overdue {
      color: var(--color-red-600);
      font-weight: 500;
    }

    /* Assets Table */
    .assets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .assets-header h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .assets-table {
      overflow-x: auto;
    }

    .assets-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .assets-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: var(--color-slate-50);
      border-bottom: 1px solid var(--color-slate-200);
    }

    .assets-table td {
      padding: 12px 16px;
      font-size: 13px;
      color: var(--color-slate-700);
      border-bottom: 1px solid var(--color-slate-100);
    }

    .assets-table tr:hover {
      background: var(--color-slate-50);
    }

    .asset-cell {
      display: flex;
      flex-direction: column;
    }

    .asset-name {
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .asset-category {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .asset-tag {
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary-600);
    }

    .action-text {
      font-size: 12px;
    }

    .action-text.action-needed {
      color: var(--color-red-600);
      font-weight: 500;
    }

    .text-muted {
      color: var(--color-slate-400);
    }

    /* Documents */
    .documents-container h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 16px 0;
    }

    .documents-list {
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
      border-radius: 8px;
    }

    .document-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-red-50);
      color: var(--color-red-600);
      border-radius: 8px;
    }

    .document-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .document-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .document-meta {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Icons */
    .exportIcon, .plusIcon, .refreshIcon, .downloadIcon {
      display: flex;
    }
  `]
})
export class ExitClearanceComponent {
  private router: Router;

  readonly exportIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly refreshIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
  readonly downloadIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

  readonly searchQuery = signal('');
  readonly statusFilter = signal('all');
  readonly activeStage = signal('clearance');

  readonly stageTabs = [
    { key: 'clearance', label: 'Clearance' },
    { key: 'workflow', label: 'Workflow' },
    { key: 'assets', label: 'Assets' },
    { key: 'documents', label: 'Documents' }
  ];

  readonly exitCases = signal<ExitCase[]>([
    {
      id: 'EX-001',
      employeeId: 'EMP-1042',
      employeeName: 'Amit Singh',
      employeeDept: 'Marketing',
      employeeDesignation: 'Marketing Manager',
      lastWorkingDay: '2026-06-15',
      separationType: 'Resignation',
      triggeredAt: '2026-05-28',
      triggeredBy: 'HR Team',
      status: 'blocked',
      hrOwner: 'Priya Sharma',
      managerApproval: { status: 'completed', completedOn: '2026-05-30', completedBy: 'Vikram Singh' },
      knowledgeTransfer: { status: 'completed', completedOn: '2026-06-02', completedBy: 'Amit Singh' },
      accessRevocation: { status: 'blocked', notes: 'Pending IT approval for system access removal' },
      payrollSettlement: { status: 'active', notes: 'Processing final settlement' },
      documentsIssued: { status: 'completed', completedOn: '2026-06-03', completedBy: 'HR Team' },
      assetClearance: { status: 'waiting', notes: '3 assets pending return' },
      assets: [
        { assetId: 'AST-1045', assetTag: 'AST-1045', assetName: 'MacBook Pro 14" M3', category: 'Laptop', status: 'pending_return', actionRequired: 'Employee to return on last day', remarks: '' },
        { assetId: 'AST-1056', assetTag: 'AST-1056', assetName: 'Dell UltraSharp 27"', category: 'Monitor', status: 'pending_return', actionRequired: 'Employee to return on last day', remarks: '' },
        { assetId: 'AST-1067', assetTag: 'AST-1067', assetName: 'iPhone 15 Pro', category: 'Phone', status: 'pending_return', actionRequired: 'Employee to return on last day', remarks: '' }
      ]
    },
    {
      id: 'EX-002',
      employeeId: 'EMP-1056',
      employeeName: 'Sneha Gupta',
      employeeDept: 'Design',
      employeeDesignation: 'Senior UI Designer',
      lastWorkingDay: '2026-06-20',
      separationType: 'Contract End',
      triggeredAt: '2026-06-01',
      triggeredBy: 'HR Team',
      status: 'in_progress',
      hrOwner: 'Priya Sharma',
      managerApproval: { status: 'completed', completedOn: '2026-06-03', completedBy: 'Rahul Jain' },
      knowledgeTransfer: { status: 'active', notes: 'In progress' },
      accessRevocation: { status: 'waiting', notes: 'Scheduled for June 18' },
      payrollSettlement: { status: 'waiting', notes: 'Pending final month' },
      documentsIssued: { status: 'active', notes: 'Experience letter in preparation' },
      assetClearance: { status: 'waiting', notes: '2 assets assigned' },
      assets: [
        { assetId: 'AST-1089', assetTag: 'AST-1089', assetName: 'iMac 24"', category: 'Desktop', status: 'pending_return', actionRequired: 'Schedule pickup', remarks: '' },
        { assetId: 'AST-1090', assetTag: 'AST-1090', assetName: 'Magic Mouse', category: 'Accessory', status: 'pending_return', actionRequired: 'Schedule pickup', remarks: '' }
      ]
    },
    {
      id: 'EX-003',
      employeeId: 'EMP-1023',
      employeeName: 'Rajesh Kumar',
      employeeDept: 'Finance',
      employeeDesignation: 'Senior Accountant',
      lastWorkingDay: '2026-06-10',
      separationType: 'Resignation',
      triggeredAt: '2026-05-20',
      triggeredBy: 'HR Team',
      status: 'ready',
      hrOwner: 'Priya Sharma',
      managerApproval: { status: 'completed', completedOn: '2026-05-22', completedBy: 'Deepak Verma' },
      knowledgeTransfer: { status: 'completed', completedOn: '2026-05-28', completedBy: 'Rajesh Kumar' },
      accessRevocation: { status: 'completed', completedOn: '2026-06-05', completedBy: 'IT Admin' },
      payrollSettlement: { status: 'completed', completedOn: '2026-06-07', completedBy: 'Finance' },
      documentsIssued: { status: 'completed', completedOn: '2026-06-08', completedBy: 'HR Team' },
      assetClearance: { status: 'completed', completedOn: '2026-06-08', completedBy: 'IT Asset Team' },
      assets: [
        { assetId: 'AST-1023', assetTag: 'AST-1023', assetName: 'Dell Latitude 7440', category: 'Laptop', status: 'returned_verified', returnedOn: '2026-06-08', verifiedBy: 'Rahul Jain', condition: 'good', actionRequired: 'No action required', remarks: 'All accessories returned' }
      ]
    }
  ]);

  readonly selectedCase = signal<ExitCase | null>(null);

  readonly exitDocuments = signal([
    { name: 'Experience Letter', issuedOn: '2026-06-03', status: 'issued' },
    { name: 'Relieving Letter', issuedOn: '2026-06-03', status: 'issued' },
    { name: 'Full & Final Settlement', issuedOn: '2026-06-07', status: 'issued' },
    { name: 'Exit Interview Form', issuedOn: '2026-06-08', status: 'issued' }
  ]);

  readonly filteredCases = computed(() => {
    let result = this.exitCases();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    if (query) {
      result = result.filter(c => 
        c.employeeName.toLowerCase().includes(query) ||
        c.employeeId.toLowerCase().includes(query) ||
        c.employeeDept.toLowerCase().includes(query)
      );
    }

    if (status !== 'all') {
      result = result.filter(c => c.status === status);
    }

    return result;
  });

  constructor(router: Router) {
    this.router = router;
    // Select first case by default
    this.selectedCase.set(this.exitCases()[0]);
  }

  filterByStatus(status: string): void {
    this.statusFilter.set(status);
  }

  selectCase(exitCase: ExitCase): void {
    this.selectedCase.set(exitCase);
  }

  getStatusColor(status: string): 'green' | 'amber' | 'red' | 'slate' | 'blue' | 'violet' {
    const colors: Record<string, 'green' | 'amber' | 'red' | 'slate' | 'blue' | 'violet'> = {
      'completed': 'green',
      'ready': 'green',
      'in_progress': 'blue',
      'blocked': 'red',
      'pending_return': 'amber'
    };
    return colors[status] || 'slate';
  }

  getSeparationColor(type: string): 'blue' | 'amber' | 'violet' | 'red' {
    const colors: Record<string, 'blue' | 'amber' | 'violet' | 'red'> = {
      'Resignation': 'blue',
      'Termination': 'red',
      'Contract End': 'violet'
    };
    return colors[type] || 'blue';
  }

  getCaseProgress(exitCase: ExitCase): number {
    const stages = [
      exitCase.managerApproval,
      exitCase.knowledgeTransfer,
      exitCase.accessRevocation,
      exitCase.payrollSettlement,
      exitCase.documentsIssued,
      exitCase.assetClearance
    ];
    const completed = stages.filter(s => s.status === 'completed').length;
    return (completed / 6) * 100;
  }

  getCompletedStages(exitCase: ExitCase): number {
    const stages = [
      exitCase.managerApproval,
      exitCase.knowledgeTransfer,
      exitCase.accessRevocation,
      exitCase.payrollSettlement,
      exitCase.documentsIssued,
      exitCase.assetClearance
    ];
    return stages.filter(s => s.status === 'completed').length;
  }

  getBlockerOwner(exitCase: ExitCase): string {
    if (exitCase.accessRevocation?.status === 'blocked') return exitCase.hrOwner;
    if (exitCase.payrollSettlement?.status === 'blocked') return exitCase.hrOwner;
    return exitCase.hrOwner;
  }

  getStages(exitCase: ExitCase) {
    return [
      { name: 'Manager Approval', ...exitCase.managerApproval },
      { name: 'Knowledge Transfer', ...exitCase.knowledgeTransfer },
      { name: 'Access Revocation', ...exitCase.accessRevocation },
      { name: 'Payroll Settlement', ...exitCase.payrollSettlement },
      { name: 'Documents Issued', ...exitCase.documentsIssued },
      { name: 'Asset Clearance', ...exitCase.assetClearance }
    ];
  }

  getPendingActions(exitCase: ExitCase): number {
    return exitCase.assets.filter(a => a.status === 'pending_return').length;
  }

  getBlockedItems(exitCase: ExitCase): number {
    let count = 0;
    if (exitCase.accessRevocation.status === 'blocked') count++;
    if (exitCase.payrollSettlement.status === 'blocked') count++;
    return count;
  }

  getCompletedItems(exitCase: ExitCase): number {
    const stages = [
      exitCase.managerApproval,
      exitCase.knowledgeTransfer,
      exitCase.accessRevocation,
      exitCase.payrollSettlement,
      exitCase.documentsIssued,
      exitCase.assetClearance
    ];
    return stages.filter(s => s.status === 'completed').length;
  }

  getWorkflowItems(exitCase: ExitCase) {
    return [
      { id: '1', step: 1, title: 'Exit Initiated', description: 'HR initiated the exit process', status: 'completed', completedBy: exitCase.triggeredBy, dueDate: exitCase.triggeredAt },
      { id: '2', step: 2, title: 'Manager Approval', description: 'Direct manager approves the resignation', status: exitCase.managerApproval.status, completedBy: exitCase.managerApproval.completedBy, dueDate: '2026-05-30' },
      { id: '3', step: 3, title: 'Knowledge Transfer', description: 'Employee completes knowledge transfer', status: exitCase.knowledgeTransfer.status, completedBy: exitCase.knowledgeTransfer.completedBy, dueDate: '2026-06-05' },
      { id: '4', step: 4, title: 'Access Revocation', description: 'IT revokes all system access', status: exitCase.accessRevocation.status, assignedTo: 'IT Admin', dueDate: '2026-06-10' },
      { id: '5', step: 5, title: 'Final Settlement', description: 'Finance processes final payment', status: exitCase.payrollSettlement.status, assignedTo: 'Finance Team', dueDate: '2026-06-12' },
      { id: '6', step: 6, title: 'Asset Recovery', description: 'IT recovers all assigned assets', status: exitCase.assetClearance.status, assignedTo: 'IT Asset Team', dueDate: '2026-06-14' },
      { id: '7', step: 7, title: 'Exit Interview', description: 'HR conducts exit interview', status: 'active', assignedTo: exitCase.hrOwner, dueDate: '2026-06-14' },
      { id: '8', step: 8, title: 'Exit Complete', description: 'All formalities completed', status: exitCase.status === 'completed' ? 'completed' : 'waiting', dueDate: exitCase.lastWorkingDay }
    ];
  }

  getWorkflowStatusColor(status: string): 'green' | 'amber' | 'blue' | 'red' | 'slate' {
    const colors: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'slate'> = {
      'completed': 'green',
      'active': 'blue',
      'blocked': 'red',
      'waiting': 'slate'
    };
    return colors[status] || 'slate';
  }

  getAssetStatusColor(status: string): 'green' | 'amber' | 'red' | 'slate' | 'blue' {
    const colors: Record<string, 'green' | 'amber' | 'red' | 'slate' | 'blue'> = {
      'returned_verified': 'green',
      'returned_pending': 'amber',
      'pending_return': 'blue',
      'damaged': 'red',
      'missing': 'red'
    };
    return colors[status] || 'slate';
  }

  formatAssetStatus(status: string): string {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getConditionColor(condition: string): 'green' | 'amber' | 'red' {
    const colors: Record<string, 'green' | 'amber' | 'red'> = {
      'good': 'green',
      'damaged': 'amber',
      'missing': 'red'
    };
    return colors[condition] || 'slate';
  }

  needsAction(status: string): boolean {
    return status === 'pending_return' || status === 'damaged' || status === 'missing';
  }

  isOverdue(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  openAssetOutcome(asset: AssetClearance): void {
    // Open asset outcome dialog
  }
}