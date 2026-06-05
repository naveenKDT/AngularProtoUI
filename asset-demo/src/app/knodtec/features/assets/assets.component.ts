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
  SearchComponent,
  SelectComponent,
  InputComponent
} from '../../shared/components/ui/ui-components';

interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
  assignedTo?: string;
  assignedToName?: string;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyEnd: string;
  warrantyStatus: string;
}

@Component({
  selector: 'knodtec-assets',
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
    SearchComponent,
    SelectComponent,
    InputComponent
  ],
  template: `
    <div class="assets-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Asset Inventory</h1>
          <p class="page-subtitle">Manage and track all company assets</p>
        </div>
        <div class="header-actions">
          <knod-button variant="outline" [icon]="exportIcon">Export</knod-button>
          <knod-button variant="primary" [icon]="plusIcon">Add Asset</knod-button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ totalAssets() }}</span>
          <span class="stat-label">Total Assets</span>
          <div class="stat-indicator blue"></div>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ availableAssets() }}</span>
          <span class="stat-label">Available</span>
          <div class="stat-indicator green"></div>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ assignedAssets() }}</span>
          <span class="stat-label">Assigned</span>
          <div class="stat-indicator indigo"></div>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ maintenanceAssets() }}</span>
          <span class="stat-label">Maintenance</span>
          <div class="stat-indicator amber"></div>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalValue() | currency:'USD':'symbol':'1.0-0' }}</span>
          <span class="stat-label">Total Value</span>
          <div class="stat-indicator violet"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout">
        <!-- Filters Panel -->
        <div class="filters-panel">
          <knod-card title="Filters" subtitle="Refine your search">
            <div class="filter-section">
              <label class="filter-label">Search</label>
              <knod-search 
                placeholder="Tag, name, serial..."
                [value]="searchQuery()"
                (valueChange)="searchQuery.set($event)">
              </knod-search>
            </div>

            <div class="filter-section">
              <label class="filter-label">Status</label>
              <select class="filter-select" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div class="filter-section">
              <label class="filter-label">Category</label>
              <select class="filter-select" [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)">
                <option value="">All Categories</option>
                <option value="Laptop">Laptops</option>
                <option value="Monitor">Monitors</option>
                <option value="Phone">Phones</option>
                <option value="Accessory">Accessories</option>
                <option value="Printer">Printers</option>
                <option value="Desktop">Desktops</option>
              </select>
            </div>

            <div class="filter-section">
              <label class="filter-label">Location</label>
              <select class="filter-select" [ngModel]="locationFilter()" (ngModelChange)="locationFilter.set($event)">
                <option value="">All Locations</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div class="filter-section">
              <label class="filter-label">Warranty</label>
              <select class="filter-select" [ngModel]="warrantyFilter()" (ngModelChange)="warrantyFilter.set($event)">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <knod-button variant="outline" class="reset-btn" (click)="resetFilters()">Reset Filters</knod-button>
          </knod-card>

          <!-- Quick Filters -->
          <knod-card title="Quick Filters">
            <div class="quick-filters">
              <button class="quick-filter-btn" (click)="applyQuickFilter('expiring_warranty')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Expiring Warranty
              </button>
              <button class="quick-filter-btn" (click)="applyQuickFilter('recently_added')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Recently Added
              </button>
              <button class="quick-filter-btn" (click)="applyQuickFilter('high_value')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                High Value (>$100K)
              </button>
              <button class="quick-filter-btn" (click)="applyQuickFilter('unassigned')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Unassigned
              </button>
            </div>
          </knod-card>
        </div>

        <!-- Asset List -->
        <div class="asset-list-panel">
          <div class="list-header">
            <div class="list-info">
              <span class="result-count">{{ filteredAssets().length }} assets found</span>
            </div>
            <div class="list-actions">
              <div class="view-toggle">
                <button class="view-btn" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button class="view-btn" [class.active]="viewMode() === 'table'" (click)="viewMode.set('table')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          @if (viewMode() === 'grid') {
            <div class="asset-grid">
              @for (asset of filteredAssets(); track asset.id) {
                <div class="asset-card" (click)="viewAsset(asset.id)">
                  <div class="asset-card-header">
                    <div class="asset-icon" [ngClass]="'cat-' + asset.category.toLowerCase()">
                      <span [innerHTML]="getCategoryIcon(asset.category)"></span>
                    </div>
                    <knod-badge [color]="getStatusColor(asset.status)">{{ asset.status | titlecase }}</knod-badge>
                  </div>
                  
                  <h3 class="asset-name">{{ asset.name }}</h3>
                  <p class="asset-tag">{{ asset.tag }}</p>
                  
                  <div class="asset-details">
                    <div class="detail-row">
                      <span class="detail-label">Brand/Model</span>
                      <span class="detail-value">{{ asset.brand }} {{ asset.model }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Location</span>
                      <span class="detail-value">{{ asset.location }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Warranty</span>
                      <span class="detail-value" [class.warning]="asset.warrantyStatus === 'expiring'">
                        {{ asset.warrantyEnd | date:'mediumDate' }}
                        <knod-badge [color]="getWarrantyColor(asset.warrantyStatus)" size="sm">{{ asset.warrantyStatus }}</knod-badge>
                      </span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Value</span>
                      <span class="detail-value">{{ asset.purchaseCost | currency:'USD':'symbol':'1.0-0' }}</span>
                    </div>
                  </div>

                  @if (asset.assignedToName) {
                    <div class="asset-assignee">
                      <knod-avatar [name]="asset.assignedToName" size="sm"></knod-avatar>
                      <span class="assignee-name">{{ asset.assignedToName }}</span>
                    </div>
                  } @else {
                    <div class="asset-unassigned">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="16"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                      </svg>
                      <span>Unassigned</span>
                    </div>
                  }

                  <div class="asset-actions">
                    <knod-button variant="ghost" size="sm" [icon]="assignIcon" (click)="assignAsset($event, asset)">Assign</knod-button>
                    <knod-button variant="ghost" size="sm" (click)="viewAsset(asset.id)">Details</knod-button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="asset-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Tag</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Location</th>
                    <th>Warranty</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (asset of filteredAssets(); track asset.id) {
                    <tr (click)="viewAsset(asset.id)">
                      <td>
                        <div class="asset-cell">
                          <div class="asset-icon-sm" [ngClass]="'cat-' + asset.category.toLowerCase()">
                            <span [innerHTML]="getCategoryIcon(asset.category)"></span>
                          </div>
                          <div class="asset-cell-info">
                            <span class="asset-cell-name">{{ asset.name }}</span>
                            <span class="asset-cell-model">{{ asset.brand }} {{ asset.model }}</span>
                          </div>
                        </div>
                      </td>
                      <td><span class="asset-tag">{{ asset.tag }}</span></td>
                      <td>{{ asset.category }}</td>
                      <td>
                        <knod-badge [color]="getStatusColor(asset.status)">{{ asset.status | titlecase }}</knod-badge>
                      </td>
                      <td>
                        @if (asset.assignedToName) {
                          <div class="assignee-cell">
                            <knod-avatar [name]="asset.assignedToName" size="sm"></knod-avatar>
                            <span>{{ asset.assignedToName }}</span>
                          </div>
                        } @else {
                          <span class="unassigned">—</span>
                        }
                      </td>
                      <td>{{ asset.location }}</td>
                      <td>
                        <span [class.warning]="asset.warrantyStatus === 'expiring'">
                          {{ asset.warrantyEnd | date:'short' }}
                        </span>
                      </td>
                      <td>{{ asset.purchaseCost | currency:'USD':'symbol':'1.0-0' }}</td>
                      <td>
                        <div class="action-cell">
                          <knod-button variant="ghost" size="sm" (click)="assignAsset($event, asset)">Assign</knod-button>
                          <knod-button variant="ghost" size="sm">Edit</knod-button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assets-page {
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
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
      overflow: hidden;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-slate-900);
    }

    .stat-label {
      font-size: 12px;
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
    .stat-indicator.green { background: var(--color-success-500); }
    .stat-indicator.indigo { background: var(--color-indigo-500); }
    .stat-indicator.amber { background: var(--color-warning-500); }
    .stat-indicator.violet { background: var(--color-violet-500); }

    /* Content Layout */
    .content-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
    }

    /* Filters Panel */
    .filters-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .filter-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-600);
    }

    .filter-select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--color-slate-200);
      border-radius: 8px;
      font-size: 13px;
      background: white;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--color-primary-500);
    }

    .reset-btn {
      width: 100%;
    }

    /* Quick Filters */
    .quick-filters {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .quick-filter-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-600);
      transition: all var(--transition-fast);
      text-align: left;
    }

    .quick-filter-btn:hover {
      background: var(--color-slate-50);
      color: var(--color-slate-900);
    }

    .quick-filter-btn svg {
      color: var(--color-slate-400);
    }

    /* Asset List Panel */
    .asset-list-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-slate-100);
    }

    .result-count {
      font-size: 13px;
      color: var(--color-slate-500);
    }

    .view-toggle {
      display: flex;
      background: var(--color-slate-100);
      border-radius: 6px;
      padding: 2px;
    }

    .view-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: var(--color-slate-500);
      transition: all var(--transition-fast);
    }

    .view-btn:hover {
      color: var(--color-slate-700);
    }

    .view-btn.active {
      background: white;
      color: var(--color-slate-900);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* Asset Grid */
    .asset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 20px;
    }

    .asset-card {
      background: white;
      border: 1px solid var(--color-slate-200);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .asset-card:hover {
      border-color: var(--color-primary-300);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .asset-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .asset-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .asset-icon.cat-laptop { background: var(--color-primary-100); color: var(--color-primary-600); }
    .asset-icon.cat-monitor { background: var(--color-indigo-100); color: var(--color-indigo-600); }
    .asset-icon.cat-phone { background: var(--color-violet-100); color: var(--color-violet-600); }
    .asset-icon.cat-accessory { background: var(--color-cyan-100); color: var(--color-cyan-600); }
    .asset-icon.cat-printer { background: var(--color-success-100); color: var(--color-success-600); }
    .asset-icon.cat-desktop { background: var(--color-amber-100); color: var(--color-amber-600); }

    .asset-icon :deep(svg) {
      width: 20px;
      height: 20px;
    }

    .asset-name {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-slate-900);
      margin: 0;
    }

    .asset-tag {
      font-size: 12px;
      color: var(--color-slate-500);
      margin: 0;
      font-family: monospace;
    }

    .asset-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: var(--color-slate-50);
      border-radius: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .detail-value {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-slate-700);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .detail-value.warning {
      color: var(--color-amber-600);
    }

    .asset-assignee {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }

    .assignee-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-slate-700);
    }

    .asset-unassigned {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--color-slate-400);
      padding: 8px 0;
    }

    .asset-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid var(--color-slate-100);
    }

    /* Asset Table */
    .asset-table {
      overflow-x: auto;
    }

    .asset-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .asset-table th {
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

    .asset-table td {
      padding: 12px 16px;
      font-size: 13px;
      color: var(--color-slate-700);
      border-bottom: 1px solid var(--color-slate-100);
    }

    .asset-table tr {
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .asset-table tr:hover {
      background: var(--color-slate-50);
    }

    .asset-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .asset-icon-sm {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .asset-icon-sm.cat-laptop { background: var(--color-primary-100); color: var(--color-primary-600); }
    .asset-icon-sm.cat-monitor { background: var(--color-indigo-100); color: var(--color-indigo-600); }
    .asset-icon-sm.cat-phone { background: var(--color-violet-100); color: var(--color-violet-600); }
    .asset-icon-sm.cat-accessory { background: var(--color-cyan-100); color: var(--color-cyan-600); }
    .asset-icon-sm.cat-printer { background: var(--color-success-100); color: var(--color-success-600); }

    .asset-icon-sm :deep(svg) {
      width: 16px;
      height: 16px;
    }

    .asset-cell-info {
      display: flex;
      flex-direction: column;
    }

    .asset-cell-name {
      font-weight: 500;
      color: var(--color-slate-800);
    }

    .asset-cell-model {
      font-size: 11px;
      color: var(--color-slate-500);
    }

    .assignee-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .unassigned {
      color: var(--color-slate-400);
    }

    .warning {
      color: var(--color-amber-600);
    }

    .action-cell {
      display: flex;
      gap: 4px;
    }

    /* Icons */
    .exportIcon, .plusIcon, .assignIcon {
      display: flex;
    }
  `]
})
export class AssetsComponent {
  private router: Router;

  readonly exportIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  readonly plusIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  readonly assignIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  readonly searchQuery = signal('');
  readonly statusFilter = signal('');
  readonly categoryFilter = signal('');
  readonly locationFilter = signal('');
  readonly warrantyFilter = signal('');
  readonly viewMode = signal<'grid' | 'table'>('grid');

  readonly assets = signal<Asset[]>([
    { id: 'AST-1045', tag: 'AST-1045', name: 'MacBook Pro 14" M3', category: 'Laptop', brand: 'Apple', model: 'MacBook Pro 14"', serialNumber: 'C02X1234ABCD', status: 'assigned', assignedTo: 'EMP-2007', assignedToName: 'Nisha Sharma', location: 'Bangalore', purchaseDate: '2025-03-15', purchaseCost: 195000, warrantyEnd: '2028-03-14', warrantyStatus: 'active' },
    { id: 'AST-1056', tag: 'AST-1056', name: 'Dell UltraSharp U2723QE', category: 'Monitor', brand: 'Dell', model: 'U2723QE', serialNumber: 'DELL-U27-1234', status: 'assigned', assignedTo: 'EMP-2007', assignedToName: 'Nisha Sharma', location: 'Bangalore', purchaseDate: '2025-03-15', purchaseCost: 65000, warrantyEnd: '2027-08-20', warrantyStatus: 'active' },
    { id: 'AST-1067', tag: 'AST-1067', name: 'iPhone 15 Pro', category: 'Phone', brand: 'Apple', model: 'iPhone 15 Pro', serialNumber: 'IP15P-123456', status: 'assigned', assignedTo: 'EMP-2008', assignedToName: 'Priya Patel', location: 'Bangalore', purchaseDate: '2025-06-01', purchaseCost: 120000, warrantyEnd: '2026-06-01', warrantyStatus: 'expiring' },
    { id: 'AST-1078', tag: 'AST-1078', name: 'Magic Keyboard', category: 'Accessory', brand: 'Apple', model: 'Magic Keyboard', serialNumber: 'MK-1234', status: 'available', location: 'Bangalore', purchaseDate: '2025-03-15', purchaseCost: 15000, warrantyEnd: '2026-12-31', warrantyStatus: 'active' },
    { id: 'AST-1023', tag: 'AST-1023', name: 'Dell Latitude 7440', category: 'Laptop', brand: 'Dell', model: 'Latitude 7440', serialNumber: 'DL-7440-ABCD', status: 'available', location: 'Bangalore', purchaseDate: '2024-06-15', purchaseCost: 96500, warrantyEnd: '2026-06-12', warrantyStatus: 'expiring' },
    { id: 'AST-1034', tag: 'AST-1034', name: 'HP EliteBook 840', category: 'Laptop', brand: 'HP', model: 'EliteBook 840', serialNumber: 'HP-840-ABCD', status: 'maintenance', location: 'IT Support Bay', purchaseDate: '2024-01-10', purchaseCost: 89000, warrantyEnd: '2026-06-15', warrantyStatus: 'expiring' },
    { id: 'AST-1089', tag: 'AST-1089', name: 'iMac 24"', category: 'Desktop', brand: 'Apple', model: 'iMac 24"', serialNumber: 'IMAC24-1234', status: 'assigned', assignedTo: 'EMP-2009', assignedToName: 'Amit Singh', location: 'Mumbai', purchaseDate: '2025-02-20', purchaseCost: 145000, warrantyEnd: '2028-02-19', warrantyStatus: 'active' },
    { id: 'AST-1090', tag: 'AST-1090', name: 'HP LaserJet Pro', category: 'Printer', brand: 'HP', model: 'LaserJet Pro', serialNumber: 'HP-LJ-1234', status: 'available', location: 'Delhi', purchaseDate: '2024-08-05', purchaseCost: 35000, warrantyEnd: '2026-08-04', warrantyStatus: 'active' }
  ]);

  readonly filteredAssets = computed(() => {
    let result = this.assets();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const category = this.categoryFilter();
    const location = this.locationFilter();
    const warranty = this.warrantyFilter();

    if (query) {
      result = result.filter(a => 
        a.tag.toLowerCase().includes(query) ||
        a.name.toLowerCase().includes(query) ||
        a.serialNumber.toLowerCase().includes(query) ||
        (a.assignedToName?.toLowerCase().includes(query) ?? false)
      );
    }

    if (status) {
      result = result.filter(a => a.status === status);
    }

    if (category) {
      result = result.filter(a => a.category === category);
    }

    if (location) {
      result = result.filter(a => a.location === location);
    }

    if (warranty) {
      result = result.filter(a => a.warrantyStatus === warranty);
    }

    return result;
  });

  readonly totalAssets = computed(() => this.assets().length);
  readonly availableAssets = computed(() => this.assets().filter(a => a.status === 'available').length);
  readonly assignedAssets = computed(() => this.assets().filter(a => a.status === 'assigned').length);
  readonly maintenanceAssets = computed(() => this.assets().filter(a => a.status === 'maintenance').length);
  readonly totalValue = computed(() => this.assets().reduce((sum, a) => sum + a.purchaseCost, 0));

  constructor(router: Router) {
    this.router = router;
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');
    this.categoryFilter.set('');
    this.locationFilter.set('');
    this.warrantyFilter.set('');
  }

  applyQuickFilter(filter: string): void {
    if (filter === 'expiring_warranty') {
      this.warrantyFilter.set('expiring');
    } else if (filter === 'unassigned') {
      this.statusFilter.set('available');
    }
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Laptop': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Monitor': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      'Phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      'Accessory': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      'Printer': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
      'Desktop': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    };
    return icons[category] || icons['Laptop'];
  }

  getStatusColor(status: string): 'green' | 'blue' | 'amber' | 'red' | 'slate' {
    const colors: Record<string, 'green' | 'blue' | 'amber' | 'red' | 'slate'> = {
      'available': 'green',
      'assigned': 'blue',
      'maintenance': 'amber',
      'retired': 'slate',
      'lost': 'red'
    };
    return colors[status] || 'slate';
  }

  getWarrantyColor(status: string): 'green' | 'amber' | 'red' {
    const colors: Record<string, 'green' | 'amber' | 'red'> = {
      'active': 'green',
      'expiring': 'amber',
      'expired': 'red'
    };
    return colors[status] || 'green';
  }

  viewAsset(assetId: string): void {
    this.router.navigate(['/assets', assetId]);
  }

  assignAsset(event: Event, asset: Asset): void {
    event.stopPropagation();
    // Open assign dialog
  }
}