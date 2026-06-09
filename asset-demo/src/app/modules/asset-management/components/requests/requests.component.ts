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
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'fulfilled' | 'rejected' | 'cancelled';
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
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span class="breadcrumb-item">Home</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span class="breadcrumb-item active">Asset Requests</span>
      </div>

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div class="header-content">
            <h1 class="page-title">Asset Requests</h1>
            <p class="page-subtitle">Submit and track asset requests for your team</p>
          </div>
        </div>
        <div class="header-actions">
          <knod-button variant="primary" size="lg" (click)="navigateToNewRequest()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Request
          </knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" (click)="filterByStatus('pending_approval')">
          <div class="stat-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getCountByStatus('pending_approval') }}</span>
            <span class="stat-label">Pending Approval</span>
          </div>
        </div>
        <div class="stat-card" (click)="filterByStatus('approved')">
          <div class="stat-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getCountByStatus('approved') }}</span>
            <span class="stat-label">Approved</span>
          </div>
        </div>
        <div class="stat-card" (click)="filterByStatus('processing')">
          <div class="stat-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getCountByStatus('processing') }}</span>
            <span class="stat-label">Processing</span>
          </div>
        </div>
        <div class="stat-card" (click)="filterByStatus('fulfilled')">
          <div class="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ getCountByStatus('fulfilled') }}</span>
            <span class="stat-label">Fulfilled</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left: Request List -->
        <div class="list-panel">
          <div class="panel-header">
            <h3 class="panel-title">All Requests</h3>
            <span class="panel-count">{{ filteredRequests().length }} requests</span>
          </div>
          
          <!-- Filters -->
          <div class="filters-bar">
            <div class="search-wrapper">
              <knod-search 
                placeholder="Search requests..."
                [value]="searchQuery()"
                (valueChange)="searchQuery.set($event)">
              </knod-search>
            </div>
            <div class="filter-row">
              <select class="filter-select" [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)">
                <option value="">All Categories</option>
                <option value="Asset Request">Asset Request</option>
                <option value="Asset Issue">Asset Issue</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Access">Access</option>
              </select>
              <select class="filter-select" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
                <option value="">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <!-- Request List -->
          <div class="request-list">
            @for (request of filteredRequests(); track request.id) {
              <div 
                class="request-card"
                [class.selected]="selectedRequest()?.id === request.id"
                [class.urgent]="request.priority === 'high'"
                (click)="selectRequest(request)">
                <div class="request-card-header">
                  <span class="request-id">{{ request.id }}</span>
                  <knod-badge [color]="getPriorityColor(request.priority)">{{ request.priority }}</knod-badge>
                </div>
                <h4 class="request-title">{{ request.type }}</h4>
                <p class="request-description">{{ request.description }}</p>
                <div class="request-footer">
                  <div class="request-meta">
                    <knod-badge [color]="getStatusColor(request.status)">{{ formatStatus(request.status) }}</knod-badge>
                    <span class="meta-separator">•</span>
                    <span class="meta-time">{{ getTimeAgo(request.updatedAt) }}</span>
                  </div>
                  <div class="requester-info">
                    <div class="requester-avatar">{{ getInitials(request.requestedBy) }}</div>
                    <span class="requester-name">{{ request.requestedBy }}</span>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-list">
                <div class="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <h4>No requests found</h4>
                <p>Create a new request to get started</p>
              </div>
            }
          </div>
        </div>

        <!-- Right: Request Detail -->
        <div class="detail-panel">
          @if (selectedRequest(); as request) {
            <div class="detail-card">
              <!-- Request Header -->
              <div class="detail-header">
                <div class="detail-title-section">
                  <div class="detail-icon" [ngClass]="getCategoryClass(request.category)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div>
                    <div class="detail-id-row">
                      <span class="detail-id">{{ request.id }}</span>
                      <knod-badge [color]="getStatusColor(request.status)">{{ formatStatus(request.status) }}</knod-badge>
                    </div>
                    <h2 class="detail-title">{{ request.type }}</h2>
                    <p class="detail-meta">Submitted {{ request.requestedAt | date:'mediumDate' }} by {{ request.requestedBy }}</p>
                  </div>
                </div>
              </div>

              <!-- Workflow Progress -->
              <div class="workflow-progress">
                <div class="workflow-steps">
                  <div class="workflow-step" [class.active]="isStepActive(request.status, 'draft')" [class.completed]="isStepCompleted(request.status, 'draft')">
                    <div class="step-circle">
                      @if (isStepCompleted(request.status, 'draft')) {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <span>1</span>
                      }
                    </div>
                    <span class="step-label">Draft</span>
                  </div>
                  <div class="workflow-connector" [class.active]="isStepCompleted(request.status, 'draft')"></div>
                  <div class="workflow-step" [class.active]="isStepActive(request.status, 'pending_approval')" [class.completed]="isStepCompleted(request.status, 'pending_approval')">
                    <div class="step-circle">
                      @if (isStepCompleted(request.status, 'pending_approval')) {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <span>2</span>
                      }
                    </div>
                    <span class="step-label">Manager Approval</span>
                  </div>
                  <div class="workflow-connector" [class.active]="isStepCompleted(request.status, 'pending_approval')"></div>
                  <div class="workflow-step" [class.active]="isStepActive(request.status, 'approved')" [class.completed]="isStepCompleted(request.status, 'approved')">
                    <div class="step-circle">
                      @if (isStepCompleted(request.status, 'approved')) {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <span>3</span>
                      }
                    </div>
                    <span class="step-label">Approved</span>
                  </div>
                  <div class="workflow-connector" [class.active]="isStepCompleted(request.status, 'approved')"></div>
                  <div class="workflow-step" [class.active]="isStepActive(request.status, 'processing')" [class.completed]="isStepCompleted(request.status, 'processing')">
                    <div class="step-circle">
                      @if (isStepCompleted(request.status, 'processing')) {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <span>4</span>
                      }
                    </div>
                    <span class="step-label">Processing</span>
                  </div>
                  <div class="workflow-connector" [class.active]="isStepCompleted(request.status, 'processing')"></div>
                  <div class="workflow-step" [class.active]="isStepActive(request.status, 'fulfilled')" [class.completed]="isStepCompleted(request.status, 'fulfilled')">
                    <div class="step-circle">
                      @if (isStepCompleted(request.status, 'fulfilled')) {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <span>5</span>
                      }
                    </div>
                    <span class="step-label">Fulfilled</span>
                  </div>
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
            <!-- Request Details -->
            <div class="info-card">
              <h4 class="section-title">Request Details</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Category</label>
                  <knod-badge [color]="getCategoryColor(request.category)">{{ request.category }}</knod-badge>
                </div>
                <div class="info-item">
                  <label>Subcategory</label>
                  <span class="info-value">{{ request.subcategory }}</span>
                </div>
                <div class="info-item">
                  <label>Priority</label>
                  <knod-badge [color]="getPriorityColor(request.priority)">{{ request.priority | titlecase }}</knod-badge>
                </div>
                <div class="info-item">
                  <label>Department</label>
                  <span class="info-value">{{ request.requestedByDept }}</span>
                </div>
              </div>
            </div>

            <!-- Asset Info -->
            @if (request.assetTag) {
              <div class="info-card">
                <h4 class="section-title">Asset Information</h4>
                <div class="asset-card">
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
                </div>
              </div>
            }

            <!-- Requester Info -->
            <div class="info-card">
              <h4 class="section-title">Requester</h4>
              <div class="requester-card">
                <div class="requester-avatar-lg">{{ getInitials(request.requestedBy) }}</div>
                <div class="requester-info">
                  <span class="requester-name">{{ request.requestedBy }}</span>
                  <span class="requester-dept">{{ request.requestedByDept }}</span>
                </div>
              </div>
            </div>

            <!-- Assignment Info -->
            <div class="info-card">
              <h4 class="section-title">Assignment</h4>
              <div class="assignment-info">
                <div class="info-item">
                  <label>Assigned To</label>
                  <span class="info-value">{{ request.assignedTo }}</span>
                </div>
                <div class="info-item">
                  <label>SLA Due</label>
                  <span class="info-value" [class.overdue]="isOverdue(request.slaDue)">
                    {{ request.slaDue | date:'mediumDate' }}
                    @if (isOverdue(request.slaDue)) {
                      <span class="overdue-badge">Overdue</span>
                    }
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="info-card full-width">
              <h4 class="section-title">Description</h4>
              <p class="description-text">{{ request.description }}</p>
            </div>

            <!-- Actions -->
            <div class="info-card full-width">
              <h4 class="section-title">Actions</h4>
              <div class="action-grid">
                @if (request.status === 'draft' || request.status === 'pending_approval') {
                  <div class="action-item">
                    <div class="action-icon purple">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Submit for Approval</span>
                      <span class="action-desc">Send to manager for review</span>
                    </div>
                    <knod-button variant="primary" size="sm" (click)="updateRequestStatus(request.id, 'pending_approval')">Submit</knod-button>
                  </div>
                }
                @if (request.status === 'pending_approval') {
                  <div class="action-item">
                    <div class="action-icon green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Approve Request</span>
                      <span class="action-desc">Manager approves to start processing</span>
                    </div>
                    <knod-button variant="primary" size="sm" (click)="updateRequestStatus(request.id, 'approved')">Approve</knod-button>
                  </div>
                  <div class="action-item">
                    <div class="action-icon red">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Reject Request</span>
                      <span class="action-desc">Reject with reason</span>
                    </div>
                    <knod-button variant="danger" size="sm" (click)="updateRequestStatus(request.id, 'rejected')">Reject</knod-button>
                  </div>
                }
                @if (request.status === 'approved') {
                  <div class="action-item">
                    <div class="action-icon blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Start Processing</span>
                      <span class="action-desc">Begin asset fulfillment process</span>
                    </div>
                    <knod-button variant="primary" size="sm" (click)="updateRequestStatus(request.id, 'processing')">Start</knod-button>
                  </div>
                }
                @if (request.status === 'processing') {
                  <div class="action-item">
                    <div class="action-icon green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Mark as Fulfilled</span>
                      <span class="action-desc">Complete the request</span>
                    </div>
                    <knod-button variant="primary" size="sm" (click)="updateRequestStatus(request.id, 'fulfilled')">Complete</knod-button>
                  </div>
                }
                @if (request.status === 'rejected' || request.status === 'cancelled') {
                  <div class="action-item">
                    <div class="action-icon blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Reopen Request</span>
                      <span class="action-desc">Start fresh with this request</span>
                    </div>
                    <knod-button variant="outline" size="sm" (click)="updateRequestStatus(request.id, 'draft')">Reopen</knod-button>
                  </div>
                }
                @if (request.status === 'fulfilled') {
                  <div class="action-item success">
                    <div class="action-icon green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Request Completed</span>
                      <span class="action-desc">Asset has been fulfilled</span>
                    </div>
                    <knod-badge color="green">Fulfilled</knod-badge>
                  </div>
                }
              </div>

              <!-- Assign Section -->
              @if (request.status !== 'fulfilled' && request.status !== 'rejected') {
                <div class="assign-section">
                  <label class="form-label">Assign to Team Member</label>
                  <div class="assign-row">
                    <select class="form-select" [ngModel]="selectedAssignee()" (ngModelChange)="selectedAssignee.set($event)">
                      <option value="">Select team member</option>
                      <option value="Rahul Jain">Rahul Jain</option>
                      <option value="Priya Patel">Priya Patel</option>
                      <option value="Amit Singh">Amit Singh</option>
                      <option value="IT Asset Team">IT Asset Team</option>
                      <option value="IT Support">IT Support</option>
                    </select>
                    <knod-button variant="outline" size="sm" (click)="assignRequest(request.id)">Assign</knod-button>
                  </div>
                </div>
              }
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
            <div class="timeline-step" [class.completed]="isStepCompleted(selectedRequest()?.status, 'draft')" [class.active]="isStepActive(selectedRequest()?.status, 'draft')">
              <div class="step-marker">
                @if (isStepCompleted(selectedRequest()?.status, 'draft')) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else {
                  <span>1</span>
                }
              </div>
              <div class="step-content">
                <span class="step-title">Request Submitted</span>
                <span class="step-date">{{ selectedRequest()?.requestedAt | date:'mediumDate' }}</span>
              </div>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted(selectedRequest()?.status, 'pending_approval')" [class.active]="isStepActive(selectedRequest()?.status, 'pending_approval')">
              <div class="step-marker">
                @if (isStepCompleted(selectedRequest()?.status, 'pending_approval')) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else {
                  <span>2</span>
                }
              </div>
              <div class="step-content">
                <span class="step-title">Manager Review</span>
                <span class="step-date">{{ getStatusDate('pending_approval') }}</span>
              </div>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted(selectedRequest()?.status, 'approved')" [class.active]="isStepActive(selectedRequest()?.status, 'approved')">
              <div class="step-marker">
                @if (isStepCompleted(selectedRequest()?.status, 'approved')) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else {
                  <span>3</span>
                }
              </div>
              <div class="step-content">
                <span class="step-title">Approved</span>
                <span class="step-date">{{ getStatusDate('approved') }}</span>
              </div>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted(selectedRequest()?.status, 'processing')" [class.active]="isStepActive(selectedRequest()?.status, 'processing')">
              <div class="step-marker">
                @if (isStepCompleted(selectedRequest()?.status, 'processing')) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else {
                  <span>4</span>
                }
              </div>
              <div class="step-content">
                <span class="step-title">Asset Processing</span>
                <span class="step-date">{{ getStatusDate('processing') }}</span>
              </div>
            </div>
            <div class="timeline-step" [class.completed]="isStepCompleted(selectedRequest()?.status, 'fulfilled')" [class.active]="isStepActive(selectedRequest()?.status, 'fulfilled')">
              <div class="step-marker">
                @if (isStepCompleted(selectedRequest()?.status, 'fulfilled')) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else {
                  <span>5</span>
                }
              </div>
              <div class="step-content">
                <span class="step-title">Request Fulfilled</span>
                <span class="step-date">{{ getStatusDate('fulfilled') }}</span>
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
                  <div class="message-avatar">{{ getInitials(msg.author) }}</div>
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
      background: #F3F6FB;
      min-height: 100vh;
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #64748B;
    }

    .breadcrumb-item {
      color: #64748B;
    }

    .breadcrumb-item.active {
      color: #0F172A;
      font-weight: 500;
    }

    .breadcrumb svg {
      color: #CBD5E1;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      background: white;
      padding: 28px 32px;
      border-radius: 28px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }

    .header-left {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .header-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
      color: #6366F1;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .page-title {
      font-size: 36px;
      font-weight: 700;
      color: #0F172A;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    @media (max-width: 1200px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      background: white;
      border-radius: 24px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      cursor: pointer;
      transition: all 200ms ease;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon.blue {
      background: #EFF6FF;
      color: #3B82F6;
    }

    .stat-icon.purple {
      background: #F3E8FF;
      color: #8B5CF6;
    }

    .stat-icon.amber {
      background: #FEF3C7;
      color: #F59E0B;
    }

    .stat-icon.green {
      background: #DCFCE7;
      color: #22C55E;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #64748B;
    }

    /* Content Layout */
    .content-layout {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 24px;
      min-height: 600px;
    }

    @media (max-width: 1200px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
    }

    /* List Panel */
    .list-panel {
      background: white;
      border-radius: 28px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid #E5EAF3;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-title {
      font-size: 18px;
      font-weight: 600;
      color: #0F172A;
      margin: 0;
    }

    .panel-count {
      font-size: 13px;
      color: #64748B;
      background: #F3F6FB;
      padding: 4px 12px;
      border-radius: 999px;
    }

    .filters-bar {
      padding: 16px 24px;
      border-bottom: 1px solid #E5EAF3;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .search-wrapper {
      width: 100%;
    }

    .filter-row {
      display: flex;
      gap: 12px;
    }

    .filter-select {
      flex: 1;
      height: 44px;
      padding: 0 16px;
      border: 2px solid #E5EAF3;
      border-radius: 14px;
      font-size: 13px;
      background: white;
      cursor: pointer;
      transition: all 200ms ease;
      color: #0F172A;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .request-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .request-card {
      background: #FAFBFC;
      border-radius: 20px;
      padding: 20px;
      cursor: pointer;
      transition: all 200ms ease;
      border: 2px solid transparent;
    }

    .request-card:hover {
      background: white;
      border-color: #E5EAF3;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    }

    .request-card.selected {
      background: white;
      border-color: #3B82F6;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
    }

    .request-card.urgent {
      border-left: 4px solid #EF4444;
    }

    .request-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .request-id {
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
      font-family: monospace;
    }

    .request-title {
      font-size: 15px;
      font-weight: 600;
      color: #0F172A;
      margin: 0 0 8px 0;
    }

    .request-description {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 16px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .request-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .request-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meta-separator {
      color: #CBD5E1;
    }

    .meta-time {
      font-size: 12px;
      color: #94A3B8;
    }

    .requester-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .requester-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
    }

    .requester-name {
      font-size: 12px;
      color: #64748B;
    }

    .empty-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: #F3F6FB;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94A3B8;
      margin-bottom: 16px;
    }

    .empty-list h4 {
      font-size: 16px;
      font-weight: 600;
      color: #0F172A;
      margin: 0 0 4px 0;
    }

    .empty-list p {
      font-size: 13px;
      color: #64748B;
      margin: 0;
    }

    /* Detail Panel */
    .detail-panel {
      display: flex;
      flex-direction: column;
    }

    .detail-card {
      background: white;
      border-radius: 28px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }

    .detail-header {
      padding: 28px;
      border-bottom: 1px solid #E5EAF3;
      background: linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%);
    }

    .detail-title-section {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .detail-icon {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon.blue { background: #EFF6FF; color: #3B82F6; }
    .detail-icon.amber { background: #FEF3C7; color: #F59E0B; }
    .detail-icon.indigo { background: #EEF2FF; color: #6366F1; }
    .detail-icon.violet { background: #F3E8FF; color: #8B5CF6; }
    .detail-icon.cyan { background: #CFFAFE; color: #06B6D4; }

    .detail-id-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }

    .detail-id {
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
      font-family: monospace;
    }

    .detail-title {
      font-size: 24px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 8px 0;
    }

    .detail-meta {
      font-size: 14px;
      color: #64748B;
      margin: 0;
    }

    /* Workflow Progress */
    .workflow-progress {
      padding: 24px 28px;
      border-bottom: 1px solid #E5EAF3;
      background: white;
    }

    .workflow-steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .workflow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .step-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 2px solid #E5EAF3;
      color: #94A3B8;
      font-size: 13px;
      font-weight: 600;
      transition: all 200ms ease;
    }

    .workflow-step.active .step-circle {
      background: #3B82F6;
      border-color: #3B82F6;
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .workflow-step.completed .step-circle {
      background: #22C55E;
      border-color: #22C55E;
      color: white;
    }

    .step-label {
      font-size: 11px;
      color: #94A3B8;
      text-align: center;
      max-width: 80px;
    }

    .workflow-step.active .step-label,
    .workflow-step.completed .step-label {
      color: #0F172A;
      font-weight: 500;
    }

    .workflow-connector {
      flex: 1;
      height: 3px;
      background: #E5EAF3;
      margin: 0 8px;
      margin-bottom: 24px;
      border-radius: 999px;
      transition: all 200ms ease;
    }

    .workflow-connector.active {
      background: #22C55E;
    }

    /* Detail Tabs */
    .detail-tabs {
      padding: 0 28px;
      border-bottom: 1px solid #E5EAF3;
    }

    .detail-content {
      padding: 28px;
      overflow-y: auto;
      max-height: 500px;
    }

    /* No Selection */
    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 500px;
      text-align: center;
      background: white;
      border-radius: 28px;
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }

    .no-selection-icon {
      width: 96px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F3F6FB;
      border-radius: 28px;
      color: #94A3B8;
      margin-bottom: 24px;
    }

    .no-selection h3 {
      font-size: 20px;
      font-weight: 600;
      color: #0F172A;
      margin: 0 0 8px 0;
    }

    .no-selection p {
      font-size: 14px;
      color: #64748B;
      margin: 0;
    }

    /* Overview Grid */
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-card {
      background: #FAFBFC;
      border-radius: 20px;
      padding: 24px;
    }

    .info-card.full-width {
      grid-column: span 2;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 16px 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-item label {
      font-size: 12px;
      color: #94A3B8;
    }

    .info-value {
      font-size: 14px;
      color: #0F172A;
      font-weight: 500;
    }

    .asset-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 14px;
      border: 1px solid #E5EAF3;
    }

    .asset-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #F3E8FF;
      color: #8B5CF6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .asset-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .asset-name {
      font-size: 14px;
      font-weight: 600;
      color: #0F172A;
    }

    .asset-tag {
      font-size: 12px;
      color: #64748B;
    }

    .requester-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 14px;
      border: 1px solid #E5EAF3;
    }

    .requester-avatar-lg {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
    }

    .requester-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .requester-name {
      font-size: 15px;
      font-weight: 600;
      color: #0F172A;
    }

    .requester-dept {
      font-size: 13px;
      color: #64748B;
    }

    .assignment-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .overdue {
      color: #EF4444 !important;
    }

    .overdue-badge {
      font-size: 10px;
      background: #FEE2E2;
      color: #EF4444;
      padding: 2px 8px;
      border-radius: 999px;
      margin-left: 8px;
      font-weight: 600;
    }

    .description-text {
      font-size: 14px;
      color: #64748B;
      line-height: 1.7;
      margin: 0;
      padding: 16px;
      background: white;
      border-radius: 14px;
      border: 1px solid #E5EAF3;
    }

    /* Action Grid */
    .action-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 16px;
      border: 1px solid #E5EAF3;
      transition: all 200ms ease;
    }

    .action-item:hover {
      border-color: #CBD5E1;
    }

    .action-item.success {
      background: #F0FDF4;
      border-color: #86EFAC;
    }

    .action-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-icon.green { background: #DCFCE7; color: #22C55E; }
    .action-icon.purple { background: #F3E8FF; color: #8B5CF6; }
    .action-icon.blue { background: #EFF6FF; color: #3B82F6; }
    .action-icon.red { background: #FEE2E2; color: #EF4444; }

    .action-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .action-title {
      font-size: 14px;
      font-weight: 600;
      color: #0F172A;
    }

    .action-desc {
      font-size: 12px;
      color: #64748B;
    }

    .assign-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #E5EAF3;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #64748B;
      margin-bottom: 10px;
    }

    .assign-row {
      display: flex;
      gap: 12px;
    }

    .form-select {
      flex: 1;
      height: 44px;
      padding: 0 16px;
      border: 2px solid #E5EAF3;
      border-radius: 14px;
      font-size: 13px;
      background: white;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .form-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    /* Timeline */
    .timeline-container {
      padding: 8px 0;
    }

    .timeline-header {
      margin-bottom: 28px;
    }

    .timeline-header h4 {
      font-size: 16px;
      font-weight: 600;
      color: #0F172A;
      margin: 0 0 4px 0;
    }

    .timeline-subtitle {
      font-size: 13px;
      color: #64748B;
    }

    .timeline-steps {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
      padding-left: 8px;
    }

    .timeline-steps::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 32px;
      bottom: 32px;
      width: 2px;
      background: #E5EAF3;
    }

    .timeline-step {
      display: flex;
      align-items: flex-start;
      gap: 20px;
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
      border: 2px solid #E5EAF3;
      z-index: 1;
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 600;
      color: #94A3B8;
    }

    .timeline-step.completed .step-marker {
      background: #22C55E;
      border-color: #22C55E;
      color: white;
    }

    .timeline-step.active .step-marker {
      background: #3B82F6;
      border-color: #3B82F6;
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 4px;
    }

    .step-title {
      font-size: 14px;
      font-weight: 500;
      color: #0F172A;
    }

    .step-date {
      font-size: 12px;
      color: #94A3B8;
    }

    /* Conversation */
    .conversation-container {
      display: flex;
      flex-direction: column;
      height: 400px;
    }

    .conversation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .conversation-header h4 {
      font-size: 16px;
      font-weight: 600;
      color: #0F172A;
      margin: 0;
    }

    .conversation-toggle {
      display: flex;
      background: #F3F6FB;
      border-radius: 10px;
      padding: 4px;
    }

    .toggle-btn {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: #64748B;
      border-radius: 8px;
      transition: all 200ms ease;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .toggle-btn.active {
      background: white;
      color: #0F172A;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
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
      gap: 12px;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .message-content {
      flex: 1;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }

    .message-author {
      font-size: 14px;
      font-weight: 600;
      color: #0F172A;
    }

    .message-role {
      font-size: 12px;
      color: #94A3B8;
    }

    .message-time {
      font-size: 11px;
      color: #94A3B8;
      margin-left: auto;
    }

    .message-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0;
      padding: 14px 16px;
      background: #F8FAFC;
      border-radius: 14px;
    }

    .message.internal .message-text {
      background: #FEF3C7;
    }

    .conversation-input {
      border-top: 1px solid #E5EAF3;
      padding-top: 16px;
    }

    .input-textarea {
      width: 100%;
      min-height: 80px;
      padding: 14px 16px;
      border: 2px solid #E5EAF3;
      border-radius: 14px;
      font-size: 14px;
      resize: none;
      font-family: inherit;
      transition: all 200ms ease;
    }

    .input-textarea:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .input-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }

    .attach-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: #64748B;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .attach-btn:hover {
      background: #F3F6FB;
      color: #0F172A;
    }

    /* Activity */
    .activity-container h4 {
      font-size: 16px;
      font-weight: 600;
      color: #0F172A;
      margin: 0 0 20px 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .activity-item {
      display: flex;
      gap: 14px;
      padding: 16px;
      background: #F8FAFC;
      border-radius: 14px;
    }

    .activity-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 10px;
      color: #64748B;
      flex-shrink: 0;
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .activity-text {
      font-size: 14px;
      color: #475569;
    }

    .activity-time {
      font-size: 12px;
      color: #94A3B8;
    }
  `]
})
export class RequestsComponent {
  private router: Router;

  readonly searchQuery = signal('');
  readonly priorityFilter = signal('');
  readonly categoryFilter = signal('');
  readonly statusFilter = signal('');
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
      priority: 'high', status: 'pending_approval', requestedAt: '2026-06-04', updatedAt: '2026-06-05T09:30:00',
      requestedBy: 'Vikram Singh', requestedByDept: 'Engineering', assignedTo: 'IT Asset Team',
      slaDue: '2026-06-06', escalation: 'team_lead',
      description: 'Requesting a new laptop for the new team member joining next week. The current inventory does not have any available laptops that meet the requirements for the role.',
      assetTag: undefined, assetName: undefined
    },
    {
      id: 'REQ-4520', type: 'Monitor Replacement', category: 'Asset Issue', subcategory: 'Hardware',
      priority: 'medium', status: 'processing', requestedAt: '2026-06-03', updatedAt: '2026-06-04T16:00:00',
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
      priority: 'medium', status: 'processing', requestedAt: '2026-06-01', updatedAt: '2026-06-02T14:00:00',
      requestedBy: 'Meera Joshi', requestedByDept: 'Marketing', assignedTo: 'IT Support',
      slaDue: '2026-06-04', escalation: 'manager',
      description: 'Some keys on my keyboard are not responding properly. Keys K, L, and Enter sometimes do not register.',
      assetTag: 'AST-1078', assetName: 'Magic Keyboard'
    },
    {
      id: 'REQ-4517', type: 'Access Request', category: 'Access', subcategory: 'System Access',
      priority: 'high', status: 'approved', requestedAt: '2026-05-30', updatedAt: '2026-06-01T11:00:00',
      requestedBy: 'Rahul Verma', requestedByDept: 'Operations', assignedTo: 'IT Asset Team',
      slaDue: '2026-06-01', escalation: 'critical',
      description: 'Need access to the production database for the new project.',
      assetTag: undefined, assetName: undefined
    },
    {
      id: 'REQ-4516', type: 'New Chair Request', category: 'Asset Request', subcategory: 'New Asset',
      priority: 'low', status: 'fulfilled', requestedAt: '2026-05-25', updatedAt: '2026-05-28T14:00:00',
      requestedBy: 'Priya Patel', requestedByDept: 'HR', assignedTo: 'IT Asset Team',
      slaDue: '2026-05-30', escalation: 'none',
      description: 'Need an ergonomic chair for the new workstation setup.',
      assetTag: 'AST-1090', assetName: 'Herman Miller Aeron'
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
    const status = this.statusFilter();

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

    if (status) {
      result = result.filter(r => r.status === status);
    }

    return result;
  });

  constructor(router: Router) {
    this.router = router;
    // Select first request by default
    this.selectedRequest.set(this.requests()[0]);
  }

  filterByStatus(status: string): void {
    this.statusFilter.set(status);
  }

  navigateToNewRequest(): void {
    this.router.navigate(['/requests/new']);
  }

  selectRequest(request: Request): void {
    this.selectedRequest.set(request);
  }

  getCountByStatus(status: string): number {
    return this.requests().filter(r => r.status === status).length;
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

  getCategoryClass(category: string): string {
    const classes: Record<string, string> = {
      'Asset Request': 'blue',
      'Asset Issue': 'amber',
      'Software': 'indigo',
      'Hardware': 'violet',
      'Access': 'cyan'
    };
    return classes[category] || 'blue';
  }

  getStatusColor(status: string): 'green' | 'amber' | 'blue' | 'red' | 'slate' | 'violet' {
    const colors: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'slate' | 'violet'> = {
      'draft': 'slate',
      'pending_approval': 'violet',
      'approved': 'blue',
      'processing': 'amber',
      'fulfilled': 'green',
      'rejected': 'red',
      'cancelled': 'slate'
    };
    return colors[status] || 'slate';
  }

  formatStatus(status: string): string {
    const labels: Record<string, string> = {
      'draft': 'Draft',
      'pending_approval': 'Pending Approval',
      'approved': 'Approved',
      'processing': 'Processing',
      'fulfilled': 'Fulfilled',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  }

  isStepActive(currentStatus: string | undefined, stepStatus: string): boolean {
    if (!currentStatus) return false;
    const statusOrder = ['draft', 'pending_approval', 'approved', 'processing', 'fulfilled'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    return currentIndex === stepIndex;
  }

  isStepCompleted(currentStatus: string | undefined, stepStatus: string): boolean {
    if (!currentStatus) return false;
    const statusOrder = ['draft', 'pending_approval', 'approved', 'processing', 'fulfilled'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    return currentIndex > stepIndex;
  }

  getStatusDate(status: string): string {
    if (status === 'fulfilled') return 'Completed';
    if (status === 'processing') return 'In progress';
    if (status === 'approved') return 'Approved';
    if (status === 'pending_approval') return 'Awaiting';
    return 'Pending';
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  isOverdue(slaDate: string): boolean {
    return new Date(slaDate) < new Date();
  }

  readonly selectedAssignee = signal('');

  updateRequestStatus(requestId: string, newStatus: string): void {
    const requestList = this.requests();
    const requestIndex = requestList.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      const updatedRequest = { ...requestList[requestIndex], status: newStatus as Request['status'], updatedAt: new Date().toISOString() };
      const newList = [...requestList];
      newList[requestIndex] = updatedRequest;
      this.requests.set(newList);
      
      // Update selected request if it's the one being modified
      if (this.selectedRequest()?.id === requestId) {
        this.selectedRequest.set(updatedRequest);
      }
      
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