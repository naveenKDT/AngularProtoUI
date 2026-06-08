import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <!-- Search & Filters -->
      <div class="table-header">
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search..."
            [value]="searchTerm()"
            (input)="onSearch($event)"
          />
        </div>
        <div class="table-actions">
          <ng-content select="[slot=actions]" />
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              @for (col of columns(); track col.key) {
                <th 
                  [style.width]="col.width || 'auto'"
                  [class.sortable]="col.sortable"
                  (click)="col.sortable && onSort(col.key)"
                >
                  <div class="th-content">
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <span class="sort-icon" [class.active]="sortKey() === col.key">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M7 15l5 5 5-5"/>
                          <path d="M7 9l5-5 5 5"/>
                        </svg>
                      </span>
                    }
                  </div>
                </th>
              }
              @if (showActions()) {
                <th class="actions-header">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of paginatedData(); track $index) {
              <tr (click)="rowClick.emit(row)">
                @for (col of columns(); track col.key) {
                  <td>
                    <ng-content [select]="'[slot=cell-' + col.key + ']'" />
                    @if (hasSlot('cell-' + col.key)) {
                      <ng-content [select]="'[slot=cell-' + col.key + ']'" />
                    } @else {
                      {{ row[col.key] }}
                    }
                  </td>
                }
                @if (showActions()) {
                  <td class="actions-cell">
                    <div class="action-buttons">
                      @if (showViewAction()) {
                        <button class="action-btn view" title="View" (click)="view.emit(row); $event.stopPropagation()">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                      }
                      @if (showEditAction()) {
                        <button class="action-btn edit" title="Edit" (click)="edit.emit(row); $event.stopPropagation()">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      }
                      @if (showDeleteAction()) {
                        <button class="action-btn delete" title="Delete" (click)="delete.emit(row); $event.stopPropagation()">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      }
                    </div>
                  </td>
                }
              </tr>
            } @empty {
              <tr class="empty-row">
                <td [attr.colspan]="columns().length + (showActions() ? 1 : 0)">
                  <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                      <polyline points="13 2 13 9 20 9"/>
                    </svg>
                    <p>No data available</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (showPagination() && totalPages() > 1) {
        <div class="table-pagination">
          <span class="pagination-info">
            Showing {{ startIndex() + 1 }} to {{ endIndex() }} of {{ data().length }} entries
          </span>
          <div class="pagination-controls">
            <button 
              class="pagination-btn" 
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            @for (page of visiblePages(); track page) {
              @if (page === '...') {
                <span class="pagination-ellipsis">...</span>
              } @else {
                <button 
                  class="pagination-btn"
                  [class.active]="page === currentPage()"
                  (click)="goToPage(+page)"
                >
                  {{ page }}
                </button>
              }
            }
            <button 
              class="pagination-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
        .table-container {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-6) var(--spacing-6);
      border-bottom: 1px solid var(--bg-border);
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      background: var(--bg-main);
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-lg);
      padding: 0 var(--spacing-4);
      height: 44px;
      min-width: 280px;
      transition: all var(--transition-normal);

      &:focus-within {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(var(--primary-blue), 0.1);
      }
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
      background: transparent;

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    .table-actions {
      display: flex;
      gap: var(--spacing-3);
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

      th, td {
        padding: var(--spacing-4) var(--spacing-5);
        text-align: left;
      }

      th {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--text-secondary);
        background: rgba(var(--bg-border), 0.3);
        border-bottom: 1px solid var(--bg-border);
        white-space: nowrap;

        &.sortable {
          cursor: pointer;
          user-select: none;

          &:hover {
            color: var(--text-primary);
          }
        }

        &.actions-header {
          text-align: right;
          width: 140px;
        }
      }

      td {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        border-bottom: 1px solid var(--bg-border);

        &.actions-cell {
          text-align: right;
        }
      }

      tbody tr {
        height: 88px;
        transition: background var(--transition-fast);
        cursor: pointer;

        &:hover {
          background: rgba(var(--primary-blue), 0.03);
        }

        &:last-child td {
          border-bottom: none;
        }
      }
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .sort-icon {
      opacity: 0.3;
      transition: opacity var(--transition-fast);

      &.active {
        opacity: 1;
        color: var(--primary-blue);
      }
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-2);
    }

    .action-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);

      &:hover {
        transform: scale(1.05);
      }

      &.view {
        background: rgba(var(--purple), 0.1);
        color: var(--purple);
      }

      &.edit {
        background: rgba(var(--primary-blue), 0.1);
        color: var(--primary-blue);
      }

      &.delete {
        background: rgba(var(--danger), 0.1);
        color: var(--danger);
      }
    }

    .empty-row td {
      padding: var(--spacing-1)2;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-4);
      color: var(--text-secondary);

      p {
        margin: 0;
      }
    }

    .table-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4) var(--spacing-6);
      border-top: 1px solid var(--bg-border);
      flex-wrap: wrap;
      gap: var(--spacing-4);
    }

    .pagination-info {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }

    .pagination-btn {
      min-width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--bg-border);
      border-radius: var(--radius-md);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover:not(:disabled) {
        border-color: var(--primary-blue);
        color: var(--primary-blue);
      }

      &.active {
        background: var(--primary-blue);
        border-color: var(--primary-blue);
        color: white;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .pagination-ellipsis {
      padding: 0 var(--spacing-2);
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        min-width: 100%;
      }

      .data-table {
        font-size: var(--font-size-xs);

        th, td {
          padding: var(--spacing-3);
        }
      }
    }
  `]
})
export class DataTableComponent<T extends Record<string, any>> {
  columns = input<TableColumn[]>([]);
  data = input<T[]>([]);
  showActions = input(true);
  showViewAction = input(true);
  showEditAction = input(true);
  showDeleteAction = input(true);
  showPagination = input(true);
  pageSize = input(10);

  searchTerm = signal('');
  sortKey = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);

  rowClick = output<T>();
  view = output<T>();
  edit = output<T>();
  delete = output<T>();

  filteredData(): T[] {
    let result = [...this.data()];
    const search = this.searchTerm().toLowerCase();
    
    if (search) {
      result = result.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(search)
        )
      );
    }

    if (this.sortKey()) {
      result.sort((a, b) => {
        const aVal = a[this.sortKey()];
        const bVal = b[this.sortKey()];
        const comparison = String(aVal).localeCompare(String(bVal));
        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }

  totalPages(): number {
    return Math.ceil(this.filteredData().length / this.pageSize());
  }

  paginatedData(): T[] {
    const filtered = this.filteredData();
    const start = (this.currentPage() - 1) * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  }

  startIndex(): number {
    return (this.currentPage() - 1) * this.pageSize();
  }

  endIndex(): number {
    return Math.min(this.startIndex() + this.pageSize(), this.filteredData().length);
  }

  visiblePages(): (number | string)[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }

    return pages;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onSort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  hasSlot(name: string): boolean {
    return false;
  }
}