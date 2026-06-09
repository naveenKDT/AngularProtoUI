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
  InputComponent,
  SelectComponent,
  TextareaComponent,
  SearchComponent
} from '../../../../shared/components/ui-components';

interface Request {
  id: string;
  type: string;
  category: string;
  subcategory: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  requestedAt: string;
  updatedAt: string;
  requestedBy: string;
  requestedByDept: string;
  assignedTo: string;
  slaDue: string;
  assetTag?: string;
  assetName?: string;
  description: string;
  escalation: string;
}

interface Conversation {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  message: string;
  isInternal: boolean;
}

@Component({
  selector: 'knodtec-requests',
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
    InputComponent,
    SelectComponent,
    TextareaComponent,
    SearchComponent
  ],
  template: `
    <div class="requests-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Asset Support & Requests</h1>
          <p class="page-subtitle">Manage asset-related tickets and service requests</p>
        </div>
        <div class="header-actions">
          <knod-button variant="primary" [icon]="plusIcon" (click)="navigateToNewRequest()">New Request</knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" (click)="filterByStatus('open')">
          <div class="stat-value">24</div>
          <div class="stat-label">Open</div>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('in_progress')">
          <div class="stat-value">18</div>
          <div class="stat-label">In Progress</div>
          <div class="stat-indicator amber"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('pending_approval')">
          <div class="stat-value">8</div>
          <div class="stat-label">Pending Approval</div>
          <div class="stat-indicator violet"></div>
        </div>
        <div class="stat-card" (click)="filterByStatus('resolved')">
          <div class="stat-value">156</div>
          <div class="stat-label">Resolved</div>
          <div class="stat-indicator green"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left: Request List -->
        <div class="list-panel">
          <!-- Filters -->
          <div class="filters-bar">
            <div class="search-wrapper">
              <knod-search 
                placeholder="Search requests..."
                [value]="searchQuery()"
                (valueChange)="searchQuery.set($event)">
              </knod-search>
            </div>
            <div class="filter-buttons">
              <select class="filter-select" [ngModel]="priorityFilter()" (ngModelChange)="priorityFilter.set($event)">
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select class="filter-select" [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)">
                <option value="">All Categories</option>
                <option value="Asset Request">Asset Request</option>
                <option value="Asset Issue">Asset Issue</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Access">Access</option>
              </select>
            </div>
          </div>

          <!-- Request List -->
          <div class="request-list">
            @for (request of filteredRequests(); track request.id) {
              <div 
                class="request-item"
                [class.selected]="selectedRequest()?.id === request.id"
                (click)="selectRequest(request)">
                <div class="request-item-header">
                  <span class="request-id">{{ request.id }}</span>
                  <knod-badge [color]="getPriorityColor(request.priority)">{{ request.priority }}</knod-badge>
                </div>
                <h3 class="request-title">{{ request.type }}</h3>
                <p class="request-description">{{ request.description }}</p>
                <div class="request-meta">
                  <span class="meta-badge">
                    <knod-badge [color]="getCategoryColor(request.category)">{{ request.category }}</knod-badge>
                  </span>
                  <span class="meta-separator">•</span>
                  <span class="meta-time">{{ getTimeAgo(request.updatedAt) }}</span>
                </div>
                @if (request.assetTag) {
                  <div class="request-asset">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    {{ request.assetTag }} - {{ request.assetName }}
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Right: Request Detail -->
        <div class="detail-panel">
          @if (selectedRequest(); as request) {
            <!-- Request Header -->
            <div class="detail-header">
              <div class="detail-title-row">
                <div>
                  <span class="detail-id">{{ request.id }}</span>
                  <h2 class="detail-title">{{ request.type }}</h2>
                </div>
                <div class="detail-actions">
                  <knod-button variant="outline" size="sm">Edit</knod-button>
                  <knod-button variant="ghost" size="sm" [icon]="closeIcon">Close</knod-button>
                </div>
              </div>
              <div class="detail-status-row">
                <knod-badge [color]="getStatusColor(request.status)">{{ request.status | titlecase }}</knod-badge>
                <span class="detail-date">Created {{ request.requestedAt | date:'mediumDate' }}</span>
              </div>
            </div>

            <!-- Request Tabs -->
            <div class="detail-tabs">
              <knod-tabs 
                [tabs]="detailTabs" 
                [activeTab]="activeDetailTab()"
                (tabChange)="activeDetailTab.set($event)">
              </knod-tabs>
            </div>

            <!-- Tab Content -->
            <div class="detail-content">
              @switch (activeDetailTab()) {
                @case ('overview') {
                  <ng-container *ngTemplateOutlet="requestOverview"></ng-container>
                }
                @case ('timeline') {
                  <ng-container *ngTemplateOutlet="requestTimeline"></ng-container>
                }
                @case ('conversation') {
                  <ng-container *ngTemplateOutlet="requestConversation"></ng-container>
                }
                @case ('activity') {
                  <ng-container *ngTemplateOutlet="requestActivity"></ng-container>
                }
              }
            </div>
          } @else {
            <div class="no-selection">
              <div class="no-selection-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>Select a Request</h3>
              <p>Choose a request from the list to view details</p>
            </div>
          }
        </div>
      </div>

      <!-- Request Overview Template -->
      <ng-template #requestOverview>
        @if (selectedRequest(); as request) {
          <div class="overview-grid">
            <!-- Request Info -->
            <div class="info-section">
              <h4 class="section-title">Request Details</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Category</label>
                  <knod-badge [color]="getCategoryColor(request.category)">{{ request.category }}</knod-badge>
                </div>
                <div class="info-item">
                  <label>Subcategory</label>
                  <span>{{ request.subcategory }}</span>
                </div>
                <div class="info-item">
                  <label>Priority</label>
                  <knod-badge [color]="getPriorityColor(request.priority)">{{ request.priority }}</knod-badge>
                </div>
                <div class="info-item">
                  <label>Escalation</label>
                  <knod-badge [color]="getEscalationColor(request.escalation)">{{ request.escalation | titlecase }}</knod-badge>
                </div>
              </div>
            </div>

            <!-- Asset Info -->
            @if (request.assetTag) {
              <div class="info-section">
                <h4 class="section-title">Linked Asset</h4>
                <div class="asset-info-card">
                  <div class="asset-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div class="asset-details">
                    <span class="asset-name">{{ request.assetName }}</span>
                    <span class="asset-tag">{{ request.assetTag }}</span>
                  </div>
                  <knod-button variant="ghost" size="sm">View Asset</knod-button>
                </div>
              </div>
            }

            <!-- Requester Info -->
            <div class="info-section">
              <h4 class="section-title">Requester</h4>
              <div class="requester-card">
                <knod-avatar [name]="request.requestedBy" size="lg"></knod-avatar>
                <div class="requester-info">
                  <span class="requester-name">{{ request.requestedBy }}</span>
                  <span class="requester-dept">{{ request.requestedByDept }}</span>
                </div>
              </div>
            </div>

            <!-- Assignment Info -->
            <div class="info-section">
              <h4 class="section-title">Assignment</h4>
              <div class="assignment-grid">
                <div class="info-item">
                  <label>Assigned Team</label>
                  <span>{{ request.assignedTo }}</span>
                </div>
                <div class="info-item">
                  <label>SLA Due</label>
                  <span class="sla-due" [class.overdue]="isOverdue(request.slaDue)">
                    {{ request.slaDue | date:'mediumDate' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="info-section full-width">
              <h4 class="section-title">Description</h4>
              <p class="description-text">{{ request.description }}</p>
            </div>

            <!-- Actions -->
            <div class="info-section full-width">
              <h4 class="section-title">Workflow Actions</h4>
              <div class="action-buttons">
                @if (request.status === 'open') {
                  <knod-button variant="primary" (click)="updateRequestStatus(request.id, 'in_progress')">Start Processing</knod-button>
                  <knod-button variant="outline" (click)="updateRequestStatus(request.id, 'pending_approval')">Send for Approval</knod-button>
                }
                @if (request.status === 'pending_approval') {
                  <knod-button variant="primary" (click)="updateRequestStatus(request.id, 'in_progress')">Approve</knod-button>
                  <knod-button variant="danger" (click)="updateRequestStatus(request.id, 'rejected')">Reject</knod-button>
                }
                @if (request.status === 'in_progress') {
                  <knod-button variant="primary" (click)="updateRequestStatus(request.id, 'resolved')">Mark Resolved</knod-button>
                  <knod-button variant="outline" (click)="updateRequestStatus(request.id, 'pending_approval')">Request More Info</knod-button>
                }
                @if (request.status === 'rejected') {
                  <knod-button variant="outline" (click)="updateRequestStatus(request.id, 'open')">Reopen Request</knod-button>
                }
                @if (request.status === 'resolved') {
                  <knod-button variant="primary" (click)="updateRequestStatus(request.id, 'closed')">Close Request</knod-button>
                  <knod-button variant="outline" (click)="updateRequestStatus(request.id, 'in_progress')">Reopen</knod-button>
                }
                @if (request.status === 'closed') {
                  <knod-button variant="outline" (click)="updateRequestStatus(request.id, 'open')">Reopen Request</knod-button>
                }
              </div>
              <div class="assign-section">
                <label class="form-label">Assign to</label>
                <div class="assign-options">
                  <select class="form-select" [ngModel]="selectedAssignee()" (ngModelChange)="selectedAssignee.set($event)">
                    <option value="">Select team member</option>
                    <option value="Rahul Jain">Rahul Jain</option>
                    <option value="Priya Patel">Priya Patel</option>
                    <option value="Amit Singh">Amit Singh</option>
                    <option value="IT Asset Team">IT Asset Team</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                  <knod-button variant="outline" (click)="assignRequest(request.id)">Assign</knod-button>
                </div>
              </div>
            </div>
          </div>
        }
      </ng-template>

      <!-- Request Timeline Template -->
      <ng-template #requestTimeline>
        <div class="timeline-container">
          <div class="timeline-header">
            <h4>Request Timeline</h4>
            <span class="timeline-subtitle">Track the progress of this request</span>
          </div>
          <div class="timeline-steps">
            <div class="timeline-step completed">
              <div class="step-marker">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="step-content">
                <span class="step-title">Request Submitted</span>
                <span class="step-date">{{ selectedRequest()?.requestedAt | date:'mediumDate' }}</span>
              </div>
            </div>
            <div class="timeline-step completed">
              <div class="step-marker">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="step-content">
                <span class="step-title">Manager Review</span>
                <span class="step-date">In progress</span>
              </div>
            </div>
            <div class="timeline-step active">
              <div class="step-marker">
                <span class="step-number">3</span>
              </div>
              <div class="step-content">
                <span class="step-title">IT Review</span>
                <span class="step-date">Current stage</span>
              </div>
            </div>
            <div class="timeline-step pending">
              <div class="step-marker">
                <span class="step-number">4</span>
              </div>
              <div class="step-content">
                <span class="step-title">Asset Assignment</span>
                <span class="step-date">Pending</span>
              </div>
            </div>
            <div class="timeline-step pending">
              <div class="step-marker">
                <span class="step-number">5</span>
              </div>
              <div class="step-content">
                <span class="step-title">Request Closed</span>
                <span class="step-date">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </ng-template>

      <!-- Request Conversation Template -->
      <ng-template #requestConversation>
        <div class="conversation-container">
          <div class="conversation-header">
            <h4>Conversation</h4>
            <div class="conversation-toggle">
              <button class="toggle-btn" [class.active]="!showInternal()" (click)="showInternal.set(false)">External</button>
              <button class="toggle-btn" [class.active]="showInternal()" (click)="showInternal.set(true)">Internal</button>
            </div>
          </div>
          <div class="conversation-messages">
            @for (msg of conversations(); track msg.id) {
              @if (!msg.isInternal || showInternal()) {
                <div class="message" [class.internal]="msg.isInternal">
                  <knod-avatar [name]="msg.author" size="sm"></knod-avatar>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-author">{{ msg.author }}</span>
                      <span class="message-role">{{ msg.authorRole }}</span>
                      @if (msg.isInternal) {
                        <knod-badge color="amber">Internal</knod-badge>
                      }
                      <span class="message-time">{{ msg.timestamp | date:'short' }}</span>
                    </div>
                    <p class="message-text">{{ msg.message }}</p>
                  </div>
                </div>
              }
            }
          </div>
          <div class="conversation-input">
            <textarea 
              class="input-textarea" 
              placeholder="Type your message..."
              [(ngModel)]="newMessage"></textarea>
            <div class="input-actions">
              <button class="attach-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <knod-button variant="primary" size="sm">Send</knod-button>
            </div>
          </div>
        </div>
      </ng-template>

      <!-- Request Activity Template -->
      <ng-template #requestActivity>
        <div class="activity-container">
          <h4>Activity Log</h4>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div class="activity-content">
                <span class="activity-text">Status changed to <strong>In Progress</strong></span>
                <span class="activity-time">2 hours ago by Rahul Jain</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="activity-content">
                <span class="activity-text">Assigned to <strong>IT Asset Team</strong></span>
                <span class="activity-time">5 hours ago by System</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="activity-content">
                <span class="activity-text">Request created</span>
                <span class="activity-time">1 day ago by Priya Patel</span>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .requests-page {
      max-width: 1600px;
      margin: 0 auto;
      padding: 32px;
    }

    /* Page Header - Design System */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 36px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    /* Stats Row - Design System */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .stat-card {
      background: white;
      border-radius: 24px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      cursor: pointer;
      transition: all 200ms ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0F172A;
    }

    .stat-label {
      font-size: 14px;
      color: #64748B;
    }

    .stat-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-indicator.blue { background: #3B82F6; }
    .stat-indicator.amber { background: #F59E0B; }
    .stat-indicator.violet { background: #8B5CF6; }
    .stat-indicator.green { background: #22C55E; }

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

    .search-wrapper {
      width: 100%;
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
    }

    .filter-select {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      font-size: 12px;
      background: white;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--color-primary-500);
    }

    .request-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .request-item {
      padding: 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
      margin-bottom: 4px;
    }

    .request-item:hover {
      background: var(--color-slate-50);
    }

    .request-item.selected {
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-200);
    }

    .request-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .request-id {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-primary-600);
      font-family: monospace;
    }

    .request-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .request-description {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 0 0 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .request-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .meta-separator {
      color: var(--color-slate-300);
    }

    .meta-time {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .request-asset {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-slate-500);
      background: var(--color-slate-50);
      padding: 4px 8px;
      border-radius: 4px;
      width: fit-content;
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

    .detail-header {
      padding: 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .detail-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .detail-id {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-primary-600);
      font-family: monospace;
    }

    .detail-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 4px 0 0 0;
    }

    .detail-actions {
      display: flex;
      gap: 8px;
    }

    .detail-status-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .detail-date {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .detail-tabs {
      padding: 0 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .detail-content {
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

    /* Overview Grid */
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-section.full-width {
      grid-column: span 2;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item label {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .info-item span {
      font-size: 13px;
      color: var(--color-slate-700);
      font-weight: 500;
    }

    .asset-info-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .asset-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      border-radius: 8px;
    }

    .asset-details {
      flex: 1;
    }

    .asset-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .asset-tag {
      display: block;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .requester-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .requester-info {
      display: flex;
      flex-direction: column;
    }

    .requester-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .requester-dept {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .assignment-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .sla-due {
      font-weight: 600;
      color: var(--color-slate-700);
    }

    .sla-due.overdue {
      color: var(--color-red-600);
    }

    .description-text {
      font-size: 13px;
      color: var(--color-slate-600);
      line-height: 1.6;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .assign-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--color-slate-100);
    }

    .assign-section .form-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
      margin-bottom: 8px;
      display: block;
    }

    .assign-options {
      display: flex;
      gap: 8px;
    }

    .assign-options .form-select {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      background: white;
    }

    /* Timeline */
    .timeline-container {
      padding: 8px 0;
    }

    .timeline-header {
      margin-bottom: 24px;
    }

    .timeline-header h4 {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .timeline-subtitle {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .timeline-steps {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
    }

    .timeline-steps::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 32px;
      bottom: 32px;
      width: 2px;
      background: var(--color-slate-200);
    }

    .timeline-step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      position: relative;
      padding: 16px 0;
    }

    .step-marker {
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
    }

    .timeline-step.completed .step-marker {
      background: var(--color-success-500);
      border-color: var(--color-success-500);
      color: white;
    }

    .timeline-step.active .step-marker {
      background: var(--color-primary-500);
      border-color: var(--color-primary-500);
      color: white;
    }

    .timeline-step.pending .step-marker {
      background: white;
      border-color: var(--color-slate-300);
    }

    .step-number {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-400);
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .step-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .step-date {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    /* Conversation */
    .conversation-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .conversation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .conversation-header h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .conversation-toggle {
      display: flex;
      background: var(--color-slate-100);
      border-radius: 6px;
      padding: 2px;
    }

    .toggle-btn {
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
      border-radius: 4px;
      transition: all var(--transition-fast);
    }

    .toggle-btn.active {
      background: white;
      color: var(--color-slate-900);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .conversation-messages {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }

    .message {
      display: flex;
      gap: 10px;
    }

    .message-content {
      flex: 1;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .message-author {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-800);
    }

    .message-role {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .message-time {
      font-size: 11px;
      color: var(--color-slate-400);
      margin-left: auto;
    }

    .message-text {
      font-size: 13px;
      color: var(--color-slate-700);
      line-height: 1.5;
      margin: 0;
      padding: 10px 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .message.internal .message-text {
      background: var(--color-amber-50);
    }

    .conversation-input {
      border-top: 1px solid var(--color-slate-100);
      padding-top: 16px;
    }

    .input-textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      resize: none;
      font-family: inherit;
    }

    .input-textarea:focus {
      outline: none;
      border-color: var(--color-primary-500);
    }

    .input-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .attach-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: var(--color-slate-500);
    }

    .attach-btn:hover {
      background: var(--color-slate-100);
      color: var(--color-slate-700);
    }

    /* Activity */
    .activity-container h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 16px 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .activity-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .activity-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 6px;
      color: var(--color-slate-500);
      flex-shrink: 0;
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .activity-text {
      font-size: 13px;
      color: var(--color-slate-700);
    }

    .activity-time {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    /* Icons */
    .plusIcon, .closeIcon {
      display: flex;
    }
  `]
})
export class RequestsComponent {
  private router: Router;

  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly closeIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  readonly searchQuery = signal('');
  readonly priorityFilter = signal('');
  readonly categoryFilter = signal('');
  readonly activeDetailTab = signal('overview');
  readonly showInternal = signal(false);
  readonly newMessage = '';

  readonly detailTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'conversation', label: 'Conversation' },
    { key: 'activity', label: 'Activity' }
  ];

  readonly requests = signal<Request[]>([
    {
      id: 'REQ-4521', type: 'New Laptop Request', category: 'Asset Request', subcategory: 'New Asset',
      priority: 'high', status: 'open', requestedAt: '2026-06-04', updatedAt: '2026-06-05T09:30:00',
      requestedBy: 'Vikram Singh', requestedByDept: 'Engineering', assignedTo: 'IT Asset Team',
      slaDue: '2026-06-06', escalation: 'team_lead',
      description: 'Requesting a new laptop for the new team member joining next week. The current inventory does not have any available laptops that meet the requirements for the role.',
      assetTag: undefined, assetName: undefined
    },
    {
      id: 'REQ-4520', type: 'Monitor Replacement', category: 'Asset Issue', subcategory: 'Hardware',
      priority: 'medium', status: 'in_progress', requestedAt: '2026-06-03', updatedAt: '2026-06-04T16:00:00',
      requestedBy: 'Sneha Gupta', requestedByDept: 'Design', assignedTo: 'IT Support',
      slaDue: '2026-06-05', escalation: 'none',
      description: 'My external monitor has stopped working. The screen flickers and then goes blank after a few minutes.',
      assetTag: 'AST-1056', assetName: 'Dell UltraSharp U2723QE'
    },
    {
      id: 'REQ-4519', type: 'Software Installation', category: 'Software', subcategory: 'Installation',
      priority: 'low', status: 'pending_approval', requestedAt: '2026-06-02', updatedAt: '2026-06-03T10:00:00',
      requestedBy: 'Arun Kumar', requestedByDept: 'Finance', assignedTo: 'IT Support',
      slaDue: '2026-06-07', escalation: 'none',
      description: 'Need Adobe Creative Cloud installed for design work.',
      assetTag: 'AST-1045', assetName: 'MacBook Pro 14" M3'
    },
    {
      id: 'REQ-4518', type: 'Keyboard Repair', category: 'Asset Issue', subcategory: 'Repair',
      priority: 'medium', status: 'in_progress', requestedAt: '2026-06-01', updatedAt: '2026-06-02T14:00:00',
      requestedBy: 'Meera Joshi', requestedByDept: 'Marketing', assignedTo: 'IT Support',
      slaDue: '2026-06-04', escalation: 'manager',
      description: 'Some keys on my keyboard are not responding properly. Keys K, L, and Enter sometimes do not register.',
      assetTag: 'AST-1078', assetName: 'Magic Keyboard'
    },
    {
      id: 'REQ-4517', type: 'Access Request', category: 'Access', subcategory: 'System Access',
      priority: 'high', status: 'open', requestedAt: '2026-05-30', updatedAt: '2026-05-31T11:00:00',
      requestedBy: 'Rahul Verma', requestedByDept: 'Operations', assignedTo: 'IT Asset Team',
      slaDue: '2026-06-01', escalation: 'critical',
      description: 'Need access to the production database for the new project.',
      assetTag: undefined, assetName: undefined
    }
  ]);

  readonly selectedRequest = signal<Request | null>(null);

  readonly conversations = signal<Conversation[]>([
    { id: '1', author: 'Sneha Gupta', authorRole: 'Requester', timestamp: '2026-06-03T10:30:00', message: 'The monitor issue started yesterday. I tried using different cables but the problem persists.', isInternal: false },
    { id: '2', author: 'Rahul Jain', authorRole: 'IT Support', timestamp: '2026-06-03T11:45:00', message: 'Hi Sneha, I have reviewed your ticket. Let me check the inventory for a replacement monitor.', isInternal: false },
    { id: '3', author: 'Rahul Jain', authorRole: 'IT Support', timestamp: '2026-06-03T11:50:00', message: 'We have a spare Dell UltraSharp available. Will arrange for replacement tomorrow.', isInternal: true },
    { id: '4', author: 'IT Manager', authorRole: 'Manager', timestamp: '2026-06-04T09:00:00', message: 'Approved for replacement. Please update the requester.', isInternal: true }
  ]);

  readonly filteredRequests = computed(() => {
    let result = this.requests();
    const query = this.searchQuery().toLowerCase();
    const priority = this.priorityFilter();
    const category = this.categoryFilter();

    if (query) {
      result = result.filter(r => 
        r.id.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
      );
    }

    if (priority) {
      result = result.filter(r => r.priority === priority);
    }

    if (category) {
      result = result.filter(r => r.category === category);
    }

    return result;
  });

  constructor(router: Router) {
    this.router = router;
    // Select first request by default
    this.selectedRequest.set(this.requests()[1]);
  }

  filterByStatus(status: string): void {
    // Implement status filtering
  }

  navigateToNewRequest(): void {
    this.router.navigate(['/requests/new']);
  }

  selectRequest(request: Request): void {
    this.selectedRequest.set(request);
  }

  getPriorityColor(priority: string): 'red' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'red' | 'amber' | 'blue' | 'slate'> = {
      'high': 'red',
      'medium': 'amber',
      'low': 'blue'
    };
    return colors[priority] || 'slate';
  }

  getCategoryColor(category: string): 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber' {
    const colors: Record<string, 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber'> = {
      'Asset Request': 'blue',
      'Asset Issue': 'amber',
      'Software': 'indigo',
      'Hardware': 'violet',
      'Access': 'cyan'
    };
    return colors[category] || 'slate';
  }

  getStatusColor(status: string): 'green' | 'amber' | 'blue' | 'red' | 'slate' | 'violet' {
    const colors: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'slate' | 'violet'> = {
      'open': 'blue',
      'in_progress': 'amber',
      'pending_approval': 'violet',
      'resolved': 'green',
      'rejected': 'red',
      'closed': 'slate'
    };
    return colors[status] || 'slate';
  }

  getEscalationColor(escalation: string): 'red' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'red' | 'amber' | 'blue' | 'slate'> = {
      'critical': 'red',
      'manager': 'amber',
      'team_lead': 'blue',
      'none': 'slate'
    };
    return colors[escalation] || 'slate';
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  isOverdue(slaDate: string): boolean {
    return new Date(slaDate) < new Date();
  }

  readonly selectedAssignee = signal('');

  updateRequestStatus(requestId: string, newStatus: string): void {
    const requestList = this.requests();
    const requestIndex = requestList.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      const updatedRequest = { ...requestList[requestIndex], status: newStatus, updatedAt: new Date().toISOString() };
      const newList = [...requestList];
      newList[requestIndex] = updatedRequest;
      this.requests.set(newList);
      
      // Update selected request if it's the one being modified
      if (this.selectedRequest()?.id === requestId) {
        this.selectedRequest.set(updatedRequest);
      }
      
      // Add activity log entry
      console.log(`Request ${requestId} status updated to: ${newStatus}`);
    }
  }

  assignRequest(requestId: string): void {
    const assignee = this.selectedAssignee();
    if (!assignee) {
      alert('Please select a team member to assign');
      return;
    }
    
    const requestList = this.requests();
    const requestIndex = requestList.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      const updatedRequest = { ...requestList[requestIndex], assignedTo: assignee, updatedAt: new Date().toISOString() };
      const newList = [...requestList];
      newList[requestIndex] = updatedRequest;
      this.requests.set(newList);
      
      if (this.selectedRequest()?.id === requestId) {
        this.selectedRequest.set(updatedRequest);
      }
      
      this.selectedAssignee.set('');
      console.log(`Request ${requestId} assigned to: ${assignee}`);
    }
  }

  updatePriority(requestId: string, newPriority: 'high' | 'medium' | 'low'): void {
    const requestList = this.requests();
    const requestIndex = requestList.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      const updatedRequest = { ...requestList[requestIndex], priority: newPriority, updatedAt: new Date().toISOString() };
      const newList = [...requestList];
      newList[requestIndex] = updatedRequest;
      this.requests.set(newList);
      
      if (this.selectedRequest()?.id === requestId) {
        this.selectedRequest.set(updatedRequest);
      }
      
      console.log(`Request ${requestId} priority updated to: ${newPriority}`);
    }
  }
}