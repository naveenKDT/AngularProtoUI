import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe, CurrencyPipe } from '@angular/common';
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

interface ReportCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  reportCount: number;
}

interface Report {
  id: string;
  name: string;
  category: string;
  description: string;
  lastGenerated: string;
  nextScheduled?: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'knodtec-reports',
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
    ProgressComponent,
    TabsComponent,
    ButtonComponent,
    StatCardComponent
  ],
  template: `
    <div class="reports-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Asset Reports</h1>
          <p class="page-subtitle">Analytics and insights for your asset management</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="calendarIcon">Date Range</knod-button>
          <knod-button variant="primary" [icon]="downloadIcon">Export Report</knod-button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-row">
        <knod-stat-card 
          label="Total Assets" 
          [value]="247"
          subtitle="Across all categories"
          [trend]="8.2">
        </knod-stat-card>
        <knod-stat-card 
          label="Utilization Rate" 
          [value]="'73.7%'"
          subtitle="Assets in active use"
          [trend]="2.5">
        </knod-stat-card>
        <knod-stat-card 
          label="Avg Asset Age" 
          [value]="'2.3 yrs'"
          subtitle="Across inventory"
          [trend]="-5">
        </knod-stat-card>
        <knod-stat-card 
          label="Maintenance Cost" 
          [value]="'$' + (48500 | number)"
          subtitle="This quarter"
          [trend]="12">
        </knod-stat-card>
      </div>

      <!-- Main Content -->
      <div class="content-grid">
        <!-- Left: Categories -->
        <div class="categories-panel">
          <knod-card title="Report Categories" subtitle="Browse by topic">
            <div class="category-list">
              @for (category of reportCategories(); track category.id) {
                <div 
                  class="category-item"
                  [class.selected]="selectedCategory() === category.id"
                  (click)="selectCategory(category.id)">
                  <div class="category-icon" [innerHTML]="category.icon"></div>
                  <div class="category-info">
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-desc">{{ category.description }}</span>
                  </div>
                  <span class="category-count">{{ category.reportCount }}</span>
                </div>
              }
            </div>
          </knod-card>

          <!-- Quick Reports -->
          <knod-card title="Quick Reports" subtitle="Frequently accessed">
            <div class="quick-reports">
              @for (report of quickReports(); track report.id) {
                <div class="quick-report-item" (click)="viewReport(report)">
                  <div class="report-info">
                    <span class="report-name">{{ report.name }}</span>
                    <span class="report-meta">Generated {{ report.lastGenerated | date:'short' }}</span>
                  </div>
                  <knod-button variant="ghost" size="sm" [icon]="viewIcon">View</knod-button>
                </div>
              }
            </div>
          </knod-card>
        </div>

        <!-- Right: Report Content -->
        <div class="report-content">
          @switch (selectedCategory()) {
            @case ('health') {
              <ng-container *ngTemplateOutlet="healthReports"></ng-container>
            }
            @case ('utilization') {
              <ng-container *ngTemplateOutlet="utilizationReports"></ng-container>
            }
            @case ('warranty') {
              <ng-container *ngTemplateOutlet="warrantyReports"></ng-container>
            }
            @case ('maintenance') {
              <ng-container *ngTemplateOutlet="maintenanceReports"></ng-container>
            }
            @case ('clearance') {
              <ng-container *ngTemplateOutlet="clearanceReports"></ng-container>
            }
            @default {
              <ng-container *ngTemplateOutlet="healthReports"></ng-container>
            }
          }
        </div>
      </div>

      <!-- Health Reports Template -->
      <ng-template #healthReports>
        <div class="report-section">
          <div class="section-header">
            <h2 class="section-title">Asset Health Overview</h2>
            <p class="section-description">Monitor the health status of your asset inventory</p>
          </div>

          <div class="report-grid">
            <!-- Health Summary -->
            <knod-card title="Health Summary" subtitle="Current inventory status">
              <div class="health-chart">
                <div class="donut-chart">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success-200)" stroke-width="12"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success-500)" stroke-width="12" 
                      stroke-dasharray="188 251" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-warning-200)" stroke-width="12" 
                      stroke-dasharray="37 251" stroke-dashoffset="-188" transform="rotate(-90 50 50)"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-red-200)" stroke-width="12" 
                      stroke-dasharray="19 251" stroke-dashoffset="-225" transform="rotate(-90 50 50)"/>
                  </svg>
                  <div class="donut-center">
                    <span class="donut-value">247</span>
                    <span class="donut-label">Total</span>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--color-success-500)"></span>
                    <span class="legend-label">Good</span>
                    <span class="legend-value">201 (81%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--color-warning-500)"></span>
                    <span class="legend-label">Fair</span>
                    <span class="legend-value">35 (14%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--color-red-500)"></span>
                    <span class="legend-label">Poor</span>
                    <span class="legend-value">11 (5%)</span>
                  </div>
                </div>
              </div>
            </knod-card>

            <!-- Condition Breakdown -->
            <knod-card title="Condition by Category" subtitle="Asset health across categories">
              <div class="condition-chart">
                @for (item of conditionByCategory(); track item.category) {
                  <div class="condition-row">
                    <span class="condition-category">{{ item.category }}</span>
                    <div class="condition-bars">
                      <div class="bar-segment good" [style.width.%]="item.good"></div>
                      <div class="bar-segment fair" [style.width.%]="item.fair"></div>
                      <div class="bar-segment poor" [style.width.%]="item.poor"></div>
                    </div>
                    <span class="condition-total">{{ item.total }}</span>
                  </div>
                }
              </div>
            </knod-card>

            <!-- Aging Analysis -->
            <knod-card title="Asset Aging Analysis" subtitle="Distribution by age">
              <div class="aging-chart">
                <div class="aging-grid">
                  @for (item of agingData(); track item.label) {
                    <div class="aging-item">
                      <div class="aging-value">{{ item.value }}</div>
                      <div class="aging-bar">
                        <div class="aging-fill" [style.height.%]="item.percentage"></div>
                      </div>
                      <div class="aging-label">{{ item.label }}</div>
                      <div class="aging-percent">{{ item.percentage }}%</div>
                    </div>
                  }
                </div>
              </div>
            </knod-card>

            <!-- Insights -->
            <knod-card title="Health Insights" subtitle="Key observations and recommendations">
              <div class="insights-list">
                <div class="insight-item positive">
                  <div class="insight-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div class="insight-content">
                    <span class="insight-title">Overall health improving</span>
                    <span class="insight-desc">Asset health score increased by 5% this quarter</span>
                  </div>
                </div>
                <div class="insight-item warning">
                  <div class="insight-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div class="insight-content">
                    <span class="insight-title">11 assets need attention</span>
                    <span class="insight-desc">Assets with poor condition require maintenance or replacement</span>
                  </div>
                </div>
                <div class="insight-item info">
                  <div class="insight-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </div>
                  <div class="insight-content">
                    <span class="insight-title">35 assets approaching lifecycle end</span>
                    <span class="insight-desc">Consider planning for replacement in next budget cycle</span>
                  </div>
                </div>
              </div>
            </knod-card>
          </div>
        </div>
      </ng-template>

      <!-- Utilization Reports Template -->
      <ng-template #utilizationReports>
        <div class="report-section">
          <div class="section-header">
            <h2 class="section-title">Asset Utilization</h2>
            <p class="section-description">Track how assets are being used across the organization</p>
          </div>

          <div class="report-grid">
            <!-- Utilization Overview -->
            <knod-card title="Utilization Rate" subtitle="By asset type">
              <div class="utilization-bars">
                @for (item of utilizationData(); track item.type) {
                  <div class="utilization-item">
                    <div class="utilization-header">
                      <span class="utilization-type">{{ item.type }}</span>
                      <span class="utilization-rate">{{ item.rate }}%</span>
                    </div>
                    <div class="utilization-bar">
                      <div class="utilization-fill" [style.width.%]="item.rate" [ngClass]="'fill-' + item.color"></div>
                    </div>
                    <div class="utilization-meta">
                      <span>{{ item.assigned }} assigned</span>
                      <span>{{ item.available }} available</span>
                    </div>
                  </div>
                }
              </div>
            </knod-card>

            <!-- Top Assignees -->
            <knod-card title="Top Asset Holders" subtitle="By number of assigned assets">
              <div class="top-holders">
                @for (holder of topHolders(); track holder.rank; let i = $index) {
                  <div class="holder-row">
                    <span class="holder-rank">{{ holder.rank }}</span>
                    <knod-avatar [name]="holder.name" size="sm"></knod-avatar>
                    <div class="holder-info">
                      <span class="holder-name">{{ holder.name }}</span>
                      <span class="holder-dept">{{ holder.department }}</span>
                    </div>
                    <div class="holder-count">
                      <span class="count-value">{{ holder.count }}</span>
                      <span class="count-label">assets</span>
                    </div>
                  </div>
                }
              </div>
            </knod-card>

            <!-- Unused Assets -->
            <knod-card title="Idle Assets" subtitle="Available but not assigned for 30+ days">
              <div class="idle-assets">
                @for (asset of idleAssets(); track asset.tag) {
                  <div class="idle-item">
                    <div class="idle-info">
                      <span class="idle-name">{{ asset.name }}</span>
                      <span class="idle-tag">{{ asset.tag }}</span>
                    </div>
                    <div class="idle-days">
                      <span class="days-value">{{ asset.idleDays }}</span>
                      <span class="days-label">days idle</span>
                    </div>
                    <knod-button variant="outline" size="sm">Reassign</knod-button>
                  </div>
                }
              </div>
            </knod-card>
          </div>
        </div>
      </ng-template>

      <!-- Warranty Reports Template -->
      <ng-template #warrantyReports>
        <div class="report-section">
          <div class="section-header">
            <h2 class="section-title">Warranty Status</h2>
            <p class="section-description">Monitor warranty coverage and upcoming expirations</p>
          </div>

          <div class="report-grid">
            <!-- Warranty Overview -->
            <knod-card title="Warranty Overview" subtitle="Coverage status">
              <div class="warranty-stats">
                <div class="warranty-stat">
                  <span class="stat-value green">186</span>
                  <span class="stat-label">Active</span>
                </div>
                <div class="warranty-stat">
                  <span class="stat-value amber">8</span>
                  <span class="stat-label">Expiring</span>
                </div>
                <div class="warranty-stat">
                  <span class="stat-value red">12</span>
                  <span class="stat-label">Expired</span>
                </div>
                <div class="warranty-stat">
                  <span class="stat-value gray">41</span>
                  <span class="stat-label">No Warranty</span>
                </div>
              </div>
            </knod-card>

            <!-- Expiring Soon -->
            <knod-card title="Expiring Within 30 Days" subtitle="Assets requiring warranty renewal">
              <div class="expiring-list">
                @for (asset of expiringAssets(); track asset.tag) {
                  <div class="expiring-item">
                    <div class="expiring-info">
                      <span class="expiring-name">{{ asset.name }}</span>
                      <span class="expiring-tag">{{ asset.tag }}</span>
                    </div>
                    <div class="expiring-date">
                      <span class="date-value">{{ asset.expires | date:'mediumDate' }}</span>
                      <span class="date-days">{{ asset.daysLeft }} days</span>
                    </div>
                    <knod-badge [color]="asset.daysLeft <= 7 ? 'red' : 'amber'">
                      {{ asset.daysLeft <= 7 ? 'Urgent' : 'Soon' }}
                    </knod-badge>
                  </div>
                }
              </div>
            </knod-card>

            <!-- Cost Analysis -->
            <knod-card title="Warranty Cost Analysis" subtitle="Spending by category">
              <div class="cost-chart">
                @for (item of warrantyCostData(); track item.category) {
                  <div class="cost-row">
                    <span class="cost-category">{{ item.category }}</span>
                    <div class="cost-bar">
                      <div class="cost-fill" [style.width.%]="item.percentage"></div>
                    </div>
                    <span class="cost-value">\${{ item.cost | number }}</span>
                  </div>
                }
              </div>
            </knod-card>
          </div>
        </div>
      </ng-template>

      <!-- Maintenance Reports Template -->
      <ng-template #maintenanceReports>
        <div class="report-section">
          <div class="section-header">
            <h2 class="section-title">Maintenance Overview</h2>
            <p class="section-description">Track maintenance activities and costs</p>
          </div>

          <div class="report-grid">
            <!-- Maintenance Stats -->
            <knod-card title="Maintenance Summary" subtitle="This quarter">
              <div class="maintenance-stats">
                <div class="maintenance-stat">
                  <span class="stat-value blue">24</span>
                  <span class="stat-label">Open Tickets</span>
                </div>
                <div class="maintenance-stat">
                  <span class="stat-value green">18</span>
                  <span class="stat-label">Completed</span>
                </div>
                <div class="maintenance-stat">
                  <span class="stat-value amber">12</span>
                  <span class="stat-label">In Progress</span>
                </div>
                <div class="maintenance-stat">
                  <span class="stat-value">\$48,500</span>
                  <span class="stat-label">Total Cost</span>
                </div>
              </div>
            </knod-card>

            <!-- Cost by Type -->
            <knod-card title="Cost by Maintenance Type" subtitle="Breakdown of expenses">
              <div class="cost-breakdown">
                @for (item of maintenanceCostByType(); track item.type) {
                  <div class="cost-item">
                    <div class="cost-header">
                      <span class="cost-type">{{ item.type }}</span>
                      <span class="cost-amount">\${{ item.amount | number }}</span>
                    </div>
                    <knod-progress [value]="item.percentage" [showValue]="true" [color]="item.color"></knod-progress>
                  </div>
                }
              </div>
            </knod-card>

            <!-- Vendor Performance -->
            <knod-card title="Vendor Performance" subtitle="Maintenance by vendor">
              <div class="vendor-list">
                @for (vendor of vendorPerformance(); track vendor.name) {
                  <div class="vendor-item">
                    <div class="vendor-info">
                      <span class="vendor-name">{{ vendor.name }}</span>
                      <span class="vendor-jobs">{{ vendor.jobs }} jobs</span>
                    </div>
                    <div class="vendor-rating">
                      <div class="rating-stars">
                        @for (star of [1,2,3,4,5]; track star) {
                          <svg 
                            width="14" height="14" 
                            [attr.fill]="star <= vendor.rating ? 'var(--color-amber-500)' : 'var(--color-slate-200)'"
                            viewBox="0 0 24 24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        }
                      </div>
                      <span class="rating-value">{{ vendor.rating }}</span>
                    </div>
                    <div class="vendor-cost">
                      <span class="cost-value">\${{ vendor.cost | number }}</span>
                      <span class="cost-label">total</span>
                    </div>
                  </div>
                }
              </div>
            </knod-card>
          </div>
        </div>
      </ng-template>

      <!-- Clearance Reports Template -->
      <ng-template #clearanceReports>
        <div class="report-section">
          <div class="section-header">
            <h2 class="section-title">Exit Clearance</h2>
            <p class="section-description">Offboarding and asset recovery statistics</p>
          </div>

          <div class="report-grid">
            <!-- Clearance Stats -->
            <knod-card title="Clearance Overview" subtitle="This year">
              <div class="clearance-stats">
                <div class="clearance-stat">
                  <span class="stat-value blue">42</span>
                  <span class="stat-label">Completed</span>
                </div>
                <div class="clearance-stat">
                  <span class="stat-value amber">8</span>
                  <span class="stat-label">In Progress</span>
                </div>
                <div class="clearance-stat">
                  <span class="stat-value red">3</span>
                  <span class="stat-label">Blocked</span>
                </div>
                <div class="clearance-stat">
                  <span class="stat-value green">156</span>
                  <span class="stat-label">Assets Recovered</span>
                </div>
              </div>
            </knod-card>

            <!-- Asset Recovery -->
            <knod-card title="Asset Recovery Status" subtitle="Condition of returned assets">
              <div class="recovery-chart">
                <div class="recovery-donut">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success-200)" stroke-width="12"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success-500)" stroke-width="12" 
                      stroke-dasharray="125 251" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-warning-200)" stroke-width="12" 
                      stroke-dasharray="19 251" stroke-dashoffset="-125" transform="rotate(-90 50 50)"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-red-200)" stroke-width="12" 
                      stroke-dasharray="12 251" stroke-dashoffset="-144" transform="rotate(-90 50 50)"/>
                  </svg>
                  <div class="donut-center">
                    <span class="donut-value">156</span>
                    <span class="donut-label">Recovered</span>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--color-success-500)"></span>
                    <span class="legend-label">Good</span>
                    <span class="legend-value">125 (80%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--color-warning-500)"></span>
                    <span class="legend-label">Damaged</span>
                    <span class="legend-value">19 (12%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--color-red-500)"></span>
                    <span class="legend-label">Missing</span>
                    <span class="legend-value">12 (8%)</span>
                  </div>
                </div>
              </div>
            </knod-card>

            <!-- Recovery Timeline -->
            <knod-card title="Average Clearance Time" subtitle="Days from initiation to completion">
              <div class="timeline-stats">
                <div class="timeline-item">
                  <span class="timeline-label">Resignation</span>
                  <div class="timeline-bar">
                    <div class="timeline-fill" style="width: 65%"></div>
                  </div>
                  <span class="timeline-value">12 days</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-label">Contract End</span>
                  <div class="timeline-bar">
                    <div class="timeline-fill" style="width: 50%"></div>
                  </div>
                  <span class="timeline-value">8 days</span>
                </div>
                <div class="timeline-item">
                  <span class="timeline-label">Termination</span>
                  <div class="timeline-bar">
                    <div class="timeline-fill" style="width: 80%"></div>
                  </div>
                  <span class="timeline-value">15 days</span>
                </div>
              </div>
            </knod-card>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .reports-page {
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

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Categories Panel */
    .categories-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .category-item:hover {
      background: var(--color-slate-50);
    }

    .category-item.selected {
      background: var(--color-primary-50);
    }

    .category-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-slate-100);
      border-radius: 10px;
      color: var(--color-slate-600);
    }

    .category-item.selected .category-icon {
      background: var(--color-primary-100);
      color: var(--color-primary-600);
    }

    .category-icon :deep(svg) {
      width: 20px;
      height: 20px;
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .category-desc {
      display: block;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .category-count {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-500);
      background: var(--color-slate-100);
      padding: 2px 8px;
      border-radius: 10px;
    }

    .category-item.selected .category-count {
      background: var(--color-primary-100);
      color: var(--color-primary-600);
    }

    /* Quick Reports */
    .quick-reports {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .quick-report-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .quick-report-item:hover {
      background: var(--color-slate-50);
    }

    .report-info {
      display: flex;
      flex-direction: column;
    }

    .report-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .report-meta {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    /* Report Content */
    .report-content {
      min-height: 400px;
    }

    /* Report Section */
    .report-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .section-header {
      margin-bottom: 8px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0 0 4px 0;
    }

    .section-description {
      font-size: 14px;
      color: var(--color-slate-500);
      margin: 0;
    }

    /* Report Grid */
    .report-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 1024px) {
      .report-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Charts */
    .health-chart, .donut-chart-container {
      display: flex;
      align-items: center;
      gap: 32px;
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

    /* Condition Chart */
    .condition-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .condition-row {
      display: grid;
      grid-template-columns: 100px 1fr 40px;
      align-items: center;
      gap: 12px;
    }

    .condition-category {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .condition-bars {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--color-slate-100);
    }

    .bar-segment {
      height: 100%;
    }

    .bar-segment.good { background: var(--color-success-500); }
    .bar-segment.fair { background: var(--color-warning-500); }
    .bar-segment.poor { background: var(--color-red-500); }

    .condition-total {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-600);
      text-align: right;
    }

    /* Aging Chart */
    .aging-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 160px;
      padding-top: 20px;
    }

    .aging-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .aging-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-slate-700);
    }

    .aging-bar {
      width: 40px;
      height: 100px;
      background: var(--color-slate-100);
      border-radius: 6px;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
    }

    .aging-fill {
      width: 100%;
      background: var(--color-primary-500);
      border-radius: 6px;
      transition: height var(--transition-slow);
    }

    .aging-label {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .aging-percent {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-slate-600);
    }

    /* Insights */
    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .insight-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
    }

    .insight-item.positive {
      background: var(--color-success-50);
    }

    .insight-item.warning {
      background: var(--color-amber-50);
    }

    .insight-item.info {
      background: var(--color-primary-50);
    }

    .insight-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .insight-item.positive .insight-icon {
      background: var(--color-success-100);
      color: var(--color-success-600);
    }

    .insight-item.warning .insight-icon {
      background: var(--color-amber-100);
      color: var(--color-amber-600);
    }

    .insight-item.info .insight-icon {
      background: var(--color-primary-100);
      color: var(--color-primary-600);
    }

    .insight-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .insight-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .insight-desc {
      font-size: 12px;
      color: var(--color-slate-600);
    }

    /* Utilization Bars */
    .utilization-bars {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .utilization-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .utilization-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .utilization-type {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .utilization-rate {
      font-size: 14px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .utilization-bar {
      height: 8px;
      background: var(--color-slate-100);
      border-radius: 4px;
      overflow: hidden;
    }

    .utilization-fill {
      height: 100%;
      border-radius: 4px;
      transition: width var(--transition-slow);
    }

    .fill-green { background: var(--color-success-500); }
    .fill-blue { background: var(--color-primary-500); }
    .fill-amber { background: var(--color-warning-500); }
    .fill-indigo { background: var(--color-indigo-500); }

    .utilization-meta {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: var(--color-slate-500);
    }

    /* Top Holders */
    .top-holders {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .holder-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 6px;
      transition: all var(--transition-fast);
    }

    .holder-row:hover {
      background: var(--color-slate-50);
    }

    .holder-rank {
      width: 20px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-400);
    }

    .holder-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .holder-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .holder-dept {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .holder-count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .count-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-700);
    }

    .count-label {
      font-size: 10px;
      color: var(--color-slate-400);
    }

    /* Idle Assets */
    .idle-assets {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .idle-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: var(--color-slate-50);
      border-radius: 6px;
    }

    .idle-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .idle-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .idle-tag {
      font-size: 11px;
      color: var(--color-slate-500);
      font-family: monospace;
    }

    .idle-days {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .days-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-amber-600);
    }

    .days-label {
      font-size: 10px;
      color: var(--color-slate-400);
    }

    /* Warranty Stats */
    .warranty-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .warranty-stat, .maintenance-stat, .clearance-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 16px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .stat-value.green { color: var(--color-success-600); }
    .stat-value.amber { color: var(--color-warning-600); }
    .stat-value.red { color: var(--color-red-600); }
    .stat-value.blue { color: var(--color-primary-600); }
    .stat-value.gray { color: var(--color-slate-500); }

    .stat-label {
      font-size: 11px;
      color: var(--color-slate-500);
      margin-top: 4px;
    }

    /* Expiring List */
    .expiring-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .expiring-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: var(--color-slate-50);
      border-radius: 6px;
    }

    .expiring-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .expiring-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .expiring-tag {
      font-size: 11px;
      color: var(--color-slate-500);
      font-family: monospace;
    }

    .expiring-date {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .date-value {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .date-days {
      font-size: 10px;
      color: var(--color-slate-400);
    }

    /* Cost Chart */
    .cost-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cost-row {
      display: grid;
      grid-template-columns: 100px 1fr 80px;
      align-items: center;
      gap: 12px;
    }

    .cost-category {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .cost-bar {
      height: 6px;
      background: var(--color-slate-100);
      border-radius: 3px;
      overflow: hidden;
    }

    .cost-fill {
      height: 100%;
      background: var(--color-primary-500);
      border-radius: 3px;
    }

    .cost-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-700);
      text-align: right;
    }

    /* Maintenance Cost */
    .cost-breakdown {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cost-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .cost-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cost-type {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .cost-amount {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-slate-900);
    }

    /* Vendor List */
    .vendor-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .vendor-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: var(--color-slate-50);
      border-radius: 6px;
    }

    .vendor-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .vendor-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .vendor-jobs {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .vendor-rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .rating-stars {
      display: flex;
    }

    .rating-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-600);
    }

    .vendor-cost {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    /* Recovery Chart */
    .recovery-chart {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .recovery-donut {
      position: relative;
      width: 140px;
      height: 140px;
    }

    .recovery-donut svg {
      width: 100%;
      height: 100%;
    }

    /* Timeline Stats */
    .timeline-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .timeline-label {
      width: 100px;
      font-size: 12px;
      color: var(--color-slate-600);
    }

    .timeline-bar {
      flex: 1;
      height: 8px;
      background: var(--color-slate-100);
      border-radius: 4px;
      overflow: hidden;
    }

    .timeline-fill {
      height: 100%;
      background: var(--color-primary-500);
      border-radius: 4px;
    }

    .timeline-value {
      width: 60px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate-700);
      text-align: right;
    }

    /* Icons */
    .calendarIcon, .downloadIcon, .viewIcon {
      display: flex;
    }
  `]
})
export class ReportsComponent {
  private router: Router;

  readonly calendarIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  readonly downloadIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  readonly viewIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

  readonly selectedCategory = signal('health');

  readonly reportCategories = signal<ReportCategory[]>([
    { id: 'health', name: 'Asset Health', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', description: 'Condition and lifecycle', reportCount: 4 },
    { id: 'utilization', name: 'Utilization', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', description: 'Usage and assignments', reportCount: 3 },
    { id: 'warranty', name: 'Warranty', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', description: 'Coverage and expiry', reportCount: 3 },
    { id: 'maintenance', name: 'Maintenance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', description: 'Repairs and costs', reportCount: 4 },
    { id: 'clearance', name: 'Exit Clearance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>', description: 'Offboarding stats', reportCount: 3 }
  ]);

  readonly quickReports = signal<Report[]>([
    { id: 'QR-001', name: 'Monthly Summary', category: 'health', description: 'Overview of asset status', lastGenerated: '2026-06-01' },
    { id: 'QR-002', name: 'Warranty Expiry Report', category: 'warranty', description: 'Assets expiring this month', lastGenerated: '2026-06-03' },
    { id: 'QR-003', name: 'Utilization Analysis', category: 'utilization', description: 'Usage patterns', lastGenerated: '2026-05-28' },
    { id: 'QR-004', name: 'Maintenance Cost Report', category: 'maintenance', description: 'Quarterly breakdown', lastGenerated: '2026-05-25' }
  ]);

  readonly conditionByCategory = signal([
    { category: 'Laptops', good: 75, fair: 18, poor: 7, total: 86 },
    { category: 'Monitors', good: 82, fair: 14, poor: 4, total: 52 },
    { category: 'Phones', good: 88, fair: 9, poor: 3, total: 45 },
    { category: 'Accessories', good: 71, fair: 21, poor: 8, total: 38 },
    { category: 'Printers', good: 67, fair: 20, poor: 13, total: 15 }
  ]);

  readonly agingData = signal([
    { label: '0-1 yr', value: 86, percentage: 35 },
    { label: '1-2 yrs', value: 74, percentage: 30 },
    { label: '2-3 yrs', value: 49, percentage: 20 },
    { label: '3-5 yrs', value: 25, percentage: 10 },
    { label: '5+ yrs', value: 13, percentage: 5 }
  ]);

  readonly utilizationData = signal([
    { type: 'Laptops', rate: 85, assigned: 73, available: 13, color: 'green' },
    { type: 'Monitors', rate: 72, assigned: 37, available: 15, color: 'blue' },
    { type: 'Phones', rate: 91, assigned: 41, available: 4, color: 'green' },
    { type: 'Accessories', rate: 78, assigned: 30, available: 8, color: 'blue' },
    { type: 'Printers', rate: 60, assigned: 9, available: 6, color: 'amber' }
  ]);

  readonly topHolders = signal([
    { rank: 1, name: 'Priya Patel', department: 'Engineering', count: 5 },
    { rank: 2, name: 'Amit Singh', department: 'Marketing', count: 4 },
    { rank: 3, name: 'Deepak Kumar', department: 'Finance', count: 4 },
    { rank: 4, name: 'Sneha Gupta', department: 'Design', count: 3 },
    { rank: 5, name: 'Rahul Verma', department: 'Operations', count: 3 }
  ]);

  readonly idleAssets = signal([
    { name: 'Dell Latitude 7440', tag: 'AST-1023', idleDays: 45 },
    { name: 'HP EliteBook 840', tag: 'AST-1034', idleDays: 38 },
    { name: 'Dell UltraSharp 27"', tag: 'AST-1056', idleDays: 32 }
  ]);

  readonly expiringAssets = signal([
    { name: 'Dell Latitude 7440', tag: 'AST-1023', expires: '2026-06-12', daysLeft: 7 },
    { name: 'HP EliteBook 840', tag: 'AST-1034', expires: '2026-06-15', daysLeft: 10 },
    { name: 'MacBook Pro 14"', tag: 'AST-1045', expires: '2026-06-18', daysLeft: 13 },
    { name: 'Dell UltraSharp 27"', tag: 'AST-1056', expires: '2026-06-22', daysLeft: 17 },
    { name: 'iPhone 15 Pro', tag: 'AST-1067', expires: '2026-06-25', daysLeft: 20 }
  ]);

  readonly warrantyCostData = signal([
    { category: 'Laptops', cost: 185000, percentage: 58 },
    { category: 'Monitors', cost: 62000, percentage: 19 },
    { category: 'Phones', cost: 45000, percentage: 14 },
    { category: 'Accessories', cost: 28000, percentage: 9 }
  ]);

  readonly maintenanceCostByType = signal([
    { type: 'Keyboard Replacement', amount: 18500, percentage: 38, color: 'blue' as 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'violet' | 'cyan' | 'slate' },
    { type: 'Screen Repair', amount: 12500, percentage: 26, color: 'indigo' as 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'violet' | 'cyan' | 'slate' },
    { type: 'Battery Replacement', amount: 9800, percentage: 20, color: 'green' as 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'violet' | 'cyan' | 'slate' },
    { type: 'Other Repairs', amount: 7200, percentage: 16, color: 'slate' as 'blue' | 'green' | 'amber' | 'red' | 'indigo' | 'violet' | 'cyan' | 'slate' }
  ]);

  readonly vendorPerformance = signal([
    { name: 'Dell Care', jobs: 15, rating: 4.8, cost: 28000 },
    { name: 'Apple Support', jobs: 8, rating: 4.5, cost: 12000 },
    { name: 'TechServe Pro', jobs: 12, rating: 4.2, cost: 8500 }
  ]);

  constructor(router: Router) {
    this.router = router;
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  viewReport(report: Report): void {
    // Navigate to report detail
  }
}