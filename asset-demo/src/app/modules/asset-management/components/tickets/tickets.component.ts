import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  AvatarComponent,
  ButtonComponent,
  TabsComponent,
  SearchComponent
} from '../../../shared/components/ui-components';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  assetId?: string;
  assetTag?: string;
  assetName?: string;
  reportedBy: string;
  reportedByDept: string;
  assignedTo: string;
  assignedTeam: string;
  createdAt: string;
  updatedAt: string;
  slaDue: string;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  resolution?: string;
  resolvedAt?: string;
}

interface TicketComment {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  message: string;
  isInternal: boolean;
}

interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

@Component({
  selector: 'knodtec-tickets',
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
    TabsComponent,
    SearchComponent
  ],
  template: `
    <div class="tickets-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Support Tickets</h1>
          <p class="page-subtitle">Track and manage asset-related issues and incidents</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="filterIcon">Filters</knod-button>
          <knod-button variant="primary" [icon]="plusIcon" (click)="navigateToNewTicket()">New Ticket</knod-button>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <div class="banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="banner-content">
          <strong>What are Tickets?</strong>
          <span>Tickets are used when an <em>assigned asset has an issue</em> — like a laptop not working, keyboard damage, or monitor problems. For requesting new assets or replacements, use the <a href="/requests">Requests module</a>.</span>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" [class.active]="statusFilter() === 'open'" (click)="setStatusFilter('open')">
          <div class="stat-value">{{ openCount() }}</div>
          <div class="stat-label">Open</div>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card" [class.active]="statusFilter() === 'in_progress'" (click)="setStatusFilter('in_progress')">
          <div class="stat-value">{{ inProgressCount() }}</div>
          <div class="stat-label">In Progress</div>
          <div class="stat-indicator amber"></div>
        </div>
        <div class="stat-card" [class.active]="statusFilter() === 'pending'" (click)="setStatusFilter('pending')">
          <div class="stat-value">{{ pendingCount() }}</div>
          <div class="stat-label">Pending</div>
          <div class="stat-indicator violet"></div>
        </div>
        <div class="stat-card" [class.active]="statusFilter() === 'resolved'" (click)="setStatusFilter('resolved')">
          <div class="stat-value">{{ resolvedCount() }}</div>
          <div class="stat-label">Resolved</div>
          <div class="stat-indicator green"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Left: Ticket List -->
        <div class="list-panel">
          <!-- Filters Bar -->
          <div class="filters-bar">
            <div class="search-wrapper">
              <knod-search 
                placeholder="Search tickets..."
                [value]="searchQuery()"
                (valueChange)="searchQuery.set($event)">
              </knod-search>
            </div>
            <div class="filter-group">
              <select class="filter-select" [ngModel]="priorityFilter()" (ngModelChange)="priorityFilter.set($event)">
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select class="filter-select" [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)">
                <option value="">All Categories</option>
                <option value="Hardware">Hardware Issue</option>
                <option value="Software">Software Issue</option>
                <option value="Performance">Performance Issue</option>
                <option value="Accessories">Accessories</option>
                <option value="Network">Network Issue</option>
              </select>
            </div>
          </div>

          <!-- Ticket List -->
          <div class="ticket-list">
            @for (ticket of filteredTickets(); track ticket.id) {
              <div 
                class="ticket-item"
                [class.selected]="selectedTicket()?.id === ticket.id"
                [class.overdue]="isOverdue(ticket)"
                (click)="selectTicket(ticket)">
                <div class="ticket-item-header">
                  <span class="ticket-id">{{ ticket.id }}</span>
                  <div class="ticket-badges">
                    <knod-badge [color]="getSlaBadgeColor(ticket.slaStatus)">
                      SLA: {{ getSlaLabel(ticket.slaStatus) }}
                    </knod-badge>
                    <knod-badge [color]="getPriorityColor(ticket.priority)">{{ ticket.priority }}</knod-badge>
                  </div>
                </div>
                <h3 class="ticket-title">{{ ticket.title }}</h3>
                <p class="ticket-description">{{ ticket.description }}</p>
                
                @if (ticket.assetTag) {
                  <div class="ticket-asset">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    <span class="asset-tag">{{ ticket.assetTag }}</span>
                    <span class="asset-name">{{ ticket.assetName }}</span>
                  </div>
                }

                <div class="ticket-meta">
                  <div class="meta-left">
                    <knod-badge [color]="getCategoryColor(ticket.category)">{{ ticket.category }}</knod-badge>
                    <knod-badge [color]="getStatusColor(ticket.status)">{{ ticket.status | titlecase }}</knod-badge>
                  </div>
                  <div class="meta-right">
                    <span class="sla-time" [class.urgent]="ticket.slaStatus !== 'on_track'">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {{ getSlaTimeLeft(ticket) }}
                    </span>
                    <span class="update-time">{{ getTimeAgo(ticket.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            }

            @if (filteredTickets().length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <h3>No tickets found</h3>
                <p>No tickets match your current filters.</p>
              </div>
            }
          </div>
        </div>

        <!-- Right: Ticket Detail -->
        <div class="detail-panel">
          @if (selectedTicket(); as ticket) {
            <!-- Ticket Header -->
            <div class="detail-header">
              <div class="detail-title-row">
                <div>
                  <span class="detail-id">{{ ticket.id }}</span>
                  <h2 class="detail-title">{{ ticket.title }}</h2>
                </div>
                <div class="detail-actions">
                  <knod-button variant="outline" size="sm" [icon]="editIcon">Edit</knod-button>
                  <knod-button variant="ghost" size="sm" [icon]="closeIcon">Close Ticket</knod-button>
                </div>
              </div>
              <div class="detail-status-row">
                <knod-badge [color]="getStatusColor(ticket.status)">{{ ticket.status | titlecase }}</knod-badge>
                <span class="detail-date">Created {{ ticket.createdAt | date:'mediumDate' }}</span>
                <div class="sla-indicator" [ngClass]="'sla-' + ticket.slaStatus">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{{ getSlaTimeLeft(ticket) }}</span>
                </div>
              </div>
            </div>

            <!-- Asset Info Banner -->
            @if (ticket.assetTag) {
              <div class="asset-info-banner">
                <div class="asset-info-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div class="asset-info-content">
                  <span class="asset-label">Affected Asset</span>
                  <span class="asset-tag">{{ ticket.assetTag }}</span>
                  <span class="asset-name">{{ ticket.assetName }}</span>
                </div>
                <button class="asset-link-btn" (click)="viewAsset(ticket.assetId!)">
                  View Asset
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </button>
              </div>
            }

            <!-- Detail Tabs -->
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
                @case ('details') {
                  <ng-container *ngTemplateOutlet="ticketDetails"></ng-container>
                }
                @case ('conversation') {
                  <ng-container *ngTemplateOutlet="ticketConversation"></ng-container>
                }
                @case ('activity') {
                  <ng-container *ngTemplateOutlet="ticketActivity"></ng-container>
                }
              }
            </div>

            <!-- Status Actions -->
            <div class="status-actions">
              <h4>Update Status</h4>
              <div class="action-buttons">
                <knod-button variant="outline" size="sm" (click)="updateStatus(ticket, 'in_progress')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  Start Working
                </knod-button>
                <knod-button variant="outline" size="sm" (click)="updateStatus(ticket, 'pending')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="10" y1="15" x2="10" y2="9"/>
                    <line x1="14" y1="15" x2="14" y2="9"/>
                  </svg>
                  Pending Info
                </knod-button>
                <knod-button variant="primary" size="sm" (click)="updateStatus(ticket, 'resolved')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Mark Resolved
                </knod-button>
              </div>
            </div>
          } @else {
            <div class="empty-detail">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <h3>Select a Ticket</h3>
              <p>Choose a ticket from the list to view its details.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Ticket Details Template -->
    <ng-template #ticketDetails>
      <div class="details-section">
        <knod-card title="Ticket Information">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Ticket ID</span>
              <span class="info-value">{{ selectedTicket()?.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Category</span>
              <knod-badge [color]="getCategoryColor(selectedTicket()?.category || '')">{{ selectedTicket()?.category }}</knod-badge>
            </div>
            <div class="info-item">
              <span class="info-label">Subcategory</span>
              <span class="info-value">{{ selectedTicket()?.subcategory }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Priority</span>
              <knod-badge [color]="getPriorityColor(selectedTicket()?.priority || 'low')">{{ selectedTicket()?.priority | titlecase }}</knod-badge>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Description</span>
              <p class="info-text">{{ selectedTicket()?.description }}</p>
            </div>
          </div>
        </knod-card>

        <knod-card title="Assignment">
          <div class="assignment-grid">
            <div class="assign-item">
              <span class="assign-label">Reported By</span>
              <div class="assign-value">
                <knod-avatar [name]="selectedTicket()?.reportedBy || ''" size="sm"></knod-avatar>
                <div class="assign-info">
                  <span class="assign-name">{{ selectedTicket()?.reportedBy }}</span>
                  <span class="assign-dept">{{ selectedTicket()?.reportedByDept }}</span>
                </div>
              </div>
            </div>
            <div class="assign-item">
              <span class="assign-label">Assigned Team</span>
              <span class="assign-value-text">{{ selectedTicket()?.assignedTeam }}</span>
            </div>
            <div class="assign-item">
              <span class="assign-label">Assigned To</span>
              <span class="assign-value-text">{{ selectedTicket()?.assignedTo }}</span>
            </div>
          </div>
        </knod-card>

        <knod-card title="SLA Information">
          <div class="sla-info">
            <div class="sla-item">
              <span class="sla-label">SLA Due</span>
              <span class="sla-value">{{ selectedTicket()?.slaDue | date:'mediumDate' }}</span>
            </div>
            <div class="sla-item">
              <span class="sla-label">Status</span>
              <knod-badge [color]="getSlaBadgeColor(selectedTicket()?.slaStatus || 'on_track')">
                {{ getSlaLabel(selectedTicket()?.slaStatus || 'on_track') }}
              </knod-badge>
            </div>
            <div class="sla-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getSlaProgress()" [ngClass]="getSlaClass()"></div>
              </div>
              <span class="progress-text">{{ getSlaTimeLeft(selectedTicket()!) }}</span>
            </div>
          </div>
        </knod-card>

        @if (selectedTicket()?.resolution) {
          <knod-card title="Resolution">
            <div class="resolution-info">
              <p>{{ selectedTicket()?.resolution }}</p>
              <div class="resolution-meta">
                <span>Resolved on {{ selectedTicket()?.resolvedAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </knod-card>
        }
      </div>
    </ng-template>

    <!-- Ticket Conversation Template -->
    <ng-template #ticketConversation>
      <div class="conversation-section">
        <knod-card title="Conversation">
          <div class="message-list">
            @for (comment of ticketComments(); track comment.id) {
              <div class="message-item" [class.internal]="comment.isInternal">
                <div class="message-header">
                  <knod-avatar [name]="comment.author" size="sm"></knod-avatar>
                  <div class="message-meta">
                    <span class="message-author">{{ comment.author }}</span>
                    <span class="message-role">{{ comment.authorRole }}</span>
                  </div>
                  <span class="message-time">{{ comment.timestamp | date:'short' }}</span>
                </div>
                <div class="message-body">
                  {{ comment.message }}
                </div>
                @if (comment.isInternal) {
                  <div class="internal-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Internal Note
                  </div>
                }
              </div>
            }
          </div>

          <!-- Reply Box -->
          <div class="reply-box">
            <div class="reply-type-toggle">
              <button 
                class="type-btn" 
                [class.active]="!isInternalNote()"
                (click)="isInternalNote.set(false)">
                Reply
              </button>
              <button 
                class="type-btn" 
                [class.active]="isInternalNote()"
                (click)="isInternalNote.set(true)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Internal Note
              </button>
            </div>
            <textarea 
              class="reply-input" 
              placeholder="Type your message..."
              rows="3"
              [ngModel]="replyMessage()"
              (ngModelChange)="replyMessage.set($event)">
            </textarea>
            <div class="reply-actions">
              <knod-button variant="primary" size="sm" (click)="sendReply()">Send</knod-button>
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Ticket Activity Template -->
    <ng-template #ticketActivity>
      <div class="activity-section">
        <knod-card title="Activity Log">
          <div class="activity-timeline">
            @for (activity of ticketActivityLog(); track activity.id) {
              <div class="activity-item">
                <div class="activity-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-details">{{ activity.details }}</span>
                  <div class="activity-meta">
                    <span>{{ activity.performedBy }}</span>
                    <span class="separator">•</span>
                    <span>{{ activity.timestamp | date:'short' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </knod-card>
      </div>
    </ng-template>
  `,
  styles: [`
    .tickets-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--color-indigo-50);
      border: 1px solid var(--color-indigo-100);
      border-radius: 8px;
    }

    .banner-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--color-indigo-100);
      color: var(--color-indigo-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      color: var(--color-slate-700);
    }

    .banner-content strong {
      color: var(--color-slate-900);
    }

    .banner-content em {
      color: var(--color-indigo-600);
      font-style: normal;
      font-weight: 500;
    }

    .banner-content a {
      color: var(--color-primary-600);
      text-decoration: none;
      font-weight: 500;
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
    }

    .stat-card:hover {
      border-color: var(--color-slate-200);
    }

    .stat-card.active {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
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
      border-radius: 0 0 8px 8px;
    }

    .stat-card {
      position: relative;
      overflow: hidden;
    }

    .stat-indicator.blue { background: var(--color-primary-500); }
    .stat-indicator.amber { background: var(--color-amber-500); }
    .stat-indicator.violet { background: var(--color-violet-500); }
    .stat-indicator.green { background: var(--color-success-500); }

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
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
      gap: 12px;
      align-items: center;
    }

    .search-wrapper {
      flex: 1;
    }

    .filter-group {
      display: flex;
      gap: 8px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      font-size: 12px;
      background: white;
      min-width: 120px;
    }

    .ticket-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      max-height: 500px;
    }

    .ticket-item {
      padding: 16px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .ticket-item:hover {
      border-color: var(--color-slate-300);
      background: var(--color-slate-50);
    }

    .ticket-item.selected {
      border-color: var(--color-primary-500);
      background: var(--color-primary-50);
    }

    .ticket-item.overdue {
      border-left: 3px solid var(--color-red-500);
    }

    .ticket-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .ticket-id {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-slate-500);
    }

    .ticket-badges {
      display: flex;
      gap: 6px;
    }

    .ticket-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .ticket-description {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 0 0 12px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ticket-asset {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--color-slate-50);
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 12px;
    }

    .ticket-asset svg {
      color: var(--color-slate-400);
    }

    .ticket-asset .asset-tag {
      font-weight: 600;
      color: var(--color-slate-700);
    }

    .ticket-asset .asset-name {
      color: var(--color-slate-500);
    }

    .ticket-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .meta-left {
      display: flex;
      gap: 6px;
    }

    .meta-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .sla-time {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sla-time.urgent {
      color: var(--color-red-600);
      font-weight: 600;
    }

    .detail-panel {
      background: white;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
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
      color: var(--color-slate-500);
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

    .sla-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .sla-indicator.sla-on_track {
      background: var(--color-success-50);
      color: var(--color-success-700);
    }

    .sla-indicator.sla-at_risk {
      background: var(--color-amber-50);
      color: var(--color-amber-700);
    }

    .sla-indicator.sla-breached {
      background: var(--color-red-50);
      color: var(--color-red-700);
    }

    .asset-info-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: var(--color-slate-50);
      border-bottom: 1px solid var(--color-slate-100);
    }

    .asset-info-icon {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: var(--color-primary-100);
      color: var(--color-primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .asset-info-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .asset-label {
      font-size: 10px;
      color: var(--color-slate-500);
      text-transform: uppercase;
    }

    .asset-tag {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .asset-name {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .asset-link-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-primary-600);
      background: none;
      border: none;
      cursor: pointer;
    }

    .asset-link-btn:hover {
      text-decoration: underline;
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

    .status-actions {
      padding: 16px 20px;
      border-top: 1px solid var(--color-slate-100);
      background: var(--color-slate-50);
    }

    .status-actions h4 {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-700);
      margin: 0 0 12px 0;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .empty-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--color-slate-400);
      text-align: center;
      padding: 48px;
    }

    .empty-detail h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-700);
      margin: 0;
    }

    .empty-detail p {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px;
      text-align: center;
      color: var(--color-slate-400);
    }

    .empty-state h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-700);
      margin: 0;
    }

    .empty-state p {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 0;
    }

    /* Details Tab Styles */
    .details-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item.full-width {
      grid-column: span 2;
    }

    .info-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-slate-500);
      text-transform: uppercase;
    }

    .info-value {
      font-size: 14px;
      color: var(--color-slate-900);
    }

    .info-text {
      font-size: 13px;
      color: var(--color-slate-600);
      margin: 0;
      line-height: 1.5;
    }

    .assignment-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .assign-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .assign-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-slate-500);
      text-transform: uppercase;
    }

    .assign-value {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .assign-info {
      display: flex;
      flex-direction: column;
    }

    .assign-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .assign-dept {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .assign-value-text {
      font-size: 13px;
      color: var(--color-slate-700);
    }

    .sla-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sla-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sla-label {
      font-size: 12px;
      color: var(--color-slate-500);
    }

    .sla-value {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .sla-progress {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .progress-bar {
      height: 6px;
      background: var(--color-slate-100);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-fill.green { background: var(--color-success-500); }
    .progress-fill.amber { background: var(--color-amber-500); }
    .progress-fill.red { background: var(--color-red-500); }

    .progress-text {
      font-size: 11px;
      color: var(--color-slate-500);
      text-align: center;
    }

    .resolution-info p {
      font-size: 13px;
      color: var(--color-slate-700);
      margin: 0 0 8px 0;
    }

    .resolution-meta {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Conversation Styles */
    .conversation-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 300px;
      overflow-y: auto;
    }

    .message-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .message-item.internal {
      background: var(--color-amber-50);
      border: 1px solid var(--color-amber-100);
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .message-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .message-author {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .message-role {
      font-size: 10px;
      color: var(--color-slate-500);
    }

    .message-time {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .message-body {
      font-size: 13px;
      color: var(--color-slate-700);
      line-height: 1.5;
    }

    .internal-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 500;
      color: var(--color-amber-700);
      background: var(--color-amber-100);
      padding: 2px 8px;
      border-radius: 4px;
      width: fit-content;
    }

    .reply-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--color-slate-100);
    }

    .reply-type-toggle {
      display: flex;
      gap: 8px;
    }

    .type-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-500);
      background: none;
      border: 1px solid var(--color-slate-200);
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .type-btn.active {
      background: var(--color-primary-50);
      border-color: var(--color-primary-500);
      color: var(--color-primary-700);
    }

    .reply-input {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      resize: none;
      font-family: inherit;
    }

    .reply-input:focus {
      outline: none;
      border-color: var(--color-primary-500);
    }

    .reply-actions {
      display: flex;
      justify-content: flex-end;
    }

    /* Activity Styles */
    .activity-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .activity-item {
      display: flex;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .activity-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-slate-100);
      color: var(--color-slate-500);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-action {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    .activity-details {
      font-size: 12px;
      color: var(--color-slate-600);
      display: block;
      margin-top: 2px;
    }

    .activity-meta {
      font-size: 11px;
      color: var(--color-slate-400);
      margin-top: 4px;
    }

    /* Icons */
    .filterIcon, .plusIcon, .editIcon, .closeIcon {
      display: flex;
    }
  `]
})
export class TicketsComponent {
  private router: Router;

  readonly filterIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly editIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  readonly closeIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  readonly searchQuery = signal('');
  readonly priorityFilter = signal('');
  readonly categoryFilter = signal('');
  readonly statusFilter = signal('');
  readonly activeDetailTab = signal('details');
  readonly isInternalNote = signal(false);
  readonly replyMessage = signal('');

  readonly detailTabs = [
    { key: 'details', label: 'Details' },
    { key: 'conversation', label: 'Conversation' },
    { key: 'activity', label: 'Activity' }
  ];

  readonly tickets = signal<Ticket[]>([
    {
      id: 'TKT-4521',
      title: 'Laptop Screen Flickering',
      description: 'The laptop screen flickers intermittently and sometimes goes completely black for a few seconds.',
      category: 'Hardware',
      subcategory: 'Display Issue',
      priority: 'high',
      status: 'open',
      assetId: 'AST-1045',
      assetTag: 'AST-1045',
      assetName: 'MacBook Pro 14" M3',
      reportedBy: 'Nisha Sharma',
      reportedByDept: 'Information Technology',
      assignedTo: 'Rahul Jain',
      assignedTeam: 'IT Support',
      createdAt: '2026-06-04T10:30:00',
      updatedAt: '2026-06-05T09:15:00',
      slaDue: '2026-06-05T17:00:00',
      slaStatus: 'at_risk'
    },
    {
      id: 'TKT-4520',
      title: 'Keyboard Keys Not Responding',
      description: 'Some keys on the keyboard are not responding properly. Specifically K, L, and Enter keys.',
      category: 'Hardware',
      subcategory: 'Keyboard Issue',
      priority: 'medium',
      status: 'in_progress',
      assetId: 'AST-1078',
      assetTag: 'AST-1078',
      assetName: 'Magic Keyboard',
      reportedBy: 'Meera Joshi',
      reportedByDept: 'Marketing',
      assignedTo: 'IT Support Team',
      assignedTeam: 'IT Support',
      createdAt: '2026-06-03T14:20:00',
      updatedAt: '2026-06-04T11:00:00',
      slaDue: '2026-06-06T17:00:00',
      slaStatus: 'on_track'
    },
    {
      id: 'TKT-4519',
      title: 'Monitor Display Issues',
      description: 'External monitor shows color distortion and occasional flickering when connected via HDMI.',
      category: 'Hardware',
      subcategory: 'Display Issue',
      priority: 'medium',
      status: 'pending',
      assetId: 'AST-1056',
      assetTag: 'AST-1056',
      assetName: 'Dell UltraSharp U2723QE',
      reportedBy: 'Sneha Gupta',
      reportedByDept: 'Design',
      assignedTo: 'IT Support Team',
      assignedTeam: 'IT Support',
      createdAt: '2026-06-02T09:00:00',
      updatedAt: '2026-06-03T16:30:00',
      slaDue: '2026-06-05T17:00:00',
      slaStatus: 'breached'
    },
    {
      id: 'TKT-4518',
      title: 'Software Installation Request',
      description: 'Adobe Creative Cloud needs to be installed for design work. License has been approved.',
      category: 'Software',
      subcategory: 'Installation',
      priority: 'low',
      status: 'open',
      assetId: 'AST-1045',
      assetTag: 'AST-1045',
      assetName: 'MacBook Pro 14" M3',
      reportedBy: 'Arun Kumar',
      reportedByDept: 'Finance',
      assignedTo: 'IT Support Team',
      assignedTeam: 'IT Support',
      createdAt: '2026-06-01T11:00:00',
      updatedAt: '2026-06-01T11:00:00',
      slaDue: '2026-06-07T17:00:00',
      slaStatus: 'on_track'
    },
    {
      id: 'TKT-4517',
      title: 'Phone Battery Draining Fast',
      description: 'iPhone battery drains from 100% to 20% within 4 hours of normal usage.',
      category: 'Hardware',
      subcategory: 'Battery Issue',
      priority: 'high',
      status: 'in_progress',
      assetId: 'AST-1067',
      assetTag: 'AST-1067',
      assetName: 'iPhone 15 Pro',
      reportedBy: 'Priya Patel',
      reportedByDept: 'Engineering',
      assignedTo: 'Mobile Support',
      assignedTeam: 'IT Support',
      createdAt: '2026-05-30T15:00:00',
      updatedAt: '2026-06-04T10:00:00',
      slaDue: '2026-06-03T17:00:00',
      slaStatus: 'breached',
      resolution: 'Battery replacement scheduled. Device will be sent to Apple Service Center.',
      resolvedAt: '2026-06-04T14:00:00'
    }
  ]);

  readonly selectedTicket = signal<Ticket | null>(null);

  readonly ticketComments = signal<TicketComment[]>([
    { id: '1', author: 'Nisha Sharma', authorRole: 'Reporter', timestamp: '2026-06-04T10:30:00', message: 'The issue started yesterday morning. I tried restarting but it persists.', isInternal: false },
    { id: '2', author: 'Rahul Jain', authorRole: 'IT Support', timestamp: '2026-06-04T11:15:00', message: 'Hi Nisha, I will look into this. Can you confirm if the issue occurs with both internal and external displays?', isInternal: false },
    { id: '3', author: 'IT Manager', authorRole: 'Manager', timestamp: '2026-06-04T11:30:00', message: 'Check if this is covered under warranty. Consider hardware replacement if needed.', isInternal: true }
  ]);

  readonly ticketActivityLog = signal<ActivityLog[]>([
    { id: '1', action: 'Ticket Created', performedBy: 'Nisha Sharma', timestamp: '2026-06-04T10:30:00', details: 'Ticket created via self-service portal' },
    { id: '2', action: 'Assigned to Team', performedBy: 'System', timestamp: '2026-06-04T10:31:00', details: 'Assigned to IT Support' },
    { id: '3', action: 'Status Changed', performedBy: 'Rahul Jain', timestamp: '2026-06-04T11:00:00', details: 'Status changed from Open to In Progress' },
    { id: '4', action: 'Comment Added', performedBy: 'Rahul Jain', timestamp: '2026-06-04T11:15:00', details: 'Requested additional information' }
  ]);

  readonly filteredTickets = computed(() => {
    let result = this.tickets();
    const query = this.searchQuery().toLowerCase();
    const priority = this.priorityFilter();
    const category = this.categoryFilter();
    const status = this.statusFilter();

    if (query) {
      result = result.filter(t => 
        t.id.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.assetTag?.toLowerCase().includes(query) ?? false)
      );
    }

    if (priority) {
      result = result.filter(t => t.priority === priority);
    }

    if (category) {
      result = result.filter(t => t.category === category);
    }

    if (status) {
      result = result.filter(t => t.status === status);
    }

    return result;
  });

  readonly openCount = computed(() => this.tickets().filter(t => t.status === 'open').length);
  readonly inProgressCount = computed(() => this.tickets().filter(t => t.status === 'in_progress').length);
  readonly pendingCount = computed(() => this.tickets().filter(t => t.status === 'pending').length);
  readonly resolvedCount = computed(() => this.tickets().filter(t => t.status === 'resolved' || t.status === 'closed').length);

  constructor(router: Router) {
    this.router = router;
    this.selectedTicket.set(this.tickets()[0]);
  }

  setStatusFilter(status: string): void {
    this.statusFilter.set(this.statusFilter() === status ? '' : status);
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicket.set(ticket);
  }

  getPriorityColor(priority: string): 'red' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'red' | 'amber' | 'blue' | 'slate'> = {
      'critical': 'red',
      'high': 'red',
      'medium': 'amber',
      'low': 'blue'
    };
    return colors[priority] || 'slate';
  }

  getCategoryColor(category: string): 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber' | 'red' {
    const colors: Record<string, 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber' | 'red'> = {
      'Hardware': 'blue',
      'Software': 'indigo',
      'Performance': 'amber',
      'Accessories': 'violet',
      'Network': 'cyan'
    };
    return colors[category] || 'slate';
  }

  getStatusColor(status: string): 'green' | 'amber' | 'blue' | 'red' | 'slate' {
    const colors: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'slate'> = {
      'open': 'blue',
      'in_progress': 'amber',
      'pending': 'slate',
      'resolved': 'green',
      'closed': 'slate'
    };
    return colors[status] || 'slate';
  }

  getSlaBadgeColor(status: string): 'green' | 'amber' | 'red' {
    const colors: Record<string, 'green' | 'amber' | 'red'> = {
      'on_track': 'green',
      'at_risk': 'amber',
      'breached': 'red'
    };
    return colors[status] || 'green';
  }

  getSlaLabel(status: string): string {
    const labels: Record<string, string> = {
      'on_track': 'On Track',
      'at_risk': 'At Risk',
      'breached': 'Breached'
    };
    return labels[status] || 'On Track';
  }

  getSlaTimeLeft(ticket: Ticket): string {
    const now = new Date();
    const due = new Date(ticket.slaDue);
    const diff = due.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 0) return 'Overdue';
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }

  getSlaProgress(): number {
    const ticket = this.selectedTicket();
    if (!ticket) return 0;
    const created = new Date(ticket.createdAt).getTime();
    const due = new Date(ticket.slaDue).getTime();
    const now = new Date().getTime();
    const total = due - created;
    const elapsed = now - created;
    return Math.min(100, (elapsed / total) * 100);
  }

  getSlaClass(): string {
    const ticket = this.selectedTicket();
    if (!ticket) return 'green';
    if (ticket.slaStatus === 'breached') return 'red';
    if (ticket.slaStatus === 'at_risk') return 'amber';
    return 'green';
  }

  isOverdue(ticket: Ticket): boolean {
    return ticket.slaStatus === 'breached';
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

  viewAsset(assetId: string): void {
    this.router.navigate(['/assets', assetId]);
  }

  updateStatus(ticket: Ticket, status: string): void {
    const tickets = this.tickets();
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], status: status as Ticket['status'] };
      this.tickets.set([...tickets]);
    }
  }

  sendReply(): void {
    // Send reply logic
    this.replyMessage.set('');
  }

  navigateToNewTicket(): void {
    this.router.navigate(['/tickets/new']);
  }
}