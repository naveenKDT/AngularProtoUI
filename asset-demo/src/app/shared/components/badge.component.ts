import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange' | 'gray';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge badge-' + variant()">
      <ng-content />
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--spacing-1) var(--spacing-3);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-full);
      white-space: nowrap;
    }

    .badge-success {
      background: var(--success-light);
      color: var(--success);
    }

    .badge-warning {
      background: var(--warning-light);
      color: var(--warning);
    }

    .badge-danger {
      background: var(--danger-light);
      color: var(--danger);
    }

    .badge-info {
      background: var(--info-light);
      color: var(--info);
    }

    .badge-purple {
      background: var(--purple-light);
      color: var(--purple);
    }

    .badge-orange {
      background: var(--orange-light);
      color: var(--orange);
    }

    .badge-gray {
      background: rgba(100, 116, 139, 0.1);
      color: var(--text-secondary);
    }
  `]
})
export class BadgeComponent {
  variant = input<BadgeVariant>('gray');
}