import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  AvatarComponent,
  ButtonComponent,
  TabsComponent
} from '../../../../shared/components/ui-components';

interface MaintenanceRecord {
  id: string;
  type: string;
  description: string;
  status: string;
  scheduledDate: string;
  completedDate?: string;
  vendor?: string;
  cost?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details: string;
}

@Component({
  selector: 'knodtec-asset-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    TitleCasePipe,
    CurrencyPipe,
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ButtonComponent,
    TabsComponent
  ],
  template: `
    <div class="asset-details-page">

      <!-- Breadcrumb & Header -->
      <div class="page-header">
        <div class="breadcrumb-row">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Assets
          </button>
        </div>

        <div class="asset-header">
          <div class="asset-info">
            <div class="asset-icon" [ngClass]="'cat-' + asset().category.toLowerCase()">
              <span [innerHTML]="getCategoryIcon(asset().category)"></span>
            </div>
            <div class="asset-main-info">
              <div class="asset-title-row">
                <h1 class="asset-name">{{ asset().name }}</h1>
                <knod-badge [color]="getStatusColor(asset().status)">{{ asset().status | titlecase }}</knod-badge>
              </div>
              <div class="asset-meta-row">
                <span class="asset-tag">{{ asset().tag }}</span>
                <span class="separator">•</span>
                <span class="asset-serial">S/N: {{ asset().serialNumber }}</span>
                <span class="separator">•</span>
                <span class="asset-category">{{ asset().category }}</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <knod-button variant="outline" [icon]="printIcon">Print Label</knod-button>
            <knod-button variant="outline" [icon]="editIcon">Edit Asset</knod-button>
            <div class="action-dropdown">
              <button class="action-menu-btn" (click)="toggleActionMenu()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                </svg>
              </button>
              @if (showActionMenu()) {
                <div class="action-menu">
                  <button class="menu-item" (click)="performAction('assign')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    Assign to Employee
                  </button>
                  <button class="menu-item" (click)="performAction('return')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Mark as Returned
                  </button>
                  <button class="menu-item" (click)="performAction('maintenance')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                    Create Maintenance
                  </button>
                  <button class="menu-item" (click)="performAction('transfer')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                    </svg>
                    Transfer Asset
                  </button>
                  <div class="menu-divider"></div>
                  <button class="menu-item danger" (click)="performAction('retire')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Retire Asset
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">

        <!-- Left Column -->
        <div class="main-content">

          <!-- Quick Stats -->
          <div class="quick-stats-row">
            <div class="quick-stat">
              <span class="stat-label">Category</span>
              <span class="stat-value">{{ asset().category }}</span>
            </div>
            <div class="quick-stat">
              <span class="stat-label">Brand</span>
              <span class="stat-value">{{ asset().brand }}</span>
            </div>
            <div class="quick-stat">
              <span class="stat-label">Model</span>
              <span class="stat-value">{{ asset().model }}</span>
            </div>
            <div class="quick-stat">
              <span class="stat-label">Location</span>
              <span class="stat-value">{{ asset().location }}</span>
            </div>
            <div class="quick-stat">
              <span class="stat-label">Value</span>
              <span class="stat-value">{{ asset().purchaseCost | currency:'USD':'symbol':'1.0-0' }}</span>
            </div>
          </div>

          <!-- Tabs -->
        <div class="detail-tabs">
          @for (tab of detailTabs; track tab.key) {
            <button
              class="tab-btn"
              [class.active]="activeTab() === tab.key"
              (click)="activeTab.set(tab.key)">
              {{ tab.label }}
            </button>
          }
        </div>

          <!-- Tab Content -->
          <div class="tab-content">
            @switch (activeTab()) {
              @case ('overview') {
                <ng-container *ngTemplateOutlet="overviewTab"></ng-container>
              }
              @case ('assignment') {
                <ng-container *ngTemplateOutlet="assignmentTab"></ng-container>
              }
              @case ('history') {
                <ng-container *ngTemplateOutlet="historyTab"></ng-container>
              }
              @case ('maintenance') {
                <ng-container *ngTemplateOutlet="maintenanceTab"></ng-container>
              }
              @case ('documents') {
                <ng-container *ngTemplateOutlet="documentsTab"></ng-container>
              }
              @case ('procurement') {
                <ng-container *ngTemplateOutlet="procurementTab"></ng-container>
              }
              @case ('warranty') {
                <ng-container *ngTemplateOutlet="warrantyTab"></ng-container>
              }
              @case ('location') {
                <ng-container *ngTemplateOutlet="locationTab"></ng-container>
              }
            }
          </div>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="sidebar-content">

          <!-- Assignment Card -->
          <knod-card title="Assignment Information">
            @if (asset().assignedToName) {
              <div class="assignment-info">
                <knod-avatar [name]="asset().assignedToName" size="lg"></knod-avatar>
                <div class="assignment-details">
                  <span class="assignee-name">{{ asset().assignedToName }}</span>
                  <span class="assignee-id">{{ asset().assignedTo }}</span>
                  <span class="assignee-dept">{{ asset().department }}</span>
                </div>
              </div>
              <div class="assignment-meta">
                <div class="meta-item">
                  <span class="meta-label">Assigned Date</span>
                  <span class="meta-value">{{ asset().assignedDate | date:'mediumDate' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Expected Return</span>
                  <span class="meta-value">{{ asset().expectedReturn | date:'mediumDate' }}</span>
                </div>
              </div>
              <knod-button variant="outline" size="sm" class="action-btn" (click)="raiseTicket()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Raise Ticket
              </knod-button>
            } @else {
              <div class="unassigned-state">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Not Currently Assigned</span>
              </div>
              <knod-button variant="primary" size="sm" [icon]="assignIcon" class="action-btn">
                Assign Asset
              </knod-button>
            }
          </knod-card>

          <!-- Warranty Card -->
          <knod-card title="Warranty Status">
            <div class="warranty-display">
              <div class="warranty-status" [ngClass]="getWarrantyClass()">
                <knod-badge [color]="getWarrantyBadgeColor()">{{ asset().warrantyStatus | titlecase }}</knod-badge>
              </div>
              <div class="warranty-dates">
                <div class="date-item">
                  <span class="date-label">Start Date</span>
                  <span class="date-value">{{ asset().warrantyStart | date:'mediumDate' }}</span>
                </div>
                <div class="date-item">
                  <span class="date-label">End Date</span>
                  <span class="date-value">{{ asset().warrantyEnd | date:'mediumDate' }}</span>
                </div>
              </div>
              <div class="warranty-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="warrantyProgress()"></div>
                </div>
                <span class="progress-label">{{ warrantyDaysLeft() }} days remaining</span>
              </div>
            </div>
          </knod-card>

          <!-- Location Card -->
          <knod-card title="Location">
            <div class="location-display">
              <div class="location-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="location-details">
                <span class="location-name">{{ asset().location }}</span>
                <span class="location-building">{{ asset().building }}</span>
                <span class="location-floor">{{ asset().floor }}, Desk {{ asset().desk }}</span>
              </div>
            </div>
          </knod-card>

          <!-- Quick Actions -->
          <knod-card title="Quick Actions">
            <div class="quick-actions">
              <button class="quick-action" (click)="raiseTicket()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Raise Ticket
              </button>
              <button class="quick-action" (click)="createMaintenance()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Schedule Maintenance
              </button>
              <button class="quick-action" (click)="viewHistory()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                View History
              </button>
            </div>
          </knod-card>
        </div>
      </div>
    </div>

    <!-- ─── Tab Templates ──────────────────────────────────────── -->

    <!-- Overview Tab -->
    <ng-template #overviewTab>
      <div class="overview-section">
        <knod-card title="Asset Overview">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Asset Tag</span>
              <span class="info-value">{{ asset().tag }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Serial Number</span>
              <span class="info-value">{{ asset().serialNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Category</span>
              <span class="info-value">{{ asset().category }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Brand</span>
              <span class="info-value">{{ asset().brand }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Model</span>
              <span class="info-value">{{ asset().model }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <knod-badge [color]="getStatusColor(asset().status)">{{ asset().status | titlecase }}</knod-badge>
            </div>
            <div class="info-item">
              <span class="info-label">Condition</span>
              <span class="info-value">{{ asset().condition }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Purchase Date</span>
              <span class="info-value">{{ asset().purchaseDate | date:'mediumDate' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Purchase Cost</span>
              <span class="info-value">{{ asset().purchaseCost | currency:'USD':'symbol':'1.0-0' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Supplier</span>
              <span class="info-value">{{ asset().supplier }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Notes</span>
              <span class="info-value">{{ asset().notes }}</span>
            </div>
          </div>
        </knod-card>

        <knod-card title="Specifications">
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Processor</span>
              <span class="spec-value">{{ asset().specs?.processor }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">RAM</span>
              <span class="spec-value">{{ asset().specs?.ram }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Storage</span>
              <span class="spec-value">{{ asset().specs?.storage }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Display</span>
              <span class="spec-value">{{ asset().specs?.display }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">OS</span>
              <span class="spec-value">{{ asset().specs?.os }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Color</span>
              <span class="spec-value">{{ asset().specs?.color }}</span>
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Assignment Tab -->
    <ng-template #assignmentTab>
      <div class="assignment-section">
        @if (asset().assignedToName) {
          <knod-card title="Current Assignment">
            <div class="current-assignment">
              <knod-avatar [name]="asset().assignedToName" size="xl"></knod-avatar>
              <div class="assignment-info">
                <h3 class="assignee-name">{{ asset().assignedToName }}</h3>
                <p class="assignee-id">{{ asset().assignedTo }}</p>
                <div class="assignment-meta-grid">
                  <div class="meta-item">
                    <span class="meta-label">Department</span>
                    <span class="meta-value">{{ asset().department }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Designation</span>
                    <span class="meta-value">{{ asset().designation }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Location</span>
                    <span class="meta-value">{{ asset().assignedLocation }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Assigned Date</span>
                    <span class="meta-value">{{ asset().assignedDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Expected Return</span>
                    <span class="meta-value">{{ asset().expectedReturn | date:'mediumDate' }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Manager</span>
                    <span class="meta-value">{{ asset().manager }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="assignment-actions">
              <knod-button variant="outline" [icon]="transferIcon">Transfer</knod-button>
              <knod-button variant="outline" [icon]="returnIcon">Mark Returned</knod-button>
              <knod-button variant="outline" [icon]="ticketIcon">Raise Ticket</knod-button>
            </div>
          </knod-card>

          <knod-card title="Assignment History">
            <div class="history-list">
              @for (history of assignmentHistory(); track history.id) {
                <div class="history-item">
                  <knod-avatar [name]="history.assignedTo" size="sm"></knod-avatar>
                  <div class="history-content">
                    <span class="history-title">Assigned to {{ history.assignedTo }}</span>
                    <span class="history-date">{{ history.date | date:'mediumDate' }}</span>
                  </div>
                  <knod-badge [color]="'slate'">{{ history.type }}</knod-badge>
                </div>
              }
            </div>
          </knod-card>
        } @else {
          <div class="empty-assignment">
            <div class="empty-icon-container">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>No Current Assignment</h3>
            <p>This asset is currently available and not assigned to anyone.</p>
            <knod-button variant="primary" [icon]="assignIcon">Assign to Employee</knod-button>
          </div>
        }
      </div>
    </ng-template>

    <!-- History Tab -->
    <ng-template #historyTab>
      <div class="history-section">
        <knod-card title="Asset Audit Trail">
          <div class="audit-timeline">
            @for (entry of auditHistory(); track entry.id) {
              <div class="audit-item">
                <div class="audit-icon" [ngClass]="'icon-' + entry.actionType">
                  <span [innerHTML]="getAuditIcon(entry.actionType)"></span>
                </div>
                <div class="audit-content">
                  <div class="audit-header">
                    <span class="audit-action">{{ entry.action }}</span>
                    <span class="audit-date">{{ entry.performedAt | date:'mediumDate' }}</span>
                  </div>
                  <p class="audit-details">{{ entry.details }}</p>
                  <div class="audit-meta">
                    <span>By {{ entry.performedBy }}</span>
                    @if (entry.reference) {
                      <span class="separator">•</span>
                      <span>{{ entry.reference }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Maintenance Tab -->
    <ng-template #maintenanceTab>
      <div class="maintenance-section">
        <knod-card title="Maintenance Records">
          <div class="maintenance-list">
            @for (record of maintenanceRecords(); track record.id) {
              <div class="maintenance-item">
                <div class="maintenance-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <div class="maintenance-content">
                  <div class="maintenance-header">
                    <span class="maintenance-type">{{ record.type }}</span>
                    <knod-badge [color]="getMaintenanceStatusColor(record.status)">{{ record.status }}</knod-badge>
                  </div>
                  <p class="maintenance-desc">{{ record.description }}</p>
                  <div class="maintenance-meta">
                    <span>Scheduled: {{ record.scheduledDate | date:'mediumDate' }}</span>
                    @if (record.vendor) {
                      <span class="separator">•</span>
                      <span>Vendor: {{ record.vendor }}</span>
                    }
                    @if (record.cost) {
                      <span class="separator">•</span>
                      <span>Cost: {{ record.cost | currency:'USD':'symbol':'1.0-0' }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
          <div class="card-footer">
            <knod-button variant="primary" [icon]="addIcon">Schedule Maintenance</knod-button>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Documents Tab -->
    <ng-template #documentsTab>
      <div class="documents-section">
        <knod-card title="Asset Documents">
          <div class="documents-list">
            @for (doc of documents(); track doc.id) {
              <div class="document-item">
                <div class="doc-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="doc-info">
                  <span class="doc-name">{{ doc.name }}</span>
                  <span class="doc-meta">{{ doc.type }} • {{ doc.size }} • Uploaded {{ doc.uploadedAt | date:'short' }}</span>
                </div>
                <div class="doc-actions">
                  <button class="doc-action-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
          <div class="card-footer">
            <knod-button variant="outline" [icon]="uploadIcon">Upload Document</knod-button>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Procurement Tab -->
    <ng-template #procurementTab>
      <div class="procurement-section">
        <knod-card title="Procurement Information">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Purchase Order</span>
              <span class="info-value">{{ asset().purchaseOrder }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Invoice Number</span>
              <span class="info-value">{{ asset().invoiceNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Purchase Date</span>
              <span class="info-value">{{ asset().purchaseDate | date:'mediumDate' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Purchase Cost</span>
              <span class="info-value">{{ asset().purchaseCost | currency:'USD':'symbol':'1.0-0' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Supplier</span>
              <span class="info-value">{{ asset().supplier }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Supplier Contact</span>
              <span class="info-value">{{ asset().supplierContact }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Terms</span>
              <span class="info-value">{{ asset().paymentTerms }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Delivery Date</span>
              <span class="info-value">{{ asset().deliveryDate | date:'mediumDate' }}</span>
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Warranty Tab -->
    <ng-template #warrantyTab>
      <div class="warranty-section">
        <knod-card title="Warranty Information">
          <div class="warranty-details">
            <div class="warranty-status-card">
              <knod-badge [color]="getWarrantyBadgeColor()" size="lg">{{ asset().warrantyStatus | titlecase }}</knod-badge>
              <p class="warranty-message">{{ getWarrantyMessage() }}</p>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Warranty Start</span>
                <span class="info-value">{{ asset().warrantyStart | date:'mediumDate' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Warranty End</span>
                <span class="info-value">{{ asset().warrantyEnd | date:'mediumDate' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Warranty Period</span>
                <span class="info-value">{{ asset().warrantyPeriod }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Warranty Provider</span>
                <span class="info-value">{{ asset().warrantyProvider }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Support Contact</span>
                <span class="info-value">{{ asset().supportContact }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Support Email</span>
                <span class="info-value">{{ asset().supportEmail }}</span>
              </div>
            </div>
            <div class="warranty-progress-section">
              <h4>Warranty Coverage Timeline</h4>
              <div class="timeline-bar">
                <div class="timeline-progress" [style.width.%]="warrantyProgress()"></div>
              </div>
              <div class="timeline-labels">
                <span>{{ asset().warrantyStart | date:'MMM yyyy' }}</span>
                <span>{{ warrantyDaysLeft() }} days remaining</span>
                <span>{{ asset().warrantyEnd | date:'MMM yyyy' }}</span>
              </div>
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>

    <!-- Location Tab -->
    <ng-template #locationTab>
      <div class="location-section">
        <knod-card title="Location Information">
          <div class="location-visual">
            <div class="location-building-banner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
              </svg>
              <span class="building-name">{{ asset().building }}</span>
            </div>
            <div class="location-details-grid">
              <div class="location-detail">
                <span class="detail-label">Building</span>
                <span class="detail-value">{{ asset().building }}</span>
              </div>
              <div class="location-detail">
                <span class="detail-label">Floor</span>
                <span class="detail-value">{{ asset().floor }}</span>
              </div>
              <div class="location-detail">
                <span class="detail-label">Zone</span>
                <span class="detail-value">{{ asset().zone }}</span>
              </div>
              <div class="location-detail">
                <span class="detail-label">Desk/Station</span>
                <span class="detail-value">{{ asset().desk }}</span>
              </div>
              <div class="location-detail">
                <span class="detail-label">City</span>
                <span class="detail-value">{{ asset().city }}</span>
              </div>
              <div class="location-detail">
                <span class="detail-label">State</span>
                <span class="detail-value">{{ asset().state }}</span>
              </div>
            </div>
          </div>
        </knod-card>
      </div>
    </ng-template>
  `,
  styles: [`
    /* ─── Design Tokens ─────────────────────────────────────────── */
    :host {
      --bg-page:            #F3F6FB;
      --bg-card:            #FFFFFF;
      --border-color:       #E5EAF3;
      --text-primary:       #0F172A;
      --text-secondary:     #64748B;
      --primary:            #3B82F6;
      --primary-hover:      #2563EB;
      --success:            #22C55E;
      --success-light:      #DCFCE7;
      --warning:            #F59E0B;
      --warning-light:      #FEF3C7;
      --danger:             #EF4444;
      --danger-light:       #FEE2E2;
      --purple:             #8B5CF6;
      --purple-light:       #F3E8FF;
      --info:               #06B6D4;
      --info-light:         #CFFAFE;
      --radius-sm:          14px;
      --radius-md:          16px;
      --radius-lg:          24px;
      --radius-xl:          28px;
      --shadow-card:        0 8px 30px rgba(15,23,42,0.06);
      --shadow-card-hover:  0 15px 40px rgba(15,23,42,0.12);
      --shadow-dropdown:    0 20px 50px rgba(15,23,42,0.15);
      --transition:         200ms ease;
    }

    /* ─── Page Shell ────────────────────────────────────────────── */
    .asset-details-page {
      max-width: 1600px;
      margin: 0 auto;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background: var(--bg-page);
      min-height: 100vh;
    }

    /* ─── Breadcrumb / Back Button ──────────────────────────────── */
    .breadcrumb-row { margin-bottom: 16px; }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      cursor: pointer;
      transition: all var(--transition);
    }

    .back-btn:hover {
      background: #F3F6FB;
      border-color: var(--primary);
      color: var(--primary);
    }

    /* ─── Page Header ───────────────────────────────────────────── */
    .page-header {
      display: flex;
      flex-direction: column;
    }

    .asset-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
    }

    .asset-info {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    /* Icon Container: 72×72, radius 20px per design system */
    .asset-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all var(--transition);
    }

    .asset-icon.cat-laptop   { background: #EFF6FF; color: var(--primary); }
    .asset-icon.cat-monitor  { background: var(--purple-light); color: var(--purple); }
    .asset-icon.cat-phone    { background: var(--success-light); color: var(--success); }
    .asset-icon.cat-accessory { background: var(--warning-light); color: var(--warning); }
    .asset-icon.cat-printer  { background: var(--info-light); color: var(--info); }
    .asset-icon.cat-desktop  { background: var(--danger-light); color: var(--danger); }

    .asset-icon :deep(svg) { width: 32px; height: 32px; }

    .asset-main-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .asset-title-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Page Title: 36px / 700 */
    .asset-name {
      font-size: 36px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .asset-meta-row {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .separator { color: var(--border-color); }

    /* ─── Header Actions ────────────────────────────────────────── */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-dropdown { position: relative; }

    .action-menu-btn {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
    }

    .action-menu-btn:hover {
      background: #F3F6FB;
      border-color: var(--primary);
      color: var(--primary);
      transform: scale(1.05);
    }

    /* Dropdown: shadow-dropdown, radius-xl */
    .action-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-dropdown);
      min-width: 220px;
      z-index: 50;
      overflow: hidden;
    }

    /* Body Text: 14px / 400 */
    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      font-size: 14px;
      color: var(--text-primary);
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition);
    }

    .menu-item:hover { background: #F3F6FB; }

    .menu-item.danger { color: var(--danger); }
    .menu-item.danger:hover { background: var(--danger-light); }

    .menu-divider { height: 1px; background: var(--border-color); margin: 4px 0; }

    /* ─── Content Layout ─────────────────────────────────────────── */
    .content-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      align-items: start;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ─── Quick Stats Row ───────────────────────────────────────── */
    .quick-stats-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    /* Card: radius-lg, shadow-card */
    .quick-stat {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: var(--shadow-card);
      transition: all var(--transition);
    }

    .quick-stat:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-card-hover);
    }

    /* Label: 14px / 500 */
    .quick-stat .stat-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Stat value: 18px / 600 (card title weight) */
    .quick-stat .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* ─── Tabs Container ────────────────────────────────────────── */
  /* ─── Detail Tabs Strip ─────────────────────────────────────── */
.detail-tabs {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 0 8px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.detail-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  position: relative;
  padding: 18px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 200ms ease;
  outline: none;
  letter-spacing: 0.01em;
  flex-shrink: 0;
}

/* underline track */
.tab-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: transparent;
  transition: background 200ms ease;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn:hover::after {
  background: var(--border-color);
}

.tab-btn.active {
  color: var(--primary);
  font-weight: 600;
}

.tab-btn.active::after {
  background: var(--primary);
}

    /* ─── Tab Content Panel ─────────────────────────────────────── */
    .tab-content {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 28px;
      box-shadow: var(--shadow-card);
    }

    /* ─── Sidebar ───────────────────────────────────────────────── */
    .sidebar-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ─── Assignment Card ───────────────────────────────────────── */
    .assignment-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 20px;
    }

    .assignment-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Card Title: 18px / 600 */
    .assignee-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .assignee-id,
    .assignee-dept {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .assignment-meta {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Caption: 12px / 400 */
    .meta-label {
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Body Text: 14px / 500 label weight */
    .meta-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .action-btn { width: 100%; }

    .unassigned-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      color: var(--text-secondary);
      text-align: center;
    }

    .unassigned-state span { font-size: 14px; }

    /* ─── Warranty Card ─────────────────────────────────────────── */
    .warranty-display {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .warranty-status { display: flex; justify-content: center; }

    .warranty-dates { display: flex; gap: 20px; }

    .date-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-label { font-size: 12px; color: var(--text-secondary); }
    .date-value { font-size: 14px; font-weight: 500; color: var(--text-primary); }

    .warranty-progress {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-bar {
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      border-radius: 4px;
      transition: width 300ms ease;
    }

    .progress-label {
      font-size: 12px;
      color: var(--text-secondary);
      text-align: center;
    }

    /* ─── Location Card ─────────────────────────────────────────── */
    .location-display {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .location-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: #EFF6FF;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .location-details { display: flex; flex-direction: column; gap: 4px; }
    .location-name { font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .location-building,
    .location-floor { font-size: 14px; color: var(--text-secondary); }

    /* ─── Quick Actions Card ────────────────────────────────────── */
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .quick-action {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      color: var(--text-primary);
      background: #F3F6FB;
      border: none;
      cursor: pointer;
      transition: all var(--transition);
    }

    .quick-action:hover {
      background: #EFF6FF;
      color: var(--primary);
      transform: translateX(4px);
    }

    /* ─── Info Grid (overview / procurement) ────────────────────── */
    .overview-section,
    .assignment-section,
    .history-section,
    .maintenance-section,
    .documents-section,
    .procurement-section,
    .warranty-section,
    .location-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-item.full-width { grid-column: span 2; }

    /* Caption: 12px / 500 for labels */
    .info-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* Body: 14px / 400 */
    .info-value {
      font-size: 14px;
      color: var(--text-primary);
    }

    /* ─── Specs Grid ────────────────────────────────────────────── */
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 16px;
      background: #F3F6FB;
      border-radius: var(--radius-sm);
    }

    .spec-label { font-size: 12px; color: var(--text-secondary); }
    .spec-value { font-size: 14px; font-weight: 500; color: var(--text-primary); }

    /* ─── Audit Timeline ────────────────────────────────────────── */
    .audit-timeline {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .audit-item {
      display: flex;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .audit-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    /* Icon containers: radius-sm (14px) per icon action buttons rule */
    .audit-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .audit-icon.icon-assignment { background: #EFF6FF; color: var(--primary); }
    .audit-icon.icon-return     { background: var(--success-light); color: var(--success); }
    .audit-icon.icon-maintenance { background: var(--warning-light); color: var(--warning); }
    .audit-icon.icon-transfer   { background: var(--purple-light); color: var(--purple); }

    .audit-icon :deep(svg) { width: 20px; height: 20px; }

    .audit-content { flex: 1; }

    .audit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    /* Table Header: 15px / 600 */
    .audit-action { font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .audit-date   { font-size: 12px; color: var(--text-secondary); }
    .audit-details { font-size: 14px; color: var(--text-secondary); margin: 0 0 6px 0; }
    .audit-meta   { font-size: 12px; color: var(--text-secondary); }

    /* ─── Maintenance List ──────────────────────────────────────── */
    .maintenance-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .maintenance-item {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: #F3F6FB;
      border-radius: var(--radius-md);
    }

    .maintenance-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: var(--warning-light);
      color: var(--warning);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .maintenance-content { flex: 1; }

    .maintenance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .maintenance-type  { font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .maintenance-desc  { font-size: 14px; color: var(--text-secondary); margin: 0 0 12px 0; }
    .maintenance-meta  { font-size: 12px; color: var(--text-secondary); }

    /* ─── Documents List ────────────────────────────────────────── */
    .documents-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: #F3F6FB;
      border-radius: var(--radius-sm);
    }

    .doc-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: #EFF6FF;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .doc-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .doc-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .doc-meta { font-size: 12px; color: var(--text-secondary); }

    .doc-actions { display: flex; gap: 8px; }

    /* Icon Action Button: 44×44, radius-sm */
    .doc-action-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
    }

    .doc-action-btn:hover {
      background: var(--bg-card);
      color: var(--primary);
      transform: scale(1.05);
    }

    /* ─── Card Footer ───────────────────────────────────────────── */
    .card-footer {
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
      margin-top: 20px;
    }

    /* ─── History / Assignment History ─────────────────────────── */
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      background: #F3F6FB;
      border-radius: var(--radius-sm);
    }

    .history-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .history-title { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .history-date  { font-size: 12px; color: var(--text-secondary); }

    /* ─── Empty States ──────────────────────────────────────────── */
    .empty-assignment {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px;
      text-align: center;
      color: var(--text-secondary);
    }

    /* Empty state icon container: 80×80, radius 24px */
    .empty-icon-container {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: #F3F6FB;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .empty-assignment h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .empty-assignment p { font-size: 14px; color: var(--text-secondary); margin: 0; }

    /* ─── Current Assignment (assignment tab) ───────────────────── */
    .current-assignment {
      display: flex;
      gap: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 20px;
    }

    .assignment-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }

    .assignment-actions { display: flex; gap: 12px; }

    /* ─── Warranty Section (tab) ────────────────────────────────── */
    .warranty-details {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .warranty-status-card {
      text-align: center;
      padding: 28px;
      background: #F3F6FB;
      border-radius: var(--radius-md);
    }

    .warranty-message {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 10px 0 0 0;
    }

    .warranty-progress-section {
      padding: 24px;
      background: #F3F6FB;
      border-radius: var(--radius-md);
    }

    .warranty-progress-section h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 16px 0;
    }

    .timeline-bar {
      height: 10px;
      background: var(--border-color);
      border-radius: 5px;
      overflow: hidden;
    }

    .timeline-progress {
      height: 100%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
      border-radius: 5px;
      transition: width 300ms ease;
    }

    .timeline-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* ─── Location Section (tab) ────────────────────────────────── */
    .location-visual {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .location-building-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: #EFF6FF;
      border-radius: var(--radius-md);
      color: var(--primary);
    }

    .building-name {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary);
    }

    .location-details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .location-detail { display: flex; flex-direction: column; gap: 6px; }
    .detail-label { font-size: 12px; color: var(--text-secondary); }
    .detail-value { font-size: 15px; font-weight: 500; color: var(--text-primary); }

    /* ─── Responsive ────────────────────────────────────────────── */
    /* Large screens - optimized spacing */
    @media (min-width: 1601px) {
      .asset-details-page { padding: 40px; }
    }

    /* Standard laptop screens (1440px - 1600px) */
    @media (max-width: 1600px) {
      .asset-details-page { max-width: 1400px; padding: 28px; }
      .quick-stat { padding: 20px; }
      .tab-content { padding: 24px; }
    }

    /* Laptop screens (1280px - 1440px) - Primary optimization target */
    @media (max-width: 1440px) {
      .asset-details-page { 
        max-width: 1200px; 
        padding: 24px; 
        gap: 20px;
      }
      .asset-name { font-size: 28px; }
      .asset-icon { width: 60px; height: 60px; border-radius: 16px; }
      .asset-icon :deep(svg) { width: 28px; height: 28px; }
      .quick-stats-row { grid-template-columns: repeat(5, 1fr); gap: 12px; }
      .quick-stat { padding: 18px; }
      .quick-stat .stat-value { font-size: 16px; }
      .content-layout { grid-template-columns: 1fr 320px; gap: 20px; }
      .tab-btn { padding: 16px 16px; font-size: 13px; }
      .tab-content { padding: 22px; }
    }

    /* Smaller laptop screens (1024px - 1280px) */
    @media (max-width: 1280px) {
      .asset-details-page { 
        max-width: 1000px; 
        padding: 20px; 
        gap: 16px;
      }
      .asset-name { font-size: 24px; }
      .asset-icon { width: 52px; height: 52px; border-radius: 14px; }
      .asset-icon :deep(svg) { width: 24px; height: 24px; }
      .asset-meta-row { font-size: 13px; }
      .quick-stats-row { grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .quick-stat { padding: 16px; }
      .quick-stat .stat-label { font-size: 12px; }
      .quick-stat .stat-value { font-size: 15px; }
      .content-layout { grid-template-columns: 1fr 300px; gap: 16px; }
      .tab-btn { padding: 14px 14px; font-size: 13px; }
      .tab-content { padding: 20px; }
      .tab-content :deep(.info-grid) { gap: 16px; }
      .tab-content :deep(.info-item) { padding: 16px; }
      .tab-content :deep(.info-label) { font-size: 12px; }
      .tab-content :deep(.info-value) { font-size: 14px; }
    }

    /* Tablet landscape (768px - 1024px) */
    @media (max-width: 1024px) {
      .asset-details-page { 
        max-width: 100%; 
        padding: 20px; 
        gap: 16px;
      }
      .asset-header { flex-direction: column; align-items: flex-start; }
      .asset-name { font-size: 24px; }
      .asset-icon { width: 48px; height: 48px; border-radius: 12px; }
      .asset-icon :deep(svg) { width: 22px; height: 22px; }
      .asset-meta-row { flex-wrap: wrap; }
      .header-actions { flex-wrap: wrap; }
      .quick-stats-row { grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .quick-stat { padding: 14px; }
      .content-layout { grid-template-columns: 1fr; gap: 16px; }
      .sidebar-content { flex-direction: row; flex-wrap: wrap; gap: 16px; }
      .sidebar-content :deep(knod-card) { flex: 1 1 280px; }
      .detail-tabs { padding: 0 6px; }
      .tab-btn { padding: 12px 12px; font-size: 12px; }
      .tab-content { padding: 18px; }
      .specs-grid { grid-template-columns: repeat(2, 1fr); }
      .assignment-meta-grid { grid-template-columns: repeat(2, 1fr); }
      .location-details-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* Tablet portrait (768px and below) */
    @media (max-width: 768px) {
      .asset-details-page { padding: 16px; gap: 14px; }
      .breadcrumb-row { margin-bottom: 12px; }
      .back-btn { padding: 10px 16px; font-size: 13px; }
      .asset-header { flex-direction: column; gap: 16px; }
      .asset-info { gap: 14px; }
      .asset-name { font-size: 22px; }
      .asset-title-row { flex-wrap: wrap; gap: 10px; }
      .asset-meta-row { flex-wrap: wrap; gap: 8px; font-size: 12px; }
      .header-actions { gap: 8px; }
      .header-actions :deep(knod-button) { padding: 10px 14px; font-size: 12px; }
      .quick-stats-row { 
        grid-template-columns: repeat(3, 1fr); 
        gap: 10px; 
      }
      .quick-stat { padding: 14px; }
      .quick-stat .stat-label { font-size: 11px; }
      .quick-stat .stat-value { font-size: 14px; }
      .detail-tabs { 
        padding: 0 4px; 
        gap: 0;
      }
      .tab-btn { padding: 12px 10px; font-size: 12px; }
      .tab-content { padding: 16px; }
      .sidebar-content { flex-direction: column; }
      .sidebar-content :deep(knod-card) { flex: none; width: 100%; }
      .info-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .info-item { padding: 14px; }
      .info-label { font-size: 11px; }
      .info-value { font-size: 13px; }
      .specs-grid { grid-template-columns: 1fr; gap: 12px; }
      .location-details-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .assignment-meta-grid { grid-template-columns: 1fr; gap: 12px; }
    }

    /* Mobile (480px and below) */
    @media (max-width: 480px) {
      .asset-details-page { padding: 12px; gap: 12px; }
      .back-btn { width: 100%; justify-content: center; }
      .asset-info { flex-direction: column; align-items: flex-start; }
      .asset-icon { width: 48px; height: 48px; }
      .asset-name { font-size: 20px; }
      .asset-title-row { flex-direction: column; align-items: flex-start; gap: 8px; }
      .asset-meta-row { flex-direction: column; gap: 6px; }
      .separator { display: none; }
      .header-actions { width: 100%; justify-content: flex-start; }
      .header-actions :deep(knod-button) { flex: 1; }
      .action-dropdown { width: 100%; }
      .action-menu-btn { width: 100%; }
      .quick-stats-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .quick-stat { padding: 12px; }
      .quick-stat .stat-label { font-size: 10px; }
      .quick-stat .stat-value { font-size: 13px; }
      .detail-tabs { 
        overflow-x: auto; 
        -webkit-overflow-scrolling: touch;
      }
      .tab-btn { padding: 10px 12px; font-size: 11px; white-space: nowrap; }
      .tab-content { padding: 14px; }
      .info-grid { grid-template-columns: 1fr; gap: 10px; }
      .info-item { padding: 12px; }
      .location-details-grid { grid-template-columns: 1fr; }
      .current-assignment { flex-direction: column; }
      .assignment-actions { flex-direction: column; }
      .maintenance-item { flex-direction: column; }
      .document-item { flex-wrap: wrap; }
    }
  `]
})
export class AssetDetailsComponent {
  private router: Router;
  private route: ActivatedRoute;

  readonly printIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
  readonly editIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  readonly assignIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  readonly transferIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
  readonly returnIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';
  readonly ticketIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
  readonly addIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly uploadIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

  readonly activeTab = signal('overview');
  readonly showActionMenu = signal(false);

  readonly detailTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'assignment', label: 'Assignment' },
    { key: 'history', label: 'History' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'documents', label: 'Documents' },
    { key: 'procurement', label: 'Procurement' },
    { key: 'warranty', label: 'Warranty' },
    { key: 'location', label: 'Location' }
  ];

  readonly asset = signal({
    id: 'AST-1045',
    tag: 'AST-1045',
    name: 'MacBook Pro 14" M3',
    category: 'Laptop',
    brand: 'Apple',
    model: 'MacBook Pro 14" M3',
    serialNumber: 'C02X1234ABCD',
    status: 'assigned',
    assignedTo: 'EMP-2007',
    assignedToName: 'Nisha Sharma',
    department: 'Information Technology',
    designation: 'IT Asset Manager',
    assignedLocation: '3rd Floor, Desk 24',
    manager: 'Vikram Singh',
    location: 'Bangalore',
    building: 'Knodtec HQ',
    floor: '3rd Floor',
    zone: 'IT Department',
    desk: '24',
    city: 'Bangalore',
    state: 'Karnataka',
    purchaseDate: '2025-03-15',
    purchaseCost: 195000,
    warrantyStart: '2025-03-15',
    warrantyEnd: '2028-03-14',
    warrantyStatus: 'active',
    warrantyPeriod: '3 Years',
    warrantyProvider: 'AppleCare+',
    supportContact: '+1-800-275-2273',
    supportEmail: 'support@apple.com',
    condition: 'Good',
    supplier: 'Apple India Pvt Ltd',
    supplierContact: '+91-80-40459000',
    paymentTerms: 'Net 30',
    deliveryDate: '2025-03-15',
    purchaseOrder: 'PO-2025-0345',
    invoiceNumber: 'INV-2025-5678',
    notes: 'Primary work laptop for IT Asset Manager. Upgraded from MacBook Air M1.',
    assignedDate: '2025-03-15',
    expectedReturn: '2027-03-15',
    specs: {
      processor: 'Apple M3 Pro, 11-core CPU',
      ram: '18GB Unified Memory',
      storage: '512GB SSD',
      display: '14.2" Liquid Retina XDR',
      os: 'macOS Sonoma 14.0',
      color: 'Space Black'
    }
  });

  readonly assignmentHistory = signal([
    { id: '1', assignedTo: 'Nisha Sharma', date: new Date('2025-03-15'), type: 'Initial Assignment' },
    { id: '2', assignedTo: 'Priya Patel', date: new Date('2024-06-20'), type: 'Previous Assignment' }
  ]);

  readonly auditHistory = signal([
    { id: '1', action: 'Asset Assigned', actionType: 'assignment', performedBy: 'IT Admin', performedAt: new Date('2025-03-15T10:30:00'), details: 'Asset assigned to Nisha Sharma as primary work laptop.', reference: 'Assignment ID: AST-1045-A1' },
    { id: '2', action: 'Maintenance Completed', actionType: 'maintenance', performedBy: 'TechServe Pro', performedAt: new Date('2025-05-20T14:00:00'), details: 'Keyboard replacement completed. All keys functioning normally.', reference: 'Ticket: TKT-1245' },
    { id: '3', action: 'Warranty Updated', actionType: 'assignment', performedBy: 'System', performedAt: new Date('2025-03-15T09:00:00'), details: 'Warranty period set to 3 years from purchase date.', reference: 'AppleCare+' },
    { id: '4', action: 'Asset Received', actionType: 'assignment', performedBy: 'IT Admin', performedAt: new Date('2025-03-14T16:00:00'), details: 'Asset received and added to inventory.', reference: 'PO-2025-0345' }
  ]);

  readonly maintenanceRecords = signal<MaintenanceRecord[]>([
    { id: '1', type: 'Keyboard Replacement', description: 'Replaced faulty keyboard due to unresponsive keys', status: 'completed', scheduledDate: '2025-05-18', completedDate: '2025-05-20', vendor: 'TechServe Pro', cost: 8500 },
    { id: '2', type: 'Battery Health Check', description: 'Scheduled battery health inspection', status: 'scheduled', scheduledDate: '2026-09-15', vendor: 'Apple Service Center' },
    { id: '3', type: 'Screen Calibration', description: 'Annual display calibration and color profile update', status: 'scheduled', scheduledDate: '2026-03-20', vendor: 'Apple Service Center' }
  ]);

  readonly documents = signal<Document[]>([
    { id: '1', name: 'Purchase Invoice', type: 'Invoice', uploadedAt: '2025-03-14', uploadedBy: 'Finance', size: '245 KB' },
    { id: '2', name: 'Warranty Certificate', type: 'Warranty', uploadedAt: '2025-03-14', uploadedBy: 'IT Admin', size: '156 KB' },
    { id: '3', name: 'Asset Photo', type: 'Image', uploadedAt: '2025-03-14', uploadedBy: 'IT Admin', size: '1.2 MB' }
  ]);

  readonly warrantyProgress = computed(() => {
    const start = new Date(this.asset().warrantyStart).getTime();
    const end   = new Date(this.asset().warrantyEnd).getTime();
    const now   = new Date().getTime();
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  });

  readonly warrantyDaysLeft = computed(() => {
    const end  = new Date(this.asset().warrantyEnd);
    const diff = end.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  constructor(router: Router, route: ActivatedRoute) {
    this.router = router;
    this.route  = route;
  }

  toggleActionMenu(): void { this.showActionMenu.update(v => !v); }

  goBack(): void { this.router.navigate(['/assets']); }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Laptop':    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Monitor':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Phone':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      'Accessory': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      'Printer':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
      'Desktop':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    };
    return icons[category] || icons['Laptop'];
  }

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'red' | 'slate' {
    const map: Record<string, 'green' | 'blue' | 'amber' | 'red' | 'slate'> = {
      available:   'green',
      assigned:    'blue',
      maintenance: 'amber',
      retired:     'slate',
      lost:        'red'
    };
    return map[status] || 'slate';
  }

  getWarrantyClass(): string {
    return this.asset().warrantyStatus === 'active' ? 'warranty-active' : 'warranty-expired';
  }

  getWarrantyBadgeColor(): 'green' | 'amber' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'red'> = {
      active:   'green',
      expiring: 'amber',
      expired:  'red'
    };
    return map[this.asset().warrantyStatus] || 'green';
  }

  getWarrantyMessage(): string {
    const s = this.asset().warrantyStatus;
    if (s === 'active')   return `This asset is covered under warranty for ${this.warrantyDaysLeft()} more days.`;
    if (s === 'expiring') return 'Warranty is expiring soon. Consider renewal.';
    return 'Warranty has expired. Extended support may be available.';
  }

  getMaintenanceStatusColor(status: string): 'green' | 'amber' | 'blue' {
    const map: Record<string, 'green' | 'amber' | 'blue'> = {
      completed:   'green',
      scheduled:   'blue',
      in_progress: 'amber'
    };
    return map[status] || 'blue';
  }

  getAuditIcon(actionType: string): string {
    const icons: Record<string, string> = {
      assignment:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      return:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
      maintenance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      transfer:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>'
    };
    return icons[actionType] || icons['assignment'];
  }

  performAction(action: string): void { this.showActionMenu.set(false); }

  raiseTicket(): void {
    this.router.navigate(['/raise-ticket'], { queryParams: { assetId: this.asset().id } });
  }

  createMaintenance(): void { }

  viewHistory(): void { this.activeTab.set('history'); }
}