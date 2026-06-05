import { Component, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { 
  StatCardComponent, 
  CardComponent, 
  BadgeComponent, 
  AvatarComponent,
  ProgressComponent,
  TabsComponent,
  SearchComponent,
  ButtonComponent
} from '../../shared/components/ui/ui-components';

interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: string;
  assignedTo?: string;
  location: string;
  warrantyEnd: string;
  purchaseCost: number;
}

interface Request {
  id: string;
  type: string;
  category: string;
  status: string;
  priority: string;
  requestedAt: string;
  requestedBy: string;
  assignedTo: string;
}

interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

@Component({
  selector: 'knodtec-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CurrencyPipe, 
    DatePipe, 
    TitleCasePipe,
    StatCardComponent,
    CardComponent,
    BadgeComponent,
    AvatarComponent,
    ProgressComponent,
    TabsComponent,
    SearchComponent,
    ButtonComponent
  ],
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Asset Dashboard</h1>
          <p class="page-subtitle">Overview of your organization's asset inventory and health</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="refreshIcon">Refresh</knod-button>
          <knod-button variant="primary" [icon]="plusIcon">Add Asset</knod-button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <knod-stat-card 
          label="Total Assets" 
          [value]="stats().total" 
          subtitle="Across all categories"
          [trend]="8.2">
        </knod-stat-card>
        
        <knod-stat-card 
          label="Assigned" 
          [value]="stats().assigned" 
          subtitle="Currently in use"
          [trend]="5">
        </knod-stat-card>
        
        <knod-stat-card 
          label="Available" 
          [value]="stats().available" 
          subtitle="Ready to assign"
          [trend]="-2">
        </knod-stat-card>
        
        <knod-stat-card 
          label="Maintenance" 
          [value]="stats().maintenance" 
          subtitle="Needs attention"
          [trend]="12">
        </knod-stat-card>

        <knod-stat-card 
          label="Expiring Warranty" 
          [value]="stats().expiringWarranty" 
          subtitle="Next 30 days"
          [trend]="0">
        </knod-stat-card>

        <knod-stat-card 
          label="Total Value" 
          [value]="'$' + stats().totalValue.toLocaleString()" 
          subtitle="All assets cost"
          [trend]="3.5">
        </knod-stat-card>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="main-column">
          <!-- Charts Row -->
          <div class="charts-row">
            <!-- Category Distribution -->
            <knod-card title="Assets by Category" subtitle="Distribution across categories">
              <div class="chart-container">
                <div class="bar-chart">
                  @for (cat of categoryData(); track cat.name) {
                    <div class="bar-item">
                      <div class="bar-label">{{ cat.name }}</div>
                      <div class="bar-wrapper">
                        <div class="bar-fill" [style.width.%]="cat.percentage" [style.background]="cat.color"></div>
                      </div>
                      <div class="bar-value">{{ cat.count }}</div>
                    </div>
                  }
                </div>
              </div>
            </knod-card>

            <!-- Status Distribution -->
            <knod-card title="Status Overview" subtitle="Asset availability status">
              <div class="donut-chart-container">
                <div class="donut-chart">
                  <svg viewBox="0 0 100 100">
                    @for (segment of statusChartData(); track segment.key; let i = $index) {
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        [attr.stroke]="segment.color"
                        stroke-width="12"
                        [attr.stroke-dasharray]="segment.dashArray"
                        [attr.stroke-dashoffset]="segment.offset"
                        transform="rotate(-90 50 50)"/>
                    }
                  </svg>
                  <div class="donut-center">
                    <span class="donut-value">{{ stats().total }}</span>
                    <span class="donut-label">Total</span>
                  </div>
                </div>
                <div class="chart-legend">
                  @for (item of statusLegend(); track item.label) {
                    <div class="legend-item">
                      <span class="legend-dot" [style.background]="item.color"></span>
                      <span class="legend-label">{{ item.label }}</span>
                      <span class="legend-value">{{ item.value }}</span>
                    </div>
                  }
                </div>
              </div>
            </knod-card>
          </div>

          <!-- Recent Activity -->
          <knod-card title="Recent Activity" subtitle="Latest asset management events">
            <div class="activity-list">
              @for (event of recentActivity(); track event.id) {
                <div class="activity-item" (click)="navigateToAsset(event.assetId)">
                  <div class="activity-icon" [ngClass]="'icon-' + event.typeClass">
                    <span [innerHTML]="getActivityIcon(event.type)"></span>
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">{{ event.title }}</div>
                    <div class="activity-meta">
                      <span>{{ event.description }}</span>
                      <span class="activity-separator">•</span>
                      <span>{{ event.timestamp | date:'MMM d, h:mm a' }}</span>
                    </div>
                  </div>
                  <knod-avatar [name]="event.actor" size="sm"></knod-avatar>
                </div>
              }
            </div>
          </knod-card>

          <!-- Warranty Expiring -->
          <knod-card title="Warranty Expiring Soon" subtitle="Assets requiring warranty attention">
            <div class="warranty-grid">
              @for (asset of expiringWarranty(); track asset.id) {
                <div class="warranty-card" (click)="navigateToAsset(asset.id)">
                  <div class="warranty-header">
                    <knod-badge [color]="getCategoryColor(asset.category)">{{ asset.category }}</knod-badge>
                    <span class="warranty-days" [class.urgent]="getDaysUntil(asset.warrantyEnd) <= 7">
                      {{ getDaysUntil(asset.warrantyEnd) }} days
                    </span>
                  </div>
                  <div class="warranty-name">{{ asset.name }}</div>
                  <div class="warranty-tag">{{ asset.tag }}</div>
                  <div class="warranty-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Expires {{ asset.warrantyEnd | date:'mediumDate' }}
                  </div>
                </div>
              }
            </div>
          </knod-card>
        </div>

        <!-- Right Column -->
        <div class="side-column">
          <!-- Pending Requests -->
          <knod-card title="Pending Requests" subtitle="Requires attention">
            <div class="request-list">
              @for (request of pendingRequests(); track request.id) {
                <div class="request-item">
                  <div class="request-header">
                    <knod-badge [color]="getPriorityColor(request.priority)">{{ request.priority }}</knod-badge>
                    <span class="request-time">{{ getTimeAgo(request.requestedAt) }}</span>
                  </div>
                  <div class="request-title">{{ request.type }}</div>
                  <div class="request-meta">
                    <span>{{ request.requestedBy }}</span>
                    <span class="request-separator">→</span>
                    <span>{{ request.assignedTo }}</span>
                  </div>
                </div>
              }
            </div>
            <div card-footer class="card-footer-action">
              <knod-button variant="ghost" (click)="viewAllRequests()">View all requests</knod-button>
            </div>
          </knod-card>

          <!-- Quick Actions -->
          <knod-card title="Quick Actions" subtitle="Common tasks">
            <div class="quick-actions">
              <button class="quick-action" (click)="navigateTo('/assets/create')">
                <div class="quick-action-icon blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <span>Register Asset</span>
              </button>
              <button class="quick-action" (click)="navigateTo('/requests/new')">
                <div class="quick-action-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <span>New Request</span>
              </button>
              <button class="quick-action" (click)="navigateTo('/reports')">
                <div class="quick-action-icon amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <span>View Reports</span>
              </button>
              <button class="quick-action" (click)="navigateTo('/exit-clearance')">
                <div class="quick-action-icon red">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </div>
                <span>Exit Clearance</span>
              </button>
            </div>
          </knod-card>

          <!-- Top Assignees -->
          <knod-card title="Top Asset Holders" subtitle="By number of assigned assets">
            <div class="holder-list">
              @for (holder of topHolders(); track holder.name) {
                <div class="holder-item">
                  <knod-avatar [name]="holder.name" size="sm"></knod-avatar>
                  <div class="holder-info">
                    <span class="holder-name">{{ holder.name }}</span>
                    <span class="holder-dept">{{ holder.department }}</span>
                  </div>
                  <div class="holder-count">{{ holder.count }}</div>
                </div>
              }
            </div>
          </knod-card>

          <!-- Asset Lifecycle -->
          <knod-card title="Asset Lifecycle" subtitle="Age distribution">
            <div class="lifecycle-stats">
              <div class="lifecycle-item">
                <span class="lifecycle-label">New (0-1 yr)</span>
                <knod-progress [value]="35" [showValue]="true" color="green"></knod-progress>
              </div>
              <div class="lifecycle-item">
                <span class="lifecycle-label">Mature (1-3 yrs)</span>
                <knod-progress [value]="45" [showValue]="true" color="blue"></knod-progress>
              </div>
              <div class="lifecycle-item">
                <span class="lifecycle-label">Aging (3-5 yrs)</span>
                <knod-progress [value]="15" [showValue]="true" color="amber"></knod-progress>
              </div>
              <div class="lifecycle-item">
                <span class="lifecycle-label">End of Life (5+ yrs)</span>
                <knod-progress [value]="5" [showValue]="true" color="red"></knod-progress>
              </div>
            </div>
          </knod-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
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

    .header-actions {
      display: flex;
      gap: 12px;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 1280px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .main-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .side-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Charts */
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .charts-row {
        grid-template-columns: 1fr;
      }
    }

    .chart-container {
      padding: 8px 0;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bar-item {
      display: grid;
      grid-template-columns: 100px 1fr 40px;
      align-items: center;
      gap: 12px;
    }

    .bar-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .bar-wrapper {
      height: 8px;
      background: var(--color-slate-100);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width var(--transition-slow);
    }

    .bar-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-700);
      text-align: right;
    }

    /* Donut Chart */
    .donut-chart-container {
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 16px 0;
    }

    .donut-chart {
      position: relative;
      width: 140px;
      height: 140px;
    }

    .donut-chart svg {
      width: 100%;
      height: 100%;
    }

    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .donut-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .donut-label {
      display: block;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }

    .legend-label {
      font-size: 12px;
      color: var(--color-slate-600);
      flex: 1;
    }

    .legend-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-700);
    }

    /* Activity List */
    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--color-slate-100);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item:hover {
      background: var(--color-slate-50);
      margin: 0 -20px;
      padding: 12px 20px;
    }

    .activity-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .activity-icon :deep(svg) {
      width: 16px;
      height: 16px;
    }

    .icon-assignment {
      background: var(--color-primary-50);
      color: var(--color-primary-600);
    }

    .icon-return {
      background: var(--color-success-50);
      color: var(--color-success-600);
    }

    .icon-maintenance {
      background: var(--color-amber-50);
      color: var(--color-amber-600);
    }

    .icon-transfer {
      background: var(--color-indigo-50);
      color: var(--color-indigo-600);
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-900);
    }

    .activity-meta {
      font-size: 12px;
      color: var(--color-slate-500);
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .activity-separator {
      color: var(--color-slate-300);
    }

    /* Warranty Grid */
    .warranty-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    @media (max-width: 1280px) {
      .warranty-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .warranty-card {
      background: var(--color-slate-50);
      border-radius: 8px;
      padding: 14px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .warranty-card:hover {
      background: var(--color-slate-100);
    }

    .warranty-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .warranty-days {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-amber-600);
      background: var(--color-amber-50);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .warranty-days.urgent {
      color: var(--color-red-600);
      background: var(--color-red-50);
    }

    .warranty-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin-bottom: 2px;
    }

    .warranty-tag {
      font-size: 11px;
      color: var(--color-slate-500);
      margin-bottom: 8px;
    }

    .warranty-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Request List */
    .request-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .request-item {
      background: var(--color-slate-50);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .request-item:hover {
      background: var(--color-slate-100);
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .request-time {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .request-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
      margin-bottom: 4px;
    }

    .request-meta {
      font-size: 11px;
      color: var(--color-slate-500);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .request-separator {
      color: var(--color-slate-300);
    }

    .card-footer-action {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    /* Quick Actions */
    .quick-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .quick-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .quick-action:hover {
      background: var(--color-slate-100);
    }

    .quick-action-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .quick-action-icon.blue {
      background: var(--color-primary-100);
      color: var(--color-primary-600);
    }

    .quick-action-icon.green {
      background: var(--color-success-100);
      color: var(--color-success-600);
    }

    .quick-action-icon.amber {
      background: var(--color-amber-100);
      color: var(--color-amber-600);
    }

    .quick-action-icon.red {
      background: var(--color-red-100);
      color: var(--color-red-600);
    }

    .quick-action span {
      font-size: 11px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    /* Holder List */
    .holder-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .holder-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border-radius: 6px;
      transition: all var(--transition-fast);
    }

    .holder-item:hover {
      background: var(--color-slate-50);
    }

    .holder-info {
      flex: 1;
      min-width: 0;
    }

    .holder-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .holder-dept {
      display: block;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .holder-count {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-700);
      background: var(--color-slate-100);
      padding: 4px 10px;
      border-radius: 6px;
    }

    /* Lifecycle */
    .lifecycle-stats {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .lifecycle-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .lifecycle-label {
      font-size: 12px;
      color: var(--color-slate-600);
    }

    /* Icons */
    .refreshIcon {
      display: flex;
    }

    .plusIcon {
      display: flex;
    }
  `]
})
export class DashboardComponent {
  private router: Router;

  readonly refreshIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

  readonly stats = signal({
    total: 247,
    assigned: 182,
    available: 48,
    maintenance: 12,
    expiringWarranty: 8,
    totalValue: 48500000
  });

  readonly categoryData = signal([
    { name: 'Laptops', count: 86, percentage: 85, color: 'var(--color-primary-500)' },
    { name: 'Monitors', count: 52, percentage: 52, color: 'var(--color-indigo-500)' },
    { name: 'Phones', count: 45, percentage: 45, color: 'var(--color-violet-500)' },
    { name: 'Accessories', count: 38, percentage: 38, color: 'var(--color-cyan-500)' },
    { name: 'Printers', count: 15, percentage: 15, color: 'var(--color-success-500)' },
    { name: 'Other', count: 11, percentage: 11, color: 'var(--color-slate-400)' }
  ]);

  readonly statusChartData = computed(() => {
    const total = this.stats().total;
    const assigned = this.stats().assigned;
    const available = this.stats().available;
    const maintenance = this.stats().maintenance;
    const retired = total - assigned - available - maintenance;

    const segments = [
      { key: 'assigned', value: assigned, color: 'var(--color-primary-500)' },
      { key: 'available', value: available, color: 'var(--color-success-500)' },
      { key: 'maintenance', value: maintenance, color: 'var(--color-amber-500)' },
      { key: 'retired', value: retired, color: 'var(--color-slate-300)' }
    ];

    const circumference = 2 * Math.PI * 40;
    let offset = 0;

    return segments.map(seg => {
      const dashArray = `${(seg.value / total) * circumference} ${circumference}`;
      const result = {
        ...seg,
        dashArray,
        offset: -offset
      };
      offset += (seg.value / total) * circumference;
      return result;
    });
  });

  readonly statusLegend = computed(() => [
    { label: 'Assigned', value: this.stats().assigned, color: 'var(--color-primary-500)' },
    { label: 'Available', value: this.stats().available, color: 'var(--color-success-500)' },
    { label: 'Maintenance', value: this.stats().maintenance, color: 'var(--color-amber-500)' },
    { label: 'Retired', value: this.stats().total - this.stats().assigned - this.stats().available - this.stats().maintenance, color: 'var(--color-slate-300)' }
  ]);

  readonly recentActivity = signal([
    { id: '1', type: 'assignment', typeClass: 'assignment', title: 'MacBook Pro M3 Assigned', description: 'Assigned to Priya Patel in Engineering', timestamp: '2026-06-05T09:30:00', actor: 'Rahul Jain', assetId: 'AST-1045' },
    { id: '2', type: 'return', typeClass: 'return', title: 'Dell Latitude Returned', description: 'Returned in good condition by Amit Singh', timestamp: '2026-06-05T08:15:00', actor: 'Amit Singh', assetId: 'AST-1023' },
    { id: '3', type: 'maintenance', typeClass: 'maintenance', title: 'Maintenance Created', description: 'Keyboard replacement for HP EliteBook', timestamp: '2026-06-04T16:45:00', actor: 'IT Support', assetId: 'AST-1038' },
    { id: '4', type: 'transfer', typeClass: 'transfer', title: 'Asset Transferred', description: 'iPhone 15 Pro moved from Sales to Marketing', timestamp: '2026-06-04T14:20:00', actor: 'Rahul Jain', assetId: 'AST-1019' },
    { id: '5', type: 'assignment', typeClass: 'assignment', title: 'Monitor Assigned', description: '27" 4K Monitor assigned to Deepak Kumar', timestamp: '2026-06-04T11:00:00', actor: 'IT Admin', assetId: 'AST-1056' }
  ]);

  readonly expiringWarranty = signal([
    { id: 'AST-1023', name: 'Dell Latitude 7440', tag: 'AST-1023', category: 'Laptop', warrantyEnd: '2026-06-12' },
    { id: 'AST-1034', name: 'HP EliteBook 840', tag: 'AST-1034', category: 'Laptop', warrantyEnd: '2026-06-15' },
    { id: 'AST-1045', name: 'MacBook Pro 14"', tag: 'AST-1045', category: 'Laptop', warrantyEnd: '2026-06-18' },
    { id: 'AST-1056', name: 'Dell UltraSharp 27"', tag: 'AST-1056', category: 'Monitor', warrantyEnd: '2026-06-22' },
    { id: 'AST-1067', name: 'iPhone 15 Pro', tag: 'AST-1067', category: 'Phone', warrantyEnd: '2026-06-25' },
    { id: 'AST-1078', name: 'ThinkPad X1 Carbon', tag: 'AST-1078', category: 'Laptop', warrantyEnd: '2026-06-28' }
  ]);

  readonly pendingRequests = signal([
    { id: 'REQ-4521', type: 'New Laptop Request', category: 'Asset Request', priority: 'high', status: 'pending', requestedAt: '2026-06-04T14:30:00', requestedBy: 'Vikram Singh', assignedTo: 'IT Asset Team' },
    { id: 'REQ-4520', type: 'Monitor Replacement', category: 'Asset Issue', priority: 'medium', status: 'pending', requestedAt: '2026-06-04T10:15:00', requestedBy: 'Sneha Gupta', assignedTo: 'IT Support' },
    { id: 'REQ-4519', type: 'Software Installation', category: 'Software', priority: 'low', status: 'pending', requestedAt: '2026-06-03T16:45:00', requestedBy: 'Arun Kumar', assignedTo: 'IT Support' },
    { id: 'REQ-4518', type: 'Keyboard Repair', category: 'Hardware', priority: 'medium', status: 'pending', requestedAt: '2026-06-03T09:30:00', requestedBy: 'Meera Joshi', assignedTo: 'IT Support' }
  ]);

  readonly topHolders = signal([
    { name: 'Priya Patel', department: 'Engineering', count: 5 },
    { name: 'Amit Singh', department: 'Marketing', count: 4 },
    { name: 'Deepak Kumar', department: 'Finance', count: 4 },
    { name: 'Sneha Gupta', department: 'Design', count: 3 },
    { name: 'Rahul Verma', department: 'Operations', count: 3 }
  ]);

  constructor(router: Router) {
    this.router = router;
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      assignment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      return: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
      maintenance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>'
    };
    return icons[type] || icons['assignment'];
  }

  getCategoryColor(category: string): 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate' {
    const colors: Record<string, 'blue' | 'indigo' | 'violet' | 'cyan' | 'green' | 'slate'> = {
      'Laptop': 'blue',
      'Monitor': 'indigo',
      'Phone': 'violet',
      'Accessory': 'cyan',
      'Printer': 'green'
    };
    return colors[category] || 'slate';
  }

  getPriorityColor(priority: string): 'red' | 'amber' | 'blue' | 'slate' {
    const colors: Record<string, 'red' | 'amber' | 'blue' | 'slate'> = {
      'high': 'red',
      'medium': 'amber',
      'low': 'blue'
    };
    return colors[priority] || 'slate';
  }

  getDaysUntil(dateStr: string): number {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
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

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToAsset(assetId: string): void {
    this.router.navigate(['/assets', assetId]);
  }

  viewAllRequests(): void {
    this.router.navigate(['/requests']);
  }
}