import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PageHeaderComponent,
  BreadcrumbComponent,
  StatCardComponent,
  BadgeComponent,
  CardComponent,
  InputComponent
} from '../../../../shared/components';

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
    CurrencyPipe,
    TitleCasePipe,
    PageHeaderComponent,
    BreadcrumbComponent,
    StatCardComponent,
    BadgeComponent,
    CardComponent,
    InputComponent
  ],
  template: `
    <div class="assets-page">
      <app-breadcrumb [items]="breadcrumbs" />
      
      <app-page-header
        title="Asset Inventory"
        description="Manage and track all company assets"
        [icon]="pageIcon"
        iconBg="#EFF6FF"
      >
        <div slot="actions">
          <button class="btn-primary" (click)="goToAddAsset()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Asset
          </button>
        </div>
      </app-page-header>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <app-stat-card
          [icon]="totalIcon"
          iconBg="#EFF6FF"
          [value]="totalAssets()"
          label="Total Assets"
          change="+12 this month"
          changeType="positive"
        />
        <app-stat-card
          [icon]="availableIcon"
          iconBg="#DCFCE7"
          [value]="availableAssets()"
          label="Available"
          change="5 ready to assign"
          changeType="positive"
        />
        <app-stat-card
          [icon]="assignedIcon"
          iconBg="#F3E8FF"
          [value]="assignedAssets()"
          label="Assigned"
          change="+8 this month"
          changeType="positive"
        />
        <app-stat-card
          [icon]="maintenanceIcon"
          iconBg="#FEF3C7"
          [value]="maintenanceAssets()"
          label="Maintenance"
          change="2 in service"
          changeType="negative"
        />
        <app-stat-card
          [icon]="valueIcon"
          iconBg="#CFFAFE"
          [value]="totalValueFormatted()"
          label="Total Value"
          change="+15% from last year"
          changeType="positive"
        />
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Asset List Card -->
        <app-card title="All Assets" [subtitle]="filteredAssets().length + ' assets found'" [noPadding]="true">
          <!-- Search and Filters -->
          <div class="card-toolbar">
            <div class="search-box">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                class="search-input" 
                placeholder="Search by tag, name, serial..."
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
              />
            </div>
            <div class="filter-controls">
              <select class="filter-select" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
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
          </div>

          <!-- Assets Table -->
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Tag</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Location</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (asset of filteredAssets(); track asset.id) {
                  <tr>
                    <td>
                      <div class="asset-cell">
                        <div class="asset-icon" [ngClass]="'cat-' + asset.category.toLowerCase()">
                          <span [innerHTML]="getCategoryIcon(asset.category)"></span>
                        </div>
                        <div class="asset-info">
                          <span class="asset-name">{{ asset.name }}</span>
                          <span class="asset-model">{{ asset.brand }} {{ asset.model }}</span>
                        </div>
                      </div>
                    </td>
                    <td><span class="tag-badge">{{ asset.tag }}</span></td>
                    <td>{{ asset.category }}</td>
                    <td>
                      <app-badge [variant]="getStatusVariant(asset.status)">{{ asset.status | titlecase }}</app-badge>
                    </td>
                    <td>
                      @if (asset.assignedToName) {
                        <div class="assignee-cell">
                          <div class="assignee-avatar">{{ asset.assignedToName.charAt(0) }}</div>
                          <span>{{ asset.assignedToName }}</span>
                        </div>
                      } @else {
                        <span class="unassigned">Unassigned</span>
                      }
                    </td>
                    <td>{{ asset.location }}</td>
                    <td>{{ asset.purchaseCost | currency:'USD':'symbol':'1.0-0' }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn view" title="View Details" (click)="viewAsset(asset.id)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button class="action-btn edit" title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button class="action-btn delete" title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .assets-page {
      animation: fadeIn 200ms ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .card-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-5) var(--spacing-6);
      border-bottom: 1px solid var(--bg-border);
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: 0 var(--spacing-4);
      height: 44px;
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      flex: 1;
      max-width: 400px;
    }

    .search-icon {
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: transparent;

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .filter-controls {
      display: flex;
      gap: var(--spacing-3);
    }

    .filter-select {
      height: 44px;
      padding: 0 var(--spacing-4);
      background: var(--bg-card);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      cursor: pointer;
      min-width: 150px;

      &:focus {
        outline: none;
        border-color: var(--primary-blue);
      }
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: var(--spacing-4) var(--spacing-5);
        text-align: left;
        border-bottom: 1px solid var(--bg-border);
      }

      th {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: var(--bg-main);
      }

      td {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
      }

      tbody tr {
        transition: background var(--transition-fast);

        &:hover {
          background: rgba(59, 130, 246, 0.03);
        }
      }
    }

    .asset-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .asset-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      :deep(svg) {
        width: 22px;
        height: 22px;
      }

      &.cat-laptop { background: #EFF6FF; color: #3B82F6; }
      &.cat-desktop { background: #F3E8FF; color: #8B5CF6; }
      &.cat-monitor { background: #DCFCE7; color: #22C55E; }
      &.cat-phone { background: #FEF3C7; color: #F59E0B; }
      &.cat-accessory { background: #CFFAFE; color: #06B6D4; }
      &.cat-printer { background: #FEE2E2; color: #EF4444; }
    }

    .asset-info {
      display: flex;
      flex-direction: column;
    }

    .asset-name {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .asset-model {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .tag-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      background: var(--bg-main);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .assignee-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .assignee-avatar {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
    }

    .unassigned {
      color: var(--text-secondary);
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-1);
    }

    .action-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      &.view {
        color: var(--info);
        &:hover { background: var(--info-light); }
      }

      &.edit {
        color: var(--primary-blue);
        &:hover { background: rgba(59, 130, 246, 0.1); }
      }

      &.delete {
        color: var(--danger);
        &:hover { background: var(--danger-light); }
      }
    }

    /* Modal Form Styles */
    .add-asset-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-5);
    }

    .form-row {
      display: grid;
      gap: var(--spacing-5);

      &.two-col {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .category-options {
      display: flex;
      gap: var(--spacing-3);
      flex-wrap: wrap;
    }

    .category-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      input {
        display: none;
      }

      &:hover {
        border-color: var(--primary-blue);
      }

      &.selected {
        background: rgba(59, 130, 246, 0.1);
        border-color: var(--primary-blue);
        color: var(--primary-blue);
      }
    }

    .category-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(svg) {
        width: 18px;
        height: 18px;
      }
    }

    .category-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 48px;
      padding: 0 var(--spacing-6);
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-hover) 100%);
      color: white;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      }
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      height: 48px;
      padding: 0 var(--spacing-6);
      background: var(--bg-card);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        background: var(--bg-main);
        border-color: var(--text-secondary);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1280px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .filter-controls {
        width: 100%;
      }

      .filter-select {
        flex: 1;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .card-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }
    }
  `]
})
export class AssetsComponent {
  private router: Router;

  breadcrumbs = [
    { label: 'Home', route: '/' },
    { label: 'Assets' }
  ];

  pageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';

  totalIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
  availableIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
  assignedIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  maintenanceIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
  valueIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';

  readonly categories = [
    { value: 'Laptop', label: 'Laptop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Desktop', label: 'Desktop', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Monitor', label: 'Monitor', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { value: 'Phone', label: 'Phone', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
    { value: 'Accessory', label: 'Accessory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
    { value: 'Printer', label: 'Printer', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>' }
  ];

  readonly searchQuery = signal('');
  readonly statusFilter = signal('');
  readonly categoryFilter = signal('');

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

    return result;
  });

  readonly totalAssets = computed(() => this.assets().length);
  readonly availableAssets = computed(() => this.assets().filter(a => a.status === 'available').length);
  readonly assignedAssets = computed(() => this.assets().filter(a => a.status === 'assigned').length);
  readonly maintenanceAssets = computed(() => this.assets().filter(a => a.status === 'maintenance').length);
  readonly totalValue = computed(() => this.assets().reduce((sum, a) => sum + a.purchaseCost, 0));
  readonly totalValueFormatted = computed(() => '$' + this.totalValue().toLocaleString());

  constructor(router: Router) {
    this.router = router;
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

  getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'gray' {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
      'available': 'success',
      'assigned': 'info',
      'maintenance': 'warning',
      'retired': 'gray',
      'lost': 'danger'
    };
    return variants[status] || 'gray';
  }

  viewAsset(assetId: string): void {
    this.router.navigate(['/assets', assetId]);
  }

  goToAddAsset(): void {
    this.router.navigate(['/assets/new']);
  }
}