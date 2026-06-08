import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon" [style.background]="iconBg()">
        <span [innerHTML]="icon()"></span>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ value() }}</span>
        <span class="stat-label">{{ label() }}</span>
        @if (change()) {
          <span class="stat-change" [class.positive]="changeType() === 'positive'" [class.negative]="changeType() === 'negative'">
            @if (changeType() === 'positive') {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            } @else {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            }
            {{ change() }}
          </span>
        }
      </div>
    </div>
  `,
  styles: [`
        .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      padding: 28px;
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-5);
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-card)-hover;
        transform: translateY(-4px);
      }
    }

    .stat-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      :deep(svg) {
        width: 32px;
        height: 32px;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .stat-value {
      font-size: 32px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .stat-change {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-1);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      margin-top: var(--spacing-2);

      &.positive {
        color: var(--success);
      }

      &.negative {
        color: var(--danger);
      }
    }
  `]
})
export class StatCardComponent {
  icon = input<string>('');
  iconBg = input<string>('#EFF6FF');
  value = input<string | number>('');
  label = input<string>('');
  change = input<string>('');
  changeType = input<'positive' | 'negative'>('positive');
}