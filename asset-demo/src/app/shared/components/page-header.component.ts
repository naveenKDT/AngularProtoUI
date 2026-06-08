import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="header-left">
        @if (icon()) {
          <div class="page-icon" [style.background]="iconBg()">
            <span [innerHTML]="icon()"></span>
          </div>
        }
        <div class="header-content">
          <h1 class="page-title">{{ title() }}</h1>
          @if (description()) {
            <p class="page-description">{{ description() }}</p>
          }
        </div>
      </div>
      <div class="header-right">
        <ng-content select="[slot=actions]" />
      </div>
    </div>
  `,
  styles: [`
        .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-8);
      gap: var(--spacing-4);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-5);
    }

    .page-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      :deep(svg) {
        width: 36px;
        height: 36px;
      }
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .page-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .page-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-icon {
        width: 56px;
        height: 56px;

        :deep(svg) {
          width: 28px;
          height: 28px;
        }
      }

      .page-title {
        font-size: var(--font-size-3xl);
      }

      .header-right {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class PageHeaderComponent {
  title = input<string>('');
  description = input<string>('');
  icon = input<string>('');
  iconBg = input<string>('#EFF6FF');
}