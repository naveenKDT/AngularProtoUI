import { Component, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  BadgeComponent,
  AvatarComponent,
  ProgressComponent,
  TabsComponent,
  ButtonComponent,
  StatCardComponent
} from '../../shared/components/ui/ui-components';

interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: string;
  assignedDate: string;
  expectedReturn: string;
  warrantyEnd: string;
  condition: string;
}

interface Request {
  id: string;
  type: string;
  category: string;
  status: string;
  priority: string;
  requestedAt: string;
  resolvedAt?: string;
}

@Component({
  selector: 'knodtec-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ProgressComponent,
    TabsComponent,
    ButtonComponent,
    StatCardComponent
  ],
  template: `
    <div class="profile-page">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
          <div class="profile-avatar">{{ currentUser().initials }}</div>
          <div class="profile-details">
            <h1 class="profile-name">{{ currentUser().name }}</h1>
            <p class="profile-title">{{ currentUser().jobTitle }}</p>
            <div class="profile-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ currentUser().department }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ currentUser().location }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                {{ currentUser().employeeId }}
              </span>
            </div>
          </div>
          <div class="profile-actions">
            <knod-button variant="outline" [icon]="editIcon">Edit Profile</knod-button>
          </div>
        </div>
      </div>

      <!-- Profile Navigation -->
      <div class="profile-nav">
        <knod-tabs 
          [tabs]="profileTabs" 
          [activeTab]="activeTab()" 
          (tabChange)="setActiveTab($event)">
        </knod-tabs>
      </div>

      <!-- Tab Content -->
      <div class="profile-content">
        @switch (activeTab()) {
          @case ('overview') {
            <ng-container *ngTemplateOutlet="overviewTab"></ng-container>
          }
          @case ('personal') {
            <ng-container *ngTemplateOutlet="personalTab"></ng-container>
          }
          @case ('employment') {
            <ng-container *ngTemplateOutlet="employmentTab"></ng-container>
          }
          @case ('assets') {
            <ng-container *ngTemplateOutlet="assetsTab"></ng-container>
          }
          @case ('requests') {
            <ng-container *ngTemplateOutlet="requestsTab"></ng-container>
          }
        }
      </div>

      <!-- Overview Tab Template -->
      <ng-template #overviewTab>
        <div class="overview-grid">
          <!-- Quick Stats -->
          <div class="stats-row">
            <knod-stat-card 
              label="Assigned Assets" 
              [value]="assignedAssets().length"
              subtitle="Currently in use">
            </knod-stat-card>
            <knod-stat-card 
              label="Active Requests" 
              [value]="activeRequests().length"
              subtitle="Pending resolution">
            </knod-stat-card>
            <knod-stat-card 
              label="Total Value" 
              [value]="'$' + totalAssetValue().toLocaleString()"
              subtitle="Your assets">
            </knod-stat-card>
            <knod-stat-card 
              label="Days Employed" 
              [value]="daysEmployed()"
              subtitle="Since joining">
            </knod-stat-card>
          </div>

          <!-- Assigned Assets Summary -->
          <knod-card title="Your Assigned Assets" subtitle="Quick overview of your current assets">
            <div class="asset-summary-grid">
              @for (asset of assignedAssets().slice(0, 4); track asset.id) {
                <div class="asset-summary-card" (click)="viewAsset(asset.id)">
                  <div class="asset-icon" [ngClass]="'cat-' + asset.category.toLowerCase()">
                    <span [innerHTML]="getCategoryIcon(asset.category)"></span>
                  </div>
                  <div class="asset-info">
                    <span class="asset-name">{{ asset.name }}</span>
                    <span class="asset-tag">{{ asset.tag }}</span>
                  </div>
                  <knod-badge [color]="getStatusColor(asset.status)">{{ asset.status }}</knod-badge>
                </div>
              }
            </div>
            @if (assignedAssets().length > 4) {
              <div class="view-more">
                <knod-button variant="ghost" (click)="setActiveTab('assets')">
                  View all {{ assignedAssets().length }} assets
                </knod-button>
              </div>
            }
          </knod-card>

          <!-- Recent Activity -->
          <knod-card title="Recent Activity" subtitle="Asset-related events">
            <div class="activity-timeline">
              @for (activity of recentActivity(); track activity.id) {
                <div class="timeline-item">
                  <div class="timeline-dot" [ngClass]="'dot-' + activity.type"></div>
                  <div class="timeline-content">
                    <span class="timeline-title">{{ activity.title }}</span>
                    <span class="timeline-date">{{ activity.timestamp | date:'mediumDate' }}</span>
                  </div>
                </div>
              }
            </div>
          </knod-card>

          <!-- Quick Actions -->
          <knod-card title="Quick Actions" subtitle="Common tasks">
            <div class="quick-actions-grid">
              <button class="action-card" (click)="raiseRequest()">
                <div class="action-icon blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <span class="action-label">Raise Request</span>
              </button>
              <button class="action-card" (click)="reportIssue()">
                <div class="action-icon red">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <span class="action-label">Report Issue</span>
              </button>
              <button class="action-card" (click)="viewHistory()">
                <div class="action-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <span class="action-label">View History</span>
              </button>
              <button class="action-card" (click)="downloadCertificate()">
                <div class="action-icon amber">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <span class="action-label">Download Certificate</span>
              </button>
            </div>
          </knod-card>
        </div>
      </ng-template>

      <!-- Personal Info Tab Template -->
      <ng-template #personalTab>
        <knod-card title="Personal Information" subtitle="Your personal details">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Full Name</label>
                <span class="info-value">{{ currentUser().name }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Date of Birth</label>
                <span class="info-value">{{ personalInfo().dateOfBirth }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Email</label>
                <span class="info-value">{{ currentUser().email }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Phone</label>
                <span class="info-value">{{ personalInfo().phone }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Personal Email</label>
                <span class="info-value">{{ personalInfo().personalEmail }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Emergency Contact</label>
                <span class="info-value">{{ personalInfo().emergencyContact }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Address</label>
                <span class="info-value">{{ personalInfo().address }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Blood Group</label>
                <span class="info-value">{{ personalInfo().bloodGroup }}</span>
              </div>
            </div>
          </div>
        </knod-card>
      </ng-template>

      <!-- Employment Tab Template -->
      <ng-template #employmentTab>
        <knod-card title="Employment Information" subtitle="Your work details">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Employee ID</label>
                <span class="info-value">{{ currentUser().employeeId }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Department</label>
                <span class="info-value">{{ currentUser().department }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Job Title</label>
                <span class="info-value">{{ currentUser().jobTitle }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Employment Type</label>
                <span class="info-value">{{ employment().type }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Join Date</label>
                <span class="info-value">{{ employment().joinDate }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Reporting Manager</label>
                <span class="info-value">{{ employment().manager }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <label class="info-label">Work Location</label>
                <span class="info-value">{{ currentUser().location }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">Floor & Desk</label>
                <span class="info-value">{{ employment().floorDesk }}</span>
              </div>
            </div>
          </div>
        </knod-card>
      </ng-template>

      <!-- Assigned Assets Tab Template -->
      <ng-template #assetsTab>
        <div class="assets-section">
          <div class="section-header">
            <h2 class="section-title">Assigned Assets</h2>
            <div class="section-actions">
              <knod-button variant="primary" [icon]="plusIcon" (click)="raiseRequest()">
                Raise Request
              </knod-button>
            </div>
          </div>

          @if (assignedAssets().length > 0) {
            <div class="assets-grid">
              @for (asset of assignedAssets(); track asset.id) {
                <div class="asset-card" (click)="viewAsset(asset.id)">
                  <div class="asset-card-header">
                    <div class="asset-category-icon" [ngClass]="'cat-' + asset.category.toLowerCase()">
                      <span [innerHTML]="getCategoryIcon(asset.category)"></span>
                    </div>
                    <knod-badge [color]="getStatusColor(asset.status)">{{ asset.status }}</knod-badge>
                  </div>
                  
                  <h3 class="asset-card-name">{{ asset.name }}</h3>
                  <p class="asset-card-tag">{{ asset.tag }}</p>
                  
                  <div class="asset-card-details">
                    <div class="detail-item">
                      <span class="detail-label">Assigned</span>
                      <span class="detail-value">{{ asset.assignedDate | date:'mediumDate' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Expected Return</span>
                      <span class="detail-value">{{ asset.expectedReturn }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Warranty</span>
                      <span class="detail-value" [class.warning]="isWarrantyExpiringSoon(asset.warrantyEnd)">
                        {{ asset.warrantyEnd | date:'mediumDate' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Condition</span>
                      <span class="detail-value">{{ asset.condition | titlecase }}</span>
                    </div>
                  </div>

                  <div class="asset-card-actions">
                    <knod-button variant="ghost" size="sm" [icon]="ticketIcon">Raise Ticket</knod-button>
                    <knod-button variant="outline" size="sm" (click)="viewAsset(asset.id)">View Details</knod-button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <knod-card>
              <div class="empty-state">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <h3 class="empty-title">No Assets Assigned</h3>
                <p class="empty-description">You don't have any assets assigned to you at the moment.</p>
              </div>
            </knod-card>
          }
        </div>
      </ng-template>

      <!-- Request History Tab Template -->
      <ng-template #requestsTab>
        <div class="requests-section">
          <div class="section-header">
            <h2 class="section-title">Request History</h2>
          </div>

          <knod-card [noPadding]="true">
            <div class="requests-table">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Resolved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (request of requestHistory(); track request.id) {
                    <tr>
                      <td><span class="request-id">{{ request.id }}</span></td>
                      <td>{{ request.type }}</td>
                      <td>
                        <knod-badge [color]="getCategoryBadgeColor(request.category)">
                          {{ request.category }}
                        </knod-badge>
                      </td>
                      <td>
                        <knod-badge [color]="getPriorityColor(request.priority)">
                          {{ request.priority }}
                        </knod-badge>
                      </td>
                      <td>
                        <knod-badge [color]="getRequestStatusColor(request.status)">
                          {{ request.status | titlecase }}
                        </knod-badge>
                      </td>
                      <td>{{ request.requestedAt | date:'mediumDate' }}</td>
                      <td>{{ request.resolvedAt || '—' }}</td>
                      <td>
                        <knod-button variant="ghost" size="sm" (click)="viewRequest(request.id)">
                          View
                        </knod-button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </knod-card>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Profile Header */
    .profile-header {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .profile-cover {
      height: 120px;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-indigo-600));
    }

    .profile-info {
      display: flex;
      align-items: flex-end;
      gap: 20px;
      padding: 0 24px 24px;
      margin-top: -48px;
    }

    .profile-avatar {
      width: 96px;
      height: 96px;
      background: linear-gradient(135deg, var(--color-violet-500), var(--color-indigo-600));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
      font-weight: 700;
      border: 4px solid white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .profile-details {
      flex: 1;
      padding-top: 48px;
    }

    .profile-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .profile-title {
      font-size: 14px;
      color: var(--color-slate-600);
      margin: 0 0 12px 0;
    }

    .profile-meta {
      display: flex;
      gap: 20px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--color-slate-500);
    }

    .meta-item svg {
      color: var(--color-slate-400);
    }

    .profile-actions {
      padding-top: 48px;
    }

    /* Profile Nav */
    .profile-nav {
      margin-bottom: 24px;
    }

    /* Overview Grid */
    .overview-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
    }

    /* Asset Summary Grid */
    .asset-summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    @media (max-width: 768px) {
      .asset-summary-grid {
        grid-template-columns: 1fr;
      }
    }

    .asset-summary-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: var(--color-slate-50);
      border-radius: 10px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .asset-summary-card:hover {
      background: var(--color-slate-100);
    }

    .asset-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .asset-icon.cat-laptop { background: var(--color-primary-100); color: var(--color-primary-600); }
    .asset-icon.cat-monitor { background: var(--color-indigo-100); color: var(--color-indigo-600); }
    .asset-icon.cat-phone { background: var(--color-violet-100); color: var(--color-violet-600); }
    .asset-icon.cat-accessory { background: var(--color-cyan-100); color: var(--color-cyan-600); }
    .asset-icon.cat-printer { background: var(--color-success-100); color: var(--color-success-600); }

    .asset-info {
      flex: 1;
      min-width: 0;
    }

    .asset-name {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-800);
    }

    .asset-tag {
      display: block;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .view-more {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }

    /* Activity Timeline */
    .activity-timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .timeline-item:last-child {
      border-bottom: none;
    }

    .timeline-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .dot-assignment { background: var(--color-primary-500); }
    .dot-return { background: var(--color-success-500); }
    .dot-maintenance { background: var(--color-amber-500); }
    .dot-transfer { background: var(--color-indigo-500); }

    .timeline-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .timeline-title {
      font-size: 13px;
      color: var(--color-slate-700);
    }

    .timeline-date {
      font-size: 12px;
      color: var(--color-slate-400);
    }

    /* Quick Actions Grid */
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    @media (max-width: 768px) {
      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px 16px;
      background: var(--color-slate-50);
      border-radius: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .action-card:hover {
      background: var(--color-slate-100);
      transform: translateY(-2px);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .action-icon.blue { background: var(--color-primary-100); color: var(--color-primary-600); }
    .action-icon.red { background: var(--color-red-100); color: var(--color-red-600); }
    .action-icon.green { background: var(--color-success-100); color: var(--color-success-600); }
    .action-icon.amber { background: var(--color-amber-100); color: var(--color-amber-600); }

    .action-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* Info Grid */
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    @media (max-width: 768px) {
      .info-row {
        grid-template-columns: 1fr;
      }
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 14px;
      color: var(--color-slate-900);
      font-weight: 500;
    }

    /* Assets Section */
    .assets-section, .requests-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    /* Assets Grid */
    .assets-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .assets-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .assets-grid {
        grid-template-columns: 1fr;
      }
    }

    .asset-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .asset-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .asset-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .asset-category-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .asset-category-icon.cat-laptop { background: var(--color-primary-100); color: var(--color-primary-600); }
    .asset-category-icon.cat-monitor { background: var(--color-indigo-100); color: var(--color-indigo-600); }
    .asset-category-icon.cat-phone { background: var(--color-violet-100); color: var(--color-violet-600); }
    .asset-category-icon.cat-accessory { background: var(--color-cyan-100); color: var(--color-cyan-600); }
    .asset-category-icon.cat-printer { background: var(--color-success-100); color: var(--color-success-600); }

    .asset-card-name {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .asset-card-tag {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 0;
    }

    .asset-card-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-label {
      font-size: 10px;
      font-weight: 500;
      color: var(--color-slate-500);
      text-transform: uppercase;
    }

    .detail-value {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .detail-value.warning {
      color: var(--color-amber-600);
    }

    .asset-card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 8px;
    }

    /* Requests Table */
    .requests-table {
      overflow-x: auto;
    }

    .requests-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .requests-table th {
      text-align: left;
      padding: 14px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--color-slate-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: var(--color-slate-50);
      border-bottom: 1px solid var(--color-slate-200);
    }

    .requests-table td {
      padding: 14px 16px;
      font-size: 13px;
      color: var(--color-slate-700);
      border-bottom: 1px solid var(--color-slate-100);
    }

    .requests-table tr:hover {
      background: var(--color-slate-50);
    }

    .request-id {
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary-600);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-icon {
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

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .empty-description {
      font-size: 13px;
      color: var(--color-slate-500);
      margin: 0;
    }

    /* Icons */
    .editIcon {
      display: flex;
    }

    .plusIcon {
      display: flex;
    }

    .ticketIcon {
      display: flex;
    }
  `]
})
export class ProfileComponent {
  private router: Router;

  readonly editIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly ticketIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';

  readonly activeTab = signal('overview');

  readonly profileTabs = [
    { key: 'overview', label: 'Overview', icon: '' },
    { key: 'personal', label: 'Personal Info', icon: '' },
    { key: 'employment', label: 'Employment', icon: '' },
    { key: 'assets', label: 'Assigned Assets', count: 5 },
    { key: 'requests', label: 'Request History', count: 3 }
  ];

  readonly currentUser = signal({
    name: 'Nisha Sharma',
    initials: 'NS',
    email: 'nisha.sharma@knodtec.com',
    employeeId: 'EMP-2007',
    department: 'Information Technology',
    jobTitle: 'IT Asset Manager',
    location: 'Bangalore, Karnataka'
  });

  readonly personalInfo = signal({
    dateOfBirth: '15 March 1994',
    phone: '+91 98765 43210',
    personalEmail: 'nisha.sharma.personal@gmail.com',
    emergencyContact: 'Rajesh Sharma (+91 99887 66554)',
    address: '42, MG Road, Indiranagar, Bangalore - 560038',
    bloodGroup: 'B+'
  });

  readonly employment = signal({
    type: 'Full-time',
    joinDate: '15 January 2022',
    manager: 'Vikram Singh (VP - IT)',
    floorDesk: '3rd Floor, Desk 24'
  });

  readonly assignedAssets = signal([
    { id: 'AST-1045', tag: 'AST-1045', name: 'MacBook Pro 14" M3', category: 'Laptop', status: 'assigned', assignedDate: '2025-03-15', expectedReturn: '2027-03-15', warrantyEnd: '2028-03-14', condition: 'good' },
    { id: 'AST-1056', tag: 'AST-1056', name: 'Dell UltraSharp U2723QE', category: 'Monitor', status: 'assigned', assignedDate: '2025-03-15', expectedReturn: '2027-03-15', warrantyEnd: '2027-08-20', condition: 'good' },
    { id: 'AST-1067', tag: 'AST-1067', name: 'iPhone 15 Pro', category: 'Phone', status: 'assigned', assignedDate: '2025-06-01', expectedReturn: '2026-06-01', warrantyEnd: '2026-06-01', condition: 'good' },
    { id: 'AST-1078', tag: 'AST-1078', name: 'Magic Keyboard', category: 'Accessory', status: 'assigned', assignedDate: '2025-03-15', expectedReturn: '2027-03-15', warrantyEnd: '2026-12-31', condition: 'good' },
    { id: 'AST-1089', tag: 'AST-1089', name: 'AirPods Pro', category: 'Accessory', status: 'assigned', assignedDate: '2025-06-01', expectedReturn: '2026-06-01', warrantyEnd: '2026-06-01', condition: 'good' }
  ]);

  readonly activeRequests = signal([
    { id: 'REQ-4521', type: 'New Laptop Request', status: 'pending' },
    { id: 'REQ-4520', type: 'Monitor Replacement', status: 'pending' }
  ]);

  readonly totalAssetValue = computed(() => {
    return 95000 + 45000 + 120000 + 15000 + 25000;
  });

  readonly daysEmployed = computed(() => {
    const joinDate = new Date('2022-01-15');
    const today = new Date();
    const diff = today.getTime() - joinDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });

  readonly recentActivity = signal([
    { id: '1', type: 'assignment', title: 'MacBook Pro Assigned', timestamp: new Date('2025-03-15') },
    { id: '2', type: 'return', title: 'Old Laptop Returned', timestamp: new Date('2025-03-15') },
    { id: '3', type: 'maintenance', title: 'Keyboard Service Completed', timestamp: new Date('2025-02-20') },
    { id: '4', type: 'transfer', title: 'Monitor Upgraded', timestamp: new Date('2025-01-10') }
  ]);

  readonly requestHistory = signal([
    { id: 'REQ-4521', type: 'New Laptop Request', category: 'Asset Request', priority: 'high', status: 'pending', requestedAt: '2026-06-04', resolvedAt: undefined },
    { id: 'REQ-4520', type: 'Monitor Replacement', category: 'Asset Issue', priority: 'medium', status: 'in_progress', requestedAt: '2026-06-03', resolvedAt: undefined },
    { id: 'REQ-4519', type: 'Keyboard Repair', category: 'Hardware', priority: 'low', status: 'resolved', requestedAt: '2026-05-20', resolvedAt: '2026-05-25' }
  ]);

  constructor(router: Router) {
    this.router = router;
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Laptop': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Monitor': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Phone': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      'Accessory': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      'Printer': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
    };
    return icons[category] || icons['Laptop'];
  }

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'red' | 'slate' {
    const colors: Record<string, 'green' | 'blue' | 'amber' | 'red' | 'slate'> = {
      'assigned': 'green',
      'available': 'blue',
      'maintenance': 'amber',
      'retired': 'slate'
    };
    return colors[status] || 'slate';
  }

  getPriorityColor(priority: string): 'red' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'red' | 'amber' | 'blue' | 'slate'> = {
      'high': 'red',
      'medium': 'amber',
      'low': 'blue'
    };
    return colors[priority] || 'slate';
  }

  getCategoryBadgeColor(category: string): 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber' {
    const colors: Record<string, 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' | 'amber'> = {
      'Asset Request': 'blue',
      'Asset Issue': 'amber',
      'Software': 'indigo',
      'Hardware': 'violet'
    };
    return colors[category] || 'slate';
  }

  getRequestStatusColor(status: string): 'green' | 'amber' | 'blue' | 'red' | 'slate' {
    const colors: Record<string, 'green' | 'amber' | 'blue' | 'red' | 'slate'> = {
      'resolved': 'green',
      'in_progress': 'amber',
      'pending': 'blue',
      'rejected': 'red'
    };
    return colors[status] || 'slate';
  }

  isWarrantyExpiringSoon(warrantyEnd: string): boolean {
    const end = new Date(warrantyEnd);
    const today = new Date();
    const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff > 0;
  }

  viewAsset(assetId: string): void {
    this.router.navigate(['/assets', assetId]);
  }

  raiseRequest(): void {
    this.router.navigate(['/requests/new']);
  }

  reportIssue(): void {
    this.router.navigate(['/requests/new']);
  }

  viewHistory(): void {
    this.activeTab.set('requests');
  }

  downloadCertificate(): void {
    // Handle certificate download
  }

  viewRequest(requestId: string): void {
    this.router.navigate(['/requests', requestId]);
  }
}