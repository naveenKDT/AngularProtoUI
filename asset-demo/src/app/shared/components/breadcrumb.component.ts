import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="breadcrumb">
      @for (item of items(); track item.label; let last = $last) {
        @if (!last) {
          <a class="breadcrumb-link" [href]="item.route || '#'">{{ item.label }}</a>
          <span class="breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        } @else {
          <span class="breadcrumb-current">{{ item.label }}</span>
        }
      }
    </nav>
  `,
  styles: [`
        .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-size: var(--font-size-sm);
    }

    .breadcrumb-link {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--primary-blue);
      }
    }

    .breadcrumb-separator {
      color: var(--text-secondary);
      display: flex;
      align-items: center;
    }

    .breadcrumb-current {
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
    }
  `]
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}