import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      @if (title() || subtitle()) {
        <div class="card-header">
          @if (title()) {
            <h3 class="card-title">{{ title() }}</h3>
          }
          @if (subtitle()) {
            <p class="card-subtitle">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="card-body" [class.no-padding]="noPadding()">
        <ng-content />
      </div>
      @if (hasFooter()) {
        <div class="card-footer">
          <ng-content select="[slot=footer]" />
        </div>
      }
    </div>
  `,
  styles: [`
        .card {
      background: var(--bg-card);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--bg-border);
      transition: all var(--transition-normal);
      overflow: hidden;

      &:hover {
        box-shadow: var(--shadow-card)-hover;
      }

      &.hoverable:hover {
        transform: translateY(-4px);
      }

      &.no-padding {
        .card-body {
          padding: 0;
        }
      }
    }

    .card-header {
      padding: var(--spacing-6) var(--spacing-6);
      border-bottom: 1px solid var(--bg-border);
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-1) 0;
    }

    .card-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .card-body {
      padding: var(--spacing-6) var(--spacing-6);
    }

    .card-footer {
      padding: var(--spacing-5) var(--spacing-6);
      border-top: 1px solid var(--bg-border);
      background: rgba(var(--bg-main), 0.3);
    }

    @media (max-width: 768px) {
      .card-header,
      .card-body,
      .card-footer {
        padding: var(--spacing-4);
      }
    }
  `]
})
export class CardComponent {
  title = input<string>('');
  subtitle = input<string>('');
  hoverable = input(true);
  noPadding = input(false);
  hasFooter = input(false);
  paddingSize = input<'sm' | 'md' | 'lg'>('lg');

  cardClasses(): string {
    const classes = ['card'];
    if (this.hoverable()) {
      classes.push('hoverable');
    }
    if (this.noPadding()) {
      classes.push('no-padding');
    }
    return classes.join(' ');
  }
}